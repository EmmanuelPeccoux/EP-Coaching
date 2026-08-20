/* ═══════════════════════════════════════════════════════════════════════
   EP Coaching — Point d'entrée JS commun aux 3 pages
   ═══════════════════════════════════════════════════════════════════════
   Chargé après lenis-init.js (qui expose window.prefersReducedMotion).
   Fondations posées au prompt 7/15 : système de reveal au scroll,
   séquence d'entrée de page, utilitaire de découpe de texte. Les
   animations propres à chaque section (choix précis de ce qui reveal,
   dans quel ordre) arrivent au prompt 8 — ici on construit les outils.

   Garde-fou non négociable sur tout ce fichier : si prefersReducedMotion
   est vrai, aucun élément ne doit jamais rester cloué à opacity:0. Soit
   on ne touche pas du tout l'état initial, soit on l'affiche directement
   dans son état final sans animation. Jamais d'invisible qui dépend d'une
   animation qu'on vient justement de désactiver.
   ═══════════════════════════════════════════════════════════════════════ */

// Dégradation propre si un CDN ne charge pas (coupure réseau, bloqueur de
// script...) : traité exactement comme prefers-reduced-motion — aucune
// section ne doit jamais dépendre de GSAP/ScrollTrigger pour redevenir
// visible. Sans ce garde-fou, un `gsap.set(el,{opacity:0})` qui réussit
// suivi d'un `ScrollTrigger.create()` qui échoue (un seul des deux CDN en
// panne) laisserait cet élément invisible pour de bon.
const animationsAvailable = typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined";
const prefersReducedMotion = window.prefersReducedMotion === true || !animationsAvailable;

// Note pour le prompt 9 (WebGL/Three.js) : ne jamais combiner un
// rotateY CSS avec la synchronisation d'un plan WebGL sur le même
// élément (les plans se réduisent à des slivers) — piège déjà rencontré
// sur ce projet. Rien à faire ici, juste garder ce garde-fou visible au
// bon endroit avant que le prompt 9 n'ajoute du WebGL.

/* ── Système de reveal au scroll (réutilisable) ───────────────────────── */
/* [data-reveal] sur un élément isolé (portrait, en-tête de section, bloc
   CTA final...) : fade + léger déplacement vertical, déclenché une seule
   fois quand l'élément entre à ~82% du viewport (once:true — on ne veut
   jamais qu'un élément déjà lu redisparaisse en remontant, irritant).

   [data-reveal-group] sur un conteneur (grille de piliers, liste de
   cards, liste diamant) : anime ses enfants directs avec un léger
   stagger, pour un effet de groupe cohérent plutôt que des éléments qui
   popent indépendamment sans lien visuel entre eux. */

function initReveals() {
  const REVEAL_Y = 28; // px — léger déplacement, jamais spectaculaire
  const REVEAL_DURATION = 0.8;
  const REVEAL_EASE = "power2.out";
  const REVEAL_START = "top 83%";

  const singles = document.querySelectorAll("[data-reveal]");
  singles.forEach((el) => {
    if (prefersReducedMotion) return; // état final déjà en place, rien à faire
    gsap.set(el, { opacity: 0, y: REVEAL_Y });
    ScrollTrigger.create({
      trigger: el,
      start: REVEAL_START,
      once: true,
      onEnter: () => gsap.to(el, { opacity: 1, y: 0, duration: REVEAL_DURATION, ease: REVEAL_EASE }),
    });
  });

  const groups = document.querySelectorAll("[data-reveal-group]");
  groups.forEach((group) => {
    const items = Array.from(group.children);
    if (items.length === 0) return;
    if (prefersReducedMotion) return;
    gsap.set(items, { opacity: 0, y: REVEAL_Y });
    ScrollTrigger.create({
      trigger: group,
      start: REVEAL_START,
      once: true,
      onEnter: () =>
        gsap.to(items, {
          opacity: 1,
          y: 0,
          duration: REVEAL_DURATION,
          ease: REVEAL_EASE,
          stagger: 0.12,
        }),
    });
  });
}

/* ── Séquence d'entrée — homepage ─────────────────────────────────────── */
/* Premier contact avec le site : logo, puis H1, puis cadre VSL, puis les
   2 blocs de bifurcation. Timeline unique, décalages courts (overlap
   négatif), sous 1,5s au total. Rien de plus bas n'est concerné ici : le
   reste de la homepage (s'il y en a plus tard) passera par le reveal
   générique au scroll, pas cette séquence one-shot au chargement. */

function initHomeEntrance() {
  const heroVsl = document.querySelector(".hero-vsl");
  if (!heroVsl) return; // pas la homepage

  const logo = document.querySelector("header .logo");
  const h1 = heroVsl.querySelector("h1");
  const vsl = heroVsl.querySelector(".vsl-placeholder");
  const blocs = document.querySelectorAll(".bifurcation .bloc");

  if (prefersReducedMotion) return; // tout est déjà visible, rien à orchestrer

  const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
  if (logo) tl.from(logo, { opacity: 0, y: -12, duration: 0.4 });
  if (h1) tl.from(h1, { opacity: 0, y: 20, duration: 0.5 }, "-=0.2");
  if (vsl) tl.from(vsl, { opacity: 0, y: 20, duration: 0.5 }, "-=0.25");
  if (blocs.length) tl.from(blocs, { opacity: 0, y: 20, duration: 0.4, stagger: 0.12 }, "-=0.2");
  // Durée totale approximative : 0.4 + 0.3 + 0.25 + (0.4 + 0.12) ≈ 1.3s.
}

/* ── Entrée légère — pages /physique/ et /business/ ───────────────────── */
/* "Une entrée plus légère suffit" : le premier bloc de la page (bio)
   apparaît en un seul mouvement, sans séquence à étapes. Le reste de la
   page passe par [data-reveal]/[data-reveal-group] au scroll. */

function initSectionEntrance() {
  const bio = document.querySelector(".bio");
  if (!bio || document.querySelector(".hero-vsl")) return; // homepage exclue

  if (prefersReducedMotion) return;

  gsap.from(bio, { opacity: 0, y: 24, duration: 0.7, ease: "power2.out" });
}

/* ── Découpe de texte (outil préparé pour le prompt 8) ────────────────── */
/* Découpe le texte d'un titre en unités animables (mots par défaut,
   caractères en option) SANS aplatir les spans imbriqués. Un titre peut
   contenir un mot stylisé (`<span class="accent">mot</span>`, rouge ou
   en contour) : une découpe naïve qui ne traite que el.textContent
   perdrait ce style. Ici, un noeud élément rencontré est cloné (balise +
   attributs + classes préservés) et son PROPRE contenu est découpé
   récursivement à l'intérieur — jamais aplati en texte brut.

   Pas encore appelée nulle part dans ce prompt (les animations de titre
   précises arrivent au prompt 8) — l'outil est prêt et testable.

   Utilisation prévue : splitText(el, { by: "words" | "chars" }) puis
   animer les .split-unit renvoyés (ex : gsap.from(units, {opacity:0,
   y:20, stagger:0.03})). */

function splitText(el, { by = "words" } = {}) {
  function walk(sourceNode) {
    const fragment = document.createDocumentFragment();
    sourceNode.childNodes.forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const text = child.textContent;
        const units = by === "chars" ? text.split("") : text.split(/(\s+)/);
        units.forEach((unit) => {
          if (unit === "") return;
          if (/^\s+$/.test(unit)) {
            // Espace : texte brut, jamais transformé en span (sinon les
            // mots colleraient les uns aux autres visuellement).
            fragment.appendChild(document.createTextNode(unit));
            return;
          }
          const span = document.createElement("span");
          span.className = "split-unit";
          span.style.display = "inline-block";
          span.textContent = unit;
          fragment.appendChild(span);
        });
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        // Élément imbriqué (mot stylisé) : cloné tel quel (balise,
        // classes, attributs), son contenu est découpé récursivement à
        // l'intérieur — le style du span d'origine survit intact.
        const clone = child.cloneNode(false);
        clone.appendChild(walk(child));
        fragment.appendChild(clone);
      }
      // Les autres types de noeuds (commentaires...) sont ignorés.
    });
    return fragment;
  }

  const result = walk(el);
  el.textContent = "";
  el.appendChild(result);
  return el.querySelectorAll(".split-unit");
}
window.splitText = splitText;

/* ── Init ──────────────────────────────────────────────────────────────── */

initHomeEntrance();
initSectionEntrance();
initReveals();
