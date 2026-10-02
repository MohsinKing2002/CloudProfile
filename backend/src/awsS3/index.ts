import { S3Client } from '@aws-sdk/client-s3';
import config from '../config/config.js';

export const clientS3 = new S3Client({
  region: config.AWS_REGION,
  credentials: {
    accessKeyId: config.AWS_ACCESS_KEY,
    secretAccessKey: config.AWS_SECRET_KEY,
  },
});
