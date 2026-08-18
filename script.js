/* =========================================================
   PRODUCT CATALOG — generated data
   Reuses a small set of verified image URLs per category
   (a real store would have one photo per SKU; here they
   cycle so every card still renders a relevant, working image).
   ========================================================= */
const CATALOG_CONFIG = {
    tops: {
        types: ['Heavyweight Tee', 'Flannel Overshirt', 'Chambray Shirt', 'Crewneck Sweatshirt', 'Waffle Henley', 'Oxford Work Shirt', 'Loopback Fleece Pullover', 'Ribbed Tank'],
        colors: ['Ink', 'Rust', 'Olive', 'Indigo', 'Canvas', 'Charcoal', 'Clay', 'Stone', 'Bone'],
        materials: ['240gsm combed cotton', 'double-napped brushed flannel', 'washed chambray', '14oz loopback fleece', 'waffle-knit cotton', 'brushed oxford weave'],
        basePrice: 38,
        priceStep: 5,
        images: [
            'photo-1521572163474-6864f9cf17ab',
            'photo-1596755094514-f87e34085b2c',
            'photo-1618354691373-d851c5c3a990',
            'photo-1562157873-818bc0726f68'
        ]
    },
    bottoms: {
        types: ['Utility Trouser', 'Selvedge Denim', 'Cargo Pant', 'Canvas Short', 'Relaxed Chino', 'Straight Jean', 'Ripstop Work Pant'],
        colors: ['Olive', 'Raw Indigo', 'Stone', 'Charcoal', 'Canvas', 'Rust', 'Ink'],
        materials: ['ripstop cotton', '14oz Japanese selvedge', 'brushed twill', '10oz canvas', 'sanforized denim'],
        basePrice: 68,
        priceStep: 6,
        images: [
            'photo-1473966968600-fa801b869a1a',
            'photo-1542272604-787c3835535d',
            'photo-1584865288642-42078afe6942'
        ]
    },
    outerwear: {
        types: ['Chore Coat', 'Shop Vest', 'Denim Jacket', 'Field Jacket', 'Canvas Parka', 'Wool Overshirt'],
        colors: ['Indigo', 'Rust', 'Olive', 'Charcoal', 'Canvas', 'Stone'],
        materials: ['10oz duck canvas', 'waxed canvas', 'rigid selvedge denim', 'brushed melton wool', 'ripstop nylon shell'],
        basePrice: 96,
        priceStep: 9,
        images: [
            'photo-1544022613-e87ca75a784a',
            'photo-1551028719-00167b16eac5',
            'photo-1523381210434-271e8be1f52b'
        ]
    },
    accessories: {
        types: ['Canvas Tote', 'Leather Belt', 'Wool Beanie', 'Work Cap', 'Shop Apron', 'Canvas Duffel', 'Cotton Bandana'],
        colors: ['Ink', 'Rust', 'Olive', 'Canvas', 'Stone', 'Indigo'],
        materials: ['10oz waxed canvas', 'full-grain leather', 'merino wool blend', 'brushed cotton twill'],
        basePrice: 22,
        priceStep: 4,
        images: [
            'photo-1489987707025-afc232f7ea0f',
            'photo-1544022613-e87ca75a784a'
        ]
    }
};

const CATEGORY_TARGET_COUNTS = { tops: 30, bottoms: 25, outerwear: 24, accessories: 21 };

function buildCatalog() {
    const products = [];
    let skuCounter = 1;

    Object.entries(CATEGORY_TARGET_COUNTS).forEach(([category, count]) => {
        const cfg = CATALOG_CONFIG[category];
        let combosMade = 0;
        outer:
        for (let t = 0; t < cfg.types.length; t++) {
            for (let c = 0; c < cfg.colors.length; c++) {
                if (combosMade >= count) break outer;
                const type = cfg.types[t];
                const color = cfg.colors[c];
                const material = cfg.materials[(t + c) % cfg.materials.length];
                const image = cfg.images[combosMade % cfg.images.length];
                const price = cfg.basePrice + ((t * 3 + c) % 7) * cfg.priceStep;
                const sku = `FF-${String(skuCounter).padStart(3, '0')}`;

                products.push({
                    sku,
                    name: `${type}, ${color}`,
                    category,
                    price,
                    desc: `${material[0].toUpperCase()}${material.slice(1)}, cut for daily wear.`,
                    image: `https://images.unsplash.com/${image}?auto=format&fit=crop&w=700&q=80`,
                    lowStock: skuCounter % 9 === 0
                });

                skuCounter++;
                combosMade++;
            }
        }
    });

    return products;
}

const CATALOG = buildCatalog();

document.addEventListener('DOMContentLoaded', () => {

    /* =========================================================
       Mobile nav toggle
       ========================================================= */
    const navToggle = document.getElementById('nav-toggle');
    const mainNav = document.getElementById('main-nav');

    navToggle.addEventListener('click', () => {
        const isOpen = mainNav.classList.toggle('is-open');
        navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    mainNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mainNav.classList.remove('is-open');
            navToggle.setAttribute('aria-expanded', 'false');
        });
    });

    /* =========================================================
       Scroll-spy: highlight the nav link for the section in view
       ========================================================= */
    const navLinks = document.querySelectorAll('[data-nav-link]');
    const navSections = Array.from(navLinks)
        .map(link => document.querySelector(link.getAttribute('href')))
        .filter(Boolean);

    function setActiveLink(id) {
        navLinks.forEach(link => {
            link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
        });
    }

    if ('IntersectionObserver' in window && navSections.length) {
        const spyObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setActiveLink(entry.target.id);
                }
            });
        }, {
            rootMargin: '-45% 0px -50% 0px', // trigger when section crosses mid-viewport
            threshold: 0
        });

        navSections.forEach(section => spyObserver.observe(section));
    }

    /* =========================================================
       Product rendering, filtering & load-more
       ========================================================= */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productGrid = document.getElementById('product-grid');
    const loadMoreBtn = document.getElementById('load-more-btn');
    const loadMoreNote = document.getElementById('load-more-note');
    const resultCount = document.getElementById('result-count');

    const PAGE_SIZE = 12;
    let currentFilter = 'all';
    let visibleCount = PAGE_SIZE;

    function cardMarkup(product) {
        return `
      <article class="product-card" data-category="${product.category}" data-name="${product.name}" data-price="${product.price}" data-sku="${product.sku}">
        <div class="product-media">
          <img src="${product.image}" alt="${product.name}" loading="lazy">
          <span class="stock-stamp">${product.lowStock ? 'LOW STOCK' : 'IN STOCK'}</span>
        </div>
        <div class="product-body">
          <div class="product-row">
            <h3>${product.name}</h3>
            <span class="price">$${product.price}</span>
          </div>
          <p class="product-desc">${product.desc}</p>
          <div class="product-row product-meta">
            <span class="sku">SKU ${product.sku}</span>
            <button class="btn btn-small add-to-cart">Add to Cart</button>
          </div>
        </div>
      </article>
    `;
    }

    function getFiltered() {
        return currentFilter === 'all'
            ? CATALOG
            : CATALOG.filter(p => p.category === currentFilter);
    }

    function renderProducts() {
        const filtered = getFiltered();
        const slice = filtered.slice(0, visibleCount);

        productGrid.innerHTML = slice.map(cardMarkup).join('');

        resultCount.textContent = `${filtered.length} item${filtered.length === 1 ? '' : 's'}`;

        const remaining = filtered.length - slice.length;
        if (remaining > 0) {
            loadMoreBtn.hidden = false;
            loadMoreNote.textContent = `Showing ${slice.length} of ${filtered.length}`;
        } else {
            loadMoreBtn.hidden = true;
            loadMoreNote.textContent = filtered.length
                ? `Showing all ${filtered.length}`
                : '';
        }
    }

    loadMoreBtn.addEventListener('click', () => {
        visibleCount += PAGE_SIZE;
        renderProducts();
    });

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('is-active'));
            btn.classList.add('is-active');
            currentFilter = btn.dataset.filter;
            visibleCount = PAGE_SIZE;
            renderProducts();
        });
    });

    // Event delegation: cards are rendered dynamically, so listen on the grid
    productGrid.addEventListener('click', e => {
        const btn = e.target.closest('.add-to-cart');
        if (!btn) return;
        const card = btn.closest('.product-card');
        const product = {
            sku: card.dataset.sku,
            name: card.dataset.name,
            price: Number(card.dataset.price),
            image: card.querySelector('img').src
        };
        addToCart(product, btn);
    });

    renderProducts();

    /* =========================================================
       Cart
       ========================================================= */
    const cart = []; // { sku, name, price, image, qty }

    const cartBtn = document.getElementById('cart-btn');
    const cartClose = document.getElementById('cart-close');
    const cartDrawer = document.getElementById('cart-drawer');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartItemsEl = document.getElementById('cart-items');
    const cartEmptyEl = document.getElementById('cart-empty');
    const cartCountEl = document.getElementById('cart-count');
    const cartSubtotalEl = document.getElementById('cart-subtotal');
    const checkoutBtn = document.getElementById('checkout-btn');
    const toast = document.getElementById('toast');

    function money(n) {
        return '$' + n.toFixed(0);
    }

    function openCart() {
        cartDrawer.classList.add('is-open');
        cartOverlay.classList.add('is-open');
        cartDrawer.setAttribute('aria-hidden', 'false');
    }

    function closeCart() {
        cartDrawer.classList.remove('is-open');
        cartOverlay.classList.remove('is-open');
        cartDrawer.setAttribute('aria-hidden', 'true');
    }

    cartBtn.addEventListener('click', openCart);
    cartClose.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeCart();
    });

    function showToast(message) {
        toast.textContent = message;
        toast.classList.add('is-visible');
        clearTimeout(showToast._t);
        showToast._t = setTimeout(() => toast.classList.remove('is-visible'), 2200);
    }

    function renderCart() {
        cartItemsEl.innerHTML = '';

        if (cart.length === 0) {
            cartEmptyEl.style.display = 'block';
            cartItemsEl.appendChild(cartEmptyEl);
        } else {
            cartEmptyEl.style.display = 'none';

            cart.forEach(item => {
                const line = document.createElement('div');
                line.className = 'cart-line';
                line.innerHTML = `
          <img src="${item.image}" alt="${item.name}">
          <div class="cart-line-info">
            <h4>${item.name}</h4>
            <div class="cart-line-meta">
              <button class="qty-btn" data-action="dec" data-sku="${item.sku}" aria-label="Decrease quantity">−</button>
              <span>${item.qty}</span>
              <button class="qty-btn" data-action="inc" data-sku="${item.sku}" aria-label="Increase quantity">+</button>
              <span>${money(item.price * item.qty)}</span>
              <button class="cart-line-remove" data-action="remove" data-sku="${item.sku}">Remove</button>
            </div>
          </div>
        `;
                cartItemsEl.appendChild(line);
            });
        }

        const totalQty = cart.reduce((sum, i) => sum + i.qty, 0);
        const subtotal = cart.reduce((sum, i) => sum + i.qty * i.price, 0);
        cartCountEl.textContent = totalQty;
        cartSubtotalEl.textContent = money(subtotal);
    }

    function addToCart(product, btn) {
        const existing = cart.find(i => i.sku === product.sku);
        if (existing) {
            existing.qty += 1;
        } else {
            cart.push({ ...product, qty: 1 });
        }
        renderCart();
        showToast(`${product.name} added to cart`);

        if (btn) {
            const original = btn.textContent;
            btn.textContent = 'Added ✓';
            btn.classList.add('is-added');
            setTimeout(() => {
                btn.textContent = original;
                btn.classList.remove('is-added');
            }, 1200);
        }
    }

    cartItemsEl.addEventListener('click', e => {
        const target = e.target.closest('[data-action]');
        if (!target) return;

        const sku = target.dataset.sku;
        const item = cart.find(i => i.sku === sku);
        if (!item) return;

        if (target.dataset.action === 'inc') {
            item.qty += 1;
        } else if (target.dataset.action === 'dec') {
            item.qty -= 1;
            if (item.qty <= 0) {
                cart.splice(cart.indexOf(item), 1);
            }
        } else if (target.dataset.action === 'remove') {
            cart.splice(cart.indexOf(item), 1);
        }
        renderCart();
    });

    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            showToast('Your cart is empty');
            return;
        }
        closeCart();
        openCheckout();
    });

    /* =========================================================
       Checkout modal
       ========================================================= */
    const checkoutOverlay = document.getElementById('checkout-overlay');
    const checkoutModal = document.getElementById('checkout-modal');
    const checkoutClose = document.getElementById('checkout-close');
    const checkoutForm = document.getElementById('checkout-form');
    const checkoutSummary = document.getElementById('checkout-summary');
    const placeOrderBtn = document.getElementById('place-order-btn');
    const orderConfirm = document.getElementById('order-confirm');
    const confirmOrderId = document.getElementById('confirm-order-id');
    const confirmEmail = document.getElementById('confirm-email');
    const confirmSummary = document.getElementById('confirm-summary');
    const confirmCloseBtn = document.getElementById('confirm-close-btn');

    function buildSummaryHTML() {
        const lines = cart.map(item => `
      <div class="summary-line">
        <span>${item.qty} × ${item.name}</span>
        <span>${money(item.price * item.qty)}</span>
      </div>
    `).join('');
        const subtotal = cart.reduce((sum, i) => sum + i.qty * i.price, 0);
        const shipping = subtotal > 0 ? 8 : 0;
        const total = subtotal + shipping;
        return `
      ${lines}
      <div class="summary-line"><span>Shipping</span><span>${money(shipping)}</span></div>
      <div class="summary-total"><span>Total</span><span>${money(total)}</span></div>
    `;
    }

    function openCheckout() {
        checkoutForm.hidden = false;
        orderConfirm.hidden = true;
        checkoutSummary.innerHTML = buildSummaryHTML();
        checkoutOverlay.classList.add('is-open');
        checkoutModal.classList.add('is-open');
        checkoutModal.setAttribute('aria-hidden', 'false');
    }

    function closeCheckout() {
        checkoutOverlay.classList.remove('is-open');
        checkoutModal.classList.remove('is-open');
        checkoutModal.setAttribute('aria-hidden', 'true');
    }

    checkoutClose.addEventListener('click', closeCheckout);
    checkoutOverlay.addEventListener('click', closeCheckout);
    confirmCloseBtn.addEventListener('click', closeCheckout);
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeCheckout();
    });

    function setFieldError(id, message) {
        const errorEl = document.getElementById(`err-${id}`);
        const inputEl = document.getElementById(`co-${id}`);
        errorEl.textContent = message || '';
        inputEl.closest('.field').classList.toggle('has-error', Boolean(message));
    }

    function validateCheckout(data) {
        let valid = true;

        if (!data.name.trim()) { setFieldError('name', 'Enter your name'); valid = false; }
        else setFieldError('name', '');

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) { setFieldError('email', 'Enter a valid email'); valid = false; }
        else setFieldError('email', '');

        if (!data.address.trim()) { setFieldError('address', 'Enter your address'); valid = false; }
        else setFieldError('address', '');

        if (!data.city.trim()) { setFieldError('city', 'Enter your city'); valid = false; }
        else setFieldError('city', '');

        if (!data.zip.trim()) { setFieldError('zip', 'Enter a ZIP / postal code'); valid = false; }
        else setFieldError('zip', '');

        const cardDigits = data.card.replace(/\s+/g, '');
        if (!/^\d{13,19}$/.test(cardDigits)) { setFieldError('card', 'Enter a valid card number'); valid = false; }
        else setFieldError('card', '');

        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(data.exp.trim())) { setFieldError('exp', 'Use MM/YY'); valid = false; }
        else setFieldError('exp', '');

        if (!/^\d{3,4}$/.test(data.cvc.trim())) { setFieldError('cvc', '3-4 digits'); valid = false; }
        else setFieldError('cvc', '');

        return valid;
    }

    function generateOrderId() {
        const rand = Math.floor(1000 + Math.random() * 9000);
        return `FF-ORD-${rand}`;
    }

    checkoutForm.addEventListener('submit', e => {
        e.preventDefault();

        const data = {
            name: document.getElementById('co-name').value,
            email: document.getElementById('co-email').value,
            address: document.getElementById('co-address').value,
            city: document.getElementById('co-city').value,
            zip: document.getElementById('co-zip').value,
            card: document.getElementById('co-card').value,
            exp: document.getElementById('co-exp').value,
            cvc: document.getElementById('co-cvc').value
        };

        if (!validateCheckout(data)) return;

        const orderId = generateOrderId();
        confirmOrderId.textContent = orderId;
        confirmEmail.textContent = data.email.trim();
        confirmSummary.innerHTML = buildSummaryHTML();

        checkoutForm.hidden = true;
        orderConfirm.hidden = false;

        placeOrderBtn.disabled = false;

        // Clear the cart now that the order is "placed"
        cart.length = 0;
        renderCart();
        checkoutForm.reset();
    });

    /* =========================================================
       Newsletter signup
       ========================================================= */
    const signupForm = document.getElementById('signup-form');
    const emailInput = document.getElementById('email');
    const formNote = document.getElementById('form-note');

    signupForm.addEventListener('submit', e => {
        e.preventDefault();
        const value = emailInput.value.trim();
        const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

        if (!isValid) {
            formNote.textContent = 'That email doesn\u2019t look right — give it another try.';
            formNote.style.color = '#e8b7a3';
            return;
        }

        formNote.textContent = `You're on the list with ${value}. Watch for restock notices.`;
        formNote.style.color = '#d9c9b8';
        signupForm.reset();
    });

    /* =========================================================
       Header shadow on scroll
       ========================================================= */
    const header = document.querySelector('.site-header');
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const y = window.scrollY;
        header.style.boxShadow = y > 4 ? '0 1px 0 rgba(32,31,27,0.08)' : 'none';
        lastScroll = y;
    }, { passive: true });

    document.getElementById('co-card').addEventListener('input', e => {
        let digits = e.target.value.replace(/\D/g, '').slice(0, 19);
        e.target.value = digits.replace(/(.{4})/g, '$1 ').trim();
    });

    document.getElementById('co-exp').addEventListener('input', e => {
        let digits = e.target.value.replace(/\D/g, '').slice(0, 4);
        e.target.value = digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
    });

    document.getElementById('co-cvc').addEventListener('input', e => {
        e.target.value = e.target.value.replace(/\D/g, '').slice(0, 4);
    });

    renderCart();
});