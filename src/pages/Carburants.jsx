import { useState, useEffect } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import Table from '../components/Table';
import Modal from '../components/Modal';
import toast from 'react-hot-toast';
import { fetchFuels } from '../api/client';

export default function Carburants() {
  const [carburants, setCarburants] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentCarburant, setCurrentCarburant] = useState(null);
  const [formData, setFormData] = useState({
    nom: '',
    densiteParLitre: ''
  });

  const columns = [
    { key: 'nom', label: 'Nom' },
    { key: 'densiteParLitre', label: 'Densité par litre' }
  ];

  useEffect(() => {
    loadCarburants();
  }, []);

  const loadCarburants = async () => {
    try {
      const data = await fetchFuels();
      setCarburants(data);
    } catch (error) {
      console.error('Erreur lors du chargement des carburants:', error);
      toast.error('Une erreur est survenue');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = currentCarburant 
        ? `/api/fuels/${currentCarburant.id}`
        : '/api/fuels';
      
      const method = currentCarburant ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Erreur lors de la sauvegarde');

      toast.success(currentCarburant 
        ? 'Carburant modifié avec succès'
        : 'Carburant ajouté avec succès'
      );
      
      loadCarburants();
      setModalOpen(false);
      resetForm();
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Une erreur est survenue');
    }
  };

  const handleEdit = (carburant) => {
    setCurrentCarburant(carburant);
    setFormData(carburant);
    setModalOpen(true);
  };

  const handleDelete = async (carburant) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce carburant ?')) {
      try {
        const response = await fetch(`/api/fuels/${carburant.id}`, {
          method: 'DELETE'
        });

        if (!response.ok) throw new Error('Erreur lors de la suppression');

        toast.success('Carburant supprimé avec succès');
        loadCarburants();
      } catch (error) {
        console.error('Erreur:', error);
        toast.error('Une erreur est survenue');
      }
    }
  };

  const resetForm = () => {
    setCurrentCarburant(null);
    setFormData({
      nom: '',
      densiteParLitre: ''
    });
  };

  return (
    <div className="py-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Gestion des Carburants
        </h2>
        <button
          onClick={() => {
            resetForm();
            setModalOpen(true);
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Nouveau Carburant
        </button>
      </div>

      <Table
        columns={columns}
        data={carburants}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={currentCarburant ? 'Modifier le carburant' : 'Nouveau carburant'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Nom
            </label>
            <input
              type="text"
              required
              value={formData.nom}
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Densité par litre
            </label>
            <input
              type="number"
              step="0.001"
              required
              value={formData.densiteParLitre}
              onChange={(e) => setFormData({ ...formData, densiteParLitre: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button
              type="submit"
              className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto"
            >
              {currentCarburant ? 'Modifier' : 'Ajouter'}
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