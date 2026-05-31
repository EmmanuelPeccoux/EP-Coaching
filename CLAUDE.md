# EP Coaching — Site Web Statique

Site de conversion pour le coaching musculation d'Emmanuel Peccoux.
Hébergé sur GitHub Pages : https://emmanuelpeccoux.github.io/EP-Coaching/

## Stack
- HTML5 / CSS3 / JavaScript vanilla (aucun framework)
- GitHub Pages (déploiement automatique sur push main)
- Aucune dépendance npm

## Structure des fichiers
- `index.html` — Page d'accueil (hero + about + physique + coaching teaser + CTA)
- `coaching.html` — Offre complète, tarif, process 4 étapes, FAQ
- `parcours.html` — Timeline 2023-2027, vision compétition
- `contact.html` — Contact WhatsApp + formulaire
- `style.css` — Styles globaux (toutes les pages)
- `motion.js` — Toutes les animations et interactions JS
- `images/images/` — Photos (gym_locker, gym_pose, hero_current, dark_front, green_front, green_side, training_bench, training_pulldown, training_chest, nutrimuscle)
- `privacy-policy.html` / `terms-of-service.html` — Pages légales

## Design System
- **Background:** #050505 (noir ultra deep)
- **Rouge primaire:** #E60000 / variants: #ff1a1a, #b30000
- **Blanc:** #f5f5f5
- **Gris scale:** --g0 à --g5 (#111 → #303030)
- **Font headings:** Bebas Neue (Google Fonts)
- **Font body:** Inter + Montserrat (Google Fonts)
- **Nav height:** 76px

## Animations disponibles (motion.js)
- Preloader avec lettres animées
- Custom cursor (dot + ring) avec états magnétiques
- Scroll progress bar
- Split text (char + word)
- Intersection Observer reveals (.rv, .rv2, .rv3, .rv4, .rv-left, .rv-right, .rv-scale, .img-mask)
- Parallax (data-parallax attribute)
- Counter animation (data-count, data-suffix)
- Scramble text sur hover
- Magnetic buttons (.magnetic)
- FAQ accordion
- Hover image follow (data-img-hover)
- Mobile menu burger

## Conventions CSS importantes
- Les sections utilisent `.section` (160×80px padding) ou `.section-sm` (90×80px)
- Tags de section : ligne rouge + texte uppercase 9px
- Titres Bebas Neue : `clamp(48px, ..., 96px)`
- Variants titre : normal / outlined (text-stroke) / rouge
- Boutons : `.btn` (rouge plein) / `.btn-outline` (transparent + bordure)
- Marquee : `.marquee` 28s / `.marquee-big` 40s
- Images mask reveal : `.img-mask`

## Déploiement
Push sur la branche `main` → GitHub Pages se met à jour automatiquement (délai 1-2 min).

## Objectif du site
Tunnel de conversion : Instagram → site → Typeform → Calendly → Stripe
Le site doit inspirer confiance, crédibilité, et donner envie d'agir.

## Liens importants
- WhatsApp : https://wa.me/33766834777
- Instagram : @emmanuelpeccoux
- GitHub repo : https://github.com/emmanuelpeccoux/EP-Coaching
