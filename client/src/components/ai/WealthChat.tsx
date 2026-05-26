import { useState, useRef, useEffect, useCallback } from 'react';
import { useWealthStore } from '../../store/wealthStore';
import { useTranslation } from '../../hooks/useTranslation';

interface Message {
  id: string;
  role: 'user' | 'bot';
  text: string;
  source?: string;
  time: string;
}

interface ApiStatus {
  online: boolean;
  geminiConfigured: boolean;
  huggingfaceConfigured: boolean;
}

const PRESET_QUESTIONS = [
  'How do I save tax?',
  'SIP recommendations',
  'Am I spending too much?',
  'Market outlook?',
];

const OFFLINE_RESPONSES: Record<string, string> = {
  'how do i save tax': 'You can save up to ₹1,50,000 under Section 80C. Consider ELSS funds, PPF, or NPS for tax-efficient growth. As you are in the 30% bracket, this saves ₹46,800/year.\n\n💡 Based on: Simulated user profile + Tax rules. Not financial advice.',
  'sip recommendations': 'Based on your profile, I recommend increasing your SIP by ₹2,000/month. At 12% returns, this adds ₹8.4 Lakhs over 10 years. Consider Axis Bluechip or Nifty 50 Index.\n\n💡 Based on: Simulated user profile + Market data. Not financial advice.',
  'am i spending too much': 'Your top spending categories are: Rent (32%), Food (18%), Entertainment (14%). You are spending 6% more on dining out vs. last month. Set a weekly budget of ₹2,000?\n\n💡 Based on: Simulated spending data. Not financial advice.',
  'market outlook': 'NIFTY P/E is at 23.4, slightly above historical average. RBI repo rate at 6.5% with inflation at 6.2%. Consider staggered SIP entry.\n\n💡 Based on: Simulated market data. Not financial advice.',
  'default': 'I am analyzing your financial data. For personalized advice, try asking about: SIP recommendations, tax savings, spending analysis, or market trends. How can I help?\n\n💡 Based on: Simulated data. Not financial advice.',
};

function buildUserContext(user: any, assets: any[], goals: any[]) {
  const netWorth = assets.reduce((sum, a) => sum + a.value, 0);
  return {
    name: user.name,
    income: user.monthlyIncome.toLocaleString(),
    expenses: user.monthlyExpenses.toLocaleString(),
    savings: user.monthlySavings.toLocaleString(),
    netWorth: netWorth.toLocaleString(),
    riskAppetite: user.riskProfile.toLowerCase(),
    goals: goals.map(g => `${g.name}: ₹${g.currentAmount.toLocaleString()}/₹${g.targetAmount.toLocaleString()}`).join(', '),
    taxBracket: user.taxBracket,
  };
}

export default function WealthChat() {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const { isHindi } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'bot',
      text: isHindi()
        ? "नमस्ते! मैं आपका Wealth Twin AI हूँ 🧠\nमैं बचत, निवेश, कर, धोखाधड़ी सुरक्षा और बाजार रुझानों में मदद कर सकता हूँ।"
        : "Hi! I'm your Wealth Twin AI 🧠\nI can help with savings, investments, taxes, fraud protection, and market trends.",
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [typingSource, setTypingSource] = useState('Wealth Twin AI is thinking...');
  const [apiStatus, setApiStatus] = useState<ApiStatus | null>(null);
  const [showApiModal, setShowApiModal] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const voiceRecognitionRef = useRef<any>(null);

  const user = useWealthStore((s) => s.user);
  const assets = useWealthStore((s) => s.assets);
  const goals = useWealthStore((s) => s.goals);
  const language = useWealthStore((s) => s.language);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const greeting = language === 'hi'
      ? "नमस्ते! मैं आपका Wealth Twin AI हूँ 🧠\nमैं बचत, निवेश, कर, धोखाधड़ी सुरक्षा और बाजार रुझानों में मदद कर सकता हूँ।"
      : "Hi! I'm your Wealth Twin AI 🧠\nI can help with savings, investments, taxes, fraud protection, and market trends.";
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].id === '0') {
        return [{ ...prev[0], text: greeting }];
      }
      return prev;
    });
  }, [language]);

  const checkBackendStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/health', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setApiStatus({
          online: true,
          geminiConfigured: data.geminiConfigured,
          huggingfaceConfigured: data.huggingfaceConfigured,
        });
        return;
      }
    } catch {
      // ignore
    }
    setApiStatus({ online: false, geminiConfigured: false, huggingfaceConfigured: false });
  }, []);

  useEffect(() => {
    if (showApiModal) checkBackendStatus();
  }, [showApiModal, checkBackendStatus]);

  const getAiStatusText = () => {
    if (!apiStatus) return 'Offline AI Active';
    if (apiStatus.online && apiStatus.geminiConfigured) return 'Gemini AI Active (Backend)';
    if (apiStatus.online && apiStatus.huggingfaceConfigured) return 'HF AI Active (Backend)';
    if (apiStatus.online) return 'Backend Connected';
    return 'Offline AI Active';
  };

  async function callBackend(message: string, history: Message[]) {
    const userContext = buildUserContext(user, assets, goals);
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        history: history.filter(m => m.role !== 'bot' || !m.text.startsWith('Hi! I\'m your Wealth Twin AI')).map(m => ({
          role: m.role === 'user' ? 'user' : 'model',
          text: m.text,
        })),
        userContext,
      }),
    });
    if (!res.ok) throw new Error('Backend error');
    const data = await res.json();
    return { text: data.response, source: data.source };
  }

  function getOfflineResponse(text: string) {
    const lower = text.toLowerCase();
    for (const key of Object.keys(OFFLINE_RESPONSES)) {
      if (lower.includes(key)) return OFFLINE_RESPONSES[key];
    }
    return OFFLINE_RESPONSES.default;
  }

  async function send(text: string) {
    if (!text.trim()) return;
    const time = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    const userMsg: Message = { id: Date.now().toString(), role: 'user', text, time };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setTyping(true);

    // Determine typing source
    if (apiStatus?.online && apiStatus.geminiConfigured) {
      setTypingSource('Gemini is thinking...');
    } else if (apiStatus?.online && apiStatus.huggingfaceConfigured) {
      setTypingSource('Hugging Face is loading...');
    } else {
      setTypingSource('Wealth Twin AI is thinking...');
    }

    try {
      let result: { text: string; source: string };
      if (apiStatus?.online) {
        result = await callBackend(text, [...messages, userMsg]);
      } else {
        // Offline fallback with delay
        await new Promise(r => setTimeout(r, 1200));
        result = { text: getOfflineResponse(text), source: 'offline' };
      }
      setMessages((m) => [...m, {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        text: result.text,
        source: result.source,
        time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      }]);
    } catch {
      await new Promise(r => setTimeout(r, 800));
      setMessages((m) => [...m, {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        text: 'I\'m having trouble connecting to the AI service. Using offline mode instead.\n\n💡 Based on: Offline fallback. Not financial advice.',
        source: 'offline',
        time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      }]);
    } finally {
      setTyping(false);
    }
  }

  function startVoiceInput() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice input not supported in this browser. Try Chrome or Edge.');
      return;
    }
    if (isVoiceActive) {
      voiceRecognitionRef.current?.stop();
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onstart = () => setIsVoiceActive(true);
    recognition.onend = () => setIsVoiceActive(false);
    recognition.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript;
      setInput(transcript);
      setTimeout(() => send(transcript), 300);
    };
    recognition.onerror = (e: any) => {
      console.error('Voice error:', e.error);
      setIsVoiceActive(false);
    };
    voiceRecognitionRef.current = recognition;
    recognition.start();
  }

  return (
    <div className="fixed bottom-6 left-6 z-50">
      {open && (
        <div className={`bg-white dark:bg-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-slate-700 mb-4 transition-all ${expanded ? 'w-[32rem] h-[32rem]' : 'w-80 h-[28rem]'}`}>
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-secondary p-3 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center relative">
                <i className="fas fa-robot text-sm" />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-success rounded-full border-2 border-white" />
              </div>
              <div>
                <p className="text-sm font-semibold">Wealth Twin AI</p>
                <p className="text-xs text-white/70">{getAiStatusText()}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setShowApiModal(!showApiModal)} className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20" title="Connect AI APIs">
                <i className="fas fa-plug text-xs" />
              </button>
              <button onClick={() => setExpanded(!expanded)} className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20" title="Expand">
                <i className={`fas ${expanded ? 'fa-compress' : 'fa-expand'} text-xs`} />
              </button>
              <button onClick={() => setOpen(false)} className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20">
                <i className="fas fa-times text-xs" />
              </button>
            </div>
          </div>

          {/* API Status Modal */}
          {showApiModal && (
            <div className="absolute bottom-20 left-0 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-80 p-5 border border-slate-200 dark:border-slate-700 z-50 m-2">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-sm"><i className="fas fa-server text-primary mr-2" />Backend Status</h3>
                <button onClick={() => setShowApiModal(false)} className="text-slate-400 hover:text-slate-600"><i className="fas fa-times" /></button>
              </div>
              <p className="text-xs text-slate-500 mb-3">AI API keys are stored server-side in <code>.env</code>. The frontend never sees them.</p>
              <div className="space-y-3">
                <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded-lg border border-slate-100 dark:border-slate-600">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Backend Server</span>
                    <span className="text-xs">
                      {apiStatus === null ? <i className="fas fa-spinner fa-spin text-primary" /> :
                        apiStatus.online ? <i className="fas fa-check-circle text-success" /> : <i className="fas fa-times-circle text-danger" />}
                      {apiStatus === null ? ' Checking...' : apiStatus.online ? ' Online' : ' Offline'}
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded-lg border border-slate-100 dark:border-slate-600">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Google Gemini</span>
                    <span className="text-xs">
                      {apiStatus === null ? <i className="fas fa-spinner fa-spin text-primary" /> :
                        apiStatus.geminiConfigured ? <i className="fas fa-check-circle text-success" /> : <i className="fas fa-times-circle text-slate-400" />}
                      {apiStatus === null ? ' Checking...' : apiStatus.geminiConfigured ? ' Active' : ' Not set'}
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded-lg border border-slate-100 dark:border-slate-600">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Hugging Face</span>
                    <span className="text-xs">
                      {apiStatus === null ? <i className="fas fa-spinner fa-spin text-primary" /> :
                        apiStatus.huggingfaceConfigured ? <i className="fas fa-check-circle text-success" /> : <i className="fas fa-times-circle text-slate-400" />}
                      {apiStatus === null ? ' Checking...' : apiStatus.huggingfaceConfigured ? ' Active' : ' Not set'}
                    </span>
                  </div>
                </div>
                <button onClick={checkBackendStatus} className="w-full py-2 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary/90 transition-colors">
                  <i className="fas fa-rotate mr-1" /> Refresh Status
                </button>
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50 dark:bg-slate-900">
            {messages.map((m) => (
              <div key={m.id} className={`flex items-start gap-2 ${m.role === 'user' ? 'justify-end' : ''}`}>
                {m.role === 'bot' && (
                  <div className="w-7 h-7 bg-primary/10 rounded-full flex items-center justify-center text-primary text-xs flex-shrink-0">
                    <i className="fas fa-robot" />
                  </div>
                )}
                <div className="flex flex-col max-w-[85%]">
                  <div className={`p-3 text-sm rounded-2xl whitespace-pre-line ${m.role === 'user' ? 'bg-primary text-white rounded-tr-sm' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 shadow-sm border border-slate-100 dark:border-slate-700'}`}>
                    {m.text}
                  </div>
                  <span className={`text-[10px] text-slate-400 mt-1 ${m.role === 'user' ? 'text-right' : ''}`}>
                    {m.time} {m.source && m.source !== 'offline' && `· ${m.source}`}
                  </span>
                </div>
                {m.role === 'user' && (
                  <div className="w-7 h-7 bg-secondary rounded-full flex items-center justify-center text-white text-xs flex-shrink-0">
                    <i className="fas fa-user" />
                  </div>
                )}
              </div>
            ))}

            {typing && (
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-primary text-xs">
                  <i className="fas fa-robot" />
                </div>
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-xs text-slate-400">{typingSource}</span>
              </div>
            )}
            <div ref={scrollRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700">
            <div className="flex gap-1 flex-wrap mb-2">
              {PRESET_QUESTIONS.map((q) => (
                <button key={q} onClick={() => send(q)} className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs hover:bg-primary/20 transition-colors">
                  {q}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={startVoiceInput}
                className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${isVoiceActive ? 'bg-accent text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-accent/10 hover:text-accent'}`}
                title="Voice input"
              >
                <i className="fas fa-microphone text-sm" />
              </button>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && send(input)}
                placeholder="Ask about SIPs, taxes, gold..."
                className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 dark:text-white"
              />
              <button onClick={() => send(input)} className="w-9 h-9 bg-primary text-white rounded-lg flex items-center justify-center hover:bg-primary/90 transition-colors">
                <i className="fas fa-paper-plane text-xs" />
              </button>
            </div>
            {isVoiceActive && (
              <div className="h-6 mt-2 flex items-center justify-center gap-0.5">
                {[20, 40, 70, 100, 60, 30, 80, 45].map((h, i) => (
                  <div key={i} className="w-0.5 bg-accent rounded-full animate-pulse" style={{ height: `${h}%` }} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen(!open)}
        className="w-14 h-14 bg-gradient-to-br from-primary to-secondary text-white rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition-transform relative"
      >
        <i className={`fas ${open ? 'fa-times' : 'fa-comments'} text-xl`} />
      </button>
    </div>
  );
}
