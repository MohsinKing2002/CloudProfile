import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { clientS3 } from './index.ts';
import config from '../config/config.ts';

export const generateAvatarViewURL = async (avatarKey: string) => {
  // 1. create get object cmd
  const command = new GetObjectCommand({
    Bucket: config.AWS_BUCKET,
    Key: avatarKey,
  });

  // 2. get signed url
  return getSignedUrl(clientS3, command, {
    expiresIn: 3600, // valid for 1hr
  });
};
