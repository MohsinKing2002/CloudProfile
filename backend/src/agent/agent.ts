import { ChatPromptTemplate } from '@langchain/core/prompts';
import { ChatGroq } from '@langchain/groq';
import { RunnableSequence } from '@langchain/core/runnables';
import config from '../config/config.ts';

export const createAgent = () => {
  const model = new ChatGroq({
    apiKey: config.GROK_API_KEY,
    model: 'openai/gpt-oss-120b',
  });

  const prompt = ChatPromptTemplate.fromMessages([
    [
      'system',
      `You are a project assistant.

    Only answer using the provided project context.
    If the answer is not available in the context, say you don't have enough information.
    Do not invent details.

    Project context:
    {context}`,
    ],
    ['user', '{question}'],
  ]);

  const chain = RunnableSequence.from([prompt, model]);
  return chain;
};
