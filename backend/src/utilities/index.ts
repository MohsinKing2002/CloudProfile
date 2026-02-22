import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { Response } from 'express';
import config from '../config/config.ts';

/**
 * Helper func: Response Handler
 * @param Response res
 * @param number statusCode
 * @param string message
 * @param json data
 * @param cookie token
 * @returns json data
 */
export const responseHandler = (
  res: Response,
  statusCode: number = 200,
  message?: string,
  data: any = null,
  token?: string,
) => {
  const resp: any = { status: true };
  if (message) resp.message = message;
  if (data !== null) resp.data = data;

  if (token)
    res
      .status(statusCode)
      .cookie('cloudprofile_user_token', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 24 Hour
      })
      .json(resp);
  else res.status(statusCode).json(resp);
};

/**
 * Helper func: Error Handler
 * @param Response res
 * @param number statusCode
 * @param string message
 * @param json data
 */
export const errorHandler = (
  res: Response,
  statusCode: number = 500,
  message?: string,
  data: any = null,
) => {
  const resp: any = { status: false };
  if (message) resp.message = message;
  if (data !== null) resp.data = data;
  res.status(statusCode).json(resp);
};

/**
 * Helper func: Hash Password
 * @param string password
 * @returns string hashpassword
 */
export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 10);
};

/**
 * Helper func: Verify Hashed Password
 * @param string password
 * @param hash hashedPassword
 * @returns boolean true/false
 */
export const verifyPassword = async (
  password: string,
  hashedPassword: string,
) => {
  return await bcrypt.compare(password, hashedPassword);
};

/**
 * Helper func: Generate JWT token
 * @param string user id
 * @returns string token
 */
export const generateToken = (userId: string) => {
  return jwt.sign(
    {
      id: userId,
    },
    config.SECRET,
    { expiresIn: '24h' },
  );
};
