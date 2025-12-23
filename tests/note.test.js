const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/user.model');
const Note = require('../src/models/note.model');

describe('Note API Tests', () => {
  let token;
  let userId;

  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/fundoonotes_test');
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});
    await Note.deleteMany({});

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

  describe('POST /api/notes', () => {
    it('should create a new note', async () => {
      const res = await request(app)
        .post('/api/notes')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Test Note',
          description: 'This is a test note'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe('Test Note');
    });

    it('should not create note without authentication', async () => {
      const res = await request(app)
        .post('/api/notes')
        .send({
          title: 'Test Note',
          description: 'This is a test note'
        });

      expect(res.statusCode).toBe(401);
    });

    it('should validate required fields', async () => {
      const res = await request(app)
        .post('/api/notes')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Test Note'
        });

      expect(res.statusCode).toBe(400);
    });
  });

  describe('GET /api/notes', () => {
    beforeEach(async () => {
      await Note.create([
        { title: 'Note 1', description: 'Description 1', userId },
        { title: 'Note 2', description: 'Description 2', userId }
      ]);
    });

    it('should get all notes for user', async () => {
      const res = await request(app)
        .get('/api/notes')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.count).toBe(2);
      expect(res.body.data.length).toBe(2);
    });
  });

  describe('GET /api/notes/:id', () => {
    let noteId;

    beforeEach(async () => {
      const note = await Note.create({
        title: 'Test Note',
        description: 'Test Description',
        userId
      });
      noteId = note._id;
    });

    it('should get note by id', async () => {
      const res = await request(app)
        .get(`/api/notes/${noteId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe('Test Note');
    });

    it('should return 404 for non-existent note', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .get(`/api/notes/${fakeId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(404);
    });
  });

  describe('PUT /api/notes/:id', () => {
    let noteId;

    beforeEach(async () => {
      const note = await Note.create({
        title: 'Old Title',
        description: 'Old Description',
        userId
      });
      noteId = note._id;
    });

    it('should update note', async () => {
      const res = await request(app)
        .put(`/api/notes/${noteId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'New Title',
          description: 'New Description'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe('New Title');
    });
  });

  describe('DELETE /api/notes/:id', () => {
    let noteId;

    beforeEach(async () => {
      const note = await Note.create({
        title: 'Test Note',
        description: 'Test Description',
        userId
      });
      noteId = note._id;
    });

    it('should move note to trash', async () => {
      const res = await request(app)
        .delete(`/api/notes/${noteId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);

      const note = await Note.findById(noteId);
      expect(note.isTrashed).toBe(true);
    });
  });
});
