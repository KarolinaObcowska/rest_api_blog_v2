import { start } from './server.js';
import { connectDB } from './config/db.js';

connectDB();
start();