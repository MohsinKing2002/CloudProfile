import { connectDB } from '../config/db.ts';
import { KnowledgeChunkDB } from '../models/knowledgeChunkSchema.ts';
import { createEmbeddingsFromChunks } from './testEmbeddings.ts';

export const retrieveRelevantChunks = async (question: string) => {
  // 1. connect mongodb
  // await connectDB();

  // 2. create embedding for question
  const queryEmbedding = (await createEmbeddingsFromChunks([question]))[0];

  // 3. retrieve chunks
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

  // 4. return response
  return results;
};

// await retrieveRelevantChunks('How is CloudProfile deployed?');
