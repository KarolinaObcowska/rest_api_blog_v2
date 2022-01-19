import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Title is required.'],
            minlength: [5, 'Title cannot be shorter than 5 characters'],
            maxlength: [25, 'Title cannot be longer than 25 characters']
        },
        content: {
            type: String,
            reqired: [true, 'Content is required'],
            minlength: [30, 'Content cannot be shorter than 30 characters'],
            maxlength: [2000, 'Content cannot be longer than 3000 characters']
        },
        user: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'User',
            required: true
        },
        comments: [
            {
                user: {
                    type: mongoose.SchemaTypes.ObjectId,
                    ref: 'User'
                },
                text: {
                    type: String,
                    reqired: [true, 'Comment text is required'],

                },
                date: {
                    type: Date,
                    default: Date.now()
                }
            }
        ]
    },
    { timestamps: true }
);

export const Post = mongoose.model('Post', postSchema);