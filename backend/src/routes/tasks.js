const express = require('express');
const { body, validationResult } = require('express-validator');
const Task = require('../models/Task');
const auth = require('../mw/auth');
const sanitizeHtml = require('sanitize-html');

const taskRouter = express.Router();
taskRouter.use(auth);

taskRouter.get('/', async (req, res) => {
  const items = await Task.find({ userId: req.user.sub }).sort({ createdAt: -1 });
  res.json(items);
});

taskRouter.post('/',
  body('title').trim().notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    
    
    
    const t = await Task.create({ title: req.body.title, userId: req.user.sub });
    res.status(201).json(t);
  });

module.exports = { taskRouter };
