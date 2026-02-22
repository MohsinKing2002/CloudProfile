import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import config from '../config/config.ts';

/********************* S3 client **************************/
const clientS3 = new S3Client({
  region: config.AWS_REGION,
  credentials: {
    accessKeyId: config.AWS_ACCESS_KEY,
    secretAccessKey: config.AWS_SECRET_KEY,
  },
});

/**
 * Upload avatar to AWS S3 and returns public URL
 * @param String base64Img
 * @param String userId
 * @returns String URL
 */
export const uploadAvatarAndGetUrl = async (
  base64Img: string,
  userId: string,
) => {
  try {
    const buffer = Buffer.from(base64Img.split(',')[1]!, 'base64');
    const key = `avatars/${userId}.png`;

    const command = new PutObjectCommand({
      Bucket: config.AWS_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: 'image/png',
    });

    await clientS3.send(command);

    const url = `https://s3.${config.AWS_REGION}.amazonaws.com/${config.AWS_BUCKET}/${key}`;

    return url;
  } catch (error) {
    console.log('ERROR: Uploading S3 ->', error);
  }
};
