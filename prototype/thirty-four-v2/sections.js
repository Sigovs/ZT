/* v2 · sections after the monolith.
   Screen 3 — "In the collection": the window opens from its 34° chamfer;
   scroll scrubs through the listings, hover/focus choose one directly.  */

(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const motion = !document.documentElement.classList.contains('rm') && typeof window.gsap !== 'undefined';

  /* ---------- Screen 3 · listings ---------- */
  const listing = $('.listing');
  if (listing) {
    const rows = $$('.row', listing);
    const shots = $$('.shot', listing);
    const win = $('.window', listing);
    const creditEl = $('[data-shot-credit]', listing);
    const CREDITS = [
      'Ferrari 296 GTB · image: Ferrari S.p.A.',
      'Koenigsegg CC850 · image: Koenigsegg',
      'McLaren Artura · image: McLaren Automotive',
      'Rolls-Royce Spectre · image: Rolls-Royce Motor Cars · editorial use',
      'Czinger 21C · image: Czinger Vehicles',
      'Ferrari Purosangue · image: Ferrari S.p.A.'
    ];
    let current = 0, busy = false, queued = null;

    function setShot(i) {
      if (i === current) return;
      rows.forEach((r, k) => r.classList.toggle('is-active', k === i));
      creditEl.textContent = CREDITS[i];
      if (!motion) {
        shots.forEach((s, k) => s.classList.toggle('is-active', k === i));
        current = i; return;
      }
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
      r.addEventListener('mouseenter', () => setShot(k));
      r.addEventListener('focus', () => setShot(k));
      r.addEventListener('click', () => setShot(k));
    });

    if (motion) {
      gsap.registerPlugin(ScrollTrigger);
      // entrance: the window grows out of its own chamfer line, the names rise
      gsap.timeline({ scrollTrigger: { trigger: listing, start: 'top 75%', once: true } })
        .from(win, { clipPath: 'polygon(0% 76.4%, 0% 76.4%, 40% 100%, 40% 100%, 0% 76.4%)', duration: 1.4, ease: 'expo.inOut' }, 0)
        .from('.window__shots', { scale: 1.18, duration: 2, ease: 'expo.out' }, 0.3)
        .from('.listing__head > *', { y: 30, autoAlpha: 0, duration: 1, stagger: 0.08, ease: 'expo.out' }, 0.2)
        .from('.row', { y: 60, autoAlpha: 0, duration: 1.1, stagger: 0.06, ease: 'expo.out', clearProps: 'transform' }, 0.35)
        .from('.listing__all, .window__credit', { autoAlpha: 0, duration: 0.8, stagger: 0.03 }, 0.8);

      // scroll scrubs the active listing while the section holds still
      ScrollTrigger.create({
        trigger: listing, start: 'top top', end: () => '+=' + Math.round(window.innerHeight * 2.2),
        pin: true, anticipatePin: 1,
        onUpdate: self => {
          const i = Math.min(rows.length - 1, Math.floor(self.progress * rows.length));
          if (i !== current && !busy) setShot(i);
          else if (i !== current) queued = i;
          // the photograph drifts along the 34° axis as you scroll
          gsap.set('.window__shots', { x: self.progress * 40, y: -self.progress * 40 * Math.tan(34 * Math.PI / 180) });
        }
      });
    }
  }

  /* ---------- Screen 4 · the three bars slide in along their own axis ---------- */
  const creed = $('.creed');
  if (creed && motion) {
    const strips = $$('.cbar__strip', creed);
    const tl = gsap.timeline({
      scrollTrigger: { trigger: creed, start: 'top top', end: () => '+=' + Math.round(window.innerHeight * 1.4), pin: true, scrub: 1, anticipatePin: 1 }
    });
    // bars arrive from alternating ends, like the monogram being drawn
    tl.fromTo(strips[0], { xPercent: -170 }, { xPercent: 0, ease: 'power3.out', duration: 1 }, 0)
      .fromTo(strips[1], { xPercent: 210 },  { xPercent: 0, ease: 'power3.out', duration: 1 }, 0.18)
      .fromTo(strips[2], { xPercent: -150 }, { xPercent: 0, ease: 'power3.out', duration: 1 }, 0.36)
      .fromTo('.cbar__strip span', { xPercent: 40 }, { xPercent: 0, ease: 'power2.out', duration: 1, stagger: 0.18 }, 0)
      .fromTo('.cbar__strip--photo img', { scale: 1.25 }, { scale: 1, ease: 'none', duration: 1.4 }, 0)
      .from('.creed__note, .creed__credit', { autoAlpha: 0, y: 24, duration: 0.3, stagger: 0.05 }, 1.05)
      .to({}, { duration: 0.25 });   // a held beat before the page moves on
  }

  if (creed && motion) {
    // keep the nav legible for as long as the ivory bars are under it (pin + exit)
    ScrollTrigger.create({ trigger: creed, start: 'top 90px', end: () => '+=' + Math.round(window.innerHeight * 2.4), invalidateOnRefresh: true, toggleClass: { targets: '.nav', className: 'is-diff' } });
  }

  /* ---------- Screen 5 · enquire: the parallelogram is drawn, the word rises ---------- */
  const enquire = $('.enquire');
  if (enquire && motion) {
    const word = $('[data-enquire]', enquire);
    word.innerHTML = [...word.textContent].map(c => `<span class="ch"><span>${c}</span></span>`).join('');
    gsap.timeline({ scrollTrigger: { trigger: enquire, start: 'top 70%', once: true } })
      .from('.enquire__frame', { scaleX: 0, duration: 1.3, ease: 'expo.inOut' }, 0)
      .from('.enquire__word .ch > span', { yPercent: 108, duration: 1.1, stagger: 0.04, ease: 'expo.out' }, 0.45)
      .from('.enquire__facts > div', { y: 24, autoAlpha: 0, duration: 0.9, stagger: 0.07, ease: 'expo.out' }, 0.7)
      .from('.foot', { autoAlpha: 0, duration: 0.8 }, 1.0);
  }
})();
