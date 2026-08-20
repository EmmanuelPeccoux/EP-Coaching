/* ═══════════════════════════════════════════════════════════════════════
   EP Coaching — Setup Lenis + branchement GSAP ScrollTrigger
   ═══════════════════════════════════════════════════════════════════════
   Chargé après les CDN GSAP/ScrollTrigger/Lenis (voir <head> de chaque
   page) et avant main.js.
   ═══════════════════════════════════════════════════════════════════════ */

gsap.registerPlugin(ScrollTrigger);

const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
});

// ScrollTrigger doit être notifié à chaque scroll Lenis pour rester
// synchronisé (sinon les triggers se déclenchent en décalage avec la
// position réelle affichée par le smooth scroll).
lenis.on("scroll", ScrollTrigger.update);

// Boucle de rendu Lenis pilotée par le ticker GSAP plutôt qu'un
// requestAnimationFrame séparé : les deux librairies restent sur la même
// horloge, pas de désync progressive entre l'animation et le scroll.
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);

  // IMPORTANT : la vélocité se lit ICI, dans le ticker GSAP, jamais dans
  // un handler lenis.on("scroll", ...) séparé. Lue depuis l'event scroll,
  // la valeur se fige (le scroll s'arrête d'émettre l'event avant que la
  // vélocité soit retombée à zéro visuellement, donnant l'impression que
  // la page "freeze"). Exposée globalement pour les prompts suivants
  // (effets pilotés par la vitesse de scroll).
  window.lenisVelocity = lenis.velocity;
});

// Lenis gère déjà le lissage du defilement, la compensation GSAP ferait
// double emploi (à-coups visibles sur les scrolls rapides).
gsap.ticker.lagSmoothing(0);

window.lenis = lenis;
