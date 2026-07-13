// ================================================================
//  GoSafe Global � Main JavaScript
// ================================================================

// -- State --
const state = {
  cart: JSON.parse(localStorage.getItem('gsg_cart') || '[]'),
  wishlist: JSON.parse(localStorage.getItem('gsg_wishlist') || '[]'),
  currentFilter: 'all',
  testimonialIndex: 0,
};

// -- Utils --
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

// -- Cart Logic --
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
  if (total) total.textContent = `${state.cart.reduce((s, i) => s + i.qty, 0)} item(s) � Price on Request`;
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

// -- Wishlist Logic --
function toggleWishlist(productId) {
  const idx = state.wishlist.indexOf(productId);
  if (idx === -1) {
    state.wishlist.push(productId);
    showToast('Added to wishlist ??');
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

// -- Product Card Rendering --
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

// -- Featured Products Rendering --
function renderFeaturedProducts(filter = 'all') {
  const grid = document.getElementById('products-grid');
  if (!grid) return;
  const filtered = filter === 'all'
    ? window.GOSAFE_PRODUCTS.slice(0, 8)
    : window.GOSAFE_PRODUCTS.filter(p => p.category === filter);
  
  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
        <i class="fas fa-box-open" style="font-size: 3rem; color: var(--accent); margin-bottom: 16px;"></i>
        <h3 style="color: var(--white); margin-bottom: 8px;">No featured products</h3>
        <p style="color: rgba(255,255,255,0.7);">New products are coming soon to this section.</p>
      </div>
    `;
  } else {
    grid.innerHTML = filtered.map(createProductCard).join('');
  }
  
  initScrollAnimations();
}

// -- Filter Tabs --
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

// -- Quick View Modal --
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

// -- Share Product --
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

// -- Header Scroll --
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

// -- Mobile Menu --
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

// -- Search --
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

// -- Testimonials Slider --
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

// -- Hero Particles --
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

// -- Counter Animation --
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

// -- Scroll Animations --
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

// -- Add animate-on-scroll to category/section cards --
function addScrollClasses() {
  document.querySelectorAll('.category-card, .achievement-card, .testimonial-card, .contact-detail-item').forEach(el => {
    el.classList.add('animate-on-scroll');
  });
}

// -- Newsletter --
function initNewsletter() {
  document.getElementById('newsletter-btn')?.addEventListener('click', () => {
    const email = document.getElementById('newsletter-email')?.value;
    if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast('Thank you for subscribing! ??');
      document.getElementById('newsletter-email').value = '';
    } else {
      showToast('Please enter a valid email address.', 'error');
    }
  });
}

// -- Checkout --
function initCheckout() {
  document.getElementById('checkout-btn')?.addEventListener('click', () => {
    if (state.cart.length === 0) {
      showToast('Your cart is empty.', 'error');
      return;
    }
    const items = state.cart.map(i => `� ${i.name} (x${i.qty})`).join('\n');
    const msg = encodeURIComponent(`Hello GoSafe Global! I'd like to inquire about the following products:\n\n${items}\n\nPlease send me pricing and availability.`);
    window.open(`https://wa.me/919876543210?text=${msg}`, '_blank');
  });
}

// -- Event Listeners Init --
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

// -- Products Page Logic --
function initProductsPage() {
  const grid = document.getElementById('products-page-grid');
  if (!grid) return;

  const params = new URLSearchParams(window.location.search);
  const catFilter = params.get('cat');
  const searchQ = params.get('q')?.toLowerCase();

  let products = window.GOSAFE_PRODUCTS;
  if (catFilter) {
    products = products.filter(p => p.category === catFilter || (p.sku && p.sku.toLowerCase().includes(catFilter)));
  }
  if (searchQ) {
    products = products.filter(p =>
      p.name.toLowerCase().includes(searchQ) ||
      (p.categoryLabel && p.categoryLabel.toLowerCase().includes(searchQ)) ||
      (p.shortDesc && p.shortDesc.toLowerCase().includes(searchQ))
    );
  }

  const count = document.getElementById('products-page-count');
  if (count) count.innerHTML = `Showing <strong>${products.length}</strong> product(s)`;

  if (products.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
        <i class="fas fa-box-open" style="font-size: 3rem; color: var(--accent); margin-bottom: 16px;"></i>
        <h3 style="color: var(--white); margin-bottom: 8px;">No products found</h3>
        <p style="color: rgba(255,255,255,0.7);">New products are coming soon to this section. Check back later!</p>
      </div>
    `;
  } else {
    grid.innerHTML = products.map(createProductCard).join('');
  }
  
  initScrollAnimations();

  // Sidebar filter checkboxes
  document.querySelectorAll('.filter-option input[type="checkbox"]').forEach(cb => {
    cb.addEventListener('change', () => {
      const checked = [...document.querySelectorAll('.filter-option input:checked')].map(c => c.value);
      const filtered = checked.length === 0
        ? window.GOSAFE_PRODUCTS
        : window.GOSAFE_PRODUCTS.filter(p => checked.includes(p.category));
      
      if (filtered.length === 0) {
        grid.innerHTML = `
          <div class="empty-state" style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
            <i class="fas fa-box-open" style="font-size: 3rem; color: var(--accent); margin-bottom: 16px;"></i>
            <h3 style="color: var(--white); margin-bottom: 8px;">No products found</h3>
            <p style="color: rgba(255,255,255,0.7);">New products are coming soon to this section.</p>
          </div>
        `;
      } else {
        grid.innerHTML = filtered.map(createProductCard).join('');
      }
      
      if (count) count.innerHTML = `Showing <strong>${filtered.length}</strong> product(s)`;
      initScrollAnimations();
      updateProductWishlistButtons();
    });
  });

  // Sort
  document.getElementById('sort-select')?.addEventListener('change', function() {
    let sorted = [...window.GOSAFE_PRODUCTS];
    if (this.value === 'rating') sorted.sort((a, b) => (b.rating||5) - (a.rating||5));
    else if (this.value === 'reviews') sorted.sort((a, b) => (b.reviews||15) - (a.reviews||15));
    else if (this.value === 'az') sorted.sort((a, b) => a.name.localeCompare(b.name));
    
    // respect active filters
    const checked = [...document.querySelectorAll('.filter-option input:checked')].map(c => c.value);
    if (checked.length > 0) {
        sorted = sorted.filter(p => checked.includes(p.category));
    }
    
    if (sorted.length > 0) {
      grid.innerHTML = sorted.map(createProductCard).join('');
    }
    initScrollAnimations();
    updateProductWishlistButtons();
  });
}

// -- Contact Form --
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
    showToast('Message sent! Our team will respond shortly ??');
    form.reset();
  });
}

// -- INIT --
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
  initHeroSlider();

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

// -- HERO SLIDER --
function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');
  const prevBtn = document.getElementById('hero-prev');
  const nextBtn = document.getElementById('hero-next');
  if (!slides.length) return;

  let current = 0;
  let autoPlayTimer = null;

  function goTo(index) {
    slides[current].classList.remove('active');
    dots[current]?.classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current]?.classList.add('active');
  }

  function startAutoPlay() {
    stopAutoPlay();
    autoPlayTimer = setInterval(() => goTo(current + 1), 5000);
  }

  function stopAutoPlay() {
    if (autoPlayTimer) clearInterval(autoPlayTimer);
  }

  if (prevBtn) prevBtn.addEventListener('click', () => { goTo(current - 1); startAutoPlay(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { goTo(current + 1); startAutoPlay(); });

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      goTo(parseInt(dot.dataset.slide));
      startAutoPlay();
    });
  });

  startAutoPlay();
}





// -- BotFlow Integration --
function initBotFlow() {
  const botHtml = "<!-- ── FLOATING BUTTON ── -->\n<div id=\"chat-launcher-wrap\"><button id=\"chat-launcher\" onclick=\"toggleChat()\" title=\"Chat with GoSafe\">\n  <div class=\"notif-dot\"></div>\n  <svg class=\"chat-icon\" width=\"28\" height=\"28\" viewBox=\"0 0 24 24\" fill=\"none\"\n       stroke=\"white\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\">\n    <path d=\"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z\"/>\n  </svg>\n  <svg class=\"close-icon\" style=\"display:none\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\"\n       fill=\"none\" stroke=\"white\" stroke-width=\"2.5\" stroke-linecap=\"round\">\n    <line x1=\"18\" y1=\"6\" x2=\"6\" y2=\"18\"/><line x1=\"6\" y1=\"6\" x2=\"18\" y2=\"18\"/>\n  </svg>\n</button></div>\n\n<!-- ── CHAT POPUP ── -->\n<div id=\"chat-popup\">\n  <div class=\"chat-header\">\n    <div class=\"agent-avatar\">🛡️</div>\n    <div class=\"agent-info\">\n      <div class=\"agent-name\">GoSafe Assistant</div>\n      <div class=\"agent-status\"><span class=\"status-dot\"></span>Online now</div>\n    </div>\n    <button class=\"header-restart\" onclick=\"resetChat()\" title=\"Restart\">↺</button>\n  </div>\n\n  <div id=\"chat-messages\">\n    <div class=\"day-label\">Today</div>\n  </div>\n\n  <div class=\"chat-input-area\">\n    <input type=\"text\" id=\"user-text-input\" placeholder=\"Type your message…\" disabled />\n    <button id=\"send-btn\" disabled onclick=\"sendTyped()\">\n      <svg width=\"18\" height=\"18\" fill=\"none\" viewBox=\"0 0 24 24\"\n           stroke=\"white\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\">\n        <line x1=\"22\" y1=\"2\" x2=\"11\" y2=\"13\"/>\n        <polygon points=\"22 2 15 22 11 13 2 9 22 2\"/>\n      </svg>\n    </button>\n  </div>\n</div>";
  document.body.insertAdjacentHTML('beforeend', botHtml);
}
initBotFlow();

const API = "/api/chat";
let sessionId  = null;
let isOpen     = false;
let started    = false;

const popup    = document.getElementById("chat-popup");
const launcher = document.getElementById("chat-launcher");
const messages = document.getElementById("chat-messages");
const txtInput = document.getElementById("user-text-input");
const sendBtn  = document.getElementById("send-btn");

/* ── Toggle ── */
function toggleChat() {
  isOpen = !isOpen;
  popup.classList.toggle("active", isOpen);
  launcher.classList.toggle("open", isOpen);
  const dot = launcher.querySelector(".notif-dot");
  if (dot) dot.remove();
  if (isOpen && !started) { started = true; callAPI(null); }
  if (isOpen) setTimeout(() => messages.scrollTop = messages.scrollHeight, 100);
}

/* ── Reset ── */
function resetChat() {
  sessionId = null; started = false;
  messages.innerHTML = '<div class="day-label">Today</div>';
  disableInput();
  callAPI(null);
}

/* ── Typing indicator ── */
function showTyping(cb, delay = 850) {
  const row = document.createElement("div");
  row.className = "typing-row"; row.id = "typing";
  row.innerHTML = `<div class="bot-avatar-sm">🛡️</div>
    <div class="typing-dots"><span></span><span></span><span></span></div>`;
  messages.appendChild(row);
  messages.scrollTop = messages.scrollHeight;
  setTimeout(() => { row.remove(); cb(); }, delay);
}

/* ── Bubbles ── */
function addBot(html) {
  const row = document.createElement("div");
  row.className = "msg-row bot";
  row.innerHTML = `<div class="bot-avatar-sm">🛡️</div><div class="bubble bot">${html}</div>`;
  messages.appendChild(row);
  messages.scrollTop = messages.scrollHeight;
}
function addUser(text) {
  const row = document.createElement("div");
  row.className = "msg-row user";
  row.innerHTML = `<div class="bubble user">${esc(text)}</div>`;
  messages.appendChild(row);
  messages.scrollTop = messages.scrollHeight;
}
function esc(s) {
  const d = document.createElement("div"); d.textContent = s; return d.innerHTML;
}

/* ── Option buttons ── */
function renderOptions(options) {
  const wrap = document.createElement("div");
  wrap.className = "options-wrap";
  options.forEach((opt, idx) => {
    const btn = document.createElement("button");
    btn.className = "opt-btn";
    btn.textContent = opt.label;
    btn.onclick = () => {
      wrap.querySelectorAll(".opt-btn").forEach(b => { b.disabled = true; });
      btn.classList.add("selected");
      addUser(opt.label);
      callAPI(idx);
    };
    wrap.appendChild(btn);
  });
  messages.appendChild(wrap);
  messages.scrollTop = messages.scrollHeight;
}

/* ── Continue button ── */
function renderContinue() {
  const btn = document.createElement("button");
  btn.className = "continue-btn"; btn.textContent = "Continue →";
  btn.onclick = () => { btn.disabled = true; callAPI(null); };
  messages.appendChild(btn);
  messages.scrollTop = messages.scrollHeight;
}

/* ── WhatsApp bubble ── */
function renderWhatsApp(url) {
  addBot(`Our team is ready to help you on WhatsApp!<br/><br/>
    <a class="whatsapp-btn" href="${url}" target="_blank">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>Chat on WhatsApp
    </a>`);
}

/* ── Input helpers ── */
function enableInput(ph) {
  txtInput.disabled = false; sendBtn.disabled = false;
  txtInput.placeholder = ph || "Type here…"; txtInput.focus();
}
function disableInput() {
  txtInput.disabled = true; sendBtn.disabled = true;
  txtInput.value = ""; txtInput.placeholder = "Type your message…";
}
function sendTyped() {
  const val = txtInput.value.trim(); if (!val) return;
  addUser(val); disableInput(); callAPI(val);
}
txtInput.addEventListener("keydown", e => { if (e.key === "Enter") sendTyped(); });

/* ── API call ── */
async function callAPI(userInput) {
  disableInput();
  try {
    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_input: userInput, session_id: sessionId })
    });
    const data = await res.json();
    sessionId = data.session_id;
    showTyping(() => renderStep(data.step), 700 + Math.random() * 400);
  } catch {
    showTyping(() => addBot(
      "⚠️ Can't connect to server. Make sure <code>python app.py</code> is running!"
    ), 600);
  }
}

/* ── Render a step ── */
const END_IDS = ["p2_step_9_close","p3_step_5_close","p4_step_5_close","p5_close"];

function renderStep(step) {
  // WhatsApp special
  if (step.id === "p5_step_2c_whatsapp") {
    addBot(esc(step.bot_message));
    renderWhatsApp(step.whatsapp_url || "https://wa.me/918512020020");
    return;
  }

  // Contact info (path 6)
  if (step.contact_info) {
    const ci = step.contact_info;
    addBot(`${esc(step.bot_message)}<br/><br/>
      📞 ${ci.phone}<br/>✉️ ${ci.email}<br/>
      📍 ${ci.address}<br/>
      🌐 <a href="${ci.website}" target="_blank" style="color:var(--teal)">${ci.website}</a>`);
    if (step.follow_up) setTimeout(() =>
      showTyping(() => addBot(esc(step.follow_up)), 700), 400);
    setTimeout(() => callAPI(null), 1500);
    return;
  }

  addBot(esc(step.bot_message));

  if (step.options && step.options.length > 0) {
    setTimeout(() => renderOptions(step.options), 200);
    return;
  }

  const itype = step.input_type || "none";
  if (itype === "text" || itype === "email" || itype === "phone") {
    const ph = { text:"Type your response…", email:"your@email.com", phone:"+91 XXXXX XXXXX" };
    setTimeout(() => enableInput(ph[itype]), 150);
    return;
  }

  if (END_IDS.includes(step.id)) {
    const notice = document.createElement("div");
    notice.className = "chat-end-notice";
    notice.textContent = "✓ Done! Our team will be in touch with you soon.";
    messages.appendChild(notice);
    messages.scrollTop = messages.scrollHeight;
    return;
  }

  setTimeout(() => renderContinue(), 200);
}



