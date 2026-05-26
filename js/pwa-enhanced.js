const PWA = {
  APP_VERSION: '3.0.0',
  SW_PATH: '/sw.js',
  deferredPrompt: null,
  isInstalled: false,
  updateAvailable: false,

  async init() {
    this.checkInstalled();
    this.setupInstallPrompt();
    this.registerSW();
    this.setupNetworkMonitoring();
    this.setupAutoUpdate();
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

PWA.init();
