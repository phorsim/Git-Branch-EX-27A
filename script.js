/* =========================================
   LUXEWEAR E-COMMERCE JAVASCRIPT
========================================= */


/* =========================================
   PRODUCT DATA
========================================= */

const products = [

    {
        id: 1,
        name: "Essential White T-Shirt",
        category: "T-Shirts",
        price: 18.99,
        oldPrice: null,
        icon: "👕",
        badge: "NEW",
        description:
            "A clean and comfortable everyday T-shirt made for modern casual outfits.",
        sizes: ["S", "M", "L", "XL"]
    },

    {
        id: 2,
        name: "Classic Black T-Shirt",
        category: "T-Shirts",
        price: 16.99,
        oldPrice: 22.99,
        icon: "👕",
        badge: "SALE",
        description:
            "A timeless black T-shirt that works with almost every outfit.",
        sizes: ["S", "M", "L", "XL"]
    },

    {
        id: 3,
        name: "Premium Oversized Tee",
        category: "T-Shirts",
        price: 24.99,
        oldPrice: null,
        icon: "👕",
        badge: "NEW",
        description:
            "Relaxed oversized fit with a premium feel for a contemporary streetwear look.",
        sizes: ["S", "M", "L", "XL"]
    },

    {
        id: 4,
        name: "Classic Oxford Shirt",
        category: "Shirts",
        price: 34.99,
        oldPrice: null,
        icon: "👔",
        badge: null,
        description:
            "A smart Oxford shirt suitable for work, events and everyday style.",
        sizes: ["S", "M", "L", "XL"]
    },

    {
        id: 5,
        name: "Linen Summer Shirt",
        category: "Shirts",
        price: 29.99,
        oldPrice: 39.99,
        icon: "👔",
        badge: "SALE",
        description:
            "Lightweight linen shirt designed to keep you comfortable on warm days.",
        sizes: ["S", "M", "L", "XL"]
    },

    {
        id: 6,
        name: "Relaxed Cargo Pants",
        category: "Pants",
        price: 42.99,
        oldPrice: null,
        icon: "👖",
        badge: "NEW",
        description:
            "Modern cargo pants with a relaxed fit and practical everyday pockets.",
        sizes: ["28", "30", "32", "34", "36"]
    },

    {
        id: 7,
        name: "Classic Denim Jeans",
        category: "Pants",
        price: 39.99,
        oldPrice: 49.99,
        icon: "👖",
        badge: "SALE",
        description:
            "Classic denim jeans with a comfortable fit and timeless appearance.",
        sizes: ["28", "30", "32", "34", "36"]
    },

    {
        id: 8,
        name: "Wide Leg Trousers",
        category: "Pants",
        price: 44.99,
        oldPrice: null,
        icon: "👖",
        badge: null,
        description:
            "Elegant wide-leg trousers for a clean and sophisticated silhouette.",
        sizes: ["28", "30", "32", "34", "36"]
    },

    {
        id: 9,
        name: "Elegant Summer Dress",
        category: "Dresses",
        price: 49.99,
        oldPrice: 69.99,
        icon: "👗",
        badge: "SALE",
        description:
            "A lightweight summer dress designed for elegant and effortless style.",
        sizes: ["XS", "S", "M", "L", "XL"]
    },

    {
        id: 10,
        name: "Minimal Black Dress",
        category: "Dresses",
        price: 59.99,
        oldPrice: null,
        icon: "👗",
        badge: "NEW",
        description:
            "A minimal black dress with a timeless design for special occasions.",
        sizes: ["XS", "S", "M", "L", "XL"]
    },

    {
        id: 11,
        name: "Oversized Denim Jacket",
        category: "Jackets",
        price: 54.99,
        oldPrice: 74.99,
        icon: "🧥",
        badge: "SALE",
        description:
            "An oversized denim jacket that adds an effortless streetwear touch.",
        sizes: ["S", "M", "L", "XL"]
    },

    {
        id: 12,
        name: "Classic Bomber Jacket",
        category: "Jackets",
        price: 64.99,
        oldPrice: null,
        icon: "🧥",
        badge: "NEW",
        description:
            "A versatile bomber jacket with a modern silhouette and comfortable fit.",
        sizes: ["S", "M", "L", "XL"]
    }

];


/* =========================================
   CART
========================================= */

let cart =
    JSON.parse(
        localStorage.getItem("luxewearCart")
    ) || [];


/* =========================================
   DOM ELEMENTS
========================================= */

const productsGrid =
    document.getElementById("productsGrid");

const searchInput =
    document.getElementById("searchInput");

const categoryFilter =
    document.getElementById("categoryFilter");

const sortFilter =
    document.getElementById("sortFilter");

const noProducts =
    document.getElementById("noProducts");

const cartBtn =
    document.getElementById("cartBtn");

const cartSidebar =
    document.getElementById("cartSidebar");

const cartOverlay =
    document.getElementById("cartOverlay");

const closeCart =
    document.getElementById("closeCart");

const cartItems =
    document.getElementById("cartItems");

const cartEmpty =
    document.getElementById("cartEmpty");

const cartCount =
    document.getElementById("cartCount");

const cartTotal =
    document.getElementById("cartTotal");

const productModal =
    document.getElementById("productModal");

const productModalContent =
    document.getElementById(
        "productModalContent"
    );

const closeProductModal =
    document.getElementById(
        "closeProductModal"
    );

const checkoutModal =
    document.getElementById(
        "checkoutModal"
    );

const checkoutBtn =
    document.getElementById(
        "checkoutBtn"
    );

const closeCheckout =
    document.getElementById(
        "closeCheckout"
    );

const themeBtn =
    document.getElementById("themeBtn");

const menuBtn =
    document.getElementById("menuBtn");

const navMenu =
    document.getElementById("navMenu");


/* =========================================
   FORMAT MONEY
========================================= */

function formatPrice(price) {

    return `$${price.toFixed(2)}`;

}


/* =========================================
   DISPLAY PRODUCTS
========================================= */

function displayProducts(list) {

    productsGrid.innerHTML = "";

    if (list.length === 0) {

        noProducts.style.display = "block";

        return;

    }

    noProducts.style.display = "none";


    list.forEach(product => {

        const card =
            document.createElement("article");

        card.className = "product-card";


        let badgeHTML = "";

        if (product.badge) {

            badgeHTML = `
                <span class="product-badge ${product.badge === "SALE"
                    ? "sale-badge"
                    : ""
                }">
                    ${product.badge}
                </span>
            `;

        }


        let oldPriceHTML = "";

        if (product.oldPrice) {

            oldPriceHTML = `
                <span class="old-price">
                    ${formatPrice(product.oldPrice)}
                </span>
            `;

        }


        card.innerHTML = `

            <div
                class="product-image"
                data-product="${product.id}"
            >

                ${badgeHTML}

                ${product.icon}

            </div>

            <div class="product-info">

                <span class="product-category">
                    ${product.category}
                </span>

                <h3 class="product-name">
                    ${product.name}
                </h3>

                <div class="product-price">

                    ${formatPrice(product.price)}

                    ${oldPriceHTML}

                </div>

                <div class="product-actions">

                    <button
                        class="add-cart"
                        data-add="${product.id}"
                    >
                        ADD TO CART
                    </button>

                    <button
                        class="view-product"
                        data-view="${product.id}"
                        title="View product"
                    >
                        👁
                    </button>

                </div>

            </div>

        `;


        productsGrid.appendChild(card);

    });

}


/* =========================================
   FILTER PRODUCTS
========================================= */

function filterProducts() {

    const search =
        searchInput.value
            .toLowerCase()
            .trim();

    const category =
        categoryFilter.value;

    const sort =
        sortFilter.value;


    let result =
        products.filter(product => {

            const matchesSearch =
                product.name
                    .toLowerCase()
                    .includes(search);

            const matchesCategory =
                category === "All" ||
                product.category === category;

            return (
                matchesSearch &&
                matchesCategory
            );

        });


    if (sort === "low") {

        result.sort(
            (a, b) => a.price - b.price
        );

    }

    if (sort === "high") {

        result.sort(
            (a, b) => b.price - a.price
        );

    }

    if (sort === "name") {

        result.sort(
            (a, b) =>
                a.name.localeCompare(b.name)
        );

    }


    displayProducts(result);

}


/* =========================================
   SEARCH EVENTS
========================================= */

searchInput.addEventListener(
    "input",
    filterProducts
);

categoryFilter.addEventListener(
    "change",
    filterProducts
);

sortFilter.addEventListener(
    "change",
    filterProducts
);


/* =========================================
   CATEGORY CARDS
========================================= */

document
    .querySelectorAll(".category-card")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const category =
                    button.dataset.category;

                categoryFilter.value =
                    category;

                document
                    .getElementById("shop")
                    .scrollIntoView({
                        behavior: "smooth"
                    });

                filterProducts();

            }
        );

    });


/* =========================================
   PRODUCT CLICK EVENTS
========================================= */

productsGrid.addEventListener(
    "click",
    event => {

        const addButton =
            event.target.closest(
                "[data-add]"
            );

        const viewButton =
            event.target.closest(
                "[data-view]"
            );


        if (addButton) {

            const id =
                Number(
                    addButton.dataset.add
                );

            openProductModal(id);

        }


        if (viewButton) {

            const id =
                Number(
                    viewButton.dataset.view
                );

            openProductModal(id);

        }

    }
);


/* =========================================
   PRODUCT MODAL
========================================= */

function openProductModal(id) {

    const product =
        products.find(
            product => product.id === id
        );

    if (!product) return;


    productModalContent.innerHTML = `

        <div class="modal-product">

            <div class="modal-product-image">
                ${product.icon}
            </div>

            <span class="product-category">
                ${product.category}
            </span>

            <h2>
                ${product.name}
            </h2>

            <p class="modal-description">
                ${product.description}
            </p>

            <div class="modal-price">
                ${formatPrice(product.price)}
            </div>

            <p class="size-title">
                SELECT SIZE
            </p>

            <div class="size-options">

                ${product.sizes
            .map(
                (size, index) => `
                            <button
                                class="size-btn ${index === 0
                        ? "active"
                        : ""
                    }"
                                data-size="${size}"
                            >
                                ${size}
                            </button>
                        `
            )
            .join("")
        }

            </div>

            <button
                class="btn btn-dark"
                id="modalAddToCart"
                style="width:100%"
            >
                ADD TO CART
            </button>

        </div>

    `;


    productModal.classList.add("show");

    document.body.style.overflow =
        "hidden";


    const sizeButtons =
        document.querySelectorAll(
            ".size-btn"
        );


    let selectedSize =
        product.sizes[0];


    sizeButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                sizeButtons.forEach(
                    btn =>
                        btn.classList.remove(
                            "active"
                        )
                );

                button.classList.add(
                    "active"
                );

                selectedSize =
                    button.dataset.size;

            }
        );

    });


    document
        .getElementById("modalAddToCart")
        .addEventListener(
            "click",
            () => {

                addToCart(
                    product.id,
                    selectedSize
                );

                closeProductModalWindow();

            }
        );

}


/* =========================================
   CLOSE PRODUCT MODAL
========================================= */

function closeProductModalWindow() {

    productModal.classList.remove(
        "show"
    );

    document.body.style.overflow =
        "auto";

}

closeProductModal.addEventListener(
    "click",
    closeProductModalWindow
);


/* =========================================
   CART FUNCTIONS
========================================= */

function addToCart(
    productId,
    size = "M"
) {

    const existing =
        cart.find(
            item =>
                item.productId === productId &&
                item.size === size
        );


    if (existing) {

        existing.quantity++;

    } else {

        cart.push({

            productId,
            size,
            quantity: 1

        });

    }


    saveCart();

    updateCart();

    openCart();

}


/* =========================================
   SAVE CART
========================================= */

function saveCart() {

    localStorage.setItem(
        "luxewearCart",
        JSON.stringify(cart)
    );

}


/* =========================================
   UPDATE CART
========================================= */

function updateCart() {

    cartItems.innerHTML = "";

    let total = 0;

    let itemCount = 0;


    cart.forEach(item => {

        const product =
            products.find(
                p =>
                    p.id === item.productId
            );

        if (!product) return;


        const subtotal =
            product.price *
            item.quantity;


        total += subtotal;

        itemCount += item.quantity;


        const cartItem =
            document.createElement("div");

        cartItem.className =
            "cart-item";


        cartItem.innerHTML = `

            <div class="cart-item-image">
                ${product.icon}
            </div>

            <div>

                <h4>
                    ${product.name}
                </h4>

                <p>
                    Size: ${item.size}
                </p>

                <div class="quantity">

                    <button
                        data-minus="${product.id}"
                        data-size="${item.size}"
                    >
                        −
                    </button>

                    <span>
                        ${item.quantity}
                    </span>

                    <button
                        data-plus="${product.id}"
                        data-size="${item.size}"
                    >
                        +
                    </button>

                </div>

                <button
                    class="remove-item"
                    data-remove="${product.id}"
                    data-size="${item.size}"
                >
                    Remove
                </button>

            </div>

            <div class="cart-item-price">
                ${formatPrice(subtotal)}
            </div>

        `;


        cartItems.appendChild(
            cartItem
        );

    });


    cartCount.textContent =
        itemCount;

    cartTotal.textContent =
        formatPrice(total);


    if (cart.length === 0) {

        cartEmpty.style.display =
            "block";

        checkoutBtn.disabled = true;

        checkoutBtn.style.opacity =
            "0.5";

    } else {

        cartEmpty.style.display =
            "none";

        checkoutBtn.disabled = false;

        checkoutBtn.style.opacity =
            "1";

    }

}


/* =========================================
   CART QUANTITY EVENTS
========================================= */

cartItems.addEventListener(
    "click",
    event => {

        const plus =
            event.target.closest(
                "[data-plus]"
            );

        const minus =
            event.target.closest(
                "[data-minus]"
            );

        const remove =
            event.target.closest(
                "[data-remove]"
            );


        if (plus) {

            changeQuantity(
                Number(plus.dataset.plus),
                plus.dataset.size,
                1
            );

        }


        if (minus) {

            changeQuantity(
                Number(minus.dataset.minus),
                minus.dataset.size,
                -1
            );

        }


        if (remove) {

            removeFromCart(
                Number(remove.dataset.remove),
                remove.dataset.size
            );

        }

    }
);


/* =========================================
   CHANGE QUANTITY
========================================= */

function changeQuantity(
    productId,
    size,
    amount
) {

    const item =
        cart.find(
            item =>
                item.productId === productId &&
                item.size === size
        );


    if (!item) return;


    item.quantity += amount;


    if (item.quantity <= 0) {

        cart =
            cart.filter(
                cartItem =>
                    !(
                        cartItem.productId === productId &&
                        cartItem.size === size
                    )
            );

    }


    saveCart();

    updateCart();

}


/* =========================================
   REMOVE ITEM
========================================= */

function removeFromCart(
    productId,
    size
) {

    cart =
        cart.filter(
            item =>
                !(
                    item.productId === productId &&
                    item.size === size
                )
        );


    saveCart();

    updateCart();

}


/* =========================================
   OPEN CART
========================================= */

function openCart() {

    cartSidebar.classList.add(
        "show"
    );

    cartOverlay.classList.add(
        "show"
    );

}


/* =========================================
   CLOSE CART
========================================= */

function closeCartWindow() {

    cartSidebar.classList.remove(
        "show"
    );

    cartOverlay.classList.remove(
        "show"
    );

}


cartBtn.addEventListener(
    "click",
    openCart
);

closeCart.addEventListener(
    "click",
    closeCartWindow
);

cartOverlay.addEventListener(
    "click",
    closeCartWindow
);


/* =========================================
   CHECKOUT
========================================= */

checkoutBtn.addEventListener(
    "click",
    () => {

        if (cart.length === 0) {

            alert(
                "Your cart is empty."
            );

            return;

        }

        closeCartWindow();

        checkoutModal.classList.add(
            "show"
        );

        document.body.style.overflow =
            "hidden";

    }
);


/* =========================================
   CLOSE CHECKOUT
========================================= */

closeCheckout.addEventListener(
    "click",
    () => {

        checkoutModal.classList.remove(
            "show"
        );

        document.body.style.overflow =
            "auto";

    }
);


/* =========================================
   CHECKOUT FORM
========================================= */

document
    .getElementById("checkoutForm")
    .addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const name =
                document.getElementById(
                    "customerName"
                ).value;


            const orderNumber =
                Math.floor(
                    100000 +
                    Math.random() * 900000
                );


            alert(
                `Thank you, ${name}!

Your order #${orderNumber} has been placed successfully.

We will contact you soon for delivery.`
            );


            cart = [];

            saveCart();

            updateCart();


            document
                .getElementById(
                    "checkoutForm"
                )
                .reset();


            checkoutModal.classList.remove(
                "show"
            );

            document.body.style.overflow =
                "auto";

        }
    );


/* =========================================
   CONTACT FORM
========================================= */

document
    .getElementById("contactForm")
    .addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const name =
                document.getElementById(
                    "contactName"
                ).value;


            alert(
                `Thank you, ${name}! Your message has been sent.`
            );


            event.target.reset();

        }
    );


/* =========================================
   NEWSLETTER
========================================= */

document
    .getElementById("newsletterForm")
    .addEventListener(
        "submit",
        event => {

            event.preventDefault();

            alert(
                "Thank you for subscribing to LUXEWEAR!"
            );

            event.target.reset();

        }
    );


/* =========================================
   DARK MODE
========================================= */

themeBtn.addEventListener(
    "click",
    () => {

        document.body.classList.toggle(
            "dark"
        );


        if (
            document.body.classList.contains(
                "dark"
            )
        ) {

            themeBtn.textContent = "☀️";

            localStorage.setItem(
                "luxewearTheme",
                "dark"
            );

        } else {

            themeBtn.textContent = "🌙";

            localStorage.setItem(
                "luxewearTheme",
                "light"
            );

        }

    }
);


/* =========================================
   LOAD THEME
========================================= */

if (
    localStorage.getItem(
        "luxewearTheme"
    ) === "dark"
) {

    document.body.classList.add(
        "dark"
    );

    themeBtn.textContent = "☀️";

}


/* =========================================
   MOBILE NAVIGATION
========================================= */

menuBtn.addEventListener(
    "click",
    () => {

        navMenu.classList.toggle(
            "show"
        );

    }
);


document
    .querySelectorAll(".nav-menu a")
    .forEach(link => {

        link.addEventListener(
            "click",
            () => {

                navMenu.classList.remove(
                    "show"
                );

            }
        );

    });


/* =========================================
   CLOSE MODALS WHEN CLICKING OUTSIDE
========================================= */

productModal.addEventListener(
    "click",
    event => {

        if (
            event.target === productModal
        ) {

            closeProductModalWindow();

        }

    }
);


checkoutModal.addEventListener(
    "click",
    event => {

        if (
            event.target === checkoutModal
        ) {

            checkoutModal.classList.remove(
                "show"
            );

            document.body.style.overflow =
                "auto";

        }

    }
);


/* =========================================
   ESCAPE KEY
========================================= */

document.addEventListener(
    "keydown",
    event => {

        if (event.key !== "Escape") {
            return;
        }

        closeProductModalWindow();

        checkoutModal.classList.remove(
            "show"
        );

        closeCartWindow();

        document.body.style.overflow =
            "auto";

    }
);


/* =========================================
   INITIALIZE
========================================= */

displayProducts(products);

updateCart();