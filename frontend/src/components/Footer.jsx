import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook, Linkedin, ArrowRight, Mail } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white pt-24 pb-10  relative z-50">
      {/* border-t border-gray-900 */}
      <div className="container mx-auto px-6 md:px-10">
        
        {/* --- PARTIE HAUTE : BRANDING & NEWSLETTER --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-12">
          
          {/* Brand */}
          <div className="flex flex-col">
            <span 
              className="text-8xl md:text-9xl leading-[0.8] tracking-tighter"
              style={{ fontFamily: "'techno', sans-serif" }}
            >
              TECH X
            </span>
            <span 
              className="text-2xl md:text-3xl font-light tracking-[0.5em] mt-2"
              style={{ fontFamily: "'techno', sans-serif" }}
            >
              STORE
            </span>
          </div>

          {/* Newsletter Input */}
          <div className="w-full md:w-auto">
            <p className="text-xs uppercase tracking-widest text-gray-300 mb-4">
              Subscribe to our newsletter
            </p>
            <div className="flex items-end border-b border-gray-100 pb-2 group focus-within:border-white transition-colors">
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="bg-transparent border-none outline-none text-white placeholder-gray-300 w-full md:w-80 text-lg"
              />
              <button className="text-gray-400 group-hover:text-white transition-colors">
                <ArrowRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* --- PARTIE CENTRALE : LIENS --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-20 border-t border-gray-100 pt-16">
          
          {/* Colonne 1 : Shop */}
          <div className="flex flex-col space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-widest text-gray-300 mb-2">Shop</h4>
            <Link to="/products" className="hover:text-gray-400 transition-colors">All Products</Link>
            <Link to="/products?categorie=PHONES" className="hover:text-gray-400 transition-colors">Phones</Link>
            <Link to="/products?categorie=PC" className="hover:text-gray-400 transition-colors">Computers</Link>
            <Link to="/products?categorie=GAMING" className="hover:text-gray-400 transition-colors">Gaming Gear</Link>
          </div>

          {/* Colonne 2 : Support */}
          <div className="flex flex-col space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-widest text-gray-300 mb-2">Support</h4>
            <a href="#" className="hover:text-gray-400 transition-colors">Contact Us</a>
            <a href="#" className="hover:text-gray-400 transition-colors">FAQs</a>
            <a href="#" className="hover:text-gray-400 transition-colors">Shipping & Returns</a>
            <a href="#" className="hover:text-gray-400 transition-colors">Order Status</a>
          </div>

          {/* Colonne 3 : Company */}
          <div className="flex flex-col space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-widest text-gray-300 mb-2">Company</h4>
            <a href="#" className="hover:text-gray-400 transition-colors">About Us</a>
            <a href="#" className="hover:text-gray-400 transition-colors">Careers</a>
            <a href="#" className="hover:text-gray-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gray-400 transition-colors">Terms of Service</a>
          </div>

          {/* Colonne 4 : Contact Rapide */}
          <div className="flex flex-col space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-widest text-gray-300 mb-2">Get in touch</h4>
            <a href="mailto:hello@technostore.com" className="text-xl hover:underline flex items-center gap-2">
              <Mail className="w-5 h-5" /> hello@technostore.com
            </a>
            <p className="text-gray-300">
              123 Tech Avenue,<br/>
              Silicon Valley, CA 94025
            </p>
          </div>
        </div>

        {/* --- PARTIE BASSE : COPYRIGHT & SOCIALS --- */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-100">
          
          <p className="text-xs text-gray-300 uppercase tracking-wider mb-4 md:mb-0">
            © {currentYear} Techno Store. All rights reserved. Developed by Ilyass El-ogri.
          </p>

          <div className="flex space-x-6">
            <a href="#" className="text-gray-500 hover:text-white transition-transform hover:scale-110">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-500 hover:text-white transition-transform hover:scale-110">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-500 hover:text-white transition-transform hover:scale-110">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-500 hover:text-white transition-transform hover:scale-110">
              <Linkedin className="w-5 h-5" />
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;