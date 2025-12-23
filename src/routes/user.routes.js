const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { protect } = require('../middleware/auth.middleware');
const {
  validateRegister,
  validateLogin,
  validateResetPassword
} = require('../middleware/validation.middleware');


router.post('/register', validateRegister, userController.register);
router.post('/login', validateLogin, userController.login);
router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password/:token', validateResetPassword, userController.resetPassword);


router.get('/profile', protect, userController.getProfile);
