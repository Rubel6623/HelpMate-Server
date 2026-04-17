import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import notFound from './middlewares/notFound';
import globalErrorHandler from './middlewares/globalErrorHandler';
import router from './routes';
import { PaymentController } from './modules/Payment/payment.controller';

const app: Application = express();

// parsers
// Webhook route needs to be before express.json() to get the raw body
app.post(
  '/api/v1/payment/webhook',
  express.raw({ type: 'application/json' }),
  PaymentController.stripeWebhook
);

app.use(express.json());
app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:5173'], credentials: true }));
app.use(cookieParser());
 
// application routes
app.use('/api/v1', router);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello from HelpMate World!');
});

// Not Found
app.use(notFound);

// global error handler
app.use(globalErrorHandler);

export default app;
