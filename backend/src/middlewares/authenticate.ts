import { type Request, type Response, type NextFunction } from 'express';
import { errorHandler } from '../utilities/index.ts';
import jwt from 'jsonwebtoken';
import config from '../config/config.ts';
import { UserDB } from '../models/userSchema.ts';

interface ExtendedJwtPayload extends jwt.JwtPayload {
  id: string;
}

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    let token = req?.cookies?.cloudprofile_user_token;

    if (!token) return errorHandler(res, 401, 'Please Login in');

    const decoded = jwt.verify(token, config.SECRET) as ExtendedJwtPayload;
    req.user = await UserDB.findById(decoded.id);

    next();
  } catch (error) {
    next(error);
  }
};
