const express = require('express');
const router = express.Router();
const Service = require('../models/Service');

// GET /api/services - جلب جميع الخدمات
router.get('/', async (req, res) => {
  try {
    const services = await Service.find().select('name description price durationMinutes imageUrl');
    res.json(services);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
});

module.exports = router;