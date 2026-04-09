import express from 'express';
import auth, { UserRole } from '../../middlewares/auth';
import { AuthController } from './auth.controller';

const router = express.Router();

router.post('/register', AuthController.createUser);

router.post('/login', AuthController.loginUser);

router.get('/me', auth(UserRole.ADMIN, UserRole.USER, UserRole.RUNNER, UserRole.SUPERADMIN), AuthController.getMe);

router.put('/me', auth(UserRole.ADMIN, UserRole.USER, UserRole.RUNNER, UserRole.SUPERADMIN), AuthController.updateMe);

export const AuthRoutes = router;