const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const request = require('supertest');
const app = require('../server');
const User = require('../models/User');
const Leave = require('../models/Leave');

let mongoServer;
let employeeToken;
let adminToken;
let employeeId;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    
    // Close existing connection if any
    if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
    }
    
    await mongoose.connect(mongoUri);
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

beforeEach(async () => {
    await User.deleteMany({});
    await Leave.deleteMany({});

    // Create Admin
    const adminRes = await request(app)
        .post('/api/auth/register')
        .send({
            fullName: 'Admin User',
            email: 'admin.test@example.com',
            password: 'password123'
        });
    adminToken = adminRes.body.token;
    await User.findByIdAndUpdate(adminRes.body._id, { role: 'admin' });

    // Create Employee
    const empRes = await request(app)
        .post('/api/auth/register')
        .send({
            fullName: 'Employee User',
            email: 'employee@example.com',
            password: 'password123'
        });
    employeeToken = empRes.body.token;
    employeeId = empRes.body._id;
});

describe('Leave API', () => {
    describe('POST /api/leaves', () => {
        it('should create a leave request and auto-calculate totalDays', async () => {
            const res = await request(app)
                .post('/api/leaves')
                .set('Authorization', `Bearer ${employeeToken}`)
                .send({
                    leaveType: 'sick',
                    startDate: new Date('2026-05-01'),
                    endDate: new Date('2026-05-03'),
                    reason: 'Feeling unwell'
                });
            
            expect(res.statusCode).toBe(201);
            expect(res.body.leaveType).toBe('sick');
            expect(res.body.totalDays).toBe(3); // May 1, 2, 3 (inclusive)
        });

        it('should fail if user has insufficient leave balance', async () => {
            // Give employee only 2 days balance
            await User.findByIdAndUpdate(employeeId, { leaveBalance: 2 });

            const res = await request(app)
                .post('/api/leaves')
                .set('Authorization', `Bearer ${employeeToken}`)
                .send({
                    leaveType: 'paid',
                    startDate: new Date('2026-05-01'),
                    endDate: new Date('2026-05-05'), // 5 days
                });
            
            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe('Insufficient leave balance');
        });
    });

    describe('PUT /api/admin/leaves/:id', () => {
        let leaveId;

        beforeEach(async () => {
            // Apply for 2 days leave
            const res = await request(app)
                .post('/api/leaves')
                .set('Authorization', `Bearer ${employeeToken}`)
                .send({
                    leaveType: 'casual',
                    startDate: new Date('2026-05-01'),
                    endDate: new Date('2026-05-02') // 2 days
                });
            leaveId = res.body._id;
        });

        it('should deduct balance when admin approves', async () => {
            const initialUser = await User.findById(employeeId);
            expect(initialUser.leaveBalance).toBe(20);

            const res = await request(app)
                .put(`/api/admin/leaves/${leaveId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ status: 'approved' });
            
            expect(res.statusCode).toBe(200);
            expect(res.body.status).toBe('approved');

            const updatedUser = await User.findById(employeeId);
            expect(updatedUser.leaveBalance).toBe(18); // 20 - 2
        });
    });
});
