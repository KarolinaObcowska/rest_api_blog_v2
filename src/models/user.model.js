import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: [true, 'First name is required.'],
    maxLength: [20, 'First name cannot be longer than 20 characters.'],
    trim: true,
  },

  lastname: {
    type: String,
    required: [true, 'Last name is required.'],
    maxLength: [20, 'Last name cannot be longer than 20 characters.'],
    trim: true,
  },

  email: {
    type: String,
    required: [true, 'Email name is required.'],
    maxLength: [64, 'First name cannot be shorter than 6 characters.'],
    minLength: [6, 'First name cannot be longer than 64 characters.'],
    unique: true,
    trim: true,
  },

  password: {
    type: String,
    required: true,
    minlength: [8, 'Password cannot be shorter than 8 characters.'],
  },

  status: {
    type: String,
  },

  posts: [
    {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Post',
    },
  ],
});

export const User = mongoose.model('User', userSchema);
