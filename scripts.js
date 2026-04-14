/* ============================================
   AutoLux Cars - Shared Configuration
   Products, Constants, and Global Data
   ============================================ */

const CONFIG = {
  APP_NAME: 'AutoLux Cars',
  CURRENCY_SYMBOL: '$',
  DELIVERY_FEE: 499,
  MIN_PASSWORD_LENGTH: 6,
  MIN_NAME_LENGTH: 3,
  STORAGE_KEYS: {
    USERS: 'autolux-users',
    CURRENT_USER: 'autolux-current-user',
    CART: 'autolux-cart',
    CONTACT: 'autolux-contact'
  },
  PRODUCTS: [
    {
      id: 1,
      model: 'Aurora GT',
      price: 79999,
      description: 'Luxury sport sedan with premium comfort.',
      image: 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=900',
      badge: 'Best seller'
    },
    {
      id: 2,
      model: 'Summit X',
      price: 65999,
      description: 'Advanced SUV with smart safety features.',
      image: 'https://images.pexels.com/photos/210019/pexels-photo-210019.jpeg?auto=compress&cs=tinysrgb&w=900',
      badge: 'Popular'
    },
    {
      id: 3,
      model: 'Zenith EV',
      price: 88999,
      description: 'Electric performance car built for the future.',
      image: 'https://images.pexels.com/photos/358070/pexels-photo-358070.jpeg?auto=compress&cs=tinysrgb&w=900',
      badge: 'Eco-friendly'
    }
  ],
  REGEX: {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    NAME: /^[a-zA-Z\s]{3,}$/,
    PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/
  }
};

/* ============================================
   Form Validation Utilities
   ============================================ */

const Validator = {
  /**
   * Validate email format
   */
  validateEmail: function(email) {
    return CONFIG.REGEX.EMAIL.test(email.trim());
  },

  /**
   * Validate name (letters and spaces, 3+ characters)
   */
  validateName: function(name) {
    return CONFIG.REGEX.NAME.test(name.trim());
  },

  /**
   * Validate password minimum length
   */
  validatePasswordLength: function(password) {
    return password.trim().length >= CONFIG.MIN_PASSWORD_LENGTH;
  },

  /**
   * Validate passwords match
   */
  validatePasswordsMatch: function(password1, password2) {
    return password1 === password2 && this.validatePasswordLength(password1);
  },

  /**
   * Calculate password strength (0-7 scale)
   */
  calculatePasswordStrength: function(password) {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    return strength;
  },

  /**
   * Get password strength label
   */
  getPasswordStrengthLabel: function(strength) {
    const labels = [
      { text: '🔴 Very Weak', class: 'strength-weak' },
      { text: '🔴 Very Weak', class: 'strength-weak' },
      { text: '🟠 Weak', class: 'strength-fair' },
      { text: '🟡 Fair', class: 'strength-good' },
      { text: '🟢 Good', class: 'strength-strong' },
      { text: '🟢 Strong', class: 'strength-very-strong' },
      { text: '🟢 Strong', class: 'strength-very-strong' },
      { text: '🟢 Strong', class: 'strength-very-strong' }
    ];
    return labels[Math.min(strength, 7)];
  },

  /**
   * Update form field validation state
   */
  updateFieldState: function(input, isValid, feedbackElement = null) {
    if (isValid) {
      input.classList.remove('is-invalid');
      input.classList.add('is-valid');
    } else {
      input.classList.add('is-invalid');
      input.classList.remove('is-valid');
    }
    if (feedbackElement) {
      feedbackElement.style.display = isValid ? 'none' : 'block';
    }
  }
};

/* ============================================
   Local Storage Utilities
   ============================================ */

const Storage = {
  /**
   * Get all users
   */
  getUsers: function() {
    return JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.USERS) || '[]');
  },

  /**
   * Add new user
   */
  addUser: function(userData) {
    const users = this.getUsers();
    users.push(userData);
    localStorage.setItem(CONFIG.STORAGE_KEYS.USERS, JSON.stringify(users));
    return true;
  },

  /**
   * Check if user exists
   */
  userExists: function(email) {
    const users = this.getUsers();
    return users.some(user => user.email.toLowerCase() === email.toLowerCase());
  },

  /**
   * Find user by credentials
   */
  findUser: function(email, password) {
    const users = this.getUsers();
    return users.find(user =>
      user.email.toLowerCase() === email.toLowerCase() && user.password === password
    );
  },

  /**
   * Get current logged-in user
   */
  getCurrentUser: function() {
    return JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.CURRENT_USER) || 'null');
  },

  /**
   * Set current user
   */
  setCurrentUser: function(userData) {
    localStorage.setItem(CONFIG.STORAGE_KEYS.CURRENT_USER, JSON.stringify(userData));
  },

  /**
   * Clear current user (logout)
   */
  clearCurrentUser: function() {
    localStorage.removeItem(CONFIG.STORAGE_KEYS.CURRENT_USER);
  },

  /**
   * Get cart items
   */
  getCart: function() {
    return JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.CART) || '[]');
  },

  /**
   * Save cart items
   */
  saveCart: function(cart) {
    localStorage.setItem(CONFIG.STORAGE_KEYS.CART, JSON.stringify(cart));
  },

  /**
   * Add item to cart
   */
  addToCart: function(productId) {
    const cart = this.getCart();
    const existing = cart.find(item => item.id === productId);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ id: productId, quantity: 1 });
    }
    this.saveCart(cart);
    return cart;
  },

  /**
   * Remove item from cart
   */
  removeFromCart: function(productId) {
    const cart = this.getCart().filter(item => item.id !== productId);
    this.saveCart(cart);
    return cart;
  },

  /**
   * Clear entire cart
   */
  clearCart: function() {
    localStorage.setItem(CONFIG.STORAGE_KEYS.CART, JSON.stringify([]));
  },

  /**
   * Get cart total
   */
  getCartTotal: function() {
    const cart = this.getCart();
    const total = cart.reduce((sum, item) => {
      const product = CONFIG.PRODUCTS.find(p => p.id === item.id);
      return sum + (product ? product.price * item.quantity : 0);
    }, 0);
    return total;
  },

  /**
   * Get cart item count
   */
  getCartCount: function() {
    const cart = this.getCart();
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }
};

/* ============================================
   DOM Utilities
   ============================================ */

const DOM = {
  /**
   * Update cart count badge
   */
  updateCartCount: function() {
    const cartCountEl = document.getElementById('cartCount');
    if (cartCountEl) {
      cartCountEl.textContent = Storage.getCartCount();
    }
  },

  /**
   * Format currency
   */
  formatCurrency: function(amount) {
    return CONFIG.CURRENCY_SYMBOL + amount.toLocaleString('en-US');
  },

  /**
   * Get product by ID
   */
  getProduct: function(productId) {
    return CONFIG.PRODUCTS.find(p => p.id === productId);
  },

  /**
   * Create product card HTML
   */
  createProductCard: function(product) {
    return `
      <div class="col-md-4">
        <div class="card product-card h-100 shadow-sm">
          <img src="${product.image}" class="card-img-top" alt="${product.model}">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${product.model}</h5>
            <p class="card-text text-muted">${product.description}</p>
            <div class="mt-auto">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <span class="fw-bold fs-5">${DOM.formatCurrency(product.price)}</span>
                <span class="badge bg-info text-dark">${product.badge}</span>
              </div>
              <button onclick="handleAddToCart(${product.id})" data-id="${product.id}" class="btn btn-outline-primary w-100">Add to Cart</button>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  /**
   * Show toast notification
   */
  showNotification: function(message, type = 'info', duration = 2000) {
    const toast = document.createElement('div');
    toast.className = `alert alert-${type} alert-dismissible fade show animate-fade-in`;
    toast.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 9999; max-width: 400px;';
    toast.innerHTML = `
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(toast);

    if (duration > 0) {
      setTimeout(() => {
        toast.remove();
      }, duration);
    }

    return toast;
  },

  /**
   * Scroll to element
   */
  scrollToElement: function(selector, offset = 100) {
    const element = document.querySelector(selector);
    if (element) {
      const top = element.offsetTop - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  },

  /**
   * Enable/disable button
   */
  setButtonState: function(button, disabled = false, loadingText = null) {
    if (disabled) {
      button.disabled = true;
      button.dataset.originalText = button.textContent;
      if (loadingText) button.textContent = loadingText;
    } else {
      button.disabled = false;
      if (button.dataset.originalText) button.textContent = button.dataset.originalText;
    }
  }
};

/* ============================================
   Event Delegation
   ============================================ */

const Events = {
  /**
   * Add delegated event listener
   */
  delegateEvent: function(parentSelector, eventType, childSelector, handler) {
    const parent = document.querySelector(parentSelector);
    if (!parent) return;

    parent.addEventListener(eventType, function(event) {
      const target = event.target.closest(childSelector);
      if (target) {
        handler.call(target, event);
      }
    });
  },

  /**
   * Add input event with debounce
   */
  addDebouncedListener: function(element, eventType, handler, delay = 300) {
    let timeoutId;
    element.addEventListener(eventType, function() {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handler, delay);
    });
  }
};

/* ============================================
   Page Ready Handler
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
  // Update cart count on page load
  DOM.updateCartCount();

  // Check user authentication for protected pages
  const protectedPages = ['profile.html'];
  const currentPage = window.location.pathname.split('/').pop();
  
  if (protectedPages.includes(currentPage) && !Storage.getCurrentUser()) {
    window.location.href = 'login.html';
  }
});

/* ============================================
   Global Error Handler
   ============================================ */

window.addEventListener('error', function(event) {
  console.error('Global error:', event.error);
});
