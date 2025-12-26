import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Loader, Sparkles } from 'lucide-react';
import useRecommanderBStore from '../store/useRecommanderBStore';
import useAuthStore from '../store/useAuthStore';
import ProductCard from '../components/ProductCard'; // On réutilise votre carte pro

const RecommendedPage = () => {
  // 1. Récupérer le User (pour afficher son nom)
  const user = useAuthStore((state) => state.user);

  // 2. Récupérer le store de Recommandation
  const { 
    isTrained, 
    isLoadingStatus, 
    isLoadingRecs, 
    recommendations, 
    checkStatus, 
    fetchRecommendations 
  } = useRecommanderBStore();

  // 3. Au montage : Vérifier le statut
  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  // 4. Si le statut est confirmé (isTrained), lancer la récupération
  useEffect(() => {
    if (isTrained) {
      fetchRecommendations();
    }
  }, [isTrained, fetchRecommendations]);

  // --- GESTION DES ÉTATS D'AFFICHAGE ---

  // A. Chargement initial (Vérification du statut)
  if (isLoadingStatus) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#f1f1f1]">
        <Loader className="size-16 animate-spin text-black" />
      </div>
    );
  }

  // B. Cas "Cold Start" (L'IA ne connaît pas encore l'utilisateur)
  if (!isTrained) {
    return (
      <div className="min-h-screen bg-[#f1f1f1] flex flex-col items-center justify-center p-4 text-center">
        <Sparkles className="w-16 h-16 mb-6 text-gray-400" />
        <h1 
          className="text-3xl md:text-5xl uppercase tracking-tighter mb-4"
          style={{ fontFamily: "'Above', sans-serif" }}
        >
          AI Learning in Progress...
        </h1>
        <p className="text-gray-600 max-w-md mb-8 font-sans">
          Bonjour <strong>{user?.nom}</strong>. Notre IA analyse encore vos préférences. 
          Revenez demain pour voir votre sélection 100% personnalisée.
        </p>
        <Link to="/products" className="btn btn-outline rounded-none px-8 uppercase">
          Découvrir le catalogue
        </Link>
      </div>
    );
  }

  // C. Cas Succès (Affichage des produits)
  return (
    <div className="min-h-screen bg-[#f1f1f1] pt-24 pb-12 px-4 md:px-10 text-black">
      
      {/* En-tête */}
      <div className="flex flex-col items-center mb-16">
        <span className="text-sm font-bold uppercase tracking-[0.3em] text-primary mb-2 flex items-center gap-2">
          <Sparkles className="w-4 h-4" /> Curated For You By AI
        </span>
        <h1 
          className="text-5xl md:text-7xl text-center tracking-tighter uppercase"
          style={{ fontFamily: "'techno', sans-serif" }}
        >
          Your Selection
        </h1>
        <p className="mt-4 text-gray-500 font-sans uppercase tracking-widest text-xs">
          Based on your unique taste
        </p>
      </div>

      {/* Contenu */}
      {isLoadingRecs ? (
        <div className="flex justify-center items-center h-[40vh]">
          <Loader className="size-12 animate-spin text-gray-400" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {recommendations.length > 0 ? (
            recommendations.map((product) => (
              <ProductCard key={product.id_prod} product={product} />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">
              Aucune recommandation disponible pour le moment.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default RecommendedPage;