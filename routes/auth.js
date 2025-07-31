const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const admins = [
  { id: '1', email: 'admin@candymaids.com', password: 'admin123', role: 'admin' }
]; // في الإنتاج: استخدم قاعدة بيانات

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  const admin = admins.find(a => a.email === email && a.password === password);

  if (admin) {
    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      admin: { id: admin.id, email: admin.email, role: admin.role }
    });
  } else {
    res.status(401).json({ message: 'البريد أو كلمة المرور غير صحيحة' });
  }
});

module.exports = router;