import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import CustomerAuthForm from '@/components/CustomerAuthForm';
import { getCustomerSession } from '@/lib/customerAuth';

export default async function LoginPage() {
  if (await getCustomerSession()) {
    redirect('/shop');
  }

  return (
    <main className="relative min-h-[90vh] px-margin-mobile md:px-margin-desktop py-16 bg-background overflow-hidden">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="carbon-pattern absolute inset-0 opacity-10" />
      </div>
      <div className="relative z-10 max-w-container-max mx-auto flex flex-col-reverse lg:grid lg:grid-cols-12 gap-12 items-center">
        <section className="w-full lg:col-span-5">
          <Suspense>
            <CustomerAuthForm mode="login" />
          </Suspense>
        </section>
        <section className="w-full lg:col-span-7 flex justify-center items-center">
          <div className="border border-white/10 bg-surface-container-low p-4 flex items-center justify-center w-full max-w-[500px] lg:max-w-none">
            <Image
              src="/images/login.gif"
              alt="Login animation"
              width={500}
              height={500}
              priority
              unoptimized
              className="w-full h-auto object-contain"
            />
          </div>
        </section>
      </div>
    </main>
  );
}
