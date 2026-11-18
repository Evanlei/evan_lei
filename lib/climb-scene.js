// The climb: builds the mountain scene and drives it from scroll.
// Runs once in the browser; the page's HTML (panels, HUD, stage shell) is server-rendered.
// Plain JS on purpose: it is imperative DOM and SVG work with no React state.

export function initClimb() {
  if (window.__climbStarted) return;
  window.__climbStarted = true;
  const NS = 'http://www.w3.org/2000/svg';
  const root = document.documentElement;
  const panels = [...document.querySelectorAll('.panel')];
  const N = panels.length;
  const H = 2600, FOOT = H + 1600, W = 1000, PEAK_Y = 100, TOP_ALT = 5000;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- geometry ----------
  const halfW = (y) => {
    const k = Math.max(0, (y - PEAK_Y) / (H - PEAK_Y));
    return 600 * Math.pow(k, .62) * (1 + .05 * Math.sin(y / 41) + .035 * Math.sin(y / 97));
  };
  const camps = panels.map((_, i) => {
    if (i === N - 1) return { x: 500, y: 150 };
    const y = H - 170 - i * (H - 170 - 150) / (N - 1);
    const a = Math.min(240, halfW(y) * .52);
    return { x: 500 + (i % 2 ? a : -a), y };
  });
  const seg = [];
  for (let i = 0; i < N - 1; i++) {
    const a = camps[i], b = camps[i + 1], dx = b.x - a.x, dy = a.y - b.y;
    seg.push(`M${a.x} ${a.y} C${a.x + dx * .85} ${a.y - dy * .1} ${b.x - dx * .85} ${b.y + dy * .1} ${b.x} ${b.y}`);
  }
  const trailD = seg.map((s, i) => i ? s.replace(/^M[^C]+/, '') : s).join(' ');

  // ---------- build world svg ----------
  const svg = document.getElementById('worldSvg');
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  const el = (tag, attrs, parent = svg) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); parent.appendChild(e); return e; };
  let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

  // distant ranges, generated so each layer has its own skyline
  document.querySelectorAll('.range').forEach((r) => {
    const base = +r.dataset.base, amp = +r.dataset.amp, k = +r.dataset.seed;
    const ys = [];
    let d = 'M0 300 ';
    for (let x = 0; x <= 1000; x += 10) {
      const y = base - amp * Math.pow(Math.abs(Math.sin(x / 130 + k)), 1.6) * (.65 + .35 * Math.sin(x / 47 + k * 2)) - 5 * Math.sin(x / 11 + k);
      ys.push([x, y]); d += `L${x} ${y.toFixed(1)} `;
    }
    let inner = `<path d="${d}L1000 300 Z"/>`;
    if (r.classList.contains('far')) {
      for (let i = 2; i < ys.length - 2; i++) {
        const [x, y] = ys[i];
        if (y < ys[i - 2][1] && y < ys[i + 2][1] && y < base - amp * .55) inner += `<path class="peak-snow" d="M${x - 14} ${y + 12} L${x} ${y} L${x + 14} ${y + 12} L${x + 6} ${y + 9} L${x} ${y + 13} L${x - 6} ${y + 9} Z"/>`;
      }
    }
    r.innerHTML = inner;
  });

  // mountain body, lit from the upper left
  let left = '', right = '';
  for (let y = FOOT; y >= PEAK_Y; y -= 10) { left += `L${(500 - halfW(y)).toFixed(1)} ${y} `; }
  for (let y = PEAK_Y; y <= FOOT; y += 10) { right += `L${(500 + halfW(y) * 1.02).toFixed(1)} ${y} `; }
  const mtnD = `M${500 - halfW(FOOT)} ${FOOT} ${left} L500 ${PEAK_Y - 6} ${right} Z`;
  const defs = el('defs', {});
  const clip = el('clipPath', { id: 'mclip' }, defs); el('path', { d: mtnD }, clip);
  const fogBlur = el('filter', { id: 'fogblur', x: '-30%', y: '-80%', width: '160%', height: '260%' }, defs);
  el('feGaussianBlur', { stdDeviation: 16 }, fogBlur);
  el('path', { d: mtnD, class: 'mtn-body' });
  const g = el('g', { 'clip-path': 'url(#mclip)' });
  let shade = `M500 ${PEAK_Y - 6} `;
  for (let y = PEAK_Y; y <= FOOT; y += 20) shade += `L${(500 + 60 * Math.sin(y / 230) + (y - PEAK_Y) * .05).toFixed(1)} ${y} `;
  shade += `L${W + 900} ${FOOT} L${W + 900} ${PEAK_Y} Z`;
  el('path', { d: shade, class: 'mtn-shade' }, g);
  // ridgelines falling from the summit give the mountain form
  [[-1, .38, .55], [1, .3, .75], [-1, .72, .9], [1, .7, .5], [-1, .15, .35]].forEach(([side, f, len], i) => {
    let d = '';
    for (let y = PEAK_Y + 8; y < PEAK_Y + (H - PEAK_Y) * len; y += 14) {
      const x = 500 + side * halfW(y) * f + 9 * Math.sin(y / 37 + i * 2) + 4 * Math.sin(y / 11 + i);
      d += (d ? 'L' : 'M') + x.toFixed(1) + ' ' + y + ' ';
    }
    el('path', { d, class: 'ridge' }, g);
  });
  for (let k = 0, y0 = 190; y0 < FOOT; k++, y0 += 78) {
    let d = '';
    for (let x = -20; x <= W + 20; x += 20) d += (x < 0 ? 'M' : 'L') + x + ' ' + (y0 + 14 * Math.sin(x / 83 + k * 1.7) + 7 * Math.sin(x / 31 + k)).toFixed(1) + ' ';
    el('path', { d, class: 'contour' }, g);
  }
  // snowcap with its own shaded east face
  let snow = '';
  for (let y = 640; y >= PEAK_Y; y -= 10) snow += `L${(500 - halfW(y) - 4).toFixed(1)} ${y} `;
  for (let y = PEAK_Y; y <= 640; y += 10) snow += `L${(500 + halfW(y) * 1.02 + 4).toFixed(1)} ${y} `;
  for (let x = 500 + halfW(640); x > 500 - halfW(640); x -= 22) snow += `L${x.toFixed(1)} ${(600 + (Math.round(x / 22) % 2 ? 36 : -6) + 18 * Math.sin(x / 50)).toFixed(1)} `;
  const snowD = 'M' + snow.slice(1) + 'Z';
  el('path', { d: snowD, class: 'snowcap' }, g);
  const sclip = el('clipPath', { id: 'sclip' }, defs); el('path', { d: snowD }, sclip);
  el('path', { d: shade, class: 'snow-shade', 'clip-path': 'url(#sclip)' }, g);

  // trail
  const trail = el('path', { d: trailD, class: 'trail' });
  const total = trail.getTotalLength();
  const campLen = [0];
  for (let i = 0; i < seg.length; i++) {
    const p = el('path', { d: seg[i] }); campLen.push(campLen[i] + p.getTotalLength()); p.remove();
  }
  const samples = [];
  for (let l = 0; l <= total; l += 18) samples.push(trail.getPointAtLength(l));
  const nearTrail = (x, y, r) => samples.some(p => (p.x - x) ** 2 + (p.y - y) ** 2 < r * r);
  const nearCamp = (x, y, r) => camps.some(c => (c.x - x) ** 2 + (c.y - y) ** 2 < r * r);
  const inside = (x, y, pad) => Math.abs(x - 500) < halfW(y) - pad;

  const deco = el('g', {}, g);
  // patchy snow below the cap
  for (let i = 0; i < 40; i++) {
    const y = 620 + rnd() * 300, x = 500 + (rnd() * 2 - 1) * (halfW(y) - 20);
    if (nearTrail(x, y, 16)) continue;
    const w = 8 + rnd() * 18 * (1 - (y - 620) / 360);
    el('ellipse', { cx: x, cy: y, rx: w, ry: w * .32, class: 'snow-patch', transform: `rotate(${(rnd() * 16 - 8).toFixed(1)} ${x} ${y})` }, deco);
  }
  // boulders above the tree line, lit left / shaded right
  for (let i = 0; i < 90; i++) {
    const y = 560 + rnd() * 1000, x = 500 + (rnd() * 2 - 1) * (halfW(y) - 24);
    if (nearTrail(x, y, 26) || nearCamp(x, y, 60) || !inside(x, y, 20)) continue;
    const sz = (4 + rnd() * 9) * (y > 1300 ? .7 : 1);
    el('path', { d: `M${x - sz} ${y} Q${x - sz * .95} ${y - sz * .9} ${x - sz * .05} ${y - sz} Q${x + sz * .85} ${y - sz * .85} ${x + sz} ${y} Z`, class: 'rock' }, deco);
    el('path', { d: `M${x - sz * .05} ${y - sz} Q${x + sz * .85} ${y - sz * .85} ${x + sz} ${y} L${x + sz * .1} ${y} Z`, class: 'rock-shade' }, deco);
  }
  // forest: dense low, thinning to a tree line around 1,250
  const trees = [];
  for (let i = 0; i < 640; i++) {
    const y = 1080 + rnd() * (H + 520 - 1080), x = 500 + (rnd() * 2 - 1) * (halfW(y) - 14);
    const dens = smooth(1150, 1750, y);
    if (rnd() > dens * .97 + .02) continue;
    if (nearTrail(x, y, 30) || nearCamp(x, y, 72)) continue;
    trees.push([x, y, (7 + rnd() * 11) * (.55 + .45 * dens)]);
  }
  trees.sort((a, b) => a[1] - b[1]).forEach(([x, y, sz]) => {
    el('rect', { x: x - sz * .08, y: y - sz * .1, width: sz * .16, height: sz * .32, class: 'trunk' }, deco);
    let full = '', lit = '';
    for (let k = 0; k < 3; k++) {
      const b = y - k * sz * .62, w = sz * (.95 - k * .22), t = b - sz * 1.05;
      full += `M${x - w} ${b} L${x} ${t} L${x + w} ${b} Z `;
      lit += `M${x - w} ${b} L${x} ${t} L${x + w * .08} ${b} Z `;
    }
    el('path', { d: full, class: 'tree-shade' }, deco);
    el('path', { d: lit, class: 'tree-lit' }, deco);
  });
  // meadow at base camp: grass tufts and wildflowers
  const petals = ['#f4d35e', '#ffffff', '#c7a6e6', '#ee9a72'];
  for (let i = 0; i < 260; i++) {
    const y = H - 420 + rnd() * 560, x = 500 + (rnd() * 2 - 1) * (halfW(y) - 10);
    if (nearTrail(x, y, 10)) continue;
    if (rnd() < .7) {
      el('path', { d: `M${x} ${y} q-1.5 -4 -3 -6 M${x} ${y} q0 -5 .6 -7.5 M${x} ${y} q1.4 -4 3.2 -5.6`, class: 'tuft' }, deco);
    } else {
      const c = petals[Math.floor(rnd() * petals.length)];
      el('circle', { cx: x, cy: y - 2, r: 2.1, fill: c }, deco);
      el('circle', { cx: x, cy: y - 2, r: .8, class: 'flower-c' }, deco);
    }
  }

  // clouds high up, and a fog bank you climb through between Veyo and Mochi
  [[150, 520, 1.1], [840, 760, 1.3], [90, 900, .8]].forEach(([x, y, sc]) => {
    const c = el('g', { class: 'cloud', transform: `translate(${x} ${y}) scale(${sc})` });
    el('ellipse', { cx: 0, cy: 0, rx: 60, ry: 16 }, c); el('ellipse', { cx: -22, cy: -10, rx: 26, ry: 16 }, c); el('ellipse', { cx: 16, cy: -14, rx: 30, ry: 20 }, c);
  });
  const FOG_Y = (camps[3].y + camps[4].y) / 2;
  const fogBack = el('g', { filter: 'url(#fogblur)' });
  for (let x = -150; x <= 1150; x += 120) el('ellipse', { cx: x + rnd() * 40, cy: FOG_Y + rnd() * 60 - 30, rx: 120 + rnd() * 60, ry: 34 + rnd() * 18, class: 'fog-back' }, fogBack);
  const fogFront = [];
  for (let i = 0; i < 9; i++) fogFront.push([-120 + i * 150 + rnd() * 50, FOG_Y - 40 + rnd() * 90, 300 + rnd() * 180, 90 + rnd() * 50, 14 + rnd() * 12]);

  svg.appendChild(trail);
  const done = el('path', { d: trailD, class: 'trail-done', 'stroke-dasharray': `0 ${total + 10}` });
  const prints = el('g', {});

  // camps: a tent at base, wooden signposts up the trail, a flag at the top
  const alt = (len) => Math.round(len / total * TOP_ALT / 10) * 10;
  const signs = camps.map((c, i) => {
    const gg = el('g', { class: 'camp-sign' });
    const out = c.x < 500 ? -1 : 1;
    if (i === N - 1) {
      el('line', { x1: c.x + 14, y1: c.y + 2, x2: c.x + 14, y2: c.y - 40, class: 'flag-pole' }, gg);
      el('path', { d: `M${c.x + 15} ${c.y - 40} L${c.x + 42} ${c.y - 33} L${c.x + 15} ${c.y - 25} Z`, class: 'flag-cloth' }, gg);
      return gg;
    }
    let sx = c.x + out * 30;
    if (i === 0) {
      const tx = c.x + out * 34, ty = c.y + 4;
      el('path', { d: `M${tx - 16} ${ty} L${tx} ${ty - 20} L${tx + 16} ${ty} Z`, class: 'tent-body' }, gg);
      el('path', { d: `M${tx - 5} ${ty} L${tx} ${ty - 11} L${tx + 5} ${ty} Z`, class: 'tent-door' }, gg);
      sx = tx + out * 34;
    }
    const name = panels[i].dataset.camp, altText = alt(campLen[i]).toLocaleString() + ' m';
    const w = Math.max(name.length * 7.4, altText.length * 6.2) + 18, base = c.y + 4;
    const bx = out < 0 ? sx - w + 8 : sx - 8, cx = bx + w / 2;
    el('line', { x1: sx, y1: base + 2, x2: sx, y2: base - 14, class: 'post' }, gg);
    el('rect', { x: bx, y: base - 40, width: w, height: 29, rx: 4, class: 'board' }, gg);
    const t1 = el('text', { x: cx, y: base - 26 }, gg); t1.textContent = name;
    const t2 = el('text', { x: cx, y: base - 15, class: 'alt' }, gg); t2.textContent = altText;
    return gg;
  });
  panels.forEach((p, i) => { const b = p.querySelector('[data-alt]'); if (b) b.textContent = alt(campLen[i]).toLocaleString() + ' m'; });

  // stars
  const stars = document.querySelector('.stars');
  for (let i = 0; i < 70; i++) { const st = document.createElement('i'); st.style.left = rnd() * 100 + '%'; st.style.top = rnd() * 55 + '%'; st.style.opacity = .3 + rnd() * .6; stars.appendChild(st); }
  // snowfall above the snowline
  const snowfall = document.getElementById('snowfall');
  for (let i = 0; i < 40; i++) {
    const f = document.createElement('i');
    f.style.left = rnd() * 100 + '%'; f.style.animationDuration = 6 + rnd() * 7 + 's'; f.style.animationDelay = -rnd() * 12 + 's';
    const sz = 2 + rnd() * 3; f.style.width = f.style.height = sz + 'px';
    snowfall.appendChild(f);
  }

  // ---------- New York time sky ----------
  const orb = document.querySelector('.orb');
  function updateSky() {
    const now = new Date();
    const h = +new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', hour: 'numeric', hourCycle: 'h23' }).format(now);
    const phase = h < 5 || h >= 20 ? 'night' : h < 8 ? 'dawn' : h < 17 ? 'day' : 'dusk';
    document.documentElement.dataset.sky = phase;
    const time = new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', hour: 'numeric', minute: '2-digit' }).format(now).toLowerCase();
    document.getElementById('nycClock').textContent = `It's ${time} in New York. The sky up here follows my clock.`;
  }
  updateSky();
  setInterval(updateSky, 60000);

  // ---------- summit snow puff ----------
  function puff() {
    if (reduced) return;
    const c = camps[N - 1];
    for (let i = 0; i < 14; i++) {
      const f = document.createElement('i');
      f.className = 'flake';
      f.style.left = (c.x + 14) * s + 'px'; f.style.top = (c.y + 2) * s + 'px';
      world.appendChild(f);
      const a = Math.PI * (1.05 + Math.random() * .9), r = 24 + Math.random() * 38, sz = .5 + Math.random() * .7;
      f.animate([
        { transform: `translate(-50%, -50%) scale(${sz})`, opacity: 1 },
        { transform: `translate(calc(-50% + ${Math.cos(a) * r}px), calc(-50% + ${Math.sin(a) * r}px)) scale(${sz * .4})`, opacity: 0 },
      ], { duration: 650 + Math.random() * 350, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' }).onfinish = () => f.remove();
    }
  }

  // ---------- phones: pull the card down to see the mountain ----------
  const PEEK = 78;
  function setCollapsed(p, on) {
    p.classList.toggle('collapsed', on);
    const g = p.querySelector('.grab');
    g.setAttribute('aria-expanded', String(!on));
    g.setAttribute('aria-label', on ? 'Expand card' : 'Collapse card');
  }
  panels.forEach((p) => {
    const g = document.createElement('button');
    g.type = 'button'; g.className = 'grab'; g.innerHTML = '<span></span>';
    g.setAttribute('aria-expanded', 'true'); g.setAttribute('aria-label', 'Collapse card');
    p.prepend(g);
    let startY = null, base = 0, h = 0, moved = false;
    g.addEventListener('pointerdown', (e) => {
      startY = e.clientY; h = p.offsetHeight; moved = false;
      base = p.classList.contains('collapsed') ? h - PEEK : 0;
      g.setPointerCapture(e.pointerId);
      p.style.transition = 'none';
    });
    g.addEventListener('pointermove', (e) => {
      if (startY === null) return;
      const dy = e.clientY - startY;
      if (Math.abs(dy) > 4) moved = true;
      p.style.translate = `0 ${Math.min(h - PEEK, Math.max(0, base + dy))}px`;
    });
    const end = (e) => {
      if (startY === null) return;
      const y = base + (e.clientY - startY);
      p.style.transition = ''; p.style.translate = '';
      startY = null;
      setCollapsed(p, moved ? y > (h - PEEK) / 2 : !p.classList.contains('collapsed'));
    };
    g.addEventListener('pointerup', end);
    g.addEventListener('pointercancel', end);
    g.addEventListener('click', (e) => { if (e.detail === 0) setCollapsed(p, !p.classList.contains('collapsed')); });
  });

  // ---------- nav: a minimap of the mountain ----------
  const nav = document.getElementById('campsNav');
  const MW = 72, VB_Y = PEAK_Y - 40, VB_H = H - PEAK_Y + 80, MH = Math.round(MW * VB_H / W);
  nav.innerHTML = `<div class="mini-wrap" style="width:${MW}px;height:${MH}px"><svg class="mini" viewBox="0 ${VB_Y} ${W} ${VB_H}" width="${MW}" height="${MH}" aria-hidden="true"><path class="mini-mtn" d="${mtnD}"/><path class="mini-snow" d="${snowD}"/><path class="mini-trail" d="${trailD}"/><path class="mini-done" d="${trailD}" stroke-dasharray="0 ${total + 10}"/><circle class="mini-me" r="48" cx="${camps[0].x}" cy="${camps[0].y}"/></svg></div><div class="mini-label" aria-hidden="true"></div>`;
  const miniWrap = nav.querySelector('.mini-wrap'), miniDone = nav.querySelector('.mini-done'), miniMe = nav.querySelector('.mini-me'), miniLabel = nav.querySelector('.mini-label');
  let curIdx = 0;
  const showLabel = (i) => { const k = i === null ? curIdx : i; miniLabel.innerHTML = `<b>${panels[k].dataset.camp}</b><span>${alt(campLen[k]).toLocaleString()} m</span>`; };
  const navBtns = panels.map((p, i) => {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'mini-camp';
    b.style.left = camps[i].x / W * MW + 'px'; b.style.top = (camps[i].y - VB_Y) / VB_H * MH + 'px';
    b.setAttribute('aria-label', `${p.dataset.camp}, ${alt(campLen[i]).toLocaleString()} m`);
    b.addEventListener('click', () => goTo(i));
    b.addEventListener('mouseenter', () => showLabel(i)); b.addEventListener('mouseleave', () => showLabel(null));
    b.addEventListener('focus', () => showLabel(i)); b.addEventListener('blur', () => showLabel(null));
    miniWrap.appendChild(b); return b;
  });
  showLabel(null);

  // ---------- scroll model: dwell at each camp, walk between ----------
  const world = document.querySelector('.world');
  const climber = document.getElementById('climber');
  const skyHigh = document.querySelector('.sky-high');
  const far = document.querySelector('.range.far'), mid = document.querySelector('.range.mid'), near = document.querySelector('.range.near');
  const birds = document.querySelector('.birds');
  const stage = document.querySelector('.stage');
  const fogEl = document.getElementById('fog');
  fogFront.forEach(([x, y, w, h, d]) => { const f = document.createElement('i'); f.dataset.g = [x, y, w, h].join(','); f.style.setProperty('--d', d + 's'); fogEl.appendChild(f); });
  const altEl = document.getElementById('alt');
  const hint = document.getElementById('scrollHint');
  const np = document.getElementById('np');

  // ---------- Spotify now playing ----------
  // Served by app/api/spotify/now-playing. An empty response hides the bubble.
  const NOW_PLAYING_URL = '/api/spotify/now-playing';
  async function loadNowPlaying() {
    try {
      const r = await fetch(NOW_PLAYING_URL, { cache: 'no-store' });
      if (!r.ok) throw 0;
      const d = await r.json();
      if (!d || !d.title) { np.hidden = true; return; }
      np.hidden = false;
      np.href = d.url || 'https://open.spotify.com/';
      np.classList.toggle('paused', !d.isPlaying);
      np.querySelector('.np-state').textContent = d.isPlaying ? 'Listening now' : 'Last played';
      np.querySelector('.np-title').textContent = d.title;
      np.querySelector('.np-artist').textContent = d.artist;
      const img = np.querySelector('.np-art img');
      if (d.albumArt) { img.src = d.albumArt; img.hidden = false; } else img.hidden = true;
      const label = `${d.isPlaying ? 'Now playing' : 'Last played'} on Spotify: ${d.title} by ${d.artist}`;
      np.setAttribute('aria-label', label);
      document.getElementById('npLive').textContent = label;
    } catch (e) { np.hidden = true; }
  }
  loadNowPlaying();
  setInterval(loadNowPlaying, 30000);
  let D, Wk, vw, vh, s, mobile;
  function measure() {
    vw = innerWidth; vh = innerHeight; mobile = vw <= 760;
    D = vh * .6; Wk = vh * .45;
    s = mobile ? Math.max(vw / W, .62) : vw / W;
    world.style.width = W * s + 'px'; svg.setAttribute('width', W * s); svg.setAttribute('height', H * s);
    fogEl.querySelectorAll('i').forEach((f) => { const [x, y, w, h] = f.dataset.g.split(',').map(Number); f.style.left = (x - w / 2) * s + 'px'; f.style.top = (y - h / 2) * s + 'px'; f.style.width = w * s + 'px'; f.style.height = h * s + 'px'; });
    document.querySelector('main').style.setProperty('--track', (N * D + (N - 1) * Wk + vh) + 'px');
  }
  const startOf = (i) => i * (D + Wk);
  function goTo(i) {
    if (!root.classList.contains('climb')) { panels[i].scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' }); return; }
    scrollTo({ top: startOf(i) + D * .35, behavior: reduced ? 'auto' : 'smooth' });
  }
  document.getElementById('backDown').addEventListener('click', () => goTo(0));

  // Easter egg: click the climber to wave; every third click plays the clarinet.
  let clicks = 0, eggT;
  climber.querySelector('svg').addEventListener('click', () => {
    if (reduced || climber.classList.contains('walking')) return;
    clicks++;
    climber.classList.remove('sitting', 'waving', 'playing');
    void climber.offsetWidth;
    const cls = clicks % 3 === 0 ? 'playing' : 'waving';
    climber.classList.add(cls);
    clearTimeout(eggT);
    eggT = setTimeout(() => climber.classList.remove(cls), cls === 'playing' ? 3200 : 1300);
  });

  let active = -1, lastLen = 0, walkT, idleT, camX = 0, camY = 0, summitZoom = false, zoomT = null, lastPrint = 0, printSide = 1;
  world.addEventListener('transitionend', () => { world.style.transition = ''; });
  function state(y) {
    for (let i = 0; i < N; i++) {
      const a = startOf(i);
      if (y < a + D || i === N - 1) return { len: campLen[i], stop: i };
      if (y < a + D + Wk) { const u = (y - a - D) / Wk; return { len: campLen[i] + u * (campLen[i + 1] - campLen[i]), stop: -1, between: i }; }
    }
  }
  function render() {
    if (!root.classList.contains('climb')) return;
    const st = state(scrollY);
    const len = st.len, p = trail.getPointAtLength(len), frac = len / total;
    // camera
    // At the summit, wait a beat for the flag, then pull back to show the whole climb.
    if (st.stop === N - 1) {
      if (!summitZoom && !zoomT && !reduced) zoomT = setTimeout(() => { zoomT = null; summitZoom = true; world.style.transition = 'transform 1.6s var(--ease-in-out)'; render(); }, 1200);
    } else {
      clearTimeout(zoomT); zoomT = null;
      if (summitZoom) { summitZoom = false; world.style.transition = 'transform .9s var(--ease-in-out)'; }
    }
    let z = 1;
    if (summitZoom) {
      z = mobile ? Math.min(vw * .9 / (W * s), vh * .48 / ((H - PEAK_Y) * s)) : Math.min(vh * .84 / ((H - PEAK_Y + 60) * s), vw * .42 / (W * s));
      camX = (mobile ? vw / 2 : vw * .3) - 500 * s * z;
      camY = (mobile ? vh * .3 : vh * .5) - ((PEAK_Y + H) / 2) * s * z;
    } else {
      camY = (mobile ? vh * .26 : vh * .5) - p.y * s;
      camX = Math.min(0, Math.max(vw - W * s, vw / 2 - p.x * s));
    }
    world.style.transform = `translate3d(${camX}px, ${camY}px, 0) scale(${z})`;
    stage.classList.toggle('zoomed', summitZoom);
    climber.style.left = p.x * s + 'px'; climber.style.top = p.y * s + 'px';
    done.setAttribute('stroke-dasharray', `${len} ${total + 10}`);
    // facing
    if (Math.abs(len - lastLen) > .5) climber.classList.toggle('left', (trail.getPointAtLength(Math.min(total, len + (len > lastLen ? 3 : -3))).x - p.x) < 0);
    // atmosphere
    skyHigh.style.opacity = Math.min(1, frac * 1.25);
    stars.style.opacity = Math.max(0, (frac - .45) * 1.8);
    orb.style.opacity = Math.max(0, (frac - .35) * 1.6);
    orb.style.transform = `translateY(${(1 - frac) * 30}vh)`;
    far.style.transform = `translateY(${(1 - frac) * 30}vh)`;
    mid.style.transform = `translateY(${(1 - frac) * 50}vh)`;
    near.style.transform = `translateY(${(1 - frac) * 72}vh)`;
    birds.style.opacity = Math.max(0, 1 - Math.abs(frac - .5) / .2).toFixed(2);
    snowfall.style.opacity = Math.min(1, Math.max(0, (frac - .72) * 4)).toFixed(2);
    miniMe.setAttribute('cx', p.x); miniMe.setAttribute('cy', p.y);
    miniDone.setAttribute('stroke-dasharray', `${len} ${total + 10}`);
    if (!reduced && Math.abs(len - lastPrint) > 13) {
      const a = trail.getPointAtLength(lastPrint), b = trail.getPointAtLength(Math.min(total, lastPrint + 1));
      const nx = -(b.y - a.y), ny = b.x - a.x, nl = Math.hypot(nx, ny) || 1;
      printSide *= -1;
      const fp = el('ellipse', { cx: a.x + nx / nl * 2.6 * printSide, cy: a.y + ny / nl * 2.6 * printSide, rx: 2.2, ry: 1.3, class: 'print' }, prints);
      fp.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 2600, easing: 'ease-in' }).onfinish = () => fp.remove();
      lastPrint = len;
    }
    altEl.textContent = alt(len).toLocaleString();
    hint.classList.toggle('gone', scrollY > 30);
    // signs + nav
    const reachedIdx = st.stop >= 0 ? st.stop : st.between;
    signs.forEach((sg, i) => sg.classList.toggle('reached', i <= reachedIdx));
    navBtns.forEach((b, i) => { b.classList.toggle('reached', i <= reachedIdx); b.setAttribute('aria-current', i === st.stop ? 'step' : 'false'); });
    if (curIdx !== reachedIdx) { curIdx = reachedIdx; showLabel(null); }
    document.querySelector('.stage').classList.toggle('summited', st.stop === N - 1);
    climber.classList.toggle('cheer', st.stop === N - 1);
    np.classList.toggle('compact', st.stop < 0);
    // panels
    if (st.stop !== active && !root.classList.contains('instant')) {
      if (active >= 0) { panels[active].classList.remove('is-active'); panels[active].inert = true; }
      if (st.stop >= 0) {
        const pn = panels[st.stop];
        pn.classList.toggle('side-right', camps[st.stop].x <= 500);
        pn.classList.toggle('side-left', camps[st.stop].x > 500);
        np.classList.toggle('to-left', camps[st.stop].x <= 500);
        np.classList.toggle('to-right', camps[st.stop].x > 500);
        pn.inert = false;
        setCollapsed(pn, false);
        if (st.stop === N - 1 && active !== N - 1) puff();
        pn.classList.add('entering'); void pn.offsetWidth; pn.classList.remove('entering');
        pn.classList.add('is-active');
        if (!reduced && st.stop > active) { climber.classList.add('look'); setTimeout(() => climber.classList.remove('look'), 650); }
      }
      active = st.stop;
    }
    // walking / idle
    if (Math.abs(len - lastLen) > .3 && !reduced) {
      climber.classList.remove('sitting'); climber.classList.add('walking');
      clearTimeout(walkT); walkT = setTimeout(() => climber.classList.remove('walking'), 140);
    }
    clearTimeout(idleT);
    idleT = setTimeout(() => { if (st.stop !== N - 1 && scrollY > 10 && !reduced) climber.classList.add('sitting'); }, 5000);
    lastLen = len;
  }
  // Snap to the nearest camp in the direction of travel once scrolling settles,
  // so nobody gets stranded mid-trail.
  let lastY = scrollY, dir = 1, snapT;
  function snap() {
    if (!root.classList.contains('climb')) return;
    const st = state(scrollY);
    if (st.stop >= 0) return;
    const u = (scrollY - startOf(st.between) - D) / Wk;
    goTo(dir > 0 ? (u > .12 ? st.between + 1 : st.between) : (u < .88 ? st.between : st.between + 1));
  }
  let raf = 0;
  addEventListener('scroll', () => {
    if (scrollY !== lastY) dir = scrollY > lastY ? 1 : -1;
    lastY = scrollY;
    clearTimeout(snapT); snapT = setTimeout(snap, 160);
    if (!raf) raf = requestAnimationFrame(() => { raf = 0; render(); });
  }, { passive: true });

  // Keyboard: arrows, Page Up/Down, Space jump camp to camp.
  addEventListener('keydown', (e) => {
    if (!root.classList.contains('climb') || e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.target.closest && e.target.closest('input, textarea, [contenteditable]')) return;
    if (e.key === ' ' && e.target.closest && e.target.closest('button, a')) return;
    const st = state(scrollY);
    const here = st.stop >= 0 ? st.stop : null;
    let t = null;
    if (['ArrowDown', 'ArrowRight', 'PageDown'].includes(e.key) || (e.key === ' ' && !e.shiftKey)) t = here !== null ? here + 1 : st.between + 1;
    else if (['ArrowUp', 'ArrowLeft', 'PageUp'].includes(e.key) || (e.key === ' ' && e.shiftKey)) t = here !== null ? here - 1 : st.between;
    else if (e.key === 'Home') t = 0;
    else if (e.key === 'End') t = N - 1;
    if (t === null) return;
    e.preventDefault();
    goTo(Math.max(0, Math.min(N - 1, t)));
  });
  addEventListener('resize', () => { measure(); active = -2; render(); });

  // ---------- modes ----------
  const toggle = document.getElementById('viewToggle');
  function setMode(climb) {
    root.classList.toggle('climb', climb);
    toggle.textContent = climb ? 'List view' : 'Climb view';
    panels.forEach(p => { p.inert = climb; p.classList.remove('is-active'); });
    root.classList.add('instant');
    active = -2; measure(); scrollTo(0, 0); render();
    requestAnimationFrame(() => requestAnimationFrame(() => { root.classList.remove('instant'); render(); }));
    try { localStorage.setItem('evan-view', climb ? 'climb' : 'list'); } catch (e) {}
  }
  toggle.addEventListener('click', () => setMode(!root.classList.contains('climb')));
  let saved = null; try { saved = localStorage.getItem('evan-view'); } catch (e) {}
  setMode(saved ? saved === 'climb' : !reduced);
}
