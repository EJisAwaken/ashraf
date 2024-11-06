import { Router } from 'express';
import { db } from '../database.js';

const router = Router();

router.get('/stats', (req, res) => {
  try {
    const stats = {
      totalProducts: db.prepare('SELECT COUNT(*) as count FROM produits').get().count,
      totalMovements: db.prepare('SELECT COUNT(*) as count FROM mouvements_stock').get().count,
      totalSuppliers: db.prepare('SELECT COUNT(*) as count FROM fournisseurs').get().count,
      stockValue: db.prepare('SELECT SUM(prix_unitaire * quantite) as total FROM produits').get().total || 0
    };
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;