/* ═══════════════════════════════════════════════════════════════
   EP COACHING — ONE PAGE ENGINE
   Lenis (scroll inertiel) · GSAP + ScrollTrigger (scènes pilotées)
   gl.js (Three.js : particules hero + distortion images)
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(hover: none)').matches || 'ontouchstart' in window;
  const hasGSAP = !!(window.gsap && window.ScrollTrigger && window.Lenis);

  /* ── Fallback : tout visible, rien n'anime ─────────────────── */
  if (!hasGSAP || reduced) {
    const l = document.getElementById('loader');
    if (l) l.style.display = 'none';
    document.querySelectorAll('.rv').forEach(el => { el.style.opacity = '1'; });
    document.querySelectorAll('.manifesto-text').forEach(el => { el.style.opacity = '1'; });
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease: 'expo.out', duration: 1 });
  const EXPO = 'expo.out', INOUT = 'expo.inOut';

  /* ════════ LENIS ════════ */
  const lenis = new Lenis({
    duration: 1.15,
    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    syncTouch: false
  });
  window.__lenisVelocity = 0;
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(t => { lenis.raf(t * 1000); window.__lenisVelocity = lenis.velocity || 0; });
  gsap.ticker.lagSmoothing(0);
  lenis.stop();

  /* ════════ OUTILS ════════ */
  function splitChars(el) {
    if (el.dataset.split === 'done') return el.querySelectorAll('.sup-ch');
    el.setAttribute('aria-label', el.textContent.trim());
    el.dataset.split = 'done';
    const frag = document.createDocumentFragment();
    el.textContent.split(/(\s+)/).forEach(part => {
      if (!part) return;
      if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
      const w = document.createElement('span');
      w.className = 'sup-word'; w.setAttribute('aria-hidden', 'true');
      for (const c of part) {
        const s = document.createElement('span');
        s.className = 'sup-ch'; s.textContent = c;
        w.appendChild(s);
      }
      frag.appendChild(w);
    });
    el.innerHTML = '';
    el.appendChild(frag);
    return el.querySelectorAll('.sup-ch');
  }

  /* ════════ PRELOADER — mise en charge ════════ */
  function runLoader(onDone) {
    const loader = document.getElementById('loader');
    if (!loader) { lenis.start(); onDone(); return; }
    document.body.style.overflow = 'hidden';

    const fill = document.getElementById('loader-fill');
    const pct  = document.getElementById('loader-pct');
    const word = loader.querySelector('.loader-word');
    const chars = splitChars(word);
    const prog = { v: 0 };

    gsap.set(loader, { clipPath: 'inset(0% 0% 0% 0%)' });
    gsap.set(chars, { yPercent: 120 });

    gsap.timeline({
      onComplete: () => {
        loader.style.display = 'none';
        document.body.style.overflow = '';
        lenis.start();
        onDone();
      }
    })
      .to(chars, { yPercent: 0, stagger: 0.04, duration: 0.85, ease: EXPO }, 0)
      .to(prog, {
        v: 100, duration: 1.6, ease: 'power3.inOut',
        onUpdate: () => {
          pct.textContent = String(Math.floor(prog.v)).padStart(3, '0');
          gsap.set(fill, { scaleX: prog.v / 100 });
        }
      }, 0.15)
      .to(loader.querySelectorAll('.loader-bar, .loader-data'), { opacity: 0, duration: 0.3 }, '-=0.05')
      .to(chars, { yPercent: -120, stagger: 0.02, duration: 0.55, ease: INOUT }, '-=0.1')
      .to(loader, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.85, ease: INOUT }, '-=0.3');
  }

  /* ════════ SCÈNE 01 — HERO ════════ */
  function heroIntro() {
    window.__heroReady = true; // déclenche les particules WebGL

    const lines = document.querySelectorAll('#hero-title .line');
    const chars = [];
    lines.forEach(l => {
      const target = l.querySelector('.t-red') || l;
      chars.push(...splitChars(target));
    });

    const tl = gsap.timeline();
    tl.from(chars, { yPercent: 130, rotateZ: 5, duration: 1.2, stagger: 0.022, ease: EXPO }, 0)
      .fromTo('.hero-tag', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.9 }, 0.25)
      .fromTo('.hero-sub', { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 1 }, 0.55)
      .fromTo('.hero-scroll', { opacity: 0 }, { opacity: 1, duration: 0.8 }, 1.0)
      .fromTo('#hero-media img', { scale: 1.16 }, { scale: 1, duration: 2.4, ease: 'power2.out' }, 0)
      .from('.nav', { y: -30, opacity: 0, duration: 1 }, 0.4);
  }

  function heroScrub() {
    gsap.timeline({
      scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true }
    })
      .to('#hero-media', { yPercent: 26, scale: 1.07, ease: 'none' }, 0)
      .to('.hero-content', { yPercent: 16, opacity: 0, ease: 'none' }, 0);
  }

  /* ════════ SCÈNE 02 — MANIFESTE (lecture pilotée) ════════ */
  function manifesto() {
    const el = document.getElementById('manifesto-text');
    if (!el) return;

    // [mot] => accent rouge
    const words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words.map(w => {
      const accent = /^\[.*\]$/.test(w);
      const clean = w.replace(/^\[|\]$/g, '');
      return `<span class="w${accent ? ' accent' : ''}">${clean}</span>`;
    }).join(' ');

    gsap.to(el.querySelectorAll('.w'), {
      opacity: 1, stagger: 0.6, ease: 'none',
      scrollTrigger: {
        trigger: '.manifesto',
        start: 'top top',
        end: '+=160%',
        scrub: 0.4,
        pin: '.manifesto-pin',
        pinSpacing: true
      }
    });
  }

  /* ════════ SCÈNE 03 — PREUVE (horizontal pinné) ════════ */
  function proof() {
    ScrollTrigger.matchMedia({
      '(min-width: 901px)': function () {
        const track = document.getElementById('proof-track');
        const years = document.getElementById('proof-years');
        const dist  = () => track.scrollWidth - window.innerWidth;

        const trackTween = gsap.to(track, {
          x: () => -dist(), ease: 'none',
          scrollTrigger: {
            trigger: '#proof-pin',
            start: 'top top',
            end: () => '+=' + (dist() + window.innerHeight * 0.2),
            scrub: 0.6,
            pin: true,
            invalidateOnRefresh: true
          }
        });
        gsap.to(years, {
          x: () => -dist() * 0.35, ease: 'none',
          scrollTrigger: {
            trigger: '#proof-pin',
            start: 'top top',
            end: () => '+=' + (dist() + window.innerHeight * 0.2),
            scrub: 0.6
          }
        });
      },
      '(max-width: 900px)': function () {
        gsap.utils.toArray('.proof-card').forEach(card => {
          gsap.from(card, {
            y: 60, opacity: 0, duration: 1.1, ease: EXPO,
            scrollTrigger: { trigger: card, start: 'top 88%', once: true }
          });
        });
      }
    });
  }

  /* ════════ TITRES — chars masqués au scroll ════════ */
  function splitDeep(container, out) {
    // split les chars en préservant les éléments enfants (.t-outline, .t-red…)
    Array.from(container.childNodes).forEach(node => {
      if (node.nodeType === 3) {
        const span = document.createElement('span');
        span.textContent = node.textContent;
        container.replaceChild(span, node);
        out.push(...splitChars(span));
        span.replaceWith(...span.childNodes);
      } else if (node.nodeType === 1) {
        out.push(...splitChars(node));
      }
    });
  }

  function titles() {
    document.querySelectorAll('.method-hd h2, .athlete-text h2, .proof-intro h2, .proof-end h3').forEach(t => {
      const lines = [];
      if (t.querySelector('br')) {
        const parts = t.innerHTML.split(/<br\s*\/?>/i);
        t.innerHTML = parts.map(p => `<span class="w-line"><span class="w-li">${p}</span></span>`).join('');
        t.querySelectorAll('.w-li').forEach(li => splitDeep(li, lines));
      } else {
        t.style.overflow = 'hidden';
        splitDeep(t, lines);
      }
      gsap.from(lines, {
        yPercent: 120, rotateZ: 4, duration: 1, stagger: 0.016, ease: EXPO,
        scrollTrigger: { trigger: t, start: 'top 86%', once: true }
      });
    });

    // titre final : chars + scrub du fond géant
    const finalChars = [];
    document.querySelectorAll('#final-title .line').forEach(l => {
      const target = l.querySelector('.t-red') || l;
      finalChars.push(...splitChars(target));
    });
    gsap.from(finalChars, {
      yPercent: 130, duration: 1.2, stagger: 0.03, ease: EXPO,
      scrollTrigger: { trigger: '#final-title', start: 'top 80%', once: true }
    });
    gsap.fromTo('#final-bg', { scale: 0.55, rotateZ: -4 }, {
      scale: 1.05, rotateZ: 0, ease: 'none',
      scrollTrigger: { trigger: '.final', start: 'top bottom', end: 'bottom top', scrub: true }
    });
  }

  /* ════════ REVEALS GÉNÉRIQUES ════════ */
  function reveals() {
    gsap.utils.toArray('.rv').forEach(el => {
      if (el.closest('.hero')) return; // gérés par l'intro
      gsap.fromTo(el, { y: 44, opacity: 0 }, {
        y: 0, opacity: 1, duration: 1.15, ease: EXPO, clearProps: 'transform',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true }
      });
    });

    // portrait athlète : bascule 3D à l'entrée
    const fig = document.querySelector('#athlete-visual figure');
    if (fig) {
      gsap.fromTo(fig, { rotateY: 16, x: -50, opacity: 0 }, {
        rotateY: 0, x: 0, opacity: 1, duration: 1.5, ease: EXPO,
        scrollTrigger: { trigger: '#athlete-visual', start: 'top 80%', once: true }
      });
      gsap.to(fig, {
        yPercent: -8, ease: 'none',
        scrollTrigger: { trigger: '.athlete', start: 'top bottom', end: 'bottom top', scrub: true }
      });
    }
  }

  /* ════════ COMPTEURS ════════ */
  function counters() {
    document.querySelectorAll('[data-count]').forEach(el => {
      const end = parseFloat(el.dataset.count);
      const obj = { v: 0 };
      gsap.to(obj, {
        v: end, duration: 1.8, ease: 'power3.out',
        onUpdate: () => { el.textContent = Math.floor(obj.v); },
        scrollTrigger: { trigger: el, start: 'top 90%', once: true }
      });
    });
  }

  /* ════════ VÉLOCITÉ — marquee + skew ════════ */
  function velocity() {
    const track = document.querySelector('.marquee-track');
    const skews = gsap.utils.toArray('.proof-card figure, .marquee-track')
      .map(el => gsap.quickTo(el, 'skewX', { duration: 0.4, ease: 'power2.out' }));
    gsap.ticker.add(() => {
      const v = gsap.utils.clamp(-40, 40, window.__lenisVelocity || 0);
      skews.forEach(s => s(v * 0.05));
      if (track && track.getAnimations) {
        const a = track.getAnimations()[0];
        if (a) a.playbackRate = 1 + Math.min(Math.abs(v) / 18, 2.2);
      }
    });
  }

  /* ════════ CURSEUR ════════ */
  function cursor() {
    if (isTouch) return;
    const dot = document.getElementById('cdot');
    const ring = document.getElementById('cring');
    const label = document.getElementById('clabel');
    const dx = gsap.quickTo(dot, 'x', { duration: 0.12, ease: 'power3.out' });
    const dy = gsap.quickTo(dot, 'y', { duration: 0.12, ease: 'power3.out' });
    const rx = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3.out' });
    const ry = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3.out' });
    gsap.set([dot, ring], { xPercent: -50, yPercent: -50 });
    window.addEventListener('mousemove', e => { dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY); }, { passive: true });

    document.querySelectorAll('a, button, [data-cursor]').forEach(el => {
      el.addEventListener('mouseenter', () => {
        gsap.to(ring, { scale: 1.7, duration: 0.35, ease: 'power3.out' });
        ring.style.borderColor = 'rgba(230,0,0,.55)';
        if (el.dataset.cursor) { label.textContent = el.dataset.cursor; label.style.opacity = '1'; }
      });
      el.addEventListener('mouseleave', () => {
        gsap.to(ring, { scale: 1, duration: 0.35, ease: 'power3.out' });
        ring.style.borderColor = '';
        label.style.opacity = '0';
      });
    });

    document.querySelectorAll('img[data-webgl]').forEach(img => {
      const z = img.closest('figure') || img.parentElement;
      z.addEventListener('mouseenter', () => ring.classList.add('is-media'));
      z.addEventListener('mouseleave', () => ring.classList.remove('is-media'));
    });
  }

  /* ════════ MAGNETIC + TILT ════════ */
  function magnetic() {
    if (isTouch) return;
    document.querySelectorAll('.magnetic').forEach(el => {
      const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' });
      const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - r.left - r.width / 2) * 0.3);
        yTo((e.clientY - r.top - r.height / 2) * 0.3);
      });
      el.addEventListener('mouseleave', () => { xTo(0); yTo(0); });
    });

    document.querySelectorAll('[data-tilt]').forEach(card => {
      const rX = gsap.quickTo(card, 'rotationX', { duration: 0.5, ease: 'power3.out' });
      const rY = gsap.quickTo(card, 'rotationY', { duration: 0.5, ease: 'power3.out' });
      gsap.set(card, { transformPerspective: 900 });
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        rY(((e.clientX - r.left) / r.width - 0.5) * 5);
        rX(-((e.clientY - r.top) / r.height - 0.5) * 4);
      });
      card.addEventListener('mouseleave', () => { rX(0); rY(0); });
    });
  }

  /* ════════ PROGRESS + ANCHORS ════════ */
  function chrome() {
    gsap.to('#progress', {
      scaleX: 1, ease: 'none',
      scrollTrigger: { start: 0, end: 'max', scrub: 0.2 }
    });
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const t = document.querySelector(a.getAttribute('href'));
        if (!t) return;
        e.preventDefault();
        lenis.scrollTo(t, { duration: 1.5 });
      });
    });
  }

  /* ════════ BOOT ════════ */
  window.addEventListener('load', () => ScrollTrigger.refresh());

  manifesto();
  proof();
  titles();
  reveals();
  counters();
  velocity();
  cursor();
  magnetic();
  chrome();
  heroScrub();
  runLoader(heroIntro);
})();
