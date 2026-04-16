const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

// 1. Initial Load of Environment Variables
dotenv.config({ path: path.join(__dirname, 'backend', '.env') });

// 2. Import logic from backend folder (but run from root)
const connectDB = require('./backend/config/db');
const User = require('./backend/models/User');
const bcrypt = require('bcryptjs');

const app = express();

/**
 * 3. ABSOLUTE FIRST MIDDLEWARE - Unified CORS & Preflight
 */
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    console.log(`[DEBUG-OPTIONS] Headers: ${JSON.stringify(req.headers)}`);
    return res.status(200).send();
  }
  next();
});

/**
 * 4. Diagnostics & Middleware
 */
app.use((req, res, next) => {
  console.log(`[ROOT-HIT] ${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});
app.use(express.json());

/**
 * 5. Health Routes
 */
app.get('/test-v5', (req, res) => res.status(200).send('V5 CONNECTIVITY: SUCCESS'));
app.get('/', (req, res) => res.status(200).send('HRMS ROOT SERVER: DEPLOYED AND ALIVE'));
app.get('/api/health', (req, res) => res.status(200).json({ status: 'active', entry: 'root' }));

/**
 * 6. Application Routes (Delegated to backend folder)
 */
app.use('/api/auth', require('./backend/routes/authRoutes'));
app.use('/api/leaves', require('./backend/routes/leaveRoutes'));
app.use('/api/attendance', require('./backend/routes/attendanceRoutes'));
app.use('/api/admin', require('./backend/routes/adminRoutes'));

/**
 * 7. Global 404 handler
 */
app.use((req, res) => {
  console.error(`[ROOT-404] ${req.method} ${req.url}`);
  res.status(404).json({ message: 'Path not found by root server', url: req.url });
});

/**
 * 8. Server Start
 */
const PORT = process.env.PORT || 10000;

const startServer = async () => {
  try {
    console.log('[ROOT-INIT] Connecting to Database...');
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
      console.log('[ROOT-INIT] Admin user seeded');
    }
  } catch (error) {
    console.error('[ROOT-INIT] Database Error:', error.message);
  }
};

app.listen(PORT, '0.0.0.0', () => {
    console.log(`[ROOT-SERVER] Listening on port ${PORT}`);
    startServer();
});
