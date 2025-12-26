import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Loader, Search } from 'lucide-react';
import useProductStore from '../store/useProductStore';
import ProductCard from '../components/ProductCard';

const PRODUCTS_PER_PAGE = 8;

const ProductsPage = () => {
  // 1. GÉRER LE FILTRE DE CATÉGORIE
  const [searchParams] = useSearchParams();
  const categorie = searchParams.get('categorie');

  // 2. GÉRER L'ÉTAT ZUSTAND
  const { products, isLoadingProducts, fetchProducts } = useProductStore();

  // 3. NOUVEAU : ÉTATS POUR LES FILTRES ET LE TRI
  const [searchTerm, setSearchTerm] = useState(''); // Pour le filtre par nom
  const [sortBy, setSortBy] = useState('default'); // 'default', 'price-asc', 'price-desc'

  // 4. CHARGER LES DONNÉES
  useEffect(() => {
    fetchProducts(categorie);
  }, [categorie, fetchProducts]);

  // 5. NOUVEAU : FILTRER ET TRIER LES PRODUITS
  // useMemo garantit que ce calcul ne se refait que si les produits ou les filtres changent
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // A. Filtrer par nom (searchTerm)
    if (searchTerm) {
      result = result.filter(p => 
        p.nom.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // B. Trier (sortBy)
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.prix - b.prix);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.prix - a.prix);
    }
    // (Sinon, garde l'ordre par défaut de la BDD)

    return result;
  }, [products, searchTerm, sortBy]);

  // 6. GÉRER LA PAGINATION (maintenant basée sur la liste filtrée)
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(filteredAndSortedProducts.length / PRODUCTS_PER_PAGE);
  const currentProducts = filteredAndSortedProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  // Réinitialiser à la page 1 si les filtres changent
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortBy, categorie]);
  
  // --- Rendu (Render) ---

  return (
    <div className="p-4 md:p-8 text-black min-h-screen">
      
      {/* Titre et Liens (comme avant) */}
      <h1 className="mt-12 sm:mt-9 text-3xl sm:text-6xl font-bold capitalize mb-4 diamod">
        {categorie ? `${categorie}` : 'ALL PRODUCTS'}
      </h1>
      <div className="breadcrumbs text-sm text-gray-500 mb-6">
        <ul>
          <li><Link to="/products">See All</Link></li>
          <li><Link to="/products?categorie=PHONES">Phones</Link></li>
          <li><Link to="/products?categorie=PC">PC</Link></li>
          <li><Link to="/products?categorie=GAMING">Gaming</Link></li>
          <li><Link to="/products?categorie=CAMERA">Camera</Link></li>
        </ul>
      </div>

      {/* --- NOUVEAU : BARRE DE FILTRES --- */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 p-1 sm:p-4 sm:w-[50%] rounded-lg">
        {/* Filtre par Nom */}
        <label className="input input-bordered flex items-center gap-2 flex-1 ">
          <Search className="w-4 h-4 text-gray-600" />
          <input 
            type="text" 
            className="grow bg-transparent p-2" 
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </label>
        
        {/* Filtre par Prix */}
        <select 
          className="select select-bordered w-full md:w-auto"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="default">Sort by</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>
      
      {/* --- Grille de Produits --- */}
      {isLoadingProducts ? (
        <div className="flex justify-center items-center h-[100vh]">
          <Loader className="size-16 animate-spin" />
        </div>
      ) : currentProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7">
          {currentProducts.map((product) => (
            <ProductCard key={product.id_prod} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 h-[100vh] flex items-center justify-center">
          No products match your filters.
        </p>
      )}

      {/* --- NOUVEAU : PAGINATION (Votre Design) --- */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-12 py-4 border-t border-gray-600">
          <button 
            className="btn btn-ghost disabled:bg-transparent disabled:text-gray-300" 
            onClick={() => setCurrentPage(p => p - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          
          {/* Ligne au milieu (comme sur votre image) */}
          <span className="text-sm text-gray-400">
            Page {currentPage} of {totalPages}
          </span>
          
          <button 
            className="btn btn-ghost disabled:bg-transparent disabled:text-gray-300" 
            onClick={() => setCurrentPage(p => p + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;