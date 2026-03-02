import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export type AppRole = 'applicant' | 'instructor' | 'university' | 'admin';

// ─── Mock demo accounts ────────────────────────────────────────────────────
const MOCK_USERS: Record<string, { password: string; role: AppRole; fullName: string }> = {
  'student@demo.com': { password: 'demo1234', role: 'applicant', fullName: 'Demo Student' },
  'instructor@demo.com': { password: 'demo1234', role: 'instructor', fullName: 'Demo Instructor' },
  'university@demo.com': { password: 'demo1234', role: 'university', fullName: 'Demo University' },
  'admin@demo.com': { password: 'demo1234', role: 'admin', fullName: 'Demo Admin' },
};

const MOCK_SESSION_KEY = 'learnwise_mock_session';

interface MockSession {
  email: string;
  role: AppRole;
  fullName: string;
  id: string;
}

const saveMockSession = (session: MockSession) =>
  localStorage.setItem(MOCK_SESSION_KEY, JSON.stringify(session));

const loadMockSession = (): MockSession | null => {
  try {
    const raw = localStorage.getItem(MOCK_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const clearMockSession = () => localStorage.removeItem(MOCK_SESSION_KEY);

// Build a minimal-shaped mock User object so the rest of the app just works
const makeMockUser = (session: MockSession): User =>
({
  id: session.id,
  email: session.email,
  user_metadata: { full_name: session.fullName },
  app_metadata: {},
  aud: 'authenticated',
  created_at: new Date().toISOString(),
} as unknown as User);
// ───────────────────────────────────────────────────────────────────────────

interface AuthContextType {
  user: User | null;
  session: Session | null;
  role: AppRole | null;
  loading: boolean;
  isMockUser: boolean;
  signUp: (email: string, password: string, role: AppRole, fullName: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<AppRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMockUser, setIsMockUser] = useState(false);

  const fetchUserRole = async (userId: string) => {
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching user role:', error);
      return null;
    }

    return data?.role as AppRole;
  };

  useEffect(() => {
    // Check for a persisted mock session first
    const mockSession = loadMockSession();
    if (mockSession) {
      setUser(makeMockUser(mockSession));
      setRole(mockSession.role);
      setIsMockUser(true);
      setLoading(false);
      return; // don't start supabase listener while mock session is active
    }

    // Real Supabase listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsMockUser(false);

        if (session?.user) {
          fetchUserRole(session.user.id).then((role) => {
            setRole(role);
            setLoading(false);
          });
        } else {
          setRole(null);
          setLoading(false);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        fetchUserRole(session.user.id).then((role) => {
          setRole(role);
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // ── Sign In ──────────────────────────────────────────────────────────────
  const signIn = async (email: string, password: string) => {
    const mock = MOCK_USERS[email.toLowerCase()];
    if (mock) {
      if (mock.password !== password) {
        return { error: new Error('Invalid email or password. Please try again.') };
      }
      const mockSession: MockSession = {
        email: email.toLowerCase(),
        role: mock.role,
        fullName: mock.fullName,
        id: `mock-${mock.role}`,
      };
      saveMockSession(mockSession);
      setUser(makeMockUser(mockSession));
      setRole(mock.role);
      setIsMockUser(true);
      return { error: null };
    }

    // Real Supabase sign-in
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  // ── Sign Up ──────────────────────────────────────────────────────────────
  const signUp = async (email: string, password: string, selectedRole: AppRole, fullName: string) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: redirectUrl },
      });

      if (error) throw error;

      if (data.user) {
        const dbRole = selectedRole as "applicant" | "instructor" | "university";
        await supabase.from('profiles').insert([{ user_id: data.user.id, full_name: fullName }]);
        await supabase.from('user_roles').insert([{ user_id: data.user.id, role: dbRole }]);
        setRole(selectedRole);
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  // ── Sign Out ─────────────────────────────────────────────────────────────
  const signOut = async () => {
    if (isMockUser) {
      clearMockSession();
      setUser(null);
      setSession(null);
      setRole(null);
      setIsMockUser(false);
      return;
    }
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, role, loading, isMockUser, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
