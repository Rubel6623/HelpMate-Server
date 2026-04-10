import { Router } from 'express';
import { AuthRoutes } from '../modules/Auth/auth.route';
import { CategoriesRoutes } from '../modules/Categories/categories.route';
import { TasksRoutes } from '../modules/Tasks/tasks.route';
import { TaskApplicationsRoutes } from '../modules/Task-Applications/task-Applications.route';
import { AssignmentsRoutes } from '../modules/Assignments/assignments.route';
import { RunnerProfilesRoutes } from '../modules/Runner-Profiles/runner-Profiles.route';
import { WalletsRoutes } from '../modules/Wallets/wallets.route';
import { ReviewsRoutes } from '../modules/Reviews/reviews.route';
import { DisputesRoutes } from '../modules/Disputes/disputes.route';
import { NotificationsRoutes } from '../modules/Notifications/notifications.route';
import { SosAlertsRoutes } from '../modules/Sos-Alerts/sos-Alerts.route';
import { UserRoutes } from '../modules/User/user.route';
import { TransactionsRoutes } from '../modules/Transactions/transactions.route';
import { BadgesRoutes } from '../modules/Badges/badges.route';
import { UserBadgesRoutes } from '../modules/User-Badges/user-Badges.route';

const router = Router();

const moduleRoutes: { path: string; route: any }[] = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/categories',
    route: CategoriesRoutes,
  },
  {
    path: '/tasks',
    route: TasksRoutes,
  },
  {
    path: '/task-applications',
    route: TaskApplicationsRoutes,
  },
  {
    path: '/assignments',
    route: AssignmentsRoutes,
  },
  {
    path: '/runner-profiles',
    route: RunnerProfilesRoutes,
  },
  {
    path: '/wallets',
    route: WalletsRoutes,
  },
  {
    path: '/transactions',
    route: TransactionsRoutes,
  },
  {
    path: '/reviews',
    route: ReviewsRoutes,
  },
  {
    path: '/disputes',
    route: DisputesRoutes,
  },
  {
    path: '/notifications',
    route: NotificationsRoutes,
  },
  {
    path: '/sos-alerts',
    route: SosAlertsRoutes,
  },
  {
    path: '/badges',
    route: BadgesRoutes,
  },
  {
    path: '/user-badges',
    route: UserBadgesRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
