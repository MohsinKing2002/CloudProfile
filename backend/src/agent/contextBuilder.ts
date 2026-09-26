export const buildContext = (chunks: { text: string }[]): string => {
  return chunks
    .map((chunk, ind) => {
      return `[Context ${ind + 1}]\n${chunk.text}`;
    })
    .join('\n\n');
};
