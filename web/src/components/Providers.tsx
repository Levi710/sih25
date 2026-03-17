'use client';

import { Provider } from 'react-redux';
import { store } from '@/store';
import { useEffect } from 'react';
import { loadUser } from '@/store/slices/authSlice';
import { loadTrips } from '@/store/slices/tripSlice';
import { useRouter, usePathname } from 'next/navigation';

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    store.dispatch(loadUser());
    store.dispatch(loadTrips());
    
    const hasCompleted = localStorage.getItem('hasCompletedWelcome') === 'true';
    if (!hasCompleted && pathname !== '/welcome') {
      router.push('/welcome');
    }
  }, [router, pathname]);

  return <Provider store={store}>{children}</Provider>;
}
