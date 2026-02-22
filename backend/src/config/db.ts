import mongoose from 'mongoose';
import config from './config.ts';

export const connectDB = async () => {
  const {
    connection: { host },
  } = await mongoose.connect(config.DB_URI);
  console.info('INFO: DB is connected with host:', host);
};
