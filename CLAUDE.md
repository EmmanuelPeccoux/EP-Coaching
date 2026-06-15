# EP Coaching — Site Web Statique

One-page de conversion (vente indirecte → contact/RDV) pour le coaching musculation
d'Emmanuel Peccoux. Hébergé sur GitHub Pages : https://emmanuelpeccoux.github.io/EP-Coaching/

## Stack
- HTML5 / CSS3 / JavaScript vanilla, tout dans un seul fichier `index.html`
- GitHub Pages (déploiement automatique sur push `main`)
- Aucune dépendance npm — librairies via CDN (GSAP, ScrollTrigger, Lenis)

## Structure des fichiers
- `index.html` — Page unique : tout le CSS (`<style>`) et le JS (`<script>`) sont inline.
- `images/images/` — Photos
- `privacy-policy.html` / `terms-of-service.html` — Pages légales
- `coaching.html` / `parcours.html` / `contact.html` — Stubs de redirection (anciennes URLs en bio Instagram) vers `/EP-Coaching/`

## Design System
- **Background:** `radial-gradient(ellipse at 50% 0%, #3a0000 0%, #0D0000 60%)`, noir profond `#0D0000`
- **Rouges:** `#E01E1E` (principal), `#B00202` (moyen), `#890404` (foncé), `#270101` (quasi-noir)
- **Texte:** `#F5EDED` (blanc cassé), accent rare `#FDC4C4` (rose)
- **Interdit:** couleurs froides, fond clair, `#080808`, `#DC0A14`
- **Titres:** Montserrat 900, letter-spacing négatif (-0.03em mini, -0.05em sur le hero)
- **Corps:** Montserrat 400/500
- **Logo "EP":** Playfair Display Italic Bold + text-shadow rouge empilé 3D + diamant rouge
- Grain de film (filtre SVG `feTurbulence`) sur `body::after`, opacité 4%

## Architecture — 6 sections (one-page, scroll classique)
1. `#hero` — Logo + titre + VSL YouTube (`qULWJ6fsE8k`) + flèche scroll
2. `#probleme` — Manifeste révélé ligne par ligne au scroll (stagger GSAP)
3. `#difference` — 3 cards avec tilt 3D au hover (vanilla JS, désactivé sur tactile)
4. `#preuve` — Portrait (N&B → couleur au hover) + compteurs animés
5. `#cta` — CTA final (WhatsApp + Calendly), fond radial rouge, scale-in au scroll
6. `#faq` — Accordion (5 objections)

## Animations
- Smooth scroll Lenis (`lerp: 0.08`) branché sur le ticker GSAP
- Reveals `.rv` : `opacity 0→1` + `translateY(30px→0)`, ScrollTrigger `start: "top 85%"`
- `.scale-in` (section CTA) : `scale 0.9→1` + fade
- Tilt 3D sur les cards (section 3) — desktop uniquement (`hover:hover` + `pointer:fine`)
- Tout dégrade proprement si `prefers-reduced-motion` ou si les CDN ne chargent pas (contenu reste visible, opacité par défaut à 1)

## Éléments décoratifs (couche "premium")
- **Barre de progression de scroll** (`#scroll-progress`) — fine ligne rouge fixe en haut, largeur = avancement de la page
- **Navigation latérale par points** (`.section-nav`) — 6 points fixes à droite, desktop only (`min-width:1024px`), point actif via IntersectionObserver
- **Halos lumineux** (`.glow-orb`) — cercles flous rouges, légère animation flottante, positionnés en arrière-plan dans hero / difference / faq
- **Chiffres fantômes** (`.section-num`) — grands numéros de section (02/03/04/06) en contour, décoratifs, derrière le contenu
- **Bandeau marquee** — défilement horizontal infini (NATUREL · RIGUEUR · SUIVI RÉEL · DISCIPLINE · RÉSULTATS) entre les sections 3 et 4
- **Cadre photo "viewfinder"** (section preuve) — coins rouges + badge "Compétiteur WNBF — Classic Physique" en overlay sur la photo
- Bouton WhatsApp flottant : anneau de pulsation animé ; bouton CTA primaire : effet de reflet (shine) au survol
- `::selection` et `:focus-visible` stylés en rouge pour l'accessibilité

## Déploiement
Push sur la branche `main` → GitHub Pages se met à jour automatiquement (délai 1-2 min).

## Règles de contenu
Vente INDIRECTE : objectif unique = pousser au contact WhatsApp/Calendly. Pas de prix, pas de détail
d'offre, pas de "méthode"/"natty"/"jeune coach".

## Liens importants
- WhatsApp : https://wa.me/33766834777
- Calendly (RDV) : https://calendly.com/peccoux-manu/30min
- Instagram : @emmanuelpeccoux
- GitHub repo : https://github.com/emmanuelpeccoux/EP-Coaching
