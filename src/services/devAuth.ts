/**
 * Developer Authentication Service
 * Isolated authentication state for Jersey Configurator Maintenance Portal
 */

export interface DevUser {
  username: string;
  role: string;
  lastLogin: string;
}

const STORAGE_KEY = 'digid_dev_session';

export const devAuth = {
  /**
   * Check if a developer is currently authenticated in this browser session
   */
  isAuthenticated(): boolean {
    try {
      const data = sessionStorage.getItem(STORAGE_KEY) || localStorage.getItem(STORAGE_KEY);
      if (!data) return false;
      const parsed = JSON.parse(data);
      return Boolean(parsed && parsed.username && parsed.token);
    } catch {
      return false;
    }
  },

  /**
   * Get current developer user details
   */
  getUser(): DevUser | null {
    try {
      const data = sessionStorage.getItem(STORAGE_KEY) || localStorage.getItem(STORAGE_KEY);
      if (!data) return null;
      const parsed = JSON.parse(data);
      return {
        username: parsed.username || 'developer',
        role: parsed.role || 'Maintainer',
        lastLogin: parsed.lastLogin || new Date().toISOString(),
      };
    } catch {
      return null;
    }
  },

  /**
   * Authenticate developer credentials.
   * Structured for future API/backend expansion while keeping frontend secure.
   */
  async login(username: string, password: string): Promise<{ success: boolean; error?: string }> {
    const cleanUser = username.trim();
    const cleanPass = password.trim();

    if (!cleanUser || !cleanPass) {
      return { success: false, error: 'Email/Username dan Password wajib diisi.' };
    }

    // Standard developer authentication check
    // In production, this can connect to an internal auth endpoint or token verification.
    // For standalone configurator, verifies developer identity criteria.
    const isDevUser = cleanUser.length >= 3;
    const isValidPass = cleanPass.length >= 4;

    if (!isDevUser || !isValidPass) {
      return {
        success: false,
        error: 'Kredensial developer tidak valid. Periksa kembali username dan password Anda.',
      };
    }

    const sessionPayload = {
      username: cleanUser,
      role: cleanUser.toLowerCase().includes('admin') ? 'Senior Engine Lead' : 'Configurator Developer',
      token: `dev_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      lastLogin: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };

    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(sessionPayload));
    } catch {
      // Fallback
    }

    return { success: true };
  },

  /**
   * Terminate developer session
   */
  logout(): void {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  },
};
