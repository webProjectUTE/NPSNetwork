const { body } = require('express-validator');
const User = require('../models/User');

exports.userLoginValidation = () => {
  return [
    body('email')
      .trim()
      .isLength({ min: 1 })
      .withMessage('Email must be not empty')
      .isEmail()
      .withMessage('Invalid email address'),
    body('password')
      .trim()
      .isLength({ min: 6 })
      .withMessage('password must be at least 6 characters')
      .isLength({ max: 40 })
      .withMessage('password must be at max 40 characters'),
  ];
};

exports.userTokenValidation = () => {
  return body('token').trim().isLength({ min: 1 }).withMessage('Token must be not empty');
};

exports.userRegisterValidation = () => {
  return [
    body('email').trim().isEmail().withMessage('Invalid email address'),
    body('password')
      .trim()
      .isLength({ min: 6 })
      .withMessage('password must be at least 6 characters')
      .isLength({ max: 40 })
      .withMessage('password must be at max 40 characters'),
    body('first_name')
      .trim()
      .isLength({ min: 3 })
      .withMessage('fist name must be at least 6 characters')
      .isLength({ max: 30 })
      .withMessage('first name be at max 30 characters'),
    body('last_name')
      .trim()
      .isLength({ min: 3 })
      .withMessage('last name must be at least 3 characters')
      .isLength({ max: 30 })
      .withMessage('last name be at max 30 characters'),
    body('gender')
      .trim()
      .isLength({ min: 4 })
      .withMessage('gender must be at least 4 characters')
      .isLength({ max: 6 })
      .withMessage('gender be at max 6 characters')
      .toUpperCase()
      .matches(/MALE|FEMALE$/)
      .withMessage('Invalid gender recommend gender is Male or Female'),
    body('bYear')
      .trim()
      .optional({ checkFalsy: true })
      .isNumeric()
      .withMessage('Year allowed is type number'),
    body('bMonth')
      .trim()
      .optional({ checkFalsy: true })
      .isNumeric()
      .withMessage('Month allowed is type number'),
    body('bDay')
      .trim()
      .optional({ checkFalsy: true })
      .isNumeric()
      .withMessage('Day allowed is type number'),
  ];
};
