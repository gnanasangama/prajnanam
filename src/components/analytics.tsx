'use client';

import { pageview } from '@/utils/analytics';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname) {  // Only track if pathname is available
      const url = pathname + (searchParams?.toString() ? `?${searchParams}` : '');
      pageview(url);
    }
  }, [pathname, searchParams]);

  return null;
}
