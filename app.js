import express from 'express';
import cors from 'cors';
import path from 'path';
import cookieParser from 'cookie-parser';
import userRouter from './routes/user.router.js';
import errorHandler from './middleware/errorHandler.js';
import dotenv from 'dotenv';
import DBConnection from './config/DBConnect.Config.js';
import authRouter from './routes/auth.router.js';
import folderRouter from './routes/folder.router.js';
import imageRouter from './routes/image.router.js';

dotenv.config();

const port = process.env.PORT || 5000;

await DBConnection();

const app = express();

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, curl, etc.)
        if (!origin) return callback(null, true);
        
        const allowedOrigins = ['https://dobby-ads-assignment-fe.vercel.app', 'http://localhost:3000'];
        
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use('/api/auth', authRouter);
app.use('/api/folders', folderRouter);
app.use('/api/images', imageRouter);
app.use('/api/users', userRouter);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
