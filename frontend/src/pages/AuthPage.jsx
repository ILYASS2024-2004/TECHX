import React, { useState } from 'react';
import { Eye, EyeOff, ArrowRight, Loader } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore'; // Votre store Zustand

// --- 1. Composant "Input Souligné" (Réutilisable) ---
// Nous créons ce composant pour correspondre à votre design
const UnderlineInput = ({ id, label, type, value, onChange }) => (
  <div className="form-control w-full">
    <label htmlFor={id} className="label pt-0">
      <span className="label-text text-black text-sm">{label}*</span>
    </label>
    <input
      type={type}
      id={id}
      value={value}
      onChange={onChange}
      required
      // C'est la partie Tailwind qui crée le style "souligné"
      className="input input-ghost w-full bg-transparent 
                 border-0 border-b-2 border-gray-300 
                 rounded-none text-black
                 focus:outline-none focus:ring-0 focus:border-primary 
                 p-1"
    />
  </div>
);

// --- 2. Composant "Input Mot de Passe" (Réutilisable) ---
// (Similaire, mais avec le bouton pour voir/cacher)
const PasswordInput = ({ id, label, value, onChange }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="form-control w-full relative">
      <label htmlFor={id} className="label pt-0">
        <span className="label-text text-black text-sm">{label}*</span>
      </label>
      <input
        type={show ? 'text' : 'password'}
        id={id}
        value={value}
        onChange={onChange}
        required
        className="input input-ghost w-full bg-transparent 
                   border-0 border-b-2 border-gray-300 
                   rounded-none text-black
                   focus:outline-none focus:ring-0 focus:border-primary 
                   p-1"
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute bottom-2 right-2 text-gray-500"
      >
        {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
      </button>
    </div>
  );
};

// --- 3. Formulaire de Connexion (Login) ---
const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Récupérer la fonction 'login' et 'isLoading' de Zustand
  const { login, isLoading } = useAuthStore();
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Appeler l'action du store
      await login(email, password);
      // Si c'est un succès, le store (via le 'checkAuth')
      // va mettre à jour 'isAuthenticated' dans App.jsx,
      // et l'utilisateur sera redirigé.
      // On le force ici au cas où :
      navigate('/');
    } catch (error) {
      // Le store (useAuthStore) gère déjà l'affichage du toast d'erreur
      console.error('Failed to login:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-8">
      <UnderlineInput
        id="login-email"
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <PasswordInput
        id="login-password"
        label="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <a href="#" className="text-xs text-gray-500 hover:text-primary">
        Have you forgotten your password?
      </a>
      <button 
        type="submit" 
        className="btn btn-ghost px-2 text-black 
                   flex items-center gap-2 
                   hover:bg-transparent"
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader className="animate-spin" />
        ) : (
          <>
            LOGIN <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
    </form>
  );
};

// --- 4. Formulaire d'Inscription (Signup) ---
const SignupForm = () => {
  const [nom, setNom] = useState(''); // "First name" + "Last name" = "nom" dans votre BDD
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { signup, isLoading } = useAuthStore();
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(nom, email, password);
      // Succès, naviguer vers la page d'accueil
      navigate('/');
    } catch (error) {
      // Le store gère le toast d'erreur
      console.error('Failed to signup:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-8">
      {/* NOTE : Votre design a "First name" et "Last name",
        mais votre base de données (table 'user') n'a qu'une colonne 'nom'.
        J'ai donc fusionné les deux en un seul champ "Full name".
      */}
      <UnderlineInput
        id="signup-name"
        label="Full name"
        type="text"
        value={nom}
        onChange={(e) => setNom(e.target.value)}
      />
      <UnderlineInput
        id="signup-email"
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <PasswordInput
        id="signup-password"
        label="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button 
        type="submit" 
        className="btn btn-ghost px-2 text-black 
                   flex items-center gap-2 
                   hover:bg-transparent"
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader className="animate-spin " />
        ) : (
          <>
            CREATE ACCOUNT <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
    </form>
  );
};


// --- 5. La Page Principale d'Authentification ---
const AuthPage = () => {
  return (
    // Ce conteneur centre tout
    <div className="min-h-screen flex items-center justify-center bg-[#f1f1f1] p-4">
      
      {/* Nous utilisons un "card" DaisyUI pour le fond blanc, 
        mais nous le modifions
      */}
      <div className="card w-full max-w-6xl ">
        <div className="card-body p-4 md:p-12">
          
          {/* Layout : 2 colonnes sur desktop, 1 sur mobile */}
          <div className="flex flex-col md:flex-row gap-8 md:gap-16">

            {/* Colonne 1: LOGIN */}
            <div className="flex-1">
              <h2 
                className="text-xl sm:text-2xl text-black mb-8 mt-10 sm:mt-0" 
                style={{ fontFamily: "'techno', sans-serif" }}
              >
                01/ LOGIN
              </h2>
              <LoginForm />
            </div>

            {/* Séparateur (visible sur desktop seulement) */}
            <div className="divider md:divider-horizontal">OR</div>

            {/* Colonne 2: CREATE AN ACCOUNT */}
            <div className="flex-1 ">
              <h2 
                className="text-xl sm:text-2xl text-black mb-8 " 
                style={{ fontFamily: "'techno', sans-serif" }}
              >
                02/ CREATE AN ACCOUNT
              </h2>
              <SignupForm />
            </div>

          </div>
        </div>
      </div>
      
      {/* Lien pour retourner à l'accueil (si besoin) */}
      <Link to="/" className=" absolute top-10 left-4 btn btn-ghost ">
        ← 
      </Link>
    </div>
  );
};

export default AuthPage;