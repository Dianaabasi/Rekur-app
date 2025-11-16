'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboardLayout({ children }) {
  const router = useRouter();

  useEffect(() => {
    const isAdmin = localStorage.getItem('adminAuthenticated') === 'true';
    if (!isAdmin) {
      router.replace('/admin/login');
    }
  }, [router]);

  // Optional: add a logout button in the layout
  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold">ReKur Admin</h1>
        <button
          onClick={handleLogout}
          className="text-sm text-red-600 hover:underline"
        >
          Logout
        </button>
      </header>
      <main className="container mx-auto p-6">{children}</main>
    </div>
  );
}