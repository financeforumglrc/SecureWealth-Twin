const PWA = {
  APP_VERSION: '3.0.0',
  SW_PATH: '/sw.js',
  deferredPrompt: null,
  isInstalled: false,
  updateAvailable: false,
  LIVE_URL_KEY: 'sw_live_url',

  async init() {
    this.checkInstalled();
    this.setupInstallPrompt();
    this.registerSW();
    this.setupNetworkMonitoring();
    this.setupAutoUpdate();
    this.setupLiveUrlRedirect();
  },

  setupLiveUrlRedirect() {
    const liveUrl = localStorage.getItem(this.LIVE_URL_KEY);
    if (liveUrl) {
      const currentOrigin = window.location.origin;
      const targetOrigin = new URL(liveUrl).origin;
      if (currentOrigin !== targetOrigin) {
        this.showToast(`Redirecting to live server: ${liveUrl}`, 'info');
        setTimeout(() => { window.location.href = liveUrl; }, 1500);
      }
    }
  },

  getLiveUrl() {
    return localStorage.getItem(this.LIVE_URL_KEY) || '';
  },

  setLiveUrl(url) {
    if (!url) {
      localStorage.removeItem(this.LIVE_URL_KEY);
      this.showToast('Live URL cleared — using bundled app', 'info');
      return;
    }
    try {
      new URL(url);
      localStorage.setItem(this.LIVE_URL_KEY, url);
      this.showToast(`Live URL set! App will reload from ${url} on next launch`, 'success');
    } catch {
      this.showToast('Invalid URL. Enter full URL like https://myapp.onrender.com', 'warning');
    }
  },

  renderLiveUrlSettings(container) {
    const currentUrl = this.getLiveUrl();
    container.innerHTML = `
      <div class="card p-6 space-y-4 animate-fade-in">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <i class="fas fa-cloud-upload-alt text-blue-600 dark:text-blue-400"></i>
          </div>
          <div>
            <h3 class="font-semibold text-slate-800 dark:text-slate-100">Live Updates</h3>
            <p class="text-sm text-slate-500">Load app from a deployed server for instant updates</p>
          </div>
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium text-slate-700 dark:text-slate-300">Server URL</label>
          <input type="url" id="live-url-input" value="${currentUrl}"
            placeholder="https://myapp.onrender.com"
            class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/20">
          <p class="text-xs text-slate-400">If set, the app will load from this URL instead of bundled files</p>
        </div>

        <div class="flex gap-2">
          <button onclick="PWA.setLiveUrl(document.getElementById('live-url-input').value)"
            class="px-4 py-2 bg-blue-900 text-white rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors">
            <i class="fas fa-save mr-1"></i> Save & Reload
          </button>
          <button onclick="PWA.setLiveUrl('')"
            class="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors">
            <i class="fas fa-times mr-1"></i> Clear
          </button>
        </div>

        <div class="bg-blue-50 dark:bg-blue-900/10 rounded-lg p-3 text-xs text-blue-700 dark:text-blue-300 space-y-1">
          <p><i class="fas fa-info-circle mr-1"></i> <strong>How it works:</strong></p>
          <p>1. Deploy this app to Render, Netlify, or any server</p>
          <p>2. Enter the deployment URL above and save</p>
          <p>3. Future updates = just redeploy your server</p>
          <p class="mt-1 text-blue-500">No APK rebuild needed for updates!</p>
        </div>
      </div>
    `;
  },

  checkInstalled() {
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
      this.isInstalled = true;
      document.body.classList.add('pwa-installed');
    }
    if (localStorage.getItem('sw_pwa_installed') === 'true') {
      this.isInstalled = true;
    }
  },

  setupInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.showInstallButton();
    });

    window.addEventListener('appinstalled', () => {
      this.isInstalled = true;
      localStorage.setItem('sw_pwa_installed', 'true');
      this.hideInstallButton();
      this.showToast('App installed successfully!', 'success');
    });
  },

  showInstallButton() {
    const existing = document.getElementById('pwa-install-btn');
    if (existing) {
      existing.classList.remove('hidden');
      return;
    }
    const btn = document.createElement('button');
    btn.id = 'pwa-install-btn';
    btn.className = 'fixed bottom-24 right-6 z-50 bg-blue-900 text-white px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 text-sm font-medium hover:bg-blue-800 transition-all animate-fade-in hidden';
    btn.innerHTML = '<i class="fas fa-download"></i> Install App';
    btn.style = 'display: flex; animation: fadeIn 0.4s ease-out;';
    btn.onclick = () => this.installApp();
    document.body.appendChild(btn);
  },

  hideInstallButton() {
    const btn = document.getElementById('pwa-install-btn');
    if (btn) btn.remove();
  },

  async installApp() {
    if (!this.deferredPrompt) return;
    this.deferredPrompt.prompt();
    const result = await this.deferredPrompt.userChoice;
    if (result.outcome === 'accepted') {
      this.isInstalled = true;
      localStorage.setItem('sw_pwa_installed', 'true');
      this.hideInstallButton();
    }
    this.deferredPrompt = null;
  },

  async registerSW() {
    if (!('serviceWorker' in navigator)) return;

    try {
      const registration = await navigator.serviceWorker.register(this.SW_PATH, {
        scope: '/',
        updateViaCache: 'none'
      });

      this.registration = registration;

      if (registration.active) {
        this.checkVersion(registration);
      }

      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            this.updateAvailable = true;
            this.showUpdateBanner(registration);
          }
        });
      });
    } catch (err) {
      console.warn('SW registration failed:', err);
    }

    navigator.serviceWorker.addEventListener('controllerchange', () => {
      window.location.reload();
    });
  },

  async checkVersion(registration) {
    try {
      const channel = new MessageChannel();
      registration.active.postMessage({ type: 'CHECK_VERSION' }, [channel.port2]);
      channel.port1.onmessage = (event) => {
        const swVersion = event.data.version;
        const cachedVersion = localStorage.getItem('sw_version');
        if (cachedVersion && cachedVersion !== swVersion) {
          this.updateAvailable = true;
          this.showUpdateBanner(registration);
        }
        localStorage.setItem('sw_version', swVersion);
      };
    } catch (e) {}
  },

  showUpdateBanner(registration) {
    const existing = document.getElementById('pwa-update-banner');
    if (existing) return;

    const banner = document.createElement('div');
    banner.id = 'pwa-update-banner';
    banner.className = 'fixed top-4 left-1/2 -translate-x-1/2 z-[100] bg-blue-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-sm max-w-md w-[90%] animate-slideDown';
    banner.innerHTML = `
      <i class="fas fa-rotate text-blue-300"></i>
      <span class="flex-1 font-medium">New version available!</span>
      <button onclick="PWA.applyUpdate()" class="bg-white text-blue-900 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-50 transition-colors">Update</button>
      <button onclick="PWA.dismissUpdate()" class="text-blue-300 hover:text-white transition-colors"><i class="fas fa-times"></i></button>
    `;
    document.body.appendChild(banner);

    setTimeout(() => {
      if (document.getElementById('pwa-update-banner')) {
        this.dismissUpdate();
      }
    }, 15000);
  },

  dismissUpdate() {
    const banner = document.getElementById('pwa-update-banner');
    if (banner) {
      banner.style.transition = 'opacity 0.3s, transform 0.3s';
      banner.style.opacity = '0';
      banner.style.transform = 'translateX(-50%) translateY(-20px)';
      setTimeout(() => banner.remove(), 300);
    }
  },

  async applyUpdate() {
    if (this.registration && this.registration.waiting) {
      this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    } else {
      window.location.reload();
    }
  },

  setupNetworkMonitoring() {
    const updateStatus = () => {
      const wasOffline = document.body.classList.contains('pwa-offline');
      if (navigator.onLine) {
        document.body.classList.remove('pwa-offline');
        if (wasOffline) {
          this.showToast('Back online!', 'success');
        }
      } else {
        document.body.classList.add('pwa-offline');
        this.showToast('You are offline — some features may be limited', 'warning');
      }
    };

    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);
    updateStatus();
  },

  setupAutoUpdate() {
    if (this.isInstalled) {
      setInterval(async () => {
        try {
          const reg = await navigator.serviceWorker.getRegistration();
          if (reg) await reg.update();
        } catch (e) {}
      }, 1800000);
    }
  },

  showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `fixed bottom-28 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl shadow-lg text-sm font-medium flex items-center gap-2 animate-fade-in max-w-sm ${
      type === 'success' ? 'bg-green-600 text-white' :
      type === 'warning' ? 'bg-amber-500 text-white' :
      'bg-slate-800 text-white'
    }`;
    toast.innerHTML = `
      <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle'}"></i>
      ${message}
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.transition = 'opacity 0.3s';
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }
};

// ============================================================
// GLOBAL FIXES: App.showToast + missing functions for App.init
// ============================================================

if (typeof window.showToast !== 'function') {
  window.showToast = function(message, type, duration) {
    type = type || 'info';
    duration = duration || 4000;
    var toast = document.createElement('div');
    var bg = type === 'success' ? 'bg-green-600' : type === 'warning' ? 'bg-amber-500' : type === 'error' || type === 'danger' ? 'bg-red-500' : 'bg-slate-800';
    var icon = type === 'success' ? 'fa-check-circle' : type === 'warning' ? 'fa-exclamation-triangle' : type === 'error' || type === 'danger' ? 'fa-times-circle' : 'fa-info-circle';
    toast.className = 'fixed bottom-28 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl shadow-lg text-sm font-medium flex items-center gap-2 animate-fade-in max-w-sm text-white ' + bg;
    toast.innerHTML = '<i class="fas ' + icon + '"></i> ' + message;
    document.body.appendChild(toast);
    setTimeout(function() {
      toast.style.transition = 'opacity 0.3s';
      toast.style.opacity = '0';
      setTimeout(function() { toast.remove(); }, 300);
    }, duration);
  };
}

if (typeof App !== 'undefined') {
  if (!App.showToast) App.showToast = window.showToast;

  // Patch App.renderView to support live-update view
  const originalRender = App.renderView.bind(App);
  App.renderView = function(view) {
    if (view === 'live-update') {
      this.currentView = view;
      const container = document.getElementById('main-content');
      container.innerHTML = '';
      const navItem = document.querySelector(`.nav-item[data-view="${view}"]`);
      if (navItem) this.setActiveNav(navItem);
      PWA.renderLiveUrlSettings(container);
      return;
    }
    originalRender(view);
  };
}

PWA.init();
