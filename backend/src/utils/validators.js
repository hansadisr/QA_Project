// very simple examples
exports.isStrongPassword = (p) => /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/.test(p);

const jwt = require('jsonwebtoken');
exports.buildAuthToken = (userId) => jwt.sign({ uid: userId }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
