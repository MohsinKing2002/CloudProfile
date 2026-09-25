import mongoose, { Document, Schema } from 'mongoose';

export interface IKnowledgeChunk extends Document {
  chunkId: string;
  text: string;
  embedding: number[];
  metadata: {
    source: string;
  };
}

const knowledgeChunkSchema: Schema = new Schema({
  chunkId: {
    type: String,
    unique: true,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },

  embedding: {
    type: [Number],
    required: true,
  },

  metadata: {
    source: {
      type: String,
      required: true,
    },
  },
});

export const KnowledgeChunkDB = mongoose.model<IKnowledgeChunk>(
  'KnowledgeChunkDB',
  knowledgeChunkSchema,
);
