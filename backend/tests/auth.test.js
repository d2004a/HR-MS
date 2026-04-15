const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const request = require('supertest');
const app = require('../server');
const User = require('../models/User');

let mongoServer;

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
});

describe('Auth API', () => {
    describe('POST /api/auth/register', () => {
        it('should register a new user', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    fullName: 'John Doe',
                    email: 'john@example.com',
                    password: 'password123'
                });
            
            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty('token');
            expect(res.body.fullName).toBe('John Doe');
            expect(res.body.email).toBe('john@example.com');
            expect(res.body.role).toBe('employee');
        });

        it('should not register user with existing email', async () => {
            await User.create({
                fullName: 'Jane Doe',
                email: 'jane@example.com',
                password: 'password123'
            });

            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    fullName: 'Jane Doe Duplicate',
                    email: 'jane@example.com',
                    password: 'password123'
                });
            
            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe('User already exists');
        });
    });

    describe('POST /api/auth/login', () => {
        beforeEach(async () => {
            await request(app)
                .post('/api/auth/register')
                .send({
                    fullName: 'Login Test',
                    email: 'login@example.com',
                    password: 'password123'
                });
        });

        it('should login with correct credentials', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'login@example.com',
                    password: 'password123'
                });
            
            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('token');
        });

        it('should fail to login with incorrect password', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'login@example.com',
                    password: 'wrongpassword'
                });
            
            expect(res.statusCode).toBe(401);
            expect(res.body.message).toBe('Invalid credentials');
        });
    });

    describe('GET /api/auth/profile', () => {
        let token;
        
        beforeEach(async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    fullName: 'Profile Test',
                    email: 'profile@example.com',
                    password: 'password123'
                });
            token = res.body.token;
        });

        it('should get profile when auth token is provided', async () => {
            const res = await request(app)
                .get('/api/auth/profile')
                .set('Authorization', `Bearer ${token}`);
            
            expect(res.statusCode).toBe(200);
            expect(res.body.email).toBe('profile@example.com');
            expect(res.body.leaveBalance).toBe(20);
        });

        it('should fail to get profile without token', async () => {
            const res = await request(app)
                .get('/api/auth/profile');
            
            expect(res.statusCode).toBe(401);
            expect(res.body.message).toBe('Not authorized, no token');
        });
    });
});
