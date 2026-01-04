import express from "express";
import { prisma } from "../index";
import { authenticateToken, AuthRequest } from "../middleware/auth";

const router = express.Router();

// All cart routes require authentication
router.use(authenticateToken);

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Get user's cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User's cart
 */
router.get("/", async (req: AuthRequest, res) => {
  const cart = await prisma.cart.findUnique({
    where: { userId: req.user!.id },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!cart) {
    // Create empty cart if doesn't exist
    const newCart = await prisma.cart.create({
      data: { userId: req.user!.id },
      include: { items: { include: { product: true } } },
    });
    return res.json(newCart);
  }

  res.json(cart);
});

/**
 * @swagger
 * /api/cart/items:
 *   post:
 *     summary: Add item to cart
 *     tags: [Cart]
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
 *               - quantity
 *             properties:
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *     responses:
 *       201:
 *         description: Item added to cart
 */
router.post("/items", async (req: AuthRequest, res) => {
  const { productId, quantity } = req.body;

  // Ensure cart exists
  let cart = await prisma.cart.findUnique({ where: { userId: req.user!.id } });
  if (!cart) {
    cart = await prisma.cart.create({ data: { userId: req.user!.id } });
  }

  // Check if item already exists
  const existingItem = await prisma.cartItem.findUnique({
    where: {
      cartId_productId: {
        cartId: cart.id,
        productId,
      },
    },
  });

  if (existingItem) {
    // Update quantity
    const updatedItem = await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + quantity },
      include: { product: true },
    });
    return res.json(updatedItem);
  }

  // Create new item
  const newItem = await prisma.cartItem.create({
    data: {
      cartId: cart.id,
      productId,
      quantity,
    },
    include: { product: true },
  });

  res.status(201).json(newItem);
});

/**
 * @swagger
 * /api/cart/items/{productId}:
 *   put:
 *     summary: Update cart item quantity
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: integer
 *                 minimum: 0
 *     responses:
 *       200:
 *         description: Cart item updated
 */
router.put("/items/:productId", async (req: AuthRequest, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;

  const cart = await prisma.cart.findUnique({
    where: { userId: req.user!.id },
  });
  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  if (quantity <= 0) {
    // Remove item
    await prisma.cartItem.deleteMany({
      where: {
        cartId: cart.id,
        productId,
      },
    });
    return res.status(204).send();
  }

  const updatedItem = await prisma.cartItem.updateMany({
    where: {
      cartId: cart.id,
      productId,
    },
    data: { quantity },
  });

  if (updatedItem.count === 0) {
    return res.status(404).json({ message: "Item not found in cart" });
  }

  const item = await prisma.cartItem.findFirst({
    where: {
      cartId: cart.id,
      productId,
    },
    include: { product: true },
  });

  res.json(item);
});

/**
 * @swagger
 * /api/cart/items/{productId}:
 *   delete:
 *     summary: Remove item from cart
 *     tags: [Cart]
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
 *         description: Item removed from cart
 */
router.delete("/items/:productId", async (req: AuthRequest, res) => {
  const { productId } = req.params;

  const cart = await prisma.cart.findUnique({
    where: { userId: req.user!.id },
  });
  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  await prisma.cartItem.deleteMany({
    where: {
      cartId: cart.id,
      productId,
    },
  });

  res.status(204).send();
});

/**
 * @swagger
 * /api/cart:
 *   delete:
 *     summary: Clear cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Cart cleared
 */
router.delete("/", async (req: AuthRequest, res) => {
  const cart = await prisma.cart.findUnique({
    where: { userId: req.user!.id },
  });
  if (cart) {
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  }

  res.status(204).send();
});

export default router;
