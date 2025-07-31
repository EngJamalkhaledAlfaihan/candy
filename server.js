const express = require('express');
require('dotenv').config();
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const servicesRoute = require('./routes/services');
const bookingsRoute = require('./routes/bookings');
const paymentsRoute = require('./routes/payments');
const cors = require('cors');

dotenv.config();

const app = express();

// وصلات
app.use(cors());
app.use(express.json());

// توصيل قاعدة البيانات
connectDB();

// المسارات
app.use('/api/services', servicesRoute);
app.use('/api/bookings', bookingsRoute);
app.use('/api/payments', paymentsRoute);
// اختبار
app.get('/', (req, res) => {
  res.send('مرحبًا بكم في واجهة Candy Maids API');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 الخادم يعمل على المنفذ ${PORT}`);
});