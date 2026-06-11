# EP Coaching — Site Web Statique

One-page de conversion (vente indirecte → contact/RDV) pour le coaching musculation
d'Emmanuel Peccoux. Hébergé sur GitHub Pages : https://emmanuelpeccoux.github.io/EP-Coaching/

## Stack
- HTML5 / CSS3 / JavaScript vanilla (aucun framework, aucune dépendance CDN)
- GitHub Pages (déploiement automatique sur push `main`)
- Aucune dépendance npm

## Structure des fichiers
- `index.html` — Page unique : 6 "scènes" (hero, constat, preuve, méthode, athlète, CTA final)
- `style.css` — Design system "Forge Noire" + moteur de scènes
- `app.js` — Moteur de progression scroll (scènes), nav, compteurs, boutons magnétiques, fallback empilé
- `images/images/` — Photos
- `privacy-policy.html` / `terms-of-service.html` — Pages légales
- `coaching.html` / `parcours.html` / `contact.html` — Stubs de redirection (anciennes URLs en bio Instagram) vers `/EP-Coaching/`

## Design System — "Forge Noire"
- **Background:** #050505 (noir ultra deep), `--bg-soft` #0b0b0b
- **Rouge primaire:** #E60000, `--red-deep` #5e0000
- **Texte:** #f4f3f0 (`--ink`), gris `--g1` #bdbab4 / `--g2` #7a7872
- **Font display:** Fraunces (serif expressive, 900 + italique)
- **Font body:** Manrope
- **Font mono (tags/data):** JetBrains Mono
- Pas de curseur custom, pas de preloader.

## Architecture — séquence de scènes (desktop)
Le scroll ne fait PAS défiler la page verticalement à travers des sections empilées.
`#stageWrap` (600vh) contient `#stage` en `position: sticky` (pinné plein écran). Pendant
que `#stageWrap` défile, `app.js` calcule une progression `p` (0→1) et l'applique à 6
`.layer` (une par scène, superposées en `position: absolute`) :
- Chaque couche a une fenêtre `[i/6, (i+1)/6]` avec un fondu d'entrée/sortie (overlap 5%).
- `app.js` pose `--op` (opacité), `--ty`/`--tx` (translation), `--sc` (échelle) et `--hp`
  (progression "hold" interne 0→1) sur chaque `.layer` et son `.ghost` (chiffre géant en fond).
- Chaque scène a sa propre direction de mouvement (`DIRS` dans `app.js`) : la scène
  précédente se pousse/zoome/glisse pour laisser place à la suivante — rien ne défile,
  les éléments bougent en place.
- `.filmstrip` (preuve) et `.principles-track` (méthode) utilisent `--hp` pour faire
  défiler horizontalement/verticalement leurs cartes pendant le "hold" de la scène.
- `#sceneDots` (points cliquables) + `.progress` (barre de progression) donnent des repères.

## Mode empilé (mobile / tactile / `prefers-reduced-motion`)
`app.js` n'active `html.js-stage` que sur desktop non tactile sans réduction de mouvement.
Sinon : `.stage-wrap` redevient `height:auto`, chaque `.layer` redevient une section normale
empilée avec reveals `.rv` (IntersectionObserver), galerie preuve en scroll horizontal
natif (scroll-snap) et compteurs déclenchés à l'entrée dans le viewport.

## Mouvement ambiant (toujours actif)
- `.ambient` : 3 lueurs radiales (`.orb-a/b/c`) en dérive continue (CSS @keyframes), indépendantes du scroll
- `.grain` : bruit SVG animé en overlay
- `.marquee` / `.marquee.rev` : bandeaux défilants en boucle (sens opposés)
- `.hero-bg img`, `.athlete-visual img` : animation "breathe" (zoom lent continu)
- `.final-glow` : pulsation continue derrière le CTA final
- `.magnetic` : boutons qui suivent la souris (désactivé sur tactile)

## Déploiement
Push sur la branche `main` → GitHub Pages se met à jour automatiquement (délai 1-2 min).

## Règles de contenu
Vente INDIRECTE : objectif unique = pousser au contact/RDV. Pas de prix, pas de détail
d'offre, pas de page parcours.

## Liens importants
- Calendly (RDV) : https://calendly.com/peccoux-manu/30min
- WhatsApp : https://wa.me/33766834777
- Instagram : @emmanuelpeccoux
- GitHub repo : https://github.com/emmanuelpeccoux/EP-Coaching
