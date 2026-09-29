import {
  HeadObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
} from '@aws-sdk/client-s3';
import { clientS3 } from './index.ts';
import config from '../config/config.ts';

// 1. validate avatar object existance.
export const avatarObjectExists = async (
  avatarKey: string,
): Promise<boolean> => {
  try {
    await clientS3.send(
      new HeadObjectCommand({
        Bucket: config.AWS_BUCKET,
        Key: avatarKey,
      }),
    );

    return true;
  } catch (error: any) {
    if (error?.name === 'NotFound' || error?.$metadata?.httpStatusCode === 404)
      return false;

    throw error;
  }
};

// 2. delete avatar object.
export const deleteAvatarObject = async (avatarKey: string): Promise<void> => {
  await clientS3.send(
    new DeleteObjectCommand({
      Bucket: config.AWS_BUCKET,
      Key: avatarKey,
    }),
  );
};

// 3. list avatar objects
export const listAvatarObjects = async (userId: string) => {
  const prefix = `avatars/${userId}`;

  const response = await clientS3.send(
    new ListObjectsV2Command({
      Bucket: config.AWS_BUCKET,
      Prefix: prefix,
    }),
  );

  return response.Contents ?? [];
};
