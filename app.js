(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(hover: none)').matches || 'ontouchstart' in window;

  /* ---------- NAV ---------- */
  const nav = document.getElementById('nav');
  const burger = document.getElementById('burger');
  const navRight = document.getElementById('navRight');

  const onScroll = () => {
    nav.classList.toggle('is-solid', window.scrollY > 40);
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  burger.addEventListener('click', () => nav.classList.toggle('menu-open'));
  navRight.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('menu-open')));

  /* ---------- HERO INTRO ---------- */
  const hero = document.querySelector('.hero');
  requestAnimationFrame(() => requestAnimationFrame(() => hero.classList.add('loaded')));

  /* ---------- SCROLL REVEALS ---------- */
  const revealEls = document.querySelectorAll('.rv');
  if (reduced) {
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

  /* ---------- COUNTERS ---------- */
  const counters = document.querySelectorAll('[data-count]');
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
  if (counters.length) {
    if (reduced) {
      counters.forEach(el => el.textContent = el.dataset.count);
    } else {
      const cio = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            cio.unobserve(entry.target);
          }
        });
      }, { threshold: 0.6 });
      counters.forEach(el => cio.observe(el));
    }
  }

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

  /* ---------- PROOF GALLERY ---------- */
  const proofTrack = document.getElementById('proofTrack');
  const proofYears = document.querySelectorAll('#proofYears span');
  const proofCards = document.querySelectorAll('.proof-card');

  if (proofTrack && !isTouch) {
    proofTrack.addEventListener('wheel', (e) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      const max = proofTrack.scrollWidth - proofTrack.clientWidth;
      if (max <= 0) return;
      e.preventDefault();
      proofTrack.scrollLeft += e.deltaY;
    }, { passive: false });
  }

  if (proofCards.length && proofYears.length) {
    const setActive = (year) => {
      proofYears.forEach(y => y.classList.toggle('active', y.dataset.year === year));
    };
    const yio = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) setActive(entry.target.dataset.year);
      });
    }, { root: proofTrack, threshold: 0.6 });
    proofCards.forEach(c => yio.observe(c));

    proofYears.forEach(y => {
      y.addEventListener('click', () => {
        const card = document.querySelector(`.proof-card[data-year="${y.dataset.year}"]`);
        if (card) card.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
      });
      y.style.cursor = 'pointer';
    });
  }
})();
