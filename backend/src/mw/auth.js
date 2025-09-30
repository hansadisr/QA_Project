const jwt = require('jsonwebtoken');

module.exports = function auth(req, res, next) {
  console.log('Real auth called for:', req.path); // Debug log
  const hdr = req.header('Authorization') || '';
  const token = hdr.startsWith('Bearer ') ? hdr.slice(7) : null;

  if (!token) return res.status(401).json({ error: 'No token' });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    // Log the full error for debugging (satisfies SonarQube by "handling" it)
    console.error('JWT verification failed:', {
      message: err.message,
      name: err.name,
      stack: err.stack,
      path: req.path,
      userAgent: req.get('User-Agent')
    });

    // Optionally, handle specific JWT errors more granularly
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    } else if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }

    // For unexpected errors, rethrow or return a generic response
    return res.status(401).json({ error: 'Authentication failed' });
  }
};