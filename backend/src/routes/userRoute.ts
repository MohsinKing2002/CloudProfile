import multer, { type Multer } from 'multer';
import { Router } from 'express';
import {
  deleteUser,
  getAllUsers,
  getAnswersFromAI,
  loginUser,
  provideFeedback,
  registerUser,
  updateUser,
} from '../controllers/userController.ts';
import { isAuthenticated } from '../middlewares/authenticate.ts';

const router: Router = Router();
const uploader: Multer = multer();

// auth api routes
router.post('/login', loginUser);
router.post('/register', registerUser);

// authenticated routes
router.put('/update-profile', uploader.none(), isAuthenticated, updateUser);
router.post('/user-feedback', isAuthenticated, provideFeedback);
router.delete('/delete-profile', isAuthenticated, deleteUser);
router.get('/all-users', isAuthenticated, getAllUsers);
router.post('/chat', isAuthenticated, getAnswersFromAI);

export default router;
