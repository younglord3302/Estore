import express from "express";
import { prisma } from "../index";
import {
  authenticateToken,
  requireRole,
  AuthRequest,
} from "../middleware/auth";

const router = express.Router();

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [name_asc, name_desc, price_asc, price_desc, createdAt_desc]
 *           default: createdAt_desc
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: List of products
 */
router.get("/", async (req, res) => {
  const {
    category,
    search,
    sort = "createdAt_desc",
    page = 1,
    limit = 10,
  } = req.query;

  const where: any = {};

  if (category) {
    where.categoryId = category;
  }

  if (search) {
    where.OR = [
      { name: { contains: search as string, mode: "insensitive" } },
      { description: { contains: search as string, mode: "insensitive" } },
    ];
  }

  const orderBy: any = {};
  switch (sort) {
    case "name_asc":
      orderBy.name = "asc";
      break;
    case "name_desc":
      orderBy.name = "desc";
      break;
    case "price_asc":
      orderBy.price = "asc";
      break;
    case "price_desc":
      orderBy.price = "desc";
      break;
    case "createdAt_desc":
    default:
      orderBy.createdAt = "desc";
      break;
  }

  const products = await prisma.product.findMany({
    where,
    include: {
      category: true,
      _count: {
        select: { reviews: true },
      },
    },
    orderBy,
    skip: (Number(page) - 1) * Number(limit),
    take: Number(limit),
  });

  const total = await prisma.product.count({ where });

  res.json({
    products,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit)),
    },
  });
});

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product details
 */
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      reviews: {
        include: {
          user: {
            select: { id: true, name: true },
          },
        },
      },
      _count: {
        select: { reviews: true },
      },
    },
  });

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json(product);
});

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product (Admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - categoryId
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               imageUrl:
 *                 type: string
 *               stock:
 *                 type: integer
 *               categoryId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Product created
 */
router.post(
  "/",
  authenticateToken,
  requireRole(["ADMIN"]),
  async (req: AuthRequest, res) => {
    const { name, description, price, imageUrl, stock, categoryId } = req.body;

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        imageUrl,
        stock,
        categoryId,
      },
      include: {
        category: true,
      },
    });

    res.status(201).json(product);
  }
);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update product (Admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               imageUrl:
 *                 type: string
 *               stock:
 *                 type: integer
 *               categoryId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Product updated
 */
router.put(
  "/:id",
  authenticateToken,
  requireRole(["ADMIN"]),
  async (req: AuthRequest, res) => {
    const { id } = req.params;
    const { name, description, price, imageUrl, stock, categoryId } = req.body;

    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        price,
        imageUrl,
        stock,
        categoryId,
      },
      include: {
        category: true,
      },
    });

    res.json(product);
  }
);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete product (Admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Product deleted
 */
router.delete(
  "/:id",
  authenticateToken,
  requireRole(["ADMIN"]),
  async (req: AuthRequest, res) => {
    const { id } = req.params;

    await prisma.product.delete({ where: { id } });

    res.status(204).send();
  }
);

export default router;
