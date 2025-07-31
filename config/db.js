const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ تم الاتصال بقاعدة بيانات MongoDB');
  } catch (err) {
    console.error('❌ خطأ في الاتصال بـ MongoDB:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;