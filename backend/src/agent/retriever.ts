import { KnowledgeChunkDB } from '../models/knowledgeChunkSchema.ts';
import { generateEmbeddings } from './generateEmbeddings.ts';

export const retrieveRelevantChunks = async (question: string) => {
  // 1. create embedding for question
  const queryEmbedding = (await generateEmbeddings([question]))[0];

  // 2. retrieve chunks
  const results = await KnowledgeChunkDB.aggregate([
    {
      $vectorSearch: {
        index: 'vector_index',
        path: 'embedding',
        queryVector: queryEmbedding,
        numCandidates: 10,
        limit: 3,
      },
    },
    {
      $project: {
        _id: 0,
        chunkId: 1,
        text: 1,
        metadata: 1,
        score: {
          $meta: 'vectorSearchScore',
        },
      },
    },
  ]);

  // 3. return response
  return results;
};
