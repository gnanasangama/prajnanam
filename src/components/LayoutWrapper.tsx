'use client';

import { usePathname } from 'next/navigation';
import AppBar from '@/components/app-bar';
import Footer from '@/components/footer';
import { ReactNode } from 'react';

export function LayoutWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <AppBar />
      {children}
      <Footer />
    </>
  );
}
