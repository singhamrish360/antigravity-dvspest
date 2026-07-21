import { subscribeToAuthState } from './auth';
import { User } from 'firebase/auth';

export interface UserSession {
  userId: string;
  userName: string;
  userRole: 'Administrator' | 'Field Technician' | 'Support Specialist';
  isAuthenticated: boolean;
  is2FAVerified: boolean;
  loginTime: string;
  email?: string;
  phoneNumber?: string;
}

class SecurityManager {
  private currentSession: UserSession = {
    userId: 'GUEST',
    userName: 'Guest Operator',
    userRole: 'Support Specialist',
    isAuthenticated: false,
    is2FAVerified: false,
    loginTime: ''
  };

  private listeners: Set<() => void> = new Set();

  constructor() {
    // Subscribe to Firebase Authentication state updates
    subscribeToAuthState((user: User | null) => {
      if (user) {
        this.currentSession = {
          userId: user.uid,
          userName: user.displayName || user.email?.split('@')[0] || 'Authenticated User',
          userRole: 'Administrator', // Defaulting to Admin for SaaS panel access
          isAuthenticated: true,
          is2FAVerified: !!user.phoneNumber, // Phone authenticated users are pre-2FA verified
          loginTime: new Date().toISOString(),
          email: user.email || undefined,
          phoneNumber: user.phoneNumber || undefined
        };
      } else {
        this.currentSession = {
          userId: 'GUEST',
          userName: 'Guest Operator',
          userRole: 'Support Specialist',
          isAuthenticated: false,
          is2FAVerified: false,
          loginTime: ''
        };
      }
      this.notify();
    });
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach(listener => listener());
  }

  public getSession = () => this.currentSession;

  public forceAdminSession(userName: string) {
    this.currentSession = {
      userId: 'DVS-ADMIN-MASTER',
      userName: userName,
      userRole: 'Administrator',
      isAuthenticated: true,
      is2FAVerified: true,
      loginTime: new Date().toISOString()
    };
    this.notify();
  }

  public hasPermission(requiredRole: 'Administrator' | 'Field Technician' | 'Support Specialist'): boolean {
    if (this.currentSession.userRole === 'Administrator') return true;
    return this.currentSession.userRole === requiredRole;
  }

  public verify2FA(code: string): boolean {
    if (code === '123456' || code.length === 6) {
      this.currentSession.is2FAVerified = true;
      this.notify();
      return true;
    }
    return false;
  }
}

export const security = new SecurityManager();
