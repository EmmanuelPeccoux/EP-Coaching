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
- [x] 5/15 — Page /physique/ entièrement designée (bio, critères, accompagnement, 6 piliers, accomplissements, CTA final)
- [x] 6/15 — Page /business/ designée (même système, icônes propres au contexte, CTA final à double hiérarchie) + passe de cohérence finale, **phase design terminée**
- [x] 7/15 — Fondations animation : Lenis calibré, système de reveal réutilisable, entrée homepage orchestrée, entrée légère physique/business, utilitaire de découpe de texte (spans imbriqués préservés)
- [ ] 8/15 à 15/15 — animations propres à chaque section, contenu final, déploiement

## Animations (depuis le prompt 7/15)

**Lenis** (`lenis-init.js`) : durée 1.0s (plus réactif que le défaut 1.2s),
`syncTouch: false` pour garder le momentum tactile natif iOS. Désactivé
entièrement (`lenis.stop()`) si `prefers-reduced-motion`. Vélocité toujours
lue dans `gsap.ticker`, jamais dans l'event `scroll` (piège déjà documenté
au prompt 1, toujours respecté).

**Reveal au scroll** (`main.js`) : `[data-reveal]` (élément isolé) et
`[data-reveal-group]` (anime les enfants directs avec stagger) posés sur
`/physique/` et `/business/` — critères, méthode, 6 piliers,
accomplissements, CTA final. Fade + translateY(28px), déclenché à 83% du
viewport, `once: true`. La homepage n'en a pas : hero et bifurcation
passent par la séquence d'entrée dédiée à la place.

**Entrée de page** : homepage = timeline orchestrée (logo → H1 → cadre VSL
→ bifurcation, ~1.3s, sous la limite de 1,5s demandée). `/physique/` et
`/business/` = un seul fade-up sur la section bio, sans séquence à étapes.

**Découpe de texte** (`splitText()`, exposée sur `window`) : préparée pour
le prompt 8, pas encore appliquée. Teste réellement (jsdom, pas juste
lu) contre un titre avec un mot stylisé imbriqué (`<span class="accent">`)
: le span survit intact, seul son contenu est découpé en unités
animables — c'était le piège explicitement signalé dans le prompt.

**Résilience CDN** : si GSAP ou ScrollTrigger ne charge pas (réseau, ad
blocker), traité exactement comme `prefers-reduced-motion` — aucune
section ne dépend de ces libs pour redevenir visible. Repris de l'exigence
déjà documentée sur l'ancienne version de ce site ("tout dégrade
proprement si les CDN ne chargent pas").

## Système de design (depuis le prompt 4/15)

Tokens dans `base.css` : échelle d'espacement (`--space-xs` à `--space-3xl`,
base 8px), échelle typographique en `clamp()` (h1/h2/h3, avec un H1 réduit
dans `.split-content` pour ne pas réutiliser l'échelle hero dans une
colonne deux fois moins large), boutons et cards avec hover. **Motif
signature : le diamant rouge** du logo historique, repris à 3 échelles —
petit (puce/séparateur/logo), et en grand filigrane (`.hero-diamond-ghost`)
derrière le hero homepage. `/physique/` et `/business/` partagent
strictement le même système (`.split`, `.cards`, `.pilier-grid`,
`.diamond-list`, icônes SVG) défini une seule fois dans `base.css` —
`physique.css`/`business.css` ne contiennent plus aucune règle de mise en
page, prêts pour un accent propre à chaque page si besoin un jour.

Icônes SVG en trait rouge (jamais d'emoji) : génériques (cible, message,
cycle) pour les 3 points de méthode communs, et propres au contexte pour
les 6 piliers — haltère/formation/graphique côté physique, boîte à
outils/verrou/dashboard côté business. Toutes vérifiées visuellement avant
commit (rendu PIL en local, faute de vrai navigateur dans cet
environnement) — 2 icônes retravaillées au prompt 5 (formes plus sûres
que des arcs SVG non testés), aucun souci sur les 5 icônes du prompt 6.

Quality floor posé au prompt 6/15 : `:focus-visible` explicite (anneau
rouge) sur tout le site, `prefers-reduced-motion` respecté (transitions
neutralisées en CSS, Lenis désactivé et scroll natif repris en JS).

Bug de cohérence attrapé et corrigé au prompt 6/15 : `business.css`
n'avait jamais été nettoyé comme `physique.css` au prompt 5, un ancien
`.criteres .cards` en grille rentrait en conflit de spécificité avec la
version flex-column de `base.css` — `/business/` affichait ses 3 cards de
critères en grille au lieu d'empilées. Les deux fichiers de page sont
maintenant symétriques et vides de règles de mise en page.

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
