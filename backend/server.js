/*const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const mongoose = require('mongoose');
require('dotenv').config();
//const bcrypt = require('bcryptjs');

const { authRouter } = require('./src/routes/auth');
const { taskRouter } = require('./src/routes/tasks');

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (_, res) => res.send('ok'));

app.use('/api/auth/login', rateLimit({ windowMs: 60_000, max: 30 }));
app.use('/api/auth', authRouter);
app.use('/api/tasks', taskRouter);

const port = process.env.PORT || 4000;
mongoose.connect(process.env.MONGO_URL).then(() => {
  app.listen(port, () => console.log(`API http://localhost:${port}`));
});
module.exports = app;*/
/*
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const mongoose = require('mongoose');

const { authRouter } = require('./src/routes/auth');
const { taskRouter } = require('./src/routes/tasks');

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (_, res) => res.send('ok'));

app.use('/api/auth/login', rateLimit({ windowMs: 60_000, max: 30 }));
app.use('/api/auth', authRouter);
app.use('/api/tasks', taskRouter);

const port = process.env.PORT || 4000;
mongoose.connect(process.env.MONGO_URL).then(() => {
  app.listen(port, () => console.log(`API http://localhost:${port} with MongoDB`));
}).catch(err => {
  console.error('MongoDB connection failed:', err.message);
  app.listen(port, () => console.log(`API started on http://localhost:${port} without MongoDB`));
});
module.exports = app;*/
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const mongoose = require('mongoose');
require('dotenv').config();
//const bcrypt = require('bcryptjs');

const { authRouter } = require('./src/routes/auth');
const { taskRouter } = require('./src/routes/tasks');

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (_, res) => res.send('ok'));

//Apply specific rate limits
app.use('/api/auth/login', rateLimit({ windowMs: 60*1000, max: 30 }));
// Add this new rate limit for the signup endpoint
app.use('/api/auth/signup', rateLimit({ windowMs: 60 * 1000, max: 10 })); 
app.use('/api/auth', authRouter);
app.use('/api/tasks', taskRouter);

const port = process.env.PORT || 4000;

// Start server regardless of MongoDB, but attempt connection
mongoose.connect(process.env.MONGO_URL).then(() => {
  console.log('MongoDB connected successfully');
}).catch(err => {
  console.error('MongoDB connection failed:', err.message);
  // Server still starts without DB for health checks and basic routes
});

app.listen(port, () => console.log(`API http://localhost:${port}`));
module.exports = app;
