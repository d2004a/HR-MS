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


// ✅ Improved CORS Configuration
const allowedOrigins = [
  "https://hr-ms-frontend-ten.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000"
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
}));

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