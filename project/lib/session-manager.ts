export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  // Try sessionStorage first to ensure tab isolation
  let token = sessionStorage.getItem('accessToken');
  if (!token) {
    // Fallback to localStorage and copy it
    token = localStorage.getItem('accessToken');
    if (token) {
      sessionStorage.setItem('accessToken', token);
      const refresh = localStorage.getItem('refreshToken');
      if (refresh) sessionStorage.setItem('refreshToken', refresh);
      const user = localStorage.getItem('user');
      if (user) sessionStorage.setItem('user', user);
    }
  }
  return token;
}

export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  let token = sessionStorage.getItem('refreshToken');
  if (!token) {
    token = localStorage.getItem('refreshToken');
    if (token) sessionStorage.setItem('refreshToken', token);
  }
  return token;
}

export function getUser(): any | null {
  if (typeof window === 'undefined') return null;
  let userStr = sessionStorage.getItem('user');
  if (!userStr) {
    userStr = localStorage.getItem('user');
    if (userStr) {
      sessionStorage.setItem('user', userStr);
    }
  }
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

export function setSession(accessToken: string, refreshToken: string, user: any) {
  if (typeof window === 'undefined') return;
  try {
    // Write to both sessionStorage (active tab state) and localStorage (persistence)
    sessionStorage.setItem('accessToken', accessToken);
    sessionStorage.setItem('refreshToken', refreshToken);
    sessionStorage.setItem('user', JSON.stringify(user));

    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
  } catch (e) {
    console.warn('Failed to save session to storage:', e);
  }
}

export function clearSession() {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');
    sessionStorage.removeItem('user');

    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  } catch (e) {
    console.warn('Failed to clear session from storage:', e);
  }
}

// User-specific localStorage helpers to prevent cross-user data overwrite
export function getUserStorageItem(key: string): string | null {
  if (typeof window === 'undefined') return null;
  const user = getUser();
  try {
    if (!user || !user.id) return localStorage.getItem(key); // Fallback to raw key
    return localStorage.getItem(`${key}_${user.id}`);
  } catch (e) {
    console.warn('Failed to read from localStorage:', e);
    return null;
  }
}

export function setUserStorageItem(key: string, value: string) {
  if (typeof window === 'undefined') return;
  const user = getUser();
  try {
    if (!user || !user.id) {
      localStorage.setItem(key, value);
      return;
    }
    localStorage.setItem(`${key}_${user.id}`, value);
  } catch (e) {
    console.warn('Storage quota exceeded or writing failed:', e);
  }
}

export function removeUserStorageItem(key: string) {
  if (typeof window === 'undefined') return;
  const user = getUser();
  try {
    if (!user || !user.id) {
      localStorage.removeItem(key);
      return;
    }
    localStorage.removeItem(`${key}_${user.id}`);
  } catch (e) {
    console.warn('Failed to remove from localStorage:', e);
  }
}
