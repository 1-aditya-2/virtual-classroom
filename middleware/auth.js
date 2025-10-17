const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticate = async (req, res, next) => {
  const auth = req.headers.authorization;
  if(!auth) return res.status(401).json({ message: 'Missing auth token' });
  const token = auth.split(' ')[1];
  try{
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
    req.user = payload;
    next();
  }catch(e){
    return res.status(401).json({ message: 'Invalid token' });
  }
};

const requireRole = (role) => (req, res, next) => {
  if(!req.user) return res.status(401).json({ message: 'Unauthorized' });
  if(req.user.role !== role) return res.status(403).json({ message: 'Forbidden: role required ' + role });
  next();
};

module.exports = { authenticate, requireRole };
