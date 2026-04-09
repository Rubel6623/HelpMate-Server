import { Router } from 'express';

// Note: Not Found middleware is handled in app.ts after all routes
const router = Router();

const moduleRoutes: { path: string; route: any }[] = [
  // {
  //   path: '/users',
  //   route: UserRoutes,
  // },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
