import express, { type Express } from 'express';
import cors from 'cors';
import config from './config/config.js';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/userRoute.js';
import { connectDB } from './config/db.js';
import { startAvatarCleanupCron } from './cron/avatarCleanup.cron.js';
import { globalErrorHandler } from './middlewares/globalErrorHandler.js';

const app: Express = express();

// CORS setup
app.use(
  cors({
    origin: config.FRONTEND_URL,
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// cookie parser
app.use(cookieParser());

// DB connection
connectDB();

// Routes
app.use('/api/auth', userRoutes);

// Crons
startAvatarCleanupCron();

// Global error handling
app.use(globalErrorHandler);

export default app;
