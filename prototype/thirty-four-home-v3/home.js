/* ZT homepage v3 · everything after the approved hero.
   Menu · films · marque columns that open in place · the house · inventory · ownership · showrooms · enquire.
   The 34° line is used where it starts or ends something; the rooms in between move on their own terms.
   Every section is complete without script and with reduced motion. */

(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const root = document.documentElement;
  const hasGSAP = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
  const motion = hasGSAP && !root.classList.contains('rm');
  const mobile = window.matchMedia('(max-width: 900px)').matches;
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const M = Math.tan(34 * Math.PI / 180);
  const lenis = () => window.ztLenis;
  const goTo = (y, opts) => (lenis() ? lenis().scrollTo(y, opts) : window.scrollTo({ top: typeof y === 'number' ? y : y.getBoundingClientRect().top + window.scrollY, behavior: motion ? 'smooth' : 'auto' }));
  if (motion) gsap.registerPlugin(ScrollTrigger);

  /* =========================== mega menu =========================== */
  const nav = $('#nav'), mega = $('#mega'), veil = $('.mega-veil'), toggle = $('.nav__toggle');
  const navLinks = $$('.nav__links a'), megaGroups = $$('.mega [data-group]');
  let open = false, closeT;
  function setHot(key) {
    navLinks.forEach(a => a.classList.toggle('is-hot', !!key && a === key));
    megaGroups.forEach(c => c.classList.toggle('is-hot', !!key && c.dataset.group === key.dataset.menu));
  }
  function setOpen(v, link) {
    clearTimeout(closeT);
    if (v) setHot(link || null);
    if (v === open) return;
    open = v;
    mega.classList.toggle('is-open', v); veil.classList.toggle('is-open', v); nav.classList.toggle('is-open', v);
    toggle.setAttribute('aria-expanded', String(v));
    $('.nav__toggle-label').textContent = v ? 'Close' : 'Menu';
    mega.inert = !v;
    if (v) { mega.scrollTop = 0; lenis() && lenis().stop(); } else { setHot(null); if (!worldOpen) lenis() && lenis().start(); }
  }
  mega.inert = true;
  toggle.addEventListener('click', () => { setOpen(!open); if (open) { const f = $('a', mega); f && f.focus({ preventScroll: true }); } });
  if (fine) {
    navLinks.forEach(a => a.addEventListener('mouseenter', () => setOpen(true, a)));
    const leave = () => { closeT = setTimeout(() => setOpen(false), 240); };
    [nav, mega].forEach(el => { el.addEventListener('mouseleave', leave); el.addEventListener('mouseenter', () => clearTimeout(closeT)); });
  }
  veil.addEventListener('click', () => setOpen(false));
  mega.addEventListener('click', e => { if (e.target.closest('a')) setOpen(false); });

  /* in-page links: the page runs on Lenis and one pinned scene, so targets are resolved here */
  const stageEnd = () => {
    const st = hasGSAP && ScrollTrigger.getAll().find(t => t.trigger === $('#stage') && t.pin);
    return st ? st.end : $('#marques');            // phones and static pages: the bands are in normal flow
  };
  const targetOf = hash => (hash === '#marques' ? stageEnd() : hash === '#top' ? 0 : $(hash));
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a || a.dataset.open) return;
    const t = targetOf(a.getAttribute('href'));
    if (t === null || t === undefined) return;
    e.preventDefault();
    if (a.dataset.filter) applyFilter(a.dataset.filter);
    setTimeout(() => goTo(t, { duration: 1.2 }), 60);   // after the menu has released the scroll
  });

  /* =========================== films ===========================
     Three films on the page. Only the hero's is fetched up front; the others get a source when they come near
     the viewport. A film plays only while it is on screen. Phones and reduced motion show the poster frame
     until the visitor presses play. */
  const films = {};
  let worldOpen = false;
  $$('video[data-film]').forEach(v => { films[v.dataset.film] = { el: v, wanted: motion && !mobile, inView: false }; });
  let syncFilm = function (name) {
    const f = films[name]; if (!f) return;
    const play = f.wanted && f.inView && !document.hidden && !worldOpen;
    if (play) {
      if (f.el.dataset.src && !f.el.getAttribute('src')) f.el.src = f.el.dataset.src;
      const p = f.el.play(); if (p && p.catch) p.catch(() => {});
    } else f.el.pause();
    $$(`[data-film-toggle="${name}"]`).forEach(b => { b.setAttribute('aria-pressed', String(!f.wanted)); $('span', b).textContent = f.wanted ? 'Pause film' : 'Play film'; });
  };
  const syncAll = () => Object.keys(films).forEach(syncFilm);
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(en => { const f = films[en.target.dataset.film]; f.inView = en.isIntersecting; syncFilm(en.target.dataset.film); }), { rootMargin: '160px 0px' });
    Object.values(films).forEach(f => io.observe(f.el));
  }
  $$('[data-film-toggle]').forEach(b => b.addEventListener('click', e => { e.stopPropagation(); const f = films[b.dataset.filmToggle]; f.wanted = !f.wanted; if (f.wanted) f.inView = true; syncFilm(b.dataset.filmToggle); }));
  document.addEventListener('visibilitychange', syncAll);
  syncAll();

  /* hero: each marque brings its own footage into the bar. A marque film is fetched the first time its mark is
     chosen and shown once it is actually playing; until then, and for marques without film, the still holds.
     Only one film plays at a time: choosing a marque pauses the Collection film. */
  const marqueFilms = {};
  $$('video[data-marque-film]').forEach(v => {
    marqueFilms[v.dataset.marqueFilm] = v;
    v.addEventListener('playing', () => v.classList.add('is-playing'));
  });
  let heroKey = 'collection';
  const heroAllowed = () => !root.classList.contains('rm') && (mobile || films.hero.wanted) && films.hero.inView && !document.hidden;
  function syncHero() {
    const mf = marqueFilms[heroKey];
    Object.entries(marqueFilms).forEach(([k, v]) => { if (k !== heroKey) { v.pause(); v.classList.remove('is-playing'); } });
    if (mf && heroAllowed()) {
      if (!mf.getAttribute('src')) mf.src = mf.dataset.src;
      const pr = mf.play(); if (pr && pr.catch) pr.catch(() => {});
    } else if (mf) mf.pause();
    const hero = films.hero.el;
    if (heroKey === 'collection' && films.hero.wanted && films.hero.inView && !document.hidden) { const pr = hero.play(); if (pr && pr.catch) pr.catch(() => {}); }
    else hero.pause();
  }
  document.addEventListener('zt:marque', e => { heroKey = e.detail.key; syncHero(); });
  const syncFilmBase = syncFilm;
  syncFilm = name => { syncFilmBase(name); if (name === 'hero') syncHero(); };

  // whichever film is in the bar, reduced to a 64×36 field of light, sits behind the word
  const amb = $('.hero__ambient');
  if (amb && films.hero && motion && !mobile) {
    const ctx = amb.getContext('2d'); let n = 0;
    gsap.ticker.add(() => {
      if (n++ % 3) return;
      const v = marqueFilms[heroKey] && marqueFilms[heroKey].classList.contains('is-playing') ? marqueFilms[heroKey] : films.hero.el;
      if (v.paused || v.readyState < 2) return;
      try { ctx.drawImage(v, 0, 0, 64, 36); amb.classList.add('is-on'); } catch (err) { /* frame not ready */ }
    });
  }

  /* =========================== 2 · marque columns open in place ===========================
     No overlay and no second interface: the column itself widens until it is the scene. The other four fold
     to spines at its side and stay one click away. While the columns travel their edges lean, then stand
     upright again. On phones the 34° band grows taller instead. Scrolling is never locked. */
  const monolith = $('.monolith'), cols = $$('.col', monolith), closeAll = $('.monolith__close');
  const LEAN = 0.5;                                              // how far the edges lean while travelling
  let openKey = null, mBusy = false;
  const colOf = key => cols.find(c => c.dataset.col === key);
  const lines = col => $$('.col__open h3 > span, .col__place > span', col);
  const flat = 'polygon(0px 0px, 100% 0px, 100% 100%, 0px 100%)';
  if (mobile) cols.forEach(c => { c._base = c.offsetHeight - monolith.clientWidth * M; });   // the band's own height, before anything opens

  function settle(key) {                                         // final state, written without motion
    cols.forEach(c => {
      const on = c.dataset.col === key;
      c.classList.toggle('is-open', on); c.classList.toggle('is-spine', !!key && !on);
      $('.col__hit', c).setAttribute('aria-expanded', String(on));
      $('.sr-only', $('.col__hit', c)).textContent = c.querySelector('.col__name').textContent + (on ? ': close' : ': open');
    });
    monolith.classList.toggle('is-open', !!key);
    closeAll.hidden = !key || mobile;
    openKey = key;
  }

  function travel(key, instant) {
    const from = openKey;
    if (mBusy || key === from) return;
    if (!motion || instant) {
      settle(key);
      if (motion) cols.forEach(c => { gsap.set(c, mobile ? { clearProps: '--band' } : { flexGrow: key ? (c.dataset.col === key ? 14 : 0) : 1 }); gsap.set($('.col__body', c), { y: 0 }); gsap.set(lines(c), { yPercent: 0 }); gsap.set($('.col__acts', c), { autoAlpha: 1, y: 0 }); if (!key) gsap.set(c, { clearProps: 'flexGrow' }); });
      if (!motion || !mobile) cols.forEach(c => { const img = $('img', c); img.style.objectPosition = c.dataset.col === key ? c.dataset.posOpen : ''; });
      if (hasGSAP) ScrollTrigger.refresh();
      return;
    }
    mBusy = true;
    monolith.classList.add('is-busy');
    const next = key && colOf(key), prev = from && colOf(from);
    const tl = gsap.timeline({ defaults: { ease: 'expo.inOut' }, onComplete: () => { monolith.classList.remove('is-busy'); mBusy = false; if (!key && !mobile) gsap.set(cols, { clearProps: 'flexGrow' }); if (mobile) ScrollTrigger.refresh(); } });

    // the text of the column being left goes first
    if (prev) {
      tl.to(lines(prev), { yPercent: 110, duration: 0.45, ease: 'power3.in', stagger: 0.03 }, 0)
        .to($('.col__acts', prev), { autoAlpha: 0, y: 10, duration: 0.3, ease: 'power2.in' }, 0)
        .to($('.col__body', prev), { y: 0, duration: 0.9 }, 0.1);
    }
    settle(key);                                                 // classes first, so the open block can be measured
    const t0 = prev ? 0.3 : 0;

    if (mobile) {
      // phones: the band keeps its 34° cuts and grows taller
      cols.forEach(c => {
        const on = c === next, base = c._base;
        const target = on ? base + $('.col__open', c).offsetHeight + 28 : base;
        tl.to(c, { '--band': target + 'px', duration: 1.0 }, t0);
      });
    } else {
      // desktop: the columns trade width; their edges lean while they travel and stand up again
      const lean = { p: 0 };
      tl.to(cols, { flexGrow: i => (key ? (cols[i] === next ? 14 : 0) : 1), duration: 1.25 }, t0)
        .to(lean, { p: 1, duration: 1.25, ease: 'none', onUpdate: () => {
          const k = Math.sin(Math.PI * lean.p);
          cols.forEach(c => { const sk = Math.min(c.offsetWidth * LEAN, 120) * k; c.style.clipPath = sk < 0.5 ? flat : `polygon(${sk}px 0px, 100% 0px, calc(100% - ${sk}px) 100%, 0px 100%)`; });
        } }, t0);
      cols.forEach(c => tl.to($('img', c), { objectPosition: c === next ? c.dataset.posOpen : c.dataset.pos, duration: 1.25 }, t0));
    }
    if (next) {
      const bodyEl = $('.col__body', next), y0 = +gsap.getProperty(bodyEl, 'y') || 0;
      const lift = Math.max(0, bodyEl.getBoundingClientRect().bottom - y0 - $('.col__open', next).getBoundingClientRect().top + (mobile ? 16 : 28));
      tl.fromTo($('img', next), { scale: 1.1 }, { scale: 1, duration: 1.8, ease: 'expo.out' }, t0 + 0.1)
        .to($('.col__body', next), { y: -lift, duration: 1.1 }, t0 + 0.1)
        .fromTo(lines(next), { yPercent: 110 }, { yPercent: 0, duration: 1.0, ease: 'expo.out', stagger: 0.07 }, t0 + 0.6)
        .fromTo($('.col__acts', next), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'expo.out' }, t0 + 0.85);
    }
  }

  cols.forEach(c => $('.col__hit', c).addEventListener('click', () => travel(openKey === c.dataset.col ? null : c.dataset.col)));
  closeAll.addEventListener('click', () => { travel(null); const h = openKey && $('.col__hit', colOf(openKey)); h && h.focus({ preventScroll: true }); });
  document.addEventListener('zt:monolith', e => { if (!e.detail.live && openKey) travel(null, true); });   // scrolled back into the hero
  if (motion && !mobile) ScrollTrigger.create({ trigger: '#house', start: 'top top', onEnter: () => openKey && travel(null, true) });
  // menu marks: travel to the columns, then open the one that was asked for
  document.addEventListener('click', e => {
    const opener = e.target.closest('[data-open]');
    if (!opener) return;
    e.preventDefault();
    const key = opener.dataset.open;
    setTimeout(() => goTo(mobile || !motion ? colOf(key) : stageEnd(), { duration: 1.2, offset: mobile ? -60 : 0 }), 60);
    setTimeout(() => travel(key), motion ? 1500 : 100);
  }, true);
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (open) { setOpen(false); toggle.focus(); } else if (openKey) travel(null);
  });

  /* =========================== 4 · inventory =========================== */
  const listing = $('.listing');
  const rows = $$('.row', listing), shots = $$('.shot', listing), win = $('.window', listing);
  const creditEl = $('[data-shot-credit]', listing), countEl = $('[data-count]', listing);
  const CREDITS = ['Ferrari S.p.A.', 'Koenigsegg', 'McLaren Automotive', 'Rolls-Royce Motor Cars · editorial use', 'Czinger Vehicles', 'Ferrari S.p.A.', 'Rolls-Royce Motor Cars · editorial use', 'Koenigsegg · photo Keno Zache'];
  let current = 0, busy = false, queued = null;

  function setShot(i) {
    if (i === current) return;
    rows.forEach((r, k) => r.classList.toggle('is-active', k === i));
    creditEl.textContent = 'Image: ' + CREDITS[i];
    if (!motion) { shots.forEach((s, k) => s.classList.toggle('is-active', k === i)); current = i; return; }
    if (busy) { queued = i; return; }
    busy = true;
    const prev = shots[current], next = shots[i];
    current = i;
    next.classList.add('is-entering');
    gsap.timeline({
      onComplete: () => {
        prev.classList.remove('is-active');
        next.classList.add('is-active'); next.classList.remove('is-entering');
        busy = false;
        const q = queued; queued = null;
        if (q !== null && q !== current) setShot(q);
      }
    })
      .fromTo(next, { '--w': '-16%' }, { '--w': '110%', duration: 0.85, ease: 'power3.inOut' }, 0)
      .fromTo(next, { scale: 1.1 }, { scale: 1, duration: 1.4, ease: 'expo.out' }, 0);
  }
  rows.forEach((r, k) => {
    if (fine) r.addEventListener('mouseenter', () => setShot(k));
    r.addEventListener('focus', () => setShot(k));
  });

  function applyFilter(key) {
    let shown = 0, firstShown = -1;
    rows.forEach((r, k) => {
      const li = r.parentElement, on = key === 'all' || li.dataset.marque === key;
      li.hidden = !on;
      if (on) { shown++; if (firstShown < 0) firstShown = k; }
    });
    $$('.filter__btn').forEach(b => { const on = b.dataset.filter === key; b.classList.toggle('is-active', on); b.setAttribute('aria-pressed', String(on)); });
    countEl.textContent = shown;
    if (rows[current].parentElement.hidden && firstShown >= 0) setShot(firstShown);
    if (motion) {
      gsap.fromTo(rows.filter(r => !r.parentElement.hidden), { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7, stagger: 0.04, ease: 'expo.out', clearProps: 'transform,opacity,visibility', overwrite: true });
      ScrollTrigger.refresh();
    }
  }
  $$('.filter__btn').forEach(b => b.addEventListener('click', () => applyFilter(b.dataset.filter)));

  if (motion && !mobile) {
    gsap.timeline({ scrollTrigger: { trigger: listing, start: 'top 72%', once: true } })
      .from(win, { clipPath: 'polygon(0% 76.4%, 0% 76.4%, 40% 100%, 40% 100%, 0% 76.4%)', duration: 1.4, ease: 'expo.inOut', clearProps: 'clipPath' }, 0)
      .from('.window__shots', { scale: 1.18, duration: 2, ease: 'expo.out' }, 0.3)
      .from('.row', { y: 60, autoAlpha: 0, duration: 1.1, stagger: 0.05, ease: 'expo.out', clearProps: 'transform,opacity,visibility' }, 0.3);
    gsap.to('.window__shots', { x: 36, y: -36 * M, ease: 'none', scrollTrigger: { trigger: listing, start: 'top bottom', end: 'bottom top', scrub: true } });
  }
  // touch and phones: the row nearest the reading line is the active one
  if (hasGSAP && (mobile || !fine)) {
    rows.forEach((r, k) => ScrollTrigger.create({ trigger: r, start: 'top 68%', end: 'bottom 68%', onToggle: self => self.isActive && setShot(k) }));
  }

  /* =========================== the house: history, one year at a time =========================== */
  {
    const past = $('.past'), tabs = $$('.past__nav button', past), events = $$('.past__event', past);
    past.classList.add('is-enhanced');
    const show = i => {
      tabs.forEach((t, k) => { t.classList.toggle('is-active', k === i); t.setAttribute('aria-pressed', String(k === i)); });
      events.forEach((ev, k) => ev.classList.toggle('is-active', k === i));
      if (motion) gsap.fromTo(events[i], { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out', clearProps: 'all' });
    };
    tabs.forEach((t, i) => { t.addEventListener('click', () => show(i)); if (fine) t.addEventListener('mouseenter', () => show(i)); t.addEventListener('focus', () => show(i)); });
  }

  /* =========================== beyond the showroom: the filmstrip ===========================
     The strip is a native sideways scroller (touch, trackpad, keyboard) that can also be dragged with a mouse.
     Its tiles are in the markup. If data-feed is given an endpoint, the same shape is fetched and drawn instead;
     that endpoint must be a server the dealership controls, so no Instagram token ever reaches the page. */
  {
    const strip = $('.reelstrip'), track = $('.reelstrip__track', strip);
    const feed = strip.dataset.feed;
    if (feed) fetch(feed).then(r => r.json()).then(d => {
      const esc = t => String(t).replace(/[&<>"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
      track.innerHTML = d.posts.map(p => `<li class="post post--${esc(p.shape)}" data-y="${+p.y || 0}"><a class="post__link" href="${esc(p.url)}" rel="noopener"><span class="post__media"><img src="${esc(p.img)}" alt="${esc(p.alt)}" loading="lazy">${p.kind === 'reel' ? '<span class="post__kind">Reel</span>' : ''}</span><span class="post__cap"><b>${esc(p.handle)}</b><span>${esc(p.cap)}</span></span></a></li>`).join('');
    }).catch(() => { /* the curated tiles stay */ });
    // drag with a mouse; a drag never becomes a click
    let down = false, x0 = 0, s0 = 0, moved = 0;
    strip.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') return; down = true; moved = 0; x0 = e.clientX; s0 = strip.scrollLeft; });
    window.addEventListener('pointermove', e => { if (!down) return; const dx = e.clientX - x0; moved = Math.max(moved, Math.abs(dx)); if (moved > 6) strip.classList.add('is-dragging'); strip.scrollLeft = s0 - dx; });
    window.addEventListener('pointerup', () => { down = false; setTimeout(() => strip.classList.remove('is-dragging'), 0); });
    strip.addEventListener('click', e => { if (moved > 6) { e.preventDefault(); e.stopPropagation(); } }, true);
    strip.addEventListener('dragstart', e => e.preventDefault());
    // the one reel that moves plays while the pointer rests on it
    $$('.post video', strip).forEach(v => {
      const tile = v.closest('.post');
      v.addEventListener('playing', () => v.classList.add('is-playing'));
      if (fine && motion) {
        tile.addEventListener('mouseenter', () => { if (!v.getAttribute('src')) v.src = v.dataset.src; const pr = v.play(); if (pr && pr.catch) pr.catch(() => {}); });
        tile.addEventListener('mouseleave', () => { v.pause(); v.classList.remove('is-playing'); });
      }
    });
    if (motion) {
      gsap.from('.beyond__head .ln > span', { yPercent: 104, duration: 1.3, stagger: 0.12, ease: 'expo.out', scrollTrigger: { trigger: '.beyond__head', start: 'top 82%', once: true } });
      // the strip arrives already travelling: a short drift tied to the page scroll, then it is the visitor's
      if (!mobile) gsap.fromTo(track, { x: () => innerWidth * 0.14 }, { x: 0, ease: 'none', scrollTrigger: { trigger: strip, start: 'top bottom', end: 'top 30%', scrub: 0.6 } });
    }
  }

  /* =========================== showrooms: two doors =========================== */
  const doors = $$('[data-door]');
  function openDoor(d) {
    if (d.classList.contains('is-open')) return;
    doors.forEach(x => { const on = x === d; x.classList.toggle('is-open', on); $('.doorway__title', x).setAttribute('aria-expanded', String(on)); });
    if (mobile && hasGSAP) setTimeout(() => ScrollTrigger.refresh(), 950);
  }
  doors.forEach(d => {
    $('.doorway__title', d).addEventListener('click', () => openDoor(d));
    d.addEventListener('click', e => { if (!e.target.closest('a, button')) openDoor(d); });
    if (fine) d.addEventListener('mouseenter', () => openDoor(d));
    d.addEventListener('focusin', () => openDoor(d));
  });

  /* =========================== scroll-led motion — each room has its own =========================== */
  const splitChars = el => { el.setAttribute('aria-label', el.textContent); el.innerHTML = [...el.textContent].map(c => `<span class="ch" aria-hidden="true"><span>${c === ' ' ? '&nbsp;' : c}</span></span>`).join(''); return $$('.ch > span', el); };
  if (motion) {
    // photographs open upward out of their own frame — once
    $$('[data-reveal]').forEach(f => {
      const box = $('.clipbox', f), img = $('img', f);
      gsap.timeline({ scrollTrigger: { trigger: f, start: 'top 84%', once: true } })
        .fromTo(box, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.3, ease: 'expo.inOut', clearProps: 'clipPath' }, 0)
        .fromTo(img, { scale: 1.2 }, { scale: f.classList.contains('skyline') ? 1.08 : 1, duration: 1.9, ease: 'expo.out' }, 0.1);
    });

    // the house: calm. Lines of type rise out of their own baselines; the building opens from its left edge
    // and drifts a few pixels inside its frame.
    gsap.from('.house__head .ln > span', { yPercent: 104, duration: 1.3, stagger: 0.12, ease: 'expo.out', scrollTrigger: { trigger: '.house__head', start: 'top 82%', once: true } });
    const photo = $('.house__photo .clipbox'), pimg = $('img', photo);
    gsap.fromTo(photo, { clipPath: 'inset(0% 100% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.6, ease: 'expo.inOut', clearProps: 'clipPath', scrollTrigger: { trigger: photo, start: 'top 86%', once: true } });
    gsap.fromTo(pimg, { yPercent: -3.5 }, { yPercent: 3.5, ease: 'none', scrollTrigger: { trigger: photo, start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.from('.sum .ln > span', { yPercent: 104, duration: 1.2, stagger: 0.1, ease: 'expo.out', scrollTrigger: { trigger: '.sum', start: 'top 86%', once: true } });

    // ownership: the film opens sideways from a slit
    const slit = $('.slit');
    gsap.fromTo(slit, { '--cut': '44%' }, { '--cut': '0%', ease: 'power2.out', scrollTrigger: { trigger: '.craft', start: 'top 80%', end: mobile ? 'top 30%' : 'top 12%', scrub: 0.6 } });

    // buy, sell, trade: the three verbs are set, letter by letter
    $$('.verb h3').forEach((h, i) => gsap.from(splitChars(h), { yPercent: 108, duration: 1.1, stagger: 0.04, delay: mobile ? 0 : i * 0.12, ease: 'expo.out', scrollTrigger: { trigger: mobile ? h : '.deal__cols', start: 'top 82%', once: true } }));

    // interlude: the bars arrive from alternating ends, the way the monogram is drawn; then the ivory faces of
    // the outer two are drawn off along the bar and the word turns from ink to light. Scrubbed, never pinned.
    {
      const creed = $('.creed'), strips = $$('.cbar__strip', creed), faces = $$('.cbar__face', creed);
      gsap.timeline({ scrollTrigger: { trigger: creed, start: 'top 88%', end: mobile ? 'top 20%' : 'top 4%', scrub: 1 } })
        .fromTo(strips[0], { xPercent: -170 }, { xPercent: 0, ease: 'power3.out', duration: 1 }, 0)
        .fromTo(strips[1], { xPercent: 210 }, { xPercent: 0, ease: 'power3.out', duration: 1 }, 0.14)
        .fromTo(strips[2], { xPercent: -150 }, { xPercent: 0, ease: 'power3.out', duration: 1 }, 0.28)
        .fromTo($$('.cbar__media > img, .cbar__media > video', creed), { scale: 1.2 }, { scale: 1, ease: 'none', duration: 1.28 }, 0);
      gsap.timeline({ scrollTrigger: { trigger: creed, start: mobile ? 'top 30%' : 'top 22%', end: mobile ? 'top -30%' : 'top -34%', scrub: 0.8 } })
        .fromTo(faces[0], { '--wipe': '0%' }, { '--wipe': '100%', ease: 'power2.inOut', duration: 1 }, 0)
        .fromTo(faces[1], { '--wipe': '0%' }, { '--wipe': '100%', ease: 'power2.inOut', duration: 1 }, 0.18);
    }

    // showrooms: the two doors widen from an inset block to the full width
    gsap.from(splitChars($('.rooms__head h2')), { yPercent: 108, duration: 1.2, stagger: 0.035, ease: 'expo.out', scrollTrigger: { trigger: '.rooms__head', start: 'top 80%', once: true } });
    if (!mobile) {
      gsap.fromTo('.doors', { clipPath: 'inset(16% 9% 0% 9%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', scrollTrigger: { trigger: '.doors', start: 'top 96%', end: 'top 34%', scrub: 0.5 } });
      gsap.fromTo('.skyline img', { yPercent: -4 }, { yPercent: 4, ease: 'none', scrollTrigger: { trigger: '.skyline', start: 'top bottom', end: 'bottom top', scrub: true } });
    }

    // enquire: the ground turns to paper along the 34° line
    const door = $('#door'), ground = $('.door__ground');
    let rise = door.clientWidth * M;
    const paint = p => { const a = rise * (1 - p); ground.style.setProperty('--a', a + 'px'); ground.style.setProperty('--b', (a - rise) + 'px'); };
    paint(0);
    ScrollTrigger.create({
      trigger: door, start: 'top bottom', end: 'top 12%', scrub: true,
      onRefreshInit: () => { rise = door.clientWidth * M; },
      onUpdate: self => paint(self.progress), onRefresh: self => paint(self.progress)
    });
    const word = $('[data-enquire]');
    word.setAttribute('aria-hidden', 'true');
    word.innerHTML = [...word.textContent].map(c => `<span class="ch"><span>${c}</span></span>`).join('');
    gsap.timeline({ scrollTrigger: { trigger: '.enquire', start: 'top 62%', once: true } })
      .from('.enquire__frame', { scaleX: 0, duration: 1.3, ease: 'expo.inOut', clearProps: 'transform' }, 0)
      .from('.enquire__word .ch > span', { yPercent: 108, duration: 1.1, stagger: 0.04, ease: 'expo.out' }, 0.45);
  }

  /* =========================== nav: leaves on the way down, returns on the way up ===========================
     Plain scroll logic, so it also holds with reduced motion. Over a paper ground it inverts. */
  {
    const first = $('#house'), lights = $$('[data-ground="light"]');
    let lastY = window.scrollY, ticking = false;
    const update = () => {
      ticking = false;
      const y = window.scrollY, down = y > lastY + 2, up = y < lastY - 2;
      const past = first.getBoundingClientRect().top < window.innerHeight * 0.55;
      if (!past) nav.classList.remove('is-away');
      else if (down && !open) nav.classList.add('is-away');
      else if (up) nav.classList.remove('is-away');
      const line = 48;
      nav.classList.toggle('is-diff', lights.some(el => { const r = el.getBoundingClientRect(); return r.top < line && r.bottom > line; }));
      lastY = y;
    };
    window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();
  }

  /* fonts and late images change measurements */
  if (motion) {
    const refresh = () => ScrollTrigger.refresh();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(refresh);
    window.addEventListener('load', refresh);
  }
})();
