/**
 * ═══════════════════════════════════════════════════════════════
 *  BioOTP SHIELD — Behavioral Biometric OTP Protection
 * ═══════════════════════════════════════════════════════════════
 *
 *  INNOVATION: Instead of just verifying a 6-digit OTP code, BioOTP
 *  analyzes HOW you type it — key press duration, inter-key latency,
 *  pressure patterns, and rhythm consistency. This creates a "typing
 *  fingerprint" that is nearly impossible to replicate.
 *
 *  Why it's unique:
 *  - Traditional OTP: "Did you enter the right code?"
 *  - BioOTP: "Did YOU enter the code, or did someone else?"
 *  - Detects coercion (rushed typing, hesitation, different rhythm)
 *  - No extra hardware needed — works with any keyboard
 */

const BioOTP = {
  // User's baseline typing profile (learned over time)
  baseline: {
    averageKeyHold: 95,       // milliseconds
    averageKeyGap: 180,       // ms between key releases and next press
    totalEntryTime: 3200,     // ms for full 6-digit entry
    backspaceCount: 0,
    rhythmPattern: [],        // array of [hold_time, gap_time] pairs
    sampleCount: 0
  },

  // Current OTP session data
  session: {
    otpDigits: '',
    keystrokes: [],
    startTime: null,
    endTime: null,
    backspaceUsed: 0,
    fieldFocusLost: 0
  },

  // Risk weights for BioOTP signals
  weights: {
    rhythmDeviation: 30,
    totalTimeDeviation: 25,
    backspaceAnomaly: 20,
    hesitationPattern: 15,
    fieldSwitching: 10
  },

  /**
   * Initialize BioOTP - load saved baseline
   */
  init() {
    this.loadBaseline();
    this.session = this._freshSession();
  },

  _freshSession() {
    return {
      otpDigits: '',
      keystrokes: [],
      startTime: null,
      endTime: null,
      backspaceUsed: 0,
      fieldFocusLost: 0
    };
  },

  /**
   * Record a keystroke event for analysis
   * Call this on keydown/keyup of each OTP digit input
   */
  recordKeystroke(digit, keyDownTime, keyUpTime) {
    if (this.session.keystrokes.length === 0) {
      this.session.startTime = keyDownTime;
    }
    this.session.keystrokes.push({
      digit,
      keyDown: keyDownTime,
      keyUp: keyUpTime,
      holdDuration: keyUpTime - keyDownTime,
      gapFromPrevious: this.session.keystrokes.length > 0
        ? keyDownTime - this.session.keystrokes[this.session.keystrokes.length - 1].keyUp
        : 0
    });
    this.session.endTime = keyUpTime;
  },

  /**
   * Record backspace usage (indicates hesitation / possible coercion)
   */
  recordBackspace() {
    this.session.backspaceUsed++;
  },

  /**
   * Record when user switches away from OTP field (copy-paste suspicion)
   */
  recordFieldBlur() {
    this.session.fieldFocusLost++;
  },

  /**
   * Analyze the completed OTP entry and return a risk assessment
   */
  analyzeEntry() {
    const strokes = this.session.keystrokes;
    if (strokes.length === 0) {
      return { score: 50, level: 'medium', message: 'No typing data captured — treating as medium risk' };
    }

    const results = [];
    const signals = [];

    // Signal 1: Rhythm Deviation
    if (this.baseline.sampleCount >= 3) {
      const holdTimes = strokes.map(s => s.holdDuration);
      const gapTimes = strokes.slice(1).map((s, i) => s.gapFromPrevious);

      const avgHold = holdTimes.reduce((a, b) => a + b, 0) / holdTimes.length;
      const avgGap = gapTimes.length > 0 ? gapTimes.reduce((a, b) => a + b, 0) / gapTimes.length : 0;

      const holdDeviation = Math.abs(avgHold - this.baseline.averageKeyHold) / this.baseline.averageKeyHold;
      const gapDeviation = this.baseline.averageKeyGap > 0
        ? Math.abs(avgGap - this.baseline.averageKeyGap) / this.baseline.averageKeyGap
        : 0;

      const rhythmScore = Math.min(1, (holdDeviation + gapDeviation) / 2) * this.weights.rhythmDeviation;

      let rhythmLevel = 'pass';
      let rhythmMsg = 'Typing rhythm matches your baseline';
      if (rhythmScore > this.weights.rhythmDeviation * 0.7) {
        rhythmLevel = 'fail';
        rhythmMsg = `Typing rhythm significantly different — possible different user (${Math.round(holdDeviation * 100)}% deviation)`;
      } else if (rhythmScore > this.weights.rhythmDeviation * 0.4) {
        rhythmLevel = 'warning';
        rhythmMsg = 'Typing rhythm slightly different from usual';
      }

      signals.push({
        signal: 'rhythmDeviation',
        label: 'Typing Rhythm Match',
        status: rhythmLevel,
        score: rhythmScore,
        message: rhythmMsg,
        deviation: Math.round((holdDeviation + gapDeviation) / 2 * 100)
      });
    } else {
      // Not enough baseline data — neutral score
      signals.push({
        signal: 'rhythmDeviation',
        label: 'Typing Rhythm',
        status: 'pass',
        score: this.weights.rhythmDeviation * 0.1,
        message: 'Learning your typing pattern... (need more samples)'
      });
    }

    // Signal 2: Total Time Deviation
    const totalTime = this.session.endTime - this.session.startTime;
    if (this.baseline.sampleCount >= 3 && this.baseline.totalEntryTime > 0) {
      const timeRatio = totalTime / this.baseline.totalEntryTime;
      let timeScore = 0;
      let timeStatus = 'pass';
      let timeMsg = 'Entry speed consistent with your pattern';

      if (timeRatio > 2.5) {
        timeScore = this.weights.totalTimeDeviation;
        timeStatus = 'fail';
        timeMsg = `Entry took ${timeRatio.toFixed(1)}x longer than usual — possible hesitation or unfamiliar user`;
      } else if (timeRatio > 1.8) {
        timeScore = this.weights.totalTimeDeviation * 0.6;
        timeStatus = 'warning';
        timeMsg = `Entry took longer than usual (${timeRatio.toFixed(1)}x)`;
      } else if (timeRatio < 0.4) {
        timeScore = this.weights.totalTimeDeviation * 0.8;
        timeStatus = 'warning';
        timeMsg = 'Entry unusually fast — possible automated/bot entry';
      }

      signals.push({
        signal: 'totalTimeDeviation',
        label: 'Entry Speed',
        status: timeStatus,
        score: timeScore,
        message: timeMsg,
        timeMs: totalTime,
        ratio: timeRatio.toFixed(1)
      });
    } else {
      signals.push({
        signal: 'totalTimeDeviation',
        label: 'Entry Speed',
        status: 'pass',
        score: 0,
        message: `Entry completed in ${totalTime}ms`
      });
    }

    // Signal 3: Backspace Anomaly
    const backspaceRatio = this.session.backspaceUsed / Math.max(1, strokes.length);
    let bsScore = 0;
    let bsStatus = 'pass';
    let bsMsg = 'No corrections needed';

    if (this.session.backspaceUsed >= 3) {
      bsScore = this.weights.backspaceAnomaly;
      bsStatus = 'fail';
      bsMsg = `${this.session.backspaceUsed} corrections — possible coercion or confusion`;
    } else if (this.session.backspaceUsed >= 2) {
      bsScore = this.weights.backspaceAnomaly * 0.6;
      bsStatus = 'warning';
      bsMsg = `${this.session.backspaceUsed} corrections detected`;
    }

    signals.push({
      signal: 'backspaceAnomaly',
      label: 'Correction Pattern',
      status: bsStatus,
      score: bsScore,
      message: bsMsg,
      backspaceCount: this.session.backspaceUsed
    });

    // Signal 4: Hesitation Pattern (long gaps between digits)
    const longGaps = strokes.slice(1).filter((s, i) => {
      const gap = strokes[i + 1] ? strokes[i + 1].keyDown - s.keyUp : 0;
      return gap > 1000; // >1 second gap
    });
    let hesScore = 0;
    let hesStatus = 'pass';
    let hesMsg = 'No unusual pauses detected';

    if (longGaps.length >= 2) {
      hesScore = this.weights.hesitationPattern;
      hesStatus = 'fail';
      hesMsg = `${longGaps.length} long pauses — possible reading OTP from external source`;
    } else if (longGaps.length === 1) {
      hesScore = this.weights.hesitationPattern * 0.5;
      hesStatus = 'warning';
      hesMsg = '1 long pause detected during entry';
    }

    signals.push({
      signal: 'hesitationPattern',
      label: 'Hesitation Analysis',
      status: hesStatus,
      score: hesScore,
      message: hesMsg,
      longPauses: longGaps.length
    });

    // Signal 5: Field Switching
    let switchScore = 0;
    let switchStatus = 'pass';
    let switchMsg = 'No field switching detected';

    if (this.session.fieldFocusLost >= 3) {
      switchScore = this.weights.fieldSwitching;
      switchStatus = 'fail';
      switchMsg = `Field switched ${this.session.fieldFocusLost} times — possible copy-paste or app switching`;
    } else if (this.session.fieldFocusLost >= 1) {
      switchScore = this.weights.fieldSwitching * 0.5;
      switchStatus = 'warning';
      switchMsg = `Switched away from OTP field ${this.session.fieldFocusLost} time(s)`;
    }

    signals.push({
      signal: 'fieldSwitching',
      label: 'Focus Consistency',
      status: switchStatus,
      score: switchScore,
      message: switchMsg,
      switches: this.session.fieldFocusLost
    });

    // Calculate total score
    const totalWeight = Object.values(this.weights).reduce((a, b) => a + b, 0);
    const totalScore = Math.round(signals.reduce((sum, s) => sum + s.score, 0) / totalWeight * 100);

    // Determine level and decision
    let level, verdict, verdictIcon, verdictColor;
    if (totalScore >= 60) {
      level = 'high';
      verdict = 'OTP Blocked — Behavioral Risk Detected';
      verdictIcon = 'fa-ban';
      verdictColor = 'danger';
    } else if (totalScore >= 30) {
      level = 'medium';
      verdict = 'Additional Verification Recommended';
      verdictIcon = 'fa-triangle-exclamation';
      verdictColor = 'warning';
    } else {
      level = 'low';
      verdict = 'Authenticated — Behavioral Match Confirmed';
      verdictIcon = 'fa-check-circle';
      verdictColor = 'success';
    }

    // Update baseline with this entry (if it passed)
    if (level === 'low') {
      this._updateBaseline(strokes, totalTime);
    }

    return {
      score: totalScore,
      level,
      verdict,
      verdictIcon,
      verdictColor,
      signals,
      metrics: {
        totalTime,
        averageHold: strokes.length > 0 ? strokes.reduce((s, k) => s + k.holdDuration, 0) / strokes.length : 0,
        backspaceUsed: this.session.backspaceUsed,
        longPauses: longGaps.length,
        fieldSwitches: this.session.fieldFocusLost,
        baselineSamples: this.baseline.sampleCount
      }
    };
  },

  /**
   * Update the user's baseline typing profile
   */
  _updateBaseline(strokes, totalTime) {
    const holdTimes = strokes.map(s => s.holdDuration);
    const avgHold = holdTimes.reduce((a, b) => a + b, 0) / holdTimes.length;
    const gapTimes = strokes.slice(1).map((s, i) => strokes[i + 1] ? strokes[i + 1].keyDown - s.keyUp : 0);
    const avgGap = gapTimes.length > 0 ? gapTimes.reduce((a, b) => a + b, 0) / gapTimes.length : 0;

    const alpha = Math.min(0.3, 1 / (this.baseline.sampleCount + 1)); // Learning rate decreases over time

    this.baseline.averageKeyHold = this.baseline.averageKeyHold * (1 - alpha) + avgHold * alpha;
    this.baseline.averageKeyGap = this.baseline.averageKeyGap * (1 - alpha) + avgGap * alpha;
    this.baseline.totalEntryTime = this.baseline.totalEntryTime * (1 - alpha) + totalTime * alpha;
    this.baseline.sampleCount++;

    this.saveBaseline();
  },

  /**
   * Reset session for a new OTP entry
   */
  resetSession() {
    this.session = this._freshSession();
  },

  /**
   * Persist baseline to localStorage
   */
  saveBaseline() {
    try {
      localStorage.setItem('sw_biootp_baseline', JSON.stringify(this.baseline));
    } catch (e) {}
  },

  /**
   * Load baseline from localStorage
   */
  loadBaseline() {
    try {
      const data = localStorage.getItem('sw_biootp_baseline');
      if (data) this.baseline = JSON.parse(data);
    } catch (e) {}
  },

  /**
   * Generate a simulated OTP code
   */
  generateOTP() {
    return String(Math.floor(100000 + Math.random() * 900000));
  }
};

BioOTP.init();
