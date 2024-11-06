import { Router } from 'express';
import db from '../db.js';

const router = Router();

// Get all movements
router.get('/', async (req, res) => {
  try {
    const movements = await db.allAsync(`
      SELECT 
        m.*,
        p.nom as produit_nom,
        t.type as type_mouvement
      FROM mouvements_stock m
      JOIN produits p ON m.produit_id = p.id
      JOIN type_mouvements t ON m.type_id = t.id
      ORDER BY m.date_mouvement DESC
    `);
    res.json(movements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create movement
router.post('/', async (req, res) => {
  const { produit_id, type_id, quantite } = req.body;
  
  try {
    // Start transaction
    await db.runAsync('BEGIN TRANSACTION');

    // Check stock for outgoing movements
    if (type_id === '2') { // Sortie
      const product = await db.getAsync(
        'SELECT quantite FROM produits WHERE id = ?',
        [produit_id]
      );

      if (!product) {
        await db.runAsync('ROLLBACK');
        return res.status(400).json({ error: 'Produit non trouvé' });
      }

      if (product.quantite < parseInt(quantite)) {
        await db.runAsync('ROLLBACK');
        return res.status(400).json({ error: 'Stock insuffisant' });
      }
    }

    // Create movement
    const result = await db.runAsync(
      'INSERT INTO mouvements_stock (produit_id, type_id, quantite, date_mouvement) VALUES (?, ?, ?, datetime("now"))',
      [produit_id, type_id, quantite]
    );

    // Update product stock
    const stockUpdate = type_id === '1' ? '+' : '-';
    await db.runAsync(
      `UPDATE produits SET quantite = quantite ${stockUpdate} ? WHERE id = ?`,
      [parseInt(quantite), produit_id]
    );

    // Commit transaction
    await db.runAsync('COMMIT');

    res.status(201).json({ id: result.lastID });
  } catch (error) {
    await db.runAsync('ROLLBACK');
    console.error('Error creating movement:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;