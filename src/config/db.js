import mongoose from 'mongoose';
import config from '../utils/config.js'
import { info, error } from "../utils/logger.js";

info("connecting to", config.MONGODB_URI);

export const connectDB = async () => {
    try {
        await mongoose.connect(
            config.MONGODB_URI
        , { 
            useUnifiedTopology: true,
            useNewUrlParser: true,
         });
        info('MongoDB connected');
        console.log(process.env.NODE_ENV)
    } catch (err) {
        error('Error connection to MongoDB', err.message);
        process.exit(1);
    }
};
