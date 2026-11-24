/* ZT homepage v4 · "Arrive in Charlotte" (experiment; the first map lives untouched in ../thirty-four-home-v4/).
   The same five states, now seen from the air. Scrolling carries the camera east along the 34th parallel, down through
   thin cloud, over North Carolina and into Charlotte, where the two showrooms stand. A choice takes the camera instead.
   Role: MAIN of its block; the list of dealerships on the page is complete without it.
   Budget: 60 fps on a laptop, under 60k triangles, two small textures (relief 70 KB, cloud noise made at start), no lights,
   no post-processing, DPR capped at 2 (1.5 on phones). It is loaded when the block comes near and draws only when on screen.
   Sources: US Census boundaries, roads and address points (us-atlas 3.0.1, TIGERweb, Census Geocoder); Natural Earth coasts
   (world-atlas 2.0.2); elevation from Terrain Tiles (SRTM, GMTED2010, ETOPO1). Relief is exaggerated. */
import * as THREE from 'three';
import { Line2 } from 'three/addons/lines/Line2.js';
import { LineGeometry } from 'three/addons/lines/LineGeometry.js';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';

const INK = 0x0b0c0d, IVORY = 0xefede8, RED = 0xff2d55, H = 5, RAD = Math.PI / 180;
const NAMES = { NC: 'North Carolina', AL: 'Alabama', FL: 'Florida', GA: 'Georgia', TX: 'Texas' };
const PRIORITY = ['Charlotte', 'Alvin', 'Fort Walton Beach', 'Tampa', 'Florence', 'Smyrna', 'Brooksville', 'New Port Richey', 'Tuscumbia'];
const CLOUD_Y = 30;
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const step = (a, b, v) => { const t = clamp((v - a) / (b - a)); return t * t * (3 - 2 * t); };
const rgb = h => new THREE.Vector3((h >> 16 & 255) / 255, (h >> 8 & 255) / 255, (h & 255) / 255);      // screen colour, used as it is
// the light stands 34° north of west, 34° above the horizon
const LIGHT = new THREE.Vector3(-Math.cos(34 * RAD) * Math.cos(34 * RAD), Math.sin(34 * RAD), -Math.cos(34 * RAD) * Math.sin(34 * RAD));

/* ---------- cloud noise: one 256 px sheet made once, two fields. It is read at four unrelated scales and angles, so no repeat shows ---------- */
function noiseTexture() {
  const N = 256, out = new Uint8Array(N * N * 4);
  const field = seed => {
    const a = new Float32Array(N * N); let amp = 1, lo = 1e9, hi = -1e9;
    for (let per = 4; per <= 64; per *= 2, amp *= .52) {
      const g = new Float32Array(per * per); let s = seed + per * 7919;
      for (let i = 0; i < g.length; i++) { s = Math.imul(s ^ s >>> 15, 2246822519) + 1640531527 | 0; g[i] = ((s ^ s >>> 13) >>> 0) / 4294967295; }
      for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
        const fx = x / N * per, fy = y / N * per, x0 = fx | 0, y0 = fy | 0, x1 = (x0 + 1) % per, y1 = (y0 + 1) % per;
        let u = fx - x0, w = fy - y0; u = u * u * u * (u * (u * 6 - 15) + 10); w = w * w * w * (w * (w * 6 - 15) + 10);
        a[y * N + x] += amp * ((g[y0 * per + x0] * (1 - u) + g[y0 * per + x1] * u) * (1 - w) + (g[y1 * per + x0] * (1 - u) + g[y1 * per + x1] * u) * w);
      }
    }
    for (const n of a) { if (n < lo) lo = n; if (n > hi) hi = n; }
    return a.map(n => (n - lo) / (hi - lo));
  };
  const A = field(101), B = field(907);
  for (let i = 0; i < N * N; i++) { out[i * 4] = A[i] * 255; out[i * 4 + 1] = B[i] * 255; out[i * 4 + 3] = 255; }
  const t = new THREE.DataTexture(out, N, N); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.minFilter = THREE.LinearMipmapLinearFilter; t.magFilter = THREE.LinearFilter; t.generateMipmaps = true; t.needsUpdate = true;
  return t;
}

/* the field itself: wisps drawn out along 34°, pushed aside by up to two openings */
const CLOUD = `
uniform sampler2D uNoise; uniform float uTime; uniform vec4 uHole[2]; uniform vec2 uPart; uniform float uRush;
float cloudAt(vec2 p, float sc) {
  float gate = 1.0; vec2 q = p; float edge = texture2D(uNoise, p * 0.0113).g - 0.5;
  for (int i = 0; i < 2; i++) {
    vec2 d = p - uHole[i].xy; float e = length(d / uHole[i].zw), k = i == 0 ? uPart.x : uPart.y;
    q -= d * (0.42 + 0.34 * uRush) * k * exp(-e * e * 0.7);
    gate *= mix(1.0, smoothstep(0.62, 1.42, e + edge * 0.75), k);
  }
  q *= sc;
  vec2 s = vec2(0.829 * q.x - 0.559 * q.y, 0.559 * q.x + 0.829 * q.y); s.x *= 0.56;
  float t = uTime;
  s += (texture2D(uNoise, s * 0.0017 + vec2(t * 0.00042, 0.0)).rg - 0.5) * 58.0;
  float a = texture2D(uNoise, s * 0.0029 + vec2(t * 0.00105, t * 0.0002)).r;
  float b = texture2D(uNoise, mat2(0.81, -0.59, 0.59, 0.81) * s * 0.0081 + vec2(-t * 0.0016, t * 0.0007)).g;
  float c = texture2D(uNoise, mat2(0.31, 0.95, -0.95, 0.31) * s * 0.0233 + vec2(t * 0.0031, -t * 0.0012)).r;
  return smoothstep(0.485 - 0.05 * uRush, 0.78 - 0.05 * uRush, a * 0.58 + b * 0.28 + c * 0.14) * gate;
}`;

export async function mountAtlas(root, { gsap, ScrollTrigger, motion, fine }) {
  const get = f => fetch('assets/map/' + f + '?v=35').then(r => { if (!r.ok) throw new Error(f); return r.json(); });
  const tex = f => new THREE.TextureLoader().loadAsync('assets/map/' + f + '?v=35');
  const [data, clt, relief, mask] = await Promise.all([get('southeast.json'), get('charlotte.json'), tex('relief.webp'), tex('mask.webp')]);
  const view = root.querySelector('.atlas__view'), canvas = root.querySelector('canvas'), tagsBox = root.querySelector('.atlas__tags'), side = root.querySelector('.atlas__side');
  const phone = window.matchMedia('(max-width: 900px)');
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' }); } catch (e) { return null; }
  renderer.setClearColor(INK, 0);

  const scene = new THREE.Scene(); scene.fog = new THREE.Fog(INK, 700, 1700);
  const camera = new THREE.PerspectiveCamera(26, 1, 10, 4000);
  const world = new THREE.Group(); scene.add(world);

  /* ---------- helpers ---------- */
  const line = (color, opacity) => new THREE.LineBasicMaterial({ color, transparent: true, opacity, depthWrite: false });
  const strip = (flat, y) => { const a = new Float32Array(flat.length / 2 * 3); for (let i = 0, k = 0; i < flat.length; i += 2) { a[k++] = flat[i]; a[k++] = y; a[k++] = flat[i + 1]; } return a; };
  function segments(lists, y, material) {
    let n = 0; lists.forEach(f => { n += Math.max(0, f.length / 2 - 1); });
    const a = new Float32Array(n * 6); let k = 0;
    lists.forEach(f => { for (let i = 0; i + 3 < f.length; i += 2) { a[k++] = f[i]; a[k++] = y; a[k++] = f[i + 1]; a[k++] = f[i + 2]; a[k++] = y; a[k++] = f[i + 3]; } });
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(a, 3));
    return new THREE.LineSegments(g, material);
  }
  const shapeOf = (flat, holes = []) => { const s = new THREE.Shape(); for (let i = 0; i < flat.length; i += 2) i ? s.lineTo(flat[i], flat[i + 1]) : s.moveTo(flat[i], flat[i + 1]); holes.forEach(h => { const p = new THREE.Path(); for (let i = 0; i < h.length; i += 2) i ? p.lineTo(h[i], h[i + 1]) : p.moveTo(h[i], h[i + 1]); s.holes.push(p); }); return s; };
  const wide = [];
  const fat = o => { const m = new LineMaterial({ transparent: true, fog: true, ...o }); wide.push(m); return m; };

  /* ---------- shared light: relief, a pool of light that follows the camera's subject, cloud shadow, distance ---------- */
  relief.colorSpace = mask.colorSpace = THREE.NoColorSpace;
  relief.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
  const B = clt.bounds;
  const U = {
    uRelief: { value: relief }, uMask: { value: mask }, uNoise: { value: noiseTexture() }, uTime: { value: 40 },
    uHole: { value: [new THREE.Vector4(0, 0, 60, 60), new THREE.Vector4(0, 0, 60, 60)] }, uPart: { value: new THREE.Vector2() }, uRush: { value: 0 },
    uBounds: { value: new THREE.Vector4(B[0], B[2], B[1] - B[0], B[3] - B[2]) },
    uPool: { value: new THREE.Vector3(0, 0, 400) }, uFog: { value: new THREE.Vector2(700, 1700) }, uInk: { value: rgb(INK) }, uVeil: { value: 0 }, uNear: { value: 0 }, uLight: { value: LIGHT },
  };
  const VERT = 'varying vec3 vW; varying vec3 vN; varying float vD; void main() { vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; vN = normal; vec4 m = viewMatrix * w; vD = -m.z; gl_Position = projectionMatrix * m; }';
  const HEAD = 'varying vec3 vW; varying vec3 vN; varying float vD; uniform sampler2D uRelief, uMask; uniform vec4 uBounds; uniform vec3 uPool, uInk, uBase, uLight; uniform vec2 uFog; uniform float uVeil, uDepth, uNear;\n';
  const END = 'col = mix(col, uInk, smoothstep(uFog.x, uFog.y, vD)); gl_FragColor = vec4(col, 1.0);';
  const defs = () => (phone.matches ? {} : { SHADOW: 1 });
  const topMat = (base, depth) => new THREE.ShaderMaterial({
    defines: defs(), uniforms: { ...U, uBase: { value: rgb(base) }, uDepth: { value: depth } }, side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1, vertexShader: VERT,
    fragmentShader: HEAD + CLOUD + `void main() {
      vec2 uv = (vW.xz - uBounds.xy) / uBounds.zw; float s = texture2D(uRelief, vec2(uv.x, 1.0 - uv.y)).r * 2.0 - 1.0; vec2 rim = min(uv, 1.0 - uv); s *= smoothstep(0.0, 0.05, min(rim.x, rim.y));
      float pool = 1.0 - smoothstep(0.1, 1.0, distance(vW.xz, uPool.xy) / uPool.z);
      vec3 col = uBase * mix(0.74 + 0.46 * pool, 0.34 + 0.52 * pool, uNear) * (1.0 + s * uDepth);
      col += vec3(0.052, 0.056, 0.060) * max(s, 0.0) * uDepth * (0.45 + 0.55 * pool);
      #ifdef SHADOW
      col *= 1.0 - 0.34 * uVeil * cloudAt(vW.xz + uLight.xz / uLight.y * ${CLOUD_Y.toFixed(1)}, 1.0);
      #endif
      ${END} }`,
  });
  const sideMat = new THREE.ShaderMaterial({
    uniforms: { ...U, uBase: { value: rgb(0x2a2f34) }, uDepth: { value: 1 } }, side: THREE.DoubleSide, vertexShader: VERT,
    fragmentShader: HEAD + `void main() { float l = max(dot(normalize(vN), uLight), 0.0), up = clamp(vW.y / 10.0, 0.0, 1.0), pool = 1.0 - smoothstep(0.1, 1.0, distance(vW.xz, uPool.xy) / uPool.z);
      vec3 col = uBase * (0.42 + 0.75 * l + 0.24 * pool) * (0.42 + 0.80 * up); ${END} }`,
  });

  /* ---------- sea, neighbours ---------- */
  data.coast.forEach((l, i) => world.add(segments(l, -1.1 * (i + 1), line(IVORY, [.62, .42, .3, .21, .14, .09][i]))));
  world.add(segments(data.grid, -8, line(IVORY, .055)));
  const landG = new THREE.ShapeGeometry(data.land.map(p => shapeOf(p[0], p.slice(1)))); landG.rotateX(Math.PI / 2);
  world.add(new THREE.Mesh(landG, topMat(0x101315, 1.0)));
  world.add(segments(data.ctx, .15, line(IVORY, .15)));

  /* ---------- the five states ---------- */
  const states = {}, pickables = [], shadowMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: .5, depthWrite: false, side: THREE.DoubleSide });
  const home = data.cities.find(c => c.n === 'Charlotte');
  const IGNITE = { NC: home.p, TX: [-72, 71], AL: [66, -57], GA: [127, -42], FL: [96, 40] };            // the fire starts where the dealerships are
  const FIRE = 'uniform float uFront, uHeat, uBeat;\n';
  function fireMaterial(glow) {
    const m = fat({ color: RED, linewidth: glow ? 34 : 1.8, dashed: true, depthTest: false, depthWrite: false, fog: false, ...(glow ? { blending: THREE.CustomBlending, blendEquation: THREE.MaxEquation, blendSrc: THREE.OneFactor, blendDst: THREE.OneFactor } : {}) });
    Object.assign(m.uniforms, { uFront: { value: 0 }, uHeat: { value: 0 }, uBeat: { value: 0 } });
    // the dash of the stock line becomes a burning front; vLineDistance carries the way along the border, 0 at the ignition, 1 where the two fronts meet
    m.fragmentShader = FIRE + m.fragmentShader
      .replace(/if \( vUv\.y < - 1\.0 \|\| vUv\.y > 1\.0 \) discard;[^\n]*/, '')
      .replace(/if \( mod\( vLineDistance[^\n]*/, 'float age = uFront * 1.02 - vLineDistance; if ( age < 0.0 ) discard;')
      .replace('gl_FragColor = vec4( diffuseColor.rgb, alpha );', `
        float tip = exp( -age * 30.0 ) * uHeat, ember = exp( -age * 4.6 ) * uHeat, live = 0.88 + 0.12 * sin( vLineDistance * 61.0 + uBeat * 0.8 ) * sin( vLineDistance * 23.0 - uBeat * 0.5 );
        vec3 fire = mix( diffuseColor.rgb, vec3( 1.0, 0.22, 0.03 ), clamp( ember * 1.5, 0.0, 1.0 ) );
        fire = mix( fire, vec3( 1.0, 0.70, 0.38 ), clamp( tip * 1.2, 0.0, 1.0 ) );
        ${glow ? `float cap = max( abs( vUv.y ) - 1.0, 0.0 ), nose = mix( 0.12, 1.0, sqrt( clamp( age / 0.035, 0.0, 1.0 ) ) ), reach = max( 0.0, 1.0 - length( vec2( vUv.x, cap ) ) / nose );
        alpha *= ( 0.62 * pow( reach, 2.0 ) + 0.5 * pow( reach, 6.0 ) ) * live * ( 0.07 + 0.95 * ember + 0.35 * tip );
        gl_FragColor = vec4( fire * alpha, alpha );` : 'alpha *= mix( 0.92, 1.0, ember );\n        gl_FragColor = vec4( fire, alpha );'}`);
    return m;
  }
  function fireLine(flat, start) {                                                                       // closed ring, turned so that the ignition is its first point
    let bi = 0, bd = 1e9; const n = flat.length / 2;
    for (let i = 0; i < n; i++) { const d = Math.hypot(flat[i * 2] - start[0], flat[i * 2 + 1] - start[1]); if (d < bd) { bd = d; bi = i; } }
    const ring = flat.slice(bi * 2).concat(flat.slice(0, bi * 2), flat.slice(bi * 2, bi * 2 + 2));
    const at = [0]; for (let i = 2; i < ring.length; i += 2) at.push(at[at.length - 1] + Math.hypot(ring[i] - ring[i - 2], ring[i + 1] - ring[i - 1]));
    const L = at[at.length - 1], d = new Float32Array((at.length - 1) * 2);
    for (let i = 0; i < at.length - 1; i++) { d[i * 2] = Math.min(at[i], L - at[i]) / (L / 2); d[i * 2 + 1] = Math.min(at[i + 1], L - at[i + 1]) / (L / 2); }
    const g = new LineGeometry(); g.setPositions(strip(ring, H + .2));
    const ib = new THREE.InstancedInterleavedBuffer(d, 2, 1);
    g.setAttribute('instanceDistanceStart', new THREE.InterleavedBufferAttribute(ib, 1, 0)); g.setAttribute('instanceDistanceEnd', new THREE.InterleavedBufferAttribute(ib, 1, 1));
    return g;
  }
  Object.entries(data.states).forEach(([k, st]) => {
    const g = new THREE.Group(), fill = topMat(0x1f2327, 1.0);
    const geo = new THREE.ExtrudeGeometry(st.polys.map(p => shapeOf(p)), { depth: H, bevelEnabled: false }); geo.rotateX(Math.PI / 2); geo.translate(0, H, 0);
    const mesh = new THREE.Mesh(geo, [fill, sideMat]); mesh.userData.k = k; g.add(mesh); pickables.push(mesh);
    const sg = new THREE.ShapeGeometry(st.polys.map(p => shapeOf(p))); sg.rotateX(Math.PI / 2);
    const shadow = new THREE.Mesh(sg, shadowMat); shadow.position.y = .06; world.add(shadow);
    const county = line(IVORY, .13); g.add(segments(data.counties[k], H + .12, county));
    const edge = fat({ color: IVORY, linewidth: 1.3, opacity: .78 }), ticks = [], base = line(IVORY, .24);
    const core = fireMaterial(false), glow = fireMaterial(true), fire = new THREE.Group(); fire.visible = false; g.add(fire);
    st.polys.forEach(p => {
      const closed = p.concat(p.slice(0, 2));
      const lg = new LineGeometry(); lg.setPositions(strip(closed, H + .16)); g.add(new Line2(lg, edge));
      g.add(segments([closed], .2, base));
      const fg = fireLine(p, IGNITE[k]); const big = closed.reduce((s, _, i) => (i % 2 || i < 2 ? s : s + Math.hypot(closed[i] - closed[i - 2], closed[i + 1] - closed[i - 1])), 0) > 60; [glow, core].forEach((m, i) => { if (!i && (!big || phone.matches)) return; const l = new Line2(fg, m); l.renderOrder = 6 + i; l.frustumCulled = false; fire.add(l); });
      let carry = 0;
      for (let i = 0; i + 3 < closed.length; i += 2) {
        const x0 = closed[i], y0 = closed[i + 1], dx = closed[i + 2] - x0, dy = closed[i + 3] - y0, L = Math.hypot(dx, dy);
        for (let s = carry; s < L; s += 1.6) ticks.push(x0 + dx * s / L, .2, y0 + dy * s / L, x0 + dx * s / L, H, y0 + dy * s / L);
        carry = (carry - L) % 1.6; if (carry < 0) carry += 1.6;
      }
    });
    const tg = new THREE.BufferGeometry(); tg.setAttribute('position', new THREE.Float32BufferAttribute(ticks, 3));
    const hatch = line(IVORY, .24); g.add(new THREE.LineSegments(tg, hatch));
    world.add(g);
    const box = new THREE.Box2(); st.polys.forEach(p => { for (let i = 0; i < p.length; i += 2) box.expandByPoint(new THREE.Vector2(p[i], p[i + 1])); });
    states[k] = { g, fill, county, edge, hatch, shadow, box, fire, core, glow, tone: { county: .13, edge: .78, hatch: .24 }, f: { front: 0, heat: 0, on: 0 } };
  });

  /* ---------- the 34th parallel, and the red way that runs along it to Charlotte ---------- */
  const p34 = fat({ color: IVORY, linewidth: 1.1, opacity: .62, dashed: true, dashSize: 3.2, gapSize: 2.2 });
  { const lg = new LineGeometry(); lg.setPositions(strip(data.par34, H + .5)); const l = new Line2(lg, p34); l.computeLineDistances(); world.add(l); }
  const way = fireMaterial(false); way.linewidth = 1.7; way.depthTest = false;
  const wayLine = (() => {
    const pts = []; for (let i = 0; i < data.par34.length; i += 2) if (data.par34[i] > -300 && data.par34[i] < 138) pts.push(new THREE.Vector3(data.par34[i], H + .6, data.par34[i + 1]));
    const a = pts[pts.length - 1], b = pts[pts.length - 2], turn = a.clone().add(a.clone().sub(b).multiplyScalar(2.6));
    new THREE.QuadraticBezierCurve3(a, turn, new THREE.Vector3(home.p[0], H + .6, home.p[1])).getPoints(40).slice(1).forEach(p => pts.push(p));
    const arr = new Float32Array(pts.length * 3), at = [0]; pts.forEach((p, i) => { p.toArray(arr, i * 3); if (i) at.push(at[i - 1] + p.distanceTo(pts[i - 1])); });
    const L = at[at.length - 1], d = new Float32Array((pts.length - 1) * 2); for (let i = 0; i < pts.length - 1; i++) { d[i * 2] = at[i] / L; d[i * 2 + 1] = at[i + 1] / L; }
    const g = new LineGeometry(); g.setPositions(arr); const ib = new THREE.InstancedInterleavedBuffer(d, 2, 1);
    g.setAttribute('instanceDistanceStart', new THREE.InterleavedBufferAttribute(ib, 1, 0)); g.setAttribute('instanceDistanceEnd', new THREE.InterleavedBufferAttribute(ib, 1, 1));
    const l = new Line2(g, way); l.renderOrder = 5; l.frustumCulled = false; world.add(l); return l;
  })();

  /* ---------- cities: one pin each, all the same height (the group's own counts disagree, so none is drawn) ---------- */
  const ringG = new THREE.RingGeometry(1.15, 1.6, 32); ringG.rotateX(-Math.PI / 2);
  const dotG = new THREE.CircleGeometry(.7, 24); dotG.rotateX(-Math.PI / 2);
  const SVG = 'http://www.w3.org/2000/svg', leads = root.querySelector('.atlas__leads');
  const cities = data.cities.map(c => {
    const isHome = c === home, top = H + 13;
    const pin = line(isHome ? RED : IVORY, .85), disc = new THREE.MeshBasicMaterial({ color: isHome ? RED : IVORY, transparent: true, opacity: .95, side: THREE.DoubleSide, depthWrite: false });
    const g = new THREE.Group();
    const rings = [ringG, dotG].map(q => { const m = new THREE.Mesh(q, disc); m.position.set(c.p[0], H + .35, c.p[1]); g.add(m); return m; });
    states[c.s].g.add(g);
    const el = document.createElement('span'); el.className = 'atlas__tag atlas__pill' + (isHome ? ' is-home' : ''); el.innerHTML = `<b>${c.n}</b>`; el.dataset.city = c.n; el.dataset.s = c.s; tagsBox.append(el);
    const id = 'lead-' + c.n.replace(/ /g, ''), grad = leads.querySelector('defs').appendChild(document.createElementNS(SVG, 'linearGradient')); grad.id = id; grad.setAttribute('gradientUnits', 'userSpaceOnUse');
    grad.innerHTML = '<stop offset="0" stop-opacity=".38"/><stop offset="1" stop-opacity="1"/>';
    const path = [0, 1].map(i => { const p = leads.appendChild(document.createElementNS(SVG, 'path')); if (!i) p.setAttribute('stroke', `url(#${id})`); p.setAttribute('pathLength', '1'); p.setAttribute('class', (i ? 'is-drop' : 'is-run') + (isHome ? ' is-home' : '')); return p; }); if (isHome) grad.classList.add('is-home');
    return { ...c, rings, isHome, top, pin, disc, el, b: el.firstChild, g, path, grad, foot: new THREE.Vector3(c.p[0], H + .35, c.p[1]), anchor: new THREE.Vector3(c.p[0], top, c.p[1]) };
  });
  cities.sort((a, b) => PRIORITY.indexOf(a.n) - PRIORITY.indexOf(b.n));
  /* ---------- Charlotte: the city limit, the interstates, South Tryon Street and the two addresses ---------- */
  const town = new THREE.Group(); states.NC.g.add(town);
  const tm = { city: line(IVORY, 0), county: line(IVORY, 0), roads: line(IVORY, 0), tryon: line(IVORY, 0), fill: new THREE.MeshBasicMaterial({ color: IVORY, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide }) };
  const TOWN = { city: .42, county: .2, roads: .34, tryon: .75, fill: .05 };
  { const cg = new THREE.ShapeGeometry(clt.city.map(p => shapeOf(p))); cg.rotateX(Math.PI / 2); const m = new THREE.Mesh(cg, tm.fill); m.position.y = H + .02; town.add(m); }
  ['county', 'city', 'roads', 'tryon'].forEach((k, i) => town.add(segments(clt[k], H + .03 + i * .004, tm[k])));
  const sheetMat = new THREE.ShaderMaterial({ uniforms: { ...U, uBase: { value: rgb(0x333a41) }, uA: { value: 0 } }, transparent: true, side: THREE.DoubleSide, vertexShader: VERT,
    fragmentShader: 'varying vec3 vW; varying float vD; uniform vec3 uPool, uInk, uBase; uniform vec2 uFog; uniform float uA; void main() { float p = 1.0 - smoothstep(0.1, 1.0, distance(vW.xz, uPool.xy) / uPool.z); vec3 col = mix(uBase * (0.34 + 0.52 * p), uInk, smoothstep(uFog.x, uFog.y, vD)); gl_FragColor = vec4(col, uA); }' });
  { const sg = new THREE.CircleGeometry(70, 48); sg.rotateX(-Math.PI / 2); const s = new THREE.Mesh(sg, sheetMat); s.position.set(home.p[0], H - .03, home.p[1]); s.renderOrder = 1; town.add(s); }
  const rooms = {};
  const rr = new THREE.RingGeometry(.075, .105, 40); rr.rotateX(-Math.PI / 2); const rd = new THREE.CircleGeometry(.042, 24); rd.rotateX(-Math.PI / 2);
  clt.rooms.forEach(r => {
    const pin = line(IVORY, 0), disc = new THREE.MeshBasicMaterial({ color: IVORY, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false });
    
    [rr, rd].forEach(q => { const m = new THREE.Mesh(q, disc); m.position.set(r.p[0], H + .06, r.p[1]); town.add(m); });
    rooms[r.id] = { ...r, pin, disc, anchor: new THREE.Vector3(r.p[0], H + .06, r.p[1]), foot: new THREE.Vector3(r.p[0], H + .06, r.p[1]) };
  });

  /* ---------- the air: a thin broken layer, and on larger screens a second, fainter one above it ---------- */
  const airMat = (scale, strength) => new THREE.ShaderMaterial({
    uniforms: { ...U, uGain: { value: strength }, uScale: { value: scale }, uCam: { value: 1 } }, transparent: true, depthWrite: false, side: THREE.DoubleSide, vertexShader: VERT.replace('vN = normal;', ''),
    fragmentShader: 'varying vec3 vW; varying float vD; uniform sampler2D uMask; uniform vec4 uBounds; uniform vec3 uLight; uniform float uGain, uScale, uCam, uVeil;\n' + CLOUD + `void main() {
      vec2 p = vW.xz, f = (p - uBounds.xy) / uBounds.zw, q = min(f, 1.0 - f);
      float n = cloudAt(p, uScale); if (n < 0.004) discard;
      float lit = clamp(0.5 + (n - cloudAt(p + uLight.xz * 13.0 / uScale, uScale)) * 0.9, 0.0, 1.0);
      float over = texture2D(uMask, vec2(f.x, 1.0 - f.y)).r;
      float a = n * uGain * uVeil * (1.0 - 0.42 * over) * smoothstep(0.0, 0.22, q.x) * smoothstep(0.0, 0.22, q.y) * uCam;
      gl_FragColor = vec4(mix(vec3(0.36, 0.40, 0.44), vec3(0.86, 0.88, 0.90), lit), a); }`,
  });
  const airs = [[CLOUD_Y, 1, .4], [CLOUD_Y + 26, .62, .2], [330, .5, .62]].map(([y, s, g], i) => {
    const pg = new THREE.PlaneGeometry(B[1] - B[0], B[3] - B[2]); pg.rotateX(-Math.PI / 2);
    const m = new THREE.Mesh(pg, airMat(s, g)); m.position.set((B[0] + B[1]) / 2, y, (B[2] + B[3]) / 2); m.renderOrder = 4; m.raycast = () => {}; world.add(m);
    return { m, y, top: i === 1, high: i === 2 };
  });

  /* ---------- what the page knows: dealerships by state, showrooms by address ---------- */
  const host = root.closest('.group'), dealers = {};
  host.querySelectorAll('.group__cols dl').forEach(dl => { const k = Object.keys(NAMES).find(x => NAMES[x] === dl.querySelector('dt').textContent.trim()); dealers[k] = [...dl.querySelectorAll('dd a')].map(a => ({ n: a.firstChild.textContent.trim(), c: a.querySelector('span').textContent.trim(), u: a.href })); });
  const doors = [...document.querySelectorAll('.doorway')].map((d, i) => ({
    id: ['kenley', 'tryon'][i], no: d.querySelector('.doorway__title span').textContent.trim(), st: d.querySelector('.doorway__title').lastChild.textContent.trim(), dir: d.querySelector('.doorway__foot a').href, zip: d.querySelector('.doorway__foot span').textContent.trim(),
    items: [...d.querySelectorAll('li')].map(li => { const a = li.querySelector('a[href^="http"]'), m = li.querySelector('.mark'), p = li.querySelector('.doorway__plain'); return { u: a.href, n: ((p ? p.textContent + ' ' : '') + a.textContent).trim().replace(/\s+/g, ' '), mark: m ? [...m.classList].find(c => c.startsWith('mark--')) : null }; }),
  }));
  const UP = '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7h10v10M7 17 17 7"/></svg>';
  const DOWN = '<svg class="ico atlas__chev" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';
  const PIN = '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11Z"/><circle cx="12" cy="10" r="2.2"/></svg>';
  const placesOf = k => (k === 'NC' ? ['Charlotte'] : [...new Set(dealers[k].map(d => d.c))]);
  const group = (title, rows, foot = '') => `<div class="atlas__group">${title}<ul role="list">${rows}</ul>${foot}</div>`;
  const row = (u, n, at) => `<li><a href="${u}" rel="noopener" data-at="${at}"><em>${n}</em> ${UP}</a></li>`;
  const touch = !fine, CLICK = touch ? 'Tap' : 'Click';
  const backBtn = document.createElement('button'); backBtn.type = 'button'; backBtn.className = 'atlas__back'; backBtn.hidden = true; backBtn.innerHTML = '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5M12 19l-7-7 7-7"/></svg> All states';
  const hint = document.createElement('p'); hint.className = 'atlas__hint'; hint.textContent = 'Choose a state to see its dealerships.';
  const help = document.createElement('p'); help.className = 'atlas__help'; help.setAttribute('aria-hidden', 'true'); view.append(help);
  const tip = document.createElement('span'); tip.className = 'atlas__tip'; tip.setAttribute('aria-hidden', 'true'); view.append(tip);
  const list = document.createElement('div'); list.className = 'atlas__list';
  list.innerHTML = '<ul class="atlas__states" role="list">' + Object.keys(NAMES).map(k => `<li data-li="${k}"><button type="button" class="atlas__state" data-state="${k}" aria-expanded="false" aria-controls="atlas-${k}"><b>${NAMES[k]}</b>${DOWN}<span>${placesOf(k).join(', ')}</span></button><div class="atlas__detail" id="atlas-${k}" data-detail="${k}" hidden>` + (k === 'NC'
    ? doors.map(d => group(`<p class="atlas__place">${d.no} ${d.st}</p><p class="atlas__zip">${d.zip}</p>`, d.items.map(i => row(i.u, i.n, d.id)).join(''), `<p class="atlas__acts"><button type="button" class="atlas__city" data-room="${d.id}" aria-pressed="false">${PIN}<span class="sr">${d.no} ${d.st}: </span><span>Show on map</span></button><a href="${d.dir}" rel="noopener">${UP}<span>Directions<span class="sr"> to ${d.no} ${d.st}</span></span></a></p>`)).join('')
    : placesOf(k).map(p => group(`<p class="atlas__place">${p}</p>`, dealers[k].filter(d => d.c === p).map(d => row(d.u, d.n, p)).join(''))).join('')) + '</div></li>').join('') + '</ul>';
  side.append(hint, backBtn, list);
  const items = [...list.querySelectorAll('[data-li]')], details = [...list.querySelectorAll('[data-detail]')], stateBtn = k => list.querySelector(`[data-state="${k}"]`);
  doors.forEach(d => {
    const el = document.createElement('span'); el.className = 'atlas__tag atlas__addr'; el.dataset.room = d.id; el.dataset.side = d.id === 'kenley' ? 'left' : 'right';
    el.innerHTML = `<b><strong>${d.no}</strong> ${d.st}<span>${d.items.filter(i => i.mark).map(i => `<i class="mark ${i.mark}"></i>`).join('')}</span></b>`; tagsBox.append(el); rooms[d.id].el = el; rooms[d.id].b = el.firstChild;
  });

  /* ---------- camera: a position is {x, z, d, e, yaw}. The scroll has one, a choice has one, and the second takes over from the first ---------- */
  let edge = 8, W = 1, HH = 1, usable = 1, shift = 0, dirty = true, visible = false, prog = 0, sel = null, selAt = 0, active = null, hover = null, hot = null, labels = 0, still = 0, lift = 0;
  const intro = { t: motion ? 0 : 1 }, mix = { t: 1 }, cloud = { veil: motion ? 0 : 1 }, air = { rush: 0 };
  let rig = null, from = null, slot = 0;
  const part = [{ v: 0 }, { v: 0 }];
  const fit = (w, h, e, pad) => { const tv = Math.tan(camera.fov / 2 * RAD), th = tv * camera.aspect; return Math.max(w * pad / (2 * th * usable), h * Math.sin(e * RAD) * pad * 1.16 / (2 * tv)); };
  function frame(s) {
    if (s && s.k === 'NC' && s.city) { const a = rooms.kenley.p, b = rooms.tryon.p; return { x: (a[0] + b[0]) / 2, z: (a[1] + b[1]) / 2 - .5, d: phone.matches ? 23 : 15, e: 42, yaw: -17 }; }
    if (s && s.k !== 'ALL') { const b = states[s.k].box, w = b.max.x - b.min.x, h = b.max.y - b.min.y; return { x: (b.min.x + b.max.x) / 2, z: (b.min.y + b.max.y) / 2 + 2, d: Math.max(fit(w, h, 36, phone.matches ? 1.12 : 1.36), 300), e: phone.matches ? 42 : 36, yaw: -9 }; }
    return phone.matches ? { x: 36, z: 24, d: fit(470, 300, 54, 1.04), e: 54, yaw: -10 } : { x: 6, z: 32, d: fit(584, 307, 40, .96), e: 40, yaw: -14 };
  }
  // zooming keeps the target's way across the screen straight: the ground moves with the distance, not with the clock
  function between(a, b, t) {
    const d = a.d * Math.pow(b.d / a.d, t), w = Math.abs(b.d / a.d - 1) > .15 ? (a.d - d) / (a.d - b.d) : t;
    return { x: a.x + (b.x - a.x) * w, z: a.z + (b.z - a.z) * w, d, e: a.e + (b.e - a.e) * t, yaw: a.yaw + (b.yaw - a.yaw) * t };
  }
  const K = [[0, 'ALL'], [.1, 'ALL'], [.4, 'WAY'], [.6, 'NC'], [.68, 'NC'], [.9, 'CLT'], [1, 'CLT']];
  const keyOf = n => (n === 'WAY' ? { x: 92, z: -4, d: frame(null).d * .56, e: 30, yaw: -31 } : n === 'CLT' ? frame({ k: 'NC', city: 'Charlotte' }) : frame({ k: n }));
  function journey(p) {
    let i = 0; while (i < K.length - 2 && p > K[i + 1][0]) i++;
    const t = clamp((p - K[i][0]) / (K[i + 1][0] - K[i][0])); return between(keyOf(K[i][1]), keyOf(K[i + 1][1]), t * t * (3 - 2 * t));
  }
  const target = () => (sel ? frame(sel) : journey(prog));

  /* ---------- names: they come when the camera is still, take the first free place, and never lie on each other ---------- */
  const DIRS = { Charlotte: [[1, -1], [-1, -1]], Alvin: [[1, 1], [-1, 1]], Tampa: [[-1, 1], [1, 1]], Florence: [[-1, -1], [-1, 1]], Smyrna: [[-1, -1], [1, -1]], 'Fort Walton Beach': [[1, 1], [-1, 1]], Brooksville: [[1, -1], [1, 1]], 'New Port Richey': [[-1, 1]], Tuscumbia: [[-1, 1], [-1, -1]] };
  const MAIN = new Set(['Charlotte', 'Alvin', 'Tampa', 'Florence', 'Smyrna', 'Fort Walton Beach']);
  const SMALL = new Set(['Charlotte', 'Alvin', 'Tampa', 'Florence']);
  // a straight line with one bend: from the place at 34 degrees, then level into the side of the pill (Alex, 24 Nov 2026)
  const RISE = Math.tan(34 * RAD), RUN = 132, LEVEL = 22;
  const bend = (x, y, [sx, sy], k) => [x + sx * RUN * k, y + sy * RUN * k * RISE];
  function pillAt(x, y, w, h, s, k) { const [bx, by] = bend(x, y, s, k), ax = bx + s[0] * LEVEL; return [s[0] > 0 ? ax : ax - w, by - h / 2, w, h]; }
  function lead(x, y, s, k) { const [bx, by] = bend(x, y, s, k), f = n => n.toFixed(1); return [`M${f(x)} ${f(y)}L${f(bx)} ${f(by)}`, `M${f(bx)} ${f(by)}H${f(bx + s[0] * LEVEL)}`]; }
  const cross = (a, b) => { const o = (p, q, r) => (q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0]); return o(a[0], a[1], b[0]) * o(a[0], a[1], b[1]) < 0 && o(b[0], b[1], a[0]) * o(b[0], b[1], a[1]) < 0; };
  const v = new THREE.Vector3(), PLACES = ['right', 'left', 'up', 'down'];
  const at = p => { v.copy(p).project(camera); return [(v.x * .5 + .5) * W, (-v.y * .5 + .5) * HH, v.z < 1]; };
  const boxOf = (x, y, w, h, s) => (s === 'right' ? [x + 22, y - h / 2, x + 22 + w, y + h / 2] : s === 'left' ? [x - 22 - w, y - h / 2, x - 22, y + h / 2] : s === 'up' ? [x - w / 2, y - h - 16, x + w / 2, y - 16] : [x - w / 2, y + 16, x + w / 2, y + 16 + h]);
  function names(place) {
    const near = rig.d < 34, mid = rig.d < 110, regional = !sel ? prog < .11 : sel.k === 'ALL', shown = intro.t > .9 && labels > .5, taken = [];
    const x0 = edge, put = (o, el, b, anchor, on, fixed) => {
      const [x, y, front] = at(anchor); let ok = on && shown && front && x > x0 - 40 && x < W && y > 10 && y < HH - 6;
      if (ok && place) {
        const w = b.offsetWidth, h = b.offsetHeight; let found = null;
        for (const s of fixed || PLACES) { const r = boxOf(x, y, w, h, s); if (r[0] < x0 || r[2] > W - 8 || r[1] < (phone.matches ? 64 : 6) || r[3] > HH - 4) continue; if (taken.some(t => r[0] < t[2] + 4 && r[2] > t[0] - 4 && r[1] < t[3] + 2 && r[3] > t[1] - 2)) continue; found = s; taken.push(r); break; }
        o.side = found; if (found) el.dataset.side = found;
      }
      ok = ok && !!o.side; el.classList.toggle('is-on', ok); el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
    };
    Object.values(rooms).forEach(r => { r.anchor.y = H + .06 + lift; put(r, r.el, r.b, r.anchor, near, r.id === 'kenley' ? ['left', 'down', 'up'] : ['right', 'up', 'left', 'down']); r.el.classList.toggle('is-hot', hot === r.id); });
    const base = near ? 0 : regional ? (phone.matches ? .34 : .6) : (phone.matches ? .46 : .8), pins = [], runs = [], segs = [], along = (x, y, s, k) => { const [bx, by] = bend(x, y, s, k), o = []; for (let i = 2; i <= 10; i++) o.push([x + (bx - x) * i / 10, y + (by - y) * i / 10]); o.push([bx + s[0] * LEVEL / 2, by]); return o; };
    cities.forEach(c => { c.foot.y = H + .35 + states[c.s].g.position.y; c.xy = at(c.foot); if (c.xy[2]) pins.push(c); });
    cities.forEach(c => {
      const [x, y, front] = c.xy, want = !mid && (regional ? (phone.matches ? SMALL : MAIN).has(c.n) : c.s === active);
      let ok = want && shown && front && x > x0 - 40 && x < W && y > 10 && y < HH - 6;
      if (ok && place) {
        const w = c.b.offsetWidth, h = c.b.offsetHeight; c.spot = null;
        // first a place whose line crosses no other; only if there is none, one that does
        search: for (const clean of [true, false]) for (const s of [...DIRS[c.n], [1, 1], [-1, 1], [1, -1], [-1, -1]]) for (const k of regional ? [1, .74, 1.32, 1.7, 2.1] : c.n === 'Fort Walton Beach' ? [.6, .8, 1, 1.4, 2] : [1.5, 2, 1.2, 1, .74, 2.6, .5]) {
          const r = pillAt(x, y, w, h, s, base * k); if (r[0] < x0 + 6 || r[0] + w > W - 12 || r[1] < (phone.matches ? 66 : 64) || r[1] + h > HH - (phone.matches ? 40 : 66)) continue;
          if (taken.some(t => r[0] < t[2] + 8 && r[0] + w > t[0] - 8 && r[1] < t[3] + 6 && r[1] + h > t[1] - 6)) continue;
          if (pins.some(q => MAIN.has(q.n) && q.xy[0] > r[0] - 6 && q.xy[0] < r[0] + w + 6 && q.xy[1] > r[1] - 6 && q.xy[1] < r[1] + h + 6)) continue;
          const way = along(x, y, s, base * k), seg = [[x, y], bend(x, y, s, base * k)];
          if (clean && way.some(p => taken.some(t => p[0] > t[0] - 4 && p[0] < t[2] + 4 && p[1] > t[1] - 4 && p[1] < t[3] + 4))) continue;
          if (clean && runs.some(p => p[0] > r[0] - 5 && p[0] < r[0] + w + 5 && p[1] > r[1] - 5 && p[1] < r[1] + h + 5)) continue;
          if (clean && segs.some(q => cross(q, seg))) continue;
          runs.push(...way); segs.push(seg); c.spot = [s, base * k]; taken.push([r[0], r[1], r[0] + w, r[1] + h]); break search;
        }
      }
      ok = ok && !!c.spot; c.el.classList.toggle('is-on', ok); c.path.forEach(p => p.classList.toggle('is-on', ok));
      const lit = hot === c.n || !!sel && sel.city === c.n; c.el.classList.toggle('is-hot', lit); c.path.forEach(p => p.classList.toggle('is-hot', lit));
      if (ok) {
        const r = pillAt(x, y, c.b.offsetWidth, c.b.offsetHeight, ...c.spot); c.el.style.transform = `translate3d(${r[0].toFixed(1)}px, ${r[1].toFixed(1)}px, 0)`;
        lead(x, y, ...c.spot).forEach((d, i) => c.path[i].setAttribute('d', d)); const [bx, by] = bend(x, y, ...c.spot); Object.entries({ x1: x, y1: y, x2: bx, y2: by }).forEach(([n, q]) => c.grad.setAttribute(n, q.toFixed(1)));
      }
    });
  }

  /* ---------- one frame ---------- */
  function draw() {
    const to = target(), t = 1 - Math.pow(1 - intro.t, 3);
    rig = from && mix.t < 1 ? between(from, to, mix.t) : to;
    const e = (rig.e + (1 - t) * 30) * RAD, yaw = rig.yaw * RAD, d = rig.d * (1 + (1 - t) * .2);
    lift = states.NC.g.position.y; const gy = lift * step(160, 30, d) + H * step(160, 30, d);
    camera.position.set(rig.x + d * Math.cos(e) * Math.sin(yaw), gy + d * Math.sin(e), rig.z + d * Math.cos(e) * Math.cos(yaw));
    camera.lookAt(rig.x, gy, rig.z);
    camera.near = Math.max(.4, d * .05); camera.far = Math.max(900, d * 3.4); camera.updateProjectionMatrix();
    scene.fog.near = U.uFog.value.x = d < 80 ? 60 + d * 3 : d * .92; scene.fog.far = U.uFog.value.y = d < 80 ? 190 + d * 7 : d * 1.75;
    U.uPool.value.set(rig.x, rig.z, d < 60 ? d * .5 : Math.max(30, d * .62)); U.uNear.value = step(110, 30, d); U.uVeil.value = cloud.veil * t * (1 + .45 * air.rush); U.uPart.value.set(part[0].v, part[1].v);
    U.uRush.value = air.rush; const dive = Math.max(air.rush, sel || phone.matches ? 0 : step(.1, .18, prog) * (1 - step(.34, .44, prog)) * .8);
    airs.forEach(a => { if (a.high) { const h = camera.position.y - a.y, q = phone.matches ? 0 : dive * step(8, 130, h) * (1 - step(330, 620, h)); a.m.visible = q > .01; a.m.material.uniforms.uCam.value = q; return; } const c = step(6, 70, Math.abs(camera.position.y - a.y)) * (camera.position.y > a.y ? 1 : 0); a.m.visible = c > .01 && !(a.top && phone.matches); a.m.material.uniforms.uCam.value = c; });
    const c = step(95, 34, d); town.visible = c > .01; sheetMat.uniforms.uA.value = step(.15, .75, c); Object.keys(tm).forEach(k => { tm[k].opacity = TOWN[k] * c; });
    Object.values(rooms).forEach(r => { r.pin.opacity = r.disc.opacity = .95 * c; });
    Object.values(states).forEach(s => {
      s.county.opacity = s.tone.county * (s === states.NC ? 1 - c : 1); s.edge.opacity = s.tone.edge * (1 - c); s.hatch.opacity = s.tone.hatch * (1 - c);
      const y = s.g.position.y; s.shadow.position.set((y + H) * .62, .06, (y + H) * .42);
      const f = s.f; s.fire.visible = f.on > .01; [s.core, s.glow].forEach((m, i) => { m.uniforms.uFront.value = f.front; m.uniforms.uHeat.value = f.heat; m.uniforms.uBeat.value = U.uTime.value; m.opacity = f.on * (1 - c); });
    });
    const run = sel ? 0 : step(.08, .58, prog); way.uniforms.uFront.value = run; way.uniforms.uHeat.value = run < 1 ? .55 * (1 - step(.54, .64, prog)) : 0; way.opacity = (sel ? 0 : 1) * (1 - step(.62, .74, prog)) * .95; wayLine.visible = run > .001 && way.opacity > .01;
    const rs = clamp(d / 520, .3, 1);
    cities.forEach(q => { q.rings.forEach(r => r.scale.setScalar(rs)); q.g.visible = !(q.isHome && c > .5); });
    renderer.render(scene, camera);
    names(still === 1); if (still === 1) still = 2;
  }
  const invalidate = () => { dirty = true; };
  let busy = 0, calm = 0, n = 0;
  const wake = () => { calm = 0; };
  const moved = () => { busy = performance.now(); labels = 0; still = 0; invalidate(); };
  function rush(peak, up, downT) { if (!motion) return; gsap.killTweensOf(air); gsap.timeline({ onUpdate: invalidate }).to(air, { rush: peak, duration: up, ease: 'power2.out' }).to(air, { rush: 0, duration: downT, ease: 'power2.inOut' }); }
  function tick(time, dt) {
    if (!visible) return;
    const now = performance.now();
    if (!still && now - busy > 160) { still = 1; labels = 1; dirty = true; }
    // the air drifts at half the frame rate, rests after a minute and a half without a visitor's hand, and stands still on phones
    if (motion && !phone.matches) { calm += dt / 1000; const sp = 1 - step(84, 94, calm); if (sp > 0) { U.uTime.value += dt / 1000 * sp * (6.5 + 26 * air.rush); if (++n % 2 === 0) dirty = true; } }
    if (dirty) { dirty = false; draw(); }
  }

  /* ---------- states of attention ---------- */
  const col = new THREE.Color();
  function paint(instant) {
    const dur = instant || !motion ? 0 : .7;
    const to = (o, p) => gsap.to(o, { ...p, duration: dur, ease: 'power2.out', overwrite: 'auto', onUpdate: invalidate });
    Object.entries(states).forEach(([k, s]) => {
      const on = k === active, warm = k === hover && !on, dim = active && !on, c = rgb(on ? 0x333a41 : warm ? 0x2a2f35 : 0x1f2327);
      to(s.fill.uniforms.uBase.value, { x: c.x, y: c.y, z: c.z });
      to(s.tone, { edge: on ? .5 : warm ? 1 : dim ? .4 : .78, hatch: on ? .4 : dim ? .1 : .24, county: on ? .3 : warm ? .24 : dim ? .07 : .13 });
      to(s.g.position, { y: on ? 5 : warm ? 2.6 : 0 });
    });
    cities.forEach(c => {
      const on = active && c.s === active, lit = hot === c.n || (sel && sel.city === c.n), dim = active && !on;
      col.set(lit || c.isHome && (!active || on) ? RED : IVORY); to(c.pin.color, { r: col.r, g: col.g, b: col.b }); to(c.disc.color, { r: col.r, g: col.g, b: col.b });
      to(c.pin, { opacity: dim ? .18 : .85 }); to(c.disc, { opacity: dim ? .25 : .95 });
    });
    Object.values(rooms).forEach(r => { col.set(hot === r.id || sel && sel.room === r.id ? RED : IVORY); to(r.pin.color, { r: col.r, g: col.g, b: col.b }); to(r.disc.color, { r: col.r, g: col.g, b: col.b }); });
    invalidate();
  }
  // the border takes fire at the dealerships, two fronts run round and meet, then it cools to a clean line
  function burn(k, on) {
    const f = states[k].f; gsap.killTweensOf(f);
    if (!on) { gsap.to(f, { on: 0, heat: 0, duration: motion ? .7 : 0, ease: 'power2.out', onUpdate: invalidate }); return; }
    if (!motion) { Object.assign(f, { front: 1, heat: 0, on: 1 }); invalidate(); return; }
    Object.assign(f, { front: 0, heat: 1, on: 1 });
    const s = phone.matches ? .7 : 1;
    gsap.to(f, { front: 1, duration: 1.75 * s, delay: .3 * s, ease: 'power1.inOut', onUpdate: invalidate });
    gsap.to(f, { heat: 0, duration: 1.6 * s, delay: 1.85 * s, ease: 'power2.out', onUpdate: invalidate });
  }
  // the air opens over the subject with the camera and closes behind it more slowly
  function open(region) {
    const t = p => ({ duration: motion ? p : 0, ease: 'power2.inOut', overwrite: true, onUpdate: invalidate });
    if (!region) { part.forEach(p => gsap.to(p, { v: 0, ...t(3.2) })); return; }
    gsap.to(part[slot], { v: 0, ...t(2.6) }); slot = 1 - slot;
    U.uHole.value[slot].set(region[0], region[1], region[2], region[3]); part[slot].v = 0; gsap.to(part[slot], { v: 1, ...t(1.75), delay: motion ? .45 : 0 });
  }
  let openKey = '';
  function attend() {
    const next = sel ? (sel.k === 'ALL' ? null : sel.k) : prog > .44 ? 'NC' : null, city = sel ? sel.city : null;
    if (next !== active) { if (active) burn(active, false); active = next; if (active) burn(active, true); hover = null; paint(); }
    const key = (next || '') + (city || '');
    if (key !== openKey) {
      openKey = key;
      if (!next) open(null);
      else { const b = states[next].box; open([(b.min.x + b.max.x) / 2, (b.min.y + b.max.y) / 2, Math.max(62, (b.max.x - b.min.x) * .66), Math.max(52, (b.max.y - b.min.y) * .72)]); }
    }
  }

  /* ---------- the panel ---------- */
  let shownKey = 'ALL', lastKey = false;
  document.addEventListener('keydown', () => { lastKey = true; }, true); ['pointerdown', 'wheel'].forEach(t => document.addEventListener(t, () => { lastKey = false; }, { capture: true, passive: true }));
  function panel(focusTo) {
    const key = active || 'ALL', near = sel ? !!sel.city : prog > .76;
    if (!focusTo && key !== shownKey && document.activeElement.closest('.atlas__detail') && document.activeElement.matches(':focus-visible') && lastKey) return;   // never pulled away from under the keyboard
    if (key !== shownKey) {
      const was = shownKey; shownKey = key;
      items.forEach(li => { const on = li.dataset.li === key; li.classList.toggle('is-open', on); li.firstChild.setAttribute('aria-expanded', String(on)); li.lastChild.hidden = !on; });
      root.classList.toggle('is-focused', key !== 'ALL'); backBtn.hidden = key === 'ALL'; hint.hidden = key !== 'ALL';
      const li = items.find(q => q.dataset.li === key);
      if (li && motion) gsap.fromTo(li.lastChild.children, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: .5, stagger: .05, delay: .15, ease: 'power2.out', clearProps: 'transform,opacity' });
      if (li && !phone.matches) list.scrollTop = Math.max(0, li.offsetTop - list.offsetTop - 8); else if (!li) list.scrollTop = 0;
      if (focusTo && lastKey) stateBtn(key === 'ALL' ? was : key).focus({ preventScroll: true });
      if (phone.matches && focusTo) { const y = (li ? li.getBoundingClientRect().top - view.offsetHeight - backBtn.offsetHeight : root.getBoundingClientRect().top) + window.scrollY; window.ztLenis ? window.ztLenis.scrollTo(y, { immediate: true, force: true }) : window.scrollTo(0, y); }
    }
    const say = key === 'ALL' ? [`${CLICK} a state to zoom in`, ...(motion && !phone.matches && prog < .1 ? ['Scroll to travel to Charlotte'] : [])] : near ? [`${CLICK} the map to zoom out`] : key === 'NC' ? [`${CLICK} again to enter Charlotte`, `${CLICK} outside to zoom out`] : [`${CLICK} outside to zoom out`], sig = say.join('|');
    if (help.dataset.sig !== sig) { help.dataset.sig = sig; help.innerHTML = say.map(t => `<span>${t}</span>`).join(''); }
    if (key !== 'NC') return;
    list.querySelectorAll('.atlas__city').forEach(b => { const on = !!sel && sel.room === b.dataset.room; b.setAttribute('aria-pressed', String(on)); b.lastChild.textContent = on ? 'On the map' : 'Show on map'; });
  }
  function select(next, focusTo) {
    if (JSON.stringify(next) === JSON.stringify(sel)) return;
    from = rig ? { ...rig } : null;
    const far = !next || next.k === 'ALL';
    hush(); sel = next; selAt = prog; hot = null; mix.t = 0; wake();
    rush(far ? .45 : phone.matches ? .5 : 1, .55, far ? 1.8 : 1.7);
    gsap.killTweensOf(mix); gsap.to(mix, { t: 1, duration: motion ? (far ? 2.1 : 2.2) : 0, ease: 'power3.inOut', onUpdate: moved, onComplete: moved });
    attend(); paint(); panel(focusTo); moved();
  }
  const home0 = () => (!motion || phone.matches || prog < .1 ? null : { k: 'ALL' });
  const back = () => (sel && sel.city ? select({ k: 'NC' }) : select(home0(), true));
  backBtn.addEventListener('click', () => select(home0(), true));
  list.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.state) { if (b.dataset.state === active) select(home0(), true); else select({ k: b.dataset.state }, true); }
    else if (b.dataset.room) select(sel && sel.room === b.dataset.room ? { k: 'NC', city: 'Charlotte' } : { k: 'NC', city: 'Charlotte', room: b.dataset.room });
  });
  // Escape works wherever the focus is, as long as the map is on screen and nothing lies over the page
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape' || e.defaultPrevented || !visible || !active || document.querySelector('.nav.is-open, .stage.is-open')) return;
    if (!sel && !side.contains(document.activeElement)) return;                                           // the scroll brought us here: nothing was chosen
    e.preventDefault(); back();
  });

  // the panel keeps the wheel only while it has something to scroll
  list.addEventListener('pointermove', () => list.toggleAttribute('data-lenis-prevent', !phone.matches && list.scrollHeight > list.clientHeight + 2), { passive: true });
  const over = (el, on) => {
    wake();
    if (el.dataset.state) { hover = on ? el.dataset.state : null; paint(); return; }
    const key = el.dataset.at || el.dataset.room || el.dataset.city; hot = on ? key : null;
    paint();
  };
  root.querySelectorAll('[data-state], [data-at], .atlas__list [data-room], .atlas__tag b').forEach(el => {
    const o = el.matches('b') ? el.parentNode : el;
    (fine ? ['mouseenter', 'focus'] : ['focus']).forEach(t => el.addEventListener(t, () => over(o, true))); ['mouseleave', 'blur'].forEach(t => el.addEventListener(t, () => over(o, false)));
  });
  tagsBox.addEventListener('click', e => {
    const t = e.target.closest('.atlas__tag'); if (!t) return;
    if (t.dataset.room) select({ k: 'NC', city: 'Charlotte', room: t.dataset.room });
    else if (t.dataset.s !== active) select({ k: t.dataset.s }, true);
    else if (t.dataset.city === 'Charlotte') select({ k: 'NC', city: 'Charlotte' });
  });

  /* ---------- the model answers the hand: one click, and a tag at the pointer that says what it will do ---------- */
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
  const pick = e => { const r = canvas.getBoundingClientRect(); ndc.set((e.clientX - r.left) / r.width * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1); ray.setFromCamera(ndc, camera); const h = ray.intersectObjects(pickables, false)[0]; return h ? h.object.userData.k : null; };
  // what a click here would do: [words, cursor, action]
  function deed(k) {
    if (rig.d < 110) return ['Click to zoom out', 'zoom-out', () => (sel && sel.city ? select({ k: 'NC' }) : select(home0(), true))];
    if (k && k !== active) return [`<b>${NAMES[k]}</b> Click to zoom in`, 'zoom-in', () => select({ k }, true)];
    if (k === 'NC' && active === 'NC') return ['<b>Charlotte</b> Click to enter', 'zoom-in', () => select({ k: 'NC', city: 'Charlotte' })];
    if (!k && active) return ['Click to zoom out', 'zoom-out', () => select(home0(), true)];
    return null;
  }
  let down = null, tipOn = false;
  const hush = () => { if (tipOn) { tipOn = false; tip.classList.remove('is-on'); } };
  canvas.addEventListener('pointerdown', e => { down = { x: e.clientX, y: e.clientY }; wake(); });
  canvas.addEventListener('pointermove', e => {
    wake(); if (!fine || e.pointerType === 'touch' || !rig) return;
    const k = pick(e), d = deed(k), r = view.getBoundingClientRect(), x = e.clientX - r.left, near = rig.d < 110;
    canvas.style.cursor = d ? d[1] : 'default';
    if (d && x > W * .29 && mix.t >= 1) { if (tip.dataset.t !== d[0]) { tip.dataset.t = d[0]; tip.innerHTML = d[0]; } tip.style.transform = `translate3d(${Math.min(x + 18, W - tip.offsetWidth - 10).toFixed(0)}px, ${Math.min(e.clientY - r.top + 22, HH - 44).toFixed(0)}px, 0)`; if (!tipOn) { tipOn = true; tip.classList.add('is-on'); } } else hush();
    const over = near || k === active ? null : k; if (over !== hover) { hover = over; paint(); }
  });
  canvas.addEventListener('pointerup', e => { const d = down; down = null; if (!d || Math.hypot(e.clientX - d.x, e.clientY - d.y) > 8) return; const a = deed(pick(e)); hush(); if (a) a[2](); });
  canvas.addEventListener('pointercancel', () => { down = null; });
  canvas.addEventListener('pointerleave', () => { hush(); if (hover) { hover = null; paint(); } });

  /* ---------- size, visibility, entrance, the way down the page ---------- */
  function size() {
    const w = canvas.clientWidth, h = canvas.clientHeight; if (!w || !h) return;
    W = w; HH = h; renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, phone.matches ? 1.5 : 2)); renderer.setSize(w, h, false);
    camera.aspect = w / h; edge = phone.matches ? 8 : side.offsetLeft + side.offsetWidth + 18; usable = phone.matches ? .96 : Math.min(.68, 1 - edge / w); shift = phone.matches ? 0 : Math.max(.15, edge / w / 2); camera.setViewOffset(w, h, -w * shift, 0, w, h); camera.updateProjectionMatrix();
    wide.forEach(m => m.resolution.set(w, h)); moved();
  }
  new ResizeObserver(size).observe(canvas);
  gsap.ticker.add(tick);
  size(); paint(true); panel();
  if (motion) root.classList.add('is-journey');
  let started = !motion;
  const enter = () => { started = true; gsap.to(intro, { t: 1, duration: 2.6, ease: 'power2.inOut', onUpdate: moved }); gsap.to(cloud, { veil: 1, duration: 3.4, delay: .6, ease: 'power1.inOut', onUpdate: invalidate }); };
  new IntersectionObserver(es => es.forEach(en => { visible = en.isIntersecting; if (visible) { wake(); invalidate(); } if (visible && !started && en.intersectionRatio > .22) enter(); }), { threshold: [0, .25] }).observe(canvas);
  if (motion) ScrollTrigger.create({ trigger: root, start: 'top top', end: 'bottom bottom', onUpdate: s => {
    if (phone.matches) return;
    prog = s.progress; wake();
    if (sel && Math.abs(prog - selAt) > .1) { select(null); }
    hush(); attend(); panel(); if (!sel) moved(); else invalidate();
  } });
  canvas.addEventListener('webglcontextlost', e => { e.preventDefault(); host.classList.remove('has-atlas'); });
  host.classList.add('has-atlas');
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(moved);
  return { select, invalidate };
}
