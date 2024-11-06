import { Router } from 'express';
import db from '../db.js';

const router = Router();

// Get all suppliers
router.get('/', async (req, res) => {
  try {
    const suppliers = await db.allAsync('SELECT * FROM fournisseurs ORDER BY nom');
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create supplier
router.post('/', async (req, res) => {
  const { nom, adresse, telephone, email } = req.body;
  try {
    const result = await db.runAsync(
      'INSERT INTO fournisseurs (nom, adresse, telephone, email) VALUES (?, ?, ?, ?)',
      [nom, adresse, telephone, email]
    );
    res.status(201).json({ id: result.lastID });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update supplier
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nom, adresse, telephone, email } = req.body;
  try {
    await db.runAsync(
      'UPDATE fournisseurs SET nom = ?, adresse = ?, telephone = ?, email = ? WHERE id = ?',
      [nom, adresse, telephone, email, id]
    );
    res.json({ message: 'Supplier updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete supplier
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.runAsync('DELETE FROM fournisseurs WHERE id = ?', [id]);
    res.json({ message: 'Supplier deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;