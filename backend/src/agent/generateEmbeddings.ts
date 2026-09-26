import { pipeline } from '@huggingface/transformers';

const extractor = await pipeline(
  'feature-extraction',
  'Xenova/bge-small-en-v1.5',
);

export const generateEmbeddings = async (chunks: string[]) => {
  const output = await extractor(chunks, {
    pooling: 'mean',
    normalize: true,
  });

  return output.tolist();
};
