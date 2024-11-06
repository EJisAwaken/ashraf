import { useState, useEffect } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import Table from '../components/Table';
import Modal from '../components/Modal';
import toast from 'react-hot-toast';
import { fetchMovements, fetchProducts } from '../api/client';

export default function MouvementsStock() {
  const [mouvements, setMouvements] = useState([]);
  const [produits, setProduits] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    produit_id: '',
    type_id: '',
    quantite: ''
  });

  const columns = [
    { 
      key: 'date_mouvement',
      label: 'Date',
      render: (value) => format(new Date(value), 'dd/MM/yyyy HH:mm', { locale: fr })
    },
    { key: 'produit_nom', label: 'Produit' },
    { key: 'type_mouvement', label: 'Type' },
    { key: 'quantite', label: 'Quantité' }
  ];

  useEffect(() => {
    loadMouvements();
    loadProduits();
  }, []);

  const loadMouvements = async () => {
    try {
      const data = await fetchMovements();
      setMouvements(data);
    } catch (error) {
      console.error('Erreur lors du chargement des mouvements:', error);
      toast.error('Une erreur est survenue');
    }
  };

  const loadProduits = async () => {
    try {
      const data = await fetchProducts();
      setProduits(data);
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error);
      toast.error('Une erreur est survenue');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/movements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors de la sauvegarde');
      }

      toast.success('Mouvement enregistré avec succès');
      loadMouvements();
      loadProduits();
      setModalOpen(false);
      resetForm();
    } catch (error) {
      console.error('Erreur:', error);
      toast.error(error.message || 'Une erreur est survenue');
    }
  };

  const resetForm = () => {
    setFormData({
      produit_id: '',
      type_id: '',
      quantite: ''
    });
  };

  return (
    <div className="py-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Mouvements de Stock
        </h2>
        <button
          onClick={() => {
            resetForm();
            setModalOpen(true);
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Nouveau Mouvement
        </button>
      </div>

      <Table
        columns={columns}
        data={mouvements}
      />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Nouveau mouvement de stock"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Produit
            </label>
            <select
              required
              value={formData.produit_id}
              onChange={(e) => setFormData({ ...formData, produit_id: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="">Sélectionner un produit</option>
              {produits.map((produit) => (
                <option key={produit.id} value={produit.id}>
                  {produit.nom} (Stock: {produit.quantite})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Type de mouvement
            </label>
            <select
              required
              value={formData.type_id}
              onChange={(e) => setFormData({ ...formData, type_id: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="">Sélectionner un type</option>
              <option value="1">Entrée</option>
              <option value="2">Sortie</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Quantité
            </label>
            <input
              type="number"
              required
              min="1"
              value={formData.quantite}
              onChange={(e) => setFormData({ ...formData, quantite: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button
              type="submit"
              className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto"
            >
              Enregistrer
            </button>
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
            >
              Annuler
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}