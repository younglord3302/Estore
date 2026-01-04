import express from "express";
import { prisma } from "../index";
import {
  authenticateToken,
  AuthRequest,
  requireRole,
} from "../middleware/auth";

const router = express.Router();

// All analytics routes require authentication and admin role
router.use(authenticateToken, requireRole(["ADMIN"]));

/**
 * @swagger
 * /api/analytics/sales:
 *   get:
 *     summary: Get sales analytics (Admin only)
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sales analytics data
 */
router.get("/sales", async (req: AuthRequest, res) => {
  // Total sales
  const totalSales = await prisma.order.aggregate({
    _sum: {
      total: true,
    },
  });

  // Total orders
  const totalOrders = await prisma.order.count();

  // Sales by month (last 12 months)
  const salesByMonth = await prisma.$queryRaw`
    SELECT
      DATE_TRUNC('month', "createdAt") as month,
      SUM(total) as revenue,
      COUNT(*) as orders
    FROM "Order"
    WHERE "createdAt" >= NOW() - INTERVAL '12 months'
    GROUP BY DATE_TRUNC('month', "createdAt")
    ORDER BY month DESC
  `;

  // Top selling products
  const topProducts = await prisma.orderItem.groupBy({
    by: ["productId"],
    _sum: {
      quantity: true,
    },
    orderBy: {
      _sum: {
        quantity: "desc",
      },
    },
    take: 10,
  });

  // Get product details for top products
  const productIds = topProducts.map((item) => item.productId);
  const products = await prisma.product.findMany({
    where: {
      id: {
        in: productIds,
      },
    },
    select: {
      id: true,
      name: true,
    },
  });

  const topSellingProducts = topProducts.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    return {
      productId: item.productId,
      name: product?.name || "Unknown",
      totalSold: item._sum.quantity || 0,
    };
  });

  // Recent orders
  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        select: { name: true, email: true },
      },
    },
  });

  res.json({
    totalSales: totalSales._sum.total || 0,
    totalOrders,
    salesByMonth,
    topSellingProducts,
    recentOrders,
  });
});

export default router;
