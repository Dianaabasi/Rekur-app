// Server component — no 'use client' directive
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyAdminToken, ADMIN_COOKIE_NAME } from '@/lib/admin-auth';
import AdminLogoutButton from '@/components/AdminLogoutButton';

export default async function AdminDashboardLayout({ children }) {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

  if (!verifyAdminToken(token)) {
    redirect('/admin/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold">ReKur Admin</h1>
        <AdminLogoutButton />
      </header>
      <main className="container mx-auto p-6">{children}</main>
    </div>
  );
}