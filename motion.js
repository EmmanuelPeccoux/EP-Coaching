/* ═══════════════════════════════════════════
   EP COACHING — MOTION ENGINE
   ═══════════════════════════════════════════ */

(function() {
  'use strict';

  // ── PRELOADER ──
  window.addEventListener('load', () => {
    setTimeout(() => {
      const pl = document.getElementById('preloader');
      if (pl) pl.classList.add('gone');
      document.body.style.overflow = '';
    }, 1900);
  });
  document.body.style.overflow = 'hidden';

  // ── SCROLL PROGRESS ──
  const sp = document.getElementById('sp');
  if (sp) {
    window.addEventListener('scroll', () => {
      const s = document.documentElement.scrollTop;
      const h = document.documentElement.scrollHeight - window.innerHeight;
      sp.style.transform = `scaleX(${s/h})`;
    }, { passive: true });
  }

  // ── NAV SCROLLED ──
  const nav = document.getElementById('nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
  }

  // ── CURSOR ──
  const isMobile = window.innerWidth <= 1100 || 'ontouchstart' in window;
  if (!isMobile) {
    const dot = document.getElementById('cursor');
    const ring = document.getElementById('cring');
    const label = document.getElementById('cursorLabel');
    let mx = 0, my = 0, rx = 0, ry = 0, dx = 0, dy = 0;

    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
    });

    function raf() {
      dx += (mx - dx) * 0.4;
      dy += (my - dy) * 0.4;
      rx += (mx - rx) * 0.14;
      ry += (my - ry) * 0.14;
      if (dot) dot.style.transform = `translate(${dx}px,${dy}px) translate(-50%,-50%)`;
      if (ring) ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
      requestAnimationFrame(raf);
    }
    raf();

    document.querySelectorAll('a, button, .magnetic').forEach(el => {
      el.addEventListener('mouseenter', () => {
        if (dot) dot.classList.add('hovered');
        if (ring) ring.classList.add('hovered');
        const cl = el.dataset.cursor;
        if (cl && label) label.textContent = cl;
        else if (label) label.textContent = '';
      });
      el.addEventListener('mouseleave', () => {
        if (dot) dot.classList.remove('hovered');
        if (ring) ring.classList.remove('hovered');
      });
    });

    // ── MAGNETIC BUTTONS ──
    document.querySelectorAll('.magnetic').forEach(el => {
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - (r.left + r.width / 2);
        const y = e.clientY - (r.top + r.height / 2);
        el.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
        const inner = el.querySelector('.btn-inner, .magnetic-inner');
        if (inner) inner.style.transform = `translate(${x * 0.15}px, ${y * 0.2}px)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = '';
        const inner = el.querySelector('.btn-inner, .magnetic-inner');
        if (inner) inner.style.transform = '';
      });
    });
  }

  // ── BURGER ──
  const burger = document.getElementById('burger');
  const mm = document.getElementById('mobileMenu');
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

  // ── SPLIT TEXT ──
  document.querySelectorAll('[data-split]').forEach(el => {
    const text = el.textContent.trim();
    el.innerHTML = '';
    text.split('').forEach((char, i) => {
      const span = document.createElement('span');
      span.className = 'split';
      const inner = document.createElement('span');
      inner.className = 'split-char';
      inner.style.transitionDelay = (i * 0.03) + 's';
      inner.textContent = char === ' ' ? '\u00A0' : char;
      span.appendChild(inner);
      el.appendChild(span);
    });
  });

  // Words split
  document.querySelectorAll('[data-split-words]').forEach(el => {
    const words = el.textContent.trim().split(' ');
    el.innerHTML = '';
    words.forEach((w, i) => {
      const span = document.createElement('span');
      span.className = 'split';
      const inner = document.createElement('span');
      inner.className = 'split-char';
      inner.style.transitionDelay = (i * 0.08) + 's';
      inner.textContent = w + ' ';
      span.appendChild(inner);
      el.appendChild(span);
    });
  });

  // ── INTERSECTION OBSERVER ──
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('on');
        // Reveal split text inside
        e.target.querySelectorAll('.split').forEach(s => s.classList.add('on'));
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.rv, .rv2, .rv3, .rv4, .rv-left, .rv-right, .rv-scale, .img-mask, [data-split], [data-split-words]')
    .forEach(el => obs.observe(el));

  // ── PARALLAX ──
  const parallaxEls = document.querySelectorAll('[data-parallax]');
  if (parallaxEls.length) {
    function updateParallax() {
      const sc = window.scrollY;
      parallaxEls.forEach(el => {
        const speed = parseFloat(el.dataset.parallax) || 0.3;
        const r = el.getBoundingClientRect();
        const center = r.top + r.height / 2;
        const fromCenter = center - window.innerHeight / 2;
        el.style.transform = `translate3d(0, ${fromCenter * -speed * 0.1}px, 0)`;
      });
    }
    window.addEventListener('scroll', updateParallax, { passive: true });
    updateParallax();
  }

  // ── COUNTER ──
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const co = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = +el.dataset.count;
      const suffix = el.dataset.suffix || '';
      let cur = 0;
      const dur = 1400;
      const start = performance.now();
      function step(t) {
        const p = Math.min((t - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 4);
        cur = Math.floor(eased * target);
        el.textContent = cur + suffix;
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
      co.unobserve(el);
    }), { threshold: 0.4 });
    counters.forEach(c => co.observe(c));
  }

  // ── SCRAMBLE TEXT ──
  document.querySelectorAll('[data-scramble]').forEach(el => {
    const original = el.textContent;
    const chars = '!@#$%^&*()_+-=ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let timer;
    el.addEventListener('mouseenter', () => {
      let i = 0;
      clearInterval(timer);
      timer = setInterval(() => {
        el.textContent = original.split('').map((c, idx) => {
          if (idx < i) return original[idx];
          return c === ' ' ? ' ' : chars[Math.floor(Math.random() * chars.length)];
        }).join('');
        if (i >= original.length) { clearInterval(timer); el.textContent = original; }
        i += 0.7;
      }, 30);
    });
  });

  // ── FAQ ──
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    if (q) q.addEventListener('click', () => {
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('on', 'open');
    });
  });

  // ── HOVER IMAGE FOLLOW ──
  document.querySelectorAll('[data-img-hover]').forEach(el => {
    const imgSrc = el.dataset.imgHover;
    const img = document.createElement('img');
    img.src = imgSrc;
    img.style.cssText = `
      position: fixed; pointer-events: none; z-index: 9997;
      width: 260px; height: 320px; object-fit: cover;
      opacity: 0; transform: translate(-50%, -50%) scale(0.7);
      transition: opacity 0.4s, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
      will-change: transform;
    `;
    document.body.appendChild(img);
    el.addEventListener('mouseenter', () => {
      img.style.opacity = '1';
      img.style.transform = 'translate(-50%, -50%) scale(1)';
    });
    el.addEventListener('mousemove', e => {
      img.style.left = e.clientX + 'px';
      img.style.top = e.clientY + 'px';
    });
    el.addEventListener('mouseleave', () => {
      img.style.opacity = '0';
      img.style.transform = 'translate(-50%, -50%) scale(0.7)';
    });
  });


  // ── CLIP-PATH REVEAL ──
  (function() {
    const style = document.createElement('style');
    style.textContent = `
      .rv-clip {
        clip-path: inset(0 100% 0 0);
        transition: clip-path 0.9s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .rv-clip.on {
        clip-path: inset(0 0% 0 0);
      }
    `;
    document.head.appendChild(style);

    const clips = document.querySelectorAll('.rv-clip');
    // Group by parent for stagger
    const parents = new Map();
    clips.forEach(el => {
      const p = el.parentElement;
      if (!parents.has(p)) parents.set(p, []);
      parents.get(p).push(el);
    });
    parents.forEach(els => {
      els.forEach((el, i) => {
        el.style.transitionDelay = (i * 0.12) + 's';
      });
    });

    const clipObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('on');
          clipObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
    clips.forEach(el => clipObs.observe(el));
  })();

  // ── SPLIT TEXT: data-split="words" support + will-change ──
  document.querySelectorAll('[data-split="words"]').forEach(el => {
    const words = el.textContent.trim().split(' ');
    el.innerHTML = '';
    words.forEach((w, i) => {
      const span = document.createElement('span');
      span.className = 'split';
      const inner = document.createElement('span');
      inner.className = 'split-char';
      inner.style.transitionDelay = (i * 0.08) + 's';
      inner.style.willChange = 'transform';
      inner.textContent = w + (i < words.length - 1 ? ' ' : '');
      span.appendChild(inner);
      el.appendChild(span);
    });
    obs.observe(el);
  });

  // ── SMOOTH SCROLL WHEEL LERP (desktop) ──
  if (window.innerWidth > 1100) {
    let currentY = window.scrollY;
    let targetY = window.scrollY;
    let lerpRunning = false;

    window.addEventListener('wheel', e => {
      e.preventDefault();
      targetY = Math.max(0, Math.min(
        targetY + e.deltaY,
        document.documentElement.scrollHeight - window.innerHeight
      ));
      if (!lerpRunning) {
        lerpRunning = true;
        lerpScroll();
      }
    }, { passive: false });

    function lerpScroll() {
      const diff = targetY - currentY;
      if (Math.abs(diff) < 0.5) {
        currentY = targetY;
        window.scrollTo(0, currentY);
        lerpRunning = false;
        return;
      }
      currentY += diff * 0.085;
      window.scrollTo(0, currentY);
      requestAnimationFrame(lerpScroll);
    }
  }

  // ── HOVER LINE NAV (pure JS) ──
  (function() {
    const style = document.createElement('style');
    style.textContent = `
      .nav-line {
        position: absolute; bottom: -3px; left: 0;
        width: 100%; height: 1px;
        background: var(--red);
        transform: scaleX(0); transform-origin: right;
        transition: transform 0.35s cubic-bezier(0.16,1,0.3,1);
        pointer-events: none;
      }
    `;
    document.head.appendChild(style);

    document.querySelectorAll('.nav-links a, .nav-link').forEach(a => {
      if (a.querySelector('.nav-line')) return;
      a.style.position = 'relative';
      const line = document.createElement('span');
      line.className = 'nav-line';
      a.appendChild(line);
      a.addEventListener('mouseenter', () => {
        line.style.transformOrigin = 'left';
        line.style.transform = 'scaleX(1)';
      });
      a.addEventListener('mouseleave', () => {
        line.style.transformOrigin = 'right';
        line.style.transform = 'scaleX(0)';
      });
    });
  })();

  // ── SECTION NUMBER REVEAL ──
  document.querySelectorAll('[data-section-num]').forEach(el => {
    const num = document.createElement('span');
    num.textContent = el.dataset.sectionNum;
    num.style.cssText = `
      position: absolute; font-family: 'Bebas Neue';
      font-size: clamp(120px, 18vw, 220px); font-weight: 400;
      color: rgba(255,255,255,0.04); line-height: 1;
      pointer-events: none; user-select: none;
      right: 0; top: 50%; transform: translateX(-20px) translateY(-50%);
      transition: opacity 1.2s cubic-bezier(0.16,1,0.3,1), transform 1.2s cubic-bezier(0.16,1,0.3,1);
      opacity: 0;
      z-index: 0;
    `;
    el.style.position = el.style.position || 'relative';
    el.appendChild(num);

    const numObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          num.style.opacity = '1';
          num.style.transform = 'translateX(0) translateY(-50%)';
          numObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
    numObs.observe(el);
  });

})();

