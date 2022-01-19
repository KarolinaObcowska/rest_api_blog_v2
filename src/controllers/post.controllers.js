import { validationResult } from "express-validator";
import { handleValidationErrors } from "../middleware/errors";
import { Post } from '../models/post.model.js';
import { User } from '../models/user.model.js';


export const createPost = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    next(error);
  }
  try {
    const title = req.body.title;
    const content = req.body.content;
    let post = new Post({
      title: title,
      content: content,
      user: req.userId
    });

    await post.save();
    const user = await User.findById(req.userId);
    user.posts.push(post);
    await user.save();
    res.status(201).json({ msg: 'Post created successfully!', post: post });
  } catch (err) {
    if (err.name == 'ValidationError') {
      handleValidationErrors(err, res);
  } else {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
  }
}

export const getPost = async (req, res, next) => {
const postId = req.params.id;
const post = await Post.findById(postId);

try {
  if (!post) {
    const error = new Error('Could not find post.');
    error.statusCode = 404;
    throw error;
  }
  res.status(200).json(post);

} catch (err) {
  if (!err.statusCode) {
    err.statusCode = 500;
  }
  next(err);
}
}

export const getPosts = async (req, res, next) => {
try {
  const posts = await Post.find().sort({ createdAt: -1 });
  res.status(200).json({posts: posts})
} catch (err) {
  if (!err.statusCode){
    err.statusCode = 500;
  }
  next(err)
}

}

export const updatePost = async (req,res, next) => {
const postId = req.params.id;
const errors = validationResult(req);
if (!errors.isEmpty()) {
  const error = new Error('Validation failed, entered data is incorrect.');
  error.statusCode = 422;
  throw error;
}
const title = req.body.title;
const content = req.body.content;

try {
const post = await Post.findById(postId)
    if (!post) {
      const error = new Error('Could not find post.');
      error.statusCode = 404;
      throw error;
    }
    if (post.user._id.toString() !== req.userId) {
      const error = new Error('Not authorized!');
      error.statusCode = 403;
      throw error;
    }
   
    post.title = title;
    post.content = content;
    const result = await post.save();
    res.status(200).json(result);
} catch (err) {
  if (err.name == 'ValidationError') {
    handleValidationErrors(err, res)
} else {
  if (!err.statusCode) {
    err.statusCode = 500;
  }
  next(err);
}
  };
};

export const deletePost = async (req, res, next) => {
const postId = req.params.id;
const post = await Post.findById(postId);
if (!post) {
  const error = new Error('Could not find post.');
  error.statusCode = 404;
  throw error;
}
if (post.user.toString() !== req.userId) {
  const error = new Error('Not authorized');
  error.statusCode = 403;
  throw error;
}
try {
  await Post.findByIdAndRemove(postId);
  const user = await User.findById(req.userId);
  user.posts.pull(postId);
  await user.save();

  res.status(200).json({ msg: 'Deleted post' });
} catch (err) {
  if (!err.statusCode) {
    err.statusCode = 500;
  }
  next(err);
}
}

export const createComment = async (req, res, next) => {
const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    throw error;
  }
  try {
    const user = await User.findById(req.userId);
    const post = await Post.findById(req.params.id);

    const comment = {
      text: req.body.text,
      user: req.userId,
    };

    post.comments.unshift(comment);
    await post.save();
    res.status(200).json({comments: post.comments})
  } catch (err) {
    if (err.name == 'ValidationError') {
      handleValidationErrors(err, res);
  } else {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
  }
};

export const deleteComment = async (req, res, next) => {
try {
  const post = await Post.findById(req.params.id);
  const comment = post.comments.find(comment => comment.id === req.params.commentId);

  if (!comment) {
    return res.status(404).json({ msg: 'Comment not found' });
  };

  if (comment.user.toString() !== req.userId) {
    res.status(401).json({ msg: "Not authorized" })
  };

  const removeIndex = post.comments.map(comment => comment.user).indexOf(req.userId);
  post.comments.splice(removeIndex, 1);
  await post.save();
  res.status(200).json(post.comments);
} catch (err) {
  if (!err.statusCode) {
    err.statusCode = 500;
  }
  next(err);
}
}

