import { Router } from 'express';
import db from '../db.js';

const router = Router();

router.get('/stats', async (req, res) => {
  try {
    // Use a single query to get all stats for better performance
    const stats = await db.getAsync(`
      SELECT
        (SELECT COUNT(*) FROM produits) as totalProducts,
        (SELECT COUNT(*) FROM mouvements_stock) as totalMovements,
        (SELECT COUNT(*) FROM fournisseurs) as totalSuppliers,
        (SELECT COALESCE(SUM(prix_unitaire * quantite), 0) FROM produits) as stockValue
    `);

    res.json({
      totalProducts: stats.totalProducts,
      totalMovements: stats.totalMovements,
      totalSuppliers: stats.totalSuppliers,
      stockValue: stats.stockValue
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
  }
});

export default router;