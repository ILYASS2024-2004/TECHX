
import React, { useLayoutEffect, useRef, useEffect } from 'react'
import "./dropnow.css"
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// --- NOUVEAUX IMPORTS ---
import { Link } from 'react-router-dom'
import useProductStore from '../../store/useProductStore'

// Enregistrer le plugin GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger)

const DropNow = () => {
  // Créer une référence pour le conteneur principal (le déclencheur)
  const mainRef = useRef(null)
  // Créer une référence pour la div rouge (la cible de l'animation)
  const redBoxRef = useRef(null)

  // --- 1. RÉCUPÉRER LES DONNÉES (NEW DROPS) ---
  const { newDrops, fetchNewDrops } = useProductStore();

  useEffect(() => {
    fetchNewDrops();
  }, [fetchNewDrops]);


  // Utiliser useLayoutEffect pour les animations DOM
  useLayoutEffect(() => {
    
    // Attendre que les éléments soient prêts
    const ctx = gsap.context(() => {

      // L'animation GSAP
      gsap.to(redBoxRef.current, {
        
    
      });

    }, mainRef); // Scope du contexte pour un nettoyage facile

    // Fonction de nettoyage pour React


  }, []) // Se lance une seule fois au montage


  return (
    // Ajouter la référence 'mainRef' au conteneur principal
    // J'ajoute overflow-hidden pour m'assurer que les logos ne dépassent pas
    <> <div>
         <div ref={mainRef} className='h-screen relative w-full  overflow-hidden bg-[#f1f1f1] bg-black flex flex-col justify-center items-center electro gap-0 leading-[0.9] overflow-hidden'>
        
        <div className='logos'>
            <div className='logos-slide '>
                <p>DROP NOW</p>
                <p>DROP NOW</p>
                <p>DROP NOW</p>
                <p>DROP NOW</p>
                <p>DROP NOW</p> 

            </div>
            <div className='logos-slide '>
                <p>DROP NOW</p>
                <p>DROP NOW</p>
                <p>DROP NOW</p>
                <p>DROP NOW</p>
                <p>DROP NOW</p>

            </div>


        </div>
        <div className='logos'>
            <div className='logos-slide1 '>
                <p>DROP NOW</p>
                <p>DROP NOW</p>
                <p>DROP NOW</p>
                <p>DROP NOW</p>
                <p>DROP NOW</p>

            </div>
            <div className='logos-slide1 '>
                <p>DROP NOW</p>
                <p>DROP NOW</p>
                <p>DROP NOW</p>
                <p>DROP NOW</p>
                <p>DROP NOW</p>

            </div>


        </div>

        {/* Ajouter la référence 'redBoxRef' à la div rouge */}
        <div  className='absolute h-[100vh]  scale-50  w-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#f1f1f1]'>
            
            {/* --- CONTENU AJOUTÉ ICI --- */}
            <div className="w-full h-full flex flex-col justify-center items-center px-4 md:px-10">
                
                {/* Titre de la section */}
                <h2 
                    className="text-5xl md:text-6xl mb-12 text-black tracking-tighter uppercase z-10 text-center"
                  // Utilise votre police perso
                >
                    Latest Arrivals
                </h2>

                {/* Grille de Produits (Limitée à 3 pour un design épuré) */}
                <div className="hidden sm:grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl h-[60%]">
                    {newDrops.slice(0, 3).map((product) => (
                        <Link 
                            key={product.id_prod} 
                            to={`/product/${product.sku}`}
                            className="group relative block h-full flex flex-col"
                        >
                            {/* Image Container */}
                            <div className="flex-1  overflow-hidden relative ">
                                <img 
                                    src={product.img_url || 'https://sm.ign.com/t/ign_tr/photo/e/every-play/every-playstation-console-a-full-history-of-release-dates_xdxx.960.jpg'} 
                                    alt={product.nom} 
                                    className="w-full h-full object-contain mix-blend-multiply p-8 transition-transform duration-700 ease-out group-hover:scale-110"
                                />
                                
                                {/* Overlay au survol (Optionnel pour effet pro) */}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                            </div>

                            {/* Infos Produit (Minimaliste) */}
                            <div className="mt-4 flex justify-between items-start border-t border-black pt-2">
                                <div className="max-w-[70%]">
                                    <h3 className="text-lg md:text-xl font-bold font-sans text-black uppercase leading-none truncate">
                                        {product.nom}
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {product.categorie} SERIES
                                    </p>
                                </div>
                                <span className="text-lg font-sans font-light text-black">
                                    ${product.prix}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Bouton "Voir tout" discret en bas */}
                <Link 
                    to="/products" 
                    className="hidden sm:block mt-20 text-sm uppercase tracking-widest border-b border-black pb-1 hover:text-gray-600 transition-colors"
                >
                    View All Collection
                </Link>

            </div>
            {/* --- FIN DU CONTENU AJOUTÉ --- */}
            

        </div>


    
    </div>
    
    </div>
   {/* Grille de Produits Phone (Limitée à 3 pour un design épuré) */}
                <div className="grid sm:hidden grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl p-2 ">
                    {newDrops.slice(0, 3).map((product) => (
                        <Link 
                            key={product.id_prod} 
                            to={`/product/${product.sku}`}
                            className="group relative block h-full flex flex-col"
                        >
                            {/* Image Container */}
                            <div className="flex-1  overflow-hidden relative border border-gray-200">
                                <img 
                                    src={product.img_url || 'https://sm.ign.com/t/ign_tr/photo/e/every-play/every-playstation-console-a-full-history-of-release-dates_xdxx.960.jpg'} 
                                    alt={product.nom} 
                                    className="w-full h-full object-contain mix-blend-multiply p-8 transition-transform duration-700 ease-out group-hover:scale-110"
                                />
                                
                                {/* Overlay au survol (Optionnel pour effet pro) */}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                            </div>

                            {/* Infos Produit (Minimaliste) */}
                            <div className="mt-4 flex justify-between items-start border-t border-black p-2 pt-2">
                                <div className="max-w-[70%]">
                                    <h3 className="text-lg md:text-xl font-bold font-sans text-black uppercase leading-none truncate">
                                        {product.nom}
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {product.categorie} SERIES
                                    </p>
                                </div>
                                <span className="text-lg font-sans font-light text-black">
                                    ${product.prix}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Bouton "Voir tout" discret en bas */}
                <Link 
                    to="/products" 
                    className="block sm:hidden mt-10 text-sm uppercase tracking-widest border-b border-black pb-2 hover:text-gray-600 transition-colors electro text-center"
                >
                    View All Collection
                </Link>

    </>
   
  )
}

export default DropNow