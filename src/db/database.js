import { openDB } from 'idb';

const dbName = 'stockDB';
const dbVersion = 1;

export async function initDB() {
  const db = await openDB(dbName, dbVersion, {
    upgrade(db) {
      // Produits
      if (!db.objectStoreNames.contains('produits')) {
        const productStore = db.createObjectStore('produits', { keyPath: 'id', autoIncrement: true });
        productStore.createIndex('nom', 'nom');
        productStore.createIndex('categorie_id', 'categorie_id');
      }

      // Categories
      if (!db.objectStoreNames.contains('categories')) {
        const categoryStore = db.createObjectStore('categories', { keyPath: 'id', autoIncrement: true });
        categoryStore.createIndex('nom', 'nom');
      }

      // Fournisseurs
      if (!db.objectStoreNames.contains('fournisseurs')) {
        const supplierStore = db.createObjectStore('fournisseurs', { keyPath: 'id', autoIncrement: true });
        supplierStore.createIndex('nom', 'nom');
      }

      // Carburants
      if (!db.objectStoreNames.contains('carburants')) {
        const fuelStore = db.createObjectStore('carburants', { keyPath: 'id', autoIncrement: true });
        fuelStore.createIndex('nom', 'nom');
      }

      // Types de mouvements
      if (!db.objectStoreNames.contains('type_mouvements')) {
        const typeStore = db.createObjectStore('type_mouvements', { keyPath: 'id', autoIncrement: true });
        typeStore.createIndex('type', 'type');
        
        // Ajouter les types par défaut
        typeStore.add({ type: 'entrée', id: 1 });
        typeStore.add({ type: 'sortie', id: 2 });
      }

      // Mouvements de stock
      if (!db.objectStoreNames.contains('mouvements_stock')) {
        const movementStore = db.createObjectStore('mouvements_stock', { keyPath: 'id', autoIncrement: true });
        movementStore.createIndex('date_mouvement', 'date_mouvement');
        movementStore.createIndex('produit_id', 'produit_id');
        movementStore.createIndex('type_id', 'type_id');
      }
    },
  });
  return db;
}

// Produits
export async function getAllProducts(searchTerm = '') {
  const db = await initDB();
  const tx = db.transaction('produits', 'readonly');
  const store = tx.objectStore('produits');
  let products = await store.getAll();

  if (searchTerm) {
    products = products.filter(product => 
      product.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  const categoryTx = db.transaction('categories', 'readonly');
  const categoryStore = categoryTx.objectStore('categories');
  const categories = await categoryStore.getAll();
  
  return products.map(product => ({
    ...product,
    categorie_nom: categories.find(c => c.id === product.categorie_id)?.nom || ''
  }));
}

export async function addProduct(product) {
  const db = await initDB();
  const tx = db.transaction('produits', 'readwrite');
  const store = tx.objectStore('produits');
  return store.add(product);
}

export async function updateProduct(product) {
  const db = await initDB();
  const tx = db.transaction('produits', 'readwrite');
  const store = tx.objectStore('produits');
  return store.put(product);
}

export async function deleteProduct(id) {
  const db = await initDB();
  const tx = db.transaction('produits', 'readwrite');
  const store = tx.objectStore('produits');
  return store.delete(id);
}

// Categories
export async function getAllCategories() {
  const db = await initDB();
  const tx = db.transaction('categories', 'readonly');
  const store = tx.objectStore('categories');
  return store.getAll();
}

export async function addCategory(category) {
  const db = await initDB();
  const tx = db.transaction('categories', 'readwrite');
  const store = tx.objectStore('categories');
  return store.add(category);
}

export async function updateCategory(category) {
  const db = await initDB();
  const tx = db.transaction('categories', 'readwrite');
  const store = tx.objectStore('categories');
  return store.put(category);
}

export async function deleteCategory(id) {
  const db = await initDB();
  
  // Vérifier si la catégorie est utilisée
  const productsTx = db.transaction('produits', 'readonly');
  const productsStore = productsTx.objectStore('produits');
  const products = await productsStore.index('categorie_id').getAll(id);
  
  if (products.length > 0) {
    throw new Error('Cette catégorie est utilisée par des produits');
  }
  
  const tx = db.transaction('categories', 'readwrite');
  const store = tx.objectStore('categories');
  return store.delete(id);
}

// Fournisseurs
export async function getAllSuppliers() {
  const db = await initDB();
  const tx = db.transaction('fournisseurs', 'readonly');
  const store = tx.objectStore('fournisseurs');
  return store.getAll();
}

export async function addSupplier(supplier) {
  const db = await initDB();
  const tx = db.transaction('fournisseurs', 'readwrite');
  const store = tx.objectStore('fournisseurs');
  return store.add(supplier);
}

export async function updateSupplier(supplier) {
  const db = await initDB();
  const tx = db.transaction('fournisseurs', 'readwrite');
  const store = tx.objectStore('fournisseurs');
  return store.put(supplier);
}

export async function deleteSupplier(id) {
  const db = await initDB();
  const tx = db.transaction('fournisseurs', 'readwrite');
  const store = tx.objectStore('fournisseurs');
  return store.delete(id);
}

// Carburants
export async function getAllFuels() {
  const db = await initDB();
  const tx = db.transaction('carburants', 'readonly');
  const store = tx.objectStore('carburants');
  return store.getAll();
}

export async function addFuel(fuel) {
  const db = await initDB();
  const tx = db.transaction('carburants', 'readwrite');
  const store = tx.objectStore('carburants');
  return store.add(fuel);
}

export async function updateFuel(fuel) {
  const db = await initDB();
  const tx = db.transaction('carburants', 'readwrite');
  const store = tx.objectStore('carburants');
  return store.put(fuel);
}

export async function deleteFuel(id) {
  const db = await initDB();
  const tx = db.transaction('carburants', 'readwrite');
  const store = tx.objectStore('carburants');
  return store.delete(id);
}

// Mouvements de stock
export async function getAllMovements() {
  const db = await initDB();
  const tx = db.transaction(['mouvements_stock', 'produits', 'type_mouvements'], 'readonly');
  const movementsStore = tx.objectStore('mouvements_stock');
  const productsStore = tx.objectStore('produits');
  const typesStore = tx.objectStore('type_mouvements');

  const movements = await movementsStore.getAll();
  const products = await productsStore.getAll();
  const types = await typesStore.getAll();

  return movements.map(movement => ({
    ...movement,
    produit_nom: products.find(p => p.id === movement.produit_id)?.nom || '',
    type_mouvement: types.find(t => t.id === movement.type_id)?.type || ''
  }));
}

export async function addMovement(movement) {
  const db = await initDB();
  const tx = db.transaction(['mouvements_stock', 'produits'], 'readwrite');
  const movementsStore = tx.objectStore('mouvements_stock');
  const productsStore = tx.objectStore('produits');

  // Vérifier le stock pour les sorties
  if (movement.type_id === 2) {
    const product = await productsStore.get(movement.produit_id);
    if (product.quantite < movement.quantite) {
      throw new Error('Stock insuffisant');
    }
  }

  // Mettre à jour le stock
  const product = await productsStore.get(movement.produit_id);
  const newQuantity = movement.type_id === 1 
    ? product.quantite + movement.quantite 
    : product.quantite - movement.quantite;

  await productsStore.put({
    ...product,
    quantite: newQuantity
  });

  // Ajouter le mouvement
  movement.date_mouvement = new Date().toISOString();
  return movementsStore.add(movement);
}

// Statistiques pour le tableau de bord
export async function getDashboardStats() {
  const db = await initDB();
  const tx = db.transaction(['produits', 'mouvements_stock', 'fournisseurs'], 'readonly');
  
  const productsStore = tx.objectStore('produits');
  const movementsStore = tx.objectStore('mouvements_stock');
  const suppliersStore = tx.objectStore('fournisseurs');

  const products = await productsStore.getAll();
  const movements = await movementsStore.getAll();
  const suppliers = await suppliersStore.getAll();

  const stockValue = products.reduce((total, product) => 
    total + (product.prix_unitaire * product.quantite), 0);

  return {
    totalProducts: products.length,
    totalMovements: movements.length,
    totalSuppliers: suppliers.length,
    stockValue
  };
}