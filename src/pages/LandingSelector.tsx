import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import LandingPage from './LandingPage';
import { useStore } from '../store/useStore';

export default function LandingSelector() {
  const { setBranding } = useStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBranding() {
      try {
        const res = await api.get<{ data?: { waitlist_enabled?: boolean }; waitlist_enabled?: boolean }>('/app/branding', { skipAead: true });
        const data = res.data ? res.data : res;
        if (data && typeof data.waitlist_enabled === 'boolean') {
          setBranding({ waitlist_enabled: data.waitlist_enabled });
        }
      } catch (err) {
        console.warn('Failed to load branding in LandingSelector, using defaults:', err);
      } finally {
        setLoading(false);
      }
    }
    loadBranding();
  }, [setBranding]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-page">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-primary border-t-transparent"></div>
      </div>
    );
  }

  return <LandingPage />;
}
