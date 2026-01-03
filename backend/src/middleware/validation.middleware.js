const { body, validationResult } = require('express-validator');


const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }
  next();
};

const validateRegister = [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  validate
];

const validateLogin = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
  validate
];

const validateResetPassword = [
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  validate
];

const validateNote = [
  body('title').trim().notEmpty().withMessage('Note title is required'),
  body('description').trim().notEmpty().withMessage('Note description is required'),
  validate
];

const validateLabel = [
  body('name').trim().notEmpty().withMessage('Label name is required'),
  validate
];

module.exports = {
  validate,
  validateRegister,
  validateLogin,
  validateResetPassword,
  validateNote,
  validateLabel
};
