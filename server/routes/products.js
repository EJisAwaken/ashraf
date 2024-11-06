import { Router } from 'express';
import db from '../db.js';

const router = Router();

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await db.allAsync(`
      SELECT p.*, c.nom as categorie_nom
      FROM produits p
      LEFT JOIN categories c ON p.categorie_id = c.id
      ORDER BY p.nom
    `);
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get low stock products
router.get('/low-stock', async (req, res) => {
  try {
    const products = await db.allAsync(`
      SELECT p.*, c.nom as categorie_nom
      FROM produits p
      LEFT JOIN categories c ON p.categorie_id = c.id
      WHERE p.quantite <= 5
      ORDER BY p.quantite ASC
    `);
    res.json(products);
  } catch (error) {
    console.error('Error fetching low stock products:', error);
    res.status(500).json({ error: 'Failed to fetch low stock products' });
  }
});

// Create product
router.post('/', async (req, res) => {
  const { nom, description, prix_unitaire, quantite, categorie_id } = req.body;
  try {
    const result = await db.runAsync(
      'INSERT INTO produits (nom, description, prix_unitaire, quantite, categorie_id) VALUES (?, ?, ?, ?, ?)',
      [nom, description, prix_unitaire, quantite, categorie_id]
    );
    res.status(201).json({ id: result.lastID });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// Update product
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nom, description, prix_unitaire, quantite, categorie_id } = req.body;
  try {
    await db.runAsync(
      'UPDATE produits SET nom = ?, description = ?, prix_unitaire = ?, quantite = ?, categorie_id = ? WHERE id = ?',
      [nom, description, prix_unitaire, quantite, categorie_id, id]
    );
    res.json({ message: 'Product updated successfully' });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Delete product
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // Check if product is used in movements
    const movements = await db.getAsync(
      'SELECT COUNT(*) as count FROM mouvements_stock WHERE produit_id = ?',
      [id]
    );
    
    if (movements.count > 0) {
      return res.status(400).json({
        error: 'Cannot delete product as it is referenced in stock movements'
      });
    }

    await db.runAsync('DELETE FROM produits WHERE id = ?', [id]);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

export default router;