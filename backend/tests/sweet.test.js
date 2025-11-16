const request = require('supertest');
const app = require('../index');
const mongoose = require('mongoose');
const User = require('../models/User');
const Sweet = require('../models/Sweet');

const MONGO = process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/sweetshop_test';

let adminToken, userToken, sweetId;

beforeAll(async () => {
  await mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true });
  await User.deleteMany({});
  await Sweet.deleteMany({});

  // create admin and user
  await request(app).post('/api/auth/register').send({ name: 'Admin', email: 'admin@a.com', password: 'pass', role: 'admin' });
  await request(app).post('/api/auth/register').send({ name: 'User', email: 'user@u.com', password: 'pass' });

  const adminRes = await request(app).post('/api/auth/login').send({ email: 'admin@a.com', password: 'pass' });
  const userRes = await request(app).post('/api/auth/login').send({ email: 'user@u.com', password: 'pass' });

  adminToken = adminRes.body.token;
  userToken = userRes.body.token;
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.disconnect();
});

test('admin can create sweet', async () => {
  const res = await request(app).post('/api/sweets')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ name: 'Ladoo', category: 'Indian', price: 10, quantity: 50 });
  expect(res.statusCode).toBe(201);
  expect(res.body.name).toBe('Ladoo');
  sweetId = res.body._id;
});

test('user can view sweets', async () => {
  const res = await request(app).get('/api/sweets').set('Authorization', `Bearer ${userToken}`);
  expect(res.statusCode).toBe(200);
  expect(Array.isArray(res.body)).toBe(true);
});

test('user can purchase sweet', async () => {
  const res = await request(app)
    .post(`/api/sweets/${sweetId}/purchase`)
    .set('Authorization', `Bearer ${userToken}`)
    .send({ quantity: 2 });
  expect(res.statusCode).toBe(200);
  expect(res.body.quantity).toBe(48);
});

test('non-admin cannot create sweet', async () => {
  const res = await request(app).post('/api/sweets')
    .set('Authorization', `Bearer ${userToken}`)
    .send({ name: 'Barfi', category: 'Indian', price: 5, quantity: 20 });
  expect(res.statusCode).toBe(403);
});
