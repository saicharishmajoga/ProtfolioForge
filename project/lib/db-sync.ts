import { getAccessToken, getUserStorageItem, setUserStorageItem } from './session-manager';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function syncToDatabase(savedPortfolios?: string, activeDraft?: string) {
  if (typeof window === 'undefined') return;
  const token = getAccessToken();
  if (!token) return;

  try {
    await fetch(`${API_URL}/api/auth/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ savedPortfolios, activeDraft })
    });
  } catch (err) {
    console.error('Error syncing to database:', err);
  }
}

export async function fetchDatabaseSync() {
  if (typeof window === 'undefined') return null;
  const token = getAccessToken();
  if (!token) return null;

  try {
    const response = await fetch(`${API_URL}/api/auth/sync`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (response.ok) {
      const res = await response.json();
      if (res.success && res.data) {
        const { savedPortfolios, activeDraft } = res.data;
        if (savedPortfolios) {
          setUserStorageItem('user_portfolios', savedPortfolios);
        }
        if (activeDraft) {
          setUserStorageItem('active_builder_portfolio', activeDraft);
        }
        return res.data;
      }
    }
  } catch (err) {
    console.error('Error fetching database sync:', err);
  }
  return null;
}

