import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { promisify } from 'util';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new sqlite3.Database(join(__dirname, '../stock.db'));

// Promisify database methods
db.getAsync = promisify(db.get).bind(db);
db.allAsync = promisify(db.all).bind(db);
db.runAsync = promisify(db.run).bind(db);

// Initialize database schema
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nom TEXT NOT NULL,
      description TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS carburants (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nom TEXT NOT NULL,
      densiteParLitre REAL NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS emplacements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nom TEXT NOT NULL,
      capacite INTEGER NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS fournisseurs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nom TEXT NOT NULL,
      adresse TEXT,
      telephone TEXT,
      email TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS produits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nom TEXT NOT NULL,
      description TEXT,
      prix_unitaire REAL NOT NULL,
      quantite INTEGER NOT NULL,
      categorie_id INTEGER,
      FOREIGN KEY (categorie_id) REFERENCES categories(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS type_mouvements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL CHECK (type IN ('entrée', 'sortie'))
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS mouvements_stock (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date_mouvement DATETIME DEFAULT CURRENT_TIMESTAMP,
      quantite INTEGER NOT NULL,
      type_id INTEGER,
      produit_id INTEGER,
      emplacement_id INTEGER,
      FOREIGN KEY (type_id) REFERENCES type_mouvements(id),
      FOREIGN KEY (produit_id) REFERENCES produits(id),
      FOREIGN KEY (emplacement_id) REFERENCES emplacements(id)
    )
  `);

  // Insert default movement types if they don't exist
  db.get('SELECT COUNT(*) as count FROM type_mouvements', [], (err, row) => {
    if (err) {
      console.error('Error checking movement types:', err);
      return;
    }
    if (row.count === 0) {
      db.run("INSERT INTO type_mouvements (type) VALUES ('entrée')");
      db.run("INSERT INTO type_mouvements (type) VALUES ('sortie')");
    }
  });
});

export default db;