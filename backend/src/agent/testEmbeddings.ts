import { pipeline } from '@huggingface/transformers';

export const createEmbeddingsFromChunks = async (chunks: string[]) => {
  const extractor = await pipeline(
    'feature-extraction',
    'Xenova/bge-small-en-v1.5',
  );
  const output = await extractor(chunks, {
    pooling: 'mean',
    normalize: true,
  });

  return output.tolist();
};
