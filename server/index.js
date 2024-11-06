import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import productsRouter from './routes/products.js';
import categoriesRouter from './routes/categories.js';
import suppliersRouter from './routes/suppliers.js';
import fuelsRouter from './routes/fuels.js';
import movementsRouter from './routes/movements.js';
import dashboardRouter from './routes/dashboard.js';

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/products', productsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/suppliers', suppliersRouter);
app.use('/api/fuels', fuelsRouter);
app.use('/api/movements', movementsRouter);
app.use('/api/dashboard', dashboardRouter);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});