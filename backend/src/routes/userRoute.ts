import { Router } from 'express';
import {
  deleteUser,
  getAllUsers,
  getAnswersFromAI,
  loginUser,
  provideFeedback,
  registerUser,
  updateUser,
  generateAvatarUploadURLController,
  generateAvatarViewURLController,
} from '../controllers/userController.ts';
import { isAuthenticated } from '../middlewares/authenticate.ts';

const router: Router = Router();

// auth api routes
router.post('/login', loginUser);
router.post('/register', registerUser);

/************* authenticated routes *************/
// update/delete - profile related
router.put('/update-profile', isAuthenticated, updateUser);
router.delete('/delete-profile', isAuthenticated, deleteUser);

// all users
router.get('/all-users', isAuthenticated, getAllUsers);

// avatar - related
router.get(
  '/avatar/view-url',
  isAuthenticated,
  generateAvatarViewURLController,
);
router.post(
  '/avatar/upload-url',
  isAuthenticated,
  generateAvatarUploadURLController,
);

// feedback
router.post('/user-feedback', isAuthenticated, provideFeedback);

// ai project assitant
router.post('/chat', isAuthenticated, getAnswersFromAI);

export default router;
