const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

dotenv.config();
const app = express();

/**
 * 1. SECURE CORS CONFIGURATION
 * Restricts access to your specific frontend and local development environment.
 */
const allowedOrigins = [
  "https://hr-ms-frontend-ten.vercel.app",
  "http://localhost:5173"
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin) || !origin) {
    res.header("Access-Control-Allow-Origin", origin || "*");
  }
  
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.status(200).send();
  }
  next();
});

/**
 * 2. MIDDLEWARE
 */
app.use(express.json());

/**
 * 3. HEALTH & STATUS ROUTES
 */
app.get('/', (req, res) => res.status(200).send('HRMS API: Online'));
app.get('/api/health', (req, res) => res.status(200).json({ status: 'active', timestamp: new Date() }));

/**
 * 4. APPLICATION ROUTES
 */
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/leaves', require('./routes/leaveRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

/**
 * 5. ERROR & 404 HANDLERS
 */
app.use((req, res) => {
  res.status(404).json({ message: 'Resource not found', path: req.originalUrl });
});

/**
 * 6. SERVER INITIALIZATION
 */
const PORT = process.env.PORT || 10000;

const startServer = async () => {
  try {
    console.log('[INIT] Connecting to Database...');
    await connectDB();

    // Seed Admin if not exists
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

      console.log('[INIT] Admin user seeded');
    }
  } catch (error) {
    console.error('[INIT] Startup Error:', error.message);
  }
};

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SERVER] HRMS Backend active on port ${PORT}`);
    startServer();
  });
}

module.exports = app;