/* ==========================================================
   FIELDWORK — store data + interactions
   ========================================================== */

const PRODUCTS = [
    {
        id: 'p1',
        name: 'Waxed Canvas Jacket',
        category: 'outerwear',
        price: 228,
        badge: 'New',
        fit: 'Relaxed',
        fabric: '14oz Waxed Canvas',
        desc: 'Weatherproof shell built for job sites and long commutes.',
        img: 'https://picsum.photos/seed/fieldwork-jacket/600/750'
    },
    {
        id: 'p2',
        name: 'Chore Coat',
        category: 'outerwear',
        price: 189,
        fit: 'Boxy',
        fabric: '12oz Cotton Twill',
        desc: 'A workshop staple with triple-stitched patch pockets.',
        img: 'https://picsum.photos/seed/fieldwork-chore/600/750'
    },
    {
        id: 'p3',
        name: 'Heavyweight Tee',
        category: 'basics',
        price: 42,
        fit: 'Regular',
        fabric: '220gsm Combed Cotton',
        desc: 'Dense, boxy, and built to outlast a hundred washes.',
        img: 'https://picsum.photos/seed/fieldwork-tee/600/750'
    },
    {
        id: 'p4',
        name: 'Flannel Overshirt',
        category: 'basics',
        price: 96,
        badge: 'Restock',
        fit: 'Relaxed',
        fabric: 'Brushed Cotton Flannel',
        desc: 'Layer it open or button it up, it holds its shape either way.',
        img: 'https://picsum.photos/seed/fieldwork-flannel/600/750'
    },
    {
        id: 'p5',
        name: 'Selvedge Straight Jean',
        category: 'denim',
        price: 168,
        fit: 'Straight',
        fabric: '13.5oz Selvedge Denim',
        desc: 'Raw denim that breaks in around you, not the other way around.',
        img: 'https://picsum.photos/seed/fieldwork-jean/600/750'
    },
    {
        id: 'p6',
        name: 'Canvas Work Pant',
        category: 'denim',
        price: 142,
        fit: 'Tapered',
        fabric: '11oz Duck Canvas',
        desc: 'Double-knee construction with a hammer loop that actually works.',
        img: 'https://picsum.photos/seed/fieldwork-pant/600/750'
    },
    {
        id: 'p7',
        name: 'Insulated Vest',
        category: 'outerwear',
        price: 134,
        fit: 'Regular',
        fabric: 'Quilted Nylon / Fleece',
        desc: 'Core warmth without the bulk, for days you need your arms free.',
        img: 'https://picsum.photos/seed/fieldwork-vest/600/750'
    },
    {
        id: 'p8',
        name: 'Ribbed Waffle Henley',
        category: 'basics',
        price: 58,
        fit: 'Slim',
        fabric: 'Waffle Knit Cotton',
        desc: 'A base layer that still looks finished on its own.',
        img: 'https://picsum.photos/seed/fieldwork-henley/600/750'
    },
    {
        id: 'p9',
        name: 'Slim Selvedge Jean',
        category: 'denim',
        price: 172,
        badge: 'New',
        fit: 'Slim',
        fabric: '13oz Selvedge Denim',
        desc: 'Same raw denim, cut closer through the leg.',
        img: 'https://picsum.photos/seed/fieldwork-slimjean/600/750'
    }
];

const money = (n) => `$${n.toLocaleString('en-US')}`;

/* ---------------- State ---------------- */
let cart = [];       // [{id, qty}]
let activeFilter = 'all';

/* ---------------- DOM refs ---------------- */
const productGrid = document.getElementById('productGrid');
const filters = document.getElementById('filters');
const cartToggle = document.getElementById('cartToggle');
const cartClose = document.getElementById('cartClose');
const cartOverlay = document.getElementById('cartOverlay');
const cartDrawer = document.getElementById('cartDrawer');
const cartItemsEl = document.getElementById('cartItems');
const cartEmptyEl = document.getElementById('cartEmpty');
const cartCountEl = document.getElementById('cartCount');
const cartSubtotalEl = document.getElementById('cartSubtotal');
const checkoutBtn = document.getElementById('checkoutBtn');
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');
const newsletterForm = document.getElementById('newsletterForm');
const newsletterMsg = document.getElementById('newsletterMsg');
const toastEl = document.getElementById('toast');

/* ---------------- Render products ---------------- */
function renderProducts() {
    const list = PRODUCTS.filter(p => activeFilter === 'all' || p.category === activeFilter);

    productGrid.innerHTML = list.map(p => `
    <article class="product-card" data-id="${p.id}">
      <div class="product-media">
        ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ''}
        <img src="${p.img}" alt="${p.name}, ${p.fabric}, ${p.fit} fit" loading="lazy">
      </div>
      <div class="product-info">
        <span class="product-cat">${p.category}</span>
        <h3 class="product-name">${p.name}</h3>
        <p class="product-desc">${p.desc}</p>
        <div class="product-bottom">
          <span class="product-price">${money(p.price)}</span>
          <button class="add-btn" data-add="${p.id}">Add to Bag</button>
        </div>
      </div>
    </article>
  `).join('');
}

filters.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    activeFilter = btn.dataset.filter;
    [...filters.children].forEach(b => b.classList.toggle('active', b === btn));
    renderProducts();
});

productGrid.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-add]');
    if (!btn) return;
    addToCart(btn.dataset.add);
    btn.classList.add('added');
    const original = btn.textContent;
    btn.textContent = 'Added ✓';
    setTimeout(() => { btn.classList.remove('added'); btn.textContent = original; }, 1200);
});

/* ---------------- Cart logic ---------------- */
function addToCart(id) {
    const line = cart.find(l => l.id === id);
    if (line) { line.qty += 1; } else { cart.push({ id, qty: 1 }); }
    renderCart();
    const product = PRODUCTS.find(p => p.id === id);
    showToast(`${product.name} added to your bag`);
}

function changeQty(id, delta) {
    const line = cart.find(l => l.id === id);
    if (!line) return;
    line.qty += delta;
    if (line.qty <= 0) cart = cart.filter(l => l.id !== id);
    renderCart();
}

function removeFromCart(id) {
    cart = cart.filter(l => l.id !== id);
    renderCart();
}

function cartTotal() {
    return cart.reduce((sum, line) => {
        const p = PRODUCTS.find(pr => pr.id === line.id);
        return sum + p.price * line.qty;
    }, 0);
}

function cartCount() {
    return cart.reduce((sum, line) => sum + line.qty, 0);
}

function renderCart() {
    cartCountEl.textContent = cartCount();
    cartSubtotalEl.textContent = money(cartTotal());

    if (cart.length === 0) {
        cartItemsEl.innerHTML = '';
        cartItemsEl.appendChild(cartEmptyEl);
        return;
    }

    cartItemsEl.innerHTML = cart.map(line => {
        const p = PRODUCTS.find(pr => pr.id === line.id);
        return `
      <div class="cart-item" data-id="${p.id}">
        <img src="${p.img}" alt="${p.name}">
        <div>
          <div class="cart-item-name">${p.name}</div>
          <div class="cart-item-price">${money(p.price)}</div>
          <div class="cart-item-qty">
            <button class="qty-btn" data-qty="-1">−</button>
            <span>${line.qty}</span>
            <button class="qty-btn" data-qty="1">+</button>
          </div>
        </div>
        <button class="cart-item-remove" data-remove>Remove</button>
      </div>
    `;
    }).join('');
}

cartItemsEl.addEventListener('click', (e) => {
    const item = e.target.closest('.cart-item');
    if (!item) return;
    const id = item.dataset.id;

    if (e.target.matches('[data-qty]')) {
        changeQty(id, Number(e.target.dataset.qty));
    }
    if (e.target.matches('[data-remove]')) {
        removeFromCart(id);
    }
});

/* ---------------- Cart drawer open/close ---------------- */
function openCart() {
    cartDrawer.classList.add('open');
    cartOverlay.classList.add('open');
    cartDrawer.setAttribute('aria-hidden', 'false');
}
function closeCart() {
    cartDrawer.classList.remove('open');
    cartOverlay.classList.remove('open');
    cartDrawer.setAttribute('aria-hidden', 'true');
}
cartToggle.addEventListener('click', openCart);
cartClose.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeCart(); });

checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        showToast('Your bag is empty');
        return;
    }
    showToast('This is a demo — no real checkout yet');
});

/* ---------------- Mobile menu ---------------- */
menuToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    menuToggle.classList.toggle('open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
});
mainNav.addEventListener('click', (e) => {
    if (e.target.matches('.nav-link')) {
        mainNav.classList.remove('open');
        menuToggle.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
    }
});

/* ---------------- Newsletter (demo, no backend) ---------------- */
newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = newsletterForm.querySelector('input');
    if (!input.value) return;
    newsletterMsg.textContent = `You're on the list — we'll email ${input.value} when new stock lands.`;
    input.value = '';
});

/* ---------------- Toast ---------------- */
let toastTimer;
function showToast(msg) {
    clearTimeout(toastTimer);
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2200);
}

/* ---------------- Init ---------------- */
renderProducts();
renderCart();