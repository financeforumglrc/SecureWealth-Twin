/**
 * ═══════════════════════════════════════════════════════════════
 *  SUBTRACK AI — Intelligent Subscription Detection & Tracking
 * ═══════════════════════════════════════════════════════════════
 *
 *  INNOVATION: SubTrack AI parses SMS messages, push notifications,
 *  and bank alerts to AUTOMATICALLY detect, categorize, and track
 *  all your subscriptions. It captures the merchant name, amount,
 *  location, and renewal date — giving you a complete picture of
 *  recurring expenses you might have forgotten.
 *
 *  Unique features:
 *  - SMS/Notification Parsing: Auto-detects subscription payments from messages
 *  - Location-Aware: Links payments to physical store locations
 *  - Ghost Detection: Finds unused/forgotten subscriptions
 *  - Calendar View: Shows upcoming renewals
 *  - Cancellation Coach: Guides you through cancelling unused services
 */

const SubTrackAI = {
  subscriptions: [],

  // Known subscription patterns (extensible)
  knownMerchants: {
    'netflix': { category: 'Entertainment', icon: 'fa-film', color: '#e50914' },
    'amazon prime': { category: 'Shopping', icon: 'fa-box', color: '#00a8e1' },
    'spotify': { category: 'Music', icon: 'fa-music', color: '#1db954' },
    'youtube premium': { category: 'Entertainment', icon: 'fa-youtube', color: '#ff0000' },
    'hotstar': { category: 'Entertainment', icon: 'fa-tv', color: '#1f80e0' },
    'disney+': { category: 'Entertainment', icon: 'fa-star', color: '#113ccf' },
    'jiosaavn': { category: 'Music', icon: 'fa-headphones', color: '#2ec866' },
    'google one': { category: 'Cloud Storage', icon: 'fa-cloud', color: '#4285f4' },
    'icloud': { category: 'Cloud Storage', icon: 'fa-cloud', color: '#3693f3' },
    'microsoft 365': { category: 'Productivity', icon: 'fa-file-word', color: '#0078d4' },
    'adobe': { category: 'Productivity', icon: 'fa-pen-ruler', color: '#ff0000' },
    'gym': { category: 'Fitness', icon: 'fa-dumbbell', color: '#ff5722' },
    'cult.fit': { category: 'Fitness', icon: 'fa-heart-pulse', color: '#e91e63' },
    'newspaper': { category: 'News', icon: 'fa-newspaper', color: '#333333' },
    'times of india': { category: 'News', icon: 'fa-newspaper', color: '#d32f2f' },
    'the hindu': { category: 'News', icon: 'fa-newspaper', color: '#1976d2' },
    'broadband': { category: 'Internet', icon: 'fa-wifi', color: '#ff9800' },
    'jio fiber': { category: 'Internet', icon: 'fa-wifi', color: '#0a84ff' },
    'airtel': { category: 'Telecom', icon: 'fa-mobile', color: '#e40000' },
    'jio': { category: 'Telecom', icon: 'fa-mobile', color: '#0a84ff' },
    'vi ': { category: 'Telecom', icon: 'fa-mobile', color: '#e31e24' },
    'lic': { category: 'Insurance', icon: 'fa-shield-halved', color: '#1a73e8' },
    'health insurance': { category: 'Insurance', icon: 'fa-heart', color: '#4caf50' },
    'term insurance': { category: 'Insurance', icon: 'fa-umbrella', color: '#2196f3' },
    'ola': { category: 'Transport', icon: 'fa-car', color: '#b6d72b' },
    'uber': { category: 'Transport', icon: 'fa-car', color: '#000000' },
    'zomato gold': { category: 'Food', icon: 'fa-utensils', color: '#e23744' },
    'swiggy one': { category: 'Food', icon: 'fa-bowl-food', color: '#fc8019' }
  },

  // Simulated SMS/notification messages for demo
  simulatedMessages: [],

  /**
   * Initialize SubTrack AI
   */
  init() {
    this.loadSubscriptions();
    this.generateSimulatedMessages();
    this.autoDetectFromMessages();
  },

  /**
   * Generate realistic simulated SMS/notification messages for demo
   */
  generateSimulatedMessages() {
    const today = new Date();
    const fmtDate = (d) => d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

    const templates = [
      {
        sender: 'AXIS Bank',
        body: 'INR 649.00 debited from a/c **1234 on {date} for NETFLIX COM (Recurring). Avl Bal: ₹45,230. Not you? Call 18001034.',
        merchant: 'netflix', amount: 649, date: new Date(today.getTime() - 2 * 86400000),
        location: null, isRecurring: true
      },
      {
        sender: 'HDFC Bank',
        body: 'Rs.299.00 paid to SPOTIFY INDIA from HDFC Bank A/c **5678 on {date}. Ref# SP987654. Bal: ₹12,450.',
        merchant: 'spotify', amount: 299, date: new Date(today.getTime() - 5 * 86400000),
        location: null, isRecurring: true
      },
      {
        sender: 'SBI',
        body: 'Your SBI Card **8901 spent Rs.1,499.00 at AMAZON PRIME on {date}. Total due: ₹15,200. Pay by 25th.',
        merchant: 'amazon prime', amount: 1499, date: new Date(today.getTime() - 15 * 86400000),
        location: null, isRecurring: true
      },
      {
        sender: 'ICICI Bank',
        body: 'INR 3,200.00 debited for CULT.FIT GYM Membership (Monthly) from a/c **4321 on {date}.',  
        merchant: 'cult.fit', amount: 3200, date: new Date(today.getTime() - 8 * 86400000),
        location: 'Cult.fit Fitness Center, HSR Layout, Bangalore', isRecurring: true
      },
      {
        sender: 'Axis Bank',
        body: '₹5,999.00 paid to GOOGLE ONE (Annual Plan) from **1234 on {date}. Cloud storage renewed for 12 months.',
        merchant: 'google one', amount: 5999, date: new Date(today.getTime() - 30 * 86400000),
        location: null, isRecurring: true
      },
      {
        sender: 'PayTM',
        body: 'Payment of ₹349.00 to JIOSAAVN MUSIC from Paytm Wallet on {date}. Transaction ID: PTM98765432.',
        merchant: 'jiosaavn', amount: 349, date: new Date(today.getTime() - 12 * 86400000),
        location: null, isRecurring: true
      },
      {
        sender: 'HDFC Bank',
        body: 'Rs.899.00 spent at SWIGGY ONE Membership from **5678 on {date}. Enjoy free deliveries!',
        merchant: 'swiggy one', amount: 899, date: new Date(today.getTime() - 6 * 86400000),
        location: null, isRecurring: true
      },
      {
        sender: 'PhonePe',
        body: 'Auto-debit of ₹2,499.00 for JIO FIBER Broadband (Monthly Plan) from linked account on {date}.',
        merchant: 'jio fiber', amount: 2499, date: new Date(today.getTime() - 3 * 86400000),
        location: 'Jio Fiber Service, Koramangala, Bangalore', isRecurring: true
      },
      {
        sender: 'SBI Card',
        body: 'Card **8901: ₹1,200.00 charged by THE HINDU DIGITAL Subscription on {date}. Auto-renewal active.',
        merchant: 'the hindu', amount: 1200, date: new Date(today.getTime() - 20 * 86400000),
        location: null, isRecurring: true
      },
      {
        sender: 'ICICI Bank',
        body: 'One-time debit of ₹450.00 at STARBUCKS, Indiranagar, Bangalore on {date}. Balance: ₹8,320.',
        merchant: null, amount: 450, date: new Date(today.getTime() - 1 * 86400000),
        location: 'Starbucks, 100 Ft Road, Indiranagar, Bangalore', isRecurring: false
      },
      {
        sender: 'Axis Bank',
        body: 'INR 18,500.00 debited for LIC INSURANCE PREMIUM (Annual) from **1234 on {date}. Policy No: 123456789.',
        merchant: 'lic', amount: 18500, date: new Date(today.getTime() - 90 * 86400000),
        location: 'LIC Branch Office, MG Road, Bangalore', isRecurring: true
      },
      {
        sender: 'Google Pay',
        body: '₹199.00 paid to ZOMATO GOLD at {date}. UPI Ref: GP123456789.',
        merchant: 'zomato gold', amount: 199, date: new Date(today.getTime() - 18 * 86400000),
        location: null, isRecurring: true
      }
    ];

    this.simulatedMessages = templates.map(t => ({
      ...t,
      body: t.body.replace('{date}', fmtDate(t.date))
    }));
  },

  /**
   * Parse SMS/notification text to detect subscriptions
   */
  parseMessage(message) {
    // Extract amount
    const amountMatch = message.body.match(/(?:INR|Rs\.|₹)\s*([\d,]+(?:\.\d{2})?)/i);
    const amount = amountMatch ? parseFloat(amountMatch[1].replace(/,/g, '')) : null;

    // Extract date
    const dateMatch = message.body.match(/(\d{1,2}[-\s]?(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[-\s]?\d{4})/i);
    const date = dateMatch ? new Date(dateMatch[1]) : message.date;

    // Detect merchant
    let detectedMerchant = null;
    let merchantKey = null;
    for (const [key, info] of Object.entries(this.knownMerchants)) {
      if (message.body.toLowerCase().includes(key)) {
        detectedMerchant = info;
        merchantKey = key;
        break;
      }
    }

    // Detect if recurring
    const recurringKeywords = ['recurring', 'auto-debit', 'auto-renewal', 'subscription', 'membership', 'monthly', 'annual', 'quarterly', 'premium', 'plan'];
    const isRecurring = message.isRecurring || recurringKeywords.some(kw => message.body.toLowerCase().includes(kw));

    // Detect frequency
    let frequency = 'monthly';
    if (message.body.toLowerCase().includes('annual') || message.body.toLowerCase().includes('yearly')) frequency = 'annual';
    else if (message.body.toLowerCase().includes('quarterly')) frequency = 'quarterly';

    // Calculate next renewal date
    const nextRenewal = new Date(date);
    if (frequency === 'monthly') nextRenewal.setMonth(nextRenewal.getMonth() + 1);
    else if (frequency === 'annual') nextRenewal.setFullYear(nextRenewal.getFullYear() + 1);
    else if (frequency === 'quarterly') nextRenewal.setMonth(nextRenewal.getMonth() + 3);

    return {
      id: 'sub_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8),
      merchantName: merchantKey || this._extractMerchantName(message.body),
      merchantInfo: detectedMerchant,
      amount,
      date,
      nextRenewal,
      frequency,
      isRecurring,
      location: message.location || this._extractLocation(message.body),
      source: message.sender || 'Bank Alert',
      rawMessage: message.body.slice(0, 150),
      status: 'active',
      usageScore: Math.floor(Math.random() * 100), // Simulated: how often they use it
      detectedAt: new Date().toISOString()
    };
  },

  /**
   * Auto-detect subscriptions from all simulated messages
   */
  autoDetectFromMessages() {
    if (this.subscriptions.length > 0) return; // Already have data

    const detected = [];
    for (const msg of this.simulatedMessages) {
      const parsed = this.parseMessage(msg);
      if (parsed.isRecurring && parsed.amount && parsed.amount > 0) {
        // Check for duplicates
        const exists = detected.find(s =>
          s.merchantName === parsed.merchantName &&
          Math.abs(new Date(s.date) - new Date(parsed.date)) < 30 * 86400000
        );
        if (!exists) detected.push(parsed);
      }
    }

    this.subscriptions = detected;
    this.saveSubscriptions();
  },

  /**
   * Get subscription insights
   */
  getInsights() {
    const active = this.subscriptions.filter(s => s.status === 'active');
    const totalMonthly = active
      .filter(s => s.frequency === 'monthly')
      .reduce((sum, s) => sum + (s.amount || 0), 0);
    const totalAnnual = active
      .filter(s => s.frequency === 'annual')
      .reduce((sum, s) => sum + (s.amount || 0), 0);
    const totalAll = active.reduce((sum, s) => sum + (s.amount || 0), 0);

    // Ghost subscriptions (low usage)
    const ghosts = active.filter(s => s.usageScore < 20);

    // Upcoming renewals (next 7 days)
    const now = new Date();
    const upcoming = active.filter(s => {
      const diff = new Date(s.nextRenewal) - now;
      return diff > 0 && diff < 7 * 86400000;
    });

    // Category breakdown
    const byCategory = {};
    active.forEach(s => {
      const cat = s.merchantInfo?.category || 'Other';
      if (!byCategory[cat]) byCategory[cat] = { count: 0, total: 0, subscriptions: [] };
      byCategory[cat].count++;
      byCategory[cat].total += (s.amount || 0);
      byCategory[cat].subscriptions.push(s);
    });

    return {
      totalSubscriptions: active.length,
      totalMonthlySpend: totalMonthly,
      totalAnnualSpend: totalAnnual,
      totalYearlyProjection: totalMonthly * 12 + totalAnnual,
      ghostSubscriptions: ghosts,
      ghostMonthlyWaste: ghosts.filter(s => s.frequency === 'monthly').reduce((s, g) => s + (g.amount || 0), 0),
      upcomingRenewals: upcoming,
      upcomingTotal: upcoming.reduce((s, u) => s + (u.amount || 0), 0),
      byCategory,
      allSubscriptions: active
    };
  },

  /**
   * Get calendar view data (next 30 days)
   */
  getCalendarView() {
    const now = new Date();
    const days = [];
    for (let i = 0; i < 30; i++) {
      const day = new Date(now.getTime() + i * 86400000);
      const renewals = this.subscriptions.filter(s => {
        const renewal = new Date(s.nextRenewal);
        return renewal.toDateString() === day.toDateString();
      });
      days.push({
        date: day.toISOString(),
        dayOfMonth: day.getDate(),
        dayName: day.toLocaleDateString('en-US', { weekday: 'short' }),
        isToday: i === 0,
        renewals,
        totalAmount: renewals.reduce((s, r) => s + (r.amount || 0), 0)
      });
    }
    return days;
  },

  /**
   * Mark a subscription for cancellation coaching
   */
  getCancellationAdvice(subscriptionId) {
    const sub = this.subscriptions.find(s => s.id === subscriptionId);
    if (!sub) return null;

    const advices = {
      'netflix': { method: 'App → Account → Cancel Membership', difficulty: 'easy', refundPolicy: 'No refund, access until billing period ends' },
      'spotify': { method: 'Website → Account → Manage Plan → Cancel', difficulty: 'easy', refundPolicy: 'No refund for partial months' },
      'amazon prime': { method: 'Amazon App → Your Account → Prime → End Membership', difficulty: 'easy', refundPolicy: 'Full refund if no Prime benefits used' },
      'google one': { method: 'Google One App → Settings → Cancel Membership', difficulty: 'easy', refundPolicy: 'Pro-rated refund available' },
      'gym': { method: 'Visit gym in person or email support', difficulty: 'medium', refundPolicy: 'Usually requires 30-day notice' },
      'lic': { method: 'Contact LIC branch or agent with policy document', difficulty: 'hard', refundPolicy: 'Surrender value applies after 3 years' },
      'jio fiber': { method: 'MyJio App → JioFiber → Manage Plan → Cancel', difficulty: 'medium', refundPolicy: 'No refund for prepaid plans' }
    };

    const merchantKey = sub.merchantName;
    const advice = advices[merchantKey] || {
      method: 'Check Settings → Subscriptions in the respective app',
      difficulty: 'medium',
      refundPolicy: 'Refund policy varies by provider'
    };

    const isGhost = sub.usageScore < 20;
    const unusedMonths = sub.amount && sub.frequency === 'monthly' ? Math.floor(Math.random() * 6) + 1 : 0;

    return {
      subscription: sub,
      cancellationMethod: advice.method,
      difficulty: advice.difficulty,
      refundPolicy: advice.refundPolicy,
      isGhostSubscription: isGhost,
      estimatedWaste: isGhost ? (sub.amount || 0) * unusedMonths : 0,
      recommendation: isGhost
        ? `You barely use this! Cancelling could save ₹${(sub.amount || 0).toLocaleString()}/month.`
        : 'You use this regularly. Consider if it still provides value.'
    };
  },

  // ─── Helpers ──────────────────────────────────────────────

  _extractMerchantName(body) {
    const knownNames = Object.keys(this.knownMerchants);
    for (const name of knownNames) {
      if (body.toLowerCase().includes(name)) return name;
    }
    // Fallback: extract capitalized words after "at" or "to"
    const atMatch = body.match(/(?:at|to|paid to)\s+([A-Z][A-Z\s&.]+)/);
    return atMatch ? atMatch[1].trim() : 'Unknown Merchant';
  },

  _extractLocation(body) {
    const locMatch = body.match(/(?:at|in)\s+([A-Za-z\s,]+(?:Road|Layout|Market|Nagar|Colony|Sector|Phase|Area|Marg)[^.]*)/i);
    return locMatch ? locMatch[1].trim() : null;
  },

  saveSubscriptions() {
    try { localStorage.setItem('sw_subtrack_data', JSON.stringify(this.subscriptions)); } catch (e) {}
  },

  loadSubscriptions() {
    try {
      const data = localStorage.getItem('sw_subtrack_data');
      if (data) this.subscriptions = JSON.parse(data);
    } catch (e) {}
  }
};

SubTrackAI.init();
