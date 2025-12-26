import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Enregistrement du plugin
gsap.registerPlugin(ScrollTrigger);

const TransicBack = () => {
  const containerRefb = useRef(null);

  useLayoutEffect(() => {
    // Utilisation de gsap.context pour un nettoyage propre (Best practice React 18+)
    let ctx = gsap.context(() => {
      
      gsap.to(containerRefb.current, {
        backgroundColor: "#000000", // La couleur cible (Noir)
        ease: "none", // Important pour que le scrub soit linéaire
        scrollTrigger: {
          trigger: containerRefb.current,
          start: "top top", // Commence quand le haut de la div touche le haut de l'écran
          end: "+=100%",    // Dure pendant 200% de la hauteur de la fenêtre (scroll distance)
          pin: true,        // Épingle l'élément
          scrub: 0,         // Le changement de couleur suit le scroll (avec 1s de lissage "smooth")
          // markers: true, // Décommentez pour voir les repères de début/fin pendant le dev
        }
      });

    }, containerRefb); // Scope le selecteur à ce composant

    return () => ctx.revert(); // Nettoyage lors du démontage du composant
  }, []);

  return (
    <div ref={containerRefb} className='h-screen bg-[#f1f1f1] '>
      
    </div>
  );
}

export default TransicBack;