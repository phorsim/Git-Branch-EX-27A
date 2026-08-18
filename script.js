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
       Product filtering
       ========================================================= */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('is-active'));
            btn.classList.add('is-active');

            const filter = btn.dataset.filter;
            productCards.forEach(card => {
                const match = filter === 'all' || card.dataset.category === filter;
                card.classList.toggle('is-hidden', !match);
            });
        });
    });

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

    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.product-card');
            const product = {
                sku: card.dataset.sku,
                name: card.dataset.name,
                price: Number(card.dataset.price),
                image: card.querySelector('img').src
            };
            addToCart(product, btn);
        });
    });

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
        showToast('This is a demo — no real checkout here');
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

    renderCart();
});