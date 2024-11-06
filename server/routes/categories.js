import { Router } from 'express';
import db from '../db.js';

const router = Router();

// Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await db.allAsync('SELECT * FROM categories ORDER BY nom');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create category
router.post('/', async (req, res) => {
  const { nom, description } = req.body;
  try {
    const result = await db.runAsync(
      'INSERT INTO categories (nom, description) VALUES (?, ?)',
      [nom, description]
    );
    res.status(201).json({ id: result.lastID });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update category
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nom, description } = req.body;
  try {
    await db.runAsync(
      'UPDATE categories SET nom = ?, description = ? WHERE id = ?',
      [nom, description, id]
    );
    res.json({ message: 'Category updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete category
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // Check if category is used in products
    const products = await db.getAsync(
      'SELECT COUNT(*) as count FROM produits WHERE categorie_id = ?',
      [id]
    );
    
    if (products.count > 0) {
      return res.status(400).json({
        error: 'Cannot delete category as it is referenced by products'
      });
    }

    await db.runAsync('DELETE FROM categories WHERE id = ?', [id]);
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;