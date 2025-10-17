const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function login(req, res) {
  const { username, password, role } = req.body;
  if (!username || !role) {
    return res.status(400).json({ message: 'username and role required (tutor|student)' });
  }
  let user = await User.findOne({ where: { username } });
  if (!user) {
    user = await User.create({ username, role });
  } else {
    if (user.role !== role) {
      user.role = role;
      await user.save();
    }
  }
  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    process.env.JWT_SECRET || 'secretkey',
    { expiresIn: '7d' }
  );
  res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
}

module.exports = { login };


