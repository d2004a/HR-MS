const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();


// ✅ CORS (FINAL FIX)
app.use(cors({
  origin: "https://hr-ms-frontend-ten.vercel.app",
  credentials: true
}));

// ✅ HANDLE PREFLIGHT (VERY IMPORTANT)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://hr-ms-frontend-ten.vercel.app");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

// ✅ Middleware
app.use(express.json());

// ✅ Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/leaves', require('./routes/leaveRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// ✅ Basic route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// ✅ Seed Admin User
const seedAdmin = async () => {
    try {
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

            console.log('Admin user seeded successfully');
        }
    } catch (error) {
        console.error('Error seeding admin:', error.message);
    }
};

// ✅ Seed once
if (process.env.NODE_ENV !== 'test') {
    seedAdmin();
}

const PORT = process.env.PORT || 5000;

// ✅ Start server
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;