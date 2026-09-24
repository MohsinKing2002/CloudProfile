/************** Purpose: Read knowledge → chunk it → embed it → save it to MongoDB.  **************/

import { connectDB } from '../config/db.ts';
import { KnowledgeChunkDB } from '../models/knowledgeChunkSchema.ts';
import { createEmbeddingsFromChunks } from './testEmbeddings.ts';
import { createChunks } from './textChunking.ts';

const ingestKnowledge = async () => {
  // 1. connect mongodb
  await connectDB();

  // 2. read knowledge and create chunks
  const chunks = await createChunks();

  // 3. extract text from chunks
  const chunkStrings = chunks.map((chunk) => chunk.pageContent);

  // 4. generate embeddings
  const embeddings = await createEmbeddingsFromChunks(chunkStrings);

  // 5. create mongodb documents - text, embedding, metadata.source
  const knowledgeChunks = embeddings.map((embedding, ind) => ({
    text: chunkStrings[ind],
    embedding,
    metadata: {
      source: 'data.txt',
    },
  }));

  // 6. save documents to mongodb
  await KnowledgeChunkDB.insertMany(knowledgeChunks);

  // 7. print useful information
  console.log(`Successfully inserted ${knowledgeChunks.length} chunks.`);
};

await ingestKnowledge();
