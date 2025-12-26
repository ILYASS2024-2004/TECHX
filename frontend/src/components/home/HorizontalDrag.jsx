import { useRef, useEffect, useLayoutEffect } from "react"; 
import gsap from "gsap";
import Draggable from "gsap/Draggable";
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

gsap.registerPlugin(Draggable);

export default function HorizontalDrag() {
  const containerRef = useRef(null);
  const innerRef = useRef(null);
  const draggableRef = useRef(null);

  // --- AJOUT POUR LE CURSOR FOLLOWER ---
  const cursorRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cursorRef.current) return;
    cursorRef.current.style.opacity = 1;
cursorRef.current.style.transform = `translate(${e.clientX }px, ${e.clientY}px)`;
  };

  const handleMouseLeave = () => {
    if (!cursorRef.current) return;
    cursorRef.current.style.opacity = 0;
  };
  // --------------------------------------

  useLayoutEffect(() => {
    const container = containerRef.current;
    const inner = innerRef.current;
    if (!container || !inner) return;

    container.style.touchAction = "pan-y";
    inner.style.userSelect = "none";
    inner.style.cursor = "grab";

    const calcAndCreate = () => {
      const innerW = inner.offsetWidth;
      const containerW = container.offsetWidth;
      const maxDrag = Math.max(0, innerW - containerW);
      console.log("[HD] innerW:", innerW, "containerW:", containerW, "maxDrag:", maxDrag);

      if (draggableRef.current) {
        try {
          draggableRef.current.applyBounds({ minX: -maxDrag, maxX: 0 });
        } catch (e) {
          console.warn("[HD] Erreur applyBounds, kill et recrée", e);
          draggableRef.current.kill();
          draggableRef.current = null;
        }
      }

     
    };

    const rafId = requestAnimationFrame(calcAndCreate);

    const ro = new ResizeObserver(() => {
      calcAndCreate();
    });

    ro.observe(container);
    ro.observe(inner);

    const imgs = inner.querySelectorAll("img");
    imgs.forEach(img => {
      if (!img.complete) {
        img.addEventListener("load", calcAndCreate);
      }
    });

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      imgs.forEach(img => img.removeEventListener("load", calcAndCreate));
      if (draggableRef.current) {
        try { draggableRef.current.kill(); }
        catch (e) { console.log(e); }
        draggableRef.current = null;
      }
    };
  }, []);

  return (
    <div
      className="bg-black"
      ref={containerRef}
      style={{ width: "100vw", height: "100%", overflow: "hidden" }}
    >
      <div
        ref={innerRef}
        style={{
          gap: 0,
          position: "relative",
          display: "inline-flex",
          height: "100%",
        }}

        // --- AJOUT POUR ACTIVER LE CURSOR FOLLOWER ---
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        // ------------------------------------------------
      >
        <div className="h-full shrink-0 relative  w-[300px] sm:w-[500px]" >
          <div className="absolute w-full h-full bg-red-500/40"></div>
          <img
            src="img/recom.png"
            alt="Catégorie Phones"
            className="w-full h-full object-cover"
            draggable="false"
          />
          {/* dans ca mettre url to products for you modelB */}
          <Link
            to="/recommended"
            className="absolute bottom-5 left-5 z-10 flex items-center gap-2 py-2 px-4 text-white hover:scale-120 transition-all"
          >
            <span className="font-bold text-2xl sm:text-4xl diamod">FOR YOU</span>
            <ArrowUpRight className="w-10 h-10" />
          </Link>
        </div>
        {/* Item 1 - PHONES */}
        <div className="h-full shrink-0 relative  w-[300px] sm:w-[500px]" >
          <div className="absolute w-full h-full bg-blue-500/40"></div>
          <img
            src="img/ph.png"
            alt="Catégorie Phones"
            className="w-full h-full object-cover"
            draggable="false"
          />
          <Link
            to="/products?categorie=PHONES"
            className="absolute bottom-5 left-5 z-10 flex items-center gap-2 py-2 px-4 text-white hover:scale-120 transition-all"
          >
            <span className="font-bold text-2xl sm:text-4xl diamod">PHONES</span>
            <ArrowUpRight className="w-10 h-10" />
          </Link>
        </div>

        {/* Item 2 - PC */}
        <div className="h-full shrink-0 relative  w-[300px] sm:w-[500px]" >
          <div className="absolute w-full h-full bg-red-500/40"></div>
          <img
            src="img/pc1.png"
            alt="Catégorie PC"
            className="w-full h-full object-cover"
            draggable="false"
          />
          <Link
            to="/products?categorie=PC"
            className="absolute bottom-5 left-5 z-10 flex items-center gap-2 py-2 px-4 text-white hover:scale-120 transition-all"
          >
            <span className="font-bold text-2xl sm:text-4xl diamod">PC</span>
            <ArrowUpRight className="w-10 h-10" />
          </Link>
        </div>

        {/* Item 3 - CAMERA */}
        <div className="h-full shrink-0 relative  w-[300px] sm:w-[500px]" >
          <div className="absolute w-full h-full bg-blue-500/40"></div>
          <img
            src="img/cam.png"
            alt="Catégorie Camera"
            className="w-full h-full object-cover"
            draggable="false"
          />
          <Link
            to="/products?categorie=CAMERA"
            className="absolute bottom-5 left-5 z-10 flex items-center gap-2 py-2 px-4 text-white hover:scale-120 transition-all"
          >
            <span className="font-bold text-2xl sm:text-4xl diamod">CAMERA</span>
            <ArrowUpRight className="w-10 h-10" />
          </Link>
        </div>

        {/* Item 4 - GAMING */}
        <div className="h-full shrink-0 relative w-[300px] sm:w-[500px]" >
          <div className="absolute w-full h-full bg-red-500/40"></div>
          <img
            src="img/gm.png"
            alt="Catégorie Gaming"
            className="w-full h-full object-cover"
            draggable="false"
          />
          <Link
            to="/products?categorie=GAMING"
            className="absolute bottom-5 left-5 z-10 flex items-center gap-2 py-2 px-4 text-white hover:scale-120 transition-all"
          >
            <span className="font-bold text-2xl sm:text-4xl diamod">GAMING</span>
            <ArrowUpRight className="w-10 h-10" />
          </Link>
        </div>

      </div>

      {/* --- OVALE QUI SUIT LA SOURIS --- */}
      <div
        ref={cursorRef}
        className="nix border-black border-2"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          background: "rgba(255,255,255)",
          padding: "6px 18px",
          borderRadius: "999px",
          pointerEvents: "none",
          fontWeight: "bold",
          fontSize: "18px",
          color: "#000",
          transition: "opacity 0.15s ease-out",
          opacity: 0,
          zIndex: 99999,
        }}
      >
        &lt;- DRAG -&gt;
      </div>
    </div>
  );
}
