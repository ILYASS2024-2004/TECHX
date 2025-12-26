// CORRECTION 1 : Importer 'useLayoutEffect'
import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./hero.css"; // Assurez-vous que le chemin est correct
import HorizontalDrag from "./HorizontalDrag";

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const pageRef = useRef(null);
  const pathRef = useRef(null);
  const page2Ref = useRef(null);

  // Préparer le path
  const preparePath = (path) => {
    if (!path) return; // Sécurité
    const length = path.getTotalLength();
    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;
  };

  // CORRECTION 2 : Utiliser 'useLayoutEffect' (s'exécute avant l'affichage)
  useLayoutEffect(() => {
    const path = pathRef.current;

    preparePath(path);

    // CORRECTION 3 : Utiliser 'gsap.context()' pour le nettoyage
    let ctx = gsap.context(() => {
      let tl = gsap.timeline({
        scrollTrigger: {
          trigger: pageRef.current,
          start: "top top", // Plus propre que "top+=1%"
          end: "+=200%",
          pin: true,
          scrub: 1,
      
          // markers: true, // Décommentez pour déboguer
        },
      });


    }, pageRef); // Lier le contexte à l'élément principal
    
    // Nettoyage de GSAP (très important)
    return () => ctx.revert(); 

  }, []); // Le tableau vide est parfait

  return (
    // 'pageRef' est le conteneur que nous épinglons
    // CORRECTION D'ERREUR : Le fragment de fermeture </> a été remplacé par </div>
    <div ref={pageRef} className="relative h-screen overflow-hidden bg-[#f1f1f1]">
      {/* <img className="inline-block absolute bottom-[1%] left-[1%] h-[30px] contrast-150" src="img/tags.png" alt="" /> */}
      {/* ClipPath SVG (invisible) */}
      <svg className="absolute w-0 h-0">
        <clipPath id="clipPathPath" clipPathUnits="objectBoundingBox">
          <path d="M 0,0 L 0,0.8 L 0.2,1 L 1,1 L 1,0 Z" />
        </clipPath>
      </svg>

      {/* Section 1 (Le contenu visible) */}
      <div
        id="page1"
        className="relative h-screen flex justify-center items-center"
      >
        <p className="inline-block sm:hidden absolute bottom-2 text-center  text-3xl techno ">WELCOME IN TECH X</p>

        {/* SVG PATH ANIMATION */}
              <div className="hidden  sm:inline-block absolute overflow-x-hidden bottom-[1%] left-[1%] text-xs diamod byh text-gray-700 " style={{wordSpacing:"30px"}}>X  ILS  T  F</div>

        <svg
          className="absolute  top-[55%] sm:top-1/2 left-[45%] -translate-x-1/2 -translate-y-1/2 z-[99] h-[40%] w-[100%] sm:h-[70%]  sm:w-[90%] scale-90 sm:scale-100"
          viewBox="0 0 300 400"
        >
          <path
            ref={pathRef}
            // CORRECTION 4 : Utiliser la bonne classe CSS
            className="path-draw scale-83 sm:scale-100"
            // (Plus besoin de style inline, c'est dans hero.css)
            d="m -5.85371 2.46682,-19.59474 7.59294,-24.5941 0.31791,-0.31005 0.34761 1.4123,3.3823 4.38645,11.80937 5.57369,15.05817 2.56997,7.0326 5.07724,14.08319 7.74315,21.08327 3.2153,7.05252 6.96494,17.21353 16.06461,5.94961 1.02533,-1.26918 1.38466,-12.23383 1.43113,-13.04369 0.14827,-8.00666 -0.22768,-16.00621 -0.0839,-24.00982 0.007,-0.37672 0.29022,0.98392 -0.0761,1.12802 -2.42145,0.95252 -5.07026,1.26243 -7.60539,1.89365 1.67057,3.63958 3.09342,7.45757 5.13187,10.93481 0.79342,1.35342 1.18677,3.24672 2.667,3.892 5.75972,1.91497 8.38683,0.95269 2.4981,-0.91503 3.40208,-3.92926 5.10312,-5.8939 0.1606,-0.33241 4.65848,-9.8379 5.26191,-10.36442 2.04222,-1.78189 11.99371,-1.57616 12.71983,-1.49048 13.14411,1.55105 23.83664,5.78808 36.50895,9.79501 23.08066,8.42564 45.58804,18.36189 67.36625,29.4872 7.90877,4.04016 24.42043,13.06687 32.17906,18.5154 3.57118,2.50788 6.70697,5.53201 10.06044,8.29802 0.77562,2.57793 3.62846,5.35492 2.32683,7.73379 -2.38308,4.35536 -7.51705,6.79888 -11.78881,9.5591 -9.07946,5.86673 -18.31673,11.61263 -28.1526,16.24919 -23.32875,10.99702 -65.26513,25.53402 -89.69163,32.81547 -15.30246,4.56161 -30.91156,8.13625 -46.36734,12.20437 -36.26351,7.9 -40.61064,9.56163 -75.41745,14.65981 -20.18227,2.95613 -40.84644,5.31763 -61.31952,4.35939 -3.22083,-0.15075 -6.41432,-0.6388 -9.62149,-0.9582 -1.79312,-0.47172 -7.22024,-1.67173 -5.37937,-1.41517 3.35409,0.46744 6.70125,3.00699 9.93837,2.05053 10.09391,-2.98237 18.85951,-9.08375 28.41343,-13.38209 19.79809,-8.90723 39.73837,-17.52637 59.63601,-26.2315 50.55507,-22.11793 101.18107,-44.08918 151.76496,-66.14754 61.45874,-27.68723 123.69145,-53.93445 183.50142,-84.80436 26.11004,-13.47626 47.76985,-25.54272 71.7289,-41.76278 7.94228,-5.37684 15.38384,-11.39212 23.07577,-17.08818 7.13007,-6.6938 20.8395,-16.57786 23.027,-27.7022 2.4966,-12.69607 -8.44729,-15.30069 -19.98881,-12.79896 -14.35272,3.11106 -35.96037,20.49815 -46.43963, 27.94851 -8.2934,8.25071 -17.21555,15.96948 -24.8802,24.75215 -8.4876,9.72564 -16.12708,20.11554 -23.46901,30.64955 -22.2154,31.87407 -39.82768,66.74395 -53.10933,102.80404 -4.49962,12.21661 -7.97997,24.75099 -11.96996,37.12649 -2.0563,6.38669 7.44831,9.15018 9.50461,2.7635 v 0 c 3.90283,-12.13891 7.3051,-24.43347 11.70849"
          />
        </svg>

        {/* TEXTE VERTICAL */}
        <div 
          className="absolute bottom-0 right-0 w-[30vw] h-[90vh] 
                     flex justify-center items-center z-[1000]  
                     pointer-events-none text-black"
          style={{fontFamily: "'techno', sans-serif"}} // Utiliser les polices
        >
          <p className="textp hidden sm:inline-block"> {/* Utilise la classe .textp de hero.css */}
            Welcome to the Amazing Store
          </p>
        </div>

        {/* BRAND */}
        <div 
          className="hidden sm:block absolute top-1/2 left-[1%] w-[20vw] 
                     text-center z-[1000] text-black 
                     pointer-events-none -translate-y-1/2" // -translate-y-1/2 est mieux que top: 50%
        >
          <div className=" flex flex-col leading-[0.6] p-0 m-0 ">
            <span 
              className="text-gray-600 text-sm self-start"
              style={{fontFamily: "system-ui, sans-serif"}}
            >
              Created by ilyass El-ogri
            </span>
            <span 
              className="text-6xl self-start"
              style={{fontFamily: "'Above', sans-serif"}} // Utiliser les polices
            >
              TECHNO
            </span>
            <span 
              className="text-2xl font-light self-center"
              style={{fontFamily: "sans-serif"}}
            >
              STORE
            </span>
          </div>
        </div>

        {/* VIDEO */}
        <div className="relative inline-block w-[100vw] h-[80vh] sm:w-[40vw] sm:h-[99vh] videoc-animated z-20">
          <video
            autoPlay
            loop
            muted
            playsInline
            // Utiliser la classe video-clip-path
            className="h-[80vh] sm:w-[40vw] sm:h-[99vh] "
            style={{ filter: "contrast(0.8)" }}
          >
            <source src="/vw.mp4" type="video/mp4" />
          </video>
        </div>
      </div>

      {/* SECTION 2 (La page qui monte) */}
      <div
  
        id="pag2"
        className="absolute  w-full h-[140vh] overflow-x-hidden  bg-[#f1f1f1] bg-black
                    z-30000" // z-index plus élevé
      >
        <h1 className="text-black text-4xl sm:text-6xl self-start super mt-40 px-4 py-2 text-white">OUR PRODUCTS</h1>
        <div className="self-end  absolute bottom-0 h-screen">
            <HorizontalDrag></HorizontalDrag>
        
        </div>
        
      </div>

      {/* Div rouge pour le scroll (de votre HTML) */}
     
      
    </div>

  );
}