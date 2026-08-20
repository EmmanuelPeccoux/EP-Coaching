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
- [x] 8/15 — Animations par section : titres en mots, cards en cascade, bio/portrait séquencés, CTA final à traitement renforcé, hover bifurcation, header au scroll — **phase animation de base terminée**
- [x] 9/15 — WebGL évalué et non retenu (raisons ci-dessous), scroll accessible vers les ancres, robustesse ScrollTrigger (polices/bfcache), audit "règle de retrait", passe mobile 375px — **phase animation terminée**
- [ ] 10/15 à 15/15 — Contenu final, copywriting, déploiement

## WebGL : évalué, non implémenté (prompt 9/15)

Décision explicite de ne pas ajouter Three.js, avec des chiffres à l'appui
plutôt qu'une impression :

- Poids mesuré via CDN (`curl`) : Three.js 0.152.2 seul = **633 338 octets**,
  soit environ 5x le poids cumulé de GSAP + ScrollTrigger + Lenis
  (72 214 + 43 380 + 12 790 = **128 384 octets**). Un budget disproportionné
  pour un effet que rien dans le brief ne rend indispensable.
- Ce projet a déjà deux précédents WebGL ratés signalés explicitement dans
  le prompt lui-même — un signal fort que le rapport risque/bénéfice est
  mauvais ici, particulièrement sans navigateur réel dans cet environnement
  pour vérifier un rendu shader/particules ou une perf mobile (l'iPhone est
  l'appareil principal visé).
- Le hero atteint déjà un rendu "cinématique" par CSS seul (diamant fantôme
  en filigrane, dégradé radial, entrée orchestrée) : WebGL aurait ajouté du
  risque sans combler un manque réel.
- Le prompt autorisait explicitement à ne pas le faire si la vérification
  n'est pas possible. Script `<script three@0.152.2>` retiré des 3 pages
  (`sed -i '/three@0.152.2/d'`), confirmé par grep : plus aucune trace dans
  le repo, la chaîne GSAP → ScrollTrigger → Lenis reste intacte partout.

## Polish (prompt 9/15)

**Scroll vers les ancres** (`initAnchorScroll`) : les liens `href="#..."`
passent par `lenis.scrollTo()` au lieu du saut natif abrupt, cohérent avec
le smooth scroll du reste du site. Reste un vrai `<a>` avec `href` réel
(navigable au clavier, fonctionne sans JS) — seul le comportement de scroll
est intercepté, jamais l'accessibilité du lien.

**Robustesse ScrollTrigger** (`initScrollTriggerRefresh`) : un
`ScrollTrigger.refresh()` après `document.fonts.ready` (les polices
Google Fonts chargées en `swap` peuvent changer la hauteur du texte après
le calcul initial des triggers) et un autre sur `pageshow` avec
`persisted: true` (retour arrière/avant depuis le cache bfcache, où le JS
ne se réexécute pas mais les positions de scroll doivent rester justes).

**Vrai bug de test trouvé et corrigé avant ce commit**, pas dans le code
mais dans le test lui-même : la première vérification jsdom de ces deux
comportements rapportait un échec (`refreshCalls: 0`), alors que le code
était correct — le test retournait un **instantané** du compteur au moment
du `return`, pas une référence vivante mise à jour par les closures
asynchrones ultérieures. Un test isolé corrigé confirme que les deux
déclencheurs appellent bien `ScrollTrigger.refresh()` comme prévu. Retenu
ici comme leçon de méthode plutôt que caché : ça aurait pu passer pour un
"bug" alors que c'était le harnais de test qui mentait.

**Audit "règle de retrait"** : repassage sur chaque effet du fichier en se
demandant s'il sert vraiment la lecture. Aucun effet individuel retiré —
chacun répond à une demande explicite (prompt 8) ou reste volontairement
discret (parallaxe portrait, compactage du header). Le retrait réel de
cette passe est Three.js dans son ensemble, plus radical qu'un simple
réglage d'intensité.

**Repasse mobile 375px** : toutes les grilles/flex du site passent en
colonne unique par défaut et ne basculent en plusieurs colonnes qu'au-delà
de 768px/900px ; aucune largeur fixe ne dépasse quelques `rem` (icônes,
diamants) ; le seul débordement volontaire (diamant fantôme du hero,
`min(75vw, 760px)` tourné à 45°) est doublement contenu — `overflow:hidden`
sur `.hero-vsl` et sur le `body`. Analyse statique (pas de navigateur réel
disponible ici), cohérente avec la vérification jsdom qui confirme que les
51 à 53 éléments mis à `opacity:0` par page reviennent bien à `opacity:1`.

## Animations par section (depuis le prompt 8/15)

**Titres H2** : découpés en mots via `splitText()` (spans stylisés
préservés), stagger court (35ms), déclenché à 85% du viewport. Un seul
mécanisme pour tous les H2 du site, y compris celui du CTA final (qui
reçoit juste une durée/easing plus marqués pour "plus de présence",
sans jamais dupliquer le système). Le H2 de bifurcation homepage passe
par la séquence d'entrée au chargement plutôt que par le scroll.

**Cards en cascade** : stagger réduit à 80ms (dans la fourchette 60-100ms
demandée), durée de groupe raccourcie à 0.6s pour que la grille de 6
piliers reste sous 1s au total (5 × 0.08 + 0.6 = 1.0s pile). Stagger dans
l'ordre du DOM = ordre de lecture naturel, rien à recalculer.

**Bio/portrait** : timeline unique en 3 temps (portrait, puis texte avec
léger décalage, puis les 3 compétences avec leur propre stagger) plutôt
qu'un seul fade-up comme au prompt 7. Parallaxe très subtile sur le
portrait (30px sur toute la traversée de la section, `scrub`) — sur un
élément intérieur séparé de `.portrait` pour ne jamais entrer en conflit
avec sa propre animation d'entrée.

**CTA final** : séquence dédiée (pas le système générique), durée et
easing plus marqués (power3.out, 1s). Sur `/business/`, le CTA de secours
est ajouté à la timeline **après** le groupe principal, sans overlap :
garantit qu'il ne peut jamais apparaître avant le CTA principal. Pas de
pulsation du glow au repos, jugé "cheap" pour un site qui évite
justement les patterns génériques (le prompt autorisait explicitement ce
choix).

**Bifurcation homepage** : au hover desktop (`hover:hover` et
`pointer:fine` uniquement), le bloc survolé se met en avant et l'autre
s'estompe. Aucun effet dépendant du hover sur tactile.

**Header au scroll** : `position: sticky` ajouté (prérequis manquant pour
que l'effet ait un sens), padding réduit et fond qui se densifie passé
80px de scroll.

**Vélocité de scroll** : pas d'effet de skew ajouté dans cette passe — le
prompt autorise explicitement à ne pas le faire si le résultat n'est pas
vérifiable, et un skew dynamique ne peut pas se juger sans un vrai
navigateur pour voir un scroll rapide en conditions réelles.
`window.lenisVelocity` reste disponible si l'effet est retenté plus tard.

**Vrai bug trouvé et corrigé avant ce commit**, pas en relecture mais en
testant réellement la logique (jsdom, sans navigateur disponible ici) :
le H2 du CTA final était ciblé deux fois — une fois par le système
générique de titres (ses mots), une fois par `initCtaFinalReveal` (le
bloc entier). Deux `ScrollTrigger` distincts sur le même élément. Corrigé
en retirant le H2 de `initCtaFinalReveal` et en lui donnant seulement une
intensité différente dans le système générique. Vérifié après coup avec
une simulation complète de `main.js` (gsap/ScrollTrigger mockés) contre
les 3 pages réelles : 14 ScrollTrigger sur physique/business, 1 sur la
home, et surtout **51 à 53 éléments mis à `opacity:0` ont bien tous une
contrepartie qui les ramène à `opacity:1`** — aucun élément qui resterait
invisible pour de bon.

## Animations, fondations (prompt 7/15)

**Lenis** (`lenis-init.js`) : durée 1.0s (plus réactif que le défaut 1.2s),
`syncTouch: false` pour garder le momentum tactile natif iOS. Désactivé
entièrement (`lenis.stop()`) si `prefers-reduced-motion`. Vélocité toujours
lue dans `gsap.ticker`, jamais dans l'event `scroll` (piège déjà documenté
au prompt 1, toujours respecté).

**Reveal au scroll** (`main.js`) : `[data-reveal]` (élément isolé) et
`[data-reveal-group]` (anime les enfants directs avec stagger) — posé au
prompt 7, affiné au prompt 8 (voir plus haut : les H2 en sont exclus, le
CTA final est passé à son propre système). Fade + translateY(28px),
déclenché à 83% du viewport, `once: true`. La homepage n'en a pas : hero
et bifurcation passent par la séquence d'entrée dédiée à la place.

**Entrée de page** : homepage = timeline orchestrée (logo → H1 → cadre VSL
→ bifurcation, ~1.4s, sous la limite de 1,5s demandée). `/physique/` et
`/business/` = timeline légère sur la bio (voir plus haut), sans
séquence longue.

**Découpe de texte** (`splitText()`, exposée sur `window`) : construite et
testée au prompt 7 (jsdom, pas juste relu), appliquée pour de vrai aux
titres H2 au prompt 8. Contre un titre avec un mot stylisé imbriqué
(`<span class="accent">`) : le span survit intact, seul son contenu est
découpé en unités animables — c'était le piège explicitement signalé.

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
