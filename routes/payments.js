const express = require('express');
require('dotenv').config();
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// POST /api/payments/create-intent
router.post('/create-intent', async (req, res) => {
  const { amount, currency = 'usd', bookingId } = req.body;

  if (!amount || !bookingId) {
    return res.status(400).json({ error: 'المبلغ أو معرف الحجز مفقود' });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // بالسنتات
      currency: currency,
      metadata: { bookingId: bookingId },
      automatic_payment_methods: { enabled: true },
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (err) {
    console.error('خطأ في إنشاء PaymentIntent:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;