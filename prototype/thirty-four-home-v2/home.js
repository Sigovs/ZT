/* ZT homepage v2 · everything after the approved hero.
   Menu · films · marque rooms (Flip) · the house · inventory · ownership · showrooms · enquire.
   The 34° line is used where it starts or ends something; the rooms in between move on their own terms.
   Every section is complete without script and with reduced motion. */

(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const root = document.documentElement;
  const hasGSAP = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
  const motion = hasGSAP && !root.classList.contains('rm');
  const hasFlip = motion && typeof window.Flip !== 'undefined';
  const mobile = window.matchMedia('(max-width: 900px)').matches;
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const M = Math.tan(34 * Math.PI / 180);
  const lenis = () => window.ztLenis;
  const goTo = (y, opts) => (lenis() ? lenis().scrollTo(y, opts) : window.scrollTo({ top: typeof y === 'number' ? y : y.getBoundingClientRect().top + window.scrollY, behavior: motion ? 'smooth' : 'auto' }));
  if (motion) gsap.registerPlugin(ScrollTrigger);
  if (hasFlip) gsap.registerPlugin(Flip);

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
    if (!a || a.dataset.world) return;
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
  function syncFilm(name) {
    const f = films[name]; if (!f) return;
    const play = f.wanted && f.inView && !document.hidden && !worldOpen;
    if (play) {
      if (f.el.dataset.src && !f.el.getAttribute('src')) f.el.src = f.el.dataset.src;
      const p = f.el.play(); if (p && p.catch) p.catch(() => {});
    } else f.el.pause();
    $$(`[data-film-toggle="${name}"]`).forEach(b => { b.setAttribute('aria-pressed', String(!f.wanted)); $('span', b).textContent = f.wanted ? 'Pause film' : 'Play film'; });
  }
  const syncAll = () => Object.keys(films).forEach(syncFilm);
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(en => { const f = films[en.target.dataset.film]; f.inView = en.isIntersecting; syncFilm(en.target.dataset.film); }), { rootMargin: '160px 0px' });
    Object.values(films).forEach(f => io.observe(f.el));
  }
  $$('[data-film-toggle]').forEach(b => b.addEventListener('click', e => { e.stopPropagation(); const f = films[b.dataset.filmToggle]; f.wanted = !f.wanted; if (f.wanted) f.inView = true; syncFilm(b.dataset.filmToggle); }));
  document.addEventListener('visibilitychange', syncAll);
  syncAll();

  // the hero film, reduced to a 64×36 field of light, sits behind the word
  const amb = $('.hero__ambient'), heroFilm = films.hero && films.hero.el;
  if (amb && heroFilm && motion && !mobile) {
    const ctx = amb.getContext('2d'); let n = 0;
    gsap.ticker.add(() => {
      if (heroFilm.paused || heroFilm.readyState < 2 || (n++ % 3)) return;
      try { ctx.drawImage(heroFilm, 0, 0, 64, 36); amb.classList.add('is-on'); } catch (err) { /* frame not ready */ }
    });
  }

  /* =========================== 2b · marque rooms =========================== */
  const world = $('#world'), media = $('.world__media', world), closeBtn = $('.world__close', world);
  const W = {
    czinger: { name: 'Czinger', title: 'Czinger Charlotte', place: '1316 South Tryon St · Charlotte, NC 28203', quote: '“Human-AI design, 3D printing technology, automated assembly and patented in-house developed materials.”', cite: 'Czinger Charlotte, on the 21C', models: '21C · 21C V Max · Hyper GT', site: 'https://www.czingerclt.com/', host: 'czingerclt.com', tel: ['+17042480009', '(704) 248-0009'], side: 'left', credit: 'Image: Czinger Vehicles' },
    ferrari: { name: 'Ferrari', title: 'Ferrari', place: 'No ZT showroom is published for Ferrari yet. To be confirmed.', quote: '', models: 'To be confirmed', side: 'left', credit: 'Image: Ferrari S.p.A.' },
    koenigsegg: { name: 'Koenigsegg', title: 'Koenigsegg Charlotte', place: '6010 Kenley Ln · Charlotte, NC 28217', quote: '“We have access to all the latest software updates, factory bulletins, and parts designs.”', cite: 'Koenigsegg Charlotte, Service & Parts', models: 'Gemera · Jesko · Regera', site: 'https://www.koenigseggnc.com/', host: 'koenigseggnc.com', tel: ['+17042488699', '704-248-8699'], side: 'left', credit: 'Image: Koenigsegg · photo Keno Zache' },
    mclaren: { name: 'McLaren', title: 'McLaren Charlotte', place: '6010 Kenley Ln, Suite C · Charlotte, NC 28217', quote: '“Our goal is to provide our discerning customers with a personalized buying experience.”', cite: 'McLaren Charlotte', models: 'W1 · 750S · 750S Spider · Artura · Artura Spider · GTS', site: 'https://www.charlottemclaren.com/', host: 'charlottemclaren.com', tel: ['+17042480009', '(704) 248-0009'], side: 'left', credit: 'Image: McLaren Automotive' },
    'rolls-royce': { name: 'Rolls-Royce', title: 'Rolls-Royce Motor Cars Charlotte', place: '1316 South Tryon St · Charlotte, NC 28203', quote: '', models: 'Spectre · Phantom Series II · Cullinan · Ghost · Black Badge', site: 'https://www.rollsroycemotorcarscharlotte.com/', host: 'rollsroycemotorcarscharlotte.com', tel: ['+17042487766', '(704) 248-7766'], side: 'right', credit: 'Image: Rolls-Royce Motor Cars · editorial use' }
  };
  const ARROW = '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7h10v10M7 17 17 7"/></svg>';
  const colOf = key => $(`.col[data-col="${key}"]`);
  let wKey = null, lastFocus = null, wBusy = false;

  function fillWorld(key) {
    const d = W[key];
    world.dataset.side = d.side;
    $('[data-w-mark]', world).className = `mark mark--${key} world__mark`;
    $('[data-w-title]', world).textContent = d.title;
    $('[data-w-place]', world).textContent = d.place;
    const q = $('[data-w-quote]', world); q.textContent = d.quote;
    if (d.quote) { const c = document.createElement('cite'); c.textContent = d.cite; q.appendChild(c); }
    $('[data-w-models]', world).textContent = d.models;
    $('[data-w-credit]', world).textContent = d.credit;
    const acts = [`<a class="is-primary" href="#collection" data-filter="${key}" data-w-leave>${d.name} in the collection</a>`];
    if (d.site) acts.push(`<a href="${d.site}" rel="noopener">${d.host} ${ARROW}</a>`);
    if (d.tel) acts.push(`<a href="tel:${d.tel[0]}">${d.tel[1]}</a>`);
    $('[data-w-acts]', world).innerHTML = acts.join('');
    $$('[data-w-go]', world).forEach(b => { const on = b.dataset.wGo === key; b.classList.toggle('is-active', on); b.setAttribute('aria-current', String(on)); });
  }
  const inView = el => { const r = el.getBoundingClientRect(); return r.bottom > 80 && r.top < innerHeight - 80 && r.width > 0; };
  const others = () => [$('main'), nav, $('#foot'), mega];
  const giveBack = (img, key) => { const col = colOf(key); col.insertBefore(img, col.firstChild); img.classList.remove('is-entering'); if (motion) { gsap.set(img, { clearProps: 'all' }); if (!mobile) gsap.set(img, { scale: 1 }); } };

  function openWorld(key) {
    if (wBusy) return;
    if (worldOpen) { switchWorld(key); return; }
    const col = colOf(key), img = $('img', col); if (!img) return;
    lastFocus = document.activeElement;
    worldOpen = true; wKey = key; wBusy = true;
    setOpen(false);
    fillWorld(key);
    const flip = hasFlip && inView(col);
    const state = flip ? Flip.getState(img) : null;
    world.hidden = false;
    media.appendChild(img);
    others().forEach(el => { el.inert = true; });
    lenis() && lenis().stop(); syncAll();
    requestAnimationFrame(() => world.classList.add('is-open'));
    const done = () => { wBusy = false; closeBtn.focus({ preventScroll: true }); };
    if (!motion) { done(); return; }
    if (flip) Flip.from(state, { duration: 1.15, ease: 'expo.inOut', absolute: true, onComplete: done });
    else { img.classList.add('is-entering'); gsap.fromTo(img, { '--w': '-16%' }, { '--w': '110%', duration: 1.1, ease: 'power3.inOut', onComplete: () => { img.classList.remove('is-entering'); done(); } }); }
    gsap.fromTo($$('.world__body > *, .world__index, .world__credit, .world__close'), { y: 26, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.9, stagger: 0.06, ease: 'expo.out', delay: 0.6, clearProps: 'transform' });
  }

  function switchWorld(key) {
    if (key === wKey || wBusy) return;
    const prevKey = wKey, prev = $('img', media), next = $('img', colOf(key)); if (!next) return;
    wKey = key;
    if (!motion) { media.appendChild(next); giveBack(prev, prevKey); fillWorld(key); return; }
    wBusy = true;
    media.appendChild(next); next.classList.add('is-entering');
    const body = $$('.world__body > *');
    gsap.timeline({ onComplete: () => { giveBack(prev, prevKey); next.classList.remove('is-entering'); wBusy = false; } })
      .fromTo(next, { '--w': '-16%' }, { '--w': '110%', duration: 1.05, ease: 'power3.inOut' }, 0)
      .fromTo(next, { scale: 1.1 }, { scale: 1, duration: 1.5, ease: 'expo.out' }, 0)
      .to(body, { autoAlpha: 0, y: -10, duration: 0.25, ease: 'power2.in' }, 0)
      .add(() => fillWorld(key), 0.3)
      .fromTo(body, { y: 22 }, { y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.05, ease: 'expo.out' }, 0.42);
  }

  function closeWorld(then) {
    if (!worldOpen || wBusy) return;
    const key = wKey, col = colOf(key), img = $('img', media);
    const end = () => {
      giveBack(img, key);
      world.hidden = true; worldOpen = false; wKey = null; wBusy = false;
      others().forEach(el => { el.inert = false; }); mega.inert = true;
      lenis() && lenis().start(); syncAll();
      if (then) then(); else if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
    };
    world.classList.remove('is-open');
    if (!motion) { end(); return; }
    wBusy = true;
    gsap.to($$('.world__body > *, .world__index, .world__credit, .world__close'), { autoAlpha: 0, duration: 0.3, ease: 'power2.in' });
    if (hasFlip && inView(col) && !then) Flip.fit(img, col, { duration: 0.95, ease: 'expo.inOut', absolute: true, delay: 0.1, onComplete: end });
    else gsap.to(world, { autoAlpha: 0, duration: 0.5, delay: 0.15, ease: 'power2.inOut', onComplete: () => { gsap.set(world, { clearProps: 'opacity,visibility' }); end(); } });
  }

  document.addEventListener('click', e => {
    const opener = e.target.closest('[data-world]');
    if (opener) { e.preventDefault(); openWorld(opener.dataset.world); return; }
    const go = e.target.closest('[data-w-go]');
    if (go) { switchWorld(go.dataset.wGo); return; }
    const leave = e.target.closest('[data-w-leave]');
    if (leave) { e.preventDefault(); e.stopPropagation(); const f = leave.dataset.filter; closeWorld(() => { applyFilter(f); goTo($('#collection'), { duration: 1.2 }); }); }
  }, true);
  closeBtn.addEventListener('click', () => closeWorld());
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (worldOpen) closeWorld(); else if (open) { setOpen(false); toggle.focus(); }
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

    // the house: figures roll up; the twelve-year rule is drawn by the scroll
    $$('.figures dd').forEach(dd => { dd.style.overflow = 'hidden'; dd.innerHTML = `<span style="display:inline-block">${dd.textContent}</span>`; });
    gsap.from('.figures dd span', { yPercent: 105, duration: 1.2, stagger: 0.08, ease: 'expo.out', scrollTrigger: { trigger: '.figures', start: 'top 82%', once: true } });
    if (!mobile) {
      const ol = $('.years ol');
      gsap.timeline({ scrollTrigger: { trigger: '.years', start: 'top 82%', end: 'top 38%', scrub: 0.6 } })
        .fromTo(ol, { '--line': 0 }, { '--line': 1, ease: 'none', duration: 1 }, 0)
        .fromTo($$('li', ol), { autoAlpha: 0.12 }, { autoAlpha: 1, ease: 'none', duration: 0.18, stagger: 1 / 7 }, 0);
    }

    // ownership: the film opens sideways from a slit
    const slit = $('.slit');
    gsap.fromTo(slit, { '--cut': '44%' }, { '--cut': '0%', ease: 'power2.out', scrollTrigger: { trigger: '.craft', start: 'top 80%', end: mobile ? 'top 30%' : 'top 12%', scrub: 0.6 } });

    // buy, sell, trade: the three verbs are set, letter by letter
    $$('.verb h3').forEach((h, i) => gsap.from(splitChars(h), { yPercent: 108, duration: 1.1, stagger: 0.04, delay: mobile ? 0 : i * 0.12, ease: 'expo.out', scrollTrigger: { trigger: mobile ? h : '.deal__cols', start: 'top 82%', once: true } }));

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
