// ─────────────────────────────────────────
// cosmos.js
// Procedurally generates SVG shapes:
// star field, meteors, floating fragments
// Call initCosmos() after DOM loaded
// ─────────────────────────────────────────

const SVG_NS = 'http://www.w3.org/2000/svg';

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function randInt(min, max) {
  return Math.floor(rand(min, max));
}

// create SVG element with attributes
function svgEl(tag, attrs) {
  const el = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attrs)) {
    el.setAttribute(k, v);
  }
  return el;
}

// create animate element
function animate(attrs) {
  return svgEl('animate', attrs);
}

// ── STAR FIELD ──────────────────────────
function createStars(parent, count, w, h) {
  const g = svgEl('g', { fill: '#ffffff' });

  for (let i = 0; i < count; i++) {
    const cx   = rand(0, w);
    const cy   = rand(0, h);
    const r    = rand(0.4, 1.2);
    const dur  = rand(1.5, 5).toFixed(1) + 's';
    const v1   = rand(0.1, 0.9).toFixed(1);
    const v2   = rand(0.1, 0.9).toFixed(1);

    const circle = svgEl('circle', { cx, cy, r });

    // twinkling
    circle.appendChild(animate({
      attributeName: 'opacity',
      values: `${v1};${v2};${v1}`,
      dur,
      repeatCount: 'indefinite'
    }));

    g.appendChild(circle);
  }

  parent.appendChild(g);
}

// ── METEOR ──────────────────────────────
function createMeteor(parent, w, h, delay) {
  const length = rand(40, 120);
  const angle  = rand(28, 38);
  const speed  = rand(2.5, 6).toFixed(1) + 's';
  const startX = rand(-300, w * 0.3);
  const startY = rand(-100, -20);
  const endX   = w + 300;
  const endY   = h + 200;

  const g = svgEl('g', { filter: 'url(#glow)' });

  // main trail
  const line = svgEl('line', {
    x1: 0, y1: 0,
    x2: length, y2: 0,
    stroke: 'rgba(255,255,255,0.85)',
    'stroke-width': rand(0.8, 1.8).toFixed(1),
    transform: `rotate(${angle})`
  });

  const anim = svgEl('animateTransform', {
    attributeName: 'transform',
    type: 'translate',
    values: `${startX},${startY}; ${endX},${endY}`,
    dur: speed,
    begin: delay + 's',
    repeatCount: 'indefinite'
  });

  line.appendChild(anim);

  // gold tail
  const tail = svgEl('line', {
    x1: 0, y1: 0,
    x2: length * 0.5, y2: 0,
    stroke: 'rgba(201,169,110,0.5)',
    'stroke-width': '0.6',
    transform: `rotate(${angle})`
  });

  const tailAnim = svgEl('animateTransform', {
    attributeName: 'transform',
    type: 'translate',
    values: `${startX + 20},${startY}; ${endX + 20},${endY}`,
    dur: speed,
    begin: delay + 's',
    repeatCount: 'indefinite'
  });

  tail.appendChild(tailAnim);

  g.appendChild(line);
  g.appendChild(tail);
  parent.appendChild(g);
}

// ── ASTEROID ─────────────────────────────
// generates rough irregular polygon points
function asteroidPoints(sides, minR, maxR) {
  const points = [];
  for (let i = 0; i < sides; i++) {
    const angle = (i / sides) * Math.PI * 2;
    const r = rand(minR, maxR);
    points.push(`${(Math.cos(angle) * r).toFixed(1)},${(Math.sin(angle) * r).toFixed(1)}`);
  }
  return points.join(' ');
}

function createAsteroid(parent, x, y) {
  const sides   = randInt(7, 11);
  const minR    = rand(8, 14);
  const maxR    = minR + rand(4, 10);
  const spinDur = rand(10, 30).toFixed(0) + 's';
  const driftDur= rand(7, 16).toFixed(0) + 's';
  const dir     = Math.random() > 0.5 ? '360' : '-360';
  const dx      = rand(-15, 15).toFixed(0);
  const dy      = rand(-15, 15).toFixed(0);

  const g = svgEl('g', { transform: `translate(${x},${y})` });

  const poly = svgEl('polygon', {
    points: asteroidPoints(sides, minR, maxR),
    fill: 'rgba(35,30,25,0.9)',
    stroke: 'rgba(201,169,110,0.3)',
    'stroke-width': '1'
  });

  // spin
  const spin = svgEl('animateTransform', {
    attributeName: 'transform',
    type: 'rotate',
    from: '0',
    to: dir,
    dur: spinDur,
    repeatCount: 'indefinite'
  });
  poly.appendChild(spin);
  g.appendChild(poly);

  // crater
  const crater = svgEl('circle', {
    cx: rand(-4, 4).toFixed(1),
    cy: rand(-4, 4).toFixed(1),
    r: rand(1.5, 3).toFixed(1),
    fill: 'none',
    stroke: 'rgba(201,169,110,0.18)',
    'stroke-width': '0.7'
  });
  g.appendChild(crater);

  // drift float
  const drift = svgEl('animateTransform', {
    attributeName: 'transform',
    type: 'translate',
    values: `${x},${y}; ${x + parseFloat(dx)},${y + parseFloat(dy)}; ${x},${y}`,
    dur: driftDur,
    repeatCount: 'indefinite',
    additive: 'sum'
  });
  g.appendChild(drift);

  parent.appendChild(g);
}

// ── FLOATING CROSS ───────────────────────
function createCross(parent, x, y) {
  const size    = rand(8, 18);
  const spinDur = rand(20, 45).toFixed(0) + 's';
  const pulseDur= rand(3, 7).toFixed(1) + 's';
  const color   = Math.random() > 0.5 ? '#c9a96e' : 'white';

  const g = svgEl('g', {
    transform: `translate(${x},${y})`,
    opacity: rand(0.15, 0.4).toFixed(2)
  });

  const h = svgEl('line', { x1: -size, y1: 0, x2: size, y2: 0, stroke: color, 'stroke-width': '0.8' });
  const v = svgEl('line', { x1: 0, y1: -size, x2: 0, y2: size, stroke: color, 'stroke-width': '0.8' });

  const spin = svgEl('animateTransform', {
    attributeName: 'transform',
    type: 'rotate',
    from: '0',
    to: '360',
    dur: spinDur,
    repeatCount: 'indefinite'
  });

  const pulse = animate({
    attributeName: 'opacity',
    values: `${rand(0.1,0.3).toFixed(2)};${rand(0.4,0.8).toFixed(2)};${rand(0.1,0.3).toFixed(2)}`,
    dur: pulseDur,
    repeatCount: 'indefinite'
  });

  g.appendChild(h);
  g.appendChild(v);
  g.appendChild(spin);
  g.appendChild(pulse);
  parent.appendChild(g);
}

// ── INIT ─────────────────────────────────
function initCosmos() {
  const svg = document.getElementById('cosmos-svg');
  if (!svg) return;

  const w = svg.viewBox.baseVal.width  || 900;
  const h = svg.viewBox.baseVal.height || 600;

  // grab the main group
  const mainG = svg.querySelector('#cosmos-main');

  // generate stars
  createStars(mainG, 60, w, h);

  // generate meteors with staggered delays
  [0, 2.5, 5, 8, 11].forEach(delay => createMeteor(mainG, w, h, delay));

  // generate asteroids
  const asteroidPositions = [
    [680, 420], [160, 380], [750, 180], [80, 480], [820, 300]
  ];
  asteroidPositions.forEach(([x, y]) => createAsteroid(mainG, x, y));

  // generate crosses
  for (let i = 0; i < 6; i++) {
    createCross(mainG, rand(50, w - 50), rand(50, h - 50));
  }
}

document.addEventListener('DOMContentLoaded', initCosmos);