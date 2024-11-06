import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function AlerteStock() {
  const [lowStockProducts, setLowStockProducts] = useState([]);

  useEffect(() => {
    const checkStock = async () => {
      try {
        const response = await fetch('/api/products/low-stock');
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to fetch low stock products');
        }
        const products = await response.json();

        setLowStockProducts(products);

        if (products.length > 0) {
          products.forEach(product => {
            toast.error(`Stock critique: ${product.nom} (${product.quantite} unités restantes)`, {
              duration: 5000,
              position: 'top-right',
              id: `low-stock-${product.id}`, // Prevent duplicate toasts
            });
          });
        }
      } catch (error) {
        console.error('Error checking stock:', error.message);
        toast.error('Erreur lors de la vérification du stock');
      }
    };

    checkStock();
    const interval = setInterval(checkStock, 300000); // Check every 5 minutes

    return () => clearInterval(interval);
  }, []);

  if (lowStockProducts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-red-100 dark:bg-red-900 p-4 rounded-lg shadow-lg">
        <h3 className="text-red-800 dark:text-red-200 font-bold">
          Alertes de stock bas
        </h3>
        <ul className="mt-2 space-y-1">
          {lowStockProducts.map(product => (
            <li key={product.id} className="text-red-700 dark:text-red-300">
              {product.nom}: {product.quantite} unités
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}