// ScrollToTop.jsx
import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useLayoutEffect(() => {
    // Empêche le navigateur d'essayer de restaurer automatiquement la position
    if ("scrollRestoration" in window.history) {
      try {
        window.history.scrollRestoration = "manual";
      } catch (e) {
        // certains environnements (ex: SSR) peuvent lever une erreur
        console.log(e)
      }
    }

    // Si il y a un hash (#ancre) -> scroll vers l'ancre si présente
    if (hash) {
      // Timeout très court pour laisser le DOM se stabiliser
      setTimeout(() => {
        const id = hash.replace("#", "");
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "auto", block: "start" });
          return;
        }
        // fallback: scroll top si l'id n'existe pas
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      }, 0);
      return;
    }

    // Scroll to top immédiat
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname, hash]);

  return null;
}
