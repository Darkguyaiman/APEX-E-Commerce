import { isAdminSession } from '@/lib/adminAuth';
import { redirect } from 'next/navigation';
import AdminLoginForm from '@/components/AdminLoginForm';
import Image from 'next/image';

export default async function AdminLoginPage() {
  if (await isAdminSession()) {
    redirect('/admin');
  }

  return (
    <div className="w-full min-h-[90vh] bg-background flex flex-col justify-start pt-16 md:pt-24 px-4 md:px-12 relative z-10">
      {/* Background carbon pattern for consistency */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="carbon-pattern absolute inset-0 opacity-5"></div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto bg-surface-container-low border border-white/5 grid grid-cols-1 md:grid-cols-12 overflow-hidden shadow-2xl min-h-[550px]">
        {/* Left: Login Panel */}
        <div className="md:col-span-4 flex flex-col justify-center p-8 sm:p-12 z-10 bg-surface-container-low">
          <AdminLoginForm />
        </div>

        {/* Right: Login GIF Section with Circle Mask */}
        <div className="relative md:col-span-8 overflow-hidden bg-black select-none hidden md:block">
          <div className="absolute inset-0 w-full h-full">
            <Image
              src="/images/login.gif"
              alt="APEX Admin Grid"
              fill
              className="object-cover opacity-75"
              priority
              sizes="60vw"
            />
          </div>

          {/* Circle Mask Overlay */}
          <div 
            className="absolute top-1/2 -translate-y-1/2 -left-[300px] w-[600px] h-[150%] bg-surface-container-low rounded-full border-r border-electric-lime/20"
            style={{
              boxShadow: '10px 0 30px rgba(195, 244, 0, 0.08)',
            }}
          />
        </div>
      </div>
    </div>
  );
}
