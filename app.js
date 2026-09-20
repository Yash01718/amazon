// Amazon Clone - Interactive Application Script

const products = [
    {
        id: 1,
        title: "The Lean Startup: How Constant Innovation Creates Radically Successful Businesses",
        price: 29.99,
        rating: 5,
        image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80",
        category: "Books"
    },
    {
        id: 2,
        title: "Sony WH-1000XM5 Wireless Noise Canceling Headphones - Black",
        price: 349.99,
        rating: 5,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80",
        category: "Electronics"
    },
    {
        id: 3,
        title: "Apple 2026 MacBook Pro 16\" M3 Max (36GB RAM, 1TB SSD)",
        price: 2499.00,
        rating: 5,
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80",
        category: "Laptops"
    },
    {
        id: 4,
        title: "Samsung Galaxy Watch 6 Classic Smartwatch with Fitness Tracker",
        price: 199.99,
        rating: 4,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80",
        category: "Electronics"
    },
    {
        id: 5,
        title: "Nike Air Max 270 Running Shoes - Men's Athletic Sneakers",
        price: 129.95,
        rating: 4,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80",
        category: "Fashion"
    },
    {
        id: 6,
        title: "Kindle Paperwhite (16 GB) – 6.8\" Display & Adjustable Warm Light",
        price: 139.99,
        rating: 5,
        image: "https://images.unsplash.com/photo-1592496001020-d31bd830651f?auto=format&fit=crop&w=400&q=80",
        category: "Books"
    }
];

let cart = [];
let currentUser = null;

document.addEventListener('DOMContentLoaded', () => {
    renderProducts(products);
    initCartControls();
    initSearchControls();
    initAuthModals();
});

// Render Product Grid
function renderProducts(items) {
    const grid = document.getElementById('productGrid');
    if (!grid) return;
    
    grid.innerHTML = items.map(p => `
        <div class="product-card">
            <div>
                <h3 class="product-title">${escapeHtml(p.title)}</h3>
                <div class="product-rating">${'⭐'.repeat(p.rating)}</div>
                <div class="product-price">$${p.price.toFixed(2)}</div>
            </div>
            <img src="${p.image}" alt="${escapeHtml(p.title)}" class="product-image">
            <button class="add-to-cart-btn" onclick="addToCart(${p.id})">
                <i class="fas fa-shopping-cart"></i> Add to Basket
            </button>
        </div>
    `).join('');
}

// Add Item to Cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingIndex = cart.findIndex(item => item.id === productId);
    if (existingIndex > -1) {
        cart[existingIndex].quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartUI();
    openCartDrawer();
}

// Remove Item from Cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
}

// Update Cart Count & Total UI
function updateCartUI() {
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    document.getElementById('cartCount').textContent = totalItems;
    document.getElementById('cartTotalItems').textContent = totalItems;
    document.getElementById('cartTotalPrice').textContent = `$${totalPrice.toFixed(2)}`;
    document.getElementById('modalTotalPrice').textContent = `$${totalPrice.toFixed(2)}`;

    // Render Cart Items
    const container = document.getElementById('cartItemsContainer');
    if (cart.length === 0) {
        container.innerHTML = '<div class="text-center py-4 text-muted"><i class="fas fa-basket-shopping fa-3x mb-2"></i><p>Your Shopping Basket is empty.</p></div>';
    } else {
        container.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${escapeHtml(item.title)}">
                <div class="cart-item-info">
                    <div class="cart-item-title">${escapeHtml(item.title)}</div>
                    <div class="cart-item-price">$${item.price.toFixed(2)} x ${item.quantity}</div>
                    <button class="remove-item-btn" onclick="removeFromCart(${item.id})">Delete</button>
                </div>
            </div>
        `).join('');
    }
}

// Drawer Controls
function initCartControls() {
    const cartBtn = document.getElementById('cartBtn');
    const closeCartBtn = document.getElementById('closeCartBtn');
    const cartOverlay = document.getElementById('cartOverlay');
    const checkoutBtn = document.getElementById('checkoutBtn');

    cartBtn.addEventListener('click', openCartDrawer);
    closeCartBtn.addEventListener('click', closeCartDrawer);
    cartOverlay.addEventListener('click', closeCartDrawer);

    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Your cart is empty! Add some items before proceeding to checkout.');
            return;
        }
        closeCartDrawer();
        openModal('paymentModal');
    });

    document.getElementById('closeModalBtn').addEventListener('click', () => closeModal('paymentModal'));

    // Payment Form Submit
    document.getElementById('paymentForm').addEventListener('submit', (e) => {
        e.preventDefault();
        alert('🎉 Order Placed Successfully!\n\nThank you for shopping on Amazon Clone! Your payment was authorized via Stripe.');
        cart = [];
        updateCartUI();
        closeModal('paymentModal');
    });
}

function openCartDrawer() {
    document.getElementById('cartDrawer').classList.add('active');
    document.getElementById('cartOverlay').classList.add('active');
}

function closeCartDrawer() {
    document.getElementById('cartDrawer').classList.remove('active');
    document.getElementById('cartOverlay').classList.remove('active');
}

// Search Filter
function initSearchControls() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');

    function filter() {
        const query = searchInput.value.toLowerCase().trim();
        const filtered = products.filter(p => 
            p.title.toLowerCase().includes(query) || p.category.toLowerCase().includes(query)
        );
        renderProducts(filtered);
    }

    searchInput.addEventListener('keyup', filter);
    searchBtn.addEventListener('click', filter);
}

// Modal Auth Handlers
function initAuthModals() {
    const accountBtn = document.getElementById('accountBtn');
    const closeLoginBtn = document.getElementById('closeLoginBtn');
    const loginForm = document.getElementById('loginForm');

    accountBtn.addEventListener('click', () => openModal('loginModal'));
    closeLoginBtn.addEventListener('click', () => closeModal('loginModal'));

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        currentUser = email;
        document.getElementById('userGreeting').textContent = `Hello, ${email.split('@')[0]}`;
        alert(`Welcome back, ${email}! You are now signed in.`);
        closeModal('loginModal');
    });
}

function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

function escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
