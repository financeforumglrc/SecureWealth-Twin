/**
 * Views Comprehensive Patch
 * Overrides all minified view renderers with working charts & layouts
 */
(function() {
  'use strict';

  const C = n => {
    if (n >= 1e7) return '₹' + (n/1e7).toFixed(2) + 'Cr';
    if (n >= 1e5) return '₹' + (n/1e5).toFixed(1) + 'L';
    return '₹' + n.toLocaleString('en-IN');
  };

  function isDark() { return document.documentElement.classList.contains('dark'); }
  function gridColor() { return isDark() ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'; }
  function textColor() { return isDark() ? '#94a3b8' : '#64748b'; }
  function cardBg() { return isDark() ? '#1e293b' : '#ffffff'; }

  function destroyCharts() {
    Object.values(App?.charts || {}).forEach(c => c && c.destroy && c.destroy());
    if (App) App.charts = {};
  }

  // ===================== WEALTH TWIN =====================
  function renderWealthTwin(container) {
    if (!container) container = document.getElementById('main-content');
    destroyCharts();
    container.innerHTML = `
      <div class="space-y-6 pb-8">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold text-slate-800 dark:text-white">Wealth Twin</h2>
            <p class="text-sm text-slate-500 dark:text-slate-400">AI-powered projection of your financial future</p>
          </div>
          <div class="px-3 py-1.5 bg-primary/10 text-primary text-xs font-medium rounded-full">
            <i class="fas fa-robot mr-1"></i>AI Active
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="lg:col-span-2 bg-white dark:bg-dark-light rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5">
            <h3 class="font-semibold text-slate-800 dark:text-white mb-4">Net Worth Projection</h3>
            <div class="relative h-72"><canvas id="wt-networth-chart"></canvas></div>
          </div>
          <div class="space-y-4">
            <div class="bg-white dark:bg-dark-light rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5">
              <h3 class="font-semibold text-slate-800 dark:text-white mb-3">Current Snapshot</h3>
              <div class="space-y-3">
                <div class="flex justify-between text-sm"><span class="text-slate-500">Total Net Worth</span><span class="font-bold text-slate-800 dark:text-white">${C(4520000)}</span></div>
                <div class="flex justify-between text-sm"><span class="text-slate-500">Liquid Assets</span><span class="font-bold text-slate-800 dark:text-white">${C(850000)}</span></div>
                <div class="flex justify-between text-sm"><span class="text-slate-500">Investments</span><span class="font-bold text-slate-800 dark:text-white">${C(2130000)}</span></div>
                <div class="flex justify-between text-sm"><span class="text-slate-500">Physical Assets</span><span class="font-bold text-slate-800 dark:text-white">${C(1540000)}</span></div>
              </div>
            </div>
            <div class="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl border border-primary/10 p-5">
              <h4 class="font-semibold text-slate-800 dark:text-white mb-2">AI Projection</h4>
              <p class="text-sm text-slate-600 dark:text-slate-300">At your current savings rate of <strong>22.4%</strong>, you'll reach <strong>₹1 Cr</strong> by <strong>2031</strong>.</p>
              <button onclick="App.renderView('goals')" class="mt-3 px-3 py-1.5 bg-primary text-white text-xs rounded-lg">Adjust Goals</button>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-white dark:bg-dark-light rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5 text-center">
            <div class="text-3xl font-bold text-primary">${C(125000)}</div>
            <p class="text-xs text-slate-500 mt-1">Monthly Income</p>
          </div>
          <div class="bg-white dark:bg-dark-light rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5 text-center">
            <div class="text-3xl font-bold text-emerald-500">${C(28000)}</div>
            <p class="text-xs text-slate-500 mt-1">Monthly Savings</p>
          </div>
          <div class="bg-white dark:bg-dark-light rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5 text-center">
            <div class="text-3xl font-bold text-amber-500">${C(72000)}</div>
            <p class="text-xs text-slate-500 mt-1">Monthly Expenses</p>
          </div>
        </div>

        <!-- AI Chat Model -->
        <div class="bg-white dark:bg-dark-light rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div class="bg-gradient-to-r from-primary to-secondary p-4 text-white flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <i class="fas fa-robot text-lg"></i>
              </div>
              <div>
                <h3 class="font-semibold text-white">Wealth Twin AI Chat</h3>
                <p class="text-xs text-white/70">Ask me anything about your finances</p>
              </div>
            </div>
            <span id="wt-ai-status" class="px-2 py-1 bg-white/20 rounded-full text-xs font-medium"><i class="fas fa-circle text-[8px] mr-1"></i>Gemini AI</span>
          </div>
          <div class="p-4">
            ${window.SECUREWEALTH_KEYS?.gemini ? '' : `
            <div class="mb-3 p-2 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div class="flex items-center gap-2 flex-wrap">
                <i class="fas fa-key text-slate-400 text-xs"></i>
                <span class="text-xs text-slate-500 dark:text-slate-400">Gemini API Key:</span>
                <input type="password" id="wt-gemini-key" placeholder="Paste your Gemini API key here" class="flex-1 min-w-[200px] px-2 py-1 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded text-xs focus:outline-none focus:ring-1 focus:ring-primary dark:text-white">
                <button onclick="saveWTGeminiKey()" class="px-3 py-1 bg-primary text-white text-xs rounded hover:bg-primary/90 transition-colors">Save</button>
                <span id="wt-key-status"></span>
              </div>
              <p class="text-[10px] text-slate-400 mt-1">Get a free key from <a href="https://aistudio.google.com/app/apikey" target="_blank" class="text-primary hover:underline">Google AI Studio</a>. Without a key, offline responses are used.</p>
            </div>`}
            <div id="wt-chat-messages" class="space-y-3 mb-4 max-h-80 overflow-y-auto pr-1">
              <div class="flex items-start gap-2">
                <div class="w-7 h-7 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 text-primary text-xs"><i class="fas fa-robot"></i></div>
                <div class="bg-slate-50 dark:bg-slate-800 rounded-lg p-3 text-sm text-slate-700 dark:text-slate-200 max-w-[85%]">
                  <p class="font-medium mb-1">Hello Rahul! I'm your Wealth Twin AI.</p>
                  <p>I know your financial profile: Net Worth <strong>${C(4520000)}</strong>, saving <strong>22.4%</strong> of income. Ask me about projections, savings tips, or goal planning!</p>
                </div>
              </div>
            </div>
            <div class="flex flex-wrap gap-2 mb-3">
              <button onclick="quickWealthTwinChat('When will I reach ₹1 Crore?')" class="px-3 py-1.5 bg-primary/10 text-primary text-xs rounded-full hover:bg-primary/20 transition-colors">When will I reach ₹1 Crore?</button>
              <button onclick="quickWealthTwinChat('How can I save more?')" class="px-3 py-1.5 bg-primary/10 text-primary text-xs rounded-full hover:bg-primary/20 transition-colors">How can I save more?</button>
              <button onclick="quickWealthTwinChat('Should I invest more in SIP?')" class="px-3 py-1.5 bg-primary/10 text-primary text-xs rounded-full hover:bg-primary/20 transition-colors">Should I invest more in SIP?</button>
              <button onclick="quickWealthTwinChat('Analyze my spending')" class="px-3 py-1.5 bg-primary/10 text-primary text-xs rounded-full hover:bg-primary/20 transition-colors">Analyze my spending</button>
            </div>
            <div class="flex gap-2">
              <input type="text" id="wt-chat-input" placeholder="Ask about your wealth, savings, investments..." class="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 dark:text-white" onkeypress="if(event.key==='Enter')sendWealthTwinChat()">
              <button onclick="sendWealthTwinChat()" class="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90 transition-colors"><i class="fas fa-paper-plane"></i></button>
            </div>
          </div>
        </div>
      </div>`;

    setTimeout(() => {
      const ctx = document.getElementById('wt-networth-chart');
      if (ctx && window.Chart) {
        const wrap = ctx.parentElement;
        if (wrap && wrap.clientWidth > 0 && wrap.clientHeight > 0) {
          ctx.width = wrap.clientWidth;
          ctx.height = wrap.clientHeight;
        }
        App.charts.wt = new Chart(ctx.getContext('2d'), {
          type: 'line',
          data: {
            labels: ['2025','2026','2027','2028','2029','2030','2031','2032','2033','2034'],
            datasets: [{
              label: 'Projected Net Worth',
              data: [45,52,61,72,85,101,120,142,168,198].map(v => v * 100000),
              borderColor: '#0f766e',
              backgroundColor: 'rgba(15,118,110,0.08)',
              fill: true,
              tension: 0.4,
              pointRadius: 4
            }, {
              label: 'Conservative',
              data: [45,50,56,63,71,80,90,102,115,130].map(v => v * 100000),
              borderColor: '#94a3b8',
              backgroundColor: 'transparent',
              borderDash: [5,5],
              tension: 0.4,
              pointRadius: 0
            }]
          },
          options: {
            responsive: false,
            maintainAspectRatio: false,
            animation: { duration: 0 },
            plugins: { legend: { position: 'top', labels: { color: textColor() } } },
            scales: {
              y: { grid: { color: gridColor() }, ticks: { callback: v => C(v), color: textColor() } },
              x: { grid: { display: false }, ticks: { color: textColor() } }
            }
          }
        });
      }
      // Pre-fill Gemini API key if stored
      setTimeout(() => {
        const keyInput = document.getElementById('wt-gemini-key');
        if (keyInput) {
          try {
            const saved = localStorage.getItem('wt_gemini_key');
            if (saved) keyInput.value = saved;
          } catch(e) {}
        }
      }, 200);
    }, 100);
  }

  // ===================== WEALTH TWIN AI CHAT =====================
  const WT_GEMINI_MODEL = 'gemini-flash-latest';
  const WT_GEMINI_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/';
  let wtChatHistory = [];

  function getGeminiKey() {
    try {
      const globalKey = window.SECUREWEALTH_KEYS?.gemini;
      if (globalKey) return globalKey;
      return localStorage.getItem('wt_gemini_key') || '';
    } catch(e) { return ''; }
  }
  function setGeminiKey(key) {
    try { localStorage.setItem('wt_gemini_key', key); } catch(e) {}
  }

  function quickWealthTwinChat(text) {
    const input = document.getElementById('wt-chat-input');
    if (input) input.value = text;
    sendWealthTwinChat();
  }

  function buildSystemPrompt() {
    return `You are Wealth Twin AI, an expert Indian financial advisor. You have complete access to the user's financial profile. Answer ONLY in HTML (use <p>, <ul>, <li>, <strong> tags). Keep responses concise (3-5 sentences max) and actionable.

USER PROFILE:
- Name: Rahul Sharma
- Monthly Income: ₹1,25,000
- Monthly Expenses: ₹72,000
- Monthly Savings: ₹28,000 (22.4% savings rate)
- Total Net Worth: ₹45,20,000
  - Liquid Assets: ₹8,50,000
  - Investments: ₹21,30,000
  - Physical Assets: ₹15,40,000
- Protection Score: 94/100
- Goals: Emergency Fund (85%), Home Down Payment (42% by 2028), Child Education (28% by 2032), Retirement (4.8% by 2048)
- Spending: Housing ₹25K, Food ₹18K, Transport ₹12K, Entertainment ₹10K (14% higher than peers), Others ₹7K
- Tax Savings Potential: ₹78,000/year
- Projected ₹1 Crore by: 2031

RULES:
- Always give specific numbers from the profile
- Use Indian rupee format (₹)
- Be encouraging but honest about gaps
- Suggest concrete next steps
- If asked something unrelated to finance, politely redirect to financial topics`;
  }

  async function callGeminiAPI(userText) {
    const apiKey = getGeminiKey();
    if (!apiKey) throw new Error('No API key configured');

    const url = `${WT_GEMINI_ENDPOINT}${WT_GEMINI_MODEL}:generateContent?key=${apiKey}`;
    const messages = wtChatHistory.slice(-6).map(h => ({
      role: h.role === 'user' ? 'user' : 'model',
      parts: [{ text: h.text }]
    }));
    messages.push({ role: 'user', parts: [{ text: userText }] });

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: messages,
        systemInstruction: { parts: [{ text: buildSystemPrompt() }] },
        generationConfig: { maxOutputTokens: 512, temperature: 0.7 }
      })
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      const msg = err.error?.message || '';
      if (msg.includes('quota') || msg.includes('exceeded') || msg.includes('limit')) {
        throw new Error('API quota exceeded — using offline mode');
      }
      if (msg.includes('API key not valid')) {
        throw new Error('Invalid API key — using offline mode');
      }
      throw new Error(msg || `Gemini error: ${res.status}`);
    }

    const data = await res.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not generate a response.';
    return reply;
  }

  function updateAIStatus(status, reason) {
    const badge = document.getElementById('wt-ai-status');
    if (!badge) return;
    if (status === 'online') {
      badge.innerHTML = '<i class="fas fa-circle text-[8px] mr-1 text-emerald-400"></i>Gemini AI';
      badge.className = 'px-2 py-1 bg-white/20 rounded-full text-xs font-medium';
    } else {
      badge.innerHTML = '<i class="fas fa-circle text-[8px] mr-1 text-amber-400"></i>Offline Mode';
      badge.className = 'px-2 py-1 bg-amber-500/20 rounded-full text-xs font-medium';
    }
  }

  function showTyping(messages) {
    const typingId = 'wt-typing-' + Date.now();
    messages.innerHTML += `
      <div id="${typingId}" class="flex items-start gap-2">
        <div class="w-7 h-7 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 text-primary text-xs"><i class="fas fa-robot"></i></div>
        <div class="bg-slate-50 dark:bg-slate-800 rounded-lg p-3 text-sm text-slate-700 dark:text-slate-200">
          <div class="flex gap-1">
            <div class="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style="animation-delay:0ms"></div>
            <div class="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style="animation-delay:150ms"></div>
            <div class="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style="animation-delay:300ms"></div>
          </div>
        </div>
      </div>`;
    messages.scrollTop = messages.scrollHeight;
    return typingId;
  }

  function removeTyping(typingId) {
    const el = document.getElementById(typingId);
    if (el) el.remove();
  }

  function appendBotMessage(messages, html) {
    messages.innerHTML += `
      <div class="flex items-start gap-2">
        <div class="w-7 h-7 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 text-primary text-xs"><i class="fas fa-robot"></i></div>
        <div class="bg-slate-50 dark:bg-slate-800 rounded-lg p-3 text-sm text-slate-700 dark:text-slate-200 max-w-[85%]">
          ${html}
        </div>
      </div>`;
    messages.scrollTop = messages.scrollHeight;
  }

  function appendUserMessage(messages, text) {
    messages.innerHTML += `
      <div class="flex items-start gap-2 justify-end">
        <div class="bg-primary text-white rounded-lg p-3 text-sm max-w-[85%]">
          ${text.replace(/</g, '&lt;')}
        </div>
        <div class="w-7 h-7 bg-slate-200 dark:bg-slate-600 rounded-full flex items-center justify-center flex-shrink-0 text-slate-600 dark:text-slate-300 text-xs"><i class="fas fa-user"></i></div>
      </div>`;
    messages.scrollTop = messages.scrollHeight;
  }

  async function sendWealthTwinChat() {
    const input = document.getElementById('wt-chat-input');
    const messages = document.getElementById('wt-chat-messages');
    if (!input || !messages) return;
    const text = input.value.trim();
    if (!text) return;

    appendUserMessage(messages, text);
    input.value = '';
    wtChatHistory.push({ role: 'user', text: text });

    const typingId = showTyping(messages);

    try {
      const reply = await callGeminiAPI(text);
      removeTyping(typingId);
      appendBotMessage(messages, reply);
      wtChatHistory.push({ role: 'model', text: reply });
      updateAIStatus('online');
    } catch (err) {
      console.warn('[Gemini] Failed, using fallback:', err.message);
      removeTyping(typingId);
      const fallback = generateWealthTwinResponse(text.toLowerCase());
      appendBotMessage(messages, fallback);
      wtChatHistory.push({ role: 'model', text: fallback });
      updateAIStatus('offline', err.message);

      // Show error hint
      if (err.message.includes('quota')) {
        appendBotMessage(messages, '<p class="text-xs text-amber-500 mt-1"><i class="fas fa-triangle-exclamation mr-1"></i>Gemini API quota exceeded. The model is using offline responses. Try again later or use a different API key.</p>');
      } else if (err.message.includes('Invalid API key')) {
        appendBotMessage(messages, '<p class="text-xs text-danger mt-1"><i class="fas fa-key mr-1"></i>Invalid API key. Please check your key in api-keys.js</p>');
      }
    }
  }

  function generateWealthTwinResponse(text) {
    if (text.includes('1 crore') || text.includes('one crore') || text.includes('cr')) {
      return '<p class="font-medium mb-1">🎯 Crorepati Timeline</p><p>At your current savings rate of <strong>22.4%</strong> (₹28,000/month), you will reach <strong>₹1 Crore</strong> by <strong>2031</strong>. If you increase your SIP by just ₹2,000/month, you can hit this milestone <strong>8 months earlier</strong> in 2030.</p>';
    }
    if (text.includes('save') || text.includes('saving')) {
      return '<p class="font-medium mb-1">💡 Savings Optimization</p><p>Your current savings rate is good at 22.4%. Here are 3 ways to boost it:</p><ul class="list-disc list-inside mt-1 space-y-1"><li>Your entertainment spending is <strong>14% higher</strong> than peers. A weekly budget of ₹2,000 could save ₹6,000/month.</li><li>Consider a <strong>50-30-20 rule</strong>: 50% needs, 30% wants, 20% savings.</li><li>Automate a ₹5,000 SIP on salary day.</li></ul>';
    }
    if (text.includes('sip') || text.includes('invest')) {
      return '<p class="font-medium mb-1">📈 SIP Recommendation</p><p>Yes, increasing your SIP is highly recommended! Based on your profile:</p><ul class="list-disc list-inside mt-1 space-y-1"><li><strong>Current:</strong> ~₹15,000/month SIP</li><li><strong>Recommended:</strong> ₹22,000/month SIP</li><li><strong>Impact:</strong> Additional <strong>₹47 Lakhs</strong> wealth by 2035</li></ul><p class="mt-1">Consider splitting: 60% equity index funds, 30% debt, 10% gold.</p>';
    }
    if (text.includes('spend') || text.includes('expense') || text.includes('analyz')) {
      return '<p class="font-medium mb-1">📊 Spending Analysis</p><p>Here is your spending breakdown:</p><ul class="list-disc list-inside mt-1 space-y-1"><li><strong>Housing:</strong> ₹25,000 (35%) — highest category</li><li><strong>Food & Groceries:</strong> ₹18,000 (25%)</li><li><strong>Transport:</strong> ₹12,000 (17%)</li><li><strong>Entertainment:</strong> ₹10,000 (14%) — <span class="text-amber-500">higher than peers</span></li><li><strong>Others:</strong> ₹7,000 (9%)</li></ul><p class="mt-1">You spend <strong>57.6%</strong> of income on expenses. Industry benchmark is 50%.</p>';
    }
    if (text.includes('goal') || text.includes('target')) {
      return '<p class="font-medium mb-1">🎯 Goal Tracking</p><p>You have 4 active goals:</p><ul class="list-disc list-inside mt-1 space-y-1"><li><strong>Emergency Fund:</strong> 85% complete — almost there!</li><li><strong>Home Down Payment:</strong> 42% complete — target 2028</li><li><strong>Child Education:</strong> 28% complete — on track</li><li><strong>Retirement:</strong> 4.8% complete — consider increasing contribution</li></ul>';
    }
    if (text.includes('risk') || text.includes('safe') || text.includes('protect')) {
      return '<p class="font-medium mb-1">🛡️ Risk Assessment</p><p>Your Protection Score is <strong>94/100</strong> — excellent! Your portfolio risk level is <strong>Moderate</strong>. Recommendation: Maintain 6-month emergency fund and consider term insurance of ₹1 Crore.</p>';
    }
    if (text.includes('tax') || text.includes('taxes')) {
      return '<p class="font-medium mb-1">💰 Tax Optimization</p><p>You can save up to <strong>₹78,000/year</strong> in taxes:</p><ul class="list-disc list-inside mt-1 space-y-1"><li>₹1.5L under 80C (PPF/ELSS)</li><li>₹50,000 NPS under 80CCD(1B)</li><li>₹25,000 health insurance under 80D</li><li>HRA exemption: ₹3.6L/year</li></ul>';
    }
    if (text.includes('net worth') || text.includes('wealth') || text.includes('total')) {
      return '<p class="font-medium mb-1">💎 Net Worth Summary</p><p>Your current net worth is <strong>₹45.2 Lakhs</strong>:</p><ul class="list-disc list-inside mt-1 space-y-1"><li>Liquid Assets: ₹8.5L (19%)</li><li>Investments: ₹21.3L (47%)</li><li>Physical Assets: ₹15.4L (34%)</li></ul><p class="mt-1">Year-on-year growth: <strong>+18.5%</strong>. You are in the top 15% for your age group.</p>';
    }
    if (text.includes('hi') || text.includes('hello') || text.includes('hey')) {
      return '<p class="font-medium mb-1">👋 Hello!</p><p>I am your Wealth Twin AI. I know everything about your financial profile. Ask me about your net worth, savings tips, investment recommendations, spending analysis, tax optimization, or when you will become a crorepati!</p>';
    }
    return '<p class="font-medium mb-1">🤔 Let me analyze that...</p><p>Based on your profile (Net Worth ₹45.2L, Income ₹1.25L/month, Savings 22.4%), here is what I think:</p><p class="mt-1">' + text.replace(/</g, '&lt;') + ' — this is a great question! I recommend reviewing your financial plan quarterly. Your current trajectory is solid, but small increases in SIP (₹2,000-5,000/month) can compound significantly over 10 years.</p>';
  }

  window.saveWTGeminiKey = function() {
    const input = document.getElementById('wt-gemini-key');
    const status = document.getElementById('wt-key-status');
    if (!input) return;
    const key = input.value.trim();
    if (key.length < 10) {
      if (status) { status.textContent = 'Invalid key'; status.className = 'text-xs text-danger ml-2'; }
      return;
    }
    setGeminiKey(key);
    if (status) { status.textContent = 'Saved!'; status.className = 'text-xs text-success ml-2'; }
    setTimeout(() => { if (status) status.textContent = ''; }, 2000);
  };

  // Expose globally for inline onclick handlers
  window.quickWealthTwinChat = quickWealthTwinChat;
  window.sendWealthTwinChat = sendWealthTwinChat;

  // ===================== GOALS =====================
  function renderGoals(container) {
    if (!container) container = document.getElementById('main-content');
    destroyCharts();
    const goals = [
      { name: 'Emergency Fund', target: 300000, current: 255000, deadline: '2026-12-01', color: '#0f766e', icon: 'fa-kit-medical' },
      { name: 'Home Down Payment', target: 2000000, current: 840000, deadline: '2028-06-01', color: '#14b8a6', icon: 'fa-house' },
      { name: 'Child Education', target: 1500000, current: 420000, deadline: '2032-04-01', color: '#f59e0b', icon: 'fa-graduation-cap' },
      { name: 'Retirement Corpus', target: 50000000, current: 2400000, deadline: '2048-01-01', color: '#8b5cf6', icon: 'fa-umbrella-beach' }
    ];

    container.innerHTML = `
      <div class="space-y-6 pb-8">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold text-slate-800 dark:text-white">Financial Goals</h2>
            <p class="text-sm text-slate-500 dark:text-slate-400">Track and achieve your life goals</p>
          </div>
          <button class="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90"><i class="fas fa-plus mr-1"></i>New Goal</button>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          ${goals.map(g => {
            const pct = Math.round(g.current / g.target * 100);
            return `
            <div class="bg-white dark:bg-dark-light rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5">
              <div class="flex items-start justify-between mb-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-lg flex items-center justify-center text-white" style="background:${g.color}">
                    <i class="fas ${g.icon}"></i>
                  </div>
                  <div>
                    <h3 class="font-semibold text-slate-800 dark:text-white">${g.name}</h3>
                    <p class="text-xs text-slate-500">Target by ${new Date(g.deadline).toLocaleDateString('en-IN', {month:'short', year:'numeric'})}</p>
                  </div>
                </div>
                <span class="text-lg font-bold" style="color:${g.color}">${pct}%</span>
              </div>
              <div class="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-3 mb-3">
                <div class="h-3 rounded-full transition-all duration-1000" style="width:0%;background:${g.color}" data-width="${pct}%"></div>
              </div>
              <div class="flex justify-between text-xs text-slate-500">
                <span>${C(g.current)} saved</span>
                <span>${C(g.target)} target</span>
              </div>
              <div class="mt-4 flex gap-2">
                <button onclick="RiskEngine.protect('add-funds-${g.name.replace(/\s+/g,'-').toLowerCase()}', ${g.target - g.current}, () => { NudgeEngine.show('Funds added to ${g.name}', 'success'); })" class="flex-1 py-2 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs rounded-lg hover:bg-slate-100">Add Funds</button>
                <button onclick="GoalSimulatorUI.open(${goals.indexOf(g)})" class="flex-1 py-2 bg-primary/10 text-primary text-xs rounded-lg hover:bg-primary/20">Simulate</button>
              </div>
            </div>`;
          }).join('')}
        </div>
      </div>`;

    setTimeout(() => {
      document.querySelectorAll('[data-width]').forEach(el => {
        setTimeout(() => el.style.width = el.getAttribute('data-width'), 100);
      });
    }, 100);
  }

  window.GoalSimulatorUI = {
    open(goalIndex) {
      const goals = [
        { name: 'Emergency Fund', target: 300000, current: 255000, monthly: 5000 },
        { name: 'Home Down Payment', target: 2000000, current: 840000, monthly: 15000 },
        { name: 'Child Education', target: 1500000, current: 420000, monthly: 8000 },
        { name: 'Retirement Corpus', target: 50000000, current: 2400000, monthly: 10000 }
      ];
      const g = goals[goalIndex];
      if (!g) return;

      const existing = document.getElementById('goal-sim-modal');
      if (existing) existing.remove();

      const modal = document.createElement('div');
      modal.id = 'goal-sim-modal';
      modal.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4';
      modal.innerHTML = `
        <div class="bg-white dark:bg-dark-light rounded-2xl shadow-2xl max-w-md w-full p-6">
          <h3 class="text-lg font-bold text-slate-800 dark:text-white mb-1">${g.name} Simulator</h3>
          <p class="text-xs text-slate-500 mb-4">Current: ${C(g.current)} · Target: ${C(g.target)}</p>
          <div class="mb-4">
            <label class="text-xs font-medium text-slate-600 dark:text-slate-300">Extra monthly contribution: <span id="sim-extra-val" class="text-primary font-bold">₹0</span></label>
            <input type="range" id="sim-slider" min="0" max="50000" step="1000" value="0" class="w-full mt-2 accent-primary">
          </div>
          <div id="sim-result" class="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg text-sm text-slate-600 dark:text-slate-300 mb-4">
            Move the slider to see how extra contributions affect your timeline.
          </div>
          <div class="flex gap-3">
            <button onclick="document.getElementById('goal-sim-modal').remove()" class="flex-1 py-2.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm">Close</button>
            <button onclick="RiskEngine.protect('goal-sim-apply', ${g.monthly}, () => { document.getElementById('goal-sim-modal').remove(); NudgeEngine.show('Goal updated!', 'success'); })" class="flex-1 py-2.5 bg-primary text-white rounded-lg text-sm">Apply</button>
          </div>
        </div>`;
      document.body.appendChild(modal);

      const slider = document.getElementById('sim-slider');
      const extraVal = document.getElementById('sim-extra-val');
      const result = document.getElementById('sim-result');

      slider.oninput = () => {
        const extra = parseInt(slider.value);
        extraVal.textContent = C(extra);
        if (window.GoalSimulator) {
          const sim = GoalSimulator.simulate(g, g.monthly + extra);
          result.innerHTML = `
            <p class="font-medium text-slate-800 dark:text-white mb-1">At ${C(g.monthly + extra)}/month:</p>
            <ul class="text-xs space-y-1">
              <li><i class="fas fa-calendar text-primary mr-1"></i>Reach goal by <strong>${sim.date}</strong></li>
              <li><i class="fas fa-coins text-amber-500 mr-1"></i>Total invested: <strong>${C(sim.totalInvested)}</strong></li>
              <li><i class="fas fa-clock text-secondary mr-1"></i>${sim.months} months from now</li>
            </ul>
          `;
        }
      };
    }
  };

  // ===================== PORTFOLIO =====================
  function renderPortfolio(container) {
    if (!container) container = document.getElementById('main-content');
    destroyCharts();
    container.innerHTML = `
      <div class="space-y-6 pb-8">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold text-slate-800 dark:text-white">Portfolio</h2>
            <p class="text-sm text-slate-500 dark:text-slate-400">Asset allocation and investment tracking</p>
          </div>
          <div class="flex gap-2">
            <button onclick="RiskEngine.protect('start-sip', 5000, () => { NudgeEngine.show('SIP started successfully', 'success'); })" class="px-4 py-2 bg-secondary text-white text-sm rounded-lg hover:bg-secondary/90">Start SIP</button>
            <button onclick="RiskEngine.protect('portfolio-rebalance', 0, () => { NudgeEngine.show('Portfolio rebalanced successfully', 'success'); })" class="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90">Rebalance</button>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="bg-white dark:bg-dark-light rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5">
            <h3 class="font-semibold text-slate-800 dark:text-white mb-4">Asset Allocation</h3>
            <div class="relative h-56"><canvas id="port-alloc-chart"></canvas></div>
          </div>
          <div class="lg:col-span-2 bg-white dark:bg-dark-light rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5">
            <h3 class="font-semibold text-slate-800 dark:text-white mb-4">Active SIPs</h3>
            <div class="space-y-3">
              <div class="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary"><i class="fas fa-chart-line text-xs"></i></div>
                  <div><p class="text-sm font-medium text-slate-800 dark:text-white">Axis Bluechip Fund</p><p class="text-xs text-slate-500">Started Mar 2022</p></div>
                </div>
                <div class="text-right"><p class="text-sm font-bold text-slate-800 dark:text-white">₹5,000/mo</p><p class="text-xs text-emerald-500">+14.2% CAGR</p></div>
              </div>
              <div class="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center text-secondary"><i class="fas fa-chart-area text-xs"></i></div>
                  <div><p class="text-sm font-medium text-slate-800 dark:text-white">Mirae Asset Emerging</p><p class="text-xs text-slate-500">Started Jan 2023</p></div>
                </div>
                <div class="text-right"><p class="text-sm font-bold text-slate-800 dark:text-white">₹3,000/mo</p><p class="text-xs text-emerald-500">+16.1% CAGR</p></div>
              </div>
              <div class="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center text-accent"><i class="fas fa-rocket text-xs"></i></div>
                  <div><p class="text-sm font-medium text-slate-800 dark:text-white">SBI Small Cap</p><p class="text-xs text-slate-500">Started Jun 2023</p></div>
                </div>
                <div class="text-right"><p class="text-sm font-bold text-slate-800 dark:text-white">₹2,500/mo</p><p class="text-xs text-emerald-500">+18.3% CAGR</p></div>
              </div>
            </div>
          </div>
        </div>
      </div>`;

    setTimeout(() => {
      const ctx = document.getElementById('port-alloc-chart');
      if (ctx && window.Chart) {
        const wrap = ctx.parentElement;
        if (wrap && wrap.clientWidth > 0 && wrap.clientHeight > 0) {
          ctx.width = wrap.clientWidth;
          ctx.height = wrap.clientHeight;
        }
        App.charts.portfolio = new Chart(ctx.getContext('2d'), {
          type: 'doughnut',
          data: {
            labels: ['Equity 35%','Debt 28%','Real Estate 25%','Gold 7%','Cash 5%'],
            datasets: [{
              data: [35,28,25,7,5],
              backgroundColor: ['#0f766e','#14b8a6','#f59e0b','#ef4444','#94a3b8'],
              borderWidth: 2,
              borderColor: isDark() ? '#1e293b' : '#ffffff'
            }]
          },
          options: {
            responsive: false,
            maintainAspectRatio: false,
            animation: { duration: 0 },
            cutout: '65%',
            plugins: { legend: { position: 'bottom', labels: { color: textColor(), boxWidth: 10 } } }
          }
        });
      }
    }, 100);
  }

  // ===================== ASSETS =====================
  function renderAssets(container) {
    if (!container) container = document.getElementById('main-content');
    destroyCharts();
    container.innerHTML = `
      <div class="space-y-6 pb-8">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold text-slate-800 dark:text-white">Assets</h2>
            <p class="text-sm text-slate-500 dark:text-slate-400">Complete view of your wealth</p>
          </div>
          <button class="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90"><i class="fas fa-plus mr-1"></i>Add Asset</button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-white dark:bg-dark-light rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center text-primary"><i class="fas fa-building-columns text-sm"></i></div>
              <span class="text-sm font-medium text-slate-700 dark:text-slate-200">Bank Accounts</span>
            </div>
            <p class="text-xl font-bold text-slate-800 dark:text-white">${C(850000)}</p>
            <p class="text-xs text-slate-400 mt-1">3 accounts</p>
          </div>
          <div class="bg-white dark:bg-dark-light rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-9 h-9 bg-secondary/10 rounded-lg flex items-center justify-center text-secondary"><i class="fas fa-chart-pie text-sm"></i></div>
              <span class="text-sm font-medium text-slate-700 dark:text-slate-200">Investments</span>
            </div>
            <p class="text-xl font-bold text-slate-800 dark:text-white">${C(2130000)}</p>
            <p class="text-xs text-slate-400 mt-1">5 instruments</p>
          </div>
          <div class="bg-white dark:bg-dark-light rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-9 h-9 bg-accent/10 rounded-lg flex items-center justify-center text-accent"><i class="fas fa-gem text-sm"></i></div>
              <span class="text-sm font-medium text-slate-700 dark:text-slate-200">Physical Assets</span>
            </div>
            <p class="text-xl font-bold text-slate-800 dark:text-white">${C(1540000)}</p>
            <p class="text-xs text-slate-400 mt-1">Property, gold, vehicle</p>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="bg-white dark:bg-dark-light rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5">
            <h3 class="font-semibold text-slate-800 dark:text-white mb-4">Asset Breakdown</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="relative h-64"><canvas id="assets-chart"></canvas></div>
              <div class="space-y-3">
                <div class="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"><span class="text-sm text-slate-700 dark:text-slate-200">SBI Savings</span><span class="font-bold text-slate-800 dark:text-white">${C(450000)}</span></div>
                <div class="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"><span class="text-sm text-slate-700 dark:text-slate-200">HDFC Savings</span><span class="font-bold text-slate-800 dark:text-white">${C(120000)}</span></div>
                <div class="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"><span class="text-sm text-slate-700 dark:text-slate-200">Equity Mutual Funds</span><span class="font-bold text-slate-800 dark:text-white">${C(650000)}</span></div>
                <div class="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"><span class="text-sm text-slate-700 dark:text-slate-200">Apartment</span><span class="font-bold text-slate-800 dark:text-white">${C(4500000)}</span></div>
              </div>
            </div>
          </div>
          <div class="bg-white dark:bg-dark-light rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5">
            <div id="assets-physical-panel"></div>
          </div>
        </div>
      </div>`;

    setTimeout(() => {
      const ctx = document.getElementById('assets-chart');
      if (ctx && window.Chart) {
        const wrap = ctx.parentElement;
        if (wrap && wrap.clientWidth > 0 && wrap.clientHeight > 0) {
          ctx.width = wrap.clientWidth;
          ctx.height = wrap.clientHeight;
        }
        App.charts.assets = new Chart(ctx.getContext('2d'), {
          type: 'bar',
          data: {
            labels: ['Bank','Investments','Property','Gold','Vehicle'],
            datasets: [{
              label: 'Value (₹L)',
              data: [8.5, 21.3, 45, 3.8, 6.5],
              backgroundColor: ['#0f766e','#14b8a6','#f59e0b','#ef4444','#8b5cf6'],
              borderRadius: 6
            }]
          },
          options: {
            responsive: false,
            maintainAspectRatio: false,
            animation: { duration: 0 },
            plugins: { legend: { display: false } },
            scales: {
              y: { grid: { color: gridColor() }, ticks: { color: textColor() } },
              x: { grid: { display: false }, ticks: { color: textColor() } }
            }
          }
        });
      }
      const paPanel = document.getElementById('assets-physical-panel');
      if (paPanel && window.PhysicalAssets) PhysicalAssets.renderManager(paPanel);
    }, 100);
  }

  // ===================== MARKET =====================
  function renderMarket(container) {
    if (!container) container = document.getElementById('main-content');
    destroyCharts();
    const indicators = [
      { name: 'NIFTY 50', value: '22,450', change: 1.2, trend: 'up', color: 'emerald' },
      { name: 'Repo Rate', value: '6.50%', change: -0.25, trend: 'down', color: 'emerald' },
      { name: 'CPI Inflation', value: '4.85%', change: -0.15, trend: 'down', color: 'emerald' },
      { name: 'USD/INR', value: '83.12', change: 0.3, trend: 'up', color: 'rose' },
      { name: 'Gold (10g)', value: '₹71,250', change: 2.1, trend: 'up', color: 'amber' },
      { name: '10Y G-Sec', value: '7.12%', change: -0.05, trend: 'down', color: 'emerald' }
    ];

    container.innerHTML = `
      <div class="space-y-6 pb-8">
        <div>
          <h2 class="text-2xl font-bold text-slate-800 dark:text-white">Market Trends</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400">Live market indicators and macro trends</p>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          ${indicators.map(i => `
            <div class="bg-white dark:bg-dark-light rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-4 text-center">
              <p class="text-xs text-slate-500 mb-1">${i.name}</p>
              <p class="text-lg font-bold text-slate-800 dark:text-white">${i.value}</p>
              <p class="text-xs ${i.change > 0 ? 'text-emerald-500' : 'text-emerald-500'} mt-1">
                <i class="fas fa-arrow-${i.change > 0 ? 'up' : 'down'} mr-0.5"></i>${Math.abs(i.change)}%
              </p>
            </div>
          `).join('')}
        </div>

        <div class="bg-white dark:bg-dark-light rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5">
          <h3 class="font-semibold text-slate-800 dark:text-white mb-4">NIFTY 50 Trend</h3>
          <div class="relative h-72"><canvas id="market-chart"></canvas></div>
        </div>

        <div class="bg-white dark:bg-dark-light rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5">
          <h3 class="font-semibold text-slate-800 dark:text-white mb-3">Market News</h3>
          <div class="space-y-3">
            <div class="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <span class="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded">POSITIVE</span>
              <p class="text-sm text-slate-700 dark:text-slate-200">RBI maintains accommodative stance on liquidity</p>
            </div>
            <div class="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <span class="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded">POSITIVE</span>
              <p class="text-sm text-slate-700 dark:text-slate-200">US Fed signals potential rate cuts in Q3</p>
            </div>
            <div class="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <span class="px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold rounded">NEUTRAL</span>
              <p class="text-sm text-slate-700 dark:text-slate-200">Gold prices surge on geopolitical tensions</p>
            </div>
          </div>
        </div>
      </div>`;

    setTimeout(() => {
      const ctx = document.getElementById('market-chart');
      if (ctx && window.Chart) {
        const wrap = ctx.parentElement;
        if (wrap && wrap.clientWidth > 0 && wrap.clientHeight > 0) {
          ctx.width = wrap.clientWidth;
          ctx.height = wrap.clientHeight;
        }
        App.charts.market = new Chart(ctx.getContext('2d'), {
          type: 'line',
          data: {
            labels: ['Mon','Tue','Wed','Thu','Fri'],
            datasets: [{
              label: 'NIFTY 50',
              data: [22100, 22250, 22180, 22300, 22450],
              borderColor: '#0f766e',
              backgroundColor: 'rgba(15,118,110,0.06)',
              fill: true,
              tension: 0.3,
              pointRadius: 4
            }]
          },
          options: {
            responsive: false,
            maintainAspectRatio: false,
            animation: { duration: 0 },
            plugins: { legend: { display: false } },
            scales: {
              y: { grid: { color: gridColor() }, ticks: { color: textColor() } },
              x: { grid: { display: false }, ticks: { color: textColor() } }
            }
          }
        });
      }
    }, 100);
  }

  // ===================== PROTECTION =====================
  function renderProtection(container) {
    if (!container) container = document.getElementById('main-content');
    destroyCharts();
    container.innerHTML = `
      <div class="space-y-6 pb-8">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold text-slate-800 dark:text-white">Protection Center</h2>
            <p class="text-sm text-slate-500 dark:text-slate-400">Cyber-fraud protection for all wealth actions</p>
          </div>
          <div class="px-3 py-1.5 bg-emerald-500/10 text-emerald-500 text-xs font-medium rounded-full"><i class="fas fa-shield-halved mr-1"></i>All Systems Active</div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-5 text-white">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center"><i class="fas fa-shield-halved"></i></div>
              <div><p class="text-sm text-slate-300">Protection Score</p><p class="text-2xl font-bold">94/100</p></div>
            </div>
            <p class="text-xs text-slate-400">All 6 security checks passed in last review</p>
          </div>
          <div class="bg-white dark:bg-dark-light rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-500"><i class="fas fa-mobile-screen-button"></i></div>
              <div><p class="text-sm text-slate-500">Device Trust</p><p class="text-lg font-bold text-slate-800 dark:text-white">Trusted</p></div>
            </div>
            <p class="text-xs text-slate-400">Current device recognized</p>
          </div>
          <div class="bg-white dark:bg-dark-light rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary"><i class="fas fa-clock-rotate-left"></i></div>
              <div><p class="text-sm text-slate-500">Last Check</p><p class="text-lg font-bold text-slate-800 dark:text-white">2 min ago</p></div>
            </div>
            <p class="text-xs text-slate-400">Auto-scan every transaction</p>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="bg-white dark:bg-dark-light rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5">
            <h3 class="font-semibold text-slate-800 dark:text-white mb-4">6-Signal Risk Engine</h3>
            <div id="protection-checks-list" class="space-y-3"></div>
          </div>
          <div class="bg-white dark:bg-dark-light rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5">
            <h3 class="font-semibold text-slate-800 dark:text-white mb-4">Simulate Risk Scenarios</h3>
            <div class="space-y-3">
              <button onclick="DemoControls.state.deviceTrust=false; DemoControls.state.highUrgency=false; DemoControls.state.otpSpeed=4.0; DemoControls.render(); RiskEngine.protect('large-transfer', 500000, () => { NudgeEngine.show('Transfer approved after review', 'success'); })" class="w-full text-left p-4 bg-slate-50 dark:bg-slate-800 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-colors">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <i class="fas fa-triangle-exclamation text-amber-500"></i>
                    <div><p class="text-sm font-medium text-slate-800 dark:text-white">Large Transfer</p><p class="text-xs text-slate-500">Simulate ₹5L transfer from new device</p></div>
                  </div>
                  <i class="fas fa-chevron-right text-slate-400 text-xs"></i>
                </div>
              </button>
              <button onclick="DemoControls.state.deviceTrust=true; DemoControls.state.highUrgency=true; DemoControls.state.newSession=true; DemoControls.state.otpSpeed=1.5; DemoControls.render(); RiskEngine.protect('rushed-action', 50000, () => { NudgeEngine.show('Action approved', 'success'); })" class="w-full text-left p-4 bg-slate-50 dark:bg-slate-800 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <i class="fas fa-bolt text-rose-500"></i>
                    <div><p class="text-sm font-medium text-slate-800 dark:text-white">Rushed Action</p><p class="text-xs text-slate-500">High urgency + fast OTP + new session</p></div>
                  </div>
                  <i class="fas fa-chevron-right text-slate-400 text-xs"></i>
                </div>
              </button>
            </div>
          </div>
        </div>
        <!-- Threat Intelligence Feed -->
        <div class="bg-white dark:bg-dark-light rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5">
          <div class="flex items-center justify-between mb-3">
            <h3 class="font-semibold text-slate-800 dark:text-white text-sm"><i class="fas fa-tower-broadcast text-rose-500 mr-2"></i>Active Threat Intelligence</h3>
            <span class="text-[10px] px-2 py-0.5 bg-rose-100 text-rose-600 rounded font-medium animate-pulse">Live</span>
          </div>
          <div id="threat-intel-feed-protection"></div>
        </div>
      </div>`;

    setTimeout(() => {
      const checksContainer = document.getElementById('protection-checks-list');
      if (checksContainer && window.ProtectionCenter) {
        // If we have a last risk assessment, display it instead of defaults
        const lastAssessment = JSON.parse(localStorage.getItem('sw_last_risk_assessment') || 'null');
        if (lastAssessment && lastAssessment.signals && lastAssessment.signals.length === 6) {
          checksContainer.innerHTML = lastAssessment.signals.map(s => `
            <div class="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border ${s.status === 'passed' ? 'border-emerald-100 dark:border-emerald-800' : s.status === 'flagged' ? 'border-amber-100 dark:border-amber-800' : 'border-red-100 dark:border-red-800'}">
              <div class="flex items-center gap-2">
                <i class="fas ${s.status === 'passed' ? 'fa-check-circle text-emerald-500' : s.status === 'flagged' ? 'fa-exclamation-circle text-amber-500' : 'fa-times-circle text-danger'}"></i>
                <span class="text-xs font-medium text-slate-700 dark:text-slate-200">${s.name}</span>
              </div>
              <span class="text-xs text-slate-500">${s.desc}</span>
            </div>
          `).join('');
        } else {
          ProtectionCenter.renderChecks(checksContainer);
        }
      }
      const tiContainer = document.getElementById('threat-intel-feed-protection');
      if (tiContainer && window.ThreatIntel) {
        const alert = ThreatIntel.alerts[ThreatIntel.currentIndex];
        const colorMap = { amber: 'text-amber-600 bg-amber-50 border-amber-100 dark:bg-amber-900/20 dark:border-amber-800', rose: 'text-rose-600 bg-rose-50 border-rose-100 dark:bg-rose-900/20 dark:border-rose-800' };
        tiContainer.innerHTML = `
          <div class="flex items-start gap-2 p-2.5 rounded-lg border ${colorMap[alert.color]} transition-all duration-500">
            <i class="fas ${alert.icon} mt-0.5 text-xs flex-shrink-0"></i>
            <div class="flex-1">
              <p class="text-[11px] leading-relaxed">${alert.text}</p>
              <button onclick="ThreatIntel.showDetail(${ThreatIntel.currentIndex})" class="text-[10px] text-primary hover:underline mt-1">Learn more</button>
            </div>
          </div>
          <div class="flex justify-center gap-1 mt-1.5">
            ${ThreatIntel.alerts.map((_, i) => `<div class="w-1 h-1 rounded-full ${i === ThreatIntel.currentIndex ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-600'}"></div>`).join('')}
          </div>
        `;
      }
    }, 100);
  }

  // ===================== TAX =====================
  function renderTax(container) {
    if (!container) container = document.getElementById('main-content');
    destroyCharts();
    container.innerHTML = `
      <div class="space-y-6 pb-8">
        <div>
          <h2 class="text-2xl font-bold text-slate-800 dark:text-white">Tax Savings</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400">Optimize your tax liability</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="bg-white dark:bg-dark-light rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5 text-center">
            <p class="text-xs text-slate-500 mb-1">Total Tax Saved</p>
            <p class="text-2xl font-bold text-emerald-500">₹1,85,000</p>
          </div>
          <div class="bg-white dark:bg-dark-light rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5 text-center">
            <p class="text-xs text-slate-500 mb-1">80C Remaining</p>
            <p class="text-2xl font-bold text-amber-500">₹50,000</p>
          </div>
          <div class="bg-white dark:bg-dark-light rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5 text-center">
            <p class="text-xs text-slate-500 mb-1">80D Used</p>
            <p class="text-2xl font-bold text-primary">₹15,000</p>
          </div>
          <div class="bg-white dark:bg-dark-light rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5 text-center">
            <p class="text-xs text-slate-500 mb-1">NPS (80CCD)</p>
            <p class="text-2xl font-bold text-secondary">₹20,000</p>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="bg-white dark:bg-dark-light rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5">
            <h3 class="font-semibold text-slate-800 dark:text-white mb-4">Section Breakdown</h3>
            <div class="relative h-64"><canvas id="tax-chart"></canvas></div>
          </div>
          <div class="bg-white dark:bg-dark-light rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5">
            <h3 class="font-semibold text-slate-800 dark:text-white mb-4">Recommendations</h3>
            <div class="space-y-3">
              <div class="p-3 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg border border-emerald-100 dark:border-emerald-500/20">
                <div class="flex items-start gap-2">
                  <i class="fas fa-check-circle text-emerald-500 mt-0.5"></i>
                  <div><p class="text-sm font-medium text-slate-800 dark:text-white">Invest ₹50,000 in ELSS</p><p class="text-xs text-slate-500">Save ~₹15,600 in taxes under 80C</p></div>
                </div>
              </div>
              <div class="p-3 bg-primary/5 dark:bg-primary/10 rounded-lg border border-primary/10">
                <div class="flex items-start gap-2">
                  <i class="fas fa-lightbulb text-primary mt-0.5"></i>
                  <div><p class="text-sm font-medium text-slate-800 dark:text-white">NPS Tier 1 Top-up</p><p class="text-xs text-slate-500">Invest ₹30,000 more for additional 80CCD(1B) benefit</p></div>
                </div>
              </div>
              <div class="p-3 bg-amber-50 dark:bg-amber-500/10 rounded-lg border border-amber-100 dark:border-amber-500/20">
                <div class="flex items-start gap-2">
                  <i class="fas fa-triangle-exclamation text-amber-500 mt-0.5"></i>
                  <div><p class="text-sm font-medium text-slate-800 dark:text-white">Health Insurance Upgrade</p><p class="text-xs text-slate-500">Increase coverage to claim full 80D benefit</p></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>`;

    setTimeout(() => {
      const ctx = document.getElementById('tax-chart');
      if (ctx && window.Chart) {
        const wrap = ctx.parentElement;
        if (wrap && wrap.clientWidth > 0 && wrap.clientHeight > 0) {
          ctx.width = wrap.clientWidth;
          ctx.height = wrap.clientHeight;
        }
        App.charts.tax = new Chart(ctx.getContext('2d'), {
          type: 'doughnut',
          data: {
            labels: ['80C ₹1L','80D ₹15K','80CCD ₹20K','Others'],
            datasets: [{
              data: [100000,15000,20000,50000],
              backgroundColor: ['#0f766e','#14b8a6','#f59e0b','#94a3b8'],
              borderWidth: 2,
              borderColor: isDark() ? '#1e293b' : '#ffffff'
            }]
          },
          options: {
            responsive: false,
            maintainAspectRatio: false,
            animation: { duration: 0 },
            cutout: '60%',
            plugins: { legend: { position: 'right', labels: { color: textColor(), boxWidth: 10 } } }
          }
        });
      }
    }, 100);
  }

  // ===================== PRIVACY HELPERS =====================
  function getPrivacySettings() {
    const raw = localStorage.getItem('sw_privacy_settings');
    if (raw) return JSON.parse(raw);
    return {
      aiInsights: true,
      marketing: false,
      dataAnalytics: true,
      locationServices: true,
      biometricAuth: true,
      accountAggregator: true,
      behavioralNudges: true,
      crossSell: false
    };
  }
  function setPrivacySetting(key, value) {
    const s = getPrivacySettings();
    s[key] = value;
    localStorage.setItem('sw_privacy_settings', JSON.stringify(s));
    logConsentActivity(key, value ? 'enabled' : 'disabled');
  }
  function logConsentActivity(action, detail) {
    const logs = JSON.parse(localStorage.getItem('sw_consent_log') || '[]');
    logs.unshift({ time: new Date().toISOString(), action, detail });
    if (logs.length > 50) logs.pop();
    localStorage.setItem('sw_consent_log', JSON.stringify(logs));
  }
  function initConsentLogDefaults() {
    if (!localStorage.getItem('sw_consent_log')) {
      logConsentActivity('Account Created', 'User onboarded with default consent preferences');
      logConsentActivity('KYC Verified', 'Identity verified via Aadhaar eKYC on 15 Jan 2024');
      logConsentActivity('Account Aggregator', 'Linked HDFC Bank, SBI, ICICI Bank via RBI AA framework');
      logConsentActivity('Encryption Enabled', 'AES-256 encryption activated for all financial data');
    }
  }
  function exportUserData() {
    const payload = {
      profile: { name: 'Rahul Sharma', email: 'rahul.s@example.com', kycStatus: 'Verified', kycDate: '2024-01-15' },
      accounts: WealthEngine.assets.bankAccounts,
      investments: WealthEngine.assets.investments,
      physicalAssets: WealthEngine.assets.physical,
      goals: WealthEngine.goals,
      transactions: WealthEngine.spending.history,
      privacySettings: getPrivacySettings(),
      exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'securewealth-my-data.json';
    a.click();
    logConsentActivity('Data Export', 'User downloaded full data archive');
    App.showToast('Your data has been exported', 'success');
  }
  function deleteUserData() {
    if (confirm('This will simulate deletion of all personal data. In production, this initiates a 30-day grace period. Proceed?')) {
      logConsentActivity('Data Deletion', 'User requested account data deletion');
      App.showToast('Data deletion request submitted. You have 30 days to cancel.', 'info');
    }
  }

  // ===================== PRIVACY =====================
  function renderPrivacy(container) {
    if (!container) container = document.getElementById('main-content');
    destroyCharts();
    initConsentLogDefaults();
    const settings = getPrivacySettings();
    const logs = JSON.parse(localStorage.getItem('sw_consent_log') || '[]');
    const enabledCount = Object.values(settings).filter(Boolean).length;
    const totalCount = Object.keys(settings).length;
    const privacyScore = Math.round((enabledCount / totalCount) * 100);

    function toggleHtml(key, enabled) {
      const activeCls = enabled ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-600';
      const dotCls = enabled ? 'right-1' : 'left-1';
      return `<label class="relative inline-flex items-center cursor-pointer" onclick="event.preventDefault();window._togglePrivacy('${key}')">
        <div class="w-11 h-6 ${activeCls} rounded-full relative transition-colors"><div class="w-4 h-4 bg-white rounded-full absolute ${dotCls} top-1 transition-all"></div></div>
      </label>`;
    }

    container.innerHTML = `
      <div class="space-y-6 pb-8">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold text-slate-800 dark:text-white">Privacy & Consent Center</h2>
            <p class="text-sm text-slate-500 dark:text-slate-400">Manage your data, permissions, and digital rights</p>
          </div>
          <div class="flex items-center gap-3">
            <div class="text-center">
              <div class="w-14 h-14 rounded-full border-4 ${privacyScore >= 80 ? 'border-emerald-500' : privacyScore >= 50 ? 'border-amber-400' : 'border-rose-400'} flex items-center justify-center mx-auto">
                <span class="text-lg font-bold ${privacyScore >= 80 ? 'text-emerald-600' : privacyScore >= 50 ? 'text-amber-600' : 'text-rose-600'}">${privacyScore}</span>
              </div>
              <p class="text-[10px] text-slate-500 mt-1">Privacy Score</p>
            </div>
          </div>
        </div>

        <!-- Security Status Cards -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4 text-center">
            <i class="fas fa-lock text-emerald-500 text-xl mb-2"></i>
            <p class="text-xs font-medium text-slate-800 dark:text-white">AES-256 Encryption</p>
            <p class="text-[10px] text-slate-500 mt-1">At rest & in transit</p>
          </div>
          <div class="bg-primary/5 border border-primary/20 rounded-xl p-4 text-center">
            <i class="fas fa-user-shield text-primary text-xl mb-2"></i>
            <p class="text-xs font-medium text-slate-800 dark:text-white">KYC Verified</p>
            <p class="text-[10px] text-slate-500 mt-1">Aadhaar eKYC · 15 Jan 2024</p>
          </div>
          <div class="bg-secondary/5 border border-secondary/20 rounded-xl p-4 text-center">
            <i class="fas fa-eye-slash text-secondary text-xl mb-2"></i>
            <p class="text-xs font-medium text-slate-800 dark:text-white">No Third-Party Sharing</p>
            <p class="text-[10px] text-slate-500 mt-1">Data stays within bank</p>
          </div>
          <div class="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 text-center">
            <i class="fas fa-shield-halved text-amber-500 text-xl mb-2"></i>
            <p class="text-xs font-medium text-slate-800 dark:text-white">DPDP Act 2023</p>
            <p class="text-[10px] text-slate-500 mt-1">Fully compliant</p>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Data Permissions Dashboard -->
          <div class="lg:col-span-2 space-y-6">
            <div class="bg-white dark:bg-dark-light rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5">
              <div class="flex items-center justify-between mb-4">
                <h3 class="font-semibold text-slate-800 dark:text-white"><i class="fas fa-sliders-h text-primary mr-2"></i>Data Permissions Dashboard</h3>
                <span class="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">${enabledCount}/${totalCount} Active</span>
              </div>
              <div class="space-y-1">
                <div class="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-700">
                  <div><p class="text-sm font-medium text-slate-800 dark:text-white">AI-Powered Insights</p><p class="text-xs text-slate-500">Allow Wealth Twin AI to analyze spending patterns</p></div>
                  ${toggleHtml('aiInsights', settings.aiInsights)}
                </div>
                <div class="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-700">
                  <div><p class="text-sm font-medium text-slate-800 dark:text-white">Marketing Communications</p><p class="text-xs text-slate-500">Product offers, updates, and newsletters</p></div>
                  ${toggleHtml('marketing', settings.marketing)}
                </div>
                <div class="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-700">
                  <div><p class="text-sm font-medium text-slate-800 dark:text-white">Data Analytics</p><p class="text-xs text-slate-500">Anonymized usage for product improvement</p></div>
                  ${toggleHtml('dataAnalytics', settings.dataAnalytics)}
                </div>
                <div class="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-700">
                  <div><p class="text-sm font-medium text-slate-800 dark:text-white">Location Services</p><p class="text-xs text-slate-500">Fraud detection & branch recommendations</p></div>
                  ${toggleHtml('locationServices', settings.locationServices)}
                </div>
                <div class="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-700">
                  <div><p class="text-sm font-medium text-slate-800 dark:text-white">Biometric Authentication</p><p class="text-xs text-slate-500">Face ID / Fingerprint for high-value actions</p></div>
                  ${toggleHtml('biometricAuth', settings.biometricAuth)}
                </div>
                <div class="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-700">
                  <div><p class="text-sm font-medium text-slate-800 dark:text-white">Account Aggregator</p><p class="text-xs text-slate-500">Link external bank accounts via RBI AA</p></div>
                  ${toggleHtml('accountAggregator', settings.accountAggregator)}
                </div>
                <div class="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-700">
                  <div><p class="text-sm font-medium text-slate-800 dark:text-white">Behavioral Nudges</p><p class="text-xs text-slate-500">Smart savings reminders & goal prompts</p></div>
                  ${toggleHtml('behavioralNudges', settings.behavioralNudges)}
                </div>
                <div class="flex items-center justify-between py-3">
                  <div><p class="text-sm font-medium text-slate-800 dark:text-white">Cross-Sell Offers</p><p class="text-xs text-slate-500">Insurance, loans, and credit card offers</p></div>
                  ${toggleHtml('crossSell', settings.crossSell)}
                </div>
              </div>
            </div>

            <!-- Data Usage Transparency -->
            <div class="bg-white dark:bg-dark-light rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5">
              <h3 class="font-semibold text-slate-800 dark:text-white mb-4"><i class="fas fa-table-list text-secondary mr-2"></i>Data Usage Transparency</h3>
              <div class="overflow-x-auto">
                <table class="w-full text-sm">
                  <thead>
                    <tr class="text-left text-slate-500 border-b border-slate-100 dark:border-slate-700">
                      <th class="pb-2 font-medium">Data Type</th>
                      <th class="pb-2 font-medium">Purpose</th>
                      <th class="pb-2 font-medium">Shared With</th>
                      <th class="pb-2 font-medium">Retention</th>
                    </tr>
                  </thead>
                  <tbody class="text-slate-700 dark:text-slate-300">
                    <tr class="border-b border-slate-50 dark:border-slate-800"><td class="py-2 font-medium">Transaction History</td><td class="py-2">AI insights, fraud detection</td><td class="py-2"><span class="text-emerald-600 font-medium">No one</span></td><td class="py-2">7 years</td></tr>
                    <tr class="border-b border-slate-50 dark:border-slate-800"><td class="py-2 font-medium">Account Balances</td><td class="py-2">Net worth tracking, goal planning</td><td class="py-2"><span class="text-emerald-600 font-medium">No one</span></td><td class="py-2">7 years</td></tr>
                    <tr class="border-b border-slate-50 dark:border-slate-800"><td class="py-2 font-medium">Device Info</td><td class="py-2">Security, risk scoring</td><td class="py-2"><span class="text-emerald-600 font-medium">No one</span></td><td class="py-2">2 years</td></tr>
                    <tr class="border-b border-slate-50 dark:border-slate-800"><td class="py-2 font-medium">Location</td><td class="py-2">Fraud detection (optional)</td><td class="py-2"><span class="text-emerald-600 font-medium">No one</span></td><td class="py-2">90 days</td></tr>
                    <tr><td class="py-2 font-medium">Behavioral Patterns</td><td class="py-2">Personalized nudges</td><td class="py-2"><span class="text-amber-600 font-medium">Anonymized only</span></td><td class="py-2">3 years</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- Right Column: Connected Apps, Rights, Log -->
          <div class="space-y-6">
            <!-- Connected Apps -->
            <div class="bg-white dark:bg-dark-light rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5">
              <div class="flex items-center justify-between mb-4">
                <h3 class="font-semibold text-slate-800 dark:text-white"><i class="fas fa-link text-primary mr-2"></i>Connected Apps</h3>
                <span class="text-xs px-2 py-1 bg-success/10 text-success rounded-full">3 Active</span>
              </div>
              <div class="space-y-3">
                <div class="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center"><i class="fas fa-university text-xs"></i></div>
                    <div><p class="text-sm font-medium text-slate-800 dark:text-white">HDFC Bank</p><p class="text-[10px] text-slate-500">Savings · Read-only</p></div>
                  </div>
                  <span class="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full">Active</span>
                </div>
                <div class="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center"><i class="fas fa-university text-xs"></i></div>
                    <div><p class="text-sm font-medium text-slate-800 dark:text-white">SBI</p><p class="text-[10px] text-slate-500">Savings · Read-only</p></div>
                  </div>
                  <span class="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full">Active</span>
                </div>
                <div class="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center"><i class="fas fa-university text-xs"></i></div>
                    <div><p class="text-sm font-medium text-slate-800 dark:text-white">ICICI Bank</p><p class="text-[10px] text-slate-500">Current · Read-only</p></div>
                  </div>
                  <span class="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full">Active</span>
                </div>
              </div>
              <button onclick="App.showToast('Account Aggregator linking demo', 'info')" class="w-full mt-3 py-2 border border-dashed border-slate-300 dark:border-slate-600 rounded-lg text-xs text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <i class="fas fa-plus mr-1"></i>Link Another Account
              </button>
            </div>

            <!-- Your Data Rights -->
            <div class="bg-white dark:bg-dark-light rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5">
              <h3 class="font-semibold text-slate-800 dark:text-white mb-4"><i class="fas fa-gavel text-amber-500 mr-2"></i>Your Data Rights</h3>
              <div class="space-y-3">
                <button onclick="window._exportUserData()" class="w-full flex items-center gap-3 p-3 rounded-lg bg-primary/5 hover:bg-primary/10 border border-primary/10 transition-colors text-left">
                  <div class="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center"><i class="fas fa-download text-xs"></i></div>
                  <div><p class="text-sm font-medium text-slate-800 dark:text-white">Download My Data</p><p class="text-[10px] text-slate-500">JSON export of all your information</p></div>
                </button>
                <button onclick="window._deleteUserData()" class="w-full flex items-center gap-3 p-3 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-900/10 dark:hover:bg-rose-900/20 border border-rose-100 dark:border-rose-900/30 transition-colors text-left">
                  <div class="w-8 h-8 bg-rose-100 text-rose-600 rounded-lg flex items-center justify-center"><i class="fas fa-trash-can text-xs"></i></div>
                  <div><p class="text-sm font-medium text-rose-700 dark:text-rose-300">Delete Account Data</p><p class="text-[10px] text-rose-500">Request full data erasure</p></div>
                </button>
              </div>
            </div>

            <!-- Consent Activity Log -->
            <div class="bg-white dark:bg-dark-light rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5">
              <h3 class="font-semibold text-slate-800 dark:text-white mb-4"><i class="fas fa-clock-rotate-left text-slate-400 mr-2"></i>Consent Activity Log</h3>
              <div class="space-y-3 max-h-64 overflow-y-auto">
                ${logs.slice(0, 8).map(l => {
                  const d = new Date(l.time);
                  const dateStr = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
                  const timeStr = d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
                  return `<div class="flex items-start gap-2 text-xs">
                    <div class="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0"></div>
                    <div>
                      <p class="text-slate-700 dark:text-slate-300 font-medium">${l.action}</p>
                      <p class="text-slate-400 text-[10px]">${l.detail}</p>
                      <p class="text-slate-400 text-[10px]">${dateStr} · ${timeStr}</p>
                    </div>
                  </div>`;
                }).join('')}
              </div>
            </div>
          </div>
        </div>

        <!-- Security Certifications -->
        <div class="bg-white dark:bg-dark-light rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5">
          <h3 class="font-semibold text-slate-800 dark:text-white mb-4"><i class="fas fa-certificate text-emerald-500 mr-2"></i>Security & Compliance Certifications</h3>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div class="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <i class="fas fa-globe text-blue-500 text-xl mb-2"></i>
              <p class="text-xs font-semibold text-slate-800 dark:text-white">ISO 27001</p>
              <p class="text-[10px] text-slate-500">Information Security</p>
            </div>
            <div class="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <i class="fas fa-server text-purple-500 text-xl mb-2"></i>
              <p class="text-xs font-semibold text-slate-800 dark:text-white">SOC 2 Type II</p>
              <p class="text-[10px] text-slate-500">Data Controls</p>
            </div>
            <div class="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <i class="fas fa-landmark text-amber-500 text-xl mb-2"></i>
              <p class="text-xs font-semibold text-slate-800 dark:text-white">RBI Regulated</p>
              <p class="text-[10px] text-slate-500">NBFC License</p>
            </div>
            <div class="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <i class="fas fa-fingerprint text-emerald-500 text-xl mb-2"></i>
              <p class="text-xs font-semibold text-slate-800 dark:text-white">DPDP Act 2023</p>
              <p class="text-[10px] text-slate-500">Data Protection</p>
            </div>
          </div>
        </div>
      </div>`;

    // Bind global helpers for inline onclick handlers
    window._togglePrivacy = function(key) {
      const s = getPrivacySettings();
      s[key] = !s[key];
      setPrivacySetting(key, s[key]);
      renderPrivacy(container);
    };
    window._exportUserData = exportUserData;
    window._deleteUserData = deleteUserData;
  }

  // ===================== CALCULATORS =====================
  function renderCalculators(container) {
    if (!container) container = document.getElementById('main-content');
    destroyCharts();
    container.innerHTML = `
      <div class="space-y-6 pb-8">
        <div>
          <h2 class="text-2xl font-bold text-slate-800 dark:text-white">Financial Calculators</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400">Plan your investments and loans</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-white dark:bg-dark-light rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5">
            <h3 class="font-semibold text-slate-800 dark:text-white mb-4"><i class="fas fa-chart-line text-primary mr-2"></i>SIP Step-up Calculator</h3>
            <div class="space-y-3">
              <div><label class="text-xs text-slate-500">Monthly SIP</label><input type="number" value="5000" class="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg text-sm"></div>
              <div><label class="text-xs text-slate-500">Annual Increase (%)</label><input type="number" value="10" class="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg text-sm"></div>
              <div><label class="text-xs text-slate-500">Years</label><input type="number" value="15" class="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg text-sm"></div>
              <button class="w-full py-2 bg-primary text-white rounded-lg text-sm font-medium">Calculate</button>
            </div>
            <div class="mt-4 p-3 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg">
              <p class="text-xs text-slate-500">Projected Corpus</p>
              <p class="text-xl font-bold text-emerald-500">₹45.2 Lakhs</p>
            </div>
          </div>

          <div class="bg-white dark:bg-dark-light rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5">
            <h3 class="font-semibold text-slate-800 dark:text-white mb-4"><i class="fas fa-house text-secondary mr-2"></i>EMI Calculator</h3>
            <div class="space-y-3">
              <div><label class="text-xs text-slate-500">Loan Amount</label><input type="number" value="3000000" class="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg text-sm"></div>
              <div><label class="text-xs text-slate-500">Interest Rate (%)</label><input type="number" value="8.5" class="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg text-sm"></div>
              <div><label class="text-xs text-slate-500">Tenure (Years)</label><input type="number" value="20" class="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg text-sm"></div>
              <button class="w-full py-2 bg-primary text-white rounded-lg text-sm font-medium">Calculate</button>
            </div>
            <div class="mt-4 p-3 bg-primary/5 dark:bg-primary/10 rounded-lg">
              <p class="text-xs text-slate-500">Monthly EMI</p>
              <p class="text-xl font-bold text-primary">₹26,036</p>
            </div>
          </div>

          <div class="bg-white dark:bg-dark-light rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5">
            <h3 class="font-semibold text-slate-800 dark:text-white mb-4"><i class="fas fa-umbrella-beach text-accent mr-2"></i>Retirement Corpus</h3>
            <div class="space-y-3">
              <div><label class="text-xs text-slate-500">Current Age</label><input type="number" value="32" class="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg text-sm"></div>
              <div><label class="text-xs text-slate-500">Retirement Age</label><input type="number" value="60" class="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg text-sm"></div>
              <div><label class="text-xs text-slate-500">Monthly Expenses</label><input type="number" value="72000" class="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg text-sm"></div>
              <button class="w-full py-2 bg-primary text-white rounded-lg text-sm font-medium">Calculate</button>
            </div>
            <div class="mt-4 p-3 bg-amber-50 dark:bg-amber-500/10 rounded-lg">
              <p class="text-xs text-slate-500">Required Corpus</p>
              <p class="text-xl font-bold text-amber-500">₹5.2 Crores</p>
            </div>
          </div>

          <div class="bg-white dark:bg-dark-light rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5">
            <h3 class="font-semibold text-slate-800 dark:text-white mb-4"><i class="fas fa-credit-card text-rose-500 mr-2"></i>CIBIL Score Simulator</h3>
            <div class="space-y-3">
              <div><label class="text-xs text-slate-500">Payment History (0-100)</label><input type="range" min="0" max="100" value="90" class="w-full mt-1"></div>
              <div><label class="text-xs text-slate-500">Credit Utilization (0-100)</label><input type="range" min="0" max="100" value="30" class="w-full mt-1"></div>
              <div><label class="text-xs text-slate-500">Credit Age (0-100)</label><input type="range" min="0" max="100" value="60" class="w-full mt-1"></div>
              <button class="w-full py-2 bg-primary text-white rounded-lg text-sm font-medium">Simulate</button>
            </div>
            <div class="mt-4 p-3 bg-secondary/5 dark:bg-secondary/10 rounded-lg text-center">
              <p class="text-xs text-slate-500">Predicted Score</p>
              <p class="text-xl font-bold text-secondary">785</p>
              <p class="text-xs text-emerald-500">Good</p>
            </div>
          </div>
        </div>
      </div>`;
  }

  // ===================== TRANSACTIONS =====================
  function renderTransactions(container) {
    if (!container) container = document.getElementById('main-content');
    destroyCharts();
    const txns = [
      { date: '18 Apr 2025', desc: 'Axis Bluechip SIP', amount: 5000, type: 'debit', category: 'Investment', risk: 'Low' },
      { date: '17 Apr 2025', desc: 'Salary Credit', amount: 125000, type: 'credit', category: 'Income', risk: 'Low' },
      { date: '16 Apr 2025', desc: 'Swiggy Order', amount: 450, type: 'debit', category: 'Food', risk: 'Low' },
      { date: '15 Apr 2025', desc: 'Electricity Bill', amount: 2800, type: 'debit', category: 'Utilities', risk: 'Low' },
      { date: '14 Apr 2025', desc: 'Mutual Fund Lump Sum', amount: 25000, type: 'debit', category: 'Investment', risk: 'Medium' },
      { date: '13 Apr 2025', desc: 'Amazon Purchase', amount: 3200, type: 'debit', category: 'Shopping', risk: 'Low' },
      { date: '12 Apr 2025', desc: 'Rent Payment', amount: 25000, type: 'debit', category: 'Housing', risk: 'Low' },
    ];

    container.innerHTML = `
      <div class="space-y-6 pb-8">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold text-slate-800 dark:text-white">Transactions</h2>
            <p class="text-sm text-slate-500 dark:text-slate-400">Recent activity with AI fraud analysis</p>
          </div>
          <div class="flex gap-2">
            <button class="px-3 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm rounded-lg">Filter</button>
            <button class="px-3 py-2 bg-primary text-white text-sm rounded-lg">Export</button>
          </div>
        </div>

        <div class="bg-white dark:bg-dark-light rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="text-left text-slate-500 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                  <th class="px-5 py-3 font-medium">Date</th>
                  <th class="px-5 py-3 font-medium">Description</th>
                  <th class="px-5 py-3 font-medium">Category</th>
                  <th class="px-5 py-3 font-medium text-right">Amount</th>
                  <th class="px-5 py-3 font-medium text-center">Risk</th>
                </tr>
              </thead>
              <tbody>
                ${txns.map(t => `
                  <tr class="border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td class="px-5 py-3 text-slate-500">${t.date}</td>
                    <td class="px-5 py-3 font-medium text-slate-800 dark:text-white">${t.desc}</td>
                    <td class="px-5 py-3"><span class="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs rounded">${t.category}</span></td>
                    <td class="px-5 py-3 text-right font-medium ${t.type === 'credit' ? 'text-emerald-500' : 'text-slate-800 dark:text-white'}">${t.type === 'credit' ? '+' : '-'}${C(t.amount)}</td>
                    <td class="px-5 py-3 text-center"><span class="px-2 py-0.5 ${t.risk === 'Low' ? 'bg-emerald-100 text-emerald-700' : t.risk === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'} text-xs rounded-full font-medium">${t.risk}</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>`;
  }

  // ===================== FORECAST SIMULATOR =====================
  function renderForecast(container) {
    if (!container) container = document.getElementById('main-content');
    destroyCharts();
    container.innerHTML = `
      <div class="space-y-6 pb-8">
        <div>
          <h2 class="text-2xl font-bold text-slate-800 dark:text-white">Twin Forecast</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400">Interactive scenario simulator — see your wealth future</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Controls -->
          <div class="bg-white dark:bg-dark-light rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5 space-y-5">
            <h3 class="font-semibold text-slate-800 dark:text-white">Scenario Controls</h3>
            
            <div>
              <label class="text-xs font-medium text-slate-600 dark:text-slate-300">Monthly Savings: <span id="fc-savings-val" class="text-primary font-bold">₹25,000</span></label>
              <input type="range" id="fc-savings" min="5000" max="100000" step="5000" value="25000" class="w-full mt-2 accent-primary h-1.5">
            </div>
            
            <div>
              <label class="text-xs font-medium text-slate-600 dark:text-slate-300">Market Scenario</label>
              <select id="fc-scenario" class="w-full mt-1 px-2 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded text-xs focus:outline-none focus:ring-1 focus:ring-primary dark:text-white">
                <option value="0.15">Bullish (+15% annual)</option>
                <option value="0.10" selected>Normal (+10% annual)</option>
                <option value="0.03">Bearish (+3% annual)</option>
              </select>
            </div>
            
            <div class="flex items-center gap-2">
              <input type="checkbox" id="fc-inflation" class="accent-primary w-4 h-4">
              <label for="fc-inflation" class="text-xs text-slate-600 dark:text-slate-300">Include Inflation (6%)</label>
            </div>
            
            <button id="fc-run-btn" class="w-full py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors">
              <i class="fas fa-play mr-1"></i>Run Simulation
            </button>
            
            <div id="fc-insights" class="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-700">
              <p class="text-xs text-slate-400">Adjust controls and click Run to see projections.</p>
            </div>
          </div>

          <!-- Chart -->
          <div class="lg:col-span-2 bg-white dark:bg-dark-light rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5">
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-semibold text-slate-800 dark:text-white">20-Year Wealth Projection</h3>
              <div class="flex gap-3 text-[10px]">
                <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-primary"></span>Base</span>
                <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-emerald-400"></span>Optimistic</span>
                <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-amber-400"></span>Conservative</span>
              </div>
            </div>
            <div class="relative" style="height:20rem">
              <canvas id="forecast-chart"></canvas>
            </div>
          </div>
        </div>
      </div>`;

    setTimeout(() => {
      initForecastChart(25000, 0.10, false);
      
      const savingsSlider = document.getElementById('fc-savings');
      const savingsVal = document.getElementById('fc-savings-val');
      const scenarioSelect = document.getElementById('fc-scenario');
      const inflationCheck = document.getElementById('fc-inflation');
      const runBtn = document.getElementById('fc-run-btn');
      
      if (savingsSlider && savingsVal) {
        savingsSlider.oninput = () => { savingsVal.textContent = C(parseInt(savingsSlider.value)); };
      }
      
      if (runBtn) {
        runBtn.onclick = () => {
          const savings = parseInt(savingsSlider?.value || 25000);
          const rate = parseFloat(scenarioSelect?.value || 0.10);
          const inflation = inflationCheck?.checked || false;
          initForecastChart(savings, rate, inflation);
        };
      }
    }, 100);
  }

  function initForecastChart(monthlySavings, annualReturn, includeInflation) {
    const ctx = document.getElementById('forecast-chart');
    if (!ctx || !window.Chart) return;
    
    const wrap = ctx.parentElement;
    if (wrap && wrap.clientWidth > 0 && wrap.clientHeight > 0) {
      ctx.width = wrap.clientWidth;
      ctx.height = wrap.clientHeight;
    }
    
    const currentNetWorth = 4520000;
    const years = 20;
    const labels = [];
    const baseData = [];
    const optData = [];
    const conData = [];
    
    let wealth = currentNetWorth;
    let optWealth = currentNetWorth;
    let conWealth = currentNetWorth;
    
    for (let y = 0; y <= years; y++) {
      labels.push((2026 + y).toString());
      if (y === 0) {
        baseData.push(wealth);
        optData.push(optWealth);
        conData.push(conWealth);
        continue;
      }
      for (let m = 0; m < 12; m++) {
        wealth = wealth * (1 + annualReturn / 12) + monthlySavings;
        optWealth = optWealth * (1 + (annualReturn + 0.03) / 12) + monthlySavings;
        conWealth = conWealth * (1 + (annualReturn - 0.02) / 12) + monthlySavings;
      }
      let realWealth = includeInflation ? wealth / Math.pow(1.06, y) : wealth;
      let realOpt = includeInflation ? optWealth / Math.pow(1.06, y) : optWealth;
      let realCon = includeInflation ? conWealth / Math.pow(1.06, y) : conWealth;
      baseData.push(Math.round(realWealth));
      optData.push(Math.round(realOpt));
      conData.push(Math.round(realCon));
    }
    
    // Update insights
    const finalBase = baseData[baseData.length - 1];
    const finalOpt = optData[optData.length - 1];
    const insightsEl = document.getElementById('fc-insights');
    if (insightsEl) {
      const homeGoalYear = baseData.findIndex(v => v >= 20000000);
      const retireGoalYear = baseData.findIndex(v => v >= 50000000);
      insightsEl.innerHTML = `
        <div class="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-100 dark:border-emerald-800">
          <p class="text-xs text-emerald-700 dark:text-emerald-300 font-medium"><i class="fas fa-check-circle mr-1"></i>Projection Complete</p>
          <p class="text-[10px] text-slate-500 mt-1">By 2046: <strong>${C(finalBase)}</strong> (Base) · <strong>${C(finalOpt)}</strong> (Optimistic)</p>
        </div>
        ${homeGoalYear > 0 ? `<div class="p-2 bg-primary/5 rounded-lg"><p class="text-[10px] text-primary"><i class="fas fa-home mr-1"></i>Home goal (₹2Cr) reachable by <strong>${2026 + homeGoalYear}</strong></p></div>` : ''}
        ${retireGoalYear > 0 ? `<div class="p-2 bg-primary/5 rounded-lg"><p class="text-[10px] text-primary"><i class="fas fa-umbrella-beach mr-1"></i>Retirement (₹5Cr) reachable by <strong>${2026 + retireGoalYear}</strong></p></div>` : ''}
        ${monthlySavings >= 30000 ? '<div class="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-100 dark:border-amber-800"><p class="text-[10px] text-amber-600 dark:text-amber-400"><i class="fas fa-lightbulb mr-1"></i>At this savings rate, you could retire 3-5 years earlier than planned.</p></div>' : ''}
      `;
    }
    
    if (App.charts.forecast) App.charts.forecast.destroy();
    App.charts.forecast = new Chart(ctx.getContext('2d'), {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          { label: 'Base', data: baseData, borderColor: '#0f766e', backgroundColor: 'rgba(15,118,110,0.08)', fill: true, tension: 0.4, pointRadius: 0 },
          { label: 'Optimistic', data: optData, borderColor: '#34d399', backgroundColor: 'transparent', borderDash: [5,5], tension: 0.4, pointRadius: 0 },
          { label: 'Conservative', data: conData, borderColor: '#fbbf24', backgroundColor: 'transparent', borderDash: [5,5], tension: 0.4, pointRadius: 0 }
        ]
      },
      options: {
        responsive: false,
        maintainAspectRatio: false,
        animation: { duration: 800 },
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => ctx.dataset.label + ': ' + C(ctx.raw)
            }
          }
        },
        scales: {
          y: { grid: { color: gridColor() }, ticks: { callback: v => C(v), color: textColor(), font: { size: 10 } } },
          x: { grid: { display: false }, ticks: { color: textColor(), font: { size: 10 }, maxTicksLimit: 8 } }
        }
      }
    });
  }

  // ===================== PATCH APP =====================
  function patchAllViews() {
    if (typeof App === 'undefined' || !App) { setTimeout(patchAllViews, 300); return; }
    App.renderWealthTwin = renderWealthTwin;
    App.renderGoals = renderGoals;
    App.renderPortfolio = renderPortfolio;
    App.renderAssets = renderAssets;
    App.renderMarket = renderMarket;
    App.renderForecast = renderForecast;
    App.renderProtection = renderProtection;
    App.renderTax = renderTax;
    App.renderPrivacy = renderPrivacy;
    App.renderCalculators = renderCalculators;
    App.renderTransactions = renderTransactions;

    // Monkey-patch renderView to handle forecast route (missing in bundle.min.js switch)
    if (App.renderView && !App.__renderViewPatched) {
      const _origRenderView = App.renderView.bind(App);
      App.renderView = function(viewName) {
        if (viewName === 'forecast' && App.renderForecast) {
          this.currentView = viewName;
          const container = document.getElementById('main-content');
          if (container) container.innerHTML = '';
          const nav = document.querySelector('.nav-item[data-view="' + viewName + '"]');
          if (nav && this.setActiveNav) this.setActiveNav(nav);
          this.renderForecast(container);
          return;
        }
        return _origRenderView(viewName);
      };
      App.__renderViewPatched = true;
    }

    console.log('[Views] All 11 view renderers patched with comprehensive layouts');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', patchAllViews);
  } else {
    patchAllViews();
  }
})();
