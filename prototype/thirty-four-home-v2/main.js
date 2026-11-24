/* ZT — "Thirty-Four Degrees" · motion and interaction (homepage v2: the default plate is a film; the readout names the showroom)
   One geometry drives everything: a band at 34° (the angle of the ZT monogram's bars).
   1. Entrance: a hairline is drawn along the band's axis, then opens into the bar.
   2. Marque index: each marque wipes its photograph in along the bar's own axis;
      the monumental word re-sets to the model.
   3. Scroll: the bar slides out along its axis; the monolith columns waiting
      beneath it rise, flatten their 34° cut and become the second screen.      */

(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGSAP = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  const M = Math.tan(34 * Math.PI / 180);           // slope of the ZT bars
  const stage = $('#stage');
  const heroEl = $('.hero');
  // phones get their own composition: the bar crosses the screen, the columns become stacked bands (home.css)
  const mqMobile = window.matchMedia('(max-width: 900px)');
  const mobile = mqMobile.matches;
  const bar = $('.bar');
  const plates = $('.bar__plates');
  const hairline = $('.hairline');
  const wordEl = $('[data-display]');
  const cols = $$('.col');
  const monolith = $('.monolith');
  const items = $$('.index__item');
  const modelEl = $('[data-readout-model]');
  const creditEl = $('[data-readout-credit]');
  const metaEl = $('[data-readout-meta]');
  const HOME = { model: modelEl.textContent, meta: metaEl.textContent, credit: creditEl.textContent };

  /* ---------- geometry ---------- */
  const G = { W: 0, H: 0, cx: 0, cy: 0, T: 0, gap: 0 };
  function measure() {
    G.W = heroEl.clientWidth; G.H = heroEl.clientHeight;
    if (mobile) { G.cx = G.W * 0.5; G.cy = G.H * 0.39; G.T = G.H * 0.31; G.gap = 14; return; }
    G.cx = G.W * 0.60;  G.cy = G.H * 0.56;
    G.T = G.H * 0.48;   G.gap = Math.max(18, G.H * 0.026);
  }
  // band state: t = thickness, s = slide along the band axis (px), o = opening of the hairline
  const band = { t: 0, s: 0 };
  function drawBar() {
    const k = 1 / Math.sqrt(1 + M * M);
    const dx = band.s * k, dy = -band.s * M * k;
    const cx = G.cx + dx, cy = G.cy + dy;
    const c = x => cy - M * (x - cx);
    const x0 = -60, x1 = G.W + 60, h = band.t / 2;
    bar.style.clipPath =
      `polygon(${x0}px ${c(x0) - h}px, ${x1}px ${c(x1) - h}px, ${x1}px ${c(x1) + h}px, ${x0}px ${c(x0) + h}px)`;
    // the photograph moves a little less than the band → depth along the same axis
    plates.style.transform = `translate3d(${dx * 0.55}px, ${dy * 0.55}px, 0)`;
  }
  function placeHairline() {
    const xStart = -40, yStart = G.cy - M * (xStart - G.cx);
    hairline.style.left = `${xStart}px`; hairline.style.top = `${yStart}px`;
    hairline.style.transform = `rotate(-34deg) scaleX(var(--hx, 0))`;
  }

  /* columns: their tops follow the bar's lower edge, then flatten */
  const colState = { p: 0, intro: 0 };
  const ease = hasGSAP ? window.gsap.parseEase('power3.inOut') : (x => x);
  function drawCols() {
    if (mobile) return;                                        // bands are static CSS shapes on phones
    const n = cols.length;
    cols.forEach((col, i) => {
      const x0 = col.offsetLeft, x1 = x0 + col.offsetWidth;
      const lower = x => G.cy + G.T / 2 - M * (x - G.cx) + G.gap;
      const delay = (n - 1 - i) * 0.09;                        // right-hand columns lead, like the diagonal
      const local = Math.min(Math.max((colState.p - delay) / (1 - 0.36), 0), 1);
      const e = ease(local);
      const push = colState.intro * G.H;
      const a = Math.max(0, (lower(x0) + push) * (1 - e));
      const b = Math.max(0, (lower(x1) + push) * (1 - e));
      col.style.clipPath = `polygon(0 ${a}px, 100% ${b}px, 100% 100%, 0 100%)`;
    });
  }

  /* ---------- the monumental word ---------- */
  function splitWord(text) {
    wordEl.innerHTML = '';
    [...text].forEach(ch => {
      const o = document.createElement('span'); o.className = 'ch';
      const i = document.createElement('span'); i.textContent = ch;
      o.appendChild(i); wordEl.appendChild(o);
    });
    return $$('.ch > span', wordEl);
  }

  /* ---------- reduced motion / no GSAP: a designed static page ---------- */
  if (reduce || !hasGSAP) {
    document.documentElement.classList.add('rm');
    measure(); band.t = G.T; drawBar();
    if (!mobile) cols.forEach(c => (c.style.clipPath = 'none'));
    items.forEach(btn => btn.addEventListener('click', () => {
      items.forEach(b => b.classList.toggle('is-active', b === btn));
      $$('.plate').forEach(p => p.classList.toggle('is-active', p.dataset.plate === btn.dataset.key));
      wordEl.textContent = btn.dataset.word; modelEl.textContent = btn.dataset.model; metaEl.textContent = btn.dataset.meta; creditEl.textContent = btn.dataset.credit;
    }));
    window.addEventListener('resize', () => { measure(); drawBar(); });
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  // the entrance is a designed opening — always start the experience at the top
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);

  /* ---------- Lenis on GSAP's ticker ---------- */
  const lenis = new Lenis({ autoRaf: false, anchors: true, lerp: 0.085 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(t => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  window.ztLenis = lenis;                                      // home.js: menu lock, jumps

  measure(); placeHairline(); drawBar();
  let chars = splitWord(wordEl.textContent);
  colState.intro = 1; drawCols();

  /* ---------- 1 · entrance ---------- */
  gsap.set(chars, { yPercent: 108 });
  gsap.set('[data-intro="fade"]', { autoAlpha: 0 });
  gsap.set('[data-intro="rise"]', { autoAlpha: 0, y: 28 });
  gsap.set('.plate.is-active > *', { scale: 1.28 });

  const intro = gsap.timeline({ defaults: { ease: 'expo.out' }, delay: 0.25 });
  intro
    .set(hairline, { opacity: 1 })
    .to(hairline, { '--hx': 1, duration: 1.1, ease: 'power3.inOut' })
    .to(band, { t: G.T, duration: 1.5, onUpdate: drawBar }, '-=0.1')
    .to(hairline, { opacity: 0, duration: 0.4 }, '<0.2')
    .to('.plate.is-active > *', { scale: 1, duration: 2.2 }, '<-0.2')
    .to(chars, { yPercent: 0, duration: 1.2, stagger: 0.045 }, '<0.35')
    .to(colState, { intro: 0, duration: 1.4, ease: 'power4.out', onUpdate: drawCols }, '<0.4')
    .to('[data-intro="rise"]', { autoAlpha: 1, y: 0, duration: 1.0 }, '<0.1')
    .to('[data-intro="fade"]', { autoAlpha: 1, duration: 1.0 }, '<0.1');

  /* ---------- 2 · marque index ---------- */
  let current = 'collection', busy = false, queued = null;
  function setMarque(btn) {
    const key = btn ? btn.dataset.key : 'collection';
    if (key === current) return;
    if (busy) { queued = btn; return; }
    busy = true;
    items.forEach(b => b.classList.toggle('is-active', b === btn));
    const next = $(`.plate[data-plate="${key}"]`);
    const prev = $(`.plate[data-plate="${current}"]`);
    current = key;

    const tl = gsap.timeline({
      onComplete: () => {
        prev.classList.remove('is-active');
        next.classList.add('is-active'); next.classList.remove('is-entering');
        busy = false;
        if (queued) { const q = queued; queued = null; setMarque(q); }
      }
    });
    // photograph: wipe in along the band's axis (mask gradient at 56° = perpendicular to the 34° bars)
    next.classList.add('is-entering');
    tl.fromTo(next, { '--w': '-16%' }, { '--w': '110%', duration: 1.05, ease: 'power3.inOut' }, 0)
      .fromTo(next.firstElementChild, { scale: 1.12, xPercent: -3 }, { scale: 1, xPercent: 0, duration: 1.6, ease: 'expo.out' }, 0);
    // word: out upward, in from below
    tl.to(chars, { yPercent: -108, duration: 0.42, stagger: 0.02, ease: 'power3.in' }, 0)
      .add(() => { chars = splitWord(btn ? btn.dataset.word : 'Collection'); gsap.set(chars, { yPercent: 108 }); }, 0.5)
      .add(() => gsap.to(chars, { yPercent: 0, duration: 0.9, stagger: 0.035, ease: 'expo.out' }), 0.52);
    // readout
    tl.to('.readout', { autoAlpha: 0, y: -8, duration: 0.25 }, 0)
      .add(() => {
        modelEl.textContent = btn ? btn.dataset.model : HOME.model;
        metaEl.textContent = btn ? btn.dataset.meta : HOME.meta;
        creditEl.textContent = btn ? btn.dataset.credit : HOME.credit;
      }, 0.3)
      .to('.readout', { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 0.55);
  }
  items.forEach(btn => {
    btn.addEventListener('mouseenter', () => setMarque(btn));
    btn.addEventListener('focus', () => setMarque(btn));
    btn.addEventListener('click', () => setMarque(btn));
  });
  // v2: leaving the index returns the bar to the film
  let homeT;
  const indexEl = $('.index');
  indexEl.addEventListener('mouseleave', () => { homeT = setTimeout(() => { if (!indexEl.contains(document.activeElement)) setMarque(null); }, 900); });
  indexEl.addEventListener('mouseenter', () => clearTimeout(homeT));

  /* ---------- 3 · scroll: the bar leaves along its axis, the monolith rises ---------- */
  if (mobile) {
    // no pin on phones: the bar leaves along its axis as the hero scrolls away
    gsap.timeline({ scrollTrigger: { trigger: heroEl, start: 'top top', end: 'bottom top', scrub: 1, invalidateOnRefresh: true } })
      .to(band, { s: () => G.W * 1.7, duration: 1, ease: 'power1.in', onUpdate: drawBar }, 0)
      .to('.display', { yPercent: -30, autoAlpha: 0, duration: 0.7, ease: 'power1.in' }, 0);
    monolith.classList.add('is-live');
  } else {
    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: stage, start: 'top top', end: () => '+=' + Math.round(G.H * 1.5),
        pin: true, scrub: 1, anticipatePin: 1, invalidateOnRefresh: true,
        onUpdate: self => monolith.classList.toggle('is-live', self.progress > 0.96)
      }
    });
    scrollTl
      .to(band, { s: () => G.W * 1.9, duration: 1, ease: 'power2.in', onUpdate: drawBar }, 0)
      .to(bar, { autoAlpha: 0, duration: 0.12 }, 0.88)
      .to('.display', { yPercent: -38, autoAlpha: 0, duration: 0.55, ease: 'power2.in' }, 0)
      .to('.intro, .scrollcue, .vbtn--hero', { y: -70, autoAlpha: 0, duration: 0.32, ease: 'power2.in' }, 0)
      .to(colState, { p: 1, duration: 1, ease: 'none', onUpdate: drawCols }, 0)
      .to('.col img', { scale: 1, duration: 1, ease: 'none' }, 0)
      .fromTo('.col__body', { y: 28, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.25, stagger: -0.04, ease: 'power2.out' }, 0.7);

  }

  /* ---------- resize ---------- */
  let rz;
  window.addEventListener('resize', () => {
    clearTimeout(rz);
    rz = setTimeout(() => { if (mqMobile.matches !== mobile) { location.reload(); return; } measure(); placeHairline(); if (!intro.isActive()) band.t = G.T; drawBar(); drawCols(); ScrollTrigger.refresh(); }, 120);
  });
  // column widths change on hover in screen 2 → keep the clip in sync while flex animates
  if (!mobile) {
    cols.forEach(c => c.addEventListener('transitionrun', () => gsap.ticker.add(drawCols)));
    cols.forEach(c => c.addEventListener('transitionend', () => gsap.ticker.remove(drawCols)));
  }
})();
