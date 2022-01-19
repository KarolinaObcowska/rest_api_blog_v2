import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import { User } from '../models/user.model.js';
import { signJwt } from '../middleware/protect.js';

export const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed.');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const { email, firstname, lastname, password } = req.body;
  
  try {
    const hash = await bcrypt.hash(password, 12);
    const newUser = new User({
      email,
      firstname,
      lastname,
      password: hash,
    });
    const user = await User.findOne({ email });
    if (user) {
      const error = new Error(
        'A user with this email already exists. Please sign in.'
      );
      error.statusCode = 409;
      throw error;
    }
    const result = await newUser.save();
    const token = signJwt(result.email, result._id);
    res.status(201).json({ msg: 'User created', userId: result._id, token });
  } catch (err) {
    if (err.name == 'ValidationError') {
      console.error('Error Validating!', err);
      res.status(422).json(err.message);
    } else {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  }
};

export const signin = async (req, res, next) => {
  const { email } = req.body;
  const { password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error('A user with this email could not be found.');
      error.statusCode = 401;
      throw error;
    }
    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      const error = new Error('Wrong password!');
      error.statusCode = 401;
      throw error;
    }
    const token = signJwt(user.email, user._id);
    res.status(200).json({ msg: 'Logged', token, userId: user._id.toString() });
  } catch (err) {
    if (err.name == 'ValidationError') {
      console.error('Error Validating!', err);
      res.status(422).json(err.message);
    } else {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  }
};
