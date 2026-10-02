import { agent } from './agent.js';
import { buildContext } from './contextBuilder.js';
import { retrieveRelevantChunks } from './retriever.js';

export const askProjectAssitant = async (question: string) => {
  // 1. retrieve relevant chunks
  const results = await retrieveRelevantChunks(question);

  // 2. build context
  const context = buildContext(results);

  // 3. invoke agent
  const response = await agent.invoke({
    context,
    question,
  });

  // 4. return response
  return response.content;
};
