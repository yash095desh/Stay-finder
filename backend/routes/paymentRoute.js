const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Booking = require("../modals/bookings");

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_zlY712k5PqNRAr",
  key_secret: process.env.RAZORPAY_SECRET || "Td7LoZ7V4V5SI8qNamVEjEA0",
});


router.post("/create-order", async(req, res) =>{
  try {
    const { amount, bookingId } = req.body;

    const options = {
      amount: amount * 100, // paise
      currency: "INR",
      receipt: `receipt_order_${bookingId}`,
      payment_capture: 1, // auto capture
      notes: {
            bookingId, // send this for use in webhook
        },
    };

    const order = await razorpay.orders.create(options);
    res.json({ success: true, order });
  } catch (err) {
    console.error("Create Razorpay order failed", err);
    res.status(500).json({ success: false, message: "Razorpay order failed" });
  }
})


router.post("/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET || "thisIsAStrongSecret";
  const signature = req.headers["x-razorpay-signature"];

    // Use raw body (not parsed)
    const rawBody = req.body; // raw Buffer

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(rawBody)
      .digest("hex");

    if (expectedSignature !== signature) {
      console.log("🔴 Signature mismatch");
      return res.status(400).send("Invalid signature");
    }

    try {
      const payload = JSON.parse(rawBody.toString());

      if (payload.event === "payment.captured") {
        const payment = payload.payload.payment.entity;
        const bookingId = payment.notes?.bookingId;

        if (!bookingId) {
          return res
            .status(400)
            .json({ success: false, message: "Booking ID missing" });
        }

        await Booking.findByIdAndUpdate(bookingId, { status: "confirmed" });

        return res
          .status(200)
          .json({ success: true, message: "Booking confirmed" });
      }

      res.status(200).send("Webhook received");
    } catch (err) {
      console.error("Webhook error:", err);
      res.status(500).send("Webhook server error");
    }
});





module.exports = router;