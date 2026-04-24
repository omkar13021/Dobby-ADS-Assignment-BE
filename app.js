import express from 'express';
import userRouter from './routes/user.router.js';
import errorHandler from './middleware/errorHandler.js';
import dotenv from 'dotenv';
import DBConnection from './config/DBConnect.Config.js';
import authRouter from './routes/auth.router.js';

dotenv.config();

const port = process.env.PORT || 5000;

await DBConnection();

const app = express();

app.use(express.json()); // json parser middleware provided by express
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);

app.use(errorHandler); // error handler middleware

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
