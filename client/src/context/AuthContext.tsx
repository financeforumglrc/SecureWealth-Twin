import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import { getAuthState, setAuthState, generateFingerprint } from '../services/authService';

interface AuthStateCtx {
  isAuthenticated: boolean;
  userId: string | null;
  lockoutUntil: number | null;
  failedAttempts: number;
  loading: boolean;
  deviceFingerprint: string | null;
}

type AuthAction =
  | { type: 'LOGIN'; userId: string }
  | { type: 'LOGOUT' }
  | { type: 'FAIL_ATTEMPT' }
  | { type: 'SET_LOCKOUT'; until: number | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'INIT'; state: AuthStateCtx };

function authReducer(state: AuthStateCtx, action: AuthAction): AuthStateCtx {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, isAuthenticated: true, userId: action.userId, failedAttempts: 0, lockoutUntil: null };
    case 'LOGOUT':
      return { ...state, isAuthenticated: false, userId: null, failedAttempts: 0 };
    case 'FAIL_ATTEMPT':
      const attempts = state.failedAttempts + 1;
      if (attempts >= 3) {
        const until = Date.now() + 60000;
        setAuthState({ failedAttempts: attempts, lockoutUntil: until });
        return { ...state, failedAttempts: attempts, lockoutUntil: until };
      }
      setAuthState({ failedAttempts: attempts });
      return { ...state, failedAttempts: attempts };
    case 'SET_LOCKOUT':
      return { ...state, lockoutUntil: action.until };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'INIT':
      return { ...action.state, loading: false };
    default:
      return state;
  }
}

const AuthContext = createContext<{
  state: AuthStateCtx;
  dispatch: React.Dispatch<AuthAction>;
} | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, {
    isAuthenticated: false,
    userId: null,
    lockoutUntil: null,
    failedAttempts: 0,
    loading: true,
    deviceFingerprint: null,
  });

  useEffect(() => {
    const stored = getAuthState();
    const fp = generateFingerprint();
    dispatch({
      type: 'INIT',
      state: {
        isAuthenticated: stored.isAuthenticated && !!stored.token,
        userId: stored.userId,
        lockoutUntil: stored.lockoutUntil,
        failedAttempts: stored.failedAttempts || 0,
        loading: false,
        deviceFingerprint: fp,
      },
    });
  }, []);

  // Check lockout expiry periodically
  useEffect(() => {
    if (!state.lockoutUntil) return;
    const timer = setInterval(() => {
      if (Date.now() > state.lockoutUntil!) {
        dispatch({ type: 'SET_LOCKOUT', until: null });
        setAuthState({ lockoutUntil: null, failedAttempts: 0 });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [state.lockoutUntil]);

  return <AuthContext.Provider value={{ state, dispatch }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
