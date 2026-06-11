# EP Coaching — Site Web Statique

One-page de conversion (vente indirecte → contact/RDV) pour le coaching musculation
d'Emmanuel Peccoux. Hébergé sur GitHub Pages : https://emmanuelpeccoux.github.io/EP-Coaching/

## Stack
- HTML5 / CSS3 / JavaScript vanilla (aucun framework, aucune dépendance CDN)
- GitHub Pages (déploiement automatique sur push `main`)
- Aucune dépendance npm

## Structure des fichiers
- `index.html` — Page unique (hero, constat, preuve, méthode, athlète, CTA final)
- `style.css` — Design system "Forge Noire" (toutes les animations CSS)
- `app.js` — Reveals (IntersectionObserver), compteurs, boutons magnétiques, nav, galerie preuve
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

## Mouvement
- `.ambient` : 3 lueurs radiales (`.orb-a/b/c`) en dérive continue (CSS @keyframes), indépendantes du scroll
- `.grain` : bruit SVG animé en overlay
- `.marquee` / `.marquee.rev` : bandeaux défilants en boucle (sens opposés)
- `.hero-bg img`, `.athlete-visual img` : animation "breathe" (zoom lent continu)
- `.final-glow` : pulsation continue derrière le CTA final
- `.rv` : reveals au scroll via IntersectionObserver (`app.js`)
- `.magnetic` : boutons qui suivent la souris (désactivé sur tactile)
- Galerie preuve (`#proofTrack`) : scroll horizontal natif (scroll-snap) + molette convertie en scroll horizontal sur desktop + années actives en surbrillance

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
