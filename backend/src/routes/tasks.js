const express = require('express');
const { body, validationResult } = require('express-validator');
const Task = require('../models/Task');
const auth = require('../mw/auth');
const sanitizeHtml = require('sanitize-html');

const taskRouter = express.Router();
taskRouter.use(auth);

taskRouter.get('/', async (req, res) => {
  try {
    console.log('GET handler called, req.user:', req.user);
    const items = await Task.find({ userId: req.user.sub }).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    console.log('GET error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

taskRouter.post(
  '/',
  body('title').trim().notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    try {
      const t = await Task.create({ title: req.body.title, userId: req.user.sub });
      res.status(201).json(t);
    } catch (error) {
      console.log('POST error:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
);

module.exports = { taskRouter };