import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import useCartStore from '../store/useCartStore';

const ProductCard = ({ product }) => {
  // Image de remplacement (votre URL PlayStation)
  const imageUrl = product.img_url || 'https://sm.ign.com/t/ign_tr/photo/e/every-play/every-playstation-console-a-full-history-of-release-dates_xdxx.960.jpg';
  const {addToCart} = useCartStore();
  return (
    // Lien principal qui enveloppe toute la carte
    <Link 
      to={`/product/${product.sku}`}
      className="group relative block h-full flex flex-col"
    >
      {/* --- 1. Image Container (Style Pro) --- */}
      <div className="flex-1 overflow-hidden relative  aspect-square">
        <img 
          src={imageUrl} 
          alt={product.nom} 
          className="w-full h-full object-contain mix-blend-multiply p-8 transition-transform duration-700 ease-out group-hover:scale-110"
        />
        
        {/* Overlay au survol (Subtil) */}
        <div className="absolute inset-0 bg-black/0 transition-colors duration-300" />

        {/* Bouton Panier (Apparaît au survol sur Desktop)  a devlopper plus tard*/}
        <button 
          className="absolute bottom-4 right-4 bg-black text-white p-3 rounded-full cursor-pointer
                     opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 
                     transition-all duration-400 hover:bg-gray-800 z-10"
         onClick={(e) => {
    e.preventDefault(); // <--- TRES IMPORTANT : Empêche d'ouvrir la page produit
    addToCart(product); // <--- L'action qui ajoute au panier
  }}
        >
          <ShoppingCart className="w-5 h-5" />
        </button>
      </div>

      {/* --- 2. Infos Produit (Style Minimaliste) --- */}
      <div className="mt-4 flex justify-between items-start border-t border-black pt-2">
        <div className="max-w-[70%]">
          <h3 className="text-lg font-bold font-sans text-black uppercase leading-none truncate">
            {product.nom}
          </h3>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-wide">
            {product.categorie} SERIES
          </p>
        </div>
        <span className="text-lg font-sans font-light text-black">
          ${product.prix}
        </span>
      </div>
    </Link>
  );
};

export default ProductCard;