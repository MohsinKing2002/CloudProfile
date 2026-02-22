import express, { type Express } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { globalErrorHandler } from './middlewares/globalErrorHandler.ts';
import { connectDB } from './config/db.ts';
import userRoutes from './routes/userRoute.ts';
import config from './config/config.ts';

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

// Global error handling
app.use(globalErrorHandler);

export default app;
