import express from "express";
import cloudinary from "cloudinary";
import { authenticateToken, AuthRequest } from "../middleware/auth";

const router = express.Router();

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// All upload routes require authentication
router.use(authenticateToken);

/**
 * @swagger
 * /api/upload/signature:
 *   post:
 *     summary: Get Cloudinary upload signature
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - folder
 *             properties:
 *               folder:
 *                 type: string
 *                 description: Cloudinary folder to upload to
 *     responses:
 *       200:
 *         description: Upload signature generated
 */
router.post("/signature", async (req: AuthRequest, res) => {
  const { folder = "ecommerce" } = req.body;

  const timestamp = Math.round(new Date().getTime() / 1000);

  const signature = cloudinary.v2.utils.api_sign_request(
    {
      timestamp,
      folder,
      upload_preset: "ecommerce_preset", // You might want to create this preset in Cloudinary
    },
    process.env.CLOUDINARY_API_SECRET!
  );

  res.json({
    signature,
    timestamp,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    folder,
  });
});

export default router;
