# EP Coaching — Site vitrine

Site vitrine (vente indirecte, pousse au contact) reconstruit à partir de
zéro le 2026-08-20, en 15 prompts découpés par phase technique.

## Stack

HTML/CSS/JS vanilla, zéro npm. Librairies via CDN : GSAP 3.12.5 +
ScrollTrigger, Lenis 1.1.14, Three.js 0.152.2 (UMD).

## Déploiement

GitHub Pages, auto-deploy sur push vers `main`.

## Structure

```
/
├── index.html          → Homepage courte (VSL + bifurcation)
├── physique/            → Chemin "progresser en musculation"
├── business/            → Chemin "scaler son business de coach"
└── assets/
    ├── css/              → base.css (variables/reset) + 1 fichier par page
    ├── js/               → lenis-init.js (setup smooth scroll) + main.js
    └── images/           → photos réutilisées de l'ancienne version du site
```

## Suivi des prompts

- [x] 1/15 — Structure (squelette HTML, arborescence, variables CSS de base)
- [ ] 2/15 à 15/15 — design, animations, contenu, déploiement final

## Règles de contenu non négociables

- Jamais de prix affiché nulle part.
- Jamais de tiret em (—) dans aucun texte.
- Vente indirecte uniquement : l'objectif de chaque page est de pousser
  vers le formulaire de préqualification / Calendly, jamais de vendre une
  offre en direct sur la page.
