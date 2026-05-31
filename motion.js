/* ═══════════════════════════════════════════════════════════════
   EP COACHING — MOTION ENGINE v3
   Smooth scroll lerp · 3D scroll-driven · Hover cards · Page transitions
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─────────────────────────────────────────────────────────────────
     CONSTANTS & STATE
  ───────────────────────────────────────────────────────────────── */
  const IS_DESKTOP = window.innerWidth > 1024 && !('ontouchstart' in window);
  const EASE_OUT   = 'cubic-bezier(0.16,1,0.3,1)';
  const EASE_INOUT = 'cubic-bezier(0.83,0,0.17,1)';

  // Scroll state (shared by all systems)
  let currentY  = 0;
  let targetY   = 0;
  let lastY     = 0;
  let velocity  = 0;
  let lerpActive = false;
  const LERP = 0.08;

  /* ─────────────────────────────────────────────────────────────────
     1. SMOOTH SCROLL LERP  (desktop only)
  ───────────────────────────────────────────────────────────────── */
  if (IS_DESKTOP) {

    // Intercept wheel — prevent native scroll, apply lerp
    window.addEventListener('wheel', e => {
      e.preventDefault();
      const max = document.documentElement.scrollHeight - window.innerHeight;
      targetY = Math.max(0, Math.min(targetY + e.deltaY, max));
      if (!lerpActive) { lerpActive = true; lerpTick(); }
    }, { passive: false });

    // Keyboard navigation
    window.addEventListener('keydown', e => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const map = { ArrowDown: 100, ArrowUp: -100, PageDown: window.innerHeight * 0.85, PageUp: -window.innerHeight * 0.85 };
      if (e.key === 'End')  { e.preventDefault(); targetY = max; }
      if (e.key === 'Home') { e.preventDefault(); targetY = 0; }
      const d = map[e.key];
      if (d !== undefined) { e.preventDefault(); targetY = Math.max(0, Math.min(targetY + d, max)); }
      if (!lerpActive) { lerpActive = true; lerpTick(); }
    });

    function lerpTick() {
      const diff = targetY - currentY;
      if (Math.abs(diff) < 0.25) {
        currentY = targetY;
        window.scrollTo(0, currentY);
        lerpActive = false;
        return;
      }
      currentY += diff * LERP;
      window.scrollTo(0, currentY);
      requestAnimationFrame(lerpTick);
    }

  } else {
    // Mobile: sync currentY with native scroll
    window.addEventListener('scroll', () => { currentY = window.scrollY; }, { passive: true });
  }

  function scrollY() { return IS_DESKTOP ? currentY : window.scrollY; }

  /* ─────────────────────────────────────────────────────────────────
     2. PAGE TRANSITION  — rideau rouge (#pt)
  ───────────────────────────────────────────────────────────────── */
  // Works with both #pt (new) and #page-transition (legacy)
  let pt = document.getElementById('pt') || document.getElementById('page-transition');
  if (!pt) {
    pt = document.createElement('div');
    pt.id = 'pt';
    document.body.appendChild(pt);
  }

  // Page enter: slide curtain away
  window.addEventListener('DOMContentLoaded', () => {
    pt.style.cssText = 'transform:scaleY(1);transform-origin:top;';
    requestAnimationFrame(() => requestAnimationFrame(() => {
      pt.style.transition = `transform 0.52s ${EASE_INOUT} 0.08s`;
      pt.style.transform = 'scaleY(0)';
    }));
  });

  // Click on internal link: slide curtain in then navigate
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href]');
    if (!a) return;
    const href = a.getAttribute('href');
    if (!href || /^(https?:|\/\/|mailto:|tel:|#)/.test(href) || a.target === '_blank') return;
    e.preventDefault();
    pt.style.transition = `transform 0.5s ${EASE_INOUT}`;
    pt.style.transformOrigin = 'bottom';
    pt.style.transform = 'scaleY(1)';
    setTimeout(() => { window.location.href = href; }, 520);
  });

  /* ─────────────────────────────────────────────────────────────────
     3. PRELOADER V2
  ───────────────────────────────────────────────────────────────── */
  document.body.style.overflow = 'hidden';

  (function initPreloader() {
    // Animated percentage counter
    const pctEl = document.querySelector('.preloader-count, .preloader-pct');
    if (pctEl) {
      if (pctEl.classList.contains('preloader-pct')) pctEl.className = 'preloader-count';
      const dur = 1800;
      const t0  = performance.now();
      (function tick(t) {
        const p    = Math.min((t - t0) / dur, 1);
        const ease = 1 - Math.pow(1 - p, 3); // fast-start, slow-end
        pctEl.textContent = Math.floor(ease * 100) + '%';
        if (p < 1) requestAnimationFrame(tick); else pctEl.textContent = '100%';
      })(t0);
    }

    // Inject subtitle if absent
    const bar = document.querySelector('.preloader-bar');
    if (bar && !document.querySelector('.preloader-subtitle')) {
      const sub = document.createElement('div');
      sub.className   = 'preloader-subtitle';
      sub.textContent = 'Compétiteur · Coach · Annecy';
      bar.insertAdjacentElement('afterend', sub);
    }

    // Enhanced exit sequence
    window.addEventListener('load', () => {
      setTimeout(() => {
        const pl   = document.getElementById('preloader');
        if (!pl) { document.body.style.overflow = ''; return; }

        // 1 — bar slides out to the right
        const barEl = pl.querySelector('.preloader-bar');
        if (barEl) {
          barEl.style.transition   = `transform 0.4s ${EASE_INOUT}`;
          barEl.style.transformOrigin = 'right';
          barEl.style.transform    = 'scaleX(0)';
        }

        // 2 — logo floats up
        setTimeout(() => {
          const logo = pl.querySelector('.preloader-logo');
          if (logo) {
            logo.style.transition = `transform 0.5s ${EASE_OUT}, opacity 0.5s ease`;
            logo.style.transform  = 'translateY(-18px)';
            logo.style.opacity    = '0';
          }
        }, 180);

        // 3 — whole overlay fades
        setTimeout(() => {
          pl.style.transition = 'opacity 0.55s ease';
          pl.style.opacity    = '0';
          setTimeout(() => {
            pl.classList.add('gone');
            document.body.style.overflow = '';
          }, 560);
        }, 380);

      }, 1800);
    });
  })();

  /* ─────────────────────────────────────────────────────────────────
     4. SCROLL PROGRESS BAR
  ───────────────────────────────────────────────────────────────── */
  const spEl = document.querySelector('#sp, .scroll-progress');
  function refreshScrollProgress() {
    if (!spEl) return;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    spEl.style.transform = `scaleX(${max > 0 ? scrollY() / max : 0})`;
  }
  window.addEventListener('scroll', refreshScrollProgress, { passive: true });

  /* ─────────────────────────────────────────────────────────────────
     5. NAV SCROLLED STATE
  ───────────────────────────────────────────────────────────────── */
  const navEl = document.getElementById('nav');
  function refreshNav() {
    if (navEl) navEl.classList.toggle('scrolled', scrollY() > 60);
  }
  window.addEventListener('scroll', refreshNav, { passive: true });

  /* ─────────────────────────────────────────────────────────────────
     6. CURSOR  (desktop only)
  ───────────────────────────────────────────────────────────────── */
  if (IS_DESKTOP) {
    const dot   = document.getElementById('cursor');
    const ring  = document.getElementById('cring');
    const label = document.getElementById('cursorLabel');
    let mx = 0, my = 0, dx = 0, dy = 0, rx = 0, ry = 0;

    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

    (function cursorLoop() {
      dx += (mx - dx) * 0.45;
      dy += (my - dy) * 0.45;
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      if (dot)  dot.style.transform  = `translate(${dx}px,${dy}px) translate(-50%,-50%)`;
      if (ring) ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
      requestAnimationFrame(cursorLoop);
    })();

    document.querySelectorAll('a, button, .magnetic').forEach(el => {
      el.addEventListener('mouseenter', () => {
        dot?.classList.add('hovered');
        ring?.classList.add('hovered');
        if (label) label.textContent = el.dataset.cursor || '';
      });
      el.addEventListener('mouseleave', () => {
        dot?.classList.remove('hovered');
        ring?.classList.remove('hovered');
      });
    });

    // Magnetic buttons
    document.querySelectorAll('.magnetic').forEach(el => {
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - (r.left + r.width  / 2);
        const y = e.clientY - (r.top  + r.height / 2);
        el.style.transform = `translate(${x * 0.25}px,${y * 0.35}px)`;
        const inner = el.querySelector('.btn-inner,.magnetic-inner');
        if (inner) inner.style.transform = `translate(${x * 0.14}px,${y * 0.18}px)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = '';
        const inner = el.querySelector('.btn-inner,.magnetic-inner');
        if (inner) inner.style.transform = '';
      });
    });
  }

  /* ─────────────────────────────────────────────────────────────────
     7. BURGER MENU
  ───────────────────────────────────────────────────────────────── */
  const burger = document.getElementById('burger');
  const mm     = document.getElementById('mobileMenu');
  if (burger && mm) {
    burger.addEventListener('click', () => {
      mm.classList.toggle('open');
      document.body.style.overflow = mm.classList.contains('open') ? 'hidden' : '';
    });
    mm.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      mm.classList.remove('open');
      document.body.style.overflow = '';
    }));
  }

  /* ─────────────────────────────────────────────────────────────────
     8. SPLIT TEXT 3D  (chars + words)
  ───────────────────────────────────────────────────────────────── */
  const splitStyles = document.createElement('style');
  splitStyles.textContent = `
    .split-p { perspective: 500px; display: inline; }
    .split-w { display: inline-block; overflow: hidden; vertical-align: bottom; }
    .split-c {
      display: inline-block;
      transform: translateY(112%) rotateX(36deg);
      transition: transform 1s cubic-bezier(0.19,1,0.22,1);
      will-change: transform;
      backface-visibility: hidden;
    }
    .split-p.on .split-c { transform: translateY(0) rotateX(0deg); }
  `;
  document.head.appendChild(splitStyles);

  function buildSplit(el, byWords, stagger) {
    const raw = el.textContent.trim();
    el.innerHTML = '';
    el.classList.add('split-p');
    const tokens = byWords ? raw.split(/\s+/) : raw.split('');
    tokens.forEach((tok, i) => {
      const w = document.createElement('span');
      w.className = 'split-w';
      const c = document.createElement('span');
      c.className = 'split-c';
      c.style.transitionDelay = (i * stagger) + 's';
      c.textContent = tok === ' ' ? ' ' : tok;
      w.appendChild(c);
      el.appendChild(w);
      if (byWords && i < tokens.length - 1) el.appendChild(document.createTextNode(' '));
    });
  }

  document.querySelectorAll('[data-split="chars"]').forEach(el => buildSplit(el, false, 0.025));
  document.querySelectorAll('[data-split="words"]').forEach(el => buildSplit(el, true,  0.06));
  document.querySelectorAll('[data-split-words]').forEach(el  => buildSplit(el, true,  0.075));

  // Legacy [data-split] without value = chars
  document.querySelectorAll('[data-split]:not([data-split="chars"]):not([data-split="words"])').forEach(el => buildSplit(el, false, 0.025));

  /* ─────────────────────────────────────────────────────────────────
     9. INTERSECTION OBSERVER  (reveals)
  ───────────────────────────────────────────────────────────────── */
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('on');
      obs.unobserve(e.target);
    });
  }, { threshold: 0.07, rootMargin: '0px 0px -44px 0px' });

  document.querySelectorAll('.rv,.rv2,.rv3,.rv4,.rv-left,.rv-right,.rv-scale,.img-mask,[data-split],[data-split-words],.split-p')
    .forEach(el => obs.observe(el));

  /* ─────────────────────────────────────────────────────────────────
     10. CLIP-PATH REVEAL  (.rv-clip)
  ───────────────────────────────────────────────────────────────── */
  const clipStyles = document.createElement('style');
  clipStyles.textContent = `
    .rv-clip {
      clip-path: inset(0 0 100% 0);
      transition: clip-path 1.1s cubic-bezier(0.16,1,0.3,1);
      will-change: clip-path;
    }
    .rv-clip.on { clip-path: inset(0 0 0% 0); }
  `;
  document.head.appendChild(clipStyles);

  // Stagger siblings in same parent
  const clipMap = new Map();
  document.querySelectorAll('.rv-clip').forEach(el => {
    const p = el.parentElement;
    clipMap.has(p) ? clipMap.get(p).push(el) : clipMap.set(p, [el]);
  });
  clipMap.forEach(els => els.forEach((el, i) => { el.style.transitionDelay = (i * 0.12) + 's'; }));

  const clipObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('on'); clipObs.unobserve(e.target); } });
  }, { threshold: 0.06 });
  document.querySelectorAll('.rv-clip').forEach(el => clipObs.observe(el));

  /* ─────────────────────────────────────────────────────────────────
     11. ABOUT PARAGRAPHS — clip-path reveal per paragraph
  ───────────────────────────────────────────────────────────────── */
  const paraStyles = document.createElement('style');
  paraStyles.textContent = `
    .para-clip {
      clip-path: inset(0 0 100% 0) !important;
      opacity: 1 !important;
      transform: none !important;
      transition: clip-path 0.9s cubic-bezier(0.16,1,0.3,1) !important;
      will-change: clip-path;
    }
    .para-clip.on { clip-path: inset(0 0 0% 0) !important; }
  `;
  document.head.appendChild(paraStyles);

  const aboutParas = document.querySelectorAll('.about-txt p');
  aboutParas.forEach((p, i) => {
    p.classList.add('para-clip');
    p.style.transitionDelay = (i * 0.1) + 's';
    obs.observe(p);
  });

  /* ─────────────────────────────────────────────────────────────────
     12. COACHING STEPS STAGGER
  ───────────────────────────────────────────────────────────────── */
  const stepsObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.querySelectorAll('.c-step').forEach((step, i) => {
        step.style.opacity   = '0';
        step.style.transform = 'translateY(28px)';
        setTimeout(() => {
          step.style.transition = `opacity 0.6s ease, transform 0.65s ${EASE_OUT}`;
          step.style.opacity    = '1';
          step.style.transform  = 'translateY(0)';
        }, i * 150);
      });
      stepsObs.unobserve(e.target);
    });
  }, { threshold: 0.18 });
  document.querySelectorAll('.ct-steps').forEach(el => stepsObs.observe(el));

  /* ─────────────────────────────────────────────────────────────────
     13. HOVER CARD 3D  (desktop only)
  ───────────────────────────────────────────────────────────────── */
  if (IS_DESKTOP) {
    document.querySelectorAll('.physique-photo-wrap, .about-val, .ct-img-wrap, .pricing-card, .step-card, .daily-card').forEach(el => {
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left)  / r.width  - 0.5;
        const y = (e.clientY - r.top)   / r.height - 0.5;
        el.style.transform  = `perspective(800px) rotateY(${x * 12}deg) rotateX(${-y * 8}deg) translateZ(8px)`;
        el.style.transition = 'transform 0.08s ease';
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform  = 'perspective(800px) rotateY(0deg) rotateX(0deg) translateZ(0)';
        el.style.transition = `transform 0.65s ${EASE_OUT}`;
      });
    });
  }

  /* ─────────────────────────────────────────────────────────────────
     14. SCROLL-DRIVEN 3D ANIMATIONS  (continuous RAF)
  ───────────────────────────────────────────────────────────────── */
  const heroBgImg     = document.querySelector('.hero-bg-img');
  const heroContent   = document.querySelector('.hero-content');
  const heroStats     = document.querySelector('.hero-stats');
  const physPhotos    = document.querySelectorAll('.physique-photo-wrap');
  const aboutPhotosEl = document.querySelector('.about-photos');
  const ctImgWrap     = document.querySelector('.ct-img-wrap');
  const ctaBigEl      = document.querySelector('.cta-big');
  const stripTrack    = document.querySelector('.strip-track');

  // One-shot flags
  let aboutPhotosSettled = false;
  let ctaBigSettled      = false;
  let ctImgSettled       = false;
  const physSettled      = new Array(physPhotos.length).fill(false);

  // Strip velocity
  let stripSkew = 0;

  function mainRAF() {
    const sy  = scrollY();
    const wh  = window.innerHeight;
    const vel = sy - lastY;
    lastY     = sy;
    velocity  = velocity * 0.75 + vel * 0.25;

    /* ── Hero parallax multi-layer ── */
    if (heroBgImg) {
      const prog = Math.max(0, Math.min(sy / wh, 1));
      heroBgImg.style.transform = `translate3d(0,${sy * -0.14}px,0) scale(${1 + prog * 0.07})`;
      heroBgImg.style.willChange = 'transform';
    }
    if (heroContent) {
      const prog  = Math.max(0, Math.min(sy / wh, 1));
      const fade  = Math.max(0, 1 - prog * 2.8);
      heroContent.style.transform  = `translate3d(0,${sy * 0.055}px,0)`;
      heroContent.style.opacity    = fade;
      heroContent.style.willChange = 'transform,opacity';
    }
    if (heroStats) {
      heroStats.style.transform = `translate3d(0,${sy * -0.04}px,0)`;
    }

    /* ── About photos 3D entry ── */
    if (aboutPhotosEl && !aboutPhotosSettled) {
      const r    = aboutPhotosEl.getBoundingClientRect();
      const prog = Math.max(0, Math.min(1 - r.top / (wh * 0.8), 1));
      const p    = Math.min(prog / 0.7, 1);
      const rotY = 8 * (1 - p);
      const tx   = -40 * (1 - p);
      aboutPhotosEl.style.transform  = `perspective(1100px) rotateY(${rotY.toFixed(2)}deg) translateX(${tx.toFixed(2)}px)`;
      aboutPhotosEl.style.transition = 'none';
      aboutPhotosEl.style.willChange = 'transform';
      if (p >= 1) { aboutPhotosSettled = true; aboutPhotosEl.style.transform = ''; aboutPhotosEl.style.transition = `transform 0.8s ${EASE_OUT}`; }
    }

    /* ── Physique photos 3D perspective ── */
    physPhotos.forEach((el, i) => {
      if (physSettled[i]) return;
      const r    = el.getBoundingClientRect();
      const prog = Math.max(0, (wh - r.top) / (wh + r.height));
      if (prog < 0.12) return;
      const p    = Math.min((prog - 0.12) / 0.5, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      if (i === 1) {
        el.style.transform = `perspective(900px) scale(${0.8 + ease * 0.2})`;
      } else {
        const sign = i === 0 ? 1 : -1;
        const rotY = sign * 15 * (1 - ease);
        const tx   = sign * -60 * (1 - ease);
        el.style.transform = `perspective(900px) rotateY(${rotY.toFixed(1)}deg) translateX(${tx.toFixed(1)}px)`;
      }
      el.style.transition = 'none';
      el.style.willChange = 'transform';
      if (p >= 1) { physSettled[i] = true; el.style.transition = `transform 0.6s ${EASE_OUT}`; }
    });

    /* ── Strip velocity skew ── */
    if (stripTrack) {
      const target = Math.max(-5, Math.min(5, velocity * -0.12));
      stripSkew += (target - stripSkew) * 0.1;
      stripTrack.style.transform  = `skewX(${stripSkew.toFixed(2)}deg)`;
      stripTrack.style.willChange = 'transform';
    }

    /* ── CTA explosion ── */
    if (ctaBigEl && !ctaBigSettled) {
      const r    = ctaBigEl.getBoundingClientRect();
      const prog = Math.max(0, (wh - r.top) / (wh * 0.65));
      if (prog > 0) {
        const p    = Math.min(prog, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        ctaBigEl.style.transform  = `scale(${0.72 + ease * 0.28})`;
        ctaBigEl.style.filter     = `blur(${((1 - ease) * 8).toFixed(1)}px)`;
        ctaBigEl.style.opacity    = ease.toFixed(3);
        ctaBigEl.style.transition = 'none';
        ctaBigEl.style.willChange = 'transform,filter,opacity';
        if (p >= 1) { ctaBigSettled = true; ctaBigEl.style.cssText += ';transform:scale(1);filter:none;opacity:1;'; }
      }
    }

    /* ── Coaching image entrance ── */
    if (ctImgWrap && !ctImgSettled) {
      const r    = ctImgWrap.getBoundingClientRect();
      const prog = Math.max(0, (wh - r.top) / (wh * 0.75));
      if (prog > 0) {
        const p    = Math.min(prog, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        ctImgWrap.style.transform  = `scale(${0.9 + ease * 0.1}) rotate(${(2 - ease * 2).toFixed(2)}deg)`;
        ctImgWrap.style.transition = 'none';
        ctImgWrap.style.willChange = 'transform';
        if (p >= 1) { ctImgSettled = true; ctImgWrap.style.transform = ''; ctImgWrap.style.transition = `transform 0.5s ${EASE_OUT}`; }
      }
    }

    /* ── Keep progress + nav in sync during lerp ── */
    refreshScrollProgress();
    refreshNav();

    requestAnimationFrame(mainRAF);
  }
  requestAnimationFrame(mainRAF);

  /* ─────────────────────────────────────────────────────────────────
     15. PARALLAX  (non-hero data-parallax elements)
  ───────────────────────────────────────────────────────────────── */
  document.querySelectorAll('[data-parallax]:not(.hero-bg-img)').forEach(el => {
    window.addEventListener('scroll', () => {
      const speed = parseFloat(el.dataset.parallax) || 0.3;
      const r     = el.getBoundingClientRect();
      const off   = (r.top + r.height / 2 - window.innerHeight / 2);
      el.style.transform = `translate3d(0,${off * -speed * 0.1}px,0)`;
    }, { passive: true });
  });

  /* ─────────────────────────────────────────────────────────────────
     16. COUNTER ANIMATION
  ───────────────────────────────────────────────────────────────── */
  const cntObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el  = e.target;
      const max = +el.dataset.count;
      const sfx = el.dataset.suffix || '';
      const dur = 1400;
      const t0  = performance.now();
      (function tick(t) {
        const p = Math.min((t - t0) / dur, 1);
        el.textContent = Math.floor((1 - Math.pow(1 - p, 4)) * max) + sfx;
        if (p < 1) requestAnimationFrame(tick);
      })(t0);
      cntObs.unobserve(el);
    });
  }, { threshold: 0.4 });
  document.querySelectorAll('[data-count]').forEach(el => cntObs.observe(el));

  /* ─────────────────────────────────────────────────────────────────
     17. SCRAMBLE TEXT
  ───────────────────────────────────────────────────────────────── */
  const CHARS = '!@#$%^&*0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  document.querySelectorAll('[data-scramble]').forEach(el => {
    const orig = el.textContent;
    let timer;
    el.addEventListener('mouseenter', () => {
      let i = 0; clearInterval(timer);
      timer = setInterval(() => {
        el.textContent = orig.split('').map((c, idx) =>
          idx < i ? orig[idx] : (c === ' ' ? ' ' : CHARS[Math.floor(Math.random() * CHARS.length)])
        ).join('');
        if (i >= orig.length) { clearInterval(timer); el.textContent = orig; }
        i += 0.65;
      }, 28);
    });
  });

  /* ─────────────────────────────────────────────────────────────────
     18. FAQ ACCORDION
  ───────────────────────────────────────────────────────────────── */
  document.querySelectorAll('.faq-item').forEach(item => {
    item.querySelector('.faq-q')?.addEventListener('click', () => {
      const was = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!was) item.classList.add('on', 'open');
    });
  });

  /* ─────────────────────────────────────────────────────────────────
     19. HOVER IMAGE FOLLOW
  ───────────────────────────────────────────────────────────────── */
  document.querySelectorAll('[data-img-hover]').forEach(el => {
    const img = document.createElement('img');
    img.src = el.dataset.imgHover;
    img.style.cssText = [
      'position:fixed;pointer-events:none;z-index:9997',
      'width:260px;height:320px;object-fit:cover',
      'opacity:0;transform:translate(-50%,-62%) scale(0.78)',
      'transition:opacity 0.35s ease,transform 0.5s cubic-bezier(0.16,1,0.3,1)',
      'will-change:transform'
    ].join(';');
    document.body.appendChild(img);
    el.addEventListener('mouseenter', () => { img.style.opacity='1'; img.style.transform='translate(-50%,-62%) scale(1)'; });
    el.addEventListener('mousemove', e => { img.style.left=e.clientX+'px'; img.style.top=e.clientY+'px'; });
    el.addEventListener('mouseleave', () => { img.style.opacity='0'; img.style.transform='translate(-50%,-62%) scale(0.78)'; });
  });

  /* ─────────────────────────────────────────────────────────────────
     20. NAV HOVER LINES
  ───────────────────────────────────────────────────────────────── */
  document.querySelectorAll('.nav-link, .nav-links a').forEach(a => {
    if (a.querySelector('.nhl')) return;
    a.style.position = 'relative';
    const l = document.createElement('span');
    l.className = 'nhl';
    l.style.cssText = 'position:absolute;bottom:-3px;left:0;width:100%;height:1px;background:var(--red);transform:scaleX(0);transform-origin:right;transition:transform 0.4s cubic-bezier(0.16,1,0.3,1);pointer-events:none;';
    a.appendChild(l);
    a.addEventListener('mouseenter', () => { l.style.transformOrigin='left';  l.style.transform='scaleX(1)'; });
    a.addEventListener('mouseleave', () => { l.style.transformOrigin='right'; l.style.transform='scaleX(0)'; });
  });

  /* ─────────────────────────────────────────────────────────────────
     21. SECTION NUMBER REVEAL
  ───────────────────────────────────────────────────────────────── */
  document.querySelectorAll('[data-section-num]').forEach(el => {
    const num = document.createElement('span');
    num.textContent = el.dataset.sectionNum;
    num.style.cssText = [
      'position:absolute;font-family:"Bebas Neue"',
      'font-size:clamp(100px,16vw,200px)',
      'color:rgba(255,255,255,0.03);line-height:1',
      'pointer-events:none;user-select:none',
      'right:0;top:50%;transform:translateX(-24px) translateY(-50%)',
      `transition:opacity 1.2s ${EASE_OUT},transform 1.2s ${EASE_OUT}`,
      'opacity:0;z-index:0'
    ].join(';');
    el.style.position = el.style.position || 'relative';
    el.appendChild(num);
    new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      num.style.opacity   = '1';
      num.style.transform = 'translateX(0) translateY(-50%)';
    }, { threshold: 0.1 }).observe(el);
  });

})();
