import { IUser } from '../../src/models/userSchema.ts';
declare global {
  namespace Express {
    interface Request {
      user?: IUser | null;
    }
  }
}
export {};
