import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectData = fs.readFileSync(path.join(__dirname, 'data.txt'), 'utf-8');

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
});

const chunks = await splitter.createDocuments([projectData]);

console.log('Total chunks ->>', chunks.length);
chunks.forEach((chunk, index) => {
  console.log(`\n--- Chunk ${index + 1} ---`);
  console.log(chunk.pageContent);
});
