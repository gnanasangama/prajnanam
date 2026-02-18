import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin - Prajnanam',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-100 -mt-[4.25rem] -mb-20 -mx-3 pt-0 pb-0 px-0">
      {children}
    </div>
  );
}
