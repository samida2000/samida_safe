require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');

// تهيئة التطبيق
const app = express();
app.use(express.json());

// اتصال آمن بقاعدة البيانات
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? true : { 
    rejectUnauthorized: false 
  }
});

// اختبار الاتصال التلقائي
pool.connect()
  .then(client => {
    console.log('✅ تم الاتصال بقاعدة البيانات بنجاح');
    client.release();
  })
  .catch(err => {
    console.error('❌ فشل الاتصال:', err.message);
    console.log('⏳ جارٍ إعادة المحاولة...');
  });

// مسار رئيسي للاختبار
app.get('/', (req, res) => {
  res.json({
    status: 'نشط',
    message: 'مرحبًا بك في Samida Safe API',
    database: 'متصل'
  });
});

// بدء الخادم
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`
  ██████╗ █████╗ ███╗   ███╗██╗██████╗  █████╗ 
  ██╔══██╗██╔══██╗████╗ ████║██║██╔══██╗██╔══██╗
  ██████╔╝███████║██╔████╔██║██║██║  ██║███████║
  ██╔═══╝ ██╔══██║██║╚██╔╝██║██║██║  ██║██╔══██║
  ██║     ██║  ██║██║ ╚═╝ ██║██║██████╔╝██║  ██║
  ╚═╝     ╚═╝  ╚═╝╚═╝     ╚═╝╚═╝╚═════╝ ╚═╝  ╚═╝
  
  🚀 الخادم يعمل على: http://localhost:${PORT}
  `);
});