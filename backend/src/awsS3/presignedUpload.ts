import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { clientS3 } from './index.js';
import config from '../config/config.js';

export const generateAvatarUploadURL = async (
  userId: string,
  contentType: string,
) => {
  // create key
  const key = `avatars/${userId}/${crypto.randomUUID()}`;

  const command = new PutObjectCommand({
    Bucket: config.AWS_BUCKET,
    Key: key,
    ContentType: contentType,
  });

  const uploadURL = await getSignedUrl(clientS3, command, {
    expiresIn: 300,
  });

  return {
    uploadURL,
    key,
  };
};
