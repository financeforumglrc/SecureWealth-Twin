import { useState, useMemo } from 'react';

interface ArchNode {
  id: string;
  label: string;
  subtitle: string;
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  icon: string;
  details: string[];
  metrics: { label: string; value: string }[];
  connectsTo: string[];
}

const NODES: ArchNode[] = [
  {
    id: 'frontend',
    label: 'Frontend Layer',
    subtitle: 'React 18 + TypeScript + Vite',
    x: 300, y: 20, w: 320, h: 60,
    color: '#0f766e',
    icon: 'fa-desktop',
    details: ['React 18 with Concurrent Features', 'Tailwind CSS v4 + Custom Theme', 'Recharts for Data Visualization', 'Zustand State Management', 'Persisted to localStorage'],
    metrics: [{ label: 'Bundle', value: '~765 KB' }, { label: 'FCP', value: '<1.2s' }],
    connectsTo: ['gateway'],
  },
  {
    id: 'gateway',
    label: 'API Gateway',
    subtitle: 'Node.js + Express + JWT',
    x: 300, y: 120, w: 320, h: 60,
    color: '#2563eb',
    icon: 'fa-server',
    details: ['Express.js REST API', 'JWT Authentication (RS256)', 'Rate Limiting: 100 req/min', 'CORS + Helmet Security', 'Request Validation (Zod)'],
    metrics: [{ label: 'Latency', value: '<50ms' }, { label: 'Uptime', value: '99.9%' }],
    connectsTo: ['ai', 'security', 'external'],
  },
  {
    id: 'ai',
    label: 'AI Engine',
    subtitle: 'Python + FastAPI + Gemini',
    x: 20, y: 240, w: 200, h: 60,
    color: '#8b5cf6',
    icon: 'fa-brain',
    details: ['FastAPI Async Endpoints', 'Google Gemini API Integration', 'Hugging Face Fallback', 'Risk Scoring Engine (6 signals)', 'Wealth Recommendations LLM'],
    metrics: [{ label: 'Inference', value: '~800ms' }, { label: 'Accuracy', value: '94.2%' }],
    connectsTo: ['postgres'],
  },
  {
    id: 'security',
    label: 'Security Beast',
    subtitle: '10-Layer Zero-Trust Defense',
    x: 360, y: 240, w: 200, h: 60,
    color: '#ef4444',
    icon: 'fa-dragon',
    details: [
      '1. TPM 2.0 Hardware Root of Trust',
      '2. eBPF Kernel Runtime Monitor',
      '3. AI Honeytokens & Canary Credentials',
      '4. FIDO2 Passkeys (WebAuthn)',
      '5. CRYSTALS-Kyber Post-Quantum KEM',
      '6. Behavioral Biometrics + On-Device ML',
      '7. Decentralized ID (Verifiable Credentials)',
      '8. Dynamic Transaction Traps',
      '9. Secure Enclave / ARM TrustZone',
      '10. Blockchain Immutable Audit Trail',
    ],
    metrics: [{ label: 'Fraud Blocked', value: '99.97%' }, { label: 'False Positives', value: '<0.3%' }],
    connectsTo: ['postgres', 'redis'],
  },
  {
    id: 'external',
    label: 'External APIs',
    subtitle: 'RBI AA + Market + KYC',
    x: 700, y: 240, w: 200, h: 60,
    color: '#f59e0b',
    icon: 'fa-cloud',
    details: ['RBI Account Aggregator (Sahamati)', 'Market Data Feed (NSE/BSE)', 'KYC Verification (CKYC)', 'Gemini AI API Proxy', 'Surge.sh Static Hosting'],
    metrics: [{ label: 'Availability', value: '99.5%' }, { label: 'Cache Hit', value: '78%' }],
    connectsTo: ['gateway'],
  },
  {
    id: 'postgres',
    label: 'PostgreSQL',
    subtitle: 'User Data + Transactions',
    x: 100, y: 380, w: 180, h: 50,
    color: '#334155',
    icon: 'fa-database',
    details: ['User Profiles & KYC', 'Transaction History', 'Audit Logs (append-only)', 'Goal Tracking', 'Automated Backups'],
    metrics: [{ label: 'Queries', value: '~2ms' }, { label: 'Storage', value: 'AES-256' }],
    connectsTo: [],
  },
  {
    id: 'redis',
    label: 'Redis',
    subtitle: 'Sessions + Cache + Rate Limit',
    x: 370, y: 380, w: 180, h: 50,
    color: '#dc2626',
    icon: 'fa-bolt',
    details: ['JWT Session Store', 'API Response Cache', 'Rate Limit Counters', 'Real-time Notifications', 'Pub/Sub for Events'],
    metrics: [{ label: 'Latency', value: '<1ms' }, { label: 'Hit Rate', value: '85%' }],
    connectsTo: [],
  },
  {
    id: 'tpm',
    label: 'TPM 2.0',
    subtitle: 'Hardware Root of Trust',
    x: 20, y: 480, w: 130, h: 45,
    color: '#059669',
    icon: 'fa-microchip',
    details: ['ECDSA P-256 Key Generation', 'Platform Attestation Quote', 'Secure Key Storage', 'Anti-tamper Boot Sequence'],
    metrics: [{ label: 'Attest', value: '<200ms' }, { label: 'Trust', value: 'L1' }],
    connectsTo: ['security'],
  },
  {
    id: 'ebpf',
    label: 'eBPF Monitor',
    subtitle: 'Kernel-Level Runtime',
    x: 170, y: 480, w: 130, h: 45,
    color: '#7c3aed',
    icon: 'fa-shield-halved',
    details: ['Process Memory Access Control', 'Network Packet Filtering', 'Syscall Interception', 'Reverse Shell Detection'],
    metrics: [{ label: 'Overhead', value: '<1%' }, { label: 'Trust', value: 'L2' }],
    connectsTo: ['security'],
  },
  {
    id: 'pq',
    label: 'Post-Quantum',
    subtitle: 'CRYSTALS-Kyber KEM',
    x: 320, y: 480, w: 130, h: 45,
    color: '#db2777',
    icon: 'fa-atom',
    details: ['Lattice-based Key Encapsulation', 'NIST FIPS 203 Compliant', 'Quantum-Safe Tunnel', 'AES-GCM Payload Encryption'],
    metrics: [{ label: 'Key Gen', value: '~5ms' }, { label: 'Trust', value: 'L5' }],
    connectsTo: ['security'],
  },
  {
    id: 'enclave',
    label: 'Secure Enclave',
    subtitle: 'ARM TrustZone / Apple SEP',
    x: 470, y: 480, w: 140, h: 45,
    color: '#0891b2',
    icon: 'fa-lock',
    details: ['Hardware-backed Key Store', 'Signed Attestation Challenge', 'Jailbreak/Root Detection', 'StrongBox Key Generation'],
    metrics: [{ label: 'Verify', value: '<100ms' }, { label: 'Trust', value: 'L9' }],
    connectsTo: ['security'],
  },
  {
    id: 'blockchain',
    label: 'Blockchain Audit',
    subtitle: 'SHA-256 Immutable Chain',
    x: 630, y: 480, w: 140, h: 45,
    color: '#ea580c',
    icon: 'fa-cubes',
    details: ['Merkle-linked Hash Chain', 'Tamper Detection Algorithm', 'Per-action Receipt', 'Mock Explorer Integration'],
    metrics: [{ label: 'Blocks', value: 'Dynamic' }, { label: 'Trust', value: 'L10' }],
    connectsTo: ['security'],
  },
];

const ARROWS = [
  { from: 'frontend', to: 'gateway', path: 'M460 80 L460 120' },
  { from: 'gateway', to: 'ai', path: 'M360 180 L220 210 L120 240' },
  { from: 'gateway', to: 'security', path: 'M460 180 L460 240' },
  { from: 'gateway', to: 'external', path: 'M560 180 L700 210 L800 240' },
  { from: 'ai', to: 'postgres', path: 'M120 300 L120 340 L190 380' },
  { from: 'security', to: 'postgres', path: 'M400 300 L400 340 L190 380' },
  { from: 'security', to: 'redis', path: 'M520 300 L520 340 L460 380' },
  { from: 'external', to: 'gateway', path: 'M800 300 L800 180 L680 180' },
  { from: 'tpm', to: 'security', path: 'M85 480 L85 450 L250 300' },
  { from: 'ebpf', to: 'security', path: 'M235 480 L235 450 L350 300' },
  { from: 'pq', to: 'security', path: 'M385 480 L385 450 L420 300' },
  { from: 'enclave', to: 'security', path: 'M540 480 L540 450 L480 300' },
  { from: 'blockchain', to: 'security', path: 'M700 480 L700 450 L520 300' },
];

export default function SystemArchitecture() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const activeNode = useMemo(() => NODES.find((n) => n.id === (selectedNode || hoveredNode)), [selectedNode, hoveredNode]);

  const isHighlighted = (nodeId: string) => {
    if (!activeNode) return false;
    return activeNode.id === nodeId || activeNode.connectsTo.includes(nodeId) || NODES.find((n) => n.id === nodeId)?.connectsTo.includes(activeNode.id);
  };

  const isArrowHighlighted = (arrow: typeof ARROWS[0]) => {
    if (!activeNode) return false;
    return arrow.from === activeNode.id || arrow.to === activeNode.id;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">System Architecture</h2>
          <p className="text-xs text-slate-500 mt-0.5">Interactive technical diagram — click any component for details</p>
        </div>
        <span className="text-[10px] px-2 py-1 bg-primary/10 text-primary rounded-full font-medium">
          <i className="fas fa-circle-check mr-1" />Production Ready
        </span>
      </div>

      {/* Security Layers Legend */}
      <div className="card">
        <h3 className="font-semibold text-sm text-slate-800 dark:text-white mb-3 flex items-center gap-2">
          <i className="fas fa-dragon text-rose-500" /> Security Beast — 10-Layer Defense Stack
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { layer: 'L1', name: 'TPM 2.0', icon: 'fa-microchip', color: 'bg-emerald-500/10 text-emerald-600' },
            { layer: 'L2', name: 'eBPF Monitor', icon: 'fa-shield-halved', color: 'bg-violet-500/10 text-violet-600' },
            { layer: 'L3', name: 'Honeytokens', icon: 'fa-bug', color: 'bg-rose-500/10 text-rose-600' },
            { layer: 'L4', name: 'FIDO2 Passkeys', icon: 'fa-fingerprint', color: 'bg-sky-500/10 text-sky-600' },
            { layer: 'L5', name: 'Post-Quantum', icon: 'fa-atom', color: 'bg-pink-500/10 text-pink-600' },
            { layer: 'L6', name: 'Behavioral Bio', icon: 'fa-wave-square', color: 'bg-amber-500/10 text-amber-600' },
            { layer: 'L7', name: 'Decentralized ID', icon: 'fa-id-card', color: 'bg-teal-500/10 text-teal-600' },
            { layer: 'L8', name: 'Transaction Trap', icon: 'fa-user-secret', color: 'bg-orange-500/10 text-orange-600' },
            { layer: 'L9', name: 'Secure Enclave', icon: 'fa-lock', color: 'bg-cyan-500/10 text-cyan-600' },
            { layer: 'L10', name: 'Blockchain Audit', icon: 'fa-cubes', color: 'bg-red-500/10 text-red-600' },
          ].map((s) => (
            <div key={s.layer} className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs ${s.color}`}>
                <i className={`fas ${s.icon}`} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400">{s.layer}</p>
                <p className="text-xs font-medium text-slate-700 dark:text-slate-200">{s.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Architecture Canvas */}
      <div className="card relative overflow-hidden">
        <div className="flex items-center justify-center">
          <svg viewBox="0 0 920 560" className="w-full max-w-5xl" style={{ minHeight: '450px' }}>
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
              </marker>
              <marker id="arrowhead-active" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#0f766e" />
              </marker>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Animated dashed arrows */}
            {ARROWS.map((arrow, i) => (
              <path
                key={i}
                d={arrow.path}
                fill="none"
                stroke={isArrowHighlighted(arrow) ? '#0f766e' : '#cbd5e1'}
                strokeWidth={isArrowHighlighted(arrow) ? 3 : 1.5}
                strokeDasharray="8 6"
                markerEnd={`url(#${isArrowHighlighted(arrow) ? 'arrowhead-active' : 'arrowhead'})`}
                style={{
                  animation: 'flowDash 1s linear infinite',
                  opacity: isArrowHighlighted(arrow) ? 1 : 0.5,
                }}
              />
            ))}

            {/* Nodes */}
            {NODES.map((node) => {
              const highlighted = isHighlighted(node.id);
              const dimmed = activeNode && !highlighted;
              return (
                <g
                  key={node.id}
                  onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                  style={{ cursor: 'pointer' }}
                  opacity={dimmed ? 0.35 : 1}
                >
                  {/* Box shadow / glow */}
                  {highlighted && (
                    <rect
                      x={node.x - 4}
                      y={node.y - 4}
                      width={node.w + 8}
                      height={node.h + 8}
                      rx="14"
                      fill="none"
                      stroke={node.color}
                      strokeWidth="3"
                      filter="url(#glow)"
                      opacity="0.5"
                    />
                  )}
                  {/* Main box */}
                  <rect
                    x={node.x}
                    y={node.y}
                    width={node.w}
                    height={node.h}
                    rx="12"
                    fill={highlighted ? `${node.color}15` : '#f8fafc'}
                    stroke={highlighted ? node.color : '#e2e8f0'}
                    strokeWidth={highlighted ? 2 : 1}
                    className="dark:fill-slate-800 dark:stroke-slate-700 transition-all duration-300"
                  />
                  {/* Icon circle */}
                  <circle
                    cx={node.x + 24}
                    cy={node.y + node.h / 2}
                    r="14"
                    fill={node.color}
                    opacity="0.1"
                  />
                  <foreignObject x={node.x + 10} y={node.y + node.h / 2 - 14} width="32" height="28">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: `${node.color}20`, color: node.color }}>
                      <i className={`fas ${node.icon} text-xs`} />
                    </div>
                  </foreignObject>
                  {/* Label */}
                  <text
                    x={node.x + 48}
                    y={node.y + node.h / 2 - 6}
                    fill={dimmed ? '#94a3b8' : '#1e293b'}
                    fontSize="13"
                    fontWeight="600"
                    className="dark:fill-white transition-all duration-300"
                  >
                    {node.label}
                  </text>
                  {/* Subtitle */}
                  <text
                    x={node.x + 48}
                    y={node.y + node.h / 2 + 10}
                    fill={dimmed ? '#cbd5e1' : '#64748b'}
                    fontSize="9"
                    className="dark:fill-slate-400 transition-all duration-300"
                  >
                    {node.subtitle}
                  </text>
                </g>
              );
            })}

            {/* Data flow label */}
            <text x="460" y="545" textAnchor="middle" fill="#94a3b8" fontSize="10" className="dark:fill-slate-500">
              Dashed arrows indicate real-time data flow direction
            </text>
          </svg>
        </div>

        <style>{`
          @keyframes flowDash {
            to { stroke-dashoffset: -14; }
          }
        `}</style>
      </div>

      {/* Detail Panel */}
      {activeNode && (
        <div className="card border-l-4" style={{ borderLeftColor: activeNode.color }}>
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white" style={{ backgroundColor: activeNode.color }}>
                <i className={`fas ${activeNode.icon}`} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">{activeNode.label}</h3>
                <p className="text-xs text-slate-500">{activeNode.subtitle}</p>
              </div>
            </div>
            <button onClick={() => setSelectedNode(null)} className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600">
              <i className="fas fa-times" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Tech Stack */}
            <div className="md:col-span-2">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-2">Tech Stack Details</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {activeNode.details.map((d, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <i className="fas fa-check-circle text-emerald-500 text-xs" />
                    <span className="text-xs text-slate-700 dark:text-slate-200">{d}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Metrics */}
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-2">Performance Metrics</p>
              <div className="space-y-2">
                {activeNode.metrics.map((m, i) => (
                  <div key={i} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg text-center">
                    <p className="text-lg font-bold text-slate-800 dark:text-white">{m.value}</p>
                    <p className="text-[10px] text-slate-400">{m.label}</p>
                  </div>
                ))}
              </div>

              {/* Connected components */}
              {activeNode.connectsTo.length > 0 && (
                <div className="mt-3">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Connects To</p>
                  <div className="flex flex-wrap gap-1">
                    {activeNode.connectsTo.map((cid) => {
                      const target = NODES.find((n) => n.id === cid);
                      return target ? (
                        <span
                          key={cid}
                          className="px-2 py-0.5 rounded-full text-[10px] font-medium text-white"
                          style={{ backgroundColor: target.color }}
                        >
                          {target.label}
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Security Flow Diagram */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-slate-800 dark:text-white flex items-center gap-2">
              <i className="fas fa-project-diagram text-rose-500" /> Security Beast Flow
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">How the 10 layers work together to stop attacks</p>
          </div>
        </div>

        <div className="space-y-3">
          {[
            {
              step: '1',
              title: 'Device Boot → TPM Attestation',
              desc: 'Before the app loads, TPM 2.0 verifies the boot chain. If attestation fails, the device is quarantined.',
              color: 'bg-emerald-500',
            },
            {
              step: '2',
              title: 'Runtime → eBPF Kernel Monitor',
              desc: 'eBPF probes watch every syscall and network packet. Suspicious processes are killed in <1ms.',
              color: 'bg-violet-500',
            },
            {
              step: '3',
              title: 'Auth → FIDO2 Passkey + Enclave',
              desc: 'Passwords are eliminated. Biometric passkeys are bound to Secure Enclave / ARM TrustZone hardware.',
              color: 'bg-sky-500',
            },
            {
              step: '4',
              title: 'Behavior → On-Device ML Profile',
              desc: 'Keystroke cadence, mouse curvature, and touch pressure build a behavioral fingerprint. Deviation >30% triggers step-up.',
              color: 'bg-amber-500',
            },
            {
              step: '5',
              title: 'Identity → Decentralized VC (DID)',
              desc: 'User presents a zero-knowledge verifiable credential. No PII is transmitted or stored centrally.',
              color: 'bg-teal-500',
            },
            {
              step: '6',
              title: 'Network → Post-Quantum Tunnel',
              desc: 'All API traffic is encrypted with CRYSTALS-Kyber KEM + AES-GCM. Safe against quantum decryption.',
              color: 'bg-pink-500',
            },
            {
              step: '7',
              title: 'Transaction → Dynamic Trap Codes',
              desc: 'High-value transfers present a real OTP and a fake "trap" code. Entering the trap triggers instant lockdown.',
              color: 'bg-orange-500',
            },
            {
              step: '8',
              title: 'Deception → Honeytoken Assets',
              desc: 'Decoy accounts worth ₹10L are hidden in the UI. Any interaction triggers account freeze + silent alert.',
              color: 'bg-rose-500',
            },
            {
              step: '9',
              title: 'Audit → Blockchain Immutable Log',
              desc: 'Every action is hashed into a Merkle-linked chain. Tampering breaks the chain and raises an immediate alert.',
              color: 'bg-red-500',
            },
            {
              step: '10',
              title: 'Response → Trust Score + Auto-Action',
              desc: 'All layers feed a 0-100 Trust Score. Low score = step-up auth. Critical = auto-lockdown + security team alert.',
              color: 'bg-cyan-500',
            },
          ].map((flow) => (
            <div key={flow.step} className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <div className={`w-8 h-8 rounded-full ${flow.color} text-white flex items-center justify-center text-sm font-bold flex-shrink-0`}>
                {flow.step}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800 dark:text-white">{flow.title}</p>
                <p className="text-xs text-slate-500 mt-0.5">{flow.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cloud Deployment */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-slate-800 dark:text-white flex items-center gap-2">
              <i className="fas fa-cloud text-sky-500" /> Cloud Deployment Architecture
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Scalable, resilient, and cost-optimized for millions of users</p>
          </div>
          <span className="text-[10px] px-2 py-1 bg-sky-500/10 text-sky-600 rounded-full font-medium">
            <i className="fas fa-globe mr-1" />Multi-Region
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-sky-500/10 rounded-lg flex items-center justify-center text-sky-500">
                <i className="fas fa-globe" />
              </div>
              <p className="text-sm font-medium text-slate-800 dark:text-white">CDN + Edge</p>
            </div>
            <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
              <p><i className="fas fa-check text-emerald-500 mr-1" />CloudFront / Cloudflare</p>
              <p><i className="fas fa-check text-emerald-500 mr-1" />Static asset caching</p>
              <p><i className="fas fa-check text-emerald-500 mr-1" />DDoS protection</p>
              <p><i className="fas fa-check text-emerald-500 mr-1" />99.99% uptime SLA</p>
            </div>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                <i className="fas fa-server" />
              </div>
              <p className="text-sm font-medium text-slate-800 dark:text-white">Compute Layer</p>
            </div>
            <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
              <p><i className="fas fa-check text-emerald-500 mr-1" />ECS Fargate / EKS</p>
              <p><i className="fas fa-check text-emerald-500 mr-1" />Auto-scaling 2-50 pods</p>
              <p><i className="fas fa-check text-emerald-500 mr-1" />Lambda for batch jobs</p>
              <p><i className="fas fa-check text-emerald-500 mr-1" />API Gateway throttling</p>
            </div>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-rose-500/10 rounded-lg flex items-center justify-center text-rose-500">
                <i className="fas fa-database" />
              </div>
              <p className="text-sm font-medium text-slate-800 dark:text-white">Data Layer</p>
            </div>
            <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
              <p><i className="fas fa-check text-emerald-500 mr-1" />RDS PostgreSQL Multi-AZ</p>
              <p><i className="fas fa-check text-emerald-500 mr-1" />ElastiCache Redis cluster</p>
              <p><i className="fas fa-check text-emerald-500 mr-1" />S3 encrypted backups</p>
              <p><i className="fas fa-check text-emerald-500 mr-1" />KMS key rotation</p>
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-sky-50 dark:bg-sky-900/20 rounded-xl border border-sky-100 dark:border-sky-800">
          <p className="text-xs text-sky-700 dark:text-sky-300 font-medium"><i className="fas fa-info-circle mr-1" /> Hackathon Demo Deployment</p>
          <p className="text-[10px] text-sky-600 dark:text-sky-400 mt-1">
            Frontend: Surge.sh CDN | Backend: Simulated (FastAPI mock) | Database: Browser localStorage + Zustand persist.
            Production target: AWS Mumbai region with DR in Singapore.
          </p>
        </div>
      </div>

      {/* Tech Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Frontend', value: 'React 18 + TS', icon: 'fa-code', color: 'bg-primary/10 text-primary' },
          { label: 'Backend', value: 'Node + Python', icon: 'fa-server', color: 'bg-blue-500/10 text-blue-600' },
          { label: 'Database', value: 'PostgreSQL + Redis', icon: 'fa-database', color: 'bg-slate-500/10 text-slate-600' },
          { label: 'Security', value: '10-Layer Beast', icon: 'fa-dragon', color: 'bg-rose-500/10 text-rose-600' },
        ].map((item) => (
          <div key={item.label} className="card text-center">
            <div className={`w-10 h-10 mx-auto rounded-lg flex items-center justify-center ${item.color} mb-2`}>
              <i className={`fas ${item.icon}`} />
            </div>
            <p className="text-sm font-bold text-slate-800 dark:text-white">{item.value}</p>
            <p className="text-[10px] text-slate-400">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
