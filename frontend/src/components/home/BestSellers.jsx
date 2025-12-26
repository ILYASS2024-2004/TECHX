// import React, { useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import useProductStore from '../../store/useProductStore';
// import gsap from "gsap";
// import ScrollTrigger from "gsap/ScrollTrigger";
// import "./bestSellers.css"
// gsap.registerPlugin( ScrollTrigger);
// const BestSellers = () => {
//   // 1. Récupérer les données et l'action du store
//   const { bestSellers, fetchBestSellers } = useProductStore();

//   // 2. Charger les données au montage du composant
//   useEffect(() => {
//     fetchBestSellers();
//   }, [fetchBestSellers]);

// useEffect(() => {
//   // On attend un petit délai pour être sûr que le DOM est prêt si les images chargent
//   const ctx = gsap.context(() => {
//     const elements = document.querySelectorAll(".text-an");

//     elements.forEach((el) => {
//       // On utilise fromTo pour garantir l'état de départ et de fin
//       gsap.fromTo(el, 
//         { 
//           "--reveal-tr": "0%" // Départ : le bloc cache le texte
//         },
//         {
//           "--reveal-tr": "101%", // Fin : le bloc part vers la droite (ou -101% vers la gauche)
//           duration: 1.2,         // Un peu plus lent pour l'élégance
//           ease: "power4.out",    // Beaucoup plus smooth que expo.out
//           scrollTrigger: {
//             trigger: el,
//             start: "top 85%",    // Commence quand l'élément est un peu visible
//             toggleActions: "play none none none",
//           }
//         }
//       );
//     });
//   });

//   return () => ctx.revert(); // Nettoyage propre (best practice React 18+)
// }, [bestSellers]);





//   return (
//     // Section principale avec un padding généreux
//     <div className="w-full py-24 bg-[#f1f1f1] text-black relative z-10">
      
//       <div className="container mx-auto px-4 md:px-10">
        
//         {/* En-tête de la section */}
//         <div className="flex flex-col items-center mb-6">
//           <span className="text-sm uppercase inline-block tracking-[0.3em] text-gray-500 mb-2 text-an">
//             Top Rated
//           </span>
//           <h2 
//             className="text-5xl md:text-7xl text-center tracking-tighter uppercase electro text-an"
           
//           >
//             Best Sellers
//           </h2>
//         </div>

//         {/* Grille des Produits (Limitée à 3) */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          
//           {/* On prend seulement les 3 premiers */}
//           {bestSellers.slice(0, 6).map((product, index) => (
//             <Link 
//               key={product.id_prod} 
//               to={`/product/${product.sku}`}
//               className="group block"
//             >
//               {/* Conteneur Image (Style minimaliste avec bordure fine) */}
//               <div className="relative aspect-[4/5]  border border-gray-100 overflow-hidden mb-1">
                
//                 {/* Numéro en arrière-plan (01, 02, 03) */}
//                 <span 
//                   className="absolute top-2 left-4 text-9xl font-bold text-gray-100  -z-0 select-none group-hover:text-gray-300 transition-colors duration-500"
//                   style={{ fontFamily: "'techno', sans-serif" }}
//                 >
//                   0{index + 1}
//                 </span>

//                 {/* Image du produit */}
//                 <img 
//                   src={product.img_url || 'https://sm.ign.com/t/ign_tr/photo/e/every-play/every-playstation-console-a-full-history-of-release-dates_xdxx.960.jpg'} 
//                   alt={product.nom} 
//                   className="absolute inset-0 w-full h-full object-contain mix-blend-multiply p-8 z-10 transition-transform duration-700 ease-out group-hover:scale-110"
//                 />
                
//                 {/* Badge "Sold out" ou "Hot" (Optionnel, simulé ici) */}
//                 <div className="absolute top-4 right-4 z-20">
//                    <span className="badge badge-ghost bg-black text-white rounded-none text-xs py-3 uppercase">
//                       Trending
//                    </span>
//                 </div>
//               </div>

//               {/* Infos Produit */}
//               <div className="flex flex-col items-center text-center border-t-2 border-gray-700">
//                 <h3 className="text-xl  w-full font-bold uppercase self-start flex justify-between tracking-tight mb-1 group-hover:text-gray-600 transition-colors">
//                   <span className='text-an'>{product.nom}</span>
//                   <span className="text-lg font-light text-an">
//                   ${product.prix}
//                 </span>
//                 </h3>
//                 <p className="text-xs text-gray-400 mb-1 uppercase tracking-widest self-start electro text-an">
//                   {product.categorie} Series
//                 </p>
                
//               </div>
//             </Link>
//           ))}
//         </div>

//         {/* Bouton "Shop All"
//         <div className="text-center mt-20">
//             <Link 
//                 to="/products" 
//                 className="btn btn-outline btn-lg rounded-full px-12 hover:bg-black hover:text-white transition-all duration-300"
//             >
//                 Shop All Best Sellers
//             </Link>
//         </div> */}

//       </div>
//     </div>
//   );
// };

// export default BestSellers;
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import useProductStore from '../../store/useProductStore';
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import "./bestSellers.css"

gsap.registerPlugin(ScrollTrigger);

const BestSellers = () => {
  // 1. Récupérer les données
  const { bestSellers, fetchBestSellers } = useProductStore();
  const containerRef = useRef(null);

  // 2. Charger les données
  useEffect(() => {
    fetchBestSellers();
  }, [fetchBestSellers]);

// 3. L'ANIMATION PRO AVEC DÉCALAGE (STAGGER)
  useEffect(() => {
    // Si pas de produits, on ne fait rien
    if (bestSellers.length === 0) return;

    const ctx = gsap.context(() => {
      // ScrollTrigger.batch détecte les éléments visibles et les groupe
      ScrollTrigger.batch(".text-an", {
        // Dès que des éléments entrent dans l'écran (onEnter)
        onEnter: (batch) => {
          gsap.fromTo(batch, 
            { 
              "--reveal-tr": "0%" // Départ fermé
            },
            {
              "--reveal-tr": "102%", // Fin ouvert
              duration: 1.4,         // Durée élégante
              ease: "expo.out",      // Courbe de vitesse "Luxe"
              stagger: 0.15,          // <--- LE VOILÀ : 0.15s de décalage entre chaque élément
              overwrite: true        // S'assure qu'il n'y a pas de conflit
            }
          );
        },
        
        // Configuration du déclenchement
        start: "top 105%", // L'animation part quand l'élément est bien visible
        once: true        // On ne le joue qu'une fois (plus classe)
      });
    }, containerRef);

    return () => ctx.revert(); // Nettoyage
  }, [bestSellers]);

  return (
    // TONY DESIGN EXACT (Aucune modification ici)
    <div ref={containerRef} className="w-full py-24 bg-[#f1f1f1] text-black relative z-10 ">
      
      <div className="container mx-auto px-4 md:px-10">
        
        {/* En-tête de la section */}
        <div className="flex flex-col items-center mb-6">
          <span className="text-sm uppercase inline-block tracking-[0.3em] text-gray-500 mb-2 text-an">
            Top Rated
          </span>
          <h2 
            className="text-5xl md:text-7xl text-center tracking-tighter uppercase electro text-an"
          >
            Best Sellers
          </h2>
        </div>

        {/* Grille des Produits (Limitée à 3) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          
          {/* On prend seulement les 3 premiers */}
          {bestSellers.slice(0, 6).map((product, index) => (
            <Link 
              key={product.id_prod} 
              to={`/product/${product.sku}`}
              className="group block"
            >
              {/* Conteneur Image (Style minimaliste avec bordure fine) */}
              <div className="relative aspect-[5/5]  border border-gray-100 overflow-hidden mb-1">
                
                {/* Numéro en arrière-plan (01, 02, 03) */}
                {/* <span 
                  className="absolute top-2 left-4 text-9xl font-bold text-gray-100/0  z-99 select-none group-hover:text-black transition-colors duration-500"
                  style={{ fontFamily: "'techno', sans-serif" }}
                >
                  0{index + 1}
                </span> */}

                {/* Image du produit */}
                <img 
                  src={product.img_url || 'https://sm.ign.com/t/ign_tr/photo/e/every-play/every-playstation-console-a-full-history-of-release-dates_xdxx.960.jpg'} 
                  alt={product.nom} 
                  className="absolute inset-0 w-full h-full object-contain mix-blend-multiply p-8 z-10 transition-transform duration-700 ease-out group-hover:scale-110"
                />
                
                {/* Badge "Sold out" ou "Hot" */}
                <div className="absolute top-4 right-4 z-20">
                   <span className="badge badge-ghost bg-black text-white rounded-none text-xs py-3 uppercase">
                      Trending
                   </span>
                </div>
              </div>

              {/* Infos Produit */}
              <div className="flex flex-col items-center text-center border-t-2 border-gray-700">
                <h3 className="text-xl  w-full font-bold uppercase self-start flex justify-between tracking-tight mb-1 group-hover:text-gray-600 transition-colors">
                  <span className='text-an'>{product.nom}</span>
                  <span className="text-lg font-light text-an">
                  ${product.prix}
                </span>
                </h3>
                <p className="text-xs text-gray-400 mb-1 uppercase tracking-widest self-start electro text-an">
                  {product.categorie} Series
                </p>
                
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
};

export default BestSellers;