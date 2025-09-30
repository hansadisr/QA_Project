const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authRouter = express.Router();

authRouter.post('/signup',
  body('name').trim().notEmpty(),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, email, password } = req.body;
    if (await User.findOne({ email })) return res.status(400).json({ error: 'Email already registered' });

    const hash = await bcrypt.hash(password, 10);
    const u = await User.create({ name, email, password: hash });
    res.status(201).json({ userId: u._id });
  });

authRouter.post('/login',
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;
    const u = await User.findOne({ email });
    if (!u || !(await bcrypt.compare(password, u.password)))
      return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ sub: u._id, email: u.email }, process.env.JWT_SECRET, { expiresIn: '2h' });
    res.json({ token });
  });

module.exports = { authRouter };
