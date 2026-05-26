/**
 * SecureWealth Twin - Backend Client & AI Orchestrator
 * Communicates with the backend /api/chat proxy (keys stay server-side)
 */

const BackendClient = {
  async chat(message, history = []) {
    const resp = await fetch(`${AI_CONFIG.backend.url}${AI_CONFIG.backend.chatEndpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        history: history.slice(-5),
        userContext: AI_CONFIG.buildUserContext()
      })
    });

    if (!resp.ok) {
      const errData = await resp.json().catch(() => ({}));
      throw new Error(errData.error || `Backend error: ${resp.status}`);
    }

    const data = await resp.json();
    return { text: data.response, source: data.source || 'backend' };
  }
};

const AIOrchestrator = {
  conversationHistory: [],
  maxHistoryLength: 10,
  backendStatus: { online: false, geminiConfigured: false, huggingfaceConfigured: false },

  async checkStatus() {
    this.backendStatus = await AI_CONFIG.checkBackend();
    return this.backendStatus;
  },

  addToHistory(userMsg, botMsg, source) {
    this.conversationHistory.push({
      user: userMsg,
      bot: botMsg,
      source,
      timestamp: Date.now()
    });
    if (this.conversationHistory.length > this.maxHistoryLength) {
      this.conversationHistory.shift();
    }
    this.saveHistory();
  },

  saveHistory() {
    try {
      localStorage.setItem('sw_chat_history', JSON.stringify(this.conversationHistory));
    } catch (e) {
      // localStorage may be full or unavailable
    }
  },

  loadHistory() {
    try {
      const stored = localStorage.getItem('sw_chat_history');
      if (stored) {
        this.conversationHistory = JSON.parse(stored);
      }
    } catch (e) {
      // Corrupted data, reset
      this.conversationHistory = [];
    }
  },

  clearHistory() {
    this.conversationHistory = [];
    localStorage.removeItem('sw_chat_history');
  },

  /**
   * Get AI response: tries backend first, falls back to offline chatbot
   */
  async getResponse(userMessage) {
    // Try offline chatbot first for high-confidence matches
    const offlineResult = WealthEngine.getEnhancedChatbotResponse(
      userMessage,
      this.conversationHistory
    );

    if (offlineResult.confidence >= 0.85) {
      return {
        text: offlineResult.response,
        source: 'offline',
        confidence: offlineResult.confidence,
        suggestions: offlineResult.suggestions || []
      };
    }

    // Try backend AI
    if (this.backendStatus.online) {
      try {
        const backendResult = await BackendClient.chat(
          userMessage,
          this.conversationHistory
        );
        return {
          text: backendResult.text,
          source: backendResult.source,
          confidence: 0.95,
          suggestions: []
        };
      } catch (err) {
        console.warn('Backend AI failed, falling back to offline:', err.message);
      }
    }

    // Final fallback to offline
    return {
      text: offlineResult.response,
      source: 'offline',
      confidence: offlineResult.confidence,
      suggestions: offlineResult.suggestions || []
    };
  }
};

// Load saved chat history on init
AIOrchestrator.loadHistory();
