/**
 * SecureWealth Twin - v10 Features Patch
 * Implements: Voice Input, Expense Heatmap, Notification Center wiring,
 * Demo Controls for new features, Chatbot functions, Financial Literacy card
 */
(function() {
  'use strict';

  // ===================== CHATBOT FUNCTIONS =====================
  // These are referenced in index.html but were missing from the bundle
  window.toggleChatbot = function() {
    const win = document.getElementById('chatbot-window');
    const toggle = document.getElementById('chatbot-toggle');
    if (!win) return;
    win.classList.toggle('hidden');
    win.classList.toggle('show');
    if (win.classList.contains('show')) {
      const input = document.getElementById('chatbot-input');
      if (input) setTimeout(() => input.focus(), 100);
    }
  };

  window.expandChatbot = function() {
    const win = document.getElementById('chatbot-window');
    if (!win) return;
    win.classList.toggle('w-96');
    win.classList.toggle('w-80');
    win.classList.toggle('h-[32rem]');
    win.classList.toggle('h-[28rem]');
  };

  window.quickChat = function(text) {
    const input = document.getElementById('chatbot-input');
    if (input) {
      input.value = text;
      sendChatbotMessage();
    }
  };

  window.sendChatbotMessage = function() {
    const input = document.getElementById('chatbot-input');
    const messages = document.getElementById('chatbot-messages');
    const typing = document.getElementById('typing-indicator');
    if (!input || !messages || !input.value.trim()) return;

    const text = input.value.trim();
    input.value = '';

    // Add user message
    const userDiv = document.createElement('div');
    userDiv.className = 'flex items-start gap-2 justify-end';
    userDiv.innerHTML = `
      <div class="user-message p-3 bg-primary text-white text-sm rounded-2xl rounded-tr-sm max-w-[85%]">
        ${text}
      </div>
      <div class="w-7 h-7 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 text-xs flex-shrink-0">
        <i class="fas fa-user"></i>
      </div>
    `;
    messages.appendChild(userDiv);
    messages.scrollTop = messages.scrollHeight;

    // Show typing
    if (typing) typing.classList.remove('hidden');

    // Simulate AI response
    setTimeout(() => {
      if (typing) typing.classList.add('hidden');
      const response = getChatbotResponse(text);
      const botDiv = document.createElement('div');
      botDiv.className = 'flex items-start gap-2';
      botDiv.innerHTML = `
        <div class="w-7 h-7 bg-primary/10 rounded-full flex items-center justify-center text-primary text-xs flex-shrink-0">
          <i class="fas fa-robot"></i>
        </div>
        <div class="bot-message p-3 text-sm text-slate-700 max-w-[90%]">
          <p>${response}</p>
        </div>
      `;
      messages.appendChild(botDiv);
      messages.scrollTop = messages.scrollHeight;
    }, 1200 + Math.random() * 800);
  };

  function getChatbotResponse(text) {
    const lower = text.toLowerCase();
    if (lower.includes('tax')) return 'You can save up to ₹1,50,000 under Section 80C. Consider ELSS funds, PPF, or NPS for tax-efficient growth. Would you like me to calculate your exact tax savings?';
    if (lower.includes('sip') || lower.includes('invest')) return 'Based on your profile, I recommend increasing your SIP by ₹2,000/month. At 12% returns, this adds ₹8.4 Lakhs over 10 years. Shall I show you the projection?';
    if (lower.includes('spend')) return 'Your top spending categories are: Rent (32%), Food (18%), Entertainment (14%). You\'re spending 6% more on dining out vs. last month. Set a weekly budget?';
    if (lower.includes('fraud') || lower.includes('scam')) return 'Our 6-signal Risk Engine has blocked 3 suspicious transactions this month. Your Protection Score is 94/100. Enable biometric login for extra security?';
    if (lower.includes('goal')) return 'Your Emergency Fund goal is 60% complete. At your current savings rate, you\'ll reach it by December 2026. Want to simulate faster completion?';
    if (lower.includes('market') || lower.includes('nifty')) return 'NIFTY 50 is currently at 25,340, up 1.2% today. P/E ratio is at 23.4 — slightly above historical average. Consider SIPs over lump sum in this market.';
    return 'I\'m analyzing your financial data. For personalized advice, try asking about: SIP recommendations, tax savings, spending analysis, or market trends. How can I help?';
  }

  // ===================== VOICE INPUT =====================
  window.startVoiceInput = function() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      App.showToast('Voice input not supported in this browser. Try Chrome.', 'warning');
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    const waveform = document.getElementById('voice-waveform');
    const voiceBtn = document.getElementById('voice-btn');
    const input = document.getElementById('chatbot-input');

    if (waveform) waveform.classList.remove('hidden');
    if (voiceBtn) {
      voiceBtn.classList.add('bg-accent', 'text-white');
      voiceBtn.classList.remove('bg-slate-100', 'text-slate-500');
    }

    recognition.onresult = function(event) {
      const transcript = event.results[0][0].transcript;
      if (input) {
        input.value = transcript;
        sendChatbotMessage();
      }
    };

    recognition.onerror = function(event) {
      App.showToast('Voice recognition error: ' + event.error, 'warning');
      if (waveform) waveform.classList.add('hidden');
      if (voiceBtn) {
        voiceBtn.classList.remove('bg-accent', 'text-white');
        voiceBtn.classList.add('bg-slate-100', 'text-slate-500');
      }
    };

    recognition.onend = function() {
      if (waveform) waveform.classList.add('hidden');
      if (voiceBtn) {
        voiceBtn.classList.remove('bg-accent', 'text-white');
        voiceBtn.classList.add('bg-slate-100', 'text-slate-500');
      }
    };

    recognition.start();
  };

  // ===================== NOTIFICATION CENTER WIRING =====================
  window.toggleNotifications = function() {
    if (window.NotificationCenter) {
      NotificationCenter.toggle();
    } else {
      // Fallback to old system
      const dropdown = document.getElementById('notif-dropdown');
      if (dropdown) dropdown.classList.toggle('hidden');
    }
  };

  window.markAllRead = function() {
    if (window.NotificationCenter) {
      const panel = document.getElementById('notification-panel');
      if (panel) {
        NotificationCenter.notifications.forEach(n => n.unread = false);
        panel.remove();
      }
    }
    const badge = document.getElementById('notif-badge');
    if (badge) badge.classList.add('hidden');
  };

  // ===================== EXPENSE HEATMAP =====================
  const ExpenseHeatmap = {
    data: [
      // Simulated daily spending for last 30 days
      1200, 800, 2500, 600, 1800, 3200, 900, 1500, 700, 2100,
      450, 1200, 3800, 900, 1600, 2200, 500, 1800, 2900, 700,
      1300, 850, 2400, 600, 1900, 3100, 950, 1400, 650, 2000
    ],
    render(containerId) {
      const container = document.getElementById(containerId);
      if (!container) return;
      const max = Math.max(...this.data);
      const min = Math.min(...this.data);
      const avg = Math.round(this.data.reduce((a,b) => a+b, 0) / this.data.length);

      let html = `
        <div class="flex items-center justify-between mb-3">
          <h3 class="font-semibold text-slate-800 text-sm"><i class="fas fa-fire text-orange-500 mr-2"></i>Spending Heatmap</h3>
          <span class="text-[10px] text-slate-400">Avg ₹${avg}/day</span>
        </div>
        <div class="grid grid-cols-10 gap-1">
      `;
      this.data.forEach((amount, i) => {
        const intensity = (amount - min) / (max - min);
        const alpha = 0.15 + intensity * 0.85;
        const color = intensity > 0.7 ? '#ef4444' : intensity > 0.4 ? '#f59e0b' : '#10b981';
        html += `
          <div class="aspect-square rounded-sm cursor-pointer hover:scale-110 transition-transform" 
               style="background: ${color}; opacity: ${alpha};"
               title="Day ${i+1}: ₹${amount.toLocaleString()}">
          </div>
        `;
      });
      html += `
        </div>
        <div class="flex items-center justify-between mt-2 text-[10px] text-slate-400">
          <div class="flex items-center gap-1"><div class="w-2 h-2 rounded-sm bg-emerald-500"></div> Low</div>
          <div class="flex items-center gap-1"><div class="w-2 h-2 rounded-sm bg-amber-500"></div> Medium</div>
          <div class="flex items-center gap-1"><div class="w-2 h-2 rounded-sm bg-rose-500"></div> High</div>
        </div>
      `;
      container.innerHTML = html;
    }
  };
  window.ExpenseHeatmap = ExpenseHeatmap;

  // ===================== DEMO CONTROLS ENHANCEMENT =====================
  // Wait for DemoControls to exist, then add new buttons
  function enhanceDemoControls() {
    if (!window.DemoControls) {
      setTimeout(enhanceDemoControls, 500);
      return;
    }
    const originalRender = DemoControls.render;
    DemoControls.render = function() {
      originalRender.call(this);
      const panel = document.getElementById('demo-controls-panel');
      if (!panel) return;
      const extra = document.createElement('div');
      extra.className = 'mt-2 pt-2 border-t border-slate-200 dark:border-slate-600 space-y-1';
      extra.innerHTML = `
        <p class="text-[10px] font-semibold text-slate-500 dark:text-slate-400">New Features</p>
        <button onclick="SecureCheckout.show(function(){App.showToast('Transaction complete!', 'success');})" class="w-full py-1.5 bg-slate-100 dark:bg-slate-700 rounded text-[10px] text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors">
          <i class="fas fa-fingerprint mr-1 text-emerald-500"></i>Secure Checkout
        </button>
        <button onclick="GoalCelebration.trigger()" class="w-full py-1.5 bg-slate-100 dark:bg-slate-700 rounded text-[10px] text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors">
          <i class="fas fa-party-horn mr-1 text-purple-500"></i>Goal Celebration
        </button>
        <button onclick="ScamCallerID.show()" class="w-full py-1.5 bg-slate-100 dark:bg-slate-700 rounded text-[10px] text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors">
          <i class="fas fa-phone-volume mr-1 text-rose-500"></i>Scam Call
        </button>
        <button onclick="ReportScam.show()" class="w-full py-1.5 bg-slate-100 dark:bg-slate-700 rounded text-[10px] text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors">
          <i class="fas fa-flag mr-1 text-amber-500"></i>Report Scam
        </button>
        <button onclick="DuressLoginModal.show()" class="w-full py-1.5 bg-slate-100 dark:bg-slate-700 rounded text-[10px] text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors">
          <i class="fas fa-mask mr-1 text-slate-500"></i>Duress Mode
        </button>
      `;
      panel.appendChild(extra);
    };
  }
  setTimeout(enhanceDemoControls, 2500);

  // ===================== DASHBOARD ENHANCEMENT =====================
  // Add Financial Literacy and Expense Heatmap cards to dashboard
  function enhanceDashboard() {
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;

    // Check if we're on dashboard
    if (App.currentView !== 'dashboard') return;

    // Add Financial Literacy card after AI Recommendations
    const recsCard = mainContent.querySelector('.card:has(.fa-lightbulb)') || 
                     Array.from(mainContent.querySelectorAll('.card')).find(c => c.textContent.includes('AI Recommendations'));
    
    if (recsCard && !document.getElementById('financial-literacy-card')) {
      const litCard = document.createElement('div');
      litCard.id = 'financial-literacy-card';
      litCard.className = 'card p-5';
      litCard.innerHTML = `
        <div class="flex items-center justify-between mb-3">
          <h3 class="font-semibold text-slate-800 text-sm"><i class="fas fa-book-open text-amber-500 mr-2"></i>Financial Literacy</h3>
          <span class="text-[10px] px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full">Daily Tip</span>
        </div>
        <div id="financial-literacy-content"></div>
      `;
      recsCard.parentNode.insertBefore(litCard, recsCard.nextSibling);
      if (window.FinancialLiteracy) {
        FinancialLiteracy.render('financial-literacy-content');
      }
    }

    // Add Expense Heatmap card
    const chartsRow = mainContent.querySelector('.grid:has(#spendingChart)');
    if (chartsRow && !document.getElementById('expense-heatmap-card')) {
      const heatmapCard = document.createElement('div');
      heatmapCard.id = 'expense-heatmap-card';
      heatmapCard.className = 'card p-5';
      heatmapCard.innerHTML = `<div id="expense-heatmap-container"></div>`;
      chartsRow.parentNode.insertBefore(heatmapCard, chartsRow.nextSibling);
      ExpenseHeatmap.render('expense-heatmap-container');
    }
  }

  // Hook into App.renderView to enhance dashboard
  const originalRenderView = App.renderView;
  App.renderView = function(view) {
    originalRenderView.call(this, view);
    if (view === 'dashboard') {
      setTimeout(enhanceDashboard, 800);
    }
  };

  // Also enhance if already on dashboard when this script loads
  if (App.currentView === 'dashboard') {
    setTimeout(enhanceDashboard, 1000);
  }

  // ===================== VOICE WAVEFORM ANIMATION =====================
  // Add CSS for voice waveform animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes voiceBar {
      0%, 100% { height: 20%; }
      50% { height: 100%; }
    }
    .voice-bar {
      animation: voiceBar 0.5s ease-in-out infinite;
    }
    .voice-bar:nth-child(2) { animation-delay: 0.1s; }
    .voice-bar:nth-child(3) { animation-delay: 0.2s; }
    .voice-bar:nth-child(4) { animation-delay: 0.3s; }
    .voice-bar:nth-child(5) { animation-delay: 0.15s; }
    .voice-bar:nth-child(6) { animation-delay: 0.25s; }
    .voice-bar:nth-child(7) { animation-delay: 0.35s; }
    .voice-bar:nth-child(8) { animation-delay: 0.05s; }
  `;
  document.head.appendChild(style);

  console.log('[v10] Features loaded: VoiceInput, ExpenseHeatmap, NotificationCenter wiring, Demo Controls enhancement, Chatbot functions');
})();
