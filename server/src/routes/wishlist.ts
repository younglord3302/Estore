import express from "express";
import { prisma } from "../index";
import { authenticateToken, AuthRequest } from "../middleware/auth";

const router = express.Router();

// All wishlist routes require authentication
router.use(authenticateToken);

/**
 * @swagger
 * /api/wishlist:
 *   get:
 *     summary: Get user's wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User's wishlist
 */
router.get("/", async (req: AuthRequest, res) => {
  const wishlist = await prisma.wishlist.findUnique({
    where: { userId: req.user!.id },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!wishlist) {
    // Create empty wishlist if doesn't exist
    const newWishlist = await prisma.wishlist.create({
      data: { userId: req.user!.id },
      include: { items: { include: { product: true } } },
    });
    return res.json(newWishlist);
  }

  res.json(wishlist);
});

/**
 * @swagger
 * /api/wishlist/items:
 *   post:
 *     summary: Add item to wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *             properties:
 *               productId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Item added to wishlist
 */
router.post("/items", async (req: AuthRequest, res) => {
  const { productId } = req.body;

  // Ensure wishlist exists
  let wishlist = await prisma.wishlist.findUnique({
    where: { userId: req.user!.id },
  });
  if (!wishlist) {
    wishlist = await prisma.wishlist.create({ data: { userId: req.user!.id } });
  }

  // Check if item already exists
  const existingItem = await prisma.wishlistItem.findUnique({
    where: {
      wishlistId_productId: {
        wishlistId: wishlist.id,
        productId,
      },
    },
  });

  if (existingItem) {
    return res.status(400).json({ message: "Item already in wishlist" });
  }

  // Create new item
  const newItem = await prisma.wishlistItem.create({
    data: {
      wishlistId: wishlist.id,
      productId,
    },
    include: { product: true },
  });

  res.status(201).json(newItem);
});

/**
 * @swagger
 * /api/wishlist/items/{productId}:
 *   delete:
 *     summary: Remove item from wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Item removed from wishlist
 */
router.delete("/items/:productId", async (req: AuthRequest, res) => {
  const { productId } = req.params;

  const wishlist = await prisma.wishlist.findUnique({
    where: { userId: req.user!.id },
  });
  if (!wishlist) {
    return res.status(404).json({ message: "Wishlist not found" });
  }

  await prisma.wishlistItem.deleteMany({
    where: {
      wishlistId: wishlist.id,
      productId,
    },
  });

  res.status(204).send();
});

/**
 * @swagger
 * /api/wishlist:
 *   delete:
 *     summary: Clear wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Wishlist cleared
 */
router.delete("/", async (req: AuthRequest, res) => {
  const wishlist = await prisma.wishlist.findUnique({
    where: { userId: req.user!.id },
  });
  if (wishlist) {
    await prisma.wishlistItem.deleteMany({
      where: { wishlistId: wishlist.id },
    });
  }

  res.status(204).send();
});

export default router;
