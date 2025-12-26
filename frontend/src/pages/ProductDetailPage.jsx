import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useProductStore from '../store/useProductStore';
import { Loader, ShoppingCart } from 'lucide-react';
// J'importe votre ProductCard existant pour l'uniformité du design
import ProductCard from '../components/ProductCard'; 
import useCartStore from '../store/useCartStore';

const ProductDetailPage = () => {
  const { sku } = useParams();
  const {addToCart} = useCartStore();

  const {
    selectedProduct,
    isLoadingSelected,
    fetchProductBySku,
    recommendationsA,
    isLoadingRecsA,
    fetchRecommendationsA
  } = useProductStore();

  useEffect(() => {
    window.scrollTo(0, 0); 
    if (sku) {
      fetchProductBySku(sku);
      fetchRecommendationsA(sku);
    }
  }, [sku, fetchProductBySku, fetchRecommendationsA]);

  if (isLoadingSelected || !selectedProduct) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="size-16 animate-spin text-black" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f1f1f1] pt-24 pb-12 px-4 md:px-10 text-black">
       <svg className="absolute w-0 h-0">
        
      </svg>
      {/* --- Section Produit Principal (Design Pro) --- */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

          {/* Côté Gauche : Image (Style Minimaliste) */}
          <div className="aspect-square relative flex items-center justify-center overflow-hidden border-r-1 border-gray-300">
            <img 
              src={selectedProduct.img_url || 'https://sm.ign.com/t/ign_tr/photo/e/every-play/every-playstation-console-a-full-history-of-release-dates_xdxx.960.jpg'}
              alt={selectedProduct.nom}
              className="w-[80%] h-[80%] object-contain mix-blend-multiply z-10"
            />
            {/* Élément décoratif (cercle) */}
          </div>
          
          {/* Côté Droit : Infos */}
          <div className="flex flex-col h-full justify-center space-y-6">
            
            {/* Breadcrumb / Catégorie */}
            <div className="flex items-center space-x-2 text-xs text-gray-500 uppercase tracking-widest">
              <span>Home</span>
              <span>/</span>
              <span>Products</span>
              <span>/</span>
              <span className="text-black font-bold">{selectedProduct.categorie}</span>
            </div>

            {/* Titre */}
            <h1 
              className="text-3xl md:text-4xl uppercase tracking-tighter leading-none electro"
             
            >
              {selectedProduct.nom}
            </h1>
            
            {/* Prix */}
            <div className="text-3xl font-light font-sans">
              ${selectedProduct.prix}
            </div>

            {/* Description */}
            <div className="prose prose-sm text-gray-600 max-w-md">
              <p>{selectedProduct.description}</p>
            </div>

            {/* Bouton d'Action */}
            <div className="pt-6">
              <button 
                className="btn btn-lg bg-primary text-white rounded-none border-0 hover:bg-error w-full md:w-auto px-12 uppercase tracking-wider"
                onClick={() => addToCart(selectedProduct)}
                style={{clipPath:"url(#clipPath_btn)"}}
              >
                <ShoppingCart className="mr-2 w-5 h-5" />
                Add to Cart
              </button>
            </div>

            {/* Infos supplémentaires */}
            <div className="text-xs text-gray-400 uppercase tracking-wider pt-8 border-t-1 border-gray-300 mt-8">
              SKU: {selectedProduct.sku} <br/>
              Category: {selectedProduct.categorie} Series
            </div>

          </div>
        </div>
      </div>

      {/* --- Section Recommandations (Plan A) --- */}
      <div className="max-w-7xl mx-auto mt-24 md:mt-32">
        <div className="flex items-center justify-between mb-8 border-b border-black pb-4">
          <h2 
            className="text-2xl md:text-4xl uppercase tracking-tighter electro"
            
          >
            You Might Also Like
          </h2>
        </div>
        
        {isLoadingRecsA ? (
          <div className="text-center p-20">
            <Loader className="size-8 animate-spin mx-auto text-gray-400" />
          </div>
        ) : (
          // On réutilise votre ProductCard pour un look uniforme
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {recommendationsA.map((product) => (
              <ProductCard key={product.id_prod} product={product} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default ProductDetailPage;