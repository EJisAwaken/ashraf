import { Router } from 'express';
import productsRouter from './products.js';
import categoriesRouter from './categories.js';
import suppliersRouter from './suppliers.js';
import fuelsRouter from './fuels.js';
import movementsRouter from './movements.js';
import dashboardRouter from './dashboard.js';

const router = Router();

router.use('/products', productsRouter);
router.use('/categories', categoriesRouter);
router.use('/suppliers', suppliersRouter);
router.use('/fuels', fuelsRouter);
router.use('/movements', movementsRouter);
router.use('/dashboard', dashboardRouter);

export default router;