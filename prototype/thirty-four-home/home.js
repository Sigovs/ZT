/* ZT homepage · everything after the approved hero and monolith.
   Menu · inventory discovery · the line-up · ownership · the door.
   Every motion runs along the 34° line of the monogram; every section is complete without it. */

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
  const navLinks = $$('.nav__links a'), megaCols = $$('.mega [data-group]');
  let open = false, closeT;
  function setHot(key) {
    navLinks.forEach(a => a.classList.toggle('is-hot', !!key && a.dataset.menu === key));
    megaCols.forEach(c => c.classList.toggle('is-hot', !!key && c.dataset.group.split(' ').includes(key)));
  }
  function setOpen(v, key) {
    clearTimeout(closeT);
    if (v) setHot(key || null);
    if (v === open) return;
    open = v;
    mega.classList.toggle('is-open', v); veil.classList.toggle('is-open', v); nav.classList.toggle('is-open', v);
    toggle.setAttribute('aria-expanded', String(v));
    $('.nav__toggle-label').textContent = v ? 'Close' : 'Menu';
    if (v) { mega.scrollTop = 0; lenis() && lenis().stop(); } else { setHot(null); lenis() && lenis().start(); }
  }
  mega.inert = true;
  const syncInert = () => { mega.inert = !open; };
  toggle.addEventListener('click', () => { setOpen(!open); syncInert(); if (open) { const f = $('a', mega); f && f.focus({ preventScroll: true }); } });
  if (fine) {
    navLinks.forEach(a => a.addEventListener('mouseenter', () => { setOpen(true, a.dataset.menu); syncInert(); }));
    const leave = () => { closeT = setTimeout(() => { setOpen(false); syncInert(); }, 220); };
    [nav, mega].forEach(el => { el.addEventListener('mouseleave', leave); el.addEventListener('mouseenter', () => clearTimeout(closeT)); });
  }
  veil.addEventListener('click', () => { setOpen(false); syncInert(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && open) { setOpen(false); syncInert(); toggle.focus(); } });
  mega.addEventListener('click', e => { if (e.target.closest('a')) { setOpen(false); syncInert(); } });

  /* in-page links: the page is driven by Lenis and two pinned scenes, so targets are resolved here */
  const stageEnd = () => {
    const st = hasGSAP && ScrollTrigger.getAll().find(t => t.trigger === $('#stage') && t.pin);
    return st ? st.end : $('#marques');            // phones and static pages: the bands are in normal flow
  };
  const targetOf = hash => (hash === '#marques' ? stageEnd() : hash === '#top' ? 0 : $(hash));
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a || a.dataset.frame !== undefined) return;
    const t = targetOf(a.getAttribute('href'));
    if (t === null || t === undefined) return;
    e.preventDefault();
    if (a.dataset.filter) applyFilter(a.dataset.filter);
    setTimeout(() => goTo(t, { duration: 1.2 }), 60);   // after the menu has released the scroll
  });

  /* =========================== 3 · inventory =========================== */
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

  if (motion) {
    if (!mobile) {
      gsap.timeline({ scrollTrigger: { trigger: listing, start: 'top 72%', once: true } })
        .from(win, { clipPath: 'polygon(0% 76.4%, 0% 76.4%, 40% 100%, 40% 100%, 0% 76.4%)', duration: 1.4, ease: 'expo.inOut', clearProps: 'clipPath' }, 0)
        .from('.window__shots', { scale: 1.18, duration: 2, ease: 'expo.out' }, 0.3)
        .from('.listing__head > *, .filter', { y: 30, autoAlpha: 0, duration: 1, stagger: 0.08, ease: 'expo.out', clearProps: 'all' }, 0.2)
        .from('.row', { y: 60, autoAlpha: 0, duration: 1.1, stagger: 0.05, ease: 'expo.out', clearProps: 'transform,opacity,visibility' }, 0.3)
        .from('.more, .window__credit', { autoAlpha: 0, duration: 0.8, clearProps: 'all' }, 0.8);
      // the photograph drifts along the 34° axis while the index scrolls past
      gsap.to('.window__shots', { x: 36, y: -36 * M, ease: 'none', scrollTrigger: { trigger: listing, start: 'top bottom', end: 'bottom top', scrub: true } });
    }
  }
  // touch and phones: the row nearest the reading line is the active one
  if (hasGSAP && (mobile || !fine)) {
    rows.forEach((r, k) => ScrollTrigger.create({ trigger: r, start: 'top 68%', end: 'bottom 68%', onToggle: self => self.isActive && setShot(k) }));
  }

  /* =========================== 4 · the line-up =========================== */
  const lineup = $('.lineup'), strip = $('.strip'), frames = $$('.frame', lineup);
  const jumps = $$('[data-jump]', lineup);
  const nowMarque = $('[data-now-marque]'), nowModel = $('[data-now-model]'), nowN = $('[data-now-n]'), nowCredit = $('[data-now-credit]');
  const n = frames.length;
  let active = -1, lineST = null, nowTween = null;

  function setNow(i, instant) {
    if (i === active) return;
    active = i;
    const f = frames[i];
    frames.forEach((x, k) => x.classList.toggle('is-active', k === i));
    let j = 0; jumps.forEach((b, k) => { if (+b.dataset.jump <= i) j = k; });
    jumps.forEach((b, k) => b.classList.toggle('is-active', k === j));
    const write = () => {
      nowMarque.textContent = f.dataset.marque; nowModel.textContent = f.dataset.model;
      nowN.textContent = String(i + 1).padStart(2, '0'); nowCredit.textContent = 'Image: ' + f.dataset.credit;
    };
    if (!motion || instant) { write(); return; }
    nowTween && nowTween.kill();
    nowTween = gsap.timeline()
      .to(nowModel, { yPercent: -105, duration: 0.28, ease: 'power3.in' })
      .add(write)
      .fromTo(nowModel, { yPercent: 105 }, { yPercent: 0, duration: 0.7, ease: 'expo.out' });
  }

  function jumpToFrame(i) {
    if (lineST) { goTo(lineST.start + (i / (n - 1)) * (lineST.end - lineST.start) + 2, { duration: 1.4 }); return; }
    goTo(lineup, { offset: -60 });
    strip.scrollTo({ left: frames[i].offsetLeft - parseFloat(getComputedStyle(strip).paddingLeft), behavior: motion ? 'smooth' : 'auto' });
  }
  jumps.forEach(b => b.addEventListener('click', () => jumpToFrame(+b.dataset.jump)));
  $$('a[data-frame]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); setTimeout(() => jumpToFrame(+a.dataset.frame), 30); }));

  if (motion && !mobile) {
    lineup.classList.remove('is-rail');                       // the markup ships as a native rail
    const G = { X0: 0, Y0: 0, D: 0 };
    const state = { p: 0 };
    const layout = () => {
      const W = lineup.clientWidth, H = lineup.clientHeight;
      const fw = frames[0].offsetWidth, fh = frames[0].offsetHeight;
      const step = frames[1].offsetLeft - frames[0].offsetLeft;
      G.X0 = W * 0.4;
      G.Y0 = H * 0.5 - fh / 2 + (W / 2 - fw / 2 - G.X0) * M;   // the frame crossing the centre sits on the centre line
      G.D = (n - 1) * step;
    };
    const draw = () => {
      gsap.set(strip, { x: G.X0 - state.p * G.D, y: G.Y0 + state.p * G.D * M });
      setNow(Math.round(state.p * (n - 1)));
    };
    layout(); draw();
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: lineup, start: 'top top', end: () => '+=' + Math.round(G.D * 0.52),
        pin: true, scrub: 0.8, anticipatePin: 1, invalidateOnRefresh: true,
        onRefreshInit: layout, onRefresh: draw
      }
    });
    tl.to(state, { p: 1, duration: 1, ease: 'none', onUpdate: draw });
    lineST = tl.scrollTrigger;
    // keyboard: a focused frame is brought to the centre line
    frames.forEach((f, k) => $('a', f).addEventListener('focus', () => { if (k !== active) jumpToFrame(k); }));
    gsap.from('.lineup__head > *', { y: 30, autoAlpha: 0, duration: 1, stagger: 0.08, ease: 'expo.out', clearProps: 'all', scrollTrigger: { trigger: lineup, start: 'top 70%', once: true } });
  } else {
    lineup.classList.add('is-rail');
    setNow(0, true);
    let raf;
    strip.addEventListener('scroll', () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const x = strip.scrollLeft + strip.clientWidth * 0.3;
        let k = 0; frames.forEach((f, i) => { if (f.offsetLeft <= x) k = i; });
        setNow(k, true);
      });
    }, { passive: true });
  }

  /* =========================== 5 · ownership: the three bars =========================== */
  const creed = $('.creed');
  if (motion) {
    const strips = $$('.cbar__strip', creed);
    const tl = gsap.timeline({ scrollTrigger: { trigger: creed, start: 'top 88%', end: mobile ? 'top 20%' : 'top 2%', scrub: 1 } });
    // the bars arrive from alternating ends, the way the monogram is drawn
    tl.fromTo(strips[0], { xPercent: -170 }, { xPercent: 0, ease: 'power3.out', duration: 1 }, 0)
      .fromTo(strips[1], { xPercent: 210 }, { xPercent: 0, ease: 'power3.out', duration: 1 }, 0.14)
      .fromTo(strips[2], { xPercent: -150 }, { xPercent: 0, ease: 'power3.out', duration: 1 }, 0.28)
      .fromTo('.cbar__strip--photo img', { scale: 1.25 }, { scale: 1, ease: 'none', duration: 1.28 }, 0);
    gsap.from('.creed__facts > div, .creed__credit', { y: 24, autoAlpha: 0, duration: 0.9, stagger: 0.08, ease: 'expo.out', clearProps: 'all', scrollTrigger: { trigger: creed, start: mobile ? 'top 35%' : 'top 30%', once: true } });
  }

  /* =========================== 6–7 · the door =========================== */
  const door = $('#door'), ground = $('.door__ground');
  if (motion) {
    let rise = door.clientWidth * M;
    const paint = p => { const a = rise * (1 - p); ground.style.setProperty('--a', a + 'px'); ground.style.setProperty('--b', (a - rise) + 'px'); };
    paint(0);
    ScrollTrigger.create({
      trigger: door, start: 'top bottom', end: 'top 12%', scrub: true,
      onRefreshInit: () => { rise = door.clientWidth * M; },
      onUpdate: self => paint(self.progress), onRefresh: self => paint(self.progress)
    });
    gsap.from('.houses li', { y: 40, autoAlpha: 0, duration: 1, stagger: 0.07, ease: 'expo.out', clearProps: 'all', scrollTrigger: { trigger: '.houses', start: 'top 82%', once: true } });
    gsap.from('.group dl', { y: 30, autoAlpha: 0, duration: 1, stagger: 0.08, ease: 'expo.out', clearProps: 'all', scrollTrigger: { trigger: '.group', start: 'top 85%', once: true } });

    const word = $('[data-enquire]');
    word.setAttribute('aria-hidden', 'true');
    word.innerHTML = [...word.textContent].map(c => `<span class="ch"><span>${c}</span></span>`).join('');
    gsap.timeline({ scrollTrigger: { trigger: '.enquire', start: 'top 72%', once: true } })
      .from('.enquire__frame', { scaleX: 0, duration: 1.3, ease: 'expo.inOut', clearProps: 'transform' }, 0)
      .from('.enquire__word .ch > span', { yPercent: 108, duration: 1.1, stagger: 0.04, ease: 'expo.out' }, 0.45)
      .from('.enquire__facts > div', { y: 24, autoAlpha: 0, duration: 0.9, stagger: 0.07, ease: 'expo.out', clearProps: 'all' }, 0.7);
  } else if (hasGSAP === false || root.classList.contains('rm')) {
    // static page: the nav scrolls away with the hero (home.css), nothing else to do
  }

  /* =========================== nav: leaves on the way down, returns on the way up ===========================
     Plain scroll logic, so it also holds with reduced motion. While it is visible over the ivory bars or the
     ivory ground it inverts against whatever passes beneath it. */
  {
    const collection = $('#collection');
    let lastY = window.scrollY, ticking = false;
    const update = () => {
      ticking = false;
      const y = window.scrollY, down = y > lastY + 2, up = y < lastY - 2;
      const past = collection.getBoundingClientRect().top < window.innerHeight * 0.55;
      if (!past) nav.classList.remove('is-away');
      else if (down && !open) nav.classList.add('is-away');
      else if (up) nav.classList.remove('is-away');
      const line = 48;
      const over = el => { const r = el.getBoundingClientRect(); return r.top < line && r.bottom > line; };
      nav.classList.toggle('is-diff', over(creed) || over(door));
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
