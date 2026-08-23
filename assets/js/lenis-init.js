/* ═══════════════════════════════════════════════════════════════════════
   EP Coaching, Setup Lenis + branchement GSAP ScrollTrigger
   ═══════════════════════════════════════════════════════════════════════
   Chargé après les CDN GSAP/ScrollTrigger/Lenis (voir <head> de chaque
   page) et avant main.js.
   ═══════════════════════════════════════════════════════════════════════ */

gsap.registerPlugin(ScrollTrigger);

// Quality floor posé au prompt 6/15, pour toute la phase animation à
// venir : le smooth scroll est lui-même un effet de mouvement, désactivé
// pour qui le demande explicitement au niveau système. Le scroll natif
// du navigateur prend le relais, ScrollTrigger continue de fonctionner
// normalement dessus (il ne dépend pas de Lenis pour exister).
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
// Exposé globalement : main.js (reveals, timelines d'entrée) s'appuie sur
// la même valeur plutôt que de refaire le matchMedia de son côté, une
// seule source de vérité, jamais de risque de désync entre les deux.
window.prefersReducedMotion = prefersReducedMotion;

const lenis = new Lenis({
  // 1s plutôt que le 1.2s par défaut : reste premium sans donner
  // l'impression de patiner, cf. retour explicite "réactif, pas mou".
  duration: 1.0,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: !prefersReducedMotion,
  // Le tactile garde son momentum natif iOS (déjà excellent) plutôt que
  // d'être repris par le lissage Lenis, pensé pour la molette souris, // Emmanuel consulte principalement sur iPhone, un scroll tactile
  // "lissé artificiellement" se sentirait pire que le natif, pas mieux.
  syncTouch: false,
});

if (prefersReducedMotion) {
  lenis.stop();
}

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
