/**
 * ═══════════════════════════════════════════════════════════════
 *  SECUREWEALTH TWIN — Premium UI Enhancement Layer
 * ═══════════════════════════════════════════════════════════════
 *
 *  Provides: animated counters, toast system, skeleton loaders,
 *  scroll reveal, ripple effects, smooth page transitions,
 *  and premium micro-interactions.
 */

(function() {
  'use strict';

  // ═══════════════════════════════════════════════════════
  //  Animated Number Counter
  // ═══════════════════════════════════════════════════════

  window.animateCounter = function(el, target, options) {
    options = options || {};
    var duration = options.duration || 1200;
    var prefix = options.prefix || '';
    var suffix = options.suffix || '';
    var decimals = options.decimals || 0;
    var easing = options.easing || 'easeOutExpo';

    var start = 0;
    var startTime = null;

    function easeOutExpo(t) { return t === 1 ? 1 : 1 - Math.pow(2, -10 * t); }
    function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

    var easeFn = easing === 'easeOutCubic' ? easeOutCubic : easeOutExpo;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var elapsed = timestamp - startTime;
      var progress = Math.min(elapsed / duration, 1);
      var easedProgress = easeFn(progress);
      var current = start + (target - start) * easedProgress;

      el.textContent = prefix + current.toFixed(decimals) + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  };

  // Auto-animate all elements with data-counter attribute
  window.initAnimatedCounters = function() {
    var counters = document.querySelectorAll('[data-counter]');
    counters.forEach(function(el) {
      var target = parseFloat(el.getAttribute('data-counter'));
      var prefix = el.getAttribute('data-prefix') || '';
      var suffix = el.getAttribute('data-suffix') || '';
      var duration = parseInt(el.getAttribute('data-duration') || '1200');

      if (!isNaN(target)) {
        window.animateCounter(el, target, {
          prefix: prefix,
          suffix: suffix,
          duration: duration
        });
      }
    });
  };

  // ═══════════════════════════════════════════════════════
  //  Toast Notification System
  // ═══════════════════════════════════════════════════════

  var toastContainer = null;

  function getToastContainer() {
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.className = 'sw-toast-container';
      document.body.appendChild(toastContainer);
    }
    return toastContainer;
  }

  window.showToast = function(message, type, duration) {
    type = type || 'info';
    duration = duration || 4000;

    var icons = {
      success: 'fa-check-circle',
      error: 'fa-circle-exclamation',
      warning: 'fa-triangle-exclamation',
      info: 'fa-circle-info'
    };

    var colors = {
      success: '#059669',
      error: '#dc2626',
      warning: '#d97706',
      info: '#2563eb'
    };

    var toast = document.createElement('div');
    toast.className = 'sw-toast ' + type;
    toast.innerHTML =
      '<i class="fas ' + (icons[type] || icons.info) + '" style="color:' + (colors[type] || colors.info) + ';font-size:1.1rem"></i>' +
      '<span style="flex:1">' + message + '</span>' +
      '<button onclick="this.parentElement.remove()" style="background:none;border:none;cursor:pointer;color:var(--sw-text-muted);font-size:0.8rem;padding:2px">&times;</button>';

    getToastContainer().appendChild(toast);

    setTimeout(function() {
      toast.classList.add('removing');
      setTimeout(function() {
        if (toast.parentElement) toast.remove();
      }, 300);
    }, duration);
  };

  // ═══════════════════════════════════════════════════════
  //  Skeleton Loader
  // ═══════════════════════════════════════════════════════

  window.showSkeleton = function(container, type) {
    type = type || 'card';
    var html = '';
    if (type === 'card') {
      html = '<div class="sw-skeleton sw-skeleton-card"></div>';
    } else if (type === 'dashboard') {
      html =
        '<div class="sw-grid-4">' +
        Array(4).fill('<div class="sw-skeleton" style="height:100px;border-radius:16px"></div>').join('') +
        '</div>' +
        '<div class="sw-skeleton" style="height:300px;border-radius:16px;margin-top:1rem"></div>';
    } else if (type === 'list') {
      html = Array(5).fill(
        '<div class="sw-skeleton sw-skeleton-text"></div>'
      ).join('');
    }
    container.innerHTML = html;
  };

  window.hideSkeleton = function(container, content) {
    container.innerHTML = content;
    // Trigger stagger animation
    var items = container.querySelectorAll('.animate-stagger > *');
    items.forEach(function(item, i) {
      item.style.animationDelay = (i * 60) + 'ms';
    });
  };

  // ═══════════════════════════════════════════════════════
  //  Scroll Reveal (Intersection Observer)
  // ═══════════════════════════════════════════════════════

  function initScrollReveal() {
    if (!('IntersectionObserver' in window)) return;

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in-up');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal-on-scroll').forEach(function(el) {
      observer.observe(el);
    });
  }

  // ═══════════════════════════════════════════════════════
  //  Ripple Effect on Buttons
  // ═══════════════════════════════════════════════════════

  function initRippleEffects() {
    document.addEventListener('click', function(e) {
      var btn = e.target.closest('.sw-ripple, .sw-btn');
      if (!btn) return;

      var ripple = document.createElement('span');
      var rect = btn.getBoundingClientRect();
      var size = Math.max(rect.width, rect.height);

      ripple.style.cssText =
        'position:absolute;border-radius:50%;' +
        'background:rgba(255,255,255,0.3);' +
        'width:' + size + 'px;height:' + size + 'px;' +
        'left:' + (e.clientX - rect.left - size / 2) + 'px;' +
        'top:' + (e.clientY - rect.top - size / 2) + 'px;' +
        'transform:scale(0);animation:ripple 0.6s ease-out;' +
        'pointer-events:none;';

      btn.appendChild(ripple);
      setTimeout(function() { ripple.remove(); }, 600);
    });
  }

  // Inject ripple keyframe
  var rippleStyle = document.createElement('style');
  rippleStyle.textContent =
    '@keyframes ripple { to { transform: scale(4); opacity: 0; } }';
  document.head.appendChild(rippleStyle);

  // ═══════════════════════════════════════════════════════
  //  Page Transition (smooth view switching)
  // ═══════════════════════════════════════════════════════

  window.smoothTransition = function(callback) {
    var content = document.querySelector('.sw-content') || document.getElementById('main-content');
    if (!content) { callback(); return; }

    content.style.opacity = '0';
    content.style.transform = 'translateY(8px)';
    content.style.transition = 'opacity 150ms ease, transform 150ms ease';

    setTimeout(function() {
      callback();
      content.style.opacity = '1';
      content.style.transform = 'translateY(0)';

      // Re-trigger scroll reveal
      setTimeout(initScrollReveal, 200);
      // Animate counters
      setTimeout(window.initAnimatedCounters, 300);
    }, 150);
  };

  // ═══════════════════════════════════════════════════════
  //  Dark Mode Toggle
  // ═══════════════════════════════════════════════════════

  window.toggleDarkMode = function() {
    var html = document.documentElement;
    var isDark = html.getAttribute('data-theme') === 'dark';
    html.setAttribute('data-theme', isDark ? 'light' : 'dark');
    localStorage.setItem('sw-theme', isDark ? 'light' : 'dark');

    var icon = document.getElementById('theme-icon');
    if (icon) {
      icon.className = isDark ? 'fas fa-moon' : 'fas fa-sun';
    }
  };

  // Init dark mode on load (must be global — called by App.init)
  window.initDarkMode = function initDarkMode() {
    var saved = localStorage.getItem('sw-theme');
    if (saved === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  };
  window.initDarkMode();

  // Theme color meta tag (called by App.init)
  window.initThemeColor = function initThemeColor() {
    var meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'theme-color';
      document.head.appendChild(meta);
    }
    var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    meta.content = isDark ? '#0B1D3A' : '#0B1D3A';
  };

  // Market status badge (called by App.init)
  window.updateMarketStatus = function updateMarketStatus() {
    var badge = document.getElementById('market-status-badge');
    if (!badge) return;
    var now = new Date();
    var hour = now.getHours() + now.getMinutes() / 60;
    var isOpen = hour >= 9.25 && hour <= 15.5 && now.getDay() >= 1 && now.getDay() <= 5;
    badge.className = 'fb-header-pill ' + (isOpen ? 'market-open' : 'market-closed') + ' hidden md:inline-flex';
    badge.innerHTML = '<i class="fas fa-circle text-[6px]"></i> ' + (isOpen ? 'Market Open' : 'Market Closed');
  };

  // Onboarding wizard launcher (called by App.init)
  window.showOnboarding = function showOnboarding() {
    if (localStorage.getItem('sw_onboarded') === 'true') return;
    if (typeof initOnboarding === 'function') {
      initOnboarding();
    }
  };

  // ═══════════════════════════════════════════════════════
  //  Live Clock
  // ═══════════════════════════════════════════════════════

  window.updateLiveClock = function() {
    var el = document.getElementById('live-clock');
    if (!el) return;
    var now = new Date();
    el.textContent = now.toLocaleTimeString('en-IN', {
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      hour12: true
    });
  };

  // ═══════════════════════════════════════════════════════
  //  Mobile Sidebar Toggle
  // ═══════════════════════════════════════════════════════

  window.toggleMobileSidebar = function() {
    var sidebar = document.querySelector('.sw-sidebar');
    var overlay = document.querySelector('.sw-sidebar-overlay');
    if (!sidebar) return;

    var isOpen = sidebar.classList.contains('open');
    if (isOpen) {
      sidebar.classList.remove('open');
      if (overlay) overlay.classList.remove('show');
    } else {
      sidebar.classList.add('open');
      if (overlay) overlay.classList.add('show');
    }
  };

  // ═══════════════════════════════════════════════════════
  //  Number Formatting Helper
  // ═══════════════════════════════════════════════════════

  window.formatCurrency = function(amount, compact) {
    if (compact && amount >= 10000000) return '₹' + (amount / 10000000).toFixed(1) + ' Cr';
    if (compact && amount >= 100000) return '₹' + (amount / 100000).toFixed(1) + ' L';
    return '₹' + amount.toLocaleString('en-IN');
  };

  // ═══════════════════════════════════════════════════════
  //  Init on Load
  // ═══════════════════════════════════════════════════════

  document.addEventListener('DOMContentLoaded', function() {
    initScrollReveal();
    initRippleEffects();

    // Start clock
    window.updateLiveClock();
    setInterval(window.updateLiveClock, 1000);

    console.log('[PremiumUI] Enhanced UI layer initialized.');
  });

})();
