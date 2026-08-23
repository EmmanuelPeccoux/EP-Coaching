# EP Coaching, Site vitrine

Site vitrine (vente indirecte, pousse au contact) reconstruit à partir de
zéro le 2026-08-20, en 15 prompts découpés par phase technique. **Le
site est en production.**

- **Site en ligne** : https://emmanuelpeccoux.github.io/EP-Coaching/
- **Repo** : github.com/EmmanuelPeccoux/EP-Coaching, déploiement
  automatique sur push vers `main` (GitHub Pages)
- **Formulaires** (repo séparé) : https://ep-coaching-formulaires.vercel.app,
  github.com/EmmanuelPeccoux/ep-coaching-formulaires

---

# Guide de passation

Cette section suffit à reprendre le projet sans avoir suivi les 15
prompts qui l'ont construit. Le détail complet de chaque décision, bug
trouvé et choix technique vit plus bas dans ce fichier (section "Journal
de bord", classée par prompt, du plus récent au plus ancien) : à
consulter seulement si cette section ne répond pas à la question.

## Ce qu'il manque encore pour que le site soit complet

Trois éléments, et trois seulement, ne dépendent pas de moi (jamais
fournis, jamais fabriqués, conformément à la règle ferme du projet) :

1. **La vidéo VSL.** Voir juste en dessous, "Mettre en ligne la vidéo
   VSL", c'est le point le plus important de cette section.
2. **Le logo.** Voir "Déposer le logo".
3. **La photo portrait.** Voir "Déposer la photo portrait".

Tout le reste (texte, design, animations, formulaires, Calendly,
déploiement) est fini et vérifié en production.

## Mettre en ligne la vidéo VSL (le plus important)

Une seule valeur à changer, dans **[index.html](index.html)**, cherche
`VIDEO_ID_A_REMPLACER` :

```html
<div class="vsl-placeholder" id="vsl-placeholder" data-youtube-id="VIDEO_ID_A_REMPLACER" ...>
```

Remplace `VIDEO_ID_A_REMPLACER` par l'identifiant de la vidéo YouTube
(la partie après `v=` dans son URL, ou après `youtu.be/`). Rien d'autre
à toucher : dès que cette valeur n'est plus la sentinelle, la vraie
miniature YouTube apparaît automatiquement à la place du dégradé, le
cadre devient cliquable et activable au clavier, et le clic charge la
vidéo (jamais avant, pour ne pas ralentir le chargement de la page).
Voir `initVslFacade()` dans `assets/js/main.js` si besoin de comprendre
le mécanisme en détail.

## Déposer le logo

Fichier attendu : **`assets/images/logo.png`** (PNG, fond transparent,
au moins 640×200px source pour rester net en retina). Une fois déposé,
dans les 3 fichiers `index.html` / `physique/index.html` /
`business/index.html`, remplace :

```html
<a href="..." class="logo">EP COACHING</a>
```

par :

```html
<a href="..." class="logo"><img src="assets/images/logo.png" alt="EP Coaching" height="40" /></a>
```

(adapter le chemin `assets/images/logo.png` selon la profondeur du
fichier : `assets/images/...` à la racine, `../assets/images/...` dans
`physique/` et `business/`). Fais la même chose dans le footer
(`.footer-brand`) et régénère un favicon à partir du logo pour remplacer
le placeholder carré rouge actuel (`favicon.svg`, `favicon.ico`,
`apple-touch-icon.png`).

## Déposer la photo portrait

Fichier attendu : **`assets/images/portrait.jpg`** (+ `.webp` en
complément si fourni dans les deux formats), ratio 4:5, au moins
1000×1250px source. Bandes noires à rogner, tout logo/watermark tiers à
retirer avant intégration. Une fois déposé, dans `physique/index.html`
ET `business/index.html` (bloc bio identique sur les deux), remplace :

```html
<div class="portrait-placeholder">
  <span class="diamond diamond--outline diamond--lg" aria-hidden="true"></span>
</div>
```

par :

```html
<img src="../assets/images/portrait.jpg" alt="Santamaria Sànchez" width="1000" height="1250" loading="lazy" />
```

Le traitement visuel (noir & blanc qui repasse en couleur au survol,
vignettage rouge) est déjà en place dans `base.css` (`.portrait img`),
rien à ajouter côté style.

## Comment modifier le contenu texte des pages

Aucun système de gabarit : le texte vit directement dans le HTML de
chaque page (`index.html`, `physique/index.html`, `business/index.html`),
en clair, pas de CMS ni de fichier de contenu séparé. Pour changer un
texte, cherche-le directement dans le fichier de la page concernée et
remplace-le. Le bloc bio (nom, biographie, 3 compétences) est dupliqué à
l'identique dans `physique/index.html` et `business/index.html` : un
changement doit être répercuté dans les deux fichiers.

Avant de modifier un texte, vérifie qu'il respecte les règles fermes
ci-dessous.

## Formulaires et Calendly

- Formulaire physique : https://ep-coaching-formulaires.vercel.app/prequalification
- Formulaire business : https://ep-coaching-formulaires.vercel.app/business
- Lien de réservation Calendly (les deux formulaires y renvoient après
  soumission) : https://calendly.com/peccoux-manu/30min
- Ces deux formulaires vivent dans un **repo séparé**,
  github.com/EmmanuelPeccoux/ep-coaching-formulaires, avec son propre
  README (mécanisme de stockage des réponses, détail du câblage
  Calendly, variables d'environnement Vercel).

## Règles fermes du projet (jamais d'exception)

- **Jamais de tiret cadratin** (le signe de ponctuation long, plus long
  qu'un tiret normal) nulle part, ni dans le texte visible, ni dans les
  commentaires de code, ni
  dans la documentation. Utilise une virgule, un point, ou reformule.
- **Jamais de prix affiché**, sous aucune forme, nulle part (page, code,
  commentaire). Le site pousse vers un appel, jamais vers un achat direct.
- **Jamais le prénom "Emmanuel"** dans un texte visible par un visiteur.
  Le nom à afficher est **Santamaria Sànchez** (accent grave sur le à,
  jamais "Sánchez" avec un accent aigu). "Emmanuel Peccoux" reste correct
  uniquement pour ce qui est légal/administratif (les pages CGU/CGV/
  confidentialité pointent vers l'app, pas ce repo) et les identifiants
  techniques (URL de repo GitHub, auteur des commits).
- **Handle Instagram** : `@santamariasanchez_` uniquement, jamais
  `@emmanuelpeccoux`.
- **Aucun témoignage, résultat client, chiffre d'audience ou preuve
  sociale inventée.** Si un chiffre n'est pas explicitement fourni, il
  n'existe pas sur le site.
- **Palette stricte, 7 couleurs, jamais d'autre** : `#E01E1E` (rouge
  principal), `#890404` (rouge foncé), `#B00202` (rouge moyen),
  `#270101` (rouge très foncé), `#0D0000` (noir profond), `#F5EDED`
  (blanc cassé), `#FDC4C4` (rose clair, usage rare, utilisé pour
  certains textes rouges sur fond sombre où le rouge principal manque
  de contraste, voir `base.css`). Jamais `#080808` ni `#DC0A14`
  (interdits explicitement). Jamais de ton froid (bleu, vert, violet).
- **Typographie** : Montserrat pour tout (titres en 900, corps en 400),
  jamais Bebas Neue. Playfair Display Italic réservé au logo texte
  uniquement (`.logo` dans `base.css`).
- Vente indirecte uniquement : chaque page pousse vers le formulaire de
  préqualification puis Calendly, jamais de vente directe sur la page.

## Structure du projet

HTML/CSS/JS vanilla, zéro npm, zéro build, zéro framework. Librairies
via CDN uniquement : GSAP 3.12.5 + ScrollTrigger, Lenis 1.1.14 (smooth
scroll). Le repo `ep-coaching-formulaires` (formulaires + Calendly) est
un projet Next.js séparé, avec sa propre stack, voir son README.

```
/
├── index.html            → Homepage courte (VSL + bifurcation vers les 2 parcours)
├── physique/index.html   → Parcours "progresser en musculation"
├── business/index.html   → Parcours "scaler son business de coach"
├── 404.html              → Page d'erreur (lien retour en URL absolue, voir commentaire dans le fichier)
├── robots.txt / sitemap.xml
├── favicon.svg / favicon.ico / apple-touch-icon.png → placeholder carré rouge + "EP", à remplacer avec le vrai logo
└── assets/
    ├── css/
    │   ├── base.css        → tokens (couleurs/espacements/typo), reset, tous les composants partagés (boutons, cards, motif diamant)
    │   ├── home.css         → hero, bifurcation, façade VSL (spécifique homepage)
    │   ├── physique.css     → vide (prêt pour un accent visuel propre à cette page si besoin un jour)
    │   └── business.css     → CTA de secours uniquement (le reste vient de base.css)
    ├── js/
    │   ├── lenis-init.js    → initialise le smooth scroll, expose window.lenis / window.prefersReducedMotion
    │   └── main.js          → tout le reste : animations, façade VSL, scroll d'ancre, découpe de texte
    └── images/
        ├── og-image.png     → image de partage (Open Graph), générée avec l'identité visuelle du site
        └── (25 fichiers .jpg) → photothèque de l'ancienne version du site, aucun <img>
                                  ne les utilise actuellement, réservée à un usage futur
```

## Déploiement

GitHub Pages, déploiement automatique sur push vers `main` (aucune
action manuelle à faire). Servi sous
`https://emmanuelpeccoux.github.io/EP-Coaching/`, HTTPS actif (géré par
GitHub Pages, rien à configurer). Aucun domaine personnalisé configuré
(aucun fichier `CNAME` dans le repo) : si un domaine est acheté un jour,
y déposer un fichier `CNAME` contenant le nom de domaine et mettre à
jour les URLs absolues du repo (`og:url`, `sitemap.xml`, favicon, liens
dans les commentaires qui le mentionnent).

Pas d'accès aux settings GitHub Pages du repo depuis cet environnement
(`gh` CLI absent au moment de la construction, pas de connecteur
GitHub) : si un jour le déploiement semble ne plus se faire, le premier
réflexe est de vérifier Settings → Pages → Source sur GitHub
directement.

---

# Journal de bord

Ce qui suit documente, prompt par prompt, chaque décision, chaque bug
trouvé et corrigé, chaque vérification effectuée pendant la
construction du site. Utile pour comprendre *pourquoi* une chose est
faite d'une certaine façon, pas nécessaire pour la maintenance courante
(voir le "Guide de passation" plus haut pour ça).

## Suivi des prompts

- [x] 1/15, Structure (squelette HTML, arborescence, variables CSS de base)
- [x] 2/15, Navigation, footer, SEO, câblage des CTA
- [x] 3/15, Clôture structure : 404, robots.txt/sitemap.xml, favicon, preconnect/defer, accessibilité de base
- [x] 4/15, Système de design (tokens, typo, boutons, cards, motif diamant) + application complète au hero + bifurcation
- [x] 5/15, Page /physique/ entièrement designée (bio, critères, accompagnement, 6 piliers, accomplissements, CTA final)
- [x] 6/15, Page /business/ designée (même système, icônes propres au contexte, CTA final à double hiérarchie) + passe de cohérence finale, **phase design terminée**
- [x] 7/15, Fondations animation : Lenis calibré, système de reveal réutilisable, entrée homepage orchestrée, entrée légère physique/business, utilitaire de découpe de texte (spans imbriqués préservés)
- [x] 8/15, Animations par section : titres en mots, cards en cascade, bio/portrait séquencés, CTA final à traitement renforcé, hover bifurcation, header au scroll, **phase animation de base terminée**
- [x] 9/15, WebGL évalué et non retenu (raisons ci-dessous), scroll accessible vers les ancres, robustesse ScrollTrigger (polices/bfcache), audit "règle de retrait", passe mobile 375px, **phase animation terminée**
- [x] 10/15, Contenu final homepage + /physique/ (copy validé intégré, mots-clés accentués dans les H1/H2, meta tags dérivés du copy)
- [x] 11/15, Contenu final /business/ (copy validé intégré, bio confirmée identique au caractère près, CTA de secours phrase+lien), **les 3 pages ont maintenant leur copy final**
- [x] 12/15, Assets réels : façade VSL (YouTube lazy-load), audit icônes, correction et optimisation de la photothèque, logo/portrait toujours en attente (voir ci-dessous), **phase contenu (10 à 12) terminée**
- [x] 13/15, Formulaires de préqualification (repo séparé `ep-coaching-formulaires`, reconstruit de zéro), voir son propre README pour le détail
- [x] 14/15, Câblage du funnel : CTA business branché sur le vrai formulaire, liens vérifiés sur les 3 pages, Calendly câblé côté formulaires, déploiement Vercel des formulaires résolu et vérifié en ligne (voir `ep-coaching-formulaires`), **funnel complet du clic homepage jusqu'à la réservation, bout en bout, vérifié en production**
- [x] 15/15, QA complète et mise en production : audit de conformité (violations réelles trouvées et corrigées), 3 écarts de contraste WCAG mesurés et corrigés, bug de compatibilité Safari corrigé, image de partage créée, README réécrit pour la passation, **le site est en production**

## QA complète et mise en production (prompt 15/15)

Dernier prompt : aucun développement, uniquement vérification,
correction et déploiement. Six vraies violations/défauts trouvés et
corrigés, pas de simple relecture qui ne trouve rien.

**Tiret cadratin, audit complet, décision changée par rapport aux
prompts précédents.** Les prompts précédents toléraient le caractère
dans les commentaires de code (jamais lu par un visiteur). Ce prompt
demandait explicitement de chercher "dans tous les fichiers, y compris
les commentaires" : décision prise de le retirer partout, y compris des
commentaires et de ce README, plutôt que de continuer à s'appuyer sur
une distinction "visible/pas visible" que ce site statique (sans build,
sans minification) ne garantit pas vraiment, le code source est
servi tel quel à qui regarde la source de la page. 131 occurrences trouvées
et remplacées (par une virgule, dans la quasi-totalité des cas) sur les
deux repos (ep-site et ep-coaching-formulaires). Un aller-retour raté au
passage : une première tentative de remplacement automatique a laissé
des résidus en fin de ligne et corrompu 2 lignes qui citaient le
caractère lui-même entre parenthèses pour documenter la règle,
repéré et corrigé avant de committer.

**3 écarts de contraste WCAG AA trouvés par calcul, pas par
supposition.** Script Python reproduisant la formule de luminance
relative WCAG, appliqué à chaque paire texte/fond du site :
- `.eyebrow` (rouge principal sur noir profond, petit texte gras) :
  4.3:1, sous le seuil de 4.5:1.
- `.bloc-cta` de la bifurcation homepage (rouge principal sur
  rouge-très-foncé) : 4.01:1, sous le seuil.
- `.btn-subtext` sous les boutons CTA (blanc cassé à 45% d'opacité) :
  4.0:1, sous le seuil.
- Bonus trouvé au passage : le survol des liens du footer avait le même
  problème (4.3:1).

Corrigé sans sortir de la palette des 7 couleurs officielles : les 3
premiers passent à `--rose-clair` (déjà dans la palette, prévue pour un
"usage rare", jamais vraiment utilisée jusque là, 12.7 à 13.6:1 selon le
fond), le dernier passe de 45% à 55% d'opacité de blanc cassé (5.55:1).
Une dizaine d'autres combinaisons texte/fond du site vérifiées dans la
foulée, toutes déjà largement conformes (5.5:1 à 17.9:1).

**Bug de compatibilité Safari trouvé et corrigé** : `backdrop-filter`
(flou du header compacté au scroll) n'avait pas son équivalent
`-webkit-backdrop-filter`, nécessaire sur Safari/iOS pour que le flou
s'applique réellement (sans le préfixe, le fond semi-transparent
s'affiche mais sans flou, dégradation silencieuse, pas d'erreur visible).
Corrigé. Note pour la suite : `color-mix()` est utilisé de façon
extensive dans tout `base.css`/`home.css`/`business.css` et nécessite
Safari 16.2+ (décembre 2022), un très large majorité du trafic iPhone en
2026 devrait être largement au-delà, mais c'est une dépendance non
retravaillée dans cette passe (l'aurait été si un vrai souci de rendu
avait été signalé, mais aucun moyen de le vérifier en pratique sans
navigateur réel disponible ici).

**`og:image` manquant sur les 3 pages, trouvé en vérifiant "le rendu du
partage de lien" comme demandé.** Sans lui, un lien partagé depuis
Instagram (canal principal du site) n'affiche aucune vignette. Créée une
image de partage (1200×630px, format standard Open Graph) avec
l'identité visuelle réelle du site : dégradé rouge-très-foncé vers noir
profond (même esprit que le hero), diamant signature en filigrane, "EP
COACHING" en vraie police Montserrat 900 (récupérée depuis le dépôt
officiel Google Fonts pour un rendu fidèle), tagline en rose clair.
Générée avec Pillow, aucune photo ni visage, juste l'identité de marque
déjà établie. Sauvegardée dans `assets/images/og-image.png` (33 Ko),
référencée via `og:image`/`og:image:width`/`og:image:height`/
`twitter:card` sur les 3 pages.

**Vérifications qui n'ont rien trouvé à corriger** (donc pas de section
dédiée, listées ici pour que la vérification elle-même soit tracée) :
aucun prix, aucun "Emmanuel" visible, aucun mauvais handle Instagram,
aucune couleur hors palette, aucune trace de Bebas Neue, aucun
témoignage/preuve sociale inventée, hiérarchie de titres correcte (un
seul H1 par page partout), `:focus-visible` présent globalement, aucun
`outline:none` sans remplacement, tous les liens sortants et internes
des 3 pages vérifiés un par un par requête HTTP réelle (aucun 404,
aucun placeholder restant), `sitemap.xml`/`robots.txt`/favicons vérifiés
en ligne, `prefers-reduced-motion` revérifié avec jsdom sur les 3 pages
(zéro élément bloqué à `opacity:0`, la vérification la plus importante
de cette section d'après le prompt), aucune largeur fixe en px
problématique pour le responsive.

**Parcours de bout en bout : ce qui a été vérifié pour de vrai, et ce
qui relève du raisonnement plutôt que de l'observation directe**, faute
de navigateur réel dans cet environnement (limite déjà documentée
partout dans ce fichier). Vérifié réellement par requêtes HTTP : tous
les liens, le déploiement, le contenu servi. Raisonné à partir de
l'architecture du code (pas observé dans un vrai navigateur) : un
rechargement en cours de parcours ne casse rien (pages statiques sans
état partagé entre elles, aucun `localStorage`/`sessionStorage` nulle
part dans le repo, vérifié par grep), un retour arrière navigateur ne
casse rien (mêmes raisons), l'ouverture directe d'une page profonde sans
passer par la homepage fonctionne à l'identique (aucune dépendance
inter-pages), le redimensionnement pendant le scroll est géré nativement
par ScrollTrigger (documenté dans son propre changelog, déjà noté dans
ce README au prompt 9/15). Le formulaire (repo séparé) a été testé
jusqu'à l'insertion réelle en base de données (voir son README), mais
**pas jusqu'à une vraie réservation Calendly** : ça créerait un rendez-vous
réel dans l'agenda de Santamaria, à nettoyer manuellement et risquant de
semer la confusion, jugé disproportionné pour un test.

## Câblage du funnel (prompt 14/15)

Le CTA principal de `/business/` (`#TODO-prequalification-business`
depuis le prompt 2) pointe maintenant vers
`https://ep-coaching-formulaires.vercel.app/business`, le formulaire créé
au prompt 13/15. Le CTA de `/physique/` était déjà correct (route
`/prequalification` inchangée par le prompt 13/15), simplement revérifié.

**Audit complet des liens sortants des 3 pages** (section 2.3 du
prompt) : tous corrects, aucun lien mort, aucun placeholder restant
(vérifié par grep). Règle "conversion reste dans l'onglet, consultation
s'ouvre dans un nouvel onglet" déjà respectée avant ce prompt et
reconfirmée : formulaires et fallback business (inscription app) sans
`target`, légal et Instagram avec `target="_blank"`.

**Ce qui reste en dehors de ce repo** : le câblage réel vers Calendly
(redirection après soumission, pré-remplissage, distinction
physique/business) vit dans `ep-coaching-formulaires`, pas ici, voir son
README pour le détail complet (option retenue, bug Calendly trouvé et
corrigé, etc.).

**Mis à jour en fin de prompt 14/15** : le déploiement Vercel de
`ep-coaching-formulaires`, initialement bloqué (connecteur MCP non
fonctionnel), a été résolu dans la même session via la CLI Vercel en
local. Les deux URLs câblées ici (`/prequalification` et `/business`)
sont vérifiées en production, réponse 200 avec le nouveau contenu, le
funnel complet (homepage → choix du chemin → CTA → formulaire →
Calendly) est fonctionnel de bout en bout.

## Assets réels (prompt 12/15)

**Logo** : recherché dans le repo entier ET son historique git sur
**toutes les branches** (`git log --all --diff-filter=A --name-only`), introuvable, jamais commité nulle part sous ce projet. Règle du prompt
respectée à la lettre : pas fabriqué en CSS/SVG. Le placeholder texte
reste en place dans le header des 3 pages, avec un commentaire détaillé
dans `index.html` (recopié en résumé dans `physique/`/`business/`)
indiquant le chemin exact attendu : **`assets/images/logo.png`**, PNG à
fond transparent, au moins 640×200px source pour rester net en retina
affiché à ~40px de haut. Une fois déposé, il suffit de suivre le
commentaire pour remplacer `<a class="logo">` par un vrai `<img>` (header
des 3 pages + footer + favicon, voir prompt 3).

**VSL** : façade complète implémentée (`initVslFacade()` dans `main.js`).
Rien n'est chargé au chargement de la page : l'attribut
`data-youtube-id="VIDEO_ID_A_REMPLACER"` sur `#vsl-placeholder`
(`index.html`) est **l'unique valeur à changer** quand la vidéo unlisted
sera prête. Tant qu'elle vaut ce placeholder, le bloc reste exactement
dans son état non interactif d'avant ce prompt (pas de `role="button"`,
pas de faux affordance). Dès qu'un vrai ID y est mis : la vraie miniature
YouTube (`img.youtube.com/vi/{id}/maxresdefault.jpg`) remplace le dégradé
sombre avec un voile pour garantir le contraste du bouton play, le bloc
devient activable à la souris ET au clavier (Entrée/Espace), et le clic
injecte une iframe `youtube-nocookie.com` (`rel=0`, `modestbranding=1`,
`autoplay=1` déclenché par le clic lui-même, jamais au chargement de la
page). Testé avec jsdom dans les 3 états (sentinelle non remplacée, ID
réel avec clic souris, ID réel avec activation clavier) : les trois se
comportent exactement comme prévu.

**Photo portrait** : les 25 photos de `assets/images/` passées en revue
une par une (pas juste le nom de fichier), aucune n'est un portrait
posé/professionnel (selfies miroir, photos de progression, tenues de
sport), pas le traitement adapté à l'image publique en tête de page.
Sujet mineur : le choix de LA photo à publier revient délibérément à
Santamaria/son entourage, pas à une sélection unilatérale de ma part
parmi des photos personnelles existantes. Placeholder conservé. Fichier
attendu : **`assets/images/portrait.jpg`** (+ `.webp` en complément si
fourni), ratio 4:5, au moins 1000×1250px source. Bandes noires à rogner
et tout logo/watermark tiers à retirer avant intégration, comme demandé.

**Icônes** : audit de cohérence fait sur les 18 SVG des 2 pages (9 par
page), un seul jeu d'attributs partout
(`fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"`),
aucun emoji, aucune flèche bricolée à la main, vérifié par grep sur les
plages Unicode emoji (rien trouvé dans le HTML visible). Rien à changer,
déjà conforme depuis les prompts 5/6.

**Un vrai bug trouvé en préparant la compression** : 22 des 25 fichiers
de `assets/images/` sont en réalité des JPEG (marqueurs `jfif` +
profil ICC "Google Inc. 2016" détectés par Pillow), simplement mal
étiquetés avec une extension `.png`. Une première tentative de
compression PNG "sans perte" les a fait **grossir de 5 à 8×** (2,03 Mo →
10,81 Mo) : PNG ne peut que réencoder en perte de temps ce qui est déjà
du JPEG décodé, jamais le compresser correctement. Repéré immédiatement
au résultat anormal, annulé avec `git checkout` avant tout commit, puis
corrigé à la racine : les 22 fichiers JPEG mal étiquetés sont renommés en
`.jpg` (copie identique à l'octet près, aucune perte, `git` confirme le
renommage). Les 3 vrais PNG restants (`debut_2022a`, `debut_2022b`,
`proof_photo`, contenu photographique) sont convertis en JPEG qualité 88.
**Poids total de `assets/images/` : 2,03 Mo → 1,49 Mo (28 % de gain)**,
mais aucun de ces fichiers n'est référencé dans le HTML à ce jour
(confirmé par grep) : ils ne font donc pas partie du poids de page
ci-dessous, `loading="lazy"` et les attributs `width`/`height` n'ont
nulle part où s'appliquer tant qu'aucun `<img>` ne les utilise.

## Poids des pages (mesuré au prompt 12/15)

Fichiers propres au site (HTML + CSS + JS, avant compression gzip/brotli
du serveur) :

| Page | HTML | CSS | JS | Total 1ʳᵉ partie |
|---|---|---|---|---|
| `/` (home) | 8,9 Ko | 27,6 Ko (base+home) | 29,9 Ko | **~66 Ko** |
| `/physique/` | 18,5 Ko | 19,4 Ko (base+physique) | 29,9 Ko | **~68 Ko** |
| `/business/` | 19,3 Ko | 20,4 Ko (base+business) | 29,9 Ko | **~69 Ko** |

Plus, partagé et mis en cache par le navigateur dès la 1ʳᵉ page visitée
(pas re-téléchargé en changeant de page) :
- GSAP + ScrollTrigger + Lenis (CDN) : ~128 Ko (mesuré au prompt 9/15)
- Google Fonts (Montserrat + Playfair Display) : variable selon le
  sous-ensemble Unicode servi par le navigateur (un seul fichier par
  graisse pour du contenu en français, pas les 9 variantes que renvoie
  un `curl` qui les demande toutes), de l'ordre de 15 à 40 Ko en usage
  réel, pas mesurable précisément sans un vrai navigateur ici.

Aucune image de `assets/images/` n'est chargée par une page actuellement
(aucun `<img>` dans le HTML), donc rien à ajouter aux totaux ci-dessus.

## Contenu /business/ (prompt 11/15)

Même méthode qu'au prompt 10 : copy reproduit tel quel, sans reformulation.

**Bio** : identique au caractère près à `/physique/`, vérifié avec un
`diff` sur le bloc `<section class="bio">` des deux fichiers (demande
explicite du prompt), aucune différence. Toujours dupliquée en HTML (site
statique, pas de templates), mais aucune règle de style spécifique n'a été
ajoutée : tout vient de `base.css`, `business.css` ne définit rien pour
cette section, exactement comme prévu depuis le prompt 5/15.

**Coquille corrigée** : "jonglar" du document source remplacé par
"jongler" (pilier 6), comme demandé explicitement par le prompt.

**CTA de secours** : le copy distingue une phrase ("Tu préfères tester
par toi-même ?...") d'un lien ("Créer mon compte"), alors que le
placeholder n'avait qu'une seule phrase entièrement cliquable. Restructuré
en `.fallback-intro` (texte simple) + `.btn-cta-fallback` (le vrai lien,
seul élément cliquable désormais) : plus honnête pour un lecteur d'écran
et au survol souris que de rendre toute une question cliquable.
`initCtaFinalReveal()` dans `main.js` anime maintenant les deux comme un
seul petit groupe, avec la même garantie qu'avant (aucun overlap négatif :
ne démarre qu'une fois le CTA principal entièrement arrivé), revérifié en
inspectant l'ordre réel des appels à la timeline mockée (jsdom), pas
seulement en relisant le code.

**Aucune mention de prix ni de durée d'essai** : ni sur cette page ni
ailleurs, conformément à la règle explicite de ce prompt (l'offre coach a
un tarif et une période d'essai qui ne doivent apparaître nulle part sur
le site).

**Vérification des longueurs** : les paragraphes de piliers vont de 109 à
140 caractères ; la ligne 1 de la grille (piliers 1-3) a un écart plus
marqué (109-140, contre un écart de 3 caractères seulement sur
`/physique/`) mais `align-items: stretch` (comportement Grid par défaut,
déjà en place) aligne les cards d'une même ligne en hauteur quel que soit
l'écart, aucun changement nécessaire. Le titre du pilier 1 ("Tous les
outils clients, à ta main", 34 caractères) est à la même longueur que les
titres les plus longs déjà vérifiés sur `/physique/` : même conclusion,
retour à la ligne normal sur mobile étroit, aucun débordement. Le H2 de la
section piliers business (48 caractères) s'est avéré quasiment identique
en longueur à celui de physique (47 caractères) et pas "nettement plus
long" comme le prompt le supposait : mesuré plutôt que supposé, les deux
tiennent sans problème dans le `max-width: 42rem` du `.section-header`.

## Cohérence inter-pages (contrôle final, prompt 11/15)

- Bloc bio : identique au caractère près (vérifié par `diff`, voir plus haut).
- CTA : "Réserver mon appel" + "Appel gratuit, sans engagement" partout où
  le copy le demande (homepage n'a pas ce CTA, seulement physique et
  business), aucune variante orpheline d'un ancien placeholder.
- Tiret em (`, `) : recherché dans tout le repo (HTML, CSS, JS, MD),
  aucune occurrence en dehors des commentaires de code (documentation
  interne aux fichiers, jamais lue par un visiteur).
- Prix / tarif / durée d'essai : recherché sur les 3 pages, aucune
  occurrence, y compris en commentaire HTML.

## Contenu (depuis le prompt 10/15)

Copy final intégré sur la homepage et `/physique/`, reproduit tel quel
(aucune reformulation, comme demandé). `/business/` suit au prompt 11/15,
la bio (bloc commun aux deux pages) n'a donc été mise à jour que sur
`/physique/` pour l'instant.

**Mots-clés accentués** (`<span class="accent">`, rouge plein, un par
titre maximum) : `plus vite` (H1 hero), `ton chemin` (H2 bifurcation),
`fait pour toi`, `1-to-1`, `6 piliers`, `accomplir`, `commencer` sur
`/physique/`. Exception délibérée : le H1 de la bio (`Santamaria
Sànchez`) n'a pas d'accent, un prénom/nom n'a pas de "mot clé" à mettre
en avant sans que ça ait l'air arbitraire. Vérifié avec `splitText()` sur
le vrai HTML (jsdom) : le span survit intact à la découpe en mots, y
compris sur un accent de 3 mots ("fait pour toi") au milieu d'un H2 de 7
mots au total.

**Bio physique/business** : la structure du placeholder (1 phrase-crochet
en H1 + 1 paragraphe + 3 phrases courtes) ne correspondait plus au copy
validé (nom en H1 + 3 paragraphes + 3 intitulés de compétences). Le H1
reste un H1 (une seule règle jamais changée : un seul H1 par page, situé
dans la bio pour physique/business) mais son contenu textuel est
maintenant le nom. `initSectionEntrance()` dans `main.js` ciblait un seul
paragraphe (`querySelector`, singulier) : corrigé en `querySelectorAll`
pour que les 3 paragraphes de bio animent ensemble, sinon les paragraphes
2 et 3 seraient restés visibles d'emblée pendant que le reste de la
colonne anime encore.

**Hero homepage** : ajout du sous-titre et de la légende sous la VSL (pas
dans le placeholder d'origine, qui n'avait qu'un H1). Intégrés dans la
timeline d'entrée existante (`initHomeEntrance`) en les regroupant avec
leurs voisins immédiats (H1+sous-titre, VSL+légende) plutôt qu'en
ajoutant deux temps supplémentaires, pour rester dans le budget de 1,5s
déjà documenté (~1,5s au lieu de ~1,4s, écart minime).

**Bifurcation homepage** : le copy donnait un "bouton" par bloc en plus
du titre et de la ligne descriptive, mais chaque bloc est déjà un unique
`<a>` cliquable sur toute sa surface. Un `<a>` imbriqué dans un `<a>` est
invalide en HTML ; le "bouton" est donc un label visuel (`.bloc-cta`,
flèche qui se décale légèrement au survol), jamais un second lien, pour
ne pas casser l'accessibilité clavier (un seul stop de tabulation par
bloc, comme avant).

**Ce qui n'était pas couvert par le copy** (eyebrows, "Choisis ton
chemin", le lien "Voir l'autre accompagnement" du header) : conservé tel
quel, TODO retiré. Ce sont des micro-copies déjà sobres et cohérentes
avec le reste, pas des placeholders à valider séparément.

**Meta tags** : titres et descriptions réécrits, dérivés du copy validé
plutôt qu'inventés (ex. la description homepage reprend le sous-titre
mot pour mot, déjà écrit pour ça). Toujours aucun prix, aucun tiret em.

**Attributs alt** : rien à faire dans ce prompt. Aucune balise `<img>`
n'existe encore dans le HTML (les photos ne sont pas intégrées), donc
aucun `alt` à renseigner pour l'instant, cf. section Accessibilité.

**Vérification des longueurs** (pas de vrai navigateur ici, analyse
statique comme pour les prompts précédents) : les 6 paragraphes de
piliers vont de 114 à 163 caractères, groupés en deux lignes de grille de
longueurs très proches (160/160/163 puis 127/114/129), `.pilier-grid`
utilise `align-items: stretch` par défaut (comportement Grid natif, rien
à ajouter), donc les cards d'une même ligne s'alignent en hauteur même
sans ce hasard de longueurs. Le H1 homepage (57 caractères) reste sous
`max-width: 20ch` avec `text-wrap: balance`, prévu pour wrapper sur 3
lignes par design. Les titres de cards les plus longs (34 caractères,
piliers "Suivi et progression..."/"Nutrition et programme...") wrapperont
sur 2 lignes à 375px, un `<h3>` en bloc sans `white-space: nowrap` nulle
part dans le projet (vérifié par grep) : jamais de débordement
horizontal, seulement un retour à la ligne normal.

## WebGL : évalué, non implémenté (prompt 9/15)

Décision explicite de ne pas ajouter Three.js, avec des chiffres à l'appui
plutôt qu'une impression :

- Poids mesuré via CDN (`curl`) : Three.js 0.152.2 seul = **633 338 octets**,
  soit environ 5x le poids cumulé de GSAP + ScrollTrigger + Lenis
  (72 214 + 43 380 + 12 790 = **128 384 octets**). Un budget disproportionné
  pour un effet que rien dans le brief ne rend indispensable.
- Ce projet a déjà deux précédents WebGL ratés signalés explicitement dans
  le prompt lui-même, un signal fort que le rapport risque/bénéfice est
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
(navigable au clavier, fonctionne sans JS), seul le comportement de scroll
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
était correct, le test retournait un **instantané** du compteur au moment
du `return`, pas une référence vivante mise à jour par les closures
asynchrones ultérieures. Un test isolé corrigé confirme que les deux
déclencheurs appellent bien `ScrollTrigger.refresh()` comme prévu. Retenu
ici comme leçon de méthode plutôt que caché : ça aurait pu passer pour un
"bug" alors que c'était le harnais de test qui mentait.

**Audit "règle de retrait"** : repassage sur chaque effet du fichier en se
demandant s'il sert vraiment la lecture. Aucun effet individuel retiré, chacun répond à une demande explicite (prompt 8) ou reste volontairement
discret (parallaxe portrait, compactage du header). Le retrait réel de
cette passe est Three.js dans son ensemble, plus radical qu'un simple
réglage d'intensité.

**Repasse mobile 375px** : toutes les grilles/flex du site passent en
colonne unique par défaut et ne basculent en plusieurs colonnes qu'au-delà
de 768px/900px ; aucune largeur fixe ne dépasse quelques `rem` (icônes,
diamants) ; le seul débordement volontaire (diamant fantôme du hero,
`min(75vw, 760px)` tourné à 45°) est doublement contenu, `overflow:hidden`
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
portrait (30px sur toute la traversée de la section, `scrub`), sur un
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

**Vélocité de scroll** : pas d'effet de skew ajouté dans cette passe, le
prompt autorise explicitement à ne pas le faire si le résultat n'est pas
vérifiable, et un skew dynamique ne peut pas se juger sans un vrai
navigateur pour voir un scroll rapide en conditions réelles.
`window.lenisVelocity` reste disponible si l'effet est retenté plus tard.

**Vrai bug trouvé et corrigé avant ce commit**, pas en relecture mais en
testant réellement la logique (jsdom, sans navigateur disponible ici) :
le H2 du CTA final était ciblé deux fois, une fois par le système
générique de titres (ses mots), une fois par `initCtaFinalReveal` (le
bloc entier). Deux `ScrollTrigger` distincts sur le même élément. Corrigé
en retirant le H2 de `initCtaFinalReveal` et en lui donnant seulement une
intensité différente dans le système générique. Vérifié après coup avec
une simulation complète de `main.js` (gsap/ScrollTrigger mockés) contre
les 3 pages réelles : 14 ScrollTrigger sur physique/business, 1 sur la
home, et surtout **51 à 53 éléments mis à `opacity:0` ont bien tous une
contrepartie qui les ramène à `opacity:1`**, aucun élément qui resterait
invisible pour de bon.

## Animations, fondations (prompt 7/15)

**Lenis** (`lenis-init.js`) : durée 1.0s (plus réactif que le défaut 1.2s),
`syncTouch: false` pour garder le momentum tactile natif iOS. Désactivé
entièrement (`lenis.stop()`) si `prefers-reduced-motion`. Vélocité toujours
lue dans `gsap.ticker`, jamais dans l'event `scroll` (piège déjà documenté
au prompt 1, toujours respecté).

**Reveal au scroll** (`main.js`) : `[data-reveal]` (élément isolé) et
`[data-reveal-group]` (anime les enfants directs avec stagger), posé au
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
découpé en unités animables, c'était le piège explicitement signalé.

**Résilience CDN** : si GSAP ou ScrollTrigger ne charge pas (réseau, ad
blocker), traité exactement comme `prefers-reduced-motion`, aucune
section ne dépend de ces libs pour redevenir visible. Repris de l'exigence
déjà documentée sur l'ancienne version de ce site ("tout dégrade
proprement si les CDN ne chargent pas").

## Système de design (depuis le prompt 4/15)

Tokens dans `base.css` : échelle d'espacement (`--space-xs` à `--space-3xl`,
base 8px), échelle typographique en `clamp()` (h1/h2/h3, avec un H1 réduit
dans `.split-content` pour ne pas réutiliser l'échelle hero dans une
colonne deux fois moins large), boutons et cards avec hover. **Motif
signature : le diamant rouge** du logo historique, repris à 3 échelles, petit (puce/séparateur/logo), et en grand filigrane (`.hero-diamond-ghost`)
derrière le hero homepage. `/physique/` et `/business/` partagent
strictement le même système (`.split`, `.cards`, `.pilier-grid`,
`.diamond-list`, icônes SVG) défini une seule fois dans `base.css`, `physique.css`/`business.css` ne contiennent plus aucune règle de mise en
page, prêts pour un accent propre à chaque page si besoin un jour.

Icônes SVG en trait rouge (jamais d'emoji) : génériques (cible, message,
cycle) pour les 3 points de méthode communs, et propres au contexte pour
les 6 piliers, haltère/formation/graphique côté physique, boîte à
outils/verrou/dashboard côté business. Toutes vérifiées visuellement avant
commit (rendu PIL en local, faute de vrai navigateur dans cet
environnement), 2 icônes retravaillées au prompt 5 (formes plus sûres
que des arcs SVG non testés), aucun souci sur les 5 icônes du prompt 6.

Quality floor posé au prompt 6/15 : `:focus-visible` explicite (anneau
rouge) sur tout le site, `prefers-reduced-motion` respecté (transitions
neutralisées en CSS, Lenis désactivé et scroll natif repris en JS).

Bug de cohérence attrapé et corrigé au prompt 6/15 : `business.css`
n'avait jamais été nettoyé comme `physique.css` au prompt 5, un ancien
`.criteres .cards` en grille rentrait en conflit de spécificité avec la
version flex-column de `base.css`, `/business/` affichait ses 3 cards de
critères en grille au lieu d'empilées. Les deux fichiers de page sont
maintenant symétriques et vides de règles de mise en page.

## Liens externes câblés

- Instagram : https://instagram.com/santamariasanchez_
- Pages légales (temporaires, pointent vers l'app) : https://ep-coaching.vercel.app/legal/{cgu,cgv,confidentialite}
- Formulaire physique : https://ep-coaching-formulaires.vercel.app/prequalification (route inchangée depuis le prompt 13/15)
- Formulaire business : https://ep-coaching-formulaires.vercel.app/business (câblé au prompt 14/15, repo séparé ep-coaching-formulaires)
- Fallback business (inscription gratuite) : https://ep-coaching.vercel.app/auth/client

## Accessibilité

Un seul `<h1>` par page (bio pour physique/business, hero pour la home),
`<h2>` sur chaque section, pas de saut de niveau. Pas encore de balise
`<img>` dans le HTML (les photos dans `assets/images/` ne sont pas
encore intégrées) : rien à mettre en `alt` pour l'instant, prévoir un
texte descriptif réel à l'intégration de chaque image en phase design/contenu.

## Règles de contenu non négociables

- Jamais de prix affiché nulle part.
- Jamais de tiret cadratin (le signe de ponctuation long) dans aucun texte.
- Vente indirecte uniquement : l'objectif de chaque page est de pousser
  vers le formulaire de préqualification / Calendly, jamais de vendre une
  offre en direct sur la page.
