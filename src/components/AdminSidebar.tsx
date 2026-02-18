'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MdDashboard, MdQuiz } from 'react-icons/md';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/admin',
    icon: <MdDashboard className="w-5 h-5" />,
  },
  {
    label: 'Quiz',
    href: '/admin/quiz',
    icon: <MdQuiz className="w-5 h-5" />,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-gray-900 text-white h-screen sticky top-0 p-6 shadow-lg overflow-y-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-blue-400">Admin Panel</h1>
        <p className="text-gray-400 text-sm mt-1">Prajnanam Dashboard</p>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-12 pt-6 border-t border-gray-700">
        <p className="text-gray-500 text-xs px-4">
          © 2026 Prajnanam Admin
        </p>
      </div>
    </aside>
  );
}
