const API_BASE_URL = '/api';

// Products
export const fetchProducts = async () => {
  const response = await fetch(`${API_BASE_URL}/products`);
  if (!response.ok) throw new Error('Failed to fetch products');
  return response.json();
};

// Categories
export const fetchCategories = async () => {
  const response = await fetch(`${API_BASE_URL}/categories`);
  if (!response.ok) throw new Error('Failed to fetch categories');
  return response.json();
};

// Suppliers
export const fetchSuppliers = async () => {
  const response = await fetch(`${API_BASE_URL}/suppliers`);
  if (!response.ok) throw new Error('Failed to fetch suppliers');
  return response.json();
};

// Fuels
export const fetchFuels = async () => {
  const response = await fetch(`${API_BASE_URL}/fuels`);
  if (!response.ok) throw new Error('Failed to fetch fuels');
  return response.json();
};

// Movements
export const fetchMovements = async () => {
  const response = await fetch(`${API_BASE_URL}/movements`);
  if (!response.ok) throw new Error('Failed to fetch movements');
  return response.json();
};

// Dashboard
export const fetchDashboardStats = async () => {
  const response = await fetch(`${API_BASE_URL}/dashboard/stats`);
  if (!response.ok) throw new Error('Failed to fetch dashboard stats');
  return response.json();
};

// Generic CRUD operations
export const createResource = async (endpoint, data) => {
  const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error(`Failed to create ${endpoint}`);
  return response.json();
};

export const updateResource = async (endpoint, id, data) => {
  const response = await fetch(`${API_BASE_URL}/${endpoint}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error(`Failed to update ${endpoint}`);
  return response.json();
};

export const deleteResource = async (endpoint, id) => {
  const response = await fetch(`${API_BASE_URL}/${endpoint}/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error(`Failed to delete ${endpoint}`);
  return response.json();
};