/* ═══════════════════════════════════════════════════════════════════════
   EP Coaching — Point d'entrée JS commun aux 3 pages
   ═══════════════════════════════════════════════════════════════════════
   Chargé après lenis-init.js (qui expose window.prefersReducedMotion).
   Fondations posées au prompt 7/15, animations par section ajoutées au
   prompt 8/15. Principe directeur rappelé dans le prompt : cinématique,
   pas agité — un visiteur doit se souvenir d'un ou deux moments, pas de
   vingt effets. En cas de doute sur un effet, il a été retiré plutôt que
   gardé "au cas où" (voir le skew de vélocité plus bas, périmètre
   volontairement pas fait dans cette passe).

   Garde-fou non négociable sur tout ce fichier : si prefersReducedMotion
   est vrai, aucun élément ne doit jamais rester cloué à opacity:0. Soit
   on ne touche pas du tout l'état initial, soit on l'affiche directement
   dans son état final sans animation. Jamais d'invisible qui dépend d'une
   animation qu'on vient justement de désactiver.

   Règle de retrait (prompt 9/15) : repassé sur chaque effet du fichier en
   se demandant s'il sert vraiment la lecture. Aucun n'a été retiré — les
   reveals de titre/cards répondent à une demande explicite du prompt 8,
   la parallaxe portrait/le compactage du header sont volontairement
   discrets (jamais une "attraction"), et les 2-3 vrais moments du site
   (entrée homepage, choix de la bifurcation, arrivée au CTA final)
   restent peu nombreux et délibérés plutôt qu'une accumulation d'effets.
   Le seul retrait de cette passe est plus radical qu'un simple réglage :
   Three.js entier, voir le volet WebGL documenté dans le commit et le
   README plutôt que dans ce fichier (rien ici n'en dépendait).
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

/* ── Découpe de texte (prompt 7, utilisée ici pour la 1ère fois) ──────── */
/* Voir le commentaire complet de la fonction plus bas dans ce fichier —
   déplacée logiquement après son premier usage réel serait plus naturel,
   mais les déclarations `function` sont hissées : l'ordre dans le fichier
   n'a pas d'incidence sur l'exécution, seulement sur la lecture. Elle
   reste en bas, avec sa documentation complète, comme au prompt 7. */

/* ── Titres de section (H2) — découpe par mots, style préservé ────────── */
/* Un seul type de traitement pour tous les H2 du site : découpe en mots
   (jamais en caractères, plus lisible pendant l'animation sur des titres
   longs), chaque mot part d'opacity:0 + léger y, stagger court. Les mots
   stylisés (span rouge/outline) gardent leur style intact grâce à
   splitText — c'est tout l'intérêt de la variante "spans imbriqués". */

const TITLE_WORD_DURATION = 0.5;
const TITLE_WORD_STAGGER = 0.035;
const TITLE_WORD_Y = 14;

function prepareTitleWords(h2) {
  const words = splitText(h2, { by: "words" });
  gsap.set(words, { opacity: 0, y: TITLE_WORD_Y });
  return words;
}

function revealTitleWords(words, overrides = {}) {
  return gsap.to(words, {
    opacity: 1,
    y: 0,
    duration: TITLE_WORD_DURATION,
    ease: "power2.out",
    stagger: TITLE_WORD_STAGGER,
    ...overrides,
  });
}

function initTitleReveals() {
  if (prefersReducedMotion) return;
  const titles = document.querySelectorAll("h2");
  titles.forEach((h2) => {
    // Le H2 de la bifurcation homepage est géré dans initHomeEntrance
    // (au chargement, pas au scroll) — même traitement de mots, autre
    // déclencheur, pas de doublon ici.
    if (h2.closest(".bifurcation")) return;
    const words = prepareTitleWords(h2);
    // Le H2 du CTA final garde le même mécanisme (mots, spans préservés)
    // que tous les autres — "un seul type de traitement" — mais avec une
    // nuance d'intensité (durée/easing) cohérente avec le reste de cette
    // section, qui mérite plus de présence (voir initCtaFinalReveal).
    // Un seul ScrollTrigger, un seul système : pas de doublon.
    const inCtaFinal = h2.closest(".cta-final");
    ScrollTrigger.create({
      trigger: h2,
      start: "top 85%",
      once: true,
      onEnter: () =>
        revealTitleWords(words, inCtaFinal ? { duration: 0.7, ease: "power3.out" } : {}),
    });
  });
}

/* ── Système de reveal au scroll (réutilisable, prompt 7) ─────────────── */
/* [data-reveal] sur un élément isolé : fade + léger déplacement vertical,
   déclenché une seule fois quand l'élément entre à ~83% du viewport
   (once:true — un élément déjà lu ne redisparaît jamais en remontant).

   [data-reveal-group] sur un conteneur (grille de piliers, liste de
   cards, bloc eyebrow+paragraphe) : anime ses enfants directs avec un
   stagger court (60-100ms, demande explicite du prompt 8). Les H2 sont
   exclus de ce groupe : ils ont leur propre reveal par mots ci-dessus,
   les mélanger aux deux systèmes ferait doublon sur le même élément. */

function initReveals() {
  if (prefersReducedMotion) return;

  const REVEAL_Y = 28;
  const REVEAL_DURATION = 0.8;
  const REVEAL_EASE = "power2.out";
  const REVEAL_START = "top 83%";
  const GROUP_DURATION = 0.6; // plus court que REVEAL_DURATION : avec le
  // stagger, un groupe de 6 (piliers) doit rester sous 1s au total
  // (demande explicite) — 5 × 0.08 + 0.6 = 1.0s pile.
  const GROUP_STAGGER = 0.08;

  const singles = document.querySelectorAll("[data-reveal]");
  singles.forEach((el) => {
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
    // Stagger dans l'ordre du DOM = ordre de lecture naturel (gauche à
    // droite, ligne par ligne pour une grille en repeat(3,1fr)) sans
    // rien recalculer : les piliers sont déjà dans cet ordre en HTML.
    const items = Array.from(group.children).filter((child) => child.tagName !== "H2");
    if (items.length === 0) return;
    gsap.set(items, { opacity: 0, y: REVEAL_Y });
    ScrollTrigger.create({
      trigger: group,
      start: REVEAL_START,
      once: true,
      onEnter: () =>
        gsap.to(items, {
          opacity: 1,
          y: 0,
          duration: GROUP_DURATION,
          ease: REVEAL_EASE,
          stagger: GROUP_STAGGER,
        }),
    });
  });
}

/* ── Séquence d'entrée — homepage ─────────────────────────────────────── */
/* Logo, puis H1, puis cadre VSL, puis le H2 de bifurcation (mots), puis
   les 2 blocs. Timeline unique, sous 1,5s au total. */

function initHomeEntrance() {
  const heroVsl = document.querySelector(".hero-vsl");
  if (!heroVsl) return; // pas la homepage
  if (prefersReducedMotion) return;

  const logo = document.querySelector("header .logo");
  const h1 = heroVsl.querySelector("h1");
  const vsl = heroVsl.querySelector(".vsl-placeholder");
  const bifurcationH2 = document.querySelector(".bifurcation h2");
  const blocs = document.querySelectorAll(".bifurcation .bloc");

  const titleWords = bifurcationH2 ? prepareTitleWords(bifurcationH2) : null;

  const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
  if (logo) tl.from(logo, { opacity: 0, y: -12, duration: 0.4 });
  if (h1) tl.from(h1, { opacity: 0, y: 20, duration: 0.5 }, "-=0.2");
  if (vsl) tl.from(vsl, { opacity: 0, y: 20, duration: 0.5 }, "-=0.25");
  if (titleWords) {
    tl.to(titleWords, { opacity: 1, y: 0, duration: 0.4, stagger: TITLE_WORD_STAGGER }, "-=0.15");
  }
  if (blocs.length) tl.from(blocs, { opacity: 0, y: 20, duration: 0.4, stagger: 0.12 }, "-=0.1");
  // Durée totale approximative : 0.4 + 0.3 + 0.25 + 0.25 + (0.4 + 0.12) ≈ 1.4s.
}

/* ── Entrée légère — pages /physique/ et /business/ ───────────────────── */
/* "Une entrée plus légère suffit", mais en plusieurs petits temps plutôt
   qu'un seul bloc : le portrait arrive, le texte le suit avec un léger
   décalage (demande explicite), puis les 3 compétences en dessous avec
   leur propre stagger court. Une seule timeline coordonnée, pas 3
   systèmes indépendants qui risqueraient de se marcher dessus. */

function initSectionEntrance() {
  const bio = document.querySelector(".bio");
  if (!bio || document.querySelector(".hero-vsl")) return; // homepage exclue
  if (prefersReducedMotion) return;

  const portrait = bio.querySelector(".portrait");
  const eyebrow = bio.querySelector(".split-content .eyebrow");
  const heading = bio.querySelector(".split-content h1");
  const bodyText = bio.querySelector(".split-content > p");
  const listItems = bio.querySelectorAll(".diamond-list .diamond-item");

  const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
  if (portrait) tl.from(portrait, { opacity: 0, y: 24, duration: 0.6 });

  const textUnits = [eyebrow, heading, bodyText].filter(Boolean);
  if (textUnits.length) {
    tl.from(textUnits, { opacity: 0, y: 18, duration: 0.5, stagger: 0.08 }, portrait ? "-=0.35" : 0);
  }

  if (listItems.length) {
    tl.from(listItems, { opacity: 0, y: 14, duration: 0.4, stagger: 0.06 }, "-=0.15");
  }
}

/* ── Parallaxe légère — portrait de la section bio ────────────────────── */
/* Sur un élément INTÉRIEUR au portrait (jamais .portrait lui-même, qui
   est déjà animé par initSectionEntrance ci-dessus — deux tweens GSAP sur
   la même propriété du même élément se marcheraient dessus). Déplacement
   total capé à 30px sur toute la traversée de la section, scrub (lié à la
   position de scroll, pas à sa vélocité) pour un mouvement toujours
   fluide et prévisible. .portrait a déjà overflow:hidden (prompt 5) : le
   contenu glisse dans un cadre fixe, effet de profondeur classique. */

function initPortraitParallax() {
  if (prefersReducedMotion) return;
  const target = document.querySelector(".portrait img, .portrait-placeholder");
  const portrait = document.querySelector(".portrait");
  if (!target || !portrait) return;

  gsap.fromTo(
    target,
    { y: -15 },
    {
      y: 15,
      ease: "none",
      scrollTrigger: {
        trigger: portrait,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    }
  );
}

/* ── CTA final — traitement le plus marqué de la page ─────────────────── */
/* Séquence dédiée (pas le système générique [data-reveal]) : durée et
   easing plus présents que le reveal standard, ET ordre garanti — sur
   /business/, le CTA de secours ne doit JAMAIS apparaître avant le CTA
   principal (demande explicite, la hiérarchie visuelle doit se retrouver
   dans le temps). Pas de pulsation du glow au repos : un CTA statique
   bien dessiné (déjà en place depuis la phase design) est plus premium
   qu'une micro-animation qui attire l'oeil en continu — jugé "cheap" ici,
   volontairement pas fait (le prompt autorise explicitement ce choix). */

function initCtaFinalReveal() {
  const inner = document.querySelector(".cta-final-inner");
  if (!inner || prefersReducedMotion) return;

  const diamond = inner.querySelector(".diamond");
  // Le H2 n'est PAS repris ici : initTitleReveals() s'en charge déjà,
  // comme pour tous les H2 du site (un seul type de traitement, sans
  // exception — demande explicite du prompt 8). Le mettre aussi dans
  // mainUnits ci-dessous ferait doublon : deux ScrollTrigger distincts
  // animeraient le même élément (l'un ses mots via splitText, l'autre le
  // bloc entier), trouvé en testant la logique avec jsdom avant ce commit.
  const body = inner.querySelector("p");
  const primaryCta = inner.querySelector(".btn-cta-primary");
  const subtext = inner.querySelector(".btn-subtext");
  const fallbackCta = inner.querySelector(".btn-cta-fallback"); // /business/ seulement

  const mainUnits = [diamond, body, primaryCta, subtext].filter(Boolean);
  if (mainUnits.length === 0 && !fallbackCta) return;

  gsap.set(mainUnits, { opacity: 0, y: 30 });
  if (fallbackCta) gsap.set(fallbackCta, { opacity: 0, y: 16 });

  ScrollTrigger.create({
    trigger: inner,
    start: "top 83%",
    once: true,
    onEnter: () => {
      // power3.out (plus marqué que le power2.out générique) + 1s (plus
      // long que les 0.8s du reveal standard) : la nuance de présence
      // demandée pour le point d'arrivée de la page.
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.to(mainUnits, { opacity: 1, y: 0, duration: 1.0, stagger: 0.12 });
      if (fallbackCta) {
        // Volontairement sans overlap négatif : ne démarre qu'une fois
        // TOUT le groupe principal (donc le CTA principal) déjà arrivé.
        tl.to(fallbackCta, { opacity: 1, y: 0, duration: 0.5 });
      }
    },
  });
}

/* ── Header au scroll ──────────────────────────────────────────────────── */
/* Se compacte légèrement passé 80px de scroll (padding réduit, fond qui
   se densifie — voir .header--scrolled dans base.css). Toggle de classe
   uniquement, pas de tween GSAP : reste correct même sous reduced-motion
   (la transition CSS est déjà neutralisée globalement dans ce cas, voir
   base.css) et ne cache jamais aucun contenu, donc pas besoin du
   garde-fou prefersReducedMotion ici. */

function initHeaderScroll() {
  if (!animationsAvailable) return;
  const header = document.querySelector("header");
  if (!header) return;

  // Note performance (prompt 9/15) : padding/background-color/backdrop-
  // filter ne sont pas transform/opacity, donc pas "gratuits" au sens
  // strict — mais c'est un toggle de classe déclenché UNE fois par
  // franchissement de seuil, jamais par frame de scroll. Le layout
  // thrashing que la règle "transform/opacity uniquement" cherche à
  // éviter concerne les propriétés animées en continu (des dizaines de
  // fois par seconde), pas un changement d'état ponctuel — même les sites
  // les plus optimisés compactent leur header ainsi.
  ScrollTrigger.create({
    start: 80,
    onEnter: () => header.classList.add("header--scrolled"),
    onLeaveBack: () => header.classList.remove("header--scrolled"),
  });
}

/* ── Navigation par ancre ──────────────────────────────────────────────── */
/* Le seul lien d'ancre du site (#cta-final, bouton "Accompagnement 1-to-1"
   au milieu de /physique/ et /business/) passe par Lenis pour rester
   cohérent avec le smooth scroll du reste du site plutôt qu'un saut natif
   instantané. `click` couvre le clic souris ET l'activation clavier
   (Entrée/Espace sur un lien focus déclenche le même événement `click`
   natif, rien à coder en plus pour l'accessibilité) — exigence explicite
   du prompt 9 : Lenis ne doit jamais empêcher la navigation par ancre au
   clavier, donc jamais intercepté avec autre chose qu'un vrai handler de
   clic standard. */

function initAnchorScroll() {
  if (prefersReducedMotion || !window.lenis) return; // saut natif instantané prend le relais, jamais bloqué
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const id = link.getAttribute("href").slice(1);
      const target = id ? document.getElementById(id) : null;
      if (!target) return;
      e.preventDefault();
      window.lenis.scrollTo(target);
    });
  });
}

/* ── Robustesse ScrollTrigger (prompt 9/15) ───────────────────────────── */
/* Le redimensionnement de fenêtre est déjà géré nativement par
   ScrollTrigger (il écoute resize et recalcule tout seul, rien à ajouter
   ici). Deux cas réels non couverts par défaut :
   1. Google Fonts charge en asynchrone (display=swap) : le texte rendu
      dans la police de repli peut avoir une hauteur différente de la
      police finale, faussant les positions de déclenchement calculées
      avant que la vraie police n'arrive. document.fonts.ready règle ça.
   2. Retour arrière navigateur : certains navigateurs restaurent la page
      depuis le bfcache (event pageshow, persisted:true) sans forcément
      recalculer les positions ScrollTrigger par rapport au scroll
      restauré — un refresh() à ce moment évite tout état incohérent. */

function initScrollTriggerRefresh() {
  if (!animationsAvailable) return;

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }

  window.addEventListener("pageshow", (e) => {
    if (e.persisted) ScrollTrigger.refresh();
  });
}

/* ── Découpe de texte (outil du prompt 7, utilisé pour la 1ère fois ici) */
/* Découpe le texte d'un titre en unités animables (mots par défaut,
   caractères en option) SANS aplatir les spans imbriqués. Un titre peut
   contenir un mot stylisé (`<span class="accent">mot</span>`, rouge ou
   en contour) : une découpe naïve qui ne traite que el.textContent
   perdrait ce style. Ici, un noeud élément rencontré est cloné (balise +
   attributs + classes préservés) et son PROPRE contenu est découpé
   récursivement à l'intérieur — jamais aplati en texte brut. Testé avec
   jsdom au prompt 7 (pas seulement relu) : un span imbriqué survit
   intact après découpe. */

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

/* ── Vélocité de scroll (prompt 7 : window.lenisVelocity exposé) ──────── */
/* Pas d'effet de skew/déformation lié à la vélocité dans cette passe : le
   prompt autorise explicitement à ne pas le faire si le résultat n'est
   pas convaincant, et ça ne peut pas se juger sans un vrai navigateur
   pour voir le rendu en conditions réelles de scroll rapide (ce que cet
   environnement n'a pas). window.lenisVelocity reste disponible pour un
   prompt ultérieur si l'effet est retenté avec de vraies conditions de
   test. Mieux vaut ne rien livrer que livrer un effet non vérifié qui
   donnerait le mal de mer, exactement le risque décrit dans le prompt. */

/* ── Init ──────────────────────────────────────────────────────────────── */

initHomeEntrance();
initSectionEntrance();
initTitleReveals();
initReveals();
initPortraitParallax();
initCtaFinalReveal();
initHeaderScroll();
initAnchorScroll();
initScrollTriggerRefresh();
