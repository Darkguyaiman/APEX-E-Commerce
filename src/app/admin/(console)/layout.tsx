import AdminSidebar from '@/components/AdminSidebar';
import { requireAdminSession } from '@/lib/adminAuth';

export default async function AdminConsoleLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  await requireAdminSession();

  return (
    <div className="grid min-h-screen bg-background lg:grid-cols-[280px_1fr]">
      <AdminSidebar />
      <div className="min-w-0">
        {children}
      </div>
    </div>
  );
}
