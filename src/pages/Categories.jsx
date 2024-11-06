import { useState, useEffect } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import Table from '../components/Table';
import Modal from '../components/Modal';
import toast from 'react-hot-toast';
import { 
  getAllCategories, 
  addCategory, 
  updateCategory, 
  deleteCategory 
} from '../db/database';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentCategorie, setCurrentCategorie] = useState(null);
  const [formData, setFormData] = useState({
    nom: '',
    description: ''
  });

  const columns = [
    { key: 'nom', label: 'Nom' },
    { key: 'description', label: 'Description' }
  ];

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error);
      toast.error('Une erreur est survenue');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentCategorie) {
        await updateCategory({ ...formData, id: currentCategorie.id });
        toast.success('Catégorie modifiée avec succès');
      } else {
        await addCategory(formData);
        toast.success('Catégorie ajoutée avec succès');
      }
      loadCategories();
      setModalOpen(false);
      resetForm();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast.error('Une erreur est survenue');
    }
  };

  const handleEdit = (categorie) => {
    setCurrentCategorie(categorie);
    setFormData(categorie);
    setModalOpen(true);
  };

  const handleDelete = async (categorie) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      try {
        await deleteCategory(categorie.id);
        toast.success('Catégorie supprimée avec succès');
        loadCategories();
      } catch (error) {
        if (error.message === 'Cette catégorie est utilisée par des produits') {
          toast.error(error.message);
        } else {
          console.error('Erreur lors de la suppression:', error);
          toast.error('Une erreur est survenue');
        }
      }
    }
  };

  const resetForm = () => {
    setCurrentCategorie(null);
    setFormData({
      nom: '',
      description: ''
    });
  };

  return (
    <div className="py-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Gestion des Catégories
        </h2>
        <button
          onClick={() => {
            resetForm();
            setModalOpen(true);
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Nouvelle Catégorie
        </button>
      </div>

      <Table
        columns={columns}
        data={categories}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={currentCategorie ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
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
              Description
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button
              type="submit"
              className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto"
            >
              {currentCategorie ? 'Modifier' : 'Ajouter'}
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