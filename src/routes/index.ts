import { Router } from 'express';

// Note: Not Found middleware is handled in app.ts after all routes
import { AuthRoutes } from '../modules/Auth/auth.route';

const router = Router();

const moduleRoutes: { path: string; route: any }[] = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
