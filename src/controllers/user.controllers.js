import { User } from '../models/user.model.js';

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.status(200).json({ msg: 'User fetched', user });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const getUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error('User not found.');
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ status: user.status });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const updateStatus = async (req, res, next) => {
  const newStatus = req.body.status;

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error('User not found.');
      error.statusCode = 404;
      throw error;
    }
    user.status = newStatus;
    await user.save();
    res.status(200).json({ msg: 'Status updated' });
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
