import { Router } from 'express';
import AuthController from '../controllers/authController.js';
import { checkJwt } from '../middleware/checkJwt.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const auth = Router();
// Login route.
auth.post('/login', asyncHandler(AuthController.login));

// Change my password.
auth.post(
  '/change-password',
  [checkJwt],
  asyncHandler(AuthController.changePassword)
);
export default auth;

