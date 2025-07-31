const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const Service = require("../models/Service");
const { protect, adminOnly } = require("../middleware/authMiddleware");

//POST /api/bookings - انشاء حجز جديد

router.post("/", async (req, res) => {
  const { serviceId, date, time, notes } = req.body;

  try {
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: "service not found" });
    }
    const totalPrice = service.price;
    const newbooking = new Booking({
      serviceId,
      date,
      time,
      totalPrice,
      notes,
    });
    const savedBooking = await newbooking.save();
    res.status(201).json(savedBooking);
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ message: "internal server error" });
  }
});
//GET /api/bookings - احضار جميع الحجوزات للأدمن
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    console.log('📋 جاري جلب جميع الحجوزات للأدمن');
    const bookings = await Booking.find()
      .populate("serviceId", "name imageUrl")
      .sort({ createdAt: -1 });
    
    console.log(`✅ تم جلب ${bookings.length} حجز`);
    res.json(bookings);
  } catch (error) {
    console.error('❌ خطأ في جلب الحجوزات:', error);
    res.status(500).json({ message: error.message });
  }
});

//GET /api/bookings/user/:userId - احضار جميع الحجوزات للمستخدم
router.get("/user/:userId", async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.params.userId })
      .populate("serviceId", "name imageUrl")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// PUT /api/bookings/:id/status
router.put('/:id/status', protect, adminOnly, async (req, res) => {
  const { status } = req.body;
  const allowedStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ message: 'حالة غير صالحة' });
  }

  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: 'الحجز غير موجود' });
    }

    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;
