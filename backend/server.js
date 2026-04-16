const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

dotenv.config();
const app = express();

app.options('*', (req, res) => {
  res.header("Access-Control-Allow-Origin", "https://hr-ms-frontend-ten.vercel.app");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  return res.sendStatus(200);
});


// ✅ 1. CORS (ONLY THIS — no manual headers)
app.use(cors({
  origin: "https://hr-ms-frontend-ten.vercel.app",
  credentials: true,
  
}));

// ✅ 2. Handle preflight globally
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// ✅ 3. Middleware
app.use(express.json());

// ✅ 4. Health Check
app.get('/', (req, res) => {
  res.send('API is running...');
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'active', time: new Date() });
});

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