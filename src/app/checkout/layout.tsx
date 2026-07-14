import { requireCustomerSession } from '@/lib/customerAuth';

export default async function CheckoutLayout({ children }: { children: React.ReactNode }) {
  await requireCustomerSession('/checkout');
  return children;
}
