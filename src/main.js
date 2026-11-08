import './style.css';
import { config, categories, products, faq, community } from './data/store.js';


const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

const fmt = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: config.currency }).format(n);
const now = (p) => (config.sale.active ? p.price * (1 - config.sale.percent / 100) : p.price);
const byId = (id) => products.find((p) => String(p.id) === String(id));
const catOf = (id) => categories.find((c) => c.id === id);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const ls = {
  get: (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};
const head = (n, s = 32) => `https://mc-heads.net/avatar/${encodeURIComponent(n || 'MHF_Steve')}/${s}`;
const body = (n, s = 100) => `https://mc-heads.net/body/${encodeURIComponent(n || 'MHF_Steve')}/${s}`;
const ico = (name, size = 32, cls = '') => `<img class="ico ${cls}" src="/icons/${name}.png" width="${size}" height="${size}" alt=""/>`;
const per = (p) => (p.type === 'subscribe' ? '<small class="per">/mo</small>' : '');
const price = (p) => `<span class="price">${config.sale.active ? `<s>${fmt(p.price)}</s>` : ''}${fmt(now(p))}${per(p)}</span>`;
const tebexLink = (p) => `${config.tebex}/checkout/packages/add/${p.id}/${p.type}`;

const I = {
  cart: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 4h2l2.4 11.2a1 1 0 0 0 1 .8h9.2a1 1 0 0 0 1-.8L20 8H6.2"/><circle cx="9" cy="20" r="1.4"/><circle cx="17" cy="20" r="1.4"/></svg>',
  arrow: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  discord: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19.6 5.3A17 17 0 0 0 15.4 4l-.5 1a15.6 15.6 0 0 0-5.8 0L8.6 4a17 17 0 0 0-4.2 1.3C1.7 9.3 1 13.2 1.3 17a17 17 0 0 0 5.2 2.6l1.1-1.8c-.6-.2-1.2-.5-1.7-.9l.4-.3a12.2 12.2 0 0 0 11.4 0l.4.3c-.5.4-1.1.7-1.7.9l1.1 1.8a17 17 0 0 0 5.2-2.6c.4-4.4-.7-8.3-3.1-11.7ZM8.5 14.7c-1 0-1.9-1-1.9-2.1s.8-2.1 1.9-2.1 1.9 1 1.9 2.1-.8 2.1-1.9 2.1Zm7 0c-1 0-1.9-1-1.9-2.1s.8-2.1 1.9-2.1 1.9 1 1.9 2.1-.8 2.1-1.9 2.1Z"/></svg>',
  menu: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
  ext: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>',
};

let cart = ls.get('cr-cart2', {});
let ign = ls.get('cr-ign', '');
let online = null;
let counts = null;

// ── Shell ───────────────────────────────────────────────
const featured = products.find((p) => p.featured) || products[0];
$('#app').innerHTML = `
  <div class="app">
    <aside class="sidebar" id="sidebar">
      <a class="brand" href="#/" aria-label="Crystal Ranked home"><img src="/logo.png" width="92" height="92" alt="Crystal Ranked"/></a>
      <nav class="side-nav">
        <a href="#/" data-route=""><span class="nav-ico">${ico('house', 24)}</span>Home</a>
        ${categories.map((c) => `<a href="#/${c.id}" data-route="${c.id}"><span class="nav-ico">${ico(c.icon, 24)}</span>${c.name}</a>`).join('')}
      </nav>
      <div class="side-bottom">
        <button class="signin" data-ign id="signin"></button>
        <button class="featured" data-open="${featured.id}">
          <span class="f-ico">${ico(featured.icon, 30)}</span>
          <span><small>Featured</small><b>${featured.name}</b>${price(featured)}</span>
        </button>
        <button class="btn btn-block" data-drawer>${I.cart} View cart <span class="count" id="sideCount">0</span></button>
        <a class="help" href="${config.discord}" target="_blank" rel="noopener">Need help? Join our Discord</a>
      </div>
    </aside>
    <div class="scrim" id="navScrim"></div>

    <div class="main">
      <header class="topbar">
        <button class="menu-btn" id="menuBtn" aria-label="Menu">${I.menu}</button>
        <a class="top-logo" href="#/"><img src="/logo-128.png" width="34" height="34" alt=""/><b>Crystal Ranked</b></a>
        <button class="chip chip-sm top-ip" data-copy>${ico('player', 18)} ${config.ip}<span class="sep"></span><i class="dot"></i><span class="online">—</span></button>
        <button class="cart-btn" data-drawer aria-label="Cart">${I.cart}<span id="topCount">0</span></button>
      </header>
      <main id="view"></main>
      <footer class="foot">
        <div class="foot-brand"><img src="/logo-128.png" width="24" height="24" alt=""/><b>Crystal Ranked</b> official store</div>
        <p>Payments and delivery handled securely by Tebex.<br/>Not affiliated with or endorsed by Mojang or Microsoft.</p>
        <nav><a href="${config.tebex}/terms/checkout" target="_blank" rel="noopener">Terms</a><a href="${config.discord}" target="_blank" rel="noopener">Discord</a></nav>
      </footer>
    </div>
  </div>

  <div class="scrim" id="scrim"></div>
  <aside class="drawer" id="drawer" aria-label="Cart">
    <div class="drawer-head"><h2>Your cart</h2><button class="x" data-close aria-label="Close">✕</button></div>
    <div class="drawer-body" id="drawerBody"></div>
    <div class="drawer-foot" id="drawerFoot"></div>
  </aside>

  <div class="modal" id="modal" role="dialog" aria-modal="true"><div class="modal-card" id="modalCard"></div></div>
  <div class="toast" id="toast"></div>
`;

// ── Views ───────────────────────────────────────────────
const card = (p) => `
  <article class="card" style="--c:${p.color}">
    <button class="card-open" data-open="${p.id}">
      <span class="card-art">${ico(p.icon, 64)}</span>
      <span class="card-title">${p.name}</span>
      <span class="card-meta">${p.sub || p.short}</span>
    </button>
    <div class="card-foot">
      ${price(p)}
      <button class="btn btn-sm" data-add="${p.id}">${I.cart} ${p.type === 'subscribe' ? 'Subscribe' : 'Add'}</button>
    </div>
  </article>`;

// Small square particles drifting up, like the ones around an end crystal.
function particles() {
  let seed = 7;
  const r = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const cols = ['#ff7ab0', '#c08cff', '#ffffff', '#ff2a78'];
  return Array.from({ length: 22 }, (_, i) => {
    const size = r() < 0.3 ? 6 : 4;
    return `<i style="left:${(r() * 100).toFixed(1)}%;width:${size}px;height:${size}px;background:${cols[i % cols.length]};animation-duration:${(6 + r() * 6).toFixed(1)}s;animation-delay:-${(r() * 10).toFixed(1)}s"></i>`;
  }).join('');
}

function home() {
  const picks = [featured, ...products.filter((p) => p !== featured && (p.cat === 'ranks' || p.cat === 'practice'))].slice(0, 3);
  return `
    <section class="hero">
      <div class="hero-bg" aria-hidden="true"></div>
      <div class="particles" aria-hidden="true">${particles()}</div>
      <button class="hero-side play rise" style="--d:.15s" data-copy aria-label="Copy server IP ${config.ip}">
        <span class="side-tile play-tile"><svg viewBox="0 0 8 9" width="26" height="30" shape-rendering="crispEdges" fill="#fff"><path d="M1 0h2v1h1v1h1v1h1v1h1v1H6v1H5v1H4v1H3v1H1z"/></svg></span>
        <span class="side-txt"><b>Play now</b><small>${config.ip}</small><small class="live"><i class="dot"></i><span class="online">${online ?? '—'}</span></small></span>
      </button>
      <div class="hero-center rise">
        <img src="/logo.png" width="190" height="190" alt=""/>
        <h1>Crystal Ranked</h1>
        <p>Official store</p>
      </div>
      <a class="hero-side discord rise" style="--d:.25s" href="${config.discord}" target="_blank" rel="noopener">
        <span class="side-txt"><b>Discord</b><small>Join the server</small></span>
        <span class="side-tile dc-tile">${I.discord}</span>
      </a>
    </section>

    <h2 class="sec-title">Browse the store</h2>
    <section class="cat-grid">
      ${categories.map((c, i) => {
        const list = products.filter((p) => p.cat === c.id);
        const from = Math.min(...list.map((p) => now(p)));
        return `
        <a class="cat-tile rise" href="#/${c.id}" style="--c:${c.color}; --d:${0.05 * i + 0.1}s">
          <span class="cat-art">${ico(c.icon, 64)}</span>
          <b>${c.name}</b>
          <span class="cat-blurb">${c.blurb}</span>
          <span class="cat-foot"><span>${list.length} item${list.length > 1 ? 's' : ''} · from ${fmt(from)}</span>${I.arrow}</span>
        </a>`;
      }).join('')}
    </section>

    <h2 class="sec-title">Subscriptions</h2>
    <section class="grid">${picks.map(card).join('')}</section>

    ${community.topDonator || community.recent.length ? communityBlock() : ''}


    <h2 class="sec-title">FAQ</h2>
    <section class="faq">${faq.map((f) => `<details><summary>${f.q}</summary><p>${f.a}</p></details>`).join('')}</section>`;
}

function communityBlock() {
  return `
    <section class="community">
      ${community.topDonator ? `<div class="panel donator"><h3>Top donator</h3>
        <div class="donator-body"><img src="${body(community.topDonator.name, 120)}" alt="" height="120"/><div><b>${esc(community.topDonator.name)}</b><small>this month</small></div></div></div>` : ''}
      ${community.recent.length ? `<div class="panel recent"><h3>Recent purchases</h3>
        <div class="recent-row">${community.recent.map((n) => `<div class="buyer"><img src="${body(n, 64)}" alt="" height="64"/><small>${esc(n)}</small></div>`).join('')}</div></div>` : ''}
    </section>`;
}

function category(id) {
  const c = catOf(id);
  const list = products.filter((p) => p.cat === id);
  const first = list[0];
  const others = categories.filter((x) => x.id !== id);
  const offer = (p, i) => `
    <article class="offer rise" style="--c:${p.color}; --d:${0.06 * i + 0.1}s">
      <div class="offer-head">
        <button class="offer-art" data-open="${p.id}" aria-label="${esc(p.name)} details">${ico(p.icon, 64)}</button>
        <div>
          <h3>${p.name}</h3>
          ${p.sub ? `<span class="p-sub">${p.sub}</span>` : ''}
          ${price(p)}
        </div>
      </div>
      <div class="offer-body">${p.details.filter((d) => !/renews every month/i.test(d)).map((d) => `<p>${d}</p>`).join('') || `<p>${p.short}</p>`}</div>
      <div class="offer-foot">
        <button class="btn" data-add="${p.id}">${I.cart} ${p.type === 'subscribe' ? 'Subscribe' : 'Add to cart'}</button>
        <button class="link-btn" data-open="${p.id}">Details</button>
      </div>
    </article>`;

  let extra = '';
  if (id === 'events' && first.list) {
    extra = `
      <h2 class="sec-title">${first.list.title}</h2>
      <section class="opt-grid">${first.list.items.map((it, i) => {
        const [k, v] = it.split(' — ');
        return `<div class="opt-card rise" style="--d:${0.03 * i}s"><b>${k}</b><span>${v || ''}</span></div>`;
      }).join('')}</section>
      <h2 class="sec-title">How to redeem</h2>
      <section class="steps-row">${first.steps.map((st, i) => `<div class="step-card rise" style="--d:${0.05 * i}s"><span class="num">${i + 1}</span><p>${st.replace(/Select the @\w+ role ping/, 'Pick which role to ping')}</p></div>`).join('')}</section>`;
  }
  if (id === 'punishments' && first.warning) {
    extra = `
      <section class="rules rise">
        <span class="rules-ico">${ico('barrier', 48)}</span>
        <div><h3>Before you buy</h3><p>${first.warning.replace(/^If your ban/, 'If your ban or mute').replace('buy an unban', 'buy an unban or unmute')}</p></div>
      </section>`;
  }
  if (id === 'practice') {
    extra = `
      <h2 class="sec-title">Servers you get</h2>
      <section class="servers">
        ${['private.crystalranked.org', 'mctiers.crystalranked.org'].map((h, i) => `
          <button class="server rise" style="--d:${0.06 * i}s" data-copy-host="${h}">
            <img src="/logo-128.png" width="44" height="44" alt=""/>
            <span><b>${h}</b><small>Click to copy</small></span>
            ${ico('lock', 28)}
          </button>`).join('')}
      </section>`;
  }

  return `
    <section class="cat-banner rise" style="--c:${c.color}; --icon:url(/icons/${c.icon}.png)">
      <span class="banner-art">${ico(c.icon, 72)}</span>
      <div class="banner-txt">
        <h1>${c.name}</h1>
        <p>${c.blurb}</p>
      </div>
    </section>

    <section class="offers${list.length === 1 ? ' single' : ''}">${list.map(offer).join('')}</section>
    ${extra}

    <h2 class="sec-title">Other categories</h2>
    <section class="cat-rows">
      ${others.map((o, i) => `
        <a class="cat-row rise" href="#/${o.id}" style="--c:${o.color}; --d:${0.05 * i}s">
          <span class="cat-row-ico">${ico(o.icon, 32)}</span>
          <b>${o.name}</b>
          ${I.arrow}
        </a>`).join('')}
    </section>

    <section class="help-bar rise">
      <span class="help-ico">${ico('chat', 36)}</span>
      <div><b>Need help with a purchase?</b><span>Open a ticket in our Discord and staff will sort it out.</span></div>
      <a class="btn" href="${config.discord}" target="_blank" rel="noopener">${I.discord} Open Discord</a>
    </section>`;
}

function productModal(id) {
  const p = byId(id);
  $('#modalCard').innerHTML = `
    <button class="x modal-x" data-modal-close aria-label="Close">✕</button>
    <div class="pm-head" style="--c:${p.color}">
      <span class="pm-ico">${ico(p.icon, 56)}</span>
      <div><h2>${p.name}</h2>${p.sub ? `<span class="p-sub">${p.sub}</span>` : ''}${price(p)}</div>
    </div>
    <div class="pm-body">
      ${p.details.map((d) => `<p>${d}</p>`).join('')}
      ${p.list ? `<h4>${p.list.title}</h4><ul class="opt">${p.list.items.map((i) => {
        const [k, v] = i.split(' — ');
        return `<li><b>${k}</b>${v ? `<span>${v}</span>` : ''}</li>`;
      }).join('')}</ul>` : ''}
      ${p.steps ? `<h4>How to redeem</h4><ol class="redeem">${p.steps.map((s) => `<li>${s}</li>`).join('')}</ol>` : ''}
      ${p.warning ? `<div class="warn">${ico('barrier', 22)}<p>${p.warning}</p></div>` : ''}
    </div>
    <div class="pm-foot">
      <a class="btn btn-ghost" href="${tebexLink(p)}" target="_blank" rel="noopener">Buy on Tebex ${I.ext}</a>
      <button class="btn" data-add="${p.id}" data-modal-close>${I.cart} ${p.type === 'subscribe' ? 'Subscribe' : 'Add to cart'}</button>
    </div>`;
  $('#modal').classList.add('open');
}

// ── Router ──────────────────────────────────────────────
function route() {
  const id = location.hash.replace(/^#\/?/, '');
  const isCat = !!catOf(id);
  $('#view').innerHTML = isCat ? category(id) : home();
  $$('.side-nav a').forEach((a) => a.classList.toggle('on', a.dataset.route === (isCat ? id : '')));
  document.body.classList.remove('nav-open');
  if (online) $$('.online').forEach((el) => (el.textContent = online));
  if (counts) $$('.online-n').forEach((el) => (el.textContent = counts));
  scrollTo({ top: 0 });
}
addEventListener('hashchange', route);

// ── Cart ────────────────────────────────────────────────
const items = () => Object.entries(cart).map(([id, qty]) => ({ p: byId(id), qty })).filter((i) => i.p);
function renderCart() {
  const its = items();
  const count = its.reduce((a, i) => a + i.qty, 0);
  const total = its.reduce((a, i) => a + now(i.p) * i.qty, 0);
  $('#sideCount').textContent = count;
  $('#topCount').textContent = count;
  $('#topCount').classList.toggle('show', count > 0);

  $('#drawerBody').innerHTML = its.length
    ? its.map(({ p, qty }) => `
      <div class="line" style="--c:${p.color}">
        <span class="l-ico">${ico(p.icon, 30)}</span>
        <div class="l-info"><b>${p.name}</b><small>${fmt(now(p))}${p.type === 'subscribe' ? ' / month' : ' each'}</small></div>
        ${p.type === 'subscribe'
          ? `<button class="rm" data-dec="${p.id}" aria-label="Remove">Remove</button>`
          : `<div class="qty"><button data-dec="${p.id}" aria-label="Remove one">−</button><span>${qty}</span><button data-inc="${p.id}" aria-label="Add one">+</button></div>`}
      </div>`).join('')
    : `<div class="empty">${ico('chest', 48)}<b>Cart is empty</b></div>`;

  $('#drawerFoot').innerHTML = `
    <button class="deliver" data-ign><img src="${head(ign, 28)}" width="28" height="28" alt=""/>
      ${ign ? `<span>Delivering to <b>${esc(ign)}</b></span><u>Change</u>` : '<span>Add your Minecraft name</span><u>Set</u>'}</button>
    <div class="sum total"><span>Total</span><span>${fmt(total)}</span></div>
    <button class="btn btn-block" id="checkout" ${its.length ? '' : 'disabled'}>Checkout</button>
    <small class="fine">All sales are final. Subscriptions renew monthly until you cancel in Tebex.</small>`;
}
function add(id, el) {
  const p = byId(id);
  cart[id] = p.type === 'subscribe' ? 1 : (cart[id] || 0) + 1;
  ls.set('cr-cart2', cart);
  renderCart();
  if (el && !el.closest('.modal')) { el.classList.add('added'); setTimeout(() => el.classList.remove('added'), 900); }
  toast(`Added ${p.name} to cart`);
}
function setQty(id, q) {
  if (q <= 0) delete cart[id]; else cart[id] = q;
  ls.set('cr-cart2', cart);
  renderCart();
}
const drawer = (open) => { $('#drawer').classList.toggle('open', open); $('#scrim').classList.toggle('show', open); };

// ── Username ────────────────────────────────────────────
function renderIgn() {
  $('#signin').innerHTML = `<img src="${head(ign, 40)}" width="40" height="40" alt=""/>
    <span>${ign ? `<b>${esc(ign)}</b><small>Change account</small>` : '<b>Sign in</b><small>Set your Minecraft name</small>'}</span>`;
}
let afterIgn = null;
function askIgn(then) {
  afterIgn = then || null;
  drawer(false);
  $('#modalCard').innerHTML = `
    <form id="ignForm" class="ign-form">
      <h2>Sign in</h2>
      <p>Enter the Minecraft username that should receive your purchases.</p>
      <div class="ign-field"><img id="ignPreview" src="${head(ign, 64)}" width="52" height="52" alt=""/>
        <input id="ignInput" maxlength="16" placeholder="Minecraft username" value="${esc(ign)}" autocomplete="off" spellcheck="false" required/></div>
      <button class="btn btn-block">Continue</button>
    </form>`;
  $('#modal').classList.add('open');
  const input = $('#ignInput');
  setTimeout(() => input.focus(), 50);
  let t;
  input.addEventListener('input', () => {
    input.value = input.value.replace(/[^A-Za-z0-9_]/g, '');
    clearTimeout(t);
    t = setTimeout(() => ($('#ignPreview').src = head(input.value, 64)), 300);
  });
  $('#ignForm').addEventListener('submit', (e) => {
    e.preventDefault();
    ign = input.value.trim();
    ls.set('cr-ign', ign);
    $('#modal').classList.remove('open');
    renderIgn();
    renderCart();
    afterIgn?.();
  });
}
const closeModal = () => $('#modal').classList.remove('open');
$('#modal').addEventListener('click', (e) => e.target.id === 'modal' && closeModal());

let tt;
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(tt);
  tt = setTimeout(() => t.classList.remove('show'), 1800);
}

// ── Events ──────────────────────────────────────────────
document.addEventListener('click', (e) => {
  const t = e.target.closest('button, a');
  if (!t) return;
  const d = t.dataset;
  if (d.add) add(d.add, t);
  if (d.open) productModal(d.open);
  if (d.inc) setQty(d.inc, cart[d.inc] + 1);
  if (d.dec) setQty(d.dec, cart[d.dec] - 1);
  if ('modalClose' in d) closeModal();
  if ('drawer' in d) { document.body.classList.remove('nav-open'); drawer(true); }
  if ('close' in d) drawer(false);
  if ('ign' in d) askIgn();
  if ('copy' in d) navigator.clipboard?.writeText(config.ip).then(() => toast(`Copied ${config.ip}`));
  if (d.copyHost) navigator.clipboard?.writeText(d.copyHost).then(() => toast(`Copied ${d.copyHost}`));
  if (t.id === 'menuBtn') document.body.classList.toggle('nav-open');
  if (t.id === 'checkout') {
    const go = () => toast('Checkout not connected yet');
    ign ? go() : askIgn(() => { drawer(true); go(); });
  }
});
$('#scrim').addEventListener('click', () => drawer(false));
$('#navScrim').addEventListener('click', () => document.body.classList.remove('nav-open'));
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') { drawer(false); closeModal(); document.body.classList.remove('nav-open'); }
});

// ── Live player count ───────────────────────────────────
fetch(`https://api.mcsrvstat.us/3/${config.ip}`)
  .then((r) => r.json())
  .then((d) => {
    online = d.online ? `${d.players.online.toLocaleString()} online` : 'offline';
    counts = d.online ? `${d.players.online}/${d.players.max}` : 'offline';
    $$('.online').forEach((el) => (el.textContent = online));
    $$('.online-n').forEach((el) => (el.textContent = counts));
  })
  .catch(() => {});

renderIgn();
renderCart();
route();
