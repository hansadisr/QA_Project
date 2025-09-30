const request = require('supertest');
const express = require('express');
const { taskRouter } = require('../../src/routes/tasks');
const Task = require('../../src/models/Task');

jest.mock('../../src/models/Task');
jest.mock('../../src/mw/auth', () => (req, res, next) => {
  console.log('Mock auth called for:', req.path);
  req.user = { sub: 'user123' };
  next();
}, { virtual: true });

jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(() => ({ sub: 'user123' })),
}));

describe('Task Routes', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use((err, req, res, next) => {
      console.log('Error caught:', err.message);
      res.status(500).json({ error: 'Internal Server Error' });
    });
    app.use(taskRouter);

    // Mock Task.find as chainable
    Task.find = jest.fn().mockReturnValue({
      sort: jest.fn().mockResolvedValue([{ title: 'Task 1', userId: 'user123' }]),
    });
    Task.create = jest.fn().mockResolvedValue({ title: 'New Task', userId: 'user123', _id: 'task1' });
  });

  afterEach(() => {
    jest.clearAllMocks();
    delete process.env.JWT_SECRET;
  });

  test('GET / should return tasks for the user', async () => {
    const mockTasks = [{ title: 'Task 1', userId: 'user123' }];

    const response = await request(app)
      .get('/')
      .set('Authorization', 'Bearer dummyToken');

    console.log('GET Response status:', response.status);
    console.log('GET Response body:', response.body);

    expect(Task.find).toHaveBeenCalledWith({ userId: 'user123' });
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockTasks);
  });

  test('GET / should handle database error', async () => {
    Task.find.mockReturnValue({
      sort: jest.fn().mockRejectedValue(new Error('Database connection failed')),
    });

    const response = await request(app)
      .get('/')
      .set('Authorization', 'Bearer dummyToken');

    console.log('GET Response status (error case):', response.status);
    console.log('GET Response body (error case):', response.body);

    expect(Task.find).toHaveBeenCalledWith({ userId: 'user123' });
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Internal Server Error' });
  });

  test('POST / should create a new task', async () => {
    const mockTask = { title: 'New Task', userId: 'user123', _id: 'task1' };

    const response = await request(app)
      .post('/')
      .set('Authorization', 'Bearer dummyToken')
      .send({ title: 'New Task' });

    expect(Task.create).toHaveBeenCalledWith({ title: 'New Task', userId: 'user123' });
    expect(response.status).toBe(201);
    expect(response.body).toEqual(mockTask);
  });

  test('POST / should fail with empty title', async () => {
    const response = await request(app)
      .post('/')
      .set('Authorization', 'Bearer dummyToken')
      .send({ title: '' });

    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
    expect(response.body.errors.length).toBe(1);
  });

  test('POST / should fail with multiple validation errors', async () => {
    const response = await request(app)
      .post('/')
      .set('Authorization', 'Bearer dummyToken')
      .send({ title: '', extraField: 'test' });

    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
    expect(response.body.errors.length).toBe(1);
  });

  test('POST / should handle database error', async () => {
    Task.create.mockRejectedValue(new Error('Database error'));

    const response = await request(app)
      .post('/')
      .set('Authorization', 'Bearer dummyToken')
      .send({ title: 'New Task' });

    console.log('POST Response status (error case):', response.status);
    console.log('POST Response body (error case):', response.body);

    expect(Task.create).toHaveBeenCalledWith({ title: 'New Task', userId: 'user123' });
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Internal Server Error' }); // Updated expectation
  });
});