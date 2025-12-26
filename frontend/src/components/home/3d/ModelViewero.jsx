
import React from 'react';


const ModelViewer = ({  p,img }) => {


  // Dépendances ajoutées pour recharger si les props changent

  // --- TON DESIGN ORIGINAL INTACT ---
  return (
    <div className='relative h-screen w-screen  overflow-hidden bg-blue-600 '> 
        
        {/* LE TEXTE (Derrière) */}
        <div className='absolute top-1/2 left-1/2 bg-red-500 border-r-4 border-l-4 -translate-x-1/2 w-[80%] h-screen -translate-y-1/2  text-9xl flex justify-center items-center above font-bold text-black'>
 <p className='bg-[#f1f1f1] h-[80%] flex justify-center items-center relative overflow-hidden'>    
                    <img src={img} className='absolute h-[100%] opacity-100 ' alt="techx" loading="lazy"/>

            <span className='z-1'>{p}</span></p>
        </div>

        {/* LE MODEL 3D (Devant) */}
        <div 
          
            className='absolute top-0 left-0 w-full h-full z-10'
            style={{ outline: 'none' }}
        >
           
        </div>
    </div>
  );
};

export default ModelViewer;