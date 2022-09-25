const { options } = require('../server');
const express = require('express');
const { register, activateAccount, login, auth } = require('../controller/user');
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const {
  userRegisterValidation,
  userTokenValidation,
  userLoginValidation,
} = require('../helpers/user.validation');
const { authUser } = require('../middlewares/auth');
const router = express.Router();
// custom swagger
const spec = swaggerJsDoc(options);
// Reference swagger: https://codesandbox.io/s/swagger-api-library-5s5s7?file=/index.js
router.use('/api-docs', swaggerUI.serve, swaggerUI.setup(spec));
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - first_name
 *         - last_name
 *         - email
 *         - username
 *         - password
 *         - bYear
 *         - bMonth
 *         - bDay
 *         - gender
 *       properties:
 *         first_name:
 *           type: string
 *           description: First name is required
 *         last_name:
 *           type: string
 *           description: Last name is required
 *         email:
 *           type: string
 *           description: Email is required
 *         password:
 *           type: string
 *           description: Password is required
 *         bYear:
 *           type: number
 *         bMonth:
 *           type: number
 *         bDay:
 *           type: number
 *         gender:
 *           type: number
 *           description: Gender is required
 *       example:
 *         first_name: Ho
 *         last_name: Phong
 *         email: hoaiphong@gmail.com
 *         username: Ho Hoai Phong
 *         password: password
 *         bYear: 1999
 *         bMonth: 8
 *         bDay: 19
 *         gender: Male
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     Token:
 *       type: object
 *       required:
 *         - token
 *       properties:
 *         token:
 *           type: string
 *           description: Access token
 *       example:
 *         token: Token
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     UserLogin:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           description: Email of account
 *         password:
 *           type: string
 *           description: Password of account
 *       example:
 *         email: mygmail@gmail.com
 *         password: password123
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     Message:
 *       type: object
 *       required:
 *         - message
 *       properties:
 *         message:
 *           type: string
 *           description: Notify account active success
 *       example:
 *         message: Notify action successfully
 */
/**
 * @swagger
 * /register:
 *   post:
 *     summary: Create a new User
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The user was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal Server Error
 *
 */

router.post('/register', userRegisterValidation(), register);

/**
 * @swagger
 * /active:
 *   post:
 *     summary: Activate User
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Token'
 *     responses:
 *       200:
 *         description: Account has been activated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal Server Error
 *
 */
router.post('/active', authUser, activateAccount);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: User login
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserLogin'
 *     responses:
 *       200:
 *         description: User login successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal Server Error
 *
 */
router.post('/login', userLoginValidation(), login);

router.post('/auth', authUser, auth);

module.exports = router;
