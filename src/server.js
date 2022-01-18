import express from 'express'
import morgan from 'morgan'
import config from "./utils/config.js";
import { info } from "./utils/logger.js";
import cors from 'cors'
import userRouter from './routes/user.routes.js'
import postRouter from './routes/post.routes.js'
import authRouter from './routes/auth.routes.js';

export const app = express();

app.disable('x-powered-by');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use((err, req, res, next) => {
  return res.status(err.statusCode).send({
    error: {
      msg: err.message,
      data: err.data
    }
  });
  next()
});

app.use('/api/user', userRouter);
app.use('/api/post', postRouter);
app.use('/api/auth', authRouter);

app.get('/', (req, res) => {
  res.send('API running');
});

export const start = () => {
  app.listen(config.PORT || 5000 , () => {
    info('Server is running on', config.PORT)
  })
}

