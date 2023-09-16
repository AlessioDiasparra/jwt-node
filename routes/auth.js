import { Router } from 'express';
import AuthController from '../controllers/authController.js';
import { checkJwt } from '../middleware/checkJwt.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const router = Router();
// Login route.
router.post('/login', asyncHandler(AuthController.login));

// Change my password.
router.post(
  '/change-password',
  [checkJwt],
  asyncHandler(AuthController.changePassword)
);

export default router;
