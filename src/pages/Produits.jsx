import { useState, useEffect } from 'react';
import { PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Table from '../components/Table';
import Modal from '../components/Modal';
import toast from 'react-hot-toast';
import { 
  getAllProducts, 
  getAllCategories, 
  addProduct, 
  updateProduct, 
  deleteProduct 
} from '../db/database';

export default function Produits() {
  const [produits, setProduits] = useState([]);
  const [categories, setCategories] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentProduit, setCurrentProduit] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    prix_unitaire: '',
    quantite: '',
    categorie_id: ''
  });

  const columns = [
    { key: 'nom', label: 'Nom' },
    { key: 'description', label: 'Description' },
    { key: 'prix_unitaire', label: 'Prix unitaire' },
    { key: 'quantite', label: 'Quantité' },
    { key: 'categorie_nom', label: 'Catégorie' }
  ];

  useEffect(() => {
    loadProduits();
    loadCategories();
  }, [searchTerm]);

  const loadProduits = async () => {
    try {
      const data = await getAllProducts(searchTerm);
      setProduits(data);
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error);
      toast.error('Erreur lors du chargement des produits');
    }
  };

  const loadCategories = async () => {
    try {
      const data = await getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error);
      toast.error('Erreur lors du chargement des catégories');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productData = {
        ...formData,
        prix_unitaire: parseFloat(formData.prix_unitaire),
        quantite: parseInt(formData.quantite),
        categorie_id: formData.categorie_id ? parseInt(formData.categorie_id) : null
      };

      if (currentProduit) {
        await updateProduct({ ...productData, id: currentProduit.id });
        toast.success('Produit modifié avec succès');
      } else {
        await addProduct(productData);
        toast.success('Produit ajouté avec succès');
      }
      
      loadProduits();
      setModalOpen(false);
      resetForm();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast.error('Une erreur est survenue');
    }
  };

  const handleEdit = (produit) => {
    setCurrentProduit(produit);
    setFormData({
      ...produit,
      categorie_id: produit.categorie_id?.toString() || ''
    });
    setModalOpen(true);
  };

  const handleDelete = async (produit) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      try {
        await deleteProduct(produit.id);
        toast.success('Produit supprimé avec succès');
        loadProduits();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        toast.error('Une erreur est survenue');
      }
    }
  };

  const resetForm = () => {
    setCurrentProduit(null);
    setFormData({
      nom: '',
      description: '',
      prix_unitaire: '',
      quantite: '',
      categorie_id: ''
    });
  };

  return (
    <div className="py-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Gestion des Produits
        </h2>
        <button
          onClick={() => {
            resetForm();
            setModalOpen(true);
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Nouveau Produit
        </button>
      </div>

      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Rechercher un produit..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600"
          />
          <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      <Table
        columns={columns}
        data={produits}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={currentProduit ? 'Modifier le produit' : 'Nouveau produit'}
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
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Prix unitaire
            </label>
            <input
              type="number"
              step="0.01"
              required
              value={formData.prix_unitaire}
              onChange={(e) => setFormData({ ...formData, prix_unitaire: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Quantité
            </label>
            <input
              type="number"
              required
              value={formData.quantite}
              onChange={(e) => setFormData({ ...formData, quantite: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Catégorie
            </label>
            <select
              value={formData.categorie_id}
              onChange={(e) => setFormData({ ...formData, categorie_id: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="">Sélectionner une catégorie</option>
              {categories.map((categorie) => (
                <option key={categorie.id} value={categorie.id}>
                  {categorie.nom}
                </option>
              ))}
            </select>
          </div>
          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button
              type="submit"
              className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto"
            >
              {currentProduit ? 'Modifier' : 'Ajouter'}
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