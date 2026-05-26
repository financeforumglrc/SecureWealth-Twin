/**
 * ═══════════════════════════════════════════════════════════════
 *  TRANSACTION SENTINEL — AI Cross-Platform Price Guardian
 * ═══════════════════════════════════════════════════════════════
 *
 *  INNOVATION: When you make a transaction (food delivery, grocery,
 *  e-commerce), Sentinel simultaneously checks prices across competing
 *  platforms (Swiggy vs Zomato, Blinkit vs Zepto, Amazon vs Flipkart)
 *  and tells you if you're being overcharged — BEFORE the payment goes through.
 *
 *  This is a first-of-its-kind "pre-transaction price arbitration" system.
 *  No existing banking app does real-time cross-platform price comparison
 *  at the point of transaction.
 */

const TransactionSentinel = {
  // Simulated platform price databases
  platforms: {
    food: {
      swiggy: { name: 'Swiggy', icon: 'fa-utensils', color: '#fc8019', feePercent: 18, deliveryTime: '30-35 min' },
      zomato: { name: 'Zomato', icon: 'fa-bowl-food', color: '#e23744', feePercent: 15, deliveryTime: '28-32 min' },
      eatfit: { name: 'EatFit', icon: 'fa-leaf', color: '#22c55e', feePercent: 12, deliveryTime: '35-40 min' }
    },
    grocery: {
      blinkit: { name: 'Blinkit', icon: 'fa-bolt', color: '#f7c600', feePercent: 10, deliveryTime: '10-15 min' },
      zepto: { name: 'Zepto', icon: 'fa-rocket', color: '#6c3a9e', feePercent: 8, deliveryTime: '10-12 min' },
      bigbasket: { name: 'BigBasket', icon: 'fa-basket-shopping', color: '#84c225', feePercent: 5, deliveryTime: '2-4 hrs' },
      instamart: { name: 'Instamart', icon: 'fa-cart-shopping', color: '#ff3269', feePercent: 12, deliveryTime: '15-20 min' }
    },
    shopping: {
      amazon: { name: 'Amazon', icon: 'fa-box', color: '#ff9900', feePercent: 0, deliveryTime: '1-3 days' },
      flipkart: { name: 'Flipkart', icon: 'fa-truck-fast', color: '#2874f0', feePercent: 0, deliveryTime: '1-2 days' },
      meesho: { name: 'Meesho', icon: 'fa-tag', color: '#e91e63', feePercent: 0, deliveryTime: '3-5 days' }
    }
  },

  // Transaction history for analysis
  transactionLog: [],

  // Simulated price comparison database
  priceDB: {},

  /**
   * Initialize the sentinel with simulated price data
   */
  init() {
    this.generateSimulatedPrices();
    this.loadHistory();
  },

  /**
   * Generate realistic simulated prices for demo
   */
  generateSimulatedPrices() {
    const categories = {
      food: [
        { item: 'Chicken Biryani (Full)', basePrice: 299 },
        { item: 'Paneer Butter Masala', basePrice: 249 },
        { item: 'Margherita Pizza (Medium)', basePrice: 199 },
        { item: 'Veg Burger + Fries Combo', basePrice: 179 },
        { item: 'Dal Makhani + Naan', basePrice: 219 },
        { item: 'Chicken Roll', basePrice: 149 },
        { item: 'Idli Sambar (2 pcs)', basePrice: 89 },
        { item: 'Chole Bhature', basePrice: 129 },
        { item: 'Masala Dosa', basePrice: 159 },
        { item: 'Butter Chicken + Rice', basePrice: 349 }
      ],
      grocery: [
        { item: 'Amul Butter (500g)', basePrice: 260 },
        { item: 'Tata Sampann Chana Dal (1kg)', basePrice: 135 },
        { item: 'Fortune Sunflower Oil (1L)', basePrice: 165 },
        { item: 'Maggi Noodles (Pack of 4)', basePrice: 98 },
        { item: 'Dairy Milk Silk (150g)', basePrice: 170 },
        { item: 'Bananas (6 pcs)', basePrice: 48 },
        { item: 'Paneer Fresh (200g)', basePrice: 89 },
        { item: 'Tomatoes (1kg)', basePrice: 40 },
        { item: 'Basmati Rice (1kg)', basePrice: 120 },
        { item: 'Bread (White/Brown)', basePrice: 45 }
      ],
      shopping: [
        { item: 'Wireless Earbuds', basePrice: 1499 },
        { item: 'USB-C Cable (1m)', basePrice: 299 },
        { item: 'Phone Case', basePrice: 349 },
        { item: 'Power Bank 10000mAh', basePrice: 899 },
        { item: 'Running Shoes', basePrice: 1999 },
        { item: 'Backpack (30L)', basePrice: 799 },
        { item: 'T-Shirt (Cotton)', basePrice: 499 },
        { item: 'Bluetooth Speaker', basePrice: 1299 }
      ]
    };

    // Generate per-platform prices with realistic variance
    for (const [category, platformMap] of Object.entries(this.platforms)) {
      const items = categories[category] || [];
      this.priceDB[category] = {};
      for (const [platformKey, platform] of Object.entries(platformMap)) {
        this.priceDB[category][platformKey] = {};
        for (const item of items) {
          // Each platform has slightly different pricing
          const variance = (Math.random() * 0.25) - 0.05; // -5% to +20%
          const platformPrice = Math.round(item.basePrice * (1 + variance));
          const fee = Math.round(platformPrice * (platform.feePercent / 100));
          this.priceDB[category][platformKey][item.item] = {
            item: item.item,
            itemPrice: platformPrice,
            platformFee: fee,
            totalPrice: platformPrice + fee,
            deliveryTime: platform.deliveryTime,
            couponAvailable: Math.random() > 0.5,
            couponDiscount: Math.random() > 0.5 ? Math.round(platformPrice * 0.15) : 0
          };
        }
      }
    }
  },

  /**
   * Analyze a transaction and compare across platforms
   * @param {Object} transaction - { amount, merchant, category, item }
   * @returns {Object} Comparison report
   */
  analyzeTransaction(transaction) {
    const { amount, merchant, category, item } = transaction;
    const platformData = this.platforms[category];
    if (!platformData) {
      return { analyzed: false, message: 'No comparable platforms available for this category' };
    }

    // Find which platform the user used
    let usedPlatform = null;
    for (const [key, platform] of Object.entries(platformData)) {
      if (merchant.toLowerCase().includes(key) || merchant.toLowerCase().includes(platform.name.toLowerCase())) {
        usedPlatform = { key, ...platform };
        break;
      }
    }

    if (!usedPlatform) {
      usedPlatform = { key: 'unknown', name: merchant, icon: 'fa-store', color: '#64748b', feePercent: 0 };
    }

    // Get prices across platforms for the closest matching item
    const comparison = [];
    let cheapest = null;
    let userPrice = null;

    for (const [platformKey, platform] of Object.entries(platformData)) {
      const prices = this.priceDB[category]?.[platformKey];
      if (!prices) continue;

      // Find closest item match
      let bestMatch = null;
      let bestScore = 0;
      for (const [itemName, priceData] of Object.entries(prices)) {
        const score = this.similarityScore(item || '', itemName);
        if (score > bestScore) {
          bestScore = score;
          bestMatch = priceData;
        }
      }

      if (bestMatch) {
        const entry = {
          platform: platform.name,
          platformKey,
          icon: platform.icon,
          color: platform.color,
          item: bestMatch.item,
          itemPrice: bestMatch.itemPrice,
          platformFee: bestMatch.platformFee,
          totalPrice: bestMatch.totalPrice,
          deliveryTime: bestMatch.deliveryTime,
          couponAvailable: bestMatch.couponAvailable,
          couponDiscount: bestMatch.couponDiscount,
          finalPrice: bestMatch.totalPrice - (bestMatch.couponDiscount || 0),
          isUserPlatform: platformKey === usedPlatform.key
        };

        comparison.push(entry);

        if (platformKey === usedPlatform.key) {
          userPrice = entry;
        }

        if (!cheapest || entry.finalPrice < cheapest.finalPrice) {
          cheapest = entry;
        }
      }
    }

    // Sort by final price ascending
    comparison.sort((a, b) => a.finalPrice - b.finalPrice);

    // Calculate savings/loss
    const savings = userPrice ? userPrice.finalPrice - cheapest.finalPrice : 0;
    const savingsPercent = userPrice ? Math.round((savings / userPrice.finalPrice) * 100) : 0;

    // Generate recommendation
    let recommendation;
    if (savings > 50) {
      recommendation = {
        level: 'overpaying',
        icon: 'fa-triangle-exclamation',
        color: 'danger',
        message: `You're paying ₹${savings} (${Math.abs(savingsPercent)}%) more! Switch to ${cheapest.platform} to save.`,
        action: `Switch to ${cheapest.platform}`,
        savings
      };
    } else if (savings > 20) {
      recommendation = {
        level: 'suboptimal',
        icon: 'fa-circle-info',
        color: 'warning',
        message: `You could save ₹${savings} (${Math.abs(savingsPercent)}%) on ${cheapest.platform}.`,
        action: `Consider ${cheapest.platform} next time`,
        savings
      };
    } else if (savings < 0) {
      recommendation = {
        level: 'best-deal',
        icon: 'fa-trophy',
        color: 'success',
        message: 'Great choice! You got the best price across all platforms.',
        action: null,
        savings: 0
      };
    } else {
      recommendation = {
        level: 'fair',
        icon: 'fa-check-circle',
        color: 'success',
        message: `Price is competitive. Only ₹${savings} difference from the cheapest option.`,
        action: null,
        savings
      };
    }

    // Log this transaction
    this.transactionLog.unshift({
      timestamp: new Date().toISOString(),
      amount,
      merchant,
      category,
      item,
      usedPlatform: usedPlatform.name,
      cheapestPlatform: cheapest.platform,
      savings,
      recommendation: recommendation.level
    });
    if (this.transactionLog.length > 50) this.transactionLog.pop();
    this.saveHistory();

    return {
      analyzed: true,
      transaction: { amount, merchant, category, item },
      userPlatform: { name: usedPlatform.name, finalPrice: userPrice?.finalPrice || amount },
      comparison,
      cheapest: { platform: cheapest.platform, finalPrice: cheapest.finalPrice },
      savings,
      savingsPercent,
      recommendation,
      totalPlatformsCompared: comparison.length
    };
  },

  /**
   * Simple string similarity for item matching
   */
  similarityScore(a, b) {
    a = a.toLowerCase();
    b = b.toLowerCase();
    const wordsA = a.split(/\s+/);
    const wordsB = b.split(/\s+/);
    let matches = 0;
    for (const wa of wordsA) {
      if (wordsB.some(wb => wb.includes(wa) || wa.includes(wb))) matches++;
    }
    return matches / Math.max(wordsA.length, wordsB.length, 1);
  },

  /**
   * Get personalized insights from transaction history
   */
  getInsights() {
    if (this.transactionLog.length < 3) return null;

    const totalSaved = this.transactionLog.reduce((sum, t) => sum + Math.max(0, t.savings), 0);
    const totalOverpaid = this.transactionLog.reduce((sum, t) => sum + Math.max(0, -t.savings), 0);
    const bestPlatforms = {};
    this.transactionLog.forEach(t => {
      if (!bestPlatforms[t.cheapestPlatform]) bestPlatforms[t.cheapestPlatform] = 0;
      bestPlatforms[t.cheapestPlatform]++;
    });
    const topPlatform = Object.entries(bestPlatforms).sort((a, b) => b[1] - a[1])[0];

    return {
      totalTransactions: this.transactionLog.length,
      totalPotentialSavings: totalSaved,
      totalOverpaid: totalOverpaid,
      topSavingPlatform: topPlatform ? topPlatform[0] : null,
      savingsRate: Math.round((totalSaved / this.transactionLog.reduce((s, t) => s + t.amount, 0)) * 100),
      recentTransactions: this.transactionLog.slice(0, 5)
    };
  },

  saveHistory() {
    try { localStorage.setItem('sw_sentinel_log', JSON.stringify(this.transactionLog)); } catch (e) {}
  },

  loadHistory() {
    try {
      const data = localStorage.getItem('sw_sentinel_log');
      if (data) this.transactionLog = JSON.parse(data);
    } catch (e) {}
  }
};

// Auto-init
TransactionSentinel.init();
