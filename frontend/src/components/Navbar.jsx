import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import { Mail, LogIn, LogOut, ShoppingCart } from 'lucide-react';

// 1. IMPORTER LE STORE PANIER
import useCartStore from '../store/useCartStore'; 

const Navbar = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const lastScrollY = useRef(0);

  const { user, logout } = useAuthStore();
  const isAuthenticated = !!user;

  // 2. RÉCUPÉRER L'ACTION 'toggleCart' et le NOMBRE D'ITEMS
  const { toggleCart, cart } = useCartStore();
  
  // Calculer le nombre d'items uniques (pour le badge)
  const uniqueItemsCount = cart.length;

  const handleLogout = () => {
    logout();
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current ) {
        setIsVisible(false); 
      } else if (currentScrollY < lastScrollY.current) {
        setIsVisible(true);
      }
      setIsScrolled(currentScrollY >= 600);
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`
        fixed top-0 left-0 w-full px-2 sm:px-6  z-[999] text-black
        flex items-center justify-between transition-all duration-500
        ${isVisible ? "translate-y-0" : "-translate-y-full"}
        ${isScrolled ? "bg-[#f1f1f1]" : " "}
      `}
    >
      <div 
        className='text-2xl sm:text-3xl font-bold'
        style={{ fontFamily: "'techno', sans-serif" }}
      >
        TECH X
      </div>

      <div className="flex-none p-2 ">
        <ul className="menu menu-horizontal items-center gap-2 sm:gap-0 bg-base-200 shadow-xs border-1 border-gray-200 p-0 px-2 rounded-4xl">
          
          <li>
            <a href="mailto:contact@techecomm.com" className="btn btn-circle sm:btn-sm sm:w-auto sm:px-6 bg-white">
              <Mail className="size-4 sm:size-5" />
              <span className="hidden sm:inline">Contact</span>
            </a>
          </li>

          {isAuthenticated ? (
            <li>
              <button onClick={handleLogout} className="btn btn-ghost btn-circle sm:btn-sm sm:w-auto sm:px-4 bg-white ">
                <LogOut className="size-4 sm:size-5" />
                <span className="hidden sm:inline ">Logout</span>
              </button>
            </li>
          ) : (
            <li>
              <Link to="/auth" className="btn btn-circle sm:btn-sm sm:w-auto sm:px-4 bg-white ">
                <LogIn className="size-4 sm:size-5" />
                <span className="hidden sm:inline ">Login</span>
              </Link>
            </li>
          )}

          {/* --- BOUTON PANIER CONNECTÉ --- */}
          <li>
            <button 
              className="btn btn-circle bg-white relative"
              onClick={toggleCart} // 3. AJOUTER L'ÉVÉNEMENT ONCLICK
            >
              <div className="indicator">
                <ShoppingCart className="size-4 sm:size-5" />
                
                {/* 4. AFFICHER LE BADGE (SI > 0) */}
                {uniqueItemsCount > 0 && (
                  <span className="absolute -top-4 -right-4 flex h-5 w-5 items-center justify-center rounded-full bg-error above text-sm text-white">
                    {uniqueItemsCount}
                  </span>
                )}
              </div>
            </button>
          </li>
          
        </ul>
      </div>
    </div>
  );
};

export default Navbar;