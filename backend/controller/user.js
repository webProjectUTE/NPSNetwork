const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { generateToken } = require('../helpers/tokens');
const bcrypt = require('bcrypt');
const { sendVerificationEmail } = require('../helpers/mailer');
exports.register = async (req, res) => {
  // validate field register user
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { first_name, last_name, email, password, username, bYear, bMonth, bDay, gender } =
      req.body;

    const userByEmail = await User.findOne({ email: email });

    if (userByEmail != null)
      return res.status(400).json({
        message: `This email ${email} address already exists,try with a different email address`,
      });

    // create new user
    const user = await new User({
      first_name,
      last_name,
      email,
      password: await bcrypt.hash(password, 12),
      username,
      bYear,
      bMonth,
      bDay,
      gender,
    }).save();

    // generateToken
    const emailVerificationToken = generateToken({ id: user._id.toString() }, '30m');

    // send mail register user
    const url = `${process.env.BASE_URL}/activate/${emailVerificationToken}`;
    sendVerificationEmail(user.email, user.first_name, url);

    //send response success
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.activateAccount = async (req, res) => {
  // validate field token
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { token } = req.body;
    const user = jwt.verify(token.trim(), process.env.TOKEN_SECRET);
    const check = await User.findById(user.id);

    if (check.verified)
      return res.status(400).json({
        message: 'This email is already activated',
      });

    User.findByIdAndUpdate(user.id, { verified: true }).then(() => {
      res.status(200).json({ message: 'Account has been activated successfully' });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  // validate login user
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    // check email is exists in database
    if (!user) {
      return res.status(400).json({
        message: `The email ${email} address you entered is not found`,
      });
    }
    // compare password
    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword)
      return res.status(400).json({
        message: 'Invalid credentials. Please try again.',
      });

    // create token
    const token = generateToken({ id: user._id.toString() }, '30m');
    res.json({ access_token: token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.auth = (req, res) => {
  console.log(req.user);
  res.json('welcome from auth');
};
