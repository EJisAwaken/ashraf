import { fetchProducts, fetchCategories, fetchSuppliers, fetchFuels, fetchMovements } from '../api/client';

// Export API functions for database operations
export const db = {
  // Products
  getProducts: fetchProducts,
  getCategories: fetchCategories,
  getSuppliers: fetchSuppliers,
  getFuels: fetchFuels,
  getMovements: fetchMovements,
};

export default db;