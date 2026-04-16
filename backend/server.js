const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

dotenv.config();
const app = express();



// 1. UNIFIED CORS & PREFLIGHT (Failsafe)
app.use((req, res, next) => {
  const allowedOrigin = "https://hr-ms-frontend-ten.vercel.app";
  const origin = req.headers.origin;
  
  if (origin === allowedOrigin || !origin) {
    res.header("Access-Control-Allow-Origin", origin || "*");
  }
  
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    console.log(`[CORS] Preflight handled for: ${req.originalUrl}`);
    return res.status(200).send();
  }
  next();
});

// 2. DIAGNOSTIC REQUEST LOGGING
app.use((req, res, next) => {
  console.log(`[HIT] ${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// 3. CORE MIDDLEWARE
app.use(express.json());

// 4. HEALTH/DIAGNOSTIC ROUTES
app.get('/', (req, res) => res.status(200).send('SERVER STATUS: ALIVE AND RUNNING'));
app.get('/api/health', (req, res) => res.status(200).json({ status: 'active', time: new Date() }));

// ✅ 5. Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/leaves', require('./routes/leaveRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// ✅ 6. 404 handler
app.use((req, res) => {
  console.error(`404 - Not Found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    message: 'Route not found',
    method: req.method,
    url: req.originalUrl
  });
});

// ✅ 7. Server Start
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    console.log('Connecting to Database...');
    await connectDB();

    // Seed Admin
    const adminExists = await User.findOne({ email: 'admin@hrms.com' });
    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);

      await User.create({
        fullName: 'System Admin',
        email: 'admin@hrms.com',
        password: hashedPassword,
        role: 'admin'
      });

      console.log('Admin user seeded');
    }
  } catch (error) {
    console.error('Startup Error:', error.message);
  }
};

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    startServer();
  });
}

module.exports = app;