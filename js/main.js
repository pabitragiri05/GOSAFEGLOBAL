// ================================================================
//  GoSafe Global — Main JavaScript
// ================================================================

// ── State ──
const state = {
  cart: JSON.parse(localStorage.getItem('gsg_cart') || '[]'),
  wishlist: JSON.parse(localStorage.getItem('gsg_wishlist') || '[]'),
  currentFilter: 'all',
  testimonialIndex: 0,
};

// ── Utils ──
function saveCart() { localStorage.setItem('gsg_cart', JSON.stringify(state.cart)); }
function saveWishlist() { localStorage.setItem('gsg_wishlist', JSON.stringify(state.wishlist)); }

function showToast(msg, type = 'success') {
  const container = document.getElementById('toast-container') || (() => {
    const el = document.createElement('div');
    el.className = 'toast-container';
    el.id = 'toast-container';
    document.body.appendChild(el);
    return el;
  })();
  const toast = document.createElement('div');
  toast.className = `toast ${type === 'error' ? 'error' : ''}`;
  toast.innerHTML = `<i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'check-circle'}"></i>${msg}`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('fade-out');
    setTimeout(() => toast.remove(), 350);
  }, 2800);
}

function formatPrice(p) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p);
}

function starHTML(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  let s = '';
  for (let i = 0; i < full; i++) s += '<i class="fas fa-star"></i>';
  if (half) s += '<i class="fas fa-star-half-alt"></i>';
  for (let i = full + (half ? 1 : 0); i < 5; i++) s += '<i class="far fa-star"></i>';
  return s;
}

// ── Cart Logic ──
function addToCart(productId) {
  const product = window.GOSAFE_PRODUCTS.find(p => p.id === productId);
  if (!product) return;
  const existing = state.cart.find(item => item.id === productId);
  if (existing) {
    existing.qty++;
  } else {
    state.cart.push({ ...product, qty: 1 });
  }
  saveCart();
  updateCartUI();
  showToast(`<strong>${product.name}</strong> added to inquiry cart!`);
  openCart();
}

function removeFromCart(productId) {
  state.cart = state.cart.filter(item => item.id !== productId);
  saveCart();
  updateCartUI();
  renderCartItems();
}

function updateCartQty(productId, delta) {
  const item = state.cart.find(i => i.id === productId);
  if (!item) return;
  item.qty = Math.max(1, item.qty + delta);
  saveCart();
  updateCartUI();
  renderCartItems();
}

function updateCartUI() {
  const count = state.cart.reduce((sum, i) => sum + i.qty, 0);
  const countEl = document.getElementById('cart-count');
  if (countEl) countEl.textContent = count;
  renderCartItems();
}

function renderCartItems() {
  const container = document.getElementById('cart-items');
  const footer = document.getElementById('cart-footer');
  const empty = document.getElementById('cart-empty');
  if (!container) return;

  if (state.cart.length === 0) {
    if (empty) empty.style.display = 'block';
    if (footer) footer.style.display = 'none';
    const items = container.querySelectorAll('.cart-item');
    items.forEach(el => el.remove());
    return;
  }
  if (empty) empty.style.display = 'none';
  if (footer) footer.style.display = 'block';

  const existing = container.querySelectorAll('.cart-item');
  existing.forEach(el => el.remove());

  state.cart.forEach(item => {
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.dataset.id = item.id;
    div.innerHTML = `
      <img class="cart-item-img" src="${item.image}" alt="${item.name}" onerror="this.src='images/handheld.png'">
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-cat">${item.categoryLabel}</div>
        <div class="cart-item-controls">
          <button class="qty-btn" onclick="updateCartQty(${item.id}, -1)"><i class="fas fa-minus"></i></button>
          <span class="qty-val">${item.qty}</span>
          <button class="qty-btn" onclick="updateCartQty(${item.id}, 1)"><i class="fas fa-plus"></i></button>
          <button class="cart-item-remove" onclick="removeFromCart(${item.id})"><i class="fas fa-trash-alt"></i></button>
        </div>
      </div>`;
    container.appendChild(div);
  });

  const total = document.getElementById('cart-total-price');
  if (total) total.textContent = `${state.cart.reduce((s, i) => s + i.qty, 0)} item(s) – Price on Request`;
}

function openCart() {
  document.getElementById('cart-drawer')?.classList.add('open');
  document.getElementById('cart-overlay')?.classList.add('show');
  document.body.style.overflow = 'hidden';
}
function closeCart() {
  document.getElementById('cart-drawer')?.classList.remove('open');
  document.getElementById('cart-overlay')?.classList.remove('show');
  document.body.style.overflow = '';
}

// ── Wishlist Logic ──
function toggleWishlist(productId) {
  const idx = state.wishlist.indexOf(productId);
  if (idx === -1) {
    state.wishlist.push(productId);
    showToast('Added to wishlist ❤️');
  } else {
    state.wishlist.splice(idx, 1);
    showToast('Removed from wishlist');
  }
  saveWishlist();
  updateWishlistUI();
  updateProductWishlistButtons();
}

function updateWishlistUI() {
  const countEl = document.getElementById('wishlist-count');
  if (countEl) countEl.textContent = state.wishlist.length;
}

function updateProductWishlistButtons() {
  document.querySelectorAll('.p-action-btn[data-type="wishlist"]').forEach(btn => {
    const id = parseInt(btn.dataset.id);
    if (state.wishlist.includes(id)) {
      btn.classList.add('wishlisted');
      btn.title = 'Remove from wishlist';
    } else {
      btn.classList.remove('wishlisted');
      btn.title = 'Add to wishlist';
    }
  });
}

// ── Product Card Rendering ──
function createProductCard(product) {
  const wishlisted = state.wishlist.includes(product.id);
  const badgeHTML = product.badge
    ? `<span class="p-badge p-badge-${product.badge}">${product.badge.toUpperCase()}</span>`
    : '';
  return `
    <div class="product-card animate-on-scroll" data-category="${product.category}" data-id="${product.id}" id="product-${product.id}">
      <div class="product-img-wrap">
        <img src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.src='images/handheld.png'">
        <div class="product-badges">${badgeHTML}</div>
        <div class="product-actions">
          <button class="p-action-btn ${wishlisted ? 'wishlisted' : ''}" data-type="wishlist" data-id="${product.id}" 
            onclick="toggleWishlist(${product.id})" title="Add to wishlist" aria-label="Wishlist">
            <i class="fas fa-heart"></i>
          </button>
          <button class="p-action-btn" onclick="openQuickView(${product.id})" title="Quick view" aria-label="Quick View">
            <i class="fas fa-eye"></i>
          </button>
          <button class="p-action-btn" onclick="shareProduct(${product.id})" title="Share" aria-label="Share">
            <i class="fas fa-share-alt"></i>
          </button>
        </div>
      </div>
      <div class="product-info">
        <div class="product-category">${product.categoryLabel}</div>
        <h3 class="product-name">${product.name}</h3>
        <div class="product-rating">
          <span class="stars">${starHTML(product.rating)}</span>
          <span class="rating-count">${product.rating} (${product.reviews})</span>
        </div>
        <p class="product-desc">${product.shortDesc}</p>
        <div class="product-footer">
          <div class="product-price">
            <span class="price-label">Price</span>
            ${product.priceOnRequest
              ? '<span class="price-on-request">On Request</span>'
              : `<span class="price-val">${formatPrice(product.price)}</span>`}
          </div>
          <button class="add-to-cart-btn" onclick="addToCart(${product.id})" id="atc-${product.id}">
            <i class="fas fa-plus"></i> Inquire
          </button>
        </div>
      </div>
    </div>`;
}

// ── Featured Products Rendering ──
function renderFeaturedProducts(filter = 'all') {
  const grid = document.getElementById('products-grid');
  if (!grid) return;
  const filtered = filter === 'all'
    ? window.GOSAFE_PRODUCTS.slice(0, 8)
    : window.GOSAFE_PRODUCTS.filter(p => p.category === filter);
  grid.innerHTML = filtered.map(createProductCard).join('');
  initScrollAnimations();
}

// ── Filter Tabs ──
function initFilterTabs() {
  const tabs = document.querySelectorAll('.filter-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const filter = tab.dataset.filter;
      state.currentFilter = filter;
      renderFeaturedProducts(filter);
    });
  });
}

// ── Quick View Modal ──
function openQuickView(productId) {
  const product = window.GOSAFE_PRODUCTS.find(p => p.id === productId);
  if (!product) return;
  const modal = document.getElementById('product-modal');
  const content = document.getElementById('modal-content');
  const wishlisted = state.wishlist.includes(product.id);

  content.innerHTML = `
    <div class="modal-img">
      <img src="${product.image}" alt="${product.name}" onerror="this.src='images/handheld.png'">
    </div>
    <div class="modal-details">
      <div class="modal-cat">${product.categoryLabel}</div>
      <h2 class="modal-name">${product.name}</h2>
      <div class="modal-rating">
        <span class="stars">${starHTML(product.rating)}</span>
        <span style="font-size:.82rem;color:var(--text-light)">${product.rating} (${product.reviews} reviews)</span>
      </div>
      <p class="modal-desc">${product.shortDesc}</p>
      <div class="modal-features">
        <h4>Key Features</h4>
        <ul>${product.features.map(f => `<li>${f}</li>`).join('')}</ul>
      </div>
      <div class="modal-actions">
        <button class="btn btn-primary" onclick="addToCart(${product.id}); closeModal();" id="modal-atc-${product.id}">
          <i class="fas fa-paper-plane"></i> Send Inquiry
        </button>
        <button class="btn btn-outline-light" style="color:var(--primary);border-color:var(--mid-gray)" 
          onclick="toggleWishlist(${product.id})" id="modal-wl-${product.id}">
          <i class="fas fa-heart" style="color:${wishlisted ? '#e84040' : 'var(--text-light)'}"></i>
        </button>
      </div>
      <p style="font-size:.75rem;color:var(--text-light);margin-top:12px"><i class="fas fa-info-circle"></i> SKU: ${product.sku} | Price on inquiry</p>
    </div>`;

  modal?.classList.add('open');
  document.getElementById('modal-overlay')?.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('product-modal')?.classList.remove('open');
  document.getElementById('modal-overlay')?.classList.remove('show');
  document.body.style.overflow = '';
}

// ── Share Product ──
function shareProduct(productId) {
  const product = window.GOSAFE_PRODUCTS.find(p => p.id === productId);
  if (!product) return;
  if (navigator.share) {
    navigator.share({ title: product.name, text: product.shortDesc, url: window.location.href });
  } else {
    navigator.clipboard.writeText(window.location.href);
    showToast('Link copied to clipboard!');
  }
}

// ── Header Scroll ──
function initHeaderScroll() {
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
    // Back to Top
    const btn = document.getElementById('back-to-top');
    if (btn) {
      if (window.scrollY > 400) btn.classList.add('show');
      else btn.classList.remove('show');
    }
  }, { passive: true });
}

// ── Mobile Menu ──
function initMobileMenu() {
  const btn = document.getElementById('mobile-menu-btn');
  const nav = document.getElementById('main-nav');
  btn?.addEventListener('click', () => {
    nav?.classList.toggle('open');
    const spans = btn.querySelectorAll('span');
    if (nav?.classList.contains('open')) {
      spans[0].style.transform = 'rotate(45deg) translateY(7px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translateY(-7px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });
}

// ── Search ──
function initSearch() {
  const input = document.getElementById('search-input');
  const dropdown = document.getElementById('search-dropdown');
  if (!input || !dropdown) return;

  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    if (q.length < 2) { dropdown.classList.remove('show'); return; }
    const results = window.GOSAFE_PRODUCTS.filter(p =>
      p.name.toLowerCase().includes(q) || p.categoryLabel.toLowerCase().includes(q)
    ).slice(0, 5);
    if (results.length === 0) { dropdown.classList.remove('show'); return; }
    dropdown.innerHTML = results.map(p => `
      <div class="search-result-item" onclick="openQuickView(${p.id}); this.closest('.search-dropdown').classList.remove('show');">
        <img src="${p.image}" alt="${p.name}" onerror="this.src='images/handheld.png'">
        <div class="search-result-info">
          <strong>${p.name}</strong>
          <span>${p.categoryLabel}</span>
        </div>
      </div>`).join('');
    dropdown.classList.add('show');
  });

  document.addEventListener('click', e => {
    if (!e.target.closest('.header-search')) dropdown.classList.remove('show');
  });

  document.getElementById('search-btn')?.addEventListener('click', () => {
    if (input.value.trim()) {
      window.location.href = `products.html?q=${encodeURIComponent(input.value.trim())}`;
    }
  });
}

// ── Testimonials Slider ──
function initTestimonialsSlider() {
  const track = document.getElementById('testimonials-track');
  const dots = document.querySelectorAll('.slider-dots .dot');
  if (!track) return;

  const cards = track.querySelectorAll('.testimonial-card');
  const total = cards.length;
  let perView = window.innerWidth > 992 ? 3 : window.innerWidth > 768 ? 2 : 1;

  function goTo(idx) {
    state.testimonialIndex = Math.max(0, Math.min(idx, total - perView));
    const offset = -(state.testimonialIndex * (100 / perView));
    track.style.transform = `translateX(${offset}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === state.testimonialIndex));
  }

  document.getElementById('prev-testimonial')?.addEventListener('click', () => goTo(state.testimonialIndex - 1));
  document.getElementById('next-testimonial')?.addEventListener('click', () => goTo(state.testimonialIndex + 1));
  dots.forEach(dot => dot.addEventListener('click', () => goTo(parseInt(dot.dataset.index))));

  // Auto-slide
  let autoSlide = setInterval(() => goTo((state.testimonialIndex + 1) % (total - perView + 1)), 4000);
  track.parentElement.addEventListener('mouseenter', () => clearInterval(autoSlide));
  track.parentElement.addEventListener('mouseleave', () => {
    autoSlide = setInterval(() => goTo((state.testimonialIndex + 1) % (total - perView + 1)), 4000);
  });
}

// ── Hero Particles ──
function initParticles() {
  const container = document.getElementById('hero-particles');
  if (!container) return;
  for (let i = 0; i < 25; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      width: ${Math.random() * 4 + 2}px;
      height: ${Math.random() * 4 + 2}px;
      animation-duration: ${Math.random() * 12 + 8}s;
      animation-delay: ${Math.random() * 8}s;
      opacity: ${Math.random() * 0.5 + 0.2};
    `;
    container.appendChild(p);
  }
}

// ── Counter Animation ──
function animateCounters() {
  const counters = document.querySelectorAll('.stat-num[data-target]');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target);
        const duration = 1800;
        const step = target / (duration / 16);
        let current = 0;
        const timer = setInterval(() => {
          current = Math.min(current + step, target);
          el.textContent = Math.floor(current);
          if (current >= target) clearInterval(timer);
        }, 16);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => observer.observe(c));
}

// ── Scroll Animations ──
function initScrollAnimations() {
  const elements = document.querySelectorAll('.animate-on-scroll');
  const observer = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('animated'), i * 60);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  elements.forEach(el => observer.observe(el));
}

// ── Add animate-on-scroll to category/section cards ──
function addScrollClasses() {
  document.querySelectorAll('.category-card, .achievement-card, .testimonial-card, .contact-detail-item').forEach(el => {
    el.classList.add('animate-on-scroll');
  });
}

// ── Newsletter ──
function initNewsletter() {
  document.getElementById('newsletter-btn')?.addEventListener('click', () => {
    const email = document.getElementById('newsletter-email')?.value;
    if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast('Thank you for subscribing! 🎉');
      document.getElementById('newsletter-email').value = '';
    } else {
      showToast('Please enter a valid email address.', 'error');
    }
  });
}

// ── Checkout ──
function initCheckout() {
  document.getElementById('checkout-btn')?.addEventListener('click', () => {
    if (state.cart.length === 0) {
      showToast('Your cart is empty.', 'error');
      return;
    }
    const items = state.cart.map(i => `• ${i.name} (x${i.qty})`).join('\n');
    const msg = encodeURIComponent(`Hello GoSafe Global! I'd like to inquire about the following products:\n\n${items}\n\nPlease send me pricing and availability.`);
    window.open(`https://wa.me/919876543210?text=${msg}`, '_blank');
  });
}

// ── Event Listeners Init ──
function initEventListeners() {
  // Cart
  document.getElementById('cart-btn')?.addEventListener('click', openCart);
  document.getElementById('cart-close')?.addEventListener('click', closeCart);
  document.getElementById('cart-overlay')?.addEventListener('click', closeCart);

  // Modal
  document.getElementById('modal-close')?.addEventListener('click', closeModal);
  document.getElementById('modal-overlay')?.addEventListener('click', closeModal);

  // Back to top
  document.getElementById('back-to-top')?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Keyboard close
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeModal(); closeCart(); }
  });
}

// ── Products Page Logic ──
function initProductsPage() {
  const grid = document.getElementById('products-page-grid');
  if (!grid) return;

  const params = new URLSearchParams(window.location.search);
  const catFilter = params.get('cat');
  const searchQ = params.get('q')?.toLowerCase();

  let products = window.GOSAFE_PRODUCTS;
  if (catFilter) {
    products = products.filter(p => p.category === catFilter || p.sku.toLowerCase().includes(catFilter));
  }
  if (searchQ) {
    products = products.filter(p =>
      p.name.toLowerCase().includes(searchQ) ||
      p.categoryLabel.toLowerCase().includes(searchQ) ||
      p.shortDesc.toLowerCase().includes(searchQ)
    );
  }

  const count = document.getElementById('products-page-count');
  if (count) count.innerHTML = `Showing <strong>${products.length}</strong> product(s)`;

  grid.innerHTML = products.map(createProductCard).join('');
  initScrollAnimations();

  // Sidebar filter checkboxes
  document.querySelectorAll('.filter-option input[type="checkbox"]').forEach(cb => {
    cb.addEventListener('change', () => {
      const checked = [...document.querySelectorAll('.filter-option input:checked')].map(c => c.value);
      const filtered = checked.length === 0
        ? window.GOSAFE_PRODUCTS
        : window.GOSAFE_PRODUCTS.filter(p => checked.includes(p.category));
      grid.innerHTML = filtered.map(createProductCard).join('');
      if (count) count.innerHTML = `Showing <strong>${filtered.length}</strong> product(s)`;
      initScrollAnimations();
      updateProductWishlistButtons();
    });
  });

  // Sort
  document.getElementById('sort-select')?.addEventListener('change', function() {
    let sorted = [...window.GOSAFE_PRODUCTS];
    if (this.value === 'rating') sorted.sort((a, b) => b.rating - a.rating);
    else if (this.value === 'reviews') sorted.sort((a, b) => b.reviews - a.reviews);
    else if (this.value === 'az') sorted.sort((a, b) => a.name.localeCompare(b.name));
    grid.innerHTML = sorted.map(createProductCard).join('');
    initScrollAnimations();
    updateProductWishlistButtons();
  });
}

// ── Contact Form ──
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('cf-name')?.value;
    const email = document.getElementById('cf-email')?.value;
    const phone = document.getElementById('cf-phone')?.value;
    const product = document.getElementById('cf-product')?.value;
    const message = document.getElementById('cf-message')?.value;

    const wa = `Hello GoSafe Global! My name is ${name}.\n\nEmail: ${email}\nPhone: ${phone}\nProduct Interest: ${product}\n\nMessage: ${message}`;
    window.open(`https://wa.me/919876543210?text=${encodeURIComponent(wa)}`, '_blank');
    showToast('Message sent! Our team will respond shortly 🎉');
    form.reset();
  });
}

// ── INIT ──
document.addEventListener('DOMContentLoaded', () => {
  initEventListeners();
  initHeaderScroll();
  initMobileMenu();
  initSearch();
  initParticles();
  animateCounters();
  addScrollClasses();
  initScrollAnimations();
  initNewsletter();
  initCheckout();
  updateCartUI();
  updateWishlistUI();
  updateProductWishlistButtons();

  // Home page specific
  if (document.getElementById('products-grid')) {
    renderFeaturedProducts();
    initFilterTabs();
    initTestimonialsSlider();
  }

  // Products page specific
  if (document.getElementById('products-page-grid')) {
    initProductsPage();
  }

  // Contact page specific
  if (document.getElementById('contact-form')) {
    initContactForm();
  }
});
