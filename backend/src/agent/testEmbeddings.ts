import { pipeline } from '@huggingface/transformers';

const extractor = await pipeline(
  'feature-extraction',
  'Xenova/bge-small-en-v1.5',
);

const text = 'CloudProfile uses MongoDB as its primary database.';

const output = await extractor(text, {
  pooling: 'mean',
  normalize: true,
});

const embedding = output.tolist()[0];
console.log('emdedding length->>', embedding.length);
console.log('10 - emdeddings ->>', embedding.slice(0, 10));
