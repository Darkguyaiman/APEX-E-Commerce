'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

const fpxBanks = [
  { id: 'agrobank', name: 'Agrobank', mark: 'AG', color: '#0B7A3B', availability: 'B2C', logo: '/bank-logos/agro-bank.png' },
  { id: 'affin', name: 'Affin Bank', mark: 'AF', color: '#D71920', availability: 'B2C / B2B', logo: '/bank-logos/affin-bank.png' },
  { id: 'alliance', name: 'Alliance Bank', mark: 'AL', color: '#E21B2D', availability: 'B2C / B2B', logo: '/bank-logos/alliance-bank.png' },
  { id: 'ambank', name: 'AmBank', mark: 'AM', color: '#E31B23', availability: 'B2C / B2B', logo: '/bank-logos/ambank-logo.png' },
  { id: 'bank_islam', name: 'Bank Islam', mark: 'BI', color: '#009A8E', availability: 'B2C / B2B', logo: '/bank-logos/bank-islam.webp' },
  { id: 'bank_muamalat', name: 'Bank Muamalat', mark: 'BM', color: '#6A1B9A', availability: 'B2C / B2B', logo: '/bank-logos/bank-muamalat.png' },
  { id: 'bank_of_china', name: 'Bank of China', mark: 'BOC', color: '#B21F24', availability: 'B2C', logo: '/bank-logos/Bank_of_China.svg.webp' },
  { id: 'bank_rakyat', name: 'Bank Rakyat', mark: 'BR', color: '#F37021', availability: 'B2C / B2B', logo: '/bank-logos/bank-rakyat.png' },
  { id: 'bsn', name: 'Bank Simpanan Nasional', mark: 'BSN', color: '#005BAC', availability: 'B2C', logo: '/bank-logos/bank-simpanan-national.png' },
  { id: 'bnp_paribas', name: 'BNP Paribas Malaysia', mark: 'BNP', color: '#008755', availability: 'B2B', logo: '/bank-logos/bnp-paribas-malaysia.png' },
  { id: 'cimb', name: 'CIMB Bank', mark: 'CIMB', color: '#B00020', availability: 'B2C / B2B', logo: '/bank-logos/CIMB-Logo.png' },
  { id: 'citibank', name: 'Citibank', mark: 'CITI', color: '#1D4F91', availability: 'B2B', logo: '/bank-logos/citi-bank.png' },
  { id: 'deutsche', name: 'Deutsche Bank Malaysia', mark: 'DB', color: '#0018A8', availability: 'B2B', logo: '/bank-logos/deutsche-bank.png' },
  { id: 'hong_leong', name: 'Hong Leong Bank', mark: 'HL', color: '#D71920', availability: 'B2C / B2B', logo: '/bank-logos/hong-leong-bank-logo.png' },
  { id: 'hsbc', name: 'HSBC Bank Malaysia', mark: 'HSBC', color: '#DB0011', availability: 'B2C / B2B', logo: '/bank-logos/hsbc.png' },
  { id: 'kfh', name: 'Kuwait Finance House', mark: 'KFH', color: '#007A3D', availability: 'B2C / B2B', logo: '/bank-logos/kuwait-finance-house.png' },
  { id: 'maybank', name: 'Maybank2u', mark: 'MAY', color: '#FFC600', availability: 'B2C', logo: '/bank-logos/maybank2u.png' },
  { id: 'maybank2e', name: 'Maybank2E', mark: 'M2E', color: '#D9A300', availability: 'B2B', logo: '/bank-logos/maybank2u.png' },
  { id: 'ocbc', name: 'OCBC Bank', mark: 'OCBC', color: '#E60012', availability: 'B2C / B2B', logo: '/bank-logos/ocbc.png' },
  { id: 'public_bank', name: 'Public Bank', mark: 'PBB', color: '#D71920', availability: 'B2C / B2B', logo: '/bank-logos/public-bank.png' },
  { id: 'rhb', name: 'RHB Bank', mark: 'RHB', color: '#0054A6', availability: 'B2C / B2B', logo: '/bank-logos/RHB_Logo.webp' },
  { id: 'standard_chartered', name: 'Standard Chartered', mark: 'SC', color: '#0072CE', availability: 'B2C / B2B', logo: '/bank-logos/standard_chartered.webp' },
  { id: 'uob', name: 'United Overseas Bank', mark: 'UOB', color: '#005EB8', availability: 'B2C / B2B', logo: '/bank-logos/uob.png' }
];

type PromoCode = {
  id: number;
  code: string;
  type: 'percent' | 'fixed' | 'free_item';
  value: number;
  min_spend: number;
  applies_to: 'all' | 'specific';
  product_ids: string | null;
};

export default function CheckoutPage() {
  const { cart, getCartSubtotal, clearCart, addToCart } = useCart();
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerName, setCustomerName] = useState('');

  // Form states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [fpxBank, setFpxBank] = useState('');
  const [fpxBankSearch, setFpxBankSearch] = useState('');

  // Discount states
  const [couponCode, setCouponCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [couponVerified, setCouponVerified] = useState(false);
  const [couponError, setCouponError] = useState('');

  // Sync / Checkout state
  const [checkoutStep, setCheckoutStep] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [generatedOrderId, setGeneratedOrderId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const subtotal = getCartSubtotal();
  const taxRate = 0.08; // 8% Projected Tax
  const tax = Number((subtotal * taxRate).toFixed(2));

  // Compute discount dynamically from appliedPromo and current cart
  const discount = useMemo(() => {
    if (!appliedPromo) return 0;

    // Check minimum spend
    if (subtotal < Number(appliedPromo.min_spend)) {
      return 0;
    }

    if (appliedPromo.type === 'percent') {
      const pct = Number(appliedPromo.value) / 100;
      if (appliedPromo.applies_to === 'all') {
        return Number((subtotal * pct).toFixed(2));
      } else {
        const targetIds = (appliedPromo.product_ids || '').split(',').map(id => id.trim());
        const eligibleSubtotal = cart
          .filter(item => targetIds.includes(String(item.id)))
          .reduce((sum, item) => sum + item.price * item.qty, 0);
        return Number((eligibleSubtotal * pct).toFixed(2));
      }
    } else if (appliedPromo.type === 'fixed') {
      const amt = Number(appliedPromo.value);
      if (appliedPromo.applies_to === 'all') {
        return Math.min(amt, subtotal);
      } else {
        const targetIds = (appliedPromo.product_ids || '').split(',').map(id => id.trim());
        const eligibleSubtotal = cart
          .filter(item => targetIds.includes(String(item.id)))
          .reduce((sum, item) => sum + item.price * item.qty, 0);
        return Math.min(amt, eligibleSubtotal);
      }
    } else if (appliedPromo.type === 'free_item') {
      const targetFreeProductId = (appliedPromo.product_ids || '').trim();
      const freeItemInCart = cart.find(item => String(item.id) === targetFreeProductId);
      if (freeItemInCart) {
        return freeItemInCart.price; // Discount 1 unit of this product
      }
      return 0;
    }

    return 0;
  }, [appliedPromo, cart, subtotal]);

  const finalTotal = Number((subtotal + tax - discount).toFixed(2));
  const filteredFpxBanks = useMemo(() => {
    const normalizedQuery = fpxBankSearch.trim().toLowerCase();
    if (!normalizedQuery) return fpxBanks;

    return fpxBanks.filter((bank) => (
      bank.name.toLowerCase().includes(normalizedQuery) ||
      bank.mark.toLowerCase().includes(normalizedQuery) ||
      bank.availability.toLowerCase().includes(normalizedQuery)
    ));
  }, [fpxBankSearch]);

  useEffect(() => {
    let mounted = true;

    fetch('/api/auth/me')
      .then((response) => response.json())
      .then((data) => {
        if (!mounted || !data.customer) return;

        const name = String(data.customer.name || '').trim();
        const email = String(data.customer.email || '').trim();
        const parts = name.split(/\s+/).filter(Boolean);

        setCustomerName(name);
        setCustomerEmail(email);
        setFirstName((current) => current || parts[0] || '');
        setLastName((current) => current || parts.slice(1).join(' ') || parts[0] || '');
      })
      .catch(() => {
        // Checkout is already protected server-side; this only controls form convenience.
      });

    return () => {
      mounted = false;
    };
  }, []);

  const verifyCoupon = async () => {
    setCouponError('');
    setAppliedPromo(null);
    setCouponVerified(false);

    if (!couponCode.trim()) {
      setCouponError('PLEASE ENTER A CODE');
      return;
    }

    try {
      const res = await fetch(`/api/promos?code=${encodeURIComponent(couponCode)}`);
      const data = await res.json();

      if (!res.ok) {
        setCouponError(data.error || 'INVALID CODE ACCESS');
        return;
      }

      setAppliedPromo(data);
      setCouponVerified(true);

      // Add feedback warnings
      if (subtotal < Number(data.min_spend)) {
        setCouponError(`MIN SPEND OF RM ${Number(data.min_spend).toFixed(2)} REQUIRED`);
      } else if (data.type === 'free_item') {
        const freeItemId = (data.product_ids || '').trim();
        const isInCart = cart.some(item => String(item.id) === freeItemId);
        if (!isInCart) {
          try {
            const prodRes = await fetch('/api/products');
            if (prodRes.ok) {
              const products = await prodRes.json();
              const product = products.find((p: any) => String(p.id) === freeItemId);
              if (product) {
                const defaultSize = cart.length > 0 ? cart[0].size : '9';
                addToCart({
                  id: product.id,
                  name: product.name,
                  price: Number(product.price),
                  image_url: product.image_url,
                  category: product.category,
                  colorway: product.colorway,
                  type_chip: product.type_chip
                }, defaultSize, 1);
              } else {
                setCouponError(`REWARD PRODUCT ID ${freeItemId} NOT FOUND`);
              }
            } else {
              setCouponError('COULD NOT FETCH PRODUCTS CATALOG');
            }
          } catch {
            setCouponError('COULD NOT CONNECT TO CATALOG');
          }
        }
      }
    } catch (err) {
      setCouponError('SERVER CONNECTION ERROR');
    }
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName || !lastName || !address || !city || !zipCode) {
      alert('Please fill out all shipping details.');
      return;
    }

    if (cart.length === 0) {
      alert('Locker is empty. Deploy items to cart first.');
      return;
    }

    if (paymentMethod === 'fpx' && !fpxBank) {
      alert('Please choose an FPX bank.');
      return;
    }

    setCheckoutStep('processing');
    setErrorMessage('');

    try {
      // POST order details to checkout API
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: firstName.toUpperCase(),
          last_name: lastName.toUpperCase(),
          address: address.toUpperCase(),
          city: city.toUpperCase(),
          zip_code: zipCode.toUpperCase(),
          payment_method: paymentMethod,
          card_number: paymentMethod === 'credit_card'
            ? cardNumber
            : paymentMethod === 'fpx'
              ? `FPX_DEMO_${fpxBank}`
              : 'APPLEPAY_DEMO_TOKEN',
          coupon_code: couponVerified && appliedPromo ? appliedPromo.code : undefined,
          items: cart.map(item => ({
            id: item.id,
            size: item.size,
            qty: item.qty
          }))
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Server rejected checkout transaction');
      }

      // Simulate a premium synchronization processing window of 2.5 seconds
      setTimeout(() => {
        setGeneratedOrderId(data.orderId);
        setCheckoutStep('success');
        clearCart();
      }, 2500);

    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Synchronization transaction failed.');
      setCheckoutStep('error');
    }
  };

  return (
    <main className="relative min-h-screen pt-12 pb-32 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto bg-background">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="carbon-pattern absolute inset-0 opacity-10"></div>
      </div>

      {checkoutStep === 'success' ? (
        <div className="relative z-10 max-w-md mx-auto py-20 text-center space-y-8 animate-fade-in">
          <div className="w-24 h-24 mx-auto bg-primary-container flex items-center justify-center rounded-full scale-110 shadow-[0_0_50px_rgba(171,214,0,0.4)] select-none">
            <span className="material-symbols-outlined text-black text-5xl font-bold">check_circle</span>
          </div>
          <div className="space-y-3">
            <h3 className="font-headline-lg-mobile text-3xl uppercase italic tracking-wide text-primary leading-none">
              DEPLOYMENT CONFIRMED
            </h3>
            <p className="font-body-md text-sm text-on-surface-variant/80 max-w-xs mx-auto leading-relaxed">
              Your Apex performance profile has been logged on the database grid.
            </p>
            <div className="bg-surface-container border border-white/5 p-4 rounded-sm">
              <p className="font-label-caps text-xs text-primary font-bold">
                ORDER ID: AX-{generatedOrderId}
              </p>
              <p className="font-label-caps text-[10px] text-on-surface-variant/60 mt-1 uppercase">
                ESTIMATED DROP TIME: 48 HOURS (PRIORITY FLIGHT)
              </p>
            </div>
          </div>
          <Link
            href="/"
            className="inline-block font-label-caps text-xs text-primary-container border-b border-primary-container pb-1 uppercase hover:opacity-75 transition-opacity"
          >
            Return to Hub
          </Link>
        </div>
      ) : (
        <form onSubmit={handleCheckoutSubmit} className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Shipping & Payment */}
          <div className="lg:col-span-7 space-y-12">
            {customerEmail && (
              <section className="border border-white/10 bg-surface-container-low p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 bg-primary-container text-black flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined">account_circle</span>
                  </div>
                  <div>
                    <p className="font-label-caps text-[10px] text-on-surface-variant/60 uppercase tracking-wider">
                      Checking out as
                    </p>
                    <p className="font-headline-md text-xl uppercase italic text-primary leading-none mt-1 tracking-wide">
                      {customerName || customerEmail}
                    </p>
                    <p className="font-body-md text-xs text-on-surface-variant/75 mt-1 break-all">
                      {customerEmail}
                    </p>
                  </div>
                </div>
                <Link
                  href="/profile"
                  className="font-label-caps text-[10px] uppercase tracking-wider text-primary-container hover:underline"
                >
                  Profile
                </Link>
              </section>
            )}

            {/* Shipping section */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-1 h-8 bg-primary-container"></div>
                <h2 className="font-headline-lg-mobile text-2xl uppercase tracking-wide italic text-primary leading-none">
                  Shipping DNA
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="font-label-caps text-[10px] text-on-surface-variant/70 uppercase font-bold tracking-wider">
                    First Name
                  </label>
                  <input
                    required
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full bg-surface-container border border-white/10 rounded-none p-4 text-primary font-bold focus:ring-1 focus:ring-primary-container transition-all uppercase"
                    placeholder="CRISTIANO"
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-label-caps text-[10px] text-on-surface-variant/70 uppercase font-bold tracking-wider">
                    Last Name
                  </label>
                  <input
                    required
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full bg-surface-container border border-white/10 rounded-none p-4 text-primary font-bold focus:ring-1 focus:ring-primary-container transition-all uppercase"
                    placeholder="AVENGER"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="font-label-caps text-[10px] text-on-surface-variant/70 uppercase font-bold tracking-wider">
                    Address
                  </label>
                  <input
                    required
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-surface-container border border-white/10 rounded-none p-4 text-primary font-bold focus:ring-1 focus:ring-primary-container transition-all uppercase"
                    placeholder="123 Stadium Way, Training Complex"
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-label-caps text-[10px] text-on-surface-variant/70 uppercase font-bold tracking-wider">
                    City
                  </label>
                  <input
                    required
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-surface-container border border-white/10 rounded-none p-4 text-primary font-bold focus:ring-1 focus:ring-primary-container transition-all uppercase"
                    placeholder="MANCHESTER"
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-label-caps text-[10px] text-on-surface-variant/70 uppercase font-bold tracking-wider">
                    Zip Code
                  </label>
                  <input
                    required
                    type="text"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    className="w-full bg-surface-container border border-white/10 rounded-none p-4 text-primary font-bold focus:ring-1 focus:ring-primary-container transition-all uppercase"
                    placeholder="M14 4XX"
                  />
                </div>
              </div>
            </section>

            {/* Payment Method section */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-1 h-8 bg-primary-container"></div>
                <h2 className="font-headline-lg-mobile text-2xl uppercase tracking-wide italic text-primary leading-none">
                  Payment Method
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Credit Card Selector */}
                <label className="relative cursor-pointer group">
                  <input
                    type="radio"
                    name="payment"
                    value="credit_card"
                    checked={paymentMethod === 'credit_card'}
                    onChange={() => setPaymentMethod('credit_card')}
                    className="hidden peer"
                  />
                  <div className="h-full bg-surface-container-low border border-white/10 peer-checked:border-primary-container peer-checked:bg-primary-container/10 transition-all p-5 select-none">
                    <div className="flex items-start justify-between gap-3">
                      <span className="material-symbols-outlined text-primary-container">credit_card</span>
                      <div className="w-4 h-4 rounded-full border-2 border-white/20 peer-checked:border-primary-container flex items-center justify-center shrink-0">
                        {paymentMethod === 'credit_card' && <div className="w-2 h-2 bg-primary-container rounded-full"></div>}
                      </div>
                    </div>
                    <div className="mt-5">
                      <span className="font-headline-md text-xl uppercase italic font-bold text-primary tracking-wide">Card</span>
                      <p className="mt-1 font-label-caps text-[9px] uppercase text-on-surface-variant/65">
                        Visa / Mastercard demo
                      </p>
                    </div>
                  </div>
                </label>

                {/* FPX Selector */}
                <label className="relative cursor-pointer group">
                  <input
                    type="radio"
                    name="payment"
                    value="fpx"
                    checked={paymentMethod === 'fpx'}
                    onChange={() => setPaymentMethod('fpx')}
                    className="hidden peer"
                  />
                  <div className="h-full bg-surface-container-low border border-white/10 peer-checked:border-primary-container peer-checked:bg-primary-container/10 transition-all p-5 select-none">
                    <div className="flex items-start justify-between gap-3">
                      <span className="material-symbols-outlined text-primary-container">account_balance</span>
                      <div className="w-4 h-4 rounded-full border-2 border-white/20 peer-checked:border-primary-container flex items-center justify-center shrink-0">
                        {paymentMethod === 'fpx' && <div className="w-2 h-2 bg-primary-container rounded-full"></div>}
                      </div>
                    </div>
                    <div className="mt-5">
                      <span className="font-headline-md text-xl uppercase italic font-bold text-primary tracking-wide">FPX</span>
                      <p className="mt-1 font-label-caps text-[9px] uppercase text-on-surface-variant/65">
                        Online banking demo
                      </p>
                    </div>
                  </div>
                </label>

                {/* Apple Pay Selector */}
                <label className="relative cursor-pointer group">
                  <input
                    type="radio"
                    name="payment"
                    value="apple_pay"
                    checked={paymentMethod === 'apple_pay'}
                    onChange={() => setPaymentMethod('apple_pay')}
                    className="hidden peer"
                  />
                  <div className="h-full bg-surface-container-low border border-white/10 peer-checked:border-primary-container peer-checked:bg-primary-container/10 transition-all p-5 select-none">
                    <div className="flex items-start justify-between gap-3">
                      <span className="material-symbols-outlined text-primary-container">phone_iphone</span>
                      <div className="w-4 h-4 rounded-full border-2 border-white/20 peer-checked:border-primary-container flex items-center justify-center shrink-0">
                        {paymentMethod === 'apple_pay' && <div className="w-2 h-2 bg-primary-container rounded-full"></div>}
                      </div>
                    </div>
                    <div className="mt-5">
                      <span className="font-headline-md text-xl uppercase italic font-bold text-primary tracking-wide">Apple Pay</span>
                      <p className="mt-1 font-label-caps text-[9px] uppercase text-on-surface-variant/65">
                        Wallet demo token
                      </p>
                    </div>
                  </div>
                </label>
              </div>

              {/* Card Inputs */}
              {paymentMethod === 'credit_card' && (
                <div className="mt-6 border border-white/10 bg-surface-container-low p-5 space-y-4 animate-fade-in">
                  <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
                    <div>
                      <p className="font-label-caps text-[10px] uppercase tracking-wider text-primary-container">
                        Card Payment
                      </p>
                      <p className="font-body-md text-xs text-on-surface-variant/70 mt-1">
                        Demo checkout only. No real card charge is processed.
                      </p>
                    </div>
                    <span className="material-symbols-outlined text-primary-container">encrypted</span>
                  </div>
                  <div className="space-y-2">
                    <label className="font-label-caps text-[10px] text-on-surface-variant/70 uppercase font-bold tracking-wider">
                      Card Number
                    </label>
                    <input
                      required={paymentMethod === 'credit_card'}
                      type="text"
                      inputMode="numeric"
                      autoComplete="cc-number"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-surface-container border border-white/10 rounded-none p-4 text-primary font-bold focus:ring-1 focus:ring-primary-container transition-all"
                      placeholder="4242 4242 4242 4242"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="font-label-caps text-[10px] text-on-surface-variant/70 uppercase font-bold tracking-wider">
                        Expiry
                      </label>
                      <input
                        required={paymentMethod === 'credit_card'}
                        type="text"
                        inputMode="numeric"
                        autoComplete="cc-exp"
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                        className="w-full bg-surface-container border border-white/10 rounded-none p-4 text-primary font-bold focus:ring-1 focus:ring-primary-container transition-all"
                        placeholder="MM/YY"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="font-label-caps text-[10px] text-on-surface-variant/70 uppercase font-bold tracking-wider">
                        CVC
                      </label>
                      <input
                        required={paymentMethod === 'credit_card'}
                        type="text"
                        inputMode="numeric"
                        autoComplete="off"
                        value={cvc}
                        onChange={(e) => setCvc(e.target.value)}
                        className="w-full bg-surface-container border border-white/10 rounded-none p-4 text-primary font-bold focus:ring-1 focus:ring-primary-container transition-all"
                        placeholder="123"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'fpx' && (
                <div className="mt-6 border border-white/10 bg-surface-container-low p-5 space-y-5 animate-fade-in">
                  <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
                    <div>
                      <p className="font-label-caps text-[10px] uppercase tracking-wider text-primary-container">
                        FPX Online Banking
                      </p>
                      <p className="font-body-md text-xs text-on-surface-variant/70 mt-1">
                        Select a bank to simulate a Malaysian FPX redirect flow.
                      </p>
                    </div>
                    <span className="material-symbols-outlined text-primary-container">account_balance</span>
                  </div>

                  <fieldset className="space-y-3">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                      <legend className="font-label-caps text-[10px] text-on-surface-variant/70 uppercase font-bold tracking-wider">
                        Choose Bank
                      </legend>
                      <div className="relative w-full sm:max-w-xs">
                        <input
                          type="search"
                          value={fpxBankSearch}
                          onChange={(event) => setFpxBankSearch(event.target.value)}
                          className="w-full bg-surface-container border border-white/10 py-2.5 pl-9 pr-3 text-sm text-primary placeholder:text-on-surface-variant/60 focus:border-primary-container"
                          placeholder="Search bank..."
                          aria-label="Search FPX banks"
                        />
                        <span className="material-symbols-outlined absolute left-3 top-2.5 text-base text-on-surface-variant/60">
                          search
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
                      {filteredFpxBanks.map((bank) => {
                        const selected = fpxBank === bank.id;

                        return (
                          <label
                            key={bank.id}
                            className={`group cursor-pointer border p-3 transition-colors min-h-[116px] flex flex-col justify-between ${selected
                              ? 'border-primary-container bg-primary-container/10'
                              : 'border-white/10 bg-surface-container hover:border-white/25'
                              }`}
                          >
                            <input
                              type="radio"
                              name="fpx_bank"
                              value={bank.id}
                              checked={selected}
                              onChange={() => setFpxBank(bank.id)}
                              className="sr-only"
                              required={paymentMethod === 'fpx'}
                            />
                            <div className="flex items-start justify-between gap-2">
                              <div className="relative h-11 w-20 flex items-center justify-center rounded-sm bg-white shadow-sm overflow-hidden">
                                <Image
                                  src={bank.logo}
                                  alt={`${bank.name} logo`}
                                  fill
                                  className="object-contain p-2"
                                  sizes="80px"
                                />
                              </div>
                              <span className={`material-symbols-outlined text-base ${selected ? 'text-primary-container' : 'text-on-surface-variant/35'}`}>
                                {selected ? 'check_circle' : 'radio_button_unchecked'}
                              </span>
                            </div>
                            <div className="mt-4">
                              <p className="font-label-caps text-[10px] uppercase leading-tight text-primary">
                                {bank.name}
                              </p>
                              <p className="mt-1 font-label-caps text-[8px] uppercase text-on-surface-variant/60">
                                {bank.availability}
                              </p>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                    {filteredFpxBanks.length === 0 && (
                      <div className="border border-white/10 bg-surface-container px-4 py-6 text-center">
                        <p className="font-label-caps text-[10px] uppercase text-on-surface-variant">
                          No matching banks found.
                        </p>
                      </div>
                    )}
                    <p className="font-body-md text-xs text-on-surface-variant/65">
                      Demo list based on PayNet FPX participating bank availability.
                    </p>
                  </fieldset>
                </div>
              )}

              {paymentMethod === 'apple_pay' && (
                <div className="mt-6 border border-white/10 bg-surface-container-low p-5 animate-fade-in">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary-container text-black flex items-center justify-center">
                      <span className="material-symbols-outlined">phone_iphone</span>
                    </div>
                    <div>
                      <p className="font-label-caps text-[10px] uppercase tracking-wider text-primary-container">
                        Apple Pay Demo
                      </p>
                      <p className="font-body-md text-xs text-on-surface-variant/75 mt-1">
                        A demo wallet token will be attached to this checkout. No real Apple Pay session is opened.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </section>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 space-y-6">
              <div className="glass-panel p-8 border border-white/10 neon-glow relative overflow-hidden">
                <div className="carbon-pattern absolute inset-0 opacity-5 pointer-events-none"></div>

                <h3 className="font-headline-lg-mobile text-2xl uppercase tracking-wide italic mb-8 text-primary">
                  Battle Gear Summary
                </h3>

                {/* Items List */}
                <div className="space-y-6 max-h-72 overflow-y-auto pr-2 border-b border-white/10 pb-6 mb-6">
                  {cart.length === 0 ? (
                    <p className="font-label-caps text-xs text-on-surface-variant/40 py-4 text-center">
                      NO ITEMS COMMITTED TO LOCKER
                    </p>
                  ) : (
                    cart.map((item) => (
                      <div key={`${item.id}-${item.size}`} className="flex gap-4">
                        <div className="w-20 h-20 bg-surface-container-high/50 border border-white/5 relative overflow-hidden flex-shrink-0">
                          <Image
                            src={item.image_url}
                            alt={item.name}
                            fill
                            className="object-contain p-2"
                          />
                          {item.type_chip && (
                            <div className="absolute top-0 right-0 bg-primary-container text-black px-1.5 py-0.5 font-label-caps text-[8px] font-bold">
                              {item.type_chip}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <h4 className="font-headline-md text-sm uppercase leading-tight italic text-primary">
                              {item.name}
                            </h4>
                            <p className="font-label-caps text-[9px] text-on-surface-variant/60">
                              US {item.size} / QTY: {String(item.qty).padStart(2, '0')}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="font-stats-value text-xs text-primary-container">
                              RM {(item.price * item.qty).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Priority access code */}
                <div className="pb-6 border-b border-white/10 space-y-2 select-none">
                  <label className="font-label-caps text-[9px] text-on-surface-variant/70 uppercase font-bold tracking-wider">
                    Priority Access Code
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 bg-surface-container border border-white/10 rounded-none p-3 text-primary font-bold uppercase tracking-widest text-xs"
                      placeholder="APEX2024"
                    />
                    <button
                      type="button"
                      onClick={verifyCoupon}
                      className="bg-surface-container-highest border border-white/10 px-6 font-label-caps text-xs text-primary hover:bg-white hover:text-black transition-colors uppercase cursor-pointer"
                    >
                      Verify
                    </button>
                  </div>
                  {couponVerified && appliedPromo && (
                    <p className="font-label-caps text-[9px] text-primary-container">
                      ACCESS GRANTED: {appliedPromo.code} (
                      {appliedPromo.type === 'percent' && `${appliedPromo.value}% OFF`}
                      {appliedPromo.type === 'fixed' && `RM ${appliedPromo.value} OFF`}
                      {appliedPromo.type === 'free_item' && 'FREE REWARD ITEM'}
                      )
                    </p>
                  )}
                   {couponVerified && appliedPromo && discount === 0 && (
                    <p className="font-label-caps text-[9px] text-secondary mt-1">
                      MINIMUM SPEND OF RM {Number(appliedPromo.min_spend).toFixed(2)} REQUIRED
                    </p>
                  )}
                  {couponError && (
                    <p className="font-label-caps text-[9px] text-secondary">{couponError}</p>
                  )}
                </div>

                {/* Totals */}
                <div className="space-y-4 pt-4 select-none">
                  <div className="flex justify-between font-label-caps text-xs text-on-surface-variant">
                    <span>SUBTOTAL</span>
                    <span className="text-primary font-bold">RM {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-label-caps text-xs text-on-surface-variant">
                    <span>PRIORITY SHIPPING</span>
                    <span className="text-primary-container font-bold">FREE</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between font-label-caps text-xs text-secondary">
                      <span>ACCESS CODE REDUCTION</span>
                      <span className="font-bold">-RM {discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-label-caps text-xs text-on-surface-variant">
                    <span>TAX PROJECTION (8%)</span>
                    <span className="text-primary font-bold">RM {tax.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between items-end border-t border-white/5 pt-4 mt-2">
                    <span className="font-headline-md text-lg uppercase italic text-primary tracking-wide">
                      Total Commitment
                    </span>
                    <span className="font-display-hero text-3xl text-primary-container font-black leading-none">
                      RM {finalTotal > 0 ? finalTotal.toFixed(2) : '0.00'}
                    </span>
                  </div>
                </div>

                {/* Checkout Submit Trigger */}
                <button
                  type="submit"
                  disabled={cart.length === 0 || checkoutStep === 'processing'}
                  className="mt-8 w-full bg-primary-container disabled:bg-surface-container-highest disabled:text-on-surface-variant/45 text-black font-headline-md text-lg py-5 flex justify-center items-center gap-3 group relative overflow-hidden active:scale-[0.98] transition-all cursor-pointer font-bold select-none text-center"
                >
                  <span className="relative z-10 uppercase font-black">Complete Purchase</span>
                  <span className="material-symbols-outlined relative z-10 group-hover:translate-x-2 transition-transform font-bold">
                    chevron_right
                  </span>
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
                </button>
              </div>

              {/* Secure statement */}
              <div className="flex items-center justify-center gap-3 text-on-surface-variant/30 select-none">
                <span className="material-symbols-outlined text-sm">lock</span>
                <span className="font-label-caps text-[9px] uppercase tracking-[0.2em] font-bold">
                  End-to-End Encrypted Grid Transaction
                </span>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* Syncing/Processing Overlay simulation */}
      {checkoutStep === 'processing' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/90 backdrop-blur-md select-none animate-fade-in">
          <div className="text-center space-y-8 max-w-xs px-6">
            <div className="relative w-24 h-24 mx-auto">
              <div className="absolute inset-0 border-2 border-primary-container/20 rounded-full"></div>
              <div className="absolute inset-0 border-t-2 border-primary-container rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary-container text-4xl font-bold">bolt</span>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="font-headline-lg-mobile text-2xl uppercase italic tracking-tighter text-primary leading-none">
                Syncing Gear
              </h3>
              <p className="font-body-md text-xs text-on-surface-variant/80 leading-relaxed">
                Synchronizing your performance profile with the Apex grid. Do not disconnect.
              </p>
            </div>
            <div className="flex justify-center gap-1.5">
              <div className="w-2 h-2 bg-primary-container animate-pulse"></div>
              <div className="w-2 h-2 bg-primary-container animate-pulse delay-75"></div>
              <div className="w-2 h-2 bg-primary-container animate-pulse delay-150"></div>
            </div>
          </div>
        </div>
      )}

      {/* Backend API failure handling */}
      {checkoutStep === 'error' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/90 backdrop-blur-md select-none animate-fade-in">
          <div className="text-center space-y-6 max-w-sm px-6">
            <div className="w-20 h-20 mx-auto bg-secondary-container flex items-center justify-center rounded-full">
              <span className="material-symbols-outlined text-black text-4xl font-bold">warning</span>
            </div>
            <div className="space-y-2">
              <h3 className="font-headline-lg-mobile text-2xl uppercase italic tracking-tighter text-primary leading-none">
                GRID SYNC FAILED
              </h3>
              <p className="font-body-md text-xs text-on-surface-variant/80 leading-relaxed">
                {errorMessage || 'There was a problem syncing your order on the database transaction.'}
              </p>
            </div>
            <button
              onClick={() => setCheckoutStep('idle')}
              className="bg-primary text-background font-label-caps text-xs px-6 py-3 uppercase hover:bg-primary-container hover:text-background transition-colors cursor-pointer"
            >
              Retry Transaction
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
