import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, Loader } from 'lucide-react';
import useCartStore from '../store/useCartStore';

const CartSidebar = () => {
  // Récupérer l'état et les actions du store
  const { 
    cart, 
    isCartOpen, 
    toggleCart, 
    removeFromCart, 
    updateQuantity,
    checkout,
    isCheckingOut
  } = useCartStore();

  // Calcul du sous-total
  const subtotal = cart.reduce((acc, item) => acc + item.prix * item.quantity, 0);

  return (
    <>
      {/* 1. L'OVERLAY (Le fond noir transparent derrière) */}
      {/* Il apparaît en fondu (opacity) quand le panier est ouvert */}
      <div 
        className={`
          fixed inset-0 bg-black/60 z-[9998] 
          transition-opacity duration-500 ease-in-out
          ${isCartOpen ? "opacity-100 visible" : "opacity-0 invisible"}
        `}
        onClick={toggleCart} // Ferme le panier si on clique dehors
      />

      {/* 2. LE VOLET LATÉRAL (SIDEBAR) */}
      <div
        className={`
          fixed top-0 right-0 h-screen bg-[#f1f1f1] z-[9999] shadow-2xl overflow-y-auto
          
          /* DIMENSIONS DEMANDÉES */
          w-full sm:w-[50vw] 
          
          /* ANIMATION DE TRANSLATION */
          transform transition-transform duration-500 ease-in-out
          ${isCartOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        
        {/* --- HEADER --- */}
        <div className="h-20 flex items-center justify-between px-2 sm:px-6 border-b border-gray-100">
          <h2 className="text-xl sm:text-2xl font-bold font-sans text-black uppercase tracking-wider flex items-center gap-3 electro">
            <ShoppingBag className="w-6 h-6" /> 
            My Cart <span className="text-gray-400 text-lg">({cart.length})</span>
          </h2>
          <button 
            onClick={toggleCart} 
            className="btn btn-circle btn-ghost text-black hover:bg-gray-100"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* --- LISTE DES PRODUITS (SCROLLABLE) --- */}
        {/* flex-1 permet à cette zone de prendre toute la hauteur disponible */}
        <div className="flex-1 overflow-y-auto p-2 sm:p-6 space-y-6">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
              <ShoppingBag className="w-20 h-20 opacity-20" />
              <p className="text-lg font-light">Your cart is empty.</p>
              <button 
                onClick={toggleCart} 
                className="btn btn-outline btn-wide rounded-none mt-4 uppercase"
              >
                Start my shopping
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id_prod} className="flex gap-4 animate-fadeIn">
                {/* Image Produit */}
                <div className="w-24 h-24 bg-[#f1f1f1] border border-gray-100 overflow-hidden shrink-0 relative">
                  <img 
                    src={item.img_url || '/img0.png'} 
                    alt={item.nom} 
                    className="w-full h-full object-contain mix-blend-multiply p-2"
                  />
                </div>

                {/* Détails Produit */}
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-black text-base uppercase line-clamp-1 mr-2">
                        {item.nom}
                      </h3>
                      <button 
                        onClick={() => removeFromCart(item.id_prod)}
                        className="text-gray-400 hover:text-black transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">
                      {item.categorie} Series
                    </p>
                  </div>
                  
                  <div className="flex justify-between items-end">
                    {/* Sélecteur de Quantité */}
                    <div className="flex items-center border border-gray-200 h-8 w-fit">
                      <button 
                        onClick={() => updateQuantity(item.id_prod, -1)}
                        className="px-3 h-full hover:bg-gray-100 text-black flex items-center justify-center"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-3 text-sm font-medium text-black min-w-[2rem] text-center">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => updateQuantity(item.id_prod, 1)}
                        className="px-3 h-full hover:bg-gray-100 text-black flex items-center justify-center"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Prix Total Ligne */}
                    <span className="font-bold text-black text-lg">
                      ${(item.prix * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* --- FOOTER (TOTAL & ACTION) --- */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-gray-100 ">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-500 uppercase text-sm tracking-widest">Subtotal</span>
              <span className="text-3xl font-bold text-black font-sans">${subtotal.toFixed(2)}</span>
            </div>
            <p className="text-xs text-gray-400 mb-6 text-center">
              Shipping and taxes calculated at checkout
            </p>
            
            <button 
              onClick={checkout}
              disabled={isCheckingOut}
             // style={{clipPath:"url(#clipPath_btn)"}}
              className="btn btn-block bg-black text-white  electro rounded-sm
                         rounded-none uppercase tracking-[0.2em] h-14 text-sm sm:text-xl border-0 disabled:bg-gray-400"
            >
              {isCheckingOut ? (
                <span className="flex items-center gap-2">
                  <Loader className="animate-spin w-5 h-5" /> ...
                </span>
              ) : (
                "Pay for the order"
              )}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;