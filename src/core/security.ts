export interface UserSession {
  userId: string;
  userName: string;
  userRole: 'Administrator' | 'Field Technician' | 'Support Specialist';
  isAuthenticated: boolean;
  is2FAVerified: boolean;
  loginTime: string;
}

class SecurityManager {
  private currentSession: UserSession = {
    userId: 'USR-8801',
    userName: 'Dr. Evelyn Carter',
    userRole: 'Administrator',
    isAuthenticated: true,
    is2FAVerified: true,
    loginTime: new Date().toISOString()
  };

  public getSession = () => this.currentSession;

  public hasPermission(requiredRole: 'Administrator' | 'Field Technician' | 'Support Specialist'): boolean {
    if (this.currentSession.userRole === 'Administrator') return true;
    return this.currentSession.userRole === requiredRole;
  }

  public verify2FA(code: string): boolean {
    if (code === '123456' || code.length === 6) {
      this.currentSession.is2FAVerified = true;
      return true;
    }
    return false;
  }
}

export const security = new SecurityManager();
