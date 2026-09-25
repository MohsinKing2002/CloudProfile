import { createHash } from 'node:crypto';

export const generateChunkId = (text: string): string => {
  return createHash('sha256').update(text).digest('hex');
};
