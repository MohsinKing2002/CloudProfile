import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { ChatGroq } from '@langchain/groq';
import { RunnableSequence } from '@langchain/core/runnables';
import config from '../config/config.ts';

export const createAgent = () => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const projectData = fs.readFileSync(
    path.join(__dirname, 'data.txt'),
    'utf-8',
  );

  const model = new ChatGroq({
    apiKey: config.GROK_API_KEY,
    model: 'llama-3.3-70b-versatile',
  });

  const prompt = ChatPromptTemplate.fromMessages([
    [
      'system',
      `You are a project assistant. Only use this project documentation:\n\n${projectData}`,
    ],
    ['user', '{question}'],
  ]);

  const chain = RunnableSequence.from([prompt, model]);
  return chain;
};
