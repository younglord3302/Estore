import express from "express";
import Stripe from "stripe";
import { prisma } from "../index";
import { authenticateToken, AuthRequest } from "../middleware/auth";

const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// All payment routes require authentication
router.use(authenticateToken);

/**
 * @swagger
 * /api/payments/create-session:
 *   post:
 *     summary: Create Stripe checkout session
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderId
 *             properties:
 *               orderId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Stripe checkout session created
 */
router.post("/create-session", async (req: AuthRequest, res) => {
  const { orderId } = req.body;

  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      userId: req.user!.id,
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: order.items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.product.name,
          description: item.product.description || undefined,
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    })),
    mode: "payment",
    success_url: `${
      process.env.CLIENT_URL || "http://localhost:3000"
    }/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.CLIENT_URL || "http://localhost:3000"}/cancel`,
    metadata: {
      orderId: order.id,
    },
  });

  res.json({ sessionId: session.id, url: session.url });
});

/**
 * @swagger
 * /api/payments/webhook:
 *   post:
 *     summary: Stripe webhook handler
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Webhook processed
 */
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"] as string;
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err: any) {
      console.log(`Webhook signature verification failed.`, err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object as Stripe.Checkout.Session;
        const orderId = session.metadata?.orderId;

        if (orderId) {
          // Update order status and create payment record
          await prisma.order.update({
            where: { id: orderId },
            data: { status: "PROCESSING" },
          });

          await prisma.payment.create({
            data: {
              orderId,
              stripePaymentId: session.id,
              amount: session.amount_total! / 100, // Convert from cents
              status: "SUCCEEDED",
            },
          });
        }
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  }
);

export default router;
