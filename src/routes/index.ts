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
import { TaskStopsRoutes } from '../modules/Task-Stops/task-Stops.route';
import { TaskStatusLogsRoutes } from '../modules/Task-Status-Logs/task-Status-Logs.route';
import { TaskPaymentsRoutes } from '../modules/Task-Payments/task-Payments.route';
import { PaymentRoutes } from '../modules/Payment/payment.route';

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
    path: '/task-stops',
    route: TaskStopsRoutes,
  },
  {
    path: '/task-status-logs',
    route: TaskStatusLogsRoutes,
  },
  {
    path: '/task-payments',
    route: TaskPaymentsRoutes,
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
  {
    path: '/payment',
    route: PaymentRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
