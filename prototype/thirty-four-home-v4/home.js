/* ZT homepage v4 · everything after the approved hero.
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
  const splitChars = el => { el.setAttribute('aria-label', el.textContent); el.innerHTML = [...el.textContent].map(c => `<span class="ch" aria-hidden="true"><span>${c === ' ' ? '&nbsp;' : c}</span></span>`).join(''); return $$('.ch > span', el); };
  const lenis = () => window.ztLenis;
  const goTo = (y, opts) => (lenis() ? lenis().scrollTo(y, opts) : window.scrollTo({ top: typeof y === 'number' ? y : y.getBoundingClientRect().top + window.scrollY, behavior: motion ? 'smooth' : 'auto' }));
  if (motion) gsap.registerPlugin(ScrollTrigger);
  let worldOpen = false;
  const films = {};

  /* =========================== the menu ===========================
     Fullscreen. Three views on one stage (Collection, Group, Locations); on phones the same three are a drill-down.
     A 34° line opens it, closes it and turns the scenes. Nothing opens on hover. */
  const nav = $('#nav'), mega = $('#mega'), toggle = $('.nav__toggle');
  const phone = window.matchMedia('(max-width: 900px)');
  const behind = [$('main'), $('.foot')].filter(Boolean);
  const tabs = $$('.mm__tab', mega), panels = $$('[data-panel]', mega);
  const mqs = $$('.mq', mega), scenes = $$('.scene', mega);
  let open = false, opener = null, menuTl, viewTl, scTween, inTl, sceneTl, sceneKey = 'mclaren', sceneNext = null, hoverT;
  const panelOf = k => panels.find(p => p.dataset.panel === k);

  /* the 34° line as a moving edge: everything above and left of it is shown */
  const edge = t => `polygon(0px 0px, ${t / M}px 0px, 0px ${t}px)`;
  const edgeEnd = () => window.innerWidth * M + window.innerHeight;
  function sweep(el, from, to, vars) {
    const s = { t: from };
    return gsap.to(s, { t: to, ease: 'power3.inOut', ...vars, onUpdate: () => { el.style.clipPath = edge(s.t); }, onComplete: () => { el.style.clipPath = ''; vars.done && vars.done(); } });
  }

  /* what can be reached: only the view (and, on phones, the level) that is on screen */
  function reach() {
    const v = mega.dataset.view, ph = phone.matches;
    panels.forEach(p => { p.inert = p.dataset.panel !== v; });
    $('.mm__tabs', mega).inert = ph && v !== 'root';
    $('.mm__site', mega).inert = ph && v !== 'root';
    tabs.forEach(t => { const on = t.dataset.view === v; t.classList.toggle('is-active', on); t.setAttribute('aria-expanded', String(on)); });
    const back = v !== 'root' && panelOf(v) && $('.mm__back span', panelOf(v));
    if (back) back.textContent = mega.dataset.deep ? { collection: 'Collection', locations: 'Locations' }[v] : 'Menu';
  }

  /* ---------- views ---------- */
  function setDeep(key) {
    if (key) mega.dataset.deep = key; else delete mega.dataset.deep;
    mqs.forEach(m => m.classList.toggle('is-deep', !!key && m.dataset.mq === key));
    reach();
  }
  function enterView(v) {
    const p = panelOf(v);
    if (!p || !motion || phone.matches) return;
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    if (v === 'collection') {
      tl.fromTo($$('.mq .mark, .mq__info', p), { autoAlpha: 0, y: 34 }, { autoAlpha: 1, y: 0, duration: 1, stagger: 0.04, clearProps: 'transform,opacity,visibility' }, 0);
    } else if (v === 'group') {
      tl.fromTo($('.dir__find', p), { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 1, ease: 'expo.inOut', clearProps: 'clipPath' }, 0)
        .fromTo($$('.marks li', p), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5, stagger: 0.02, ease: 'power2.out', clearProps: 'opacity,visibility' }, 0.25)
        .fromTo($$('.dealers li:not([hidden])', p), { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.018, clearProps: 'transform,opacity,visibility' }, 0.3);
    } else {
      tl.fromTo($$('.geo__states li', p), { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.05, clearProps: 'transform,opacity,visibility' }, 0)
        .fromTo($('.geo__map', p), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.9, ease: 'power2.out', clearProps: 'opacity,visibility' }, 0.1)
        .fromTo($$('.place.is-active li, .place.is-active h4', p), { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.03, clearProps: 'transform,opacity,visibility' }, 0.25);
    }
    return tl;
  }
  function setView(v, instant) {
    // a change still under way is finished first, so the last name asked for always wins
    if (viewTl && viewTl.isActive()) viewTl.progress(1);
    if (scTween) { scTween.progress(1); scTween = null; }
    if (inTl) inTl.progress(1);
    const was = mega.dataset.view;
    if (was === v) { reach(); return; }
    if (!motion || instant || phone.matches) { mega.dataset.view = v; reach(); return; }
    // the view on screen leaves first; the scene closes or opens along the line
    viewTl = gsap.timeline();
    viewTl.to(panelOf(was), { autoAlpha: 0, duration: 0.24, ease: 'power2.in' });
    const sc = $('.mm__scenes', mega);
    if (was === 'collection') viewTl.add(sweep(sc, edgeEnd(), 0, { duration: 0.7 }), 0.05);
    viewTl.add(() => {
      mega.dataset.view = v;
      gsap.set(panelOf(was), { clearProps: 'opacity,visibility' });
      sc.style.clipPath = '';
      reach();
      if (v === 'collection') scTween = sweep(sc, 0, edgeEnd(), { duration: 0.9 });
      inTl = enterView(v);
    });
    tabs.forEach(t => t.classList.toggle('is-active', t.dataset.view === v));      // the name answers at once
  }

  /* ---------- collection: the scene follows the marque ---------- */
  function setScene(key, instant) {
    mqs.forEach(m => m.classList.toggle('is-active', m.dataset.mq === key));
    if (key === sceneKey) { sceneNext = null; return; }
    if (sceneTl && sceneTl.isActive()) { sceneNext = key; return; }
    const prev = scenes.find(s => s.dataset.scene === sceneKey), next = scenes.find(s => s.dataset.scene === key);
    const forward = scenes.indexOf(next) > scenes.indexOf(prev);
    sceneKey = key; sceneNext = null;
    if (!motion || instant) { prev.classList.remove('is-active'); next.classList.add('is-active'); return; }
    const end = edgeEnd(), st = { t: forward ? end : 0 };
    next.classList.add('is-entering');
    // travelling right, the next scene comes in from the right; travelling left, from the left
    const W = () => window.innerWidth, H = () => window.innerHeight;
    const draw = () => { next.style.clipPath = forward ? `polygon(${W()}px ${H()}px, ${W() - (end - st.t) / M}px ${H()}px, ${W()}px ${H() - (end - st.t)}px)` : edge(st.t); };
    draw();
    sceneTl = gsap.timeline({ onComplete: () => {
      prev.classList.remove('is-active'); next.classList.add('is-active'); next.classList.remove('is-entering'); next.style.clipPath = '';
      if (sceneNext && sceneNext !== sceneKey) setScene(sceneNext);
    } });
    sceneTl.to(st, { t: forward ? 0 : end, duration: 0.85, ease: 'power3.inOut', onUpdate: draw }, 0)
      .fromTo(next, { scale: 1.08 }, { scale: 1, duration: 1.3, ease: 'expo.out' }, 0.05);
  }
  mqs.forEach((m, i) => {
    const key = m.dataset.mq, hit = $('.mq__hit', m);
    if (fine) m.addEventListener('mouseenter', () => { clearTimeout(hoverT); if (!phone.matches) hoverT = setTimeout(() => setScene(key), 70); });
    m.addEventListener('focusin', () => { if (!phone.matches) setScene(key); });
    let wasActive = false;
    hit.addEventListener('pointerdown', () => { wasActive = m.classList.contains('is-active'); });
    hit.addEventListener('click', e => {
      if (phone.matches) { if (mega.dataset.deep) return; setDeep(key); panelOf('collection').scrollTop = 0; $('.mm__back', panelOf('collection')).focus({ preventScroll: true }); if (motion) gsap.from($$('.mq__info', m), { autoAlpha: 0, y: 18, duration: 0.6, ease: 'expo.out', clearProps: 'all' }); return; }
      if (e.detail && !fine && !wasActive) return;                                 // touch: the first tap shows, the second goes
      goMarque(key);
    });
    hit.addEventListener('keydown', e => {
      const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (d) { e.preventDefault(); $('.mq__hit', mqs[(i + d + mqs.length) % mqs.length]).focus(); }
    });
  });
  // the marque's own place on the page: its column, opened
  function goMarque(key) {
    setOpen(false);
    setTimeout(() => goTo(mobile || !motion ? colOf(key) : stageEnd(), { duration: 1.2, offset: mobile ? -60 : 0 }), 60);
    setTimeout(() => travel(key), motion ? 1500 : 100);
  }

  /* ---------- group: search, brand, dealership ---------- */
  {
    const input = $('[data-search]', mega), clear = $('[data-clear]', mega), rows = $$('[data-dealers] > li', mega), marksUl = $('.marks', mega), marks = $$('[data-brand]', mega);
    const count = $('[data-count-dealers]', mega), none = $('[data-none]', mega);
    const norm = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9 ]+/g, ' ').trim();
    const keys = rows.map(r => ' ' + norm(r.dataset.key));
    let brand = '';
    function apply() {
      const words = norm(input.value).split(/\s+/).filter(Boolean);
      let n = 0;
      rows.forEach((r, i) => {
        const on = words.length ? words.every(w => keys[i].includes(' ' + w)) : brand ? r.dataset.brands.split(' ').includes(brand) : !r.hasAttribute('data-lux');
        r.hidden = !on; if (on) n++;
      });
      marks.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.brand === brand)));
      marksUl.classList.toggle('has-choice', !!brand);
      clear.hidden = !brand && !input.value;
      none.hidden = n > 0;
      count.textContent = n ? `${n} ${n === 1 ? 'dealership' : 'dealerships'}` : 'No dealerships';
      if (motion && n) gsap.fromTo(rows.filter(r => !r.hidden), { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.014, ease: 'power2.out', overwrite: true, clearProps: 'transform,opacity,visibility' });
    }
    input.addEventListener('input', () => { brand = ''; apply(); });
    marks.forEach(b => b.addEventListener('click', () => {
      brand = brand === b.dataset.brand ? '' : b.dataset.brand; input.value = ''; apply();
      const list = $('.dir__list', mega); list.scrollTop = 0;
      if (phone.matches && brand) { const p = panelOf('group'); p.scrollTo({ top: p.scrollTop + list.getBoundingClientRect().top - 190, behavior: motion ? 'smooth' : 'auto' }); }
    }));
    clear.addEventListener('click', () => { brand = ''; input.value = ''; apply(); input.focus(); });
    // arrows walk from the field into the results
    const links = () => rows.filter(r => !r.hidden).map(r => $('a', r));
    panelOf('group').addEventListener('keydown', e => {
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
      const ls = links(), at = ls.indexOf(document.activeElement);
      if (document.activeElement !== input && at < 0) return;
      e.preventDefault();
      const to = at + (e.key === 'ArrowDown' ? 1 : -1);
      if (to < 0) input.focus(); else if (ls[to]) ls[to].focus();
    });
  }

  /* ---------- locations: the state, its place on the map, its dealerships ---------- */
  {
    const btns = $$('.geo__states [data-state]', mega), shapes = $$('.map__states [data-state]', mega), dots = $$('.map__dots circle', mega), places = $$('[data-place]', mega), label = $('[data-map-label]', mega), map = $('.map', mega);
    let state = 'NC';
    function choose(st, focusBack) {
      state = st;
      btns.forEach(b => { const on = b.dataset.state === st; b.classList.toggle('is-active', on); b.setAttribute('aria-pressed', String(on)); });
      shapes.forEach(s => s.classList.toggle('is-active', s.dataset.state === st));
      dots.forEach(d => d.classList.toggle('is-active', d.dataset.state === st));
      places.forEach(p => { const on = p.dataset.place === st; p.hidden = !on; p.classList.toggle('is-active', on); });
      $('[data-places]', mega).scrollTop = 0;
      const p = places.find(x => x.dataset.place === st);
      if (motion) gsap.fromTo($$('h4, li', p), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.025, ease: 'power2.out', overwrite: true, clearProps: 'transform,opacity,visibility' });
      if (phone.matches && focusBack) { setDeep(st); panelOf('locations').scrollTop = 0; $('.mm__back', panelOf('locations')).focus({ preventScroll: true }); }
    }
    btns.forEach(b => b.addEventListener('click', () => { if (state !== b.dataset.state || phone.matches) choose(b.dataset.state, true); }));
    shapes.forEach(s => s.addEventListener('click', () => { if (state !== s.dataset.state) choose(s.dataset.state, true); else if (phone.matches && !mega.dataset.deep) choose(state, true); }));
    const hot = city => {
      dots.forEach(d => d.classList.toggle('is-hot', d.dataset.city === city && !!city));
      const d = city && dots.find(x => x.dataset.city === city);
      label.classList.toggle('is-on', !!d);
      if (!d) return;
      const r = d.getBoundingClientRect(), b = $('.geo__map', mega).getBoundingClientRect();
      label.textContent = city;
      const right = r.left - b.left > b.width * .62;
      label.style.transform = `translate(${Math.round(right ? r.left - b.left - label.offsetWidth - 10 : r.right - b.left + 10)}px, ${Math.round(r.top - b.top + r.height / 2 - label.offsetHeight / 2)}px)`;
    };
    $$('[data-places] a', mega).forEach(a => {
      a.addEventListener('mouseenter', () => hot(a.dataset.city)); a.addEventListener('mouseleave', () => hot(''));
      a.addEventListener('focus', () => hot(a.dataset.city)); a.addEventListener('blur', () => hot(''));
    });
  }

  /* ---------- open and close ---------- */
  function setOpen(v, view, from) {
    if (v === open) { if (v && view) setView(view); return; }
    open = v;
    if (menuTl) menuTl.kill();
    if (viewTl && viewTl.isActive()) viewTl.progress(1);
    toggle.setAttribute('aria-expanded', String(v));
    $('.nav__toggle-label').textContent = v ? 'Close' : 'Menu';
    toggle.setAttribute('aria-label', v ? 'Close menu' : 'Open menu');
    nav.classList.toggle('is-open', v);
    behind.forEach(el => { el.inert = v; });
    mega.inert = !v;
    worldOpen = v; syncAll();                                                        // films rest while the menu covers them
    if (v) {
      opener = from || toggle;
      nav.classList.remove('is-away');
      setDeep(null);
      mega.dataset.view = view || (phone.matches ? 'root' : 'collection');
      reach();
      lenis() ? lenis().stop() : root.classList.add('menu-open');
      mega.classList.add('is-open');
      mega.style.clipPath = '';
      if (motion) {
        menuTl = gsap.timeline();
        mega.style.clipPath = edge(0);
        menuTl.add(sweep(mega, 0, edgeEnd(), { duration: 1.0 }), 0);
        if (!phone.matches) {
          menuTl.fromTo('.mm__tab-t', { yPercent: 60, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.9, stagger: 0.06, ease: 'expo.out', clearProps: 'all' }, 0.3)
            .fromTo('.mm__site a', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5, stagger: 0.04, clearProps: 'opacity,visibility' }, 0.6);
          if (mega.dataset.view === 'collection') menuTl.fromTo('.scene.is-active', { scale: 1.12 }, { scale: 1, duration: 1.8, ease: 'expo.out', clearProps: 'transform' }, 0);
          const ev = enterView(mega.dataset.view); if (ev) menuTl.add(ev, 0.35);
        }
      }
      const first = phone.matches && mega.dataset.view === 'root' ? tabs[0] : tabs.find(t => t.dataset.view === mega.dataset.view);
      (phone.matches && mega.dataset.view !== 'root' ? $('.mm__back', panelOf(mega.dataset.view)) : first).focus({ preventScroll: true });
    } else {
      lenis() ? lenis().start() : root.classList.remove('menu-open');
      const done = () => { mega.classList.remove('is-open'); mega.style.clipPath = ''; };
      if (motion) menuTl = gsap.timeline().add(sweep(mega, edgeEnd(), 0, { duration: 0.6, done }), 0);
      else done();
    }
  }
  mega.inert = true;
  toggle.setAttribute('aria-label', 'Open menu');
  toggle.addEventListener('click', () => { if (open) { setOpen(false); toggle.focus({ preventScroll: true }); } else setOpen(true, null, toggle); });
  $$('.nav [data-view]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); setOpen(true, a.dataset.view, a); }));
  $('.nav__brand').addEventListener('click', () => open && setOpen(false));
  $('.nav__cta').addEventListener('click', () => open && setOpen(false));
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => {
      setDeep(null); setView(t.dataset.view);
      if (phone.matches) { const p = panelOf(t.dataset.view); p.scrollTop = 0; $('.mm__back', p).focus({ preventScroll: true }); }
    });
    t.addEventListener('keydown', e => {
      const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!d || phone.matches) return;
      e.preventDefault(); const n = tabs[(i + d + tabs.length) % tabs.length]; n.focus(); n.click();
    });
  });
  $$('[data-back]', mega).forEach(b => b.addEventListener('click', () => {
    const v = mega.dataset.view, deep = mega.dataset.deep;
    if (deep) {
      setDeep(null);
      const back = v === 'collection' ? $(`[data-mq="${deep}"] .mq__hit`, mega) : $(`.geo__states [data-state="${deep}"]`, mega);
      back && back.focus({ preventScroll: true });
    } else { setView('root'); const t = tabs.find(x => x.dataset.view === v); t && t.focus({ preventScroll: true }); }
  }));
  mega.addEventListener('click', e => { if (e.target.closest('a')) setOpen(false); });
  const onPhone = () => { if (!open) return; setDeep(null); mega.dataset.view = phone.matches ? 'root' : (mega.dataset.view === 'root' ? 'collection' : mega.dataset.view); reach(); };
  phone.addEventListener ? phone.addEventListener('change', onPhone) : phone.addListener(onPhone);

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
  const heroAllowed = () => !root.classList.contains('rm') && (mobile || films.hero.wanted) && films.hero.inView && !document.hidden && !worldOpen;
  function syncHero() {
    const mf = marqueFilms[heroKey];
    Object.entries(marqueFilms).forEach(([k, v]) => { if (k !== heroKey) { v.pause(); v.classList.remove('is-playing'); } });
    if (mf && heroAllowed()) {
      if (!mf.getAttribute('src')) mf.src = mf.dataset.src;
      const pr = mf.play(); if (pr && pr.catch) pr.catch(() => {});
    } else if (mf) mf.pause();
    const hero = films.hero.el;
    if (heroKey === 'collection' && films.hero.wanted && films.hero.inView && !document.hidden && !worldOpen) { const pr = hero.play(); if (pr && pr.catch) pr.catch(() => {}); }
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
    if (open) { setOpen(false); (opener && opener.isConnected ? opener : toggle).focus({ preventScroll: true }); } else if (openKey) travel(null);
  });

  /* =========================== 4 · inventory ===========================
     Real stock in profile on one line. The filter swaps which cars stand on it; the finder goes to the live listings. */
  const stock = $('.stock');
  const lots = $$('.lot[data-marque]', stock), lotAll = $('[data-lot-all]', stock), stockStatus = $('[data-stock-status]', stock);
  const FACETS = JSON.parse($('[data-facets]', stock).textContent);
  const LIVE = 'https://www.charlottemclaren.com/all-inventory/';
  const liveURL = (make, model) => LIVE + (make ? `?make=%5B${encodeURIComponent(make)}%5D${model ? `&model=%5B${encodeURIComponent(model)}%5D` : ''}&main=make` : '');
  const MAKE_OF = { czinger: ['CZINGER', 'Czinger'], ferrari: ['FERRARI', 'Ferrari'], koenigsegg: ['KOENIGSEGG', 'Koenigsegg'], mclaren: ['MCLAREN', 'McLaren'], 'rolls-royce': ['ROLLS-ROYCE', 'Rolls-Royce'] };
  const sumOf = make => FACETS[make].reduce((n, m) => n + m[2], 0);
  let stockKey = 'all', stockTl;

  // the cars drive onto the line from the right; the line is drawn ahead of them
  function driveIn(list, stagger = 0.07) {
    const cars = list.map(l => $('.lot__car', l)), lines = list.map(l => $('.lot__line', l)), text = list.flatMap(l => $$('.lot__id, .lot__facts', l));
    return gsap.timeline()
      .fromTo(lines, { '--draw': 0 }, { '--draw': 1, duration: 1.1, stagger, ease: 'expo.inOut' }, 0)
      .fromTo(cars, { x: mobile ? 40 : 90, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 1.25, stagger, ease: 'expo.out', clearProps: 'transform,opacity,visibility' }, 0.1)
      .fromTo(text, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6, stagger: stagger / 2, ease: 'power2.out', clearProps: 'opacity,visibility' }, 0.45);
  }
  function setLots(key) {
    lots.forEach(l => { l.hidden = key === 'all' ? l.hasAttribute('data-more') : l.dataset.marque !== key; });
    const m = MAKE_OF[key];
    lotAll.hidden = !m;
    stock.classList.toggle('is-filtered', !!m);
    if (m) {
      const n = sumOf(m[0]);
      $('a', lotAll).href = liveURL(m[0]);
      $('[data-all-label]', lotAll).textContent = n === 1 ? `The only ${m[1]} in stock` : `All ${n} from ${m[1]}`;
    }
    const on = lots.filter(l => !l.hidden), n = on.length;
    lots.forEach(l => l.classList.toggle('is-edge', !l.hidden && on.indexOf(l) % 3 === 2));
    stock.classList.toggle('is-full', n >= 3);
    stockStatus.textContent = m ? `${n} ${m[1]} shown of ${sumOf(m[0])} in stock` : 'Cars from all five marques shown';
  }
  function applyFilter(key) {
    $$('.filter__btn', stock).forEach(b => { const on = b.dataset.filter === key; b.classList.toggle('is-active', on); b.setAttribute('aria-pressed', String(on)); });
    if (key === stockKey) return;
    stockKey = key;
    if (!motion) { setLots(key); return; }
    rowTls.forEach(t => t.progress(1));
    if (stockTl) stockTl.kill();
    const leaving = lots.concat(lotAll).filter(l => !l.hidden);
    // one state at a time: the cars on the line leave, then the next ones arrive
    stockTl = gsap.timeline();
    stockTl.to(leaving, { autoAlpha: 0, duration: 0.28, ease: 'power2.in' })
      .add(() => {
        gsap.set(lots.concat(lotAll), { clearProps: 'opacity,visibility' });
        setLots(key);
        stockTl.add(driveIn(lots.filter(l => !l.hidden)));
        if (!lotAll.hidden) gsap.fromTo(lotAll, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6, delay: 0.5, clearProps: 'opacity,visibility' });
        ScrollTrigger.refresh();
      });
  }
  $$('.filter__btn', stock).forEach(b => b.addEventListener('click', () => applyFilter(b.dataset.filter)));

  {   // the finder: make, then model, then the live listings with both already applied
    const find = $('[data-find]', stock), mk = $('[data-make]', find), md = $('[data-model]', find), label = $('[data-find-label]', find);
    const total = Object.keys(FACETS).reduce((n, k) => n + sumOf(k), 0);
    const say = () => {
      const m = mk.value && FACETS[mk.value], one = m && md.value && m.find(x => x[0] === md.value);
      const n = one ? one[2] : m ? sumOf(mk.value) : total;
      label.textContent = m ? `Show ${n}` : `Browse all ${n}`;
    };
    const fill = () => {
      const m = FACETS[mk.value];
      md.length = 1;
      (m || []).forEach(x => md.add(new Option(`${x[1]} (${x[2]})`, x[0])));
      md.disabled = !m;
      say();
    };
    mk.addEventListener('change', fill);
    md.addEventListener('change', say);
    fill();
    find.addEventListener('submit', e => { e.preventDefault(); window.location.href = liveURL(mk.value, md.value); });
  }

  const rowTls = [];
  if (motion) {
    const word = $('[data-word]', stock), shown = lots.filter(l => !l.hidden), per = mobile ? 1 : 3;
    gsap.from(splitChars(word), { yPercent: 108, duration: 1.2, stagger: 0.035, ease: 'expo.out', scrollTrigger: { trigger: stock, start: 'top 68%', once: true } });
    for (let i = 0; i < shown.length; i += per) {
      const row = shown.slice(i, i + per), tl = driveIn(row, 0.12).pause(0);
      rowTls.push(tl);
      ScrollTrigger.create({ trigger: row[0], start: 'top 82%', once: true, onEnter: () => tl.play() });
    }
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
