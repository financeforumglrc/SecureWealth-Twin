import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSecurityActions } from '../../context/SecurityContext';

export interface Block {
  index: number;
  timestamp: number;
  action: string;
  data: string;
  previousHash: string;
  hash: string;
}

const STORAGE_KEY = 'sw_blockchain';

async function sha256(message: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

function computeBlockHash(block: Omit<Block, 'hash'>): Promise<string> {
  const payload = `${block.index}${block.previousHash}${block.timestamp}${block.action}${block.data}`;
  return sha256(payload);
}

export function loadChain(): Block[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Block[];
  } catch {
    /* noop */
  }
  return [];
}

export function saveChain(chain: Block[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chain));
  } catch {
    /* noop */
  }
}

export async function createGenesisBlock(): Promise<Block> {
  const block: Omit<Block, 'hash'> = {
    index: 0,
    timestamp: Date.now(),
    action: 'GENESIS',
    data: 'SecureWealth Twin Blockchain Genesis',
    previousHash: '0'.repeat(64),
  };
  const hash = await computeBlockHash(block);
  return { ...block, hash };
}

export async function addBlock(
  chain: Block[],
  action: string,
  data: string
): Promise<Block> {
  const previousBlock = chain[chain.length - 1];
  const newBlock: Omit<Block, 'hash'> = {
    index: chain.length,
    timestamp: Date.now(),
    action,
    data,
    previousHash: previousBlock ? previousBlock.hash : '0'.repeat(64),
  };
  const hash = await computeBlockHash(newBlock);
  const block: Block = { ...newBlock, hash };
  const newChain = [...chain, block];
  saveChain(newChain);
  return block;
}

export async function validateChain(
  chain: Block[]
): Promise<{ valid: boolean; brokenIndex: number | null }> {
  for (let i = 0; i < chain.length; i++) {
    const block = chain[i];
    const recalculated = await computeBlockHash({
      index: block.index,
      timestamp: block.timestamp,
      action: block.action,
      data: block.data,
      previousHash: block.previousHash,
    });
    if (recalculated !== block.hash) {
      return { valid: false, brokenIndex: i };
    }
    if (i > 0 && block.previousHash !== chain[i - 1].hash) {
      return { valid: false, brokenIndex: i };
    }
  }
  return { valid: true, brokenIndex: null };
}

export function simulateTamper(chain: Block[]): boolean {
  if (chain.length === 0) return false;
  const idx = Math.floor(Math.random() * chain.length);
  const corrupted = [...chain];
  corrupted[idx] = {
    ...corrupted[idx],
    data: corrupted[idx].data + ' [CORRUPTED]',
  };
  saveChain(corrupted);
  return true;
}

export default function BlockchainAudit() {
  const { updateBlockchain } = useSecurityActions();
  const [chain, setChain] = useState<Block[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [tampered, setTampered] = useState(false);
  const [brokenIndex, setBrokenIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshChain = useCallback(async () => {
    let current = loadChain();
    if (current.length === 0) {
      const genesis = await createGenesisBlock();
      current = [genesis];
      saveChain(current);
    }
    setChain(current);
    const validation = await validateChain(current);
    setTampered(!validation.valid);
    setBrokenIndex(validation.brokenIndex);
    if (current.length > 0) {
      updateBlockchain(current[current.length - 1].hash);
    }
    setLoading(false);
  }, [updateBlockchain]);

  useEffect(() => {
    refreshChain();
  }, [refreshChain]);

  const handleAddBlock = useCallback(async () => {
    const actions = ['LOGIN', 'TRANSACTION', 'SECURITY_EVENT'];
    const action = actions[Math.floor(Math.random() * actions.length)];
    const dataMap: Record<string, string> = {
      LOGIN: 'User authenticated via biometric passkey',
      TRANSACTION: 'Transfer initiated: $1,250.00 to Account ****8821',
      SECURITY_EVENT: 'eBPF anomaly rule triggered on process PID 4821',
    };
    const current = loadChain();
    const block = await addBlock(current, action, dataMap[action]);
    const newChain = [...current, block];
    setChain(newChain);
    updateBlockchain(block.hash);
    const validation = await validateChain(newChain);
    setTampered(!validation.valid);
    setBrokenIndex(validation.brokenIndex);
  }, [updateBlockchain]);

  const handleSimulateTamper = useCallback(async () => {
    simulateTamper(chain);
    const current = loadChain();
    setChain(current);
    const validation = await validateChain(current);
    setTampered(!validation.valid);
    setBrokenIndex(validation.brokenIndex);
  }, [chain]);

  const latestHash = useMemo(() => {
    if (chain.length === 0) return '-';
    return chain[chain.length - 1].hash.slice(0, 16) + '...';
  }, [chain]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="flex items-center gap-3">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
          <span className="text-sm text-slate-600 dark:text-slate-300">
            Loading blockchain...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
            <i className="fas fa-cubes text-lg" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Blockchain Audit
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Immutable security event ledger
            </p>
          </div>
        </div>
        {tampered ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700 dark:bg-red-900/30 dark:text-red-400">
            <i className="fas fa-exclamation-triangle" />
            CHAIN BROKEN
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
            <i className="fas fa-check-circle" />
            VERIFIED
          </span>
        )}
      </div>

      {tampered && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-300">
          <div className="flex items-center gap-2 font-bold">
            <i className="fas fa-shield-alt" />
            Tampering Detected
          </div>
          <p className="mt-1 text-xs">
            Block integrity failed at index{' '}
            {brokenIndex !== null ? brokenIndex : 'unknown'}. The hash chain no
            longer validates.
          </p>
        </div>
      )}

      <div className="mb-4 grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/50">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Latest Hash
          </div>
          <div className="mt-1 flex items-center gap-2 font-mono text-sm font-semibold text-slate-800 dark:text-slate-200">
            <i className="fas fa-hashtag text-slate-400" />
            {latestHash}
          </div>
        </div>
        <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/50">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Block Count
          </div>
          <div className="mt-1 flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
            <i className="fas fa-layer-group text-slate-400" />
            {chain.length}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleAddBlock}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
        >
          <i className="fas fa-plus" />
          Add Event Block
        </button>
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
        >
          <i className="fas fa-receipt" />
          View Blockchain Receipt
        </button>
        <button
          onClick={handleSimulateTamper}
          className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300 dark:hover:bg-red-900/30"
        >
          <i className="fas fa-bug" />
          Simulate Tamper
        </button>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[80vh] w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-700">
              <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                <i className="fas fa-link mr-2 text-indigo-500" />
                Blockchain Receipt
              </h4>
              <button
                onClick={() => setModalOpen(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-200"
              >
                <i className="fas fa-times" />
              </button>
            </div>
            <div className="overflow-y-auto p-6">
              <div className="space-y-4">
                {chain.map((block) => (
                  <div
                    key={block.hash + block.index}
                    className={`rounded-xl border p-4 ${
                      brokenIndex === block.index
                        ? 'border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-900/20'
                        : 'border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900/30'
                    }`}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Block #{block.index}
                      </span>
                      <span className="text-xs text-slate-400 dark:text-slate-500">
                        {new Date(block.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <div className="space-y-1 font-mono text-xs text-slate-700 dark:text-slate-300">
                      <div>
                        <span className="text-slate-500 dark:text-slate-400">
                          Action:
                        </span>{' '}
                        {block.action}
                      </div>
                      <div>
                        <span className="text-slate-500 dark:text-slate-400">
                          Data:
                        </span>{' '}
                        {block.data}
                      </div>
                      <div className="truncate">
                        <span className="text-slate-500 dark:text-slate-400">
                          Previous:
                        </span>{' '}
                        {block.previousHash.slice(0, 24)}...
                      </div>
                      <div className="truncate">
                        <span className="text-slate-500 dark:text-slate-400">
                          Hash:
                        </span>{' '}
                        <span
                          className={
                            brokenIndex === block.index
                              ? 'text-red-600 dark:text-red-400'
                              : 'text-emerald-600 dark:text-emerald-400'
                          }
                        >
                          {block.hash}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t border-slate-100 px-6 py-4 dark:border-slate-700">
              <button
                onClick={() => setModalOpen(false)}
                className="w-full rounded-lg bg-slate-900 py-2 text-sm font-medium text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
