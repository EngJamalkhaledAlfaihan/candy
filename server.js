const express = require('express');
require('dotenv').config();
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const servicesRoute = require('./routes/services');
const bookingsRoute = require('./routes/bookings');
const paymentsRoute = require('./routes/payments');
const authRoute = require('./routes/auth');
const cors = require('cors');

dotenv.config();

const app = express();

// إعدادات CORS
const corsOptions = {
  origin: function (origin, callback) {
    // السماح للتطبيقات المحمولة (بدون origin) والمصادر المحددة
    const allowedOrigins = [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'https://candy-maids-api.onrender.com'
    ];
    
    // السماح للتطبيقات المحمولة (التي لا ترسل origin)
    if (!origin) return callback(null, true);
    
    // السماح في التطوير لجميع المصادر
    if (process.env.NODE_ENV === 'development') return callback(null, true);
    
    // في الإنتاج: فحص المصادر المسموحة
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('غير مسموح بواسطة CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

app.use(cors(corsOptions));
app.use(express.json());

// إضافة معالج OPTIONS للطلبات المسبقة
app.options('*', cors(corsOptions));

// توصيل قاعدة البيانات
connectDB();

// المسارات
app.use('/api/services', servicesRoute);
app.use('/api/bookings', bookingsRoute);
app.use('/api/payments', paymentsRoute);
app.use('/api/auth', authRoute);
// اختبار
app.get('/', (req, res) => {
  res.send('مرحبًا بكم في واجهة Candy Maids API');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 الخادم يعمل على المنفذ ${PORT}`);
});