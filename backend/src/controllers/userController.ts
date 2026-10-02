import { type NextFunction, type Request, type Response } from 'express';
import {
  responseHandler,
  errorHandler,
  hashPassword,
  verifyPassword,
  generateToken,
} from '../utilities/index.js';
import { UserDB } from '../models/userSchema.js';
import { askProjectAssitant } from '../agent/ragService.js';
import { generateAvatarUploadURL } from '../awsS3/presignedUpload.js';
import { avatarObjectExists, deleteAvatarObject } from '../awsS3/avatar.js';
import { generateAvatarViewURL } from '../awsS3/presignedDownload.js';

/************** avatar - expiry & validation ******************/
const avatarExpiry = Date.now() + 60 * 60 * 1000;

export const ALLOWED_AVATAR_TYPE = [
  'image/jpeg',
  'image/png',
  'image/webp',
] as const;

const isAllowedAvatarType = (
  contentType: string,
): contentType is (typeof ALLOWED_AVATAR_TYPE)[number] => {
  return ALLOWED_AVATAR_TYPE.includes(
    contentType as (typeof ALLOWED_AVATAR_TYPE)[number],
  );
};

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

    const { password: discardPass, ...userData } = user.toObject();
    const avatarKey = userData.avatarKey;

    let avatar;
    // generate signed url - avatar view
    if (avatarKey && avatarKey.trim() !== '') {
      avatar = {
        url: await generateAvatarViewURL(avatarKey),
        expiry: avatarExpiry,
      };
    }

    return responseHandler(
      res,
      200,
      'User is logged in successfully',
      { ...userData, ...(avatar && { avatar }) },
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
    const user = req.user;
    if (!user) return errorHandler(res, 401, 'Unauthorized');

    // *. store the old avatarKey - for deletion.
    const oldAvatarKey = user.avatarKey;

    const { avatarKey, name, bio } = req.body;
    // 1. validate name
    if (name !== undefined && typeof name !== 'string')
      return errorHandler(res, 400, 'Name must be a string');

    // 2. validate bio
    if (bio !== undefined && typeof bio !== 'string')
      return errorHandler(res, 400, 'Bio must be a string');

    // 3. validate avatar
    if (avatarKey !== undefined) {
      // 3.1. avatar type validation
      if (typeof avatarKey !== 'string')
        return errorHandler(res, 400, 'avatarKey must be a string');

      // 3.2. avatar prefix check - with user_id
      const expectedPrefix = `avatars/${user?._id}/`;
      if (!avatarKey.startsWith(expectedPrefix))
        return errorHandler(res, 403, 'Invalid avatar key');

      // 3.3. S3 object existance validation.
      const objExists = await avatarObjectExists(avatarKey);

      if (!objExists)
        return errorHandler(res, 400, 'Avatar object does not exists');
    }

    // 4. update fields - save to db
    if (name !== undefined) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (avatarKey !== undefined) user.avatarKey = avatarKey;

    await user?.save();

    // 5. delete old avatar from s3
    if (avatarKey !== undefined && oldAvatarKey && oldAvatarKey !== avatarKey)
      await deleteAvatarObject(oldAvatarKey);

    let avatar = {
      url: '',
      expiry: avatarExpiry,
    };

    // 6. avatar view - get signed url
    if (avatarKey !== undefined || user.avatarKey) {
      avatar.url = await generateAvatarViewURL(avatarKey ?? user.avatarKey);
    }

    return responseHandler(res, 200, 'Profile is updated successfully', {
      ...user.toObject(),
      avatar,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * User avatar view - s3 presinged url renewal
 * @param Request req
 * @param Response res
 * @param NextFunction next
 * @returns JSON data
 */
export const generateAvatarViewURLController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user;
    if (!user) return errorHandler(res, 401, 'Unathorized');
    if (!user.avatarKey) return errorHandler(res, 404, 'Avatar not found');

    const expectedPrefix = `avatars/${String(user._id)}`;
    if (!user.avatarKey.startsWith(expectedPrefix))
      return errorHandler(res, 403, 'Invalid avatar key');

    const avatar = {
      url: await generateAvatarViewURL(user.avatarKey),
      expiry: avatarExpiry,
    };

    return responseHandler(res, 200, 'Avatar View URL generated successfully', {
      avatar,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Upload User avatar - s3 presinged url
 * @param Request req
 * @param Response res
 * @param NextFunction next
 * @returns JSON data
 */
export const generateAvatarUploadURLController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user;
    const { contentType } = req.body;

    if (!contentType || typeof contentType !== 'string')
      return errorHandler(res, 400, 'Valid contentType is required');

    // typeguard
    if (!isAllowedAvatarType(contentType))
      return errorHandler(res, 400, 'Only JPEG, PNG, WEBP images are allowed');

    const result = await generateAvatarUploadURL(
      String(user?._id),
      contentType,
    );

    return responseHandler(
      res,
      200,
      'Avatar Upload URL generated successfully',
      result,
    );
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

    const answer = await askProjectAssitant(query);

    if (!answer) return errorHandler(res, 500, 'Failed to generate response');

    return responseHandler(res, 200, '', { answer });
  } catch (error) {
    next(error);
  }
};
