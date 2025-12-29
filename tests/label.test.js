const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/user.model');
const Label = require('../src/models/label.model');

describe('Label API Tests', () => {
  let token;
  let userId;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});
    await Label.deleteMany({});

    const res = await request(app)
      .post('/api/users/register')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123'
      });
    
    token = res.body.data.token;
    userId = res.body.data.user.id;
  });

  describe('POST /api/labels', () => {
    it('should create a new label', async () => {
      const res = await request(app)
        .post('/api/labels')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Work'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('Work');
    });

    it('should not create duplicate label', async () => {
      await Label.create({ name: 'Work', userId });

      const res = await request(app)
        .post('/api/labels')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Work'
        });

      expect(res.statusCode).toBe(400);
    });
  });

  describe('GET /api/labels', () => {
    beforeEach(async () => {
      await Label.create([
        { name: 'Work', userId },
        { name: 'Personal', userId }
      ]);
    });

    it('should get all labels', async () => {
      const res = await request(app)
        .get('/api/labels')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.count).toBe(2);
    });
  });

  describe('PUT /api/labels/:id', () => {
    let labelId;

    beforeEach(async () => {
      const label = await Label.create({
        name: 'Old Name',
        userId
      });
      labelId = label._id;
    });

    it('should update label', async () => {
      const res = await request(app)
        .put(`/api/labels/${labelId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'New Name'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('New Name');
    });
  });

  describe('DELETE /api/labels/:id', () => {
    let labelId;

    beforeEach(async () => {
      const label = await Label.create({
        name: 'Test Label',
        userId
      });
      labelId = label._id;
    });

    it('should delete label', async () => {
      const res = await request(app)
        .delete(`/api/labels/${labelId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);

      const label = await Label.findById(labelId);
      expect(label).toBeNull();
    });
  });
});