import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  username: string;
  email: string;
  avatar: string;
  bio: string;
  password: string;
  feedback: { text: string; rating: number };
  createdAt: Date;
}

const userSchema: Schema = new Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  avatar: { type: String },
  bio: { type: String },
  password: { type: String, required: true, select: false },
  feedback: {
    text: { type: String, default: '' },
    rating: { type: Number, default: 0 },
  },
  createdAt: { type: Date, default: Date.now },
});

export const UserDB = mongoose.model<IUser>('UserDB', userSchema);
