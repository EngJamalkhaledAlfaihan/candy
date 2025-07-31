const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// GET /api/services - جلب جميع الخدمات
router.get('/', async (req, res) => {
  try {
    console.log('🔍 جاري جلب جميع الخدمات');
    const services = await Service.find().select('name description price durationMinutes imageUrl');
    console.log(`✅ تم جلب ${services.length} خدمة`);
    res.json(services);
  } catch (err) {
    console.error('❌ خطأ في جلب الخدمات:', err);
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
});

// POST /api/services - إضافة خدمة جديدة (للأدمن فقط)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    console.log('➕ جاري إضافة خدمة جديدة:', req.body);
    const { name, description, price, duration, imageUrl } = req.body;

    if (!name || !description || !price || !duration) {
      return res.status(400).json({ message: 'جميع الحقول مطلوبة' });
    }

    const newService = new Service({
      name,
      description,
      price: parseFloat(price),
      durationMinutes: parseInt(duration),
      imageUrl: imageUrl || `https://via.placeholder.com/300x200?text=${encodeURIComponent(name)}`
    });

    const savedService = await newService.save();
    console.log('✅ تم إنشاء الخدمة بنجاح:', savedService._id);
    res.status(201).json(savedService);
  } catch (err) {
    console.error('❌ خطأ في إضافة الخدمة:', err);
    res.status(500).json({ message: 'خطأ في إضافة الخدمة' });
  }
});

// PUT /api/services/:id - تحديث خدمة (للأدمن فقط)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    console.log(`📝 جاري تحديث الخدمة ${req.params.id}:`, req.body);
    const { name, description, price, duration, imageUrl } = req.body;

    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        price: parseFloat(price),
        durationMinutes: parseInt(duration),
        imageUrl
      },
      { new: true, runValidators: true }
    );

    if (!updatedService) {
      return res.status(404).json({ message: 'الخدمة غير موجودة' });
    }

    console.log('✅ تم تحديث الخدمة بنجاح');
    res.json(updatedService);
  } catch (err) {
    console.error('❌ خطأ في تحديث الخدمة:', err);
    res.status(500).json({ message: 'خطأ في تحديث الخدمة' });
  }
});

// DELETE /api/services/:id - حذف خدمة (للأدمن فقط)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    console.log(`🗑️ جاري حذف الخدمة ${req.params.id}`);
    
    const deletedService = await Service.findByIdAndDelete(req.params.id);
    
    if (!deletedService) {
      return res.status(404).json({ message: 'الخدمة غير موجودة' });
    }

    console.log('✅ تم حذف الخدمة بنجاح');
    res.json({ message: 'تم حذف الخدمة بنجاح' });
  } catch (err) {
    console.error('❌ خطأ في حذف الخدمة:', err);
    res.status(500).json({ message: 'خطأ في حذف الخدمة' });
  }
});

// GET /api/services/:id - جلب خدمة واحدة
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    
    if (!service) {
      return res.status(404).json({ message: 'الخدمة غير موجودة' });
    }

    res.json(service);
  } catch (err) {
    console.error('❌ خطأ في جلب الخدمة:', err);
    res.status(500).json({ message: 'خطأ في جلب الخدمة' });
  }
});

module.exports = router;