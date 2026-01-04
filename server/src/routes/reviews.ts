import express from "express";
import { prisma } from "../index";
import { authenticateToken, AuthRequest } from "../middleware/auth";

const router = express.Router();

// All review routes require authentication
router.use(authenticateToken);

/**
 * @swagger
 * /api/reviews:
 *   get:
 *     summary: Get user's reviews
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's reviews
 */
router.get("/", async (req: AuthRequest, res) => {
  const reviews = await prisma.review.findMany({
    where: { userId: req.user!.id },
    include: {
      product: true,
    },
    orderBy: { createdAt: "desc" },
  });

  res.json(reviews);
});

/**
 * @swagger
 * /api/reviews/products/{productId}:
 *   get:
 *     summary: Get reviews for a product
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of reviews for the product
 */
router.get("/products/:productId", async (req, res) => {
  const { productId } = req.params;

  const reviews = await prisma.review.findMany({
    where: { productId },
    include: {
      user: {
        select: { id: true, name: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  res.json(reviews);
});

/**
 * @swagger
 * /api/reviews:
 *   post:
 *     summary: Create a new review
 *     tags: [Reviews]
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
 *               - rating
 *             properties:
 *               productId:
 *                 type: string
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Review created
 */
router.post("/", async (req: AuthRequest, res) => {
  const { productId, rating, comment } = req.body;

  // Check if user already reviewed this product
  const existingReview = await prisma.review.findUnique({
    where: {
      userId_productId: {
        userId: req.user!.id,
        productId,
      },
    },
  });

  if (existingReview) {
    return res
      .status(400)
      .json({ message: "You have already reviewed this product" });
  }

  const review = await prisma.review.create({
    data: {
      userId: req.user!.id,
      productId,
      rating,
      comment,
    },
    include: {
      product: true,
      user: {
        select: { id: true, name: true },
      },
    },
  });

  res.status(201).json(review);
});

/**
 * @swagger
 * /api/reviews/{id}:
 *   put:
 *     summary: Update review
 *     tags: [Reviews]
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
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *     responses:
 *       200:
 *         description: Review updated
 */
router.put("/:id", async (req: AuthRequest, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;

  const review = await prisma.review.findFirst({
    where: {
      id,
      userId: req.user!.id,
    },
  });

  if (!review) {
    return res.status(404).json({ message: "Review not found" });
  }

  const updatedReview = await prisma.review.update({
    where: { id },
    data: { rating, comment },
    include: {
      product: true,
      user: {
        select: { id: true, name: true },
      },
    },
  });

  res.json(updatedReview);
});

/**
 * @swagger
 * /api/reviews/{id}:
 *   delete:
 *     summary: Delete review
 *     tags: [Reviews]
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
 *         description: Review deleted
 */
router.delete("/:id", async (req: AuthRequest, res) => {
  const { id } = req.params;

  const review = await prisma.review.findFirst({
    where: {
      id,
      userId: req.user!.id,
    },
  });

  if (!review) {
    return res.status(404).json({ message: "Review not found" });
  }

  await prisma.review.delete({ where: { id } });

  res.status(204).send();
});

export default router;
