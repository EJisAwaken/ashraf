import { Router } from 'express';
import db from '../db.js';

const router = Router();

// Get all fuels
router.get('/', async (req, res) => {
  try {
    const fuels = await db.allAsync('SELECT * FROM carburants ORDER BY nom');
    res.json(fuels);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create fuel
router.post('/', async (req, res) => {
  const { nom, densiteParLitre } = req.body;
  try {
    const result = await db.runAsync(
      'INSERT INTO carburants (nom, densiteParLitre) VALUES (?, ?)',
      [nom, densiteParLitre]
    );
    res.status(201).json({ id: result.lastID });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update fuel
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nom, densiteParLitre } = req.body;
  try {
    await db.runAsync(
      'UPDATE carburants SET nom = ?, densiteParLitre = ? WHERE id = ?',
      [nom, densiteParLitre, id]
    );
    res.json({ message: 'Fuel updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete fuel
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.runAsync('DELETE FROM carburants WHERE id = ?', [id]);
    res.json({ message: 'Fuel deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;