import { useState, useEffect } from 'react';
import { CubeIcon, TruckIcon, ArrowsRightLeftIcon, CurrencyEuroIcon } from '@heroicons/react/24/outline';
import AlerteStock from '../components/AlerteStock';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalMovements: 0,
    totalSuppliers: 0,
    stockValue: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/dashboard/stats');
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to load dashboard statistics');
        }
        
        const data = await response.json();
        setStats(data);
        setError(null);
      } catch (error) {
        console.error('Erreur lors du chargement des statistiques:', error.message);
        setError('Impossible de charger les statistiques du tableau de bord');
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const StatCard = ({ icon: Icon, title, value, loading }) => (
    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Icon className="h-6 w-6 text-gray-400" aria-hidden="true" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                {title}
              </dt>
              <dd className="text-lg font-medium text-gray-900 dark:text-white">
                {loading ? (
                  <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-6 w-20 rounded"></div>
                ) : (
                  value
                )}
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="py-6">
      <AlerteStock />
      
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
        Tableau de Bord
      </h2>

      {error && (
        <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={CubeIcon}
          title="Total Produits"
          value={stats.totalProducts}
          loading={loading}
        />
        <StatCard
          icon={ArrowsRightLeftIcon}
          title="Total Mouvements"
          value={stats.totalMovements}
          loading={loading}
        />
        <StatCard
          icon={TruckIcon}
          title="Total Fournisseurs"
          value={stats.totalSuppliers}
          loading={loading}
        />
        <StatCard
          icon={CurrencyEuroIcon}
          title="Valeur du Stock"
          value={`${stats.stockValue.toFixed(2)} €`}
          loading={loading}
        />
      </div>
    </div>
  );
}