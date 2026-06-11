(() => {
  const html = document.documentElement;
  const reducedMq = window.matchMedia('(prefers-reduced-motion: reduce)');
  const desktopMq = window.matchMedia('(min-width:901px)');
  const isTouch = window.matchMedia('(hover: none)').matches || 'ontouchstart' in window;

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  /* ---------- NAV ---------- */
  const nav = document.getElementById('nav');
  const burger = document.getElementById('burger');
  const navRight = document.getElementById('navRight');

  const onNavScroll = () => nav.classList.toggle('is-solid', window.scrollY > 40);
  document.addEventListener('scroll', onNavScroll, { passive: true });
  onNavScroll();

  burger.addEventListener('click', () => nav.classList.toggle('menu-open'));
  navRight.querySelectorAll('a, button').forEach(el => el.addEventListener('click', () => nav.classList.remove('menu-open')));

  /* ---------- HERO INTRO ---------- */
  const hero = document.querySelector('.hero');
  requestAnimationFrame(() => requestAnimationFrame(() => hero.classList.add('loaded')));

  /* ---------- COUNTERS ---------- */
  const animateCount = (el) => {
    const target = parseInt(el.dataset.count, 10);
    const dur = 1400;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  /* ---------- MAGNETIC BUTTONS ---------- */
  if (!isTouch) {
    document.querySelectorAll('.magnetic').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * 0.3;
        const y = (e.clientY - r.top - r.height / 2) * 0.3;
        btn.style.transform = `translate(${x}px, ${y}px)`;
      });
      btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    });
  }

  /* ============================================================
     SCÈNES — moteur de progression piloté par le scroll (desktop)
     ============================================================ */
  const stageWrap = document.getElementById('stageWrap');
  const layers = Array.from(document.querySelectorAll('.layer'));
  const ghosts = Array.from(document.querySelectorAll('.ghost'));
  const progressFill = document.getElementById('progressFill');
  const dots = Array.from(document.querySelectorAll('#sceneDots button'));
  const N = layers.length;
  const OVERLAP = 0.05;

  const DIRS = [
    { exit: { ty: -90, sc: 1.06 } },                  // 0 hero — pousse vers le haut + zoom
    { enter: { ty: 90 }, exit: { ty: -90 } },          // 1 constat — défilement vertical
    { enter: { sc: .92 }, exit: { sc: 1.08 } },        // 2 preuve — avant/arrière
    { enter: { tx: 140 }, exit: { tx: -140 } },        // 3 méthode — glissement latéral
    { enter: { ty: 90, sc: .96 }, exit: { ty: -90 } }, // 4 athlète — montée + zoom
    { enter: { sc: .85 } },                            // 5 final — apparition zoomée
  ];

  let stageActive = false;
  let athleteTriggered = false;

  function getProgress() {
    const total = stageWrap.offsetHeight - window.innerHeight;
    if (total <= 0) return 0;
    return clamp((window.scrollY - stageWrap.offsetTop) / total, 0, 1);
  }

  function updateScenes() {
    if (!stageActive) return;
    const p = getProgress();
    if (progressFill) progressFill.style.width = (p * 100).toFixed(2) + '%';

    let activeIdx = 0;
    layers.forEach((layer, i) => {
      const start = i / N, end = (i + 1) / N;
      const hasEnter = i > 0, hasExit = i < N - 1;
      const enterT = hasEnter ? clamp((p - (start - OVERLAP)) / OVERLAP, 0, 1) : 1;
      const exitT = hasExit ? clamp((p - (end - OVERLAP)) / OVERLAP, 0, 1) : 0;
      const op = enterT * (1 - exitT);
      const dir = DIRS[i] || {};
      const en = dir.enter || {}, ex = dir.exit || {};
      const ty = (1 - enterT) * (en.ty || 0) + exitT * (ex.ty || 0);
      const tx = (1 - enterT) * (en.tx || 0) + exitT * (ex.tx || 0);
      const sc = 1 + (1 - enterT) * ((en.sc || 1) - 1) + exitT * ((ex.sc || 1) - 1);

      layer.style.setProperty('--op', op.toFixed(4));
      layer.style.setProperty('--ty', ty.toFixed(2) + 'px');
      layer.style.setProperty('--tx', tx.toFixed(2) + 'px');
      layer.style.setProperty('--sc', sc.toFixed(4));
      const isActive = op > 0.5;
      layer.classList.toggle('is-active', isActive);
      if (isActive) activeIdx = i;

      const holdStart = start + (hasEnter ? OVERLAP : 0);
      const holdEnd = end - (hasExit ? OVERLAP : 0);
      const hp = clamp((p - holdStart) / Math.max(0.0001, holdEnd - holdStart), 0, 1);
      layer.style.setProperty('--hp', hp.toFixed(4));

      const ghost = ghosts[i];
      if (ghost) {
        ghost.style.setProperty('--op', op.toFixed(4));
        ghost.style.setProperty('--ty', ty.toFixed(2) + 'px');
        ghost.style.setProperty('--tx', tx.toFixed(2) + 'px');
      }

      if (i === 4 && op > 0.5 && !athleteTriggered) {
        athleteTriggered = true;
        layer.querySelectorAll('[data-count]').forEach(animateCount);
      }

      if (i === 2) {
        const idx = clamp(Math.floor(hp * 4), 0, 3);
        layer.querySelectorAll('.proof-years span').forEach((y, yi) => y.classList.toggle('active', yi === idx));
      }
      if (i === 3) {
        const idx = clamp(Math.floor(hp * 3), 0, 2);
        layer.querySelectorAll('.method-dots button').forEach((d, di) => d.classList.toggle('active', di === idx));
      }
    });

    dots.forEach((d, i) => d.classList.toggle('active', i === activeIdx));
  }

  let ticking = false;
  function onScroll() {
    if (stageActive && !ticking) {
      ticking = true;
      requestAnimationFrame(() => { updateScenes(); ticking = false; });
    }
  }
  document.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', () => { if (stageActive) updateScenes(); });

  function setStageMode(on) {
    if (on === stageActive) return;
    stageActive = on;
    html.classList.toggle('js-stage', on);
    if (on) {
      athleteTriggered = false;
      updateScenes();
    } else {
      layers.forEach(l => {
        ['--op', '--ty', '--tx', '--sc', '--hp'].forEach(p => l.style.removeProperty(p));
        l.classList.remove('is-active');
      });
      ghosts.forEach(g => ['--op', '--ty', '--tx'].forEach(p => g.style.removeProperty(p)));
      if (progressFill) progressFill.style.width = '0%';
    }
  }

  function evalMode() {
    setStageMode(desktopMq.matches && !isTouch && !reducedMq.matches);
  }
  evalMode();
  desktopMq.addEventListener('change', evalMode);
  reducedMq.addEventListener('change', evalMode);

  /* ---------- NAVIGATION VERS UNE SCÈNE ---------- */
  function scrollToScene(i) {
    if (stageActive) {
      const total = stageWrap.offsetHeight - window.innerHeight;
      const top = stageWrap.offsetTop + (i / N) * total + (i === 0 ? 0 : 2);
      window.scrollTo({ top: Math.max(0, top), behavior: reducedMq.matches ? 'auto' : 'smooth' });
    } else {
      const layer = layers[i];
      if (layer) layer.scrollIntoView({ behavior: reducedMq.matches ? 'auto' : 'smooth', block: 'start' });
    }
  }
  document.querySelectorAll('[data-scene]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      scrollToScene(parseInt(el.dataset.scene, 10));
    });
  });
  dots.forEach(d => d.addEventListener('click', () => scrollToScene(parseInt(d.dataset.i, 10))));

  /* ============================================================
     MODE EMPILÉ — mobile / tactile / mouvement réduit
     ============================================================ */

  // Reveals au scroll
  const revealEls = document.querySelectorAll('.rv');
  if (reducedMq.matches) {
    revealEls.forEach(el => el.classList.add('in'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(el => io.observe(el));
  }

  // Compteurs (déclenchés au scroll quand le mode scènes est inactif)
  const counters = document.querySelectorAll('[data-count]');
  if (reducedMq.matches) {
    counters.forEach(el => el.textContent = el.dataset.count);
  } else {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !stageActive) {
          animateCount(entry.target);
          cio.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach(el => cio.observe(el));
  }

  // Galerie preuve : molette → scroll horizontal + année active
  const filmstrip = document.querySelector('.filmstrip');
  const proofYears = document.querySelectorAll('#proofYears span');
  const frames = document.querySelectorAll('.filmstrip .frame');

  if (filmstrip && !isTouch) {
    filmstrip.addEventListener('wheel', (e) => {
      if (stageActive) return;
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      const max = filmstrip.scrollWidth - filmstrip.clientWidth;
      if (max <= 0) return;
      e.preventDefault();
      filmstrip.scrollLeft += e.deltaY;
    }, { passive: false });
  }

  if (frames.length && proofYears.length) {
    const setActive = (year) => {
      proofYears.forEach(y => y.classList.toggle('active', y.dataset.year === year));
    };
    const yio = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !stageActive) setActive(entry.target.dataset.year);
      });
    }, { root: filmstrip, threshold: 0.6 });
    frames.forEach(f => yio.observe(f));

    proofYears.forEach(y => {
      y.addEventListener('click', () => {
        if (stageActive) return;
        const frame = document.querySelector(`.filmstrip .frame[data-year="${y.dataset.year}"]`);
        if (frame) frame.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
      });
      y.style.cursor = 'pointer';
    });
  }
})();
