const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const config = require('../config/config');

exports.generateToken = (id) => {
  return jwt.sign({ id }, config.jwt.secret, {
    expiresIn: config.jwt.expire
  });
};

exports.verifyToken = (token) => {
  try {
    return jwt.verify(token, config.jwt.secret);
  } catch (error) {
    return null;
  }
};

exports.generateResetToken = () => {
  return crypto.randomBytes(20).toString('hex');
};

exports.hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};
