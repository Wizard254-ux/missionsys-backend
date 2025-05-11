import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import contactRoutes from './routes/contactRoutes';
import commentRoutes from './routes/commentRoutes';
import bookingRoutes from './routes/bookingRoutes'; // Import the new booking routes

const app: Application = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:5173','https://travis-adventures.vercel.app'], // allow only this origin
  credentials: true,              // if using cookies or auth headers
}));app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', contactRoutes);
app.use('/api', commentRoutes);
app.use('/api', bookingRoutes); // Add booking routes

app.get('/server/on', (req: Request, res: Response) => {
  res.send(' Server Running');
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

export default app;