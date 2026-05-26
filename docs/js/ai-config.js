/**
 * SecureWealth Twin - AI Configuration
 * 
 * SECURITY: All API keys are stored server-side in .env and NEVER exposed to the frontend.
 * The frontend communicates only through the backend /api/chat proxy endpoint.
 */

const AI_CONFIG = {
  backend: {
    url: window.location.origin,
    chatEndpoint: '/api/chat',
    healthEndpoint: '/api/health'
  },

  gemini: {
    enabled: true,
    model: 'gemini-2.0-flash',
    maxTokens: 256,
    temperature: 0.7
  },

  huggingface: {
    enabled: true,
    model: 'google/flan-t5-small',
    maxTokens: 256,
    temperature: 0.7
  },

  /**
   * Check backend health status
   * On surge.sh or other static hosts, skip the check (no backend available)
   */
  async checkBackend() {
    if (window.location.hostname.includes('surge.sh')) {
      return { online: false, geminiConfigured: false, huggingfaceConfigured: false };
    }

    try {
      const resp = await fetch(`${this.backend.url}${this.backend.healthEndpoint}`);
      if (resp.ok) {
        const data = await resp.json();
        return {
          online: true,
          geminiConfigured: data.geminiConfigured,
          huggingfaceConfigured: data.huggingfaceConfigured
        };
      }
    } catch (err) {
      console.warn('Backend health check failed:', err.message);
    }
    return { online: false, geminiConfigured: false, huggingfaceConfigured: false };
  },

  /**
   * Build a user context object for the backend system prompt
   */
  buildUserContext() {
    const netWorth = WealthEngine.getNetWorth();
    const goals = WealthEngine.goals
      .map(g => `${g.name}: ₹${g.current.toLocaleString()}/₹${g.target.toLocaleString()}`)
      .join(', ');
    const allocation = Object.entries(WealthEngine.portfolio.allocation)
      .map(([k, v]) => `${k} ${v}%`)
      .join(', ');

    return {
      name: WealthEngine.user.name,
      income: WealthEngine.user.income.toLocaleString(),
      expenses: WealthEngine.user.monthlyExpenses.toLocaleString(),
      savings: WealthEngine.user.monthlySavings.toLocaleString(),
      netWorth: netWorth.total.toLocaleString(),
      riskAppetite: WealthEngine.user.riskAppetite,
      goals,
      allocation,
      protectionScore: '94/100'
    };
  }
};
