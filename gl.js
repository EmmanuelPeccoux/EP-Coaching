/* ═══════════════════════════════════════════════════════════════
   EP COACHING — GL ENGINE (Three.js)
   · Champ de particules braises dans le hero (réactif souris + scroll)
   · Distortion shader sur les images [data-webgl]
     (déformation par vélocité de scroll, ripple au hover, RGB shift,
      désaturation -> couleur au hover)
   Dépend de : three.min.js (CDN). motion.js expose window.__lenisVelocity.
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(hover: none)').matches || 'ontouchstart' in window;

  if (reduced || !window.THREE) { window.EPGL = { enabled: false }; return; }

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
  } catch (e) {
    window.EPGL = { enabled: false }; return;
  }

  /* ─── STAGE ─────────────────────────────────────────────────── */
  const stage = document.createElement('div');
  stage.id = 'gl-stage';
  document.body.appendChild(stage);
  stage.appendChild(renderer.domElement);

  const DPR = Math.min(window.devicePixelRatio || 1, 2);
  renderer.setPixelRatio(DPR);

  const scene = new THREE.Scene();
  let W = window.innerWidth, H = window.innerHeight;

  /* Caméra perspective calibrée : 1 unité = 1 pixel à z = 0 */
  const CAM_Z = 1000;
  const camera = new THREE.PerspectiveCamera(0, W / H, 10, 2000);
  camera.position.z = CAM_Z;
  function calibrate() {
    camera.fov = 2 * Math.atan(H / 2 / CAM_Z) * (180 / Math.PI);
    camera.aspect = W / H;
    camera.updateProjectionMatrix();
    renderer.setSize(W, H);
  }
  calibrate();

  const mouse = { x: W / 2, y: H / 2, sx: W / 2, sy: H / 2 };
  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });

  const clock = new THREE.Clock();
  let velocity = 0; // lissée, fournie par motion.js (lenis)

  /* ════════════════════════════════════════════════════════════
     1. PARTICULES — braises dans le hero
  ════════════════════════════════════════════════════════════ */
  const heroEl = document.querySelector('#hero, .ph-hero, .ch-hero, .ct-hero');
  let particles = null;

  if (heroEl) {
    const COUNT = isTouch ? 160 : 750;
    const geo = new THREE.BufferGeometry();
    const seeds = new Float32Array(COUNT * 4);
    const pos = new Float32Array(COUNT * 3); // placeholder requis
    for (let i = 0; i < COUNT; i++) {
      seeds[i * 4 + 0] = Math.random();         // x norm
      seeds[i * 4 + 1] = Math.random();         // y norm
      seeds[i * 4 + 2] = Math.random();         // profondeur / taille
      seeds[i * 4 + 3] = Math.random();         // phase
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 4));

    const pMat = new THREE.ShaderMaterial({
      transparent: true,
      depthTest: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime:    { value: 0 },
        uArea:    { value: new THREE.Vector2(W, H) },   // zone hero (w,h)
        uTop:     { value: 0 },                          // top du hero (px écran)
        uMouse:   { value: new THREE.Vector2(-9999, -9999) },
        uVelo:    { value: 0 },
        uOpacity: { value: 0 },
        uDPR:     { value: DPR },
        uHalf:    { value: new THREE.Vector2(W / 2, H / 2) }
      },
      vertexShader: `
        attribute vec4 aSeed;
        uniform float uTime, uTop, uVelo, uDPR;
        uniform vec2 uArea, uMouse, uHalf;
        varying float vAlpha, vTint;

        void main(){
          float depth = aSeed.z;                       // 0 lointain -> 1 proche
          float speed = mix(8.0, 30.0, depth);
          // derive verticale infinie (les braises montent)
          float yCyc = fract(aSeed.y + uTime * speed / uArea.y + uVelo * 0.0004 * depth);
          float x = aSeed.x * uArea.x
                  + sin(uTime * (0.4 + aSeed.w) + aSeed.w * 6.28) * mix(8.0, 36.0, depth);
          float y = uTop + (1.0 - yCyc) * uArea.y;

          // repulsion souris
          vec2 p = vec2(x, y);
          vec2 d = p - uMouse;
          float dist = length(d);
          float force = smoothstep(170.0, 0.0, dist) * 46.0 * depth;
          p += normalize(d + 0.0001) * force;

          // px ecran -> espace camera (origine centre, y vers le haut)
          vec3 world = vec3(p.x - uHalf.x, -(p.y - uHalf.y), mix(-220.0, 60.0, depth));

          vec4 mv = modelViewMatrix * vec4(world, 1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = mix(1.4, 4.4, depth) * uDPR * (1.0 + abs(uVelo) * 0.004);

          // fade haut/bas + scintillement
          float edge = smoothstep(0.0, 0.12, yCyc) * smoothstep(1.0, 0.82, yCyc);
          float twinkle = 0.55 + 0.45 * sin(uTime * (1.5 + aSeed.w * 3.0) + aSeed.x * 40.0);
          vAlpha = edge * twinkle * mix(0.25, 1.0, depth);
          vTint = step(0.82, aSeed.w);                 // ~18% blanches, le reste rouge
        }
      `,
      fragmentShader: `
        precision mediump float;
        uniform float uOpacity;
        varying float vAlpha, vTint;
        void main(){
          vec2 uv = gl_PointCoord - 0.5;
          float d = length(uv);
          float disc = smoothstep(0.5, 0.05, d);
          vec3 red   = vec3(0.95, 0.06, 0.06);
          vec3 white = vec3(1.0, 0.92, 0.88);
          vec3 col = mix(red, white, vTint);
          gl_FragColor = vec4(col, disc * vAlpha * uOpacity);
        }
      `
    });

    particles = new THREE.Points(geo, pMat);
    particles.frustumCulled = false;
    scene.add(particles);
  }

  /* ════════════════════════════════════════════════════════════
     2. DISTORTION MEDIA — images [data-webgl]
  ════════════════════════════════════════════════════════════ */
  const planes = [];
  const loader = new THREE.TextureLoader();

  const mediaVS = `
    uniform float uVelo;
    varying vec2 vUv;
    void main(){
      vec3 pos = position;
      // courbure pilotée par la vélocité du scroll (unités normalisées du plane)
      pos.z += sin(uv.y * 3.14159) * clamp(uVelo, -40.0, 40.0) * 0.55;
      pos.y += sin(uv.x * 3.14159) * clamp(uVelo, -40.0, 40.0) * 0.0009;
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `;
  const mediaFS = `
    precision highp float;
    uniform sampler2D uTex;
    uniform vec2 uPlane, uImage, uMouse;
    uniform float uHover, uSat, uVelo, uTime;
    varying vec2 vUv;

    vec2 cover(vec2 uv, vec2 plane, vec2 img){
      float pr = plane.x / plane.y;
      float ir = img.x / img.y;
      vec2 s = (pr > ir) ? vec2(1.0, ir / pr) : vec2(pr / ir, 1.0);
      return (uv - 0.5) * s + 0.5;
    }

    void main(){
      vec2 uv = cover(vUv, uPlane, uImage);

      // ripple radial au hover
      float dist = distance(vUv, uMouse);
      float ripple = sin(dist * 22.0 - uTime * 5.0) * 0.014 * uHover * smoothstep(0.55, 0.0, dist);
      uv += normalize(vUv - uMouse + 0.0001) * ripple;

      // zoom léger au hover
      uv = (uv - 0.5) * (1.0 - uHover * 0.04) + 0.5;

      // RGB shift : vélocité + hover
      float shift = clamp(uVelo, -40.0, 40.0) * 0.00022 + uHover * 0.004 * smoothstep(0.55, 0.0, dist);
      float r = texture2D(uTex, uv + vec2(shift, 0.0)).r;
      float g = texture2D(uTex, uv).g;
      float b = texture2D(uTex, uv - vec2(shift, 0.0)).b;
      vec3 col = vec3(r, g, b);

      // grayscale -> couleur (hover)
      float gray = dot(col, vec3(0.299, 0.587, 0.114));
      col = mix(vec3(gray) * 1.05, col, uSat);

      gl_FragColor = vec4(col, 1.0);
    }
  `;

  function addPlane(img) {
    const src = img.currentSrc || img.src;
    loader.load(src, (tex) => {
      tex.minFilter = THREE.LinearFilter;
      tex.generateMipmaps = false;
      const geo = new THREE.PlaneGeometry(1, 1, 24, 24);
      const mat = new THREE.ShaderMaterial({
        vertexShader: mediaVS,
        fragmentShader: mediaFS,
        uniforms: {
          uTex:   { value: tex },
          uPlane: { value: new THREE.Vector2(1, 1) },
          uImage: { value: new THREE.Vector2(tex.image.width, tex.image.height) },
          uMouse: { value: new THREE.Vector2(0.5, 0.5) },
          uHover: { value: 0 },
          uSat:   { value: 0 },   // 0 = N&B, 1 = couleur
          uVelo:  { value: 0 },
          uTime:  { value: 0 }
        }
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.frustumCulled = false;
      scene.add(mesh);

      const item = { img, mesh, mat, hoverT: 0, satT: 0, hover: 0, sat: 0 };
      planes.push(item);
      img.classList.add('gl-hidden');

      const zone = img.closest('.gal-item, .photo-wrap, .tl-photo, .grid-photo, figure') || img.parentElement || img;
      zone.addEventListener('mouseenter', () => { item.hoverT = 1; item.satT = 1; });
      zone.addEventListener('mouseleave', () => { item.hoverT = 0; item.satT = 0; });
      zone.addEventListener('mousemove', (e) => {
        const r = img.getBoundingClientRect();
        mat.uniforms.uMouse.value.set((e.clientX - r.left) / r.width, 1 - (e.clientY - r.top) / r.height);
      });
    });
  }

  if (!isTouch) {
    document.querySelectorAll('img[data-webgl]').forEach(addPlane);
    if (planes.length || document.querySelectorAll('img[data-webgl]').length) {
      document.documentElement.classList.add('gl-on');
    }
  }

  /* ════════════════════════════════════════════════════════════
     RAF
  ════════════════════════════════════════════════════════════ */
  let heroVisible = true;
  let running = true;
  document.addEventListener('visibilitychange', () => { running = !document.hidden; });

  function tick() {
    requestAnimationFrame(tick);
    if (!running) return;

    const t = clock.getElapsedTime();
    const targetV = Math.max(-60, Math.min(60, window.__lenisVelocity || 0));
    velocity += (targetV - velocity) * 0.1;

    mouse.sx += (mouse.x - mouse.sx) * 0.08;
    mouse.sy += (mouse.y - mouse.sy) * 0.08;

    /* particules : suivent le rect du hero, fade en sortie */
    if (particles) {
      const r = heroEl.getBoundingClientRect();
      heroVisible = r.bottom > 0;
      const u = particles.material.uniforms;
      if (heroVisible) {
        u.uTime.value = t;
        u.uArea.value.set(r.width, r.height);
        u.uTop.value = r.top;
        u.uHalf.value.set(W / 2, H / 2);
        u.uMouse.value.set(mouse.sx, mouse.sy);
        u.uVelo.value = velocity;
        const fade = Math.max(0, Math.min(1, r.bottom / (H * 0.7)));
        u.uOpacity.value += ((window.__heroReady ? fade : 0) - u.uOpacity.value) * 0.05;
      }
      particles.visible = heroVisible;
    }

    /* planes média : sync DOM + uniforms */
    for (let i = 0; i < planes.length; i++) {
      const p = planes[i];
      const r = p.img.getBoundingClientRect();
      const off = r.bottom < -80 || r.top > H + 80;
      p.mesh.visible = !off;
      if (off) continue;

      p.mesh.scale.set(r.width, r.height, 1);
      p.mesh.position.set(r.left + r.width / 2 - W / 2, -(r.top + r.height / 2 - H / 2), 0);

      // rotation 3D réelle : orientée selon la position écran + poussée par la vélocité
      const offC = (r.left + r.width / 2 - W / 2) / W;       // -0.5 → 0.5
      p.mesh.rotation.y = offC * -0.38 + Math.max(-0.14, Math.min(0.14, velocity * -0.003));

      p.hover += (p.hoverT - p.hover) * 0.08;
      p.sat   += (p.satT   - p.sat)   * 0.06;
      p.mat.uniforms.uHover.value = p.hover;
      p.mat.uniforms.uSat.value   = p.sat;
      p.mat.uniforms.uVelo.value  = velocity;
      p.mat.uniforms.uTime.value  = t;
      p.mat.uniforms.uPlane.value.set(r.width, r.height);
    }

    renderer.render(scene, camera);
  }
  tick();

  window.addEventListener('resize', () => {
    W = window.innerWidth; H = window.innerHeight;
    calibrate();
  });

  window.EPGL = { enabled: true };
})();
