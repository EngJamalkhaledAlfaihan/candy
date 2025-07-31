const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const admins = [
  { id: '1', email: 'admin@candymaids.com', password: 'admin123', role: 'admin' }
]; // في الإنتاج: استخدم قاعدة بيانات

router.post('/login', (req, res) => {
  try {
    console.log('🔐 محاولة تسجيل دخول:', req.body);
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'البريد الإلكتروني وكلمة المرور مطلوبان' });
    }

    const admin = admins.find(a => a.email === email && a.password === password);

    if (admin) {
      if (!process.env.JWT_SECRET) {
        console.error('❌ JWT_SECRET غير موجود!');
        return res.status(500).json({ message: 'خطأ في إعدادات الخادم' });
      }

      const token = jwt.sign(
        { id: admin.id, email: admin.email, role: admin.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      console.log('✅ تم تسجيل الدخول بنجاح:', email);
      res.json({
        token,
        admin: { id: admin.id, email: admin.email, role: admin.role }
      });
    } else {
      console.log('❌ بيانات دخول خاطئة:', email);
      res.status(401).json({ message: 'البريد أو كلمة المرور غير صحيحة' });
    }
  } catch (error) {
    console.error('❌ خطأ في تسجيل الدخول:', error);
    res.status(500).json({ message: 'خطأ داخلي في الخادم' });
  }
});

module.exports = router;