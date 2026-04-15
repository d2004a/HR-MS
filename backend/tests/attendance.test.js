const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const request = require('supertest');
const app = require('../server');
const User = require('../models/User');
const Attendance = require('../models/Attendance');

let mongoServer;
let employeeToken;
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
    await Attendance.deleteMany({});

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

describe('Attendance API', () => {
    describe('POST /api/attendance', () => {
        it('should mark attendance for today as present', async () => {
            const today = new Date();
            // Start of today
            today.setHours(0, 0, 0, 0);

            const res = await request(app)
                .post('/api/attendance')
                .set('Authorization', `Bearer ${employeeToken}`)
                .send({
                    date: today,
                    status: 'present'
                });
            
            expect(res.statusCode).toBe(201);
            expect(res.body.status).toBe('present');
        });

        it('should not allow marking attendance twice on same day', async () => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            await request(app)
                .post('/api/attendance')
                .set('Authorization', `Bearer ${employeeToken}`)
                .send({
                    date: today,
                    status: 'present'
                });

            const res = await request(app)
                .post('/api/attendance')
                .set('Authorization', `Bearer ${employeeToken}`)
                .send({
                    date: today,
                    status: 'absent' // trying to mark again
                });
            
            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe('Attendance already marked for this date');
        });
    });
});
