/* ZT homepage v4 · the atlas: the group's five states as a model on a table, seen from a low angle.
   Role: MAIN of its block (it is how a state is chosen); the list of dealerships is complete without it.
   Budget: under 40k triangles, no textures, no lights, DPR capped at 2 (1.5 on phones). It is loaded when the block
   comes near, and it draws a frame only when something has moved and the canvas is on screen.
   Geometry: US Census state and county lines (us-atlas 3.0.1) and Natural Earth coasts (world-atlas 2.0.2), Albers. */
import * as THREE from 'three';
import { Line2 } from 'three/addons/lines/Line2.js';
import { LineGeometry } from 'three/addons/lines/LineGeometry.js';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';

const INK = 0x0b0c0d, IVORY = 0xefede8, RED = 0xff2d55, H = 5, RAD = Math.PI / 180;
const NAMES = { AL: 'Alabama', FL: 'Florida', GA: 'Georgia', NC: 'North Carolina', TX: 'Texas' };
const LEFT = new Set(['New Port Richey', 'Tuscumbia']);                       // tags that stand to the left of their pin
const MAIN = new Set(['Alvin', 'Florence', 'Smyrna', 'Fort Walton Beach', 'Tampa', 'Charlotte']);

export async function mountAtlas(root, { gsap, ScrollTrigger, motion, fine }) {
  const data = await (await fetch('assets/map/southeast.json')).json();
  const canvas = root.querySelector('canvas'), tagsBox = root.querySelector('.atlas__tags'), side = root.querySelector('.atlas__side');
  const phone = window.matchMedia('(max-width: 900px)');
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' }); } catch (e) { return null; }
  renderer.setClearColor(INK, 0);

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(INK, 700, 1700);
  const camera = new THREE.PerspectiveCamera(26, 1, 10, 4000);
  const world = new THREE.Group();
  scene.add(world);

  /* ---------- drawing helpers ---------- */
  const line = (color, opacity, depthWrite = false) => new THREE.LineBasicMaterial({ color, transparent: true, opacity, depthWrite });
  const strip = (flat, y) => { const a = new Float32Array(flat.length / 2 * 3); for (let i = 0, k = 0; i < flat.length; i += 2) { a[k++] = flat[i]; a[k++] = y; a[k++] = flat[i + 1]; } return a; };
  // many polylines as one LineSegments
  function segments(lists, y, material) {
    let n = 0; lists.forEach(f => { n += Math.max(0, f.length / 2 - 1); });
    const a = new Float32Array(n * 6); let k = 0;
    lists.forEach(f => { for (let i = 0; i + 3 < f.length; i += 2) { a[k++] = f[i]; a[k++] = y; a[k++] = f[i + 1]; a[k++] = f[i + 2]; a[k++] = y; a[k++] = f[i + 3]; } });
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(a, 3));
    return new THREE.LineSegments(g, material);
  }
  const shapeOf = (flat, holes = []) => { const s = new THREE.Shape(); for (let i = 0; i < flat.length; i += 2) i ? s.lineTo(flat[i], flat[i + 1]) : s.moveTo(flat[i], flat[i + 1]); holes.forEach(h => { const p = new THREE.Path(); for (let i = 0; i < h.length; i += 2) i ? p.lineTo(h[i], h[i + 1]) : p.moveTo(h[i], h[i + 1]); s.holes.push(p); }); return s; };

  /* ---------- the sea: lines at set distances from the coast, each a little lower than the last ---------- */
  const coastMats = [.62, .42, .3, .21, .14, .09].map(o => line(IVORY, o));
  data.coast.forEach((l, i) => world.add(segments(l, -1.1 * (i + 1), coastMats[i])));
  const gridMat = line(IVORY, .055);
  world.add(segments(data.grid, -8, gridMat));

  /* ---------- neighbouring land: flat, dark, there only for the shape of the country ---------- */
  const landMat = new THREE.MeshBasicMaterial({ color: 0x0f1113, side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 });
  const landG = new THREE.ShapeGeometry(data.land.map(p => shapeOf(p[0], p.slice(1)))); landG.rotateX(Math.PI / 2);
  world.add(new THREE.Mesh(landG, landMat));
  const ctxMat = line(IVORY, .17);
  world.add(segments(data.ctx, .15, ctxMat));

  /* ---------- the five states ---------- */
  const states = {}, pickables = [], wide = [];
  Object.entries(data.states).forEach(([k, st]) => {
    const g = new THREE.Group();
    const fill = new THREE.MeshBasicMaterial({ color: 0x1d2125, side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 });
    const geo = new THREE.ExtrudeGeometry(st.polys.map(p => shapeOf(p)), { depth: H, bevelEnabled: false }); geo.rotateX(Math.PI / 2); geo.translate(0, H, 0);
    const mesh = new THREE.Mesh(geo, fill); mesh.userData.k = k; g.add(mesh); pickables.push(mesh);
    const county = line(IVORY, .13); g.add(segments(data.counties[k], H + .12, county));
    const edge = new LineMaterial({ color: IVORY, linewidth: 1.35, transparent: true, opacity: .8, fog: true }); wide.push(edge);
    const base = line(IVORY, .3), ticks = [];
    st.polys.forEach(p => {
      const closed = p.concat(p.slice(0, 2));
      const lg = new LineGeometry(); lg.setPositions(strip(closed, H + .16)); g.add(new Line2(lg, edge));
      g.add(segments([closed], .2, base));
      // the cut side is hatched: one stroke every couple of units along the edge
      let carry = 0;
      for (let i = 0; i + 3 < closed.length; i += 2) {
        const x0 = closed[i], y0 = closed[i + 1], dx = closed[i + 2] - x0, dy = closed[i + 3] - y0, L = Math.hypot(dx, dy);
        for (let s = carry; s < L; s += 1.6) { ticks.push(x0 + dx * s / L, .2, y0 + dy * s / L, x0 + dx * s / L, H, y0 + dy * s / L); }
        carry = (carry - L) % 1.6; if (carry < 0) carry += 1.6;
      }
    });
    const tg = new THREE.BufferGeometry(); tg.setAttribute('position', new THREE.Float32BufferAttribute(ticks, 3));
    const hatch = line(IVORY, .2); g.add(new THREE.LineSegments(tg, hatch));
    world.add(g);
    const box = new THREE.Box2(); st.polys.forEach(p => { for (let i = 0; i < p.length; i += 2) box.expandByPoint(new THREE.Vector2(p[i], p[i + 1])); });
    states[k] = { g, fill, county, edge, hatch, box };
  });

  /* ---------- the 34th parallel: the brand's own number runs through three of the five states ---------- */
  const p34 = new LineMaterial({ color: IVORY, linewidth: 1.1, transparent: true, opacity: .62, dashed: true, dashSize: 3.2, gapSize: 2.2, fog: true }); wide.push(p34);
  { const lg = new LineGeometry(); lg.setPositions(strip(data.par34, H + .5)); const l = new Line2(lg, p34); l.computeLineDistances(); world.add(l); }

  /* ---------- cities: a pin as tall as the number of dealerships, a ring at its foot, a line home to Charlotte ---------- */
  const home = data.cities.find(c => c.n === 'Charlotte');
  const ringG = new THREE.RingGeometry(1.15, 1.7, 28); ringG.rotateX(-Math.PI / 2);
  const dotG = new THREE.CircleGeometry(.75, 20); dotG.rotateX(-Math.PI / 2);
  const cities = data.cities.map(c => {
    const top = H + 7 + c.d * 3.4 + (c.n === 'Brooksville' ? 20 : c.n === 'Florence' ? 4 : 0), isHome = c === home;
    const pin = line(isHome ? RED : IVORY, .95), disc = new THREE.MeshBasicMaterial({ color: isHome ? RED : IVORY, transparent: true, opacity: .95, side: THREE.DoubleSide, depthWrite: false });
    const g = new THREE.Group();
    g.add(segments([[c.p[0], c.p[1], c.p[0], c.p[1]]], 0, pin));
    const pa = g.children[0].geometry.attributes.position; pa.setY(0, H); pa.setY(1, top);
    const ring = new THREE.Mesh(ringG, disc), dot = new THREE.Mesh(dotG, disc);
    [ring, dot].forEach(m => { m.position.set(c.p[0], H + .35, c.p[1]); g.add(m); });
    states[c.s].g.add(g);
    let arc = null;
    if (!isHome && MAIN.has(c.n) || c.n === 'Brooksville') {
      const a = new THREE.Vector3(home.p[0], H, home.p[1]), b = new THREE.Vector3(c.p[0], H, c.p[1]), m = a.clone().lerp(b, .5); m.y += a.distanceTo(b) * .3;
      const mat = line(IVORY, .34);
      const geo = new THREE.BufferGeometry().setFromPoints(new THREE.QuadraticBezierCurve3(a, m, b).getPoints(72));
      arc = { l: new THREE.Line(geo, mat), mat, n: 73 }; world.add(arc.l);
    }
    const el = document.createElement('span'); el.className = 'atlas__tag' + (isHome ? ' is-home' : '') + (LEFT.has(c.n) ? ' is-left' : ''); el.innerHTML = `<b>${c.n}</b>`; tagsBox.append(el);
    return { ...c, top, pin, disc, arc, el, anchor: new THREE.Vector3(c.p[0], top, c.p[1]) };
  });
  const parTag = document.createElement('span'); parTag.className = 'atlas__par'; parTag.innerHTML = '<b>34° N</b>'; tagsBox.append(parTag);
  const parAt = (() => { const a = data.par34, i = Math.round((a.length / 2 - 1) * .87) * 2; return new THREE.Vector3(a[i], H, a[i + 1]); })();

  /* ---------- camera ---------- */
  const rig = { x: 0, z: 10, d: 1100, e: 42, yaw: -15 }, user = { yaw: 0, pitch: 0, scroll: 0 }, intro = { t: motion ? 0 : 1 };
  let W = 1, HH = 1, usable = 1, shift = 0, focus = null, hover = null, hotCity = null, dirty = true, visible = false;
  function frameFor(k) {
    const b = k ? states[k].box : new THREE.Box2(new THREE.Vector2(-292, -135), new THREE.Vector2(292, 172));
    const w = b.max.x - b.min.x, h = b.max.y - b.min.y, e = k ? 36 : phone.matches ? 46 : 40;
    const tv = Math.tan(camera.fov / 2 * RAD), th = tv * camera.aspect, pad = k ? 1.36 : phone.matches ? 1.02 : .96;
    const d = Math.max(w * pad / (2 * th * usable), h * Math.sin(e * RAD) * pad * 1.16 / (2 * tv));
    return { x: (b.min.x + b.max.x) / 2, z: (b.min.y + b.max.y) / 2 + (k ? 2 : 14), d: Math.max(d, 330), e, yaw: k ? -9 : -14 };
  }
  function place() {
    const t = 1 - Math.pow(1 - intro.t, 3), e = (rig.e + (1 - t) * 34 + user.pitch) * RAD, yaw = (rig.yaw + user.yaw + user.scroll * (focus ? .3 : 1)) * RAD, d = rig.d * (1 + (1 - t) * .22);
    camera.position.set(rig.x + d * Math.cos(e) * Math.sin(yaw), d * Math.sin(e), rig.z + d * Math.cos(e) * Math.cos(yaw));
    camera.lookAt(rig.x, 0, rig.z);
    scene.fog.near = d * .92; scene.fog.far = d * 1.75;
  }
  const v = new THREE.Vector3();
  function tagAt(el, at, show) {
    v.copy(at).project(camera);
    const x = (v.x * .5 + .5) * W, y = (-v.y * .5 + .5) * HH;
    const on = show && v.z < 1 && x > -20 && x < W + 20 && y > 8 && y < HH;
    el.classList.toggle('is-on', on);
    el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
  }
  function draw() {
    place();
    const k = Math.max(0, Math.min(1, (intro.t - .35) / .65));
    cities.forEach(c => { if (c.arc) { c.arc.l.geometry.setDrawRange(0, Math.round(c.arc.n * k)); c.arc.l.position.y = states[c.s].g.position.y; } });
    renderer.render(scene, camera);
    const named = intro.t > .86;
    cities.forEach(c => {
      c.anchor.y = c.top + states[c.s].g.position.y;
      tagAt(c.el, c.anchor, named && (focus ? c.s === focus : MAIN.has(c.n)));
      c.el.classList.toggle('is-hot', hotCity === c.n);
    });
    tagAt(parTag, parAt, named && !focus);
  }
  const invalidate = () => { dirty = true; };
  const tick = () => { if (dirty && visible) { dirty = false; draw(); } };
  gsap.ticker.add(tick);

  /* ---------- states of attention ---------- */
  const col = new THREE.Color();
  function paint(instant) {
    const dur = instant || !motion ? 0 : .6;
    const to = (o, p) => gsap.to(o, { ...p, duration: dur, ease: 'power2.out', overwrite: 'auto', onUpdate: invalidate });
    Object.entries(states).forEach(([k, s]) => {
      const on = k === focus, hot = k === hover && !on, dim = focus && !on;
      col.set(on ? 0x343a40 : hot ? 0x292e33 : 0x1d2125);
      to(s.fill.color, { r: col.r, g: col.g, b: col.b });
      to(s.county, { opacity: on ? .34 : hot ? .26 : dim ? .07 : .13 });
      to(s.edge, { opacity: on || hot ? 1 : dim ? .4 : .8 });
      to(s.hatch, { opacity: on ? .42 : dim ? .1 : .2 });
      to(s.g.position, { y: on ? 5 : hot ? 3 : 0 });
    });
    cities.forEach(c => {
      const on = focus && c.s === focus, hot = hotCity === c.n, dim = focus && !on;
      col.set(hot || (c === home && !focus) || (on && c === home) ? RED : IVORY);
      to(c.pin.color, { r: col.r, g: col.g, b: col.b }); to(c.disc.color, { r: col.r, g: col.g, b: col.b });
      to(c.pin, { opacity: dim ? .2 : .95 }); to(c.disc, { opacity: dim ? .25 : .95 });
      if (c.arc) { const lit = on || hot || hover === c.s; col.set(lit ? RED : IVORY); to(c.arc.mat.color, { r: col.r, g: col.g, b: col.b }); to(c.arc.mat, { opacity: lit ? .95 : focus ? .08 : .34 }); }
    });
    invalidate();
  }
  function fly(instant) {
    const f = frameFor(focus);
    gsap.to(rig, { ...f, duration: instant || !motion ? 0 : 1.5, ease: 'expo.inOut', overwrite: true, onUpdate: invalidate });
    gsap.to(user, { yaw: 0, pitch: 0, duration: motion ? .9 : 0, ease: 'power2.out', onUpdate: invalidate });
  }

  /* ---------- the panel: five states, then one state's dealerships. Built from the list already on the page ---------- */
  const host = root.closest('.group');
  const dealers = {};
  host.querySelectorAll('.group__cols dl').forEach(dl => { const k = Object.keys(NAMES).find(x => NAMES[x] === dl.querySelector('dt').textContent.trim()); dealers[k] = [...dl.querySelectorAll('dd a')].map(a => ({ n: a.firstChild.textContent.trim(), c: a.querySelector('span').textContent.trim(), u: a.href })); });
  dealers.NC = [...document.querySelectorAll('.doorway ul a[href^="http"]')].map(a => { const plain = a.parentElement.querySelector('.doorway__plain'); return { n: ((plain ? plain.textContent + ' ' : '') + a.textContent).trim().replace(/\s+/g, ' '), c: 'Charlotte', u: a.href }; });
  const UP = '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7h10v10M7 17 17 7"/></svg>';
  const BACK = '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>';
  const list = document.createElement('div'); list.className = 'atlas__list';
  list.innerHTML = '<ul class="atlas__states" role="list">' + Object.keys(NAMES).map(k => `<li><button type="button" data-state="${k}"><b>${NAMES[k]}</b><span>${dealers[k].length}</span></button></li>`).join('') + '</ul>'
    + Object.keys(NAMES).map(k => { const by = {}; dealers[k].forEach(d => (by[d.c] = by[d.c] || []).push(d)); return `<div class="atlas__detail" data-detail="${k}" hidden><button type="button" class="atlas__back" data-all>${BACK} All states</button><p class="atlas__name">${NAMES[k]}</p>` + Object.entries(by).map(([c, ds]) => `<p class="atlas__city">${c}</p><ul role="list">${ds.map(d => `<li><a href="${d.u}" rel="noopener" data-city="${c}">${d.n} ${UP}</a></li>`).join('')}</ul>`).join('') + '</div>'; }).join('');
  side.append(list);
  const ul = list.querySelector('.atlas__states'), details = [...list.querySelectorAll('[data-detail]')];

  function select(k, focusPanel) {
    if (k === focus) return;
    const was = focus; focus = k; hover = null; hotCity = null;
    ul.hidden = !!k; details.forEach(d => { d.hidden = d.dataset.detail !== k; });
    root.classList.toggle('is-focused', !!k);
    const shown = k ? details.find(d => d.dataset.detail === k) : ul;
    if (motion) gsap.fromTo(shown.querySelectorAll(':scope > *, li'), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: .5, stagger: .025, delay: .25, ease: 'power2.out', clearProps: 'transform,opacity' });
    if (focusPanel) (k ? shown.querySelector('.atlas__back') : ul.querySelector(`[data-state="${was}"]`)).focus({ preventScroll: true });
    paint(); fly();
  }
  list.addEventListener('click', e => { const b = e.target.closest('[data-state]'); if (b) select(b.dataset.state, true); else if (e.target.closest('[data-all]')) select(null, true); });
  list.addEventListener('keydown', e => { if (e.key === 'Escape' && focus) { e.stopPropagation(); select(null, true); } });
  const over = (el, on) => {
    const b = el.closest('[data-state]'), a = el.closest('[data-city]');
    if (b) { hover = on ? b.dataset.state : null; paint(); } else if (a) { hotCity = on ? a.dataset.city : null; paint(); }
  };
  list.querySelectorAll('[data-state], [data-city]').forEach(el => { ['mouseenter', 'focus'].forEach(t => el.addEventListener(t, () => over(el, true))); ['mouseleave', 'blur'].forEach(t => el.addEventListener(t, () => over(el, false))); });

  /* ---------- the model answers the hand: hover lifts a state, a click flies to it, a drag turns the table a little ---------- */
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
  const pick = e => { const r = canvas.getBoundingClientRect(); ndc.set((e.clientX - r.left) / r.width * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1); ray.setFromCamera(ndc, camera); const h = ray.intersectObjects(pickables, false)[0]; return h ? h.object.userData.k : null; };
  let drag = null;
  canvas.addEventListener('pointerdown', e => { drag = { x: e.clientX, y: e.clientY, yaw: user.yaw, moved: false, id: e.pointerId }; });
  canvas.addEventListener('pointermove', e => {
    if (drag && drag.id === e.pointerId) {
      const dx = e.clientX - drag.x;
      if (Math.abs(dx) > 6) { if (!drag.moved) { drag.moved = true; canvas.setPointerCapture(e.pointerId); root.classList.add('is-dragging'); } }
      if (drag.moved) { gsap.killTweensOf(user); user.yaw = Math.max(-26, Math.min(26, drag.yaw - dx * .07)); invalidate(); }
      return;
    }
    if (!fine) return;
    const k = pick(e); root.classList.toggle('is-over', !!k && k !== focus);
    if (k !== hover) { hover = k === focus ? null : k; paint(); }
  });
  const drop = e => { const d = drag; drag = null; root.classList.remove('is-dragging'); if (!d || d.moved || e.type !== 'pointerup') return; const k = pick(e); if (k) select(k); else if (focus) select(null); };
  canvas.addEventListener('pointerup', drop); canvas.addEventListener('pointercancel', drop);
  canvas.addEventListener('pointerleave', () => { if (hover) { hover = null; root.classList.remove('is-over'); paint(); } });

  /* ---------- size, visibility, entrance ---------- */
  function size() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    W = w; HH = h;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, phone.matches ? 1.5 : 2));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    usable = phone.matches ? .96 : .68; shift = phone.matches ? 0 : .15;
    camera.setViewOffset(w, h, -w * shift, 0, w, h);
    camera.updateProjectionMatrix();
    wide.forEach(m => m.resolution.set(w, h));
    Object.assign(rig, frameFor(focus));
    invalidate();
  }
  new ResizeObserver(size).observe(canvas);
  size(); paint(true);
  let started = !motion;
  new IntersectionObserver(es => es.forEach(en => {
    visible = en.isIntersecting; if (visible) invalidate();
    if (visible && !started && en.intersectionRatio > .22) { started = true; gsap.to(intro, { t: 1, duration: 2.6, ease: 'power2.inOut', onUpdate: invalidate }); }
  }), { threshold: [0, .25] }).observe(canvas);
  if (motion) ScrollTrigger.create({ trigger: root, start: 'top bottom', end: 'bottom top', onUpdate: s => { user.scroll = (s.progress - .5) * 13; invalidate(); } });
  canvas.addEventListener('webglcontextlost', e => { e.preventDefault(); host.classList.remove('has-atlas'); });
  host.classList.add('has-atlas');
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(invalidate);
  return { select, invalidate };
}
