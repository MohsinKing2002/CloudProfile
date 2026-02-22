import dotenv from 'dotenv';

dotenv.config();

interface Config {
  PORT: number;
  ENV: string;
  DB_URI: string;
  SECRET: string;
  FRONTEND_URL: string;
  GROK_API_KEY: string;
  AWS_ACCESS_KEY: string;
  AWS_SECRET_KEY: string;
  AWS_REGION: string;
  AWS_BUCKET: string;
}

const config: Config = {
  PORT: Number(process.env.PORT) || 5001,
  ENV: process.env.ENV || 'dev',
  DB_URI: process.env.DB_URI || 'sample-uri',
  SECRET: process.env.SECRET || 'jwt-secret',
  FRONTEND_URL: process.env.FRONTEND_URL || 'frontend-url',
  GROK_API_KEY: process.env.GROK_API_KEY || 'api-key',
  AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY || 'access-key',
  AWS_SECRET_KEY: process.env.AWS_SECRET_KEY || 'aws-secret',
  AWS_REGION: process.env.AWS_REGION || 'aws-region',
  AWS_BUCKET: process.env.AWS_BUCKET || 'aws-bucket',
};

export default config;
