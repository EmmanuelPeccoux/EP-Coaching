# EP Coaching — Site vitrine

Site vitrine (vente indirecte, pousse au contact) reconstruit à partir de
zéro le 2026-08-20, en 15 prompts découpés par phase technique.

## Stack

HTML/CSS/JS vanilla, zéro npm. Librairies via CDN : GSAP 3.12.5 +
ScrollTrigger, Lenis 1.1.14, Three.js 0.152.2 (UMD).

## Déploiement

GitHub Pages, auto-deploy sur push vers `main`. Servi actuellement sous
`https://emmanuelpeccoux.github.io/EP-Coaching/` (pas de domaine
personnalisé, aucun `CNAME` dans le repo). **Vérifié en conditions
réelles** (pas seulement supposé) : après le push du prompt 2, un `curl`
sur cette URL renvoyait bien le nouveau contenu quelques minutes plus
tard, sans action manuelle. Pas d'accès aux settings GitHub Pages du repo
depuis cet environnement (`gh` CLI absent, pas de connecteur GitHub) —
si un jour le déploiement semble ne plus se faire, le premier réflexe est
de vérifier Settings → Pages → Source sur GitHub directement.

## Structure

```
/
├── index.html          → Homepage courte (VSL + bifurcation)
├── physique/            → Chemin "progresser en musculation"
├── business/            → Chemin "scaler son business de coach"
├── 404.html              → Page d'erreur, lien de retour en URL absolue (voir commentaire dans le fichier)
├── robots.txt / sitemap.xml
├── favicon.svg / favicon.ico / apple-touch-icon.png → placeholder carré rouge + "EP"
└── assets/
    ├── css/              → base.css (variables/reset) + 1 fichier par page
    ├── js/               → lenis-init.js (setup smooth scroll) + main.js
    └── images/           → photos réutilisées de l'ancienne version du site
```

## Suivi des prompts

- [x] 1/15 — Structure (squelette HTML, arborescence, variables CSS de base)
- [x] 2/15 — Navigation, footer, SEO, câblage des CTA
- [x] 3/15 — Clôture structure : 404, robots.txt/sitemap.xml, favicon, preconnect/defer, accessibilité de base
- [x] 4/15 — Système de design (tokens, typo, boutons, cards, motif diamant) + application complète au hero + bifurcation
- [ ] 5/15 à 15/15 — design des pages physique/business, animations, contenu, déploiement final

## Système de design (depuis le prompt 4/15)

Tokens dans `base.css` : échelle d'espacement (`--space-xs` à `--space-3xl`,
base 8px), échelle typographique en `clamp()` (h1/h2/h3), boutons et cards
avec hover. **Motif signature : le diamant rouge** du logo historique,
repris à 3 échelles — petit (puce/séparateur/logo), et en grand filigrane
(`.hero-diamond-ghost`) derrière le hero homepage, le risque assumé de ce
prompt (voir commentaire dans `home.css`). Les pages physique/business
héritent déjà des boutons/cards/typo via `base.css` sans avoir été
retouchées : leur traitement visuel complet arrive dans un prompt dédié.

## Liens externes câblés

- Instagram : https://instagram.com/santamariasanchez_
- Pages légales (temporaires, pointent vers l'app) : https://ep-coaching.vercel.app/legal/{cgu,cgv,confidentialite}
- Préqualification physique : https://ep-coaching-formulaires.vercel.app/prequalification
- Préqualification business : pas encore créée, placeholder `#TODO-prequalification-business` dans `business/index.html`
- Fallback business (inscription gratuite) : https://ep-coaching.vercel.app/auth/client

## Accessibilité

Un seul `<h1>` par page (bio pour physique/business, hero pour la home),
`<h2>` sur chaque section, pas de saut de niveau. Pas encore de balise
`<img>` dans le HTML (les photos dans `assets/images/` ne sont pas
encore intégrées) : rien à mettre en `alt` pour l'instant, prévoir un
texte descriptif réel à l'intégration de chaque image en phase design/contenu.

## Règles de contenu non négociables

- Jamais de prix affiché nulle part.
- Jamais de tiret em (—) dans aucun texte.
- Vente indirecte uniquement : l'objectif de chaque page est de pousser
  vers le formulaire de préqualification / Calendly, jamais de vendre une
  offre en direct sur la page.
