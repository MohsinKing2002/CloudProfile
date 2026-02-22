import { type NextFunction, type Request, type Response } from 'express';
import {
  responseHandler,
  errorHandler,
  hashPassword,
  verifyPassword,
  generateToken,
} from '../utilities/index.ts';
import { UserDB } from '../models/userSchema.ts';
import { createAgent } from '../agent/agent.ts';
import { uploadAvatarAndGetUrl } from '../awsS3/index.ts';

/**
 * Register User API
 * @param Request req
 * @param Response res
 * @param NextFunction next
 * @returns JSON data
 */
export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return errorHandler(res, 400, 'All fields are required');

    const isUserExists = await UserDB.findOne({ email });

    if (isUserExists)
      return errorHandler(res, 400, 'Email or Username is already exists');

    const hashedPassword = await hashPassword(password);
    const username = email?.slice(0, 4) + Math.floor(Math.random() * 1000);
    const user = await UserDB.create({
      username,
      name,
      email,
      password: hashedPassword,
    });
    const token = generateToken(String(user._id));

    let userdata = { ...user.toObject(), token };
    return responseHandler(
      res,
      201,
      'User is registered successfully',
      userdata,
      token,
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Login User API
 * @param Request req
 * @param Response res
 * @param NextFunction next
 * @returns JSON data
 */
export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { loginIdentifier, password } = req.body;

    if (!loginIdentifier || !password)
      return errorHandler(res, 400, 'All fields are required!');

    const user = await UserDB.findOne({
      $or: [{ username: loginIdentifier }, { email: loginIdentifier }],
    }).select('+password');

    if (!user)
      return errorHandler(res, 404, 'User not found with email/username.');

    const isCorrectPassword = await verifyPassword(password, user.password);

    if (!isCorrectPassword)
      return errorHandler(res, 400, 'Invalid Login credentials.');

    const token = generateToken(String(user._id));

    let userdata = { ...user.toObject(), token };
    return responseHandler(
      res,
      200,
      'User is logged in successfully',
      userdata,
      token,
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Update User Profile API
 * @param Request req
 * @param Response res
 * @param NextFunction next
 * @returns JSON data
 */
export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { avatar, name, bio } = req.body;
    const user = req.user;

    if (name && user) user.name = name;
    if (bio && user) user.bio = bio;
    if (avatar && user) {
      const avatar_url = await uploadAvatarAndGetUrl(
        avatar,
        String(user.username),
      );
      user.avatar = avatar_url ?? '';
    }

    await user?.save();
    return responseHandler(res, 200, 'Profile is updated successfully', user);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete User Profile API
 * @param Request req
 * @param Response res
 * @param NextFunction next
 * @returns JSON data
 */
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { password } = req.body;
    if (!password) return errorHandler(res, 400, 'Password is required!');

    const user = await UserDB.findOne({ _id: req.user?._id }).select(
      '+password',
    );

    if (!user) return errorHandler(res, 404, 'User not found');

    const isCorrectPassword = await verifyPassword(password, user.password);

    if (!isCorrectPassword)
      return errorHandler(res, 400, 'Password is not correct.');

    await UserDB.findByIdAndDelete(user._id);

    return res
      .status(200)
      .cookie('cloudprofile_user_token', null, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        expires: new Date(),
      })
      .json({
        status: true,
        message: 'Profile deleted successfully',
      });
  } catch (error) {
    next(error);
  }
};

/**
 * Get All Users API
 * @param Request req
 * @param Response res
 * @param NextFunction next
 * @returns JSON data
 */
export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const users = await UserDB.find();

    return responseHandler(res, 200, '', users);
  } catch (error) {
    next(error);
  }
};

/**
 * User Feedback API
 * @param Request req
 * @param Response res
 * @param NextFunction next
 * @returns JSON data
 */
export const provideFeedback = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { feedback_text, rating } = req.body;
    const user = req.user;

    if (!feedback_text || !rating)
      return errorHandler(res, 400, 'All fields are required.');

    if (feedback_text && user) user.feedback.text = feedback_text;
    if (rating && user) user.feedback.rating = rating;

    await user?.save();

    return responseHandler(
      res,
      200,
      'Your feedback has been submitted successfully.',
      user,
    );
  } catch (error) {
    next(error);
  }
};

/**
 * AI Assistance API
 * @param Request req
 * @param Response res
 * @param NextFunction next
 * @returns JSON data
 */
export const getAnswersFromAI = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { query } = req.body;

    if (!query) return errorHandler(res, 400, 'Query must not be empty');

    const grokAgent = createAgent();
    const { lc_kwargs } = await grokAgent.invoke({
      question: query,
    });

    if (!lc_kwargs)
      return errorHandler(res, 500, 'Failed to generate response');

    return responseHandler(res, 200, '', { answer: lc_kwargs?.content });
  } catch (error) {
    next(error);
  }
};
