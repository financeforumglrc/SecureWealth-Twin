/**
 * SecureWealth Twin - Backend Server
 * Proxies AI API requests to keep keys secure server-side
 * Serves the frontend static files
 */

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const https = require('https');

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================================================
// Security & Utility Middleware
// ============================================================================

// Rate limiting (simple in-memory implementation)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 30;

function rateLimiter(req, res, next) {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now - record.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, windowStart: now });
    return next();
  }

  record.count++;
  if (record.count > RATE_LIMIT_MAX_REQUESTS) {
    return res.status(429).json({
      error: 'Too many requests. Please try again later.',
      retryAfterSeconds: Math.ceil((RATE_LIMIT_WINDOW_MS - (now - record.windowStart)) / 1000)
    });
  }
  next();
}

// Clean up stale rate limit entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of rateLimitMap) {
    if (now - record.windowStart > RATE_LIMIT_WINDOW_MS * 2) {
      rateLimitMap.delete(ip);
    }
  }
}, 300_000);

// CORS - restrict to frontend origin in production
const ALLOWED_ORIGINS = process.env.NODE_ENV === 'production'
  ? [process.env.FRONTEND_URL || 'http://localhost:3000']
  : true; // allow all in dev

app.use(cors({
  origin: ALLOWED_ORIGINS,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

// Parse JSON with size limits
app.use(express.json({ limit: '100kb' }));

// Serve static files
app.use(express.static(path.join(__dirname), {
  dotfiles: 'deny',
  index: false
}));

// Basic security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  next();
});

// ============================================================================
// Helpers
// ============================================================================

/**
 * Sanitize user input to prevent injection attacks
 */
function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .slice(0, 2000); // max message length
}

function sanitizeContext(obj) {
  if (!obj || typeof obj !== 'object') return {};
  const safe = {};
  const allowedFields = ['name', 'income', 'expenses', 'savings', 'netWorth', 'riskAppetite', 'goals', 'allocation', 'protectionScore'];
  for (const field of allowedFields) {
    if (obj[field] !== undefined) {
      safe[field] = typeof obj[field] === 'string' ? sanitizeInput(obj[field]) : obj[field];
    }
  }
  return safe;
}

function buildSystemPrompt(context) {
  const ctx = sanitizeContext(context);
  return `You are Wealth Twin AI, an expert financial advisor for Indian banking customers. You provide guidance on savings, investments, tax planning, fraud protection, and wealth management.

CURRENT USER CONTEXT:
- Name: ${ctx.name || 'Customer'}
- Monthly Income: ₹${ctx.income || 'N/A'}
- Monthly Expenses: ₹${ctx.expenses || 'N/A'}
- Monthly Savings: ₹${ctx.savings || 'N/A'}
- Net Worth: ₹${ctx.netWorth || 'N/A'}
- Risk Appetite: ${ctx.riskAppetite || 'moderate'}
- Active Goals: ${ctx.goals || 'N/A'}
- Portfolio Allocation: ${ctx.allocation || 'N/A'}
- Protection Score: ${ctx.protectionScore || 'N/A'}

RULES:
- Never promise guaranteed returns or claim "zero risk"
- Always mention "for educational purposes" for investment advice
- Recommend consulting a SEBI-registered advisor for major decisions
- Use Indian Rupees (₹) and Indian financial instruments
- Keep responses concise (2-3 sentences when possible)
- Be friendly, encouraging, and professional
- If you don't know something, say so honestly`;
}

// ============================================================================
// API Client Functions
// ============================================================================

async function callGemini(userMessage, history, systemPrompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Gemini API key not configured');
  }

  const model = 'gemini-2.0-flash';
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const contents = [
    { role: 'user', parts: [{ text: systemPrompt }] },
    { role: 'model', parts: [{ text: 'Understood. I am Wealth Twin AI, ready to assist with financial guidance.' }] }
  ];

  // Max 10 history turns to prevent token overflow
  const recentHistory = Array.isArray(history) ? history.slice(-10) : [];
  recentHistory.forEach(turn => {
    if (turn.user) contents.push({ role: 'user', parts: [{ text: String(turn.user).slice(0, 1000) }] });
    if (turn.bot) contents.push({ role: 'model', parts: [{ text: String(turn.bot).slice(0, 1000) }] });
  });

  contents.push({ role: 'user', parts: [{ text: userMessage }] });

  const postData = JSON.stringify({
    contents,
    generationConfig: {
      maxOutputTokens: 256,
      temperature: 0.7
    },
    safetySettings: [
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' }
    ]
  });

  return new Promise((resolve, reject) => {
    const url = new URL(endpoint);
    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      },
      timeout: 15000
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.error) {
            reject(new Error(parsed.error.message || 'Gemini API error'));
            return;
          }
          const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
          if (!text) {
            reject(new Error('Empty response from Gemini'));
            return;
          }
          resolve(text);
        } catch (e) {
          reject(new Error('Failed to parse Gemini response'));
        }
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Gemini request timeout'));
    });
    req.write(postData);
    req.end();
  });
}

async function callHuggingFace(userMessage, history, systemPrompt) {
  const token = process.env.HF_TOKEN;
  if (!token) {
    throw new Error('Hugging Face token not configured');
  }

  const model = 'google/flan-t5-small';
  const endpoint = `https://api-inference.huggingface.co/models/${model}`;

  let prompt = `<s>[INST] ${systemPrompt} [/INST]</s>\n`;
  const recentHistory = Array.isArray(history) ? history.slice(-10) : [];
  recentHistory.forEach(turn => {
    if (turn.user) prompt += `<s>[INST] ${String(turn.user).slice(0, 1000)} [/INST] ${String(turn.bot || '').slice(0, 1000)}</s>\n`;
  });
  prompt += `<s>[INST] ${userMessage} [/INST]`;

  const postData = JSON.stringify({
    inputs: prompt,
    parameters: {
      max_new_tokens: 256,
      temperature: 0.7,
      return_full_text: false,
      do_sample: true,
      top_p: 0.95
    }
  });

  return new Promise((resolve, reject) => {
    const url = new URL(endpoint);
    const options = {
      hostname: url.hostname,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      },
      timeout: 30000
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.error) {
            // If model is loading, wait and retry
            if (parsed.error.includes('loading')) {
              reject(new Error('Model is loading, please retry in a few seconds'));
              return;
            }
            reject(new Error(`HF API error: ${parsed.error}`));
            return;
          }
          if (Array.isArray(parsed) && parsed[0]?.generated_text) {
            resolve(parsed[0].generated_text.trim());
          } else if (parsed.generated_text) {
            resolve(parsed.generated_text.trim());
          } else {
            console.warn('Unexpected HF response:', JSON.stringify(parsed).slice(0, 200));
            reject(new Error('Unexpected HF response format'));
          }
        } catch (e) {
          console.warn('Failed to parse HF response:', data.slice(0, 200));
          reject(new Error('Failed to parse HF response'));
        }
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('HF request timeout'));
    });
    req.write(postData);
    req.end();
  });
}

// ============================================================================
// Routes
// ============================================================================

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    geminiConfigured: !!process.env.GEMINI_API_KEY,
    huggingfaceConfigured: !!process.env.HF_TOKEN,
    timestamp: new Date().toISOString()
  });
});

// Main chat endpoint - proxies to AI APIs
app.post('/api/chat', rateLimiter, async (req, res) => {
  const { message, history = [], userContext = {} } = req.body;

  // Validate message
  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ error: 'Message is required and must be a non-empty string' });
  }

  const sanitizedMessage = sanitizeInput(message.trim());

  // Validate history array
  if (!Array.isArray(history)) {
    return res.status(400).json({ error: 'History must be an array' });
  }

  // Build system prompt with sanitized user context
  const systemPrompt = buildSystemPrompt(userContext);

  // Try Gemini first, then Hugging Face
  let response = null;
  let source = null;
  const errorDetails = [];

  // 1. Try Gemini API
  if (process.env.GEMINI_API_KEY) {
    try {
      const geminiResponse = await callGemini(sanitizedMessage, history, systemPrompt);
      response = geminiResponse;
      source = 'gemini';
    } catch (err) {
      errorDetails.push({ source: 'gemini', error: err.message });
      console.warn('Gemini API failed:', err.message);
    }
  }

  // 2. Fallback to Hugging Face
  if (!response && process.env.HF_TOKEN) {
    try {
      const hfResponse = await callHuggingFace(sanitizedMessage, history, systemPrompt);
      response = hfResponse;
      source = 'huggingface';
    } catch (err) {
      errorDetails.push({ source: 'huggingface', error: err.message });
      console.warn('Hugging Face API failed:', err.message);
    }
  }

  // 3. Return result or error
  if (response) {
    res.json({
      success: true,
      response,
      source,
      timestamp: new Date().toISOString()
    });
  } else {
    const quotaError = errorDetails.find(e =>
      e.error.includes('quota') || e.error.includes('rate limit') || e.error.includes('exceeded')
    );

    // Don't leak detailed error info to client in production
    const clientError = quotaError
      ? 'AI API quota exceeded. Please try again later or use offline mode.'
      : 'All AI services are currently unavailable. Please try again later.';

    res.status(503).json({
      success: false,
      error: clientError,
      fallback: true,
      quotaExceeded: !!quotaError
    });
  }
});

// Catch-all: serve index.html for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// ============================================================================
// Global Error Handler
// ============================================================================

app.use((err, req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'development'
      ? 'Internal server error: ' + err.message
      : 'Internal server error'
  });
});

// ============================================================================
// Start Server
// ============================================================================

app.listen(PORT, () => {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║       SecureWealth Twin - Backend Server Running           ║');
  console.log('╠════════════════════════════════════════════════════════════╣');
  console.log(`║  Server URL: http://localhost:${PORT}                         ║`);
  console.log(`║  Gemini API: ${process.env.GEMINI_API_KEY ? '✅ Configured' : '❌ Missing'}                          ║`);
  console.log(`║  HuggingFace: ${process.env.HF_TOKEN ? '✅ Configured' : '❌ Missing'}                          ║`);
  console.log(`║  Environment: ${process.env.NODE_ENV || 'development'}                                  ║`);
  console.log('╚════════════════════════════════════════════════════════════╝\n');
});
