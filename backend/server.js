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


// ✅ Debugging Middleware: Log all requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl} - Origin: ${req.headers.origin}`);
  next();
});

// ✅ Permissive CORS for Debugging
app.use(cors({
  origin: true, // Allow all origins during debugging
  credentials: true,
  optionsSuccessStatus: 200
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

// ✅ 404 Catch-all for Debugging
app.use((req, res) => {
    console.error(`404 - Not Found: ${req.method} ${req.originalUrl}`);
    res.status(404).json({ 
        message: 'Route not found', 
        method: req.method, 
        url: req.originalUrl 
    });
});

// ✅ Global Error Handler
app.use((err, req, res, next) => {
    console.error('SERVER ERROR:', err.stack);
    res.status(500).json({ 
        message: 'Server Error', 
        error: err.message,
        path: req.originalUrl
    });
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