'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function CheckoutPage() {
  const { cart, getCartSubtotal, clearCart } = useCart();

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

  // Discount states
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponVerified, setCouponVerified] = useState(false);
  const [couponError, setCouponError] = useState('');

  // Sync / Checkout state
  const [checkoutStep, setCheckoutStep] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [generatedOrderId, setGeneratedOrderId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const subtotal = getCartSubtotal();
  const taxRate = 0.08; // 8% Projected Tax
  const tax = Number((subtotal * taxRate).toFixed(2));
  const finalTotal = Number((subtotal + tax - discount).toFixed(2));

  const verifyCoupon = () => {
    setCouponError('');
    if (couponCode.toUpperCase() === 'APEX2024' || couponCode.toUpperCase() === 'APEX') {
      setDiscount(30.00); // $30 discount
      setCouponVerified(true);
    } else {
      setCouponError('INVALID CODE ACCESS');
      setDiscount(0);
      setCouponVerified(false);
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
          card_number: cardNumber || 'APPLEPAY_TOKEN',
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

    } catch (err: any) {
      setErrorMessage(err.message || 'Synchronization transaction failed.');
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
            <h3 className="font-headline-lg-mobile text-3xl uppercase italic tracking-tighter text-primary leading-none">
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
            
            {/* Shipping section */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-1 h-8 bg-primary-container"></div>
                <h2 className="font-headline-lg-mobile text-2xl uppercase tracking-tight italic text-primary leading-none">
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
                    Elite Protocol Address
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
                <h2 className="font-headline-lg-mobile text-2xl uppercase tracking-tight italic text-primary leading-none">
                  Payment Method
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  <div className="glass-panel p-6 border border-white/10 peer-checked:border-primary-container peer-checked:bg-primary-container/10 transition-all flex items-center justify-between select-none">
                    <div className="flex items-center gap-4">
                      <span className="material-symbols-outlined text-primary-container">credit_card</span>
                      <span className="font-headline-md text-lg sm:text-xl uppercase italic font-bold">Credit Card</span>
                    </div>
                    <div className="w-4 h-4 rounded-full border-2 border-white/20 peer-checked:border-primary-container flex items-center justify-center">
                      {paymentMethod === 'credit_card' && <div className="w-2 h-2 bg-primary-container rounded-full"></div>}
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
                  <div className="glass-panel p-6 border border-white/10 peer-checked:border-primary-container peer-checked:bg-primary-container/10 transition-all flex items-center justify-between select-none">
                    <div className="flex items-center gap-4">
                      <span className="material-symbols-outlined text-primary-container">apps</span>
                      <span className="font-headline-md text-lg sm:text-xl uppercase italic font-bold">Apple Pay</span>
                    </div>
                    <div className="w-4 h-4 rounded-full border-2 border-white/20 peer-checked:border-primary-container flex items-center justify-center">
                      {paymentMethod === 'apple_pay' && <div className="w-2 h-2 bg-primary-container rounded-full"></div>}
                    </div>
                  </div>
                </label>
              </div>

              {/* Card Inputs */}
              {paymentMethod === 'credit_card' && (
                <div className="mt-6 space-y-4 animate-fade-in">
                  <div className="space-y-2">
                    <label className="font-label-caps text-[10px] text-on-surface-variant/70 uppercase font-bold tracking-wider">
                      Card Identity Number
                    </label>
                    <input 
                      required={paymentMethod === 'credit_card'}
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-surface-container border border-white/10 rounded-none p-4 text-primary font-bold focus:ring-1 focus:ring-primary-container transition-all"
                      placeholder="0000 0000 0000 0000"
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
                        type="password"
                        value={cvc}
                        onChange={(e) => setCvc(e.target.value)}
                        className="w-full bg-surface-container border border-white/10 rounded-none p-4 text-primary font-bold focus:ring-1 focus:ring-primary-container transition-all"
                        placeholder="***"
                      />
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
                
                <h3 className="font-headline-lg-mobile text-2xl uppercase tracking-tighter italic mb-8 text-primary">
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
                              ${(item.price * item.qty).toFixed(2)}
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
                  {couponVerified && (
                    <p className="font-label-caps text-[9px] text-primary-container">ACCESS GRANTED: -$30.00 REDUCTION</p>
                  )}
                  {couponError && (
                    <p className="font-label-caps text-[9px] text-secondary-container">{couponError}</p>
                  )}
                </div>

                {/* Totals */}
                <div className="space-y-4 pt-4 select-none">
                  <div className="flex justify-between font-label-caps text-xs text-on-surface-variant">
                    <span>SUBTOTAL</span>
                    <span className="text-primary font-bold">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-label-caps text-xs text-on-surface-variant">
                    <span>PRIORITY SHIPPING</span>
                    <span className="text-primary-container font-bold">FREE</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between font-label-caps text-xs text-secondary-container">
                      <span>ACCESS CODE REDUCTION</span>
                      <span className="font-bold">-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-label-caps text-xs text-on-surface-variant">
                    <span>TAX PROJECTION (8%)</span>
                    <span className="text-primary font-bold">${tax.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between items-end border-t border-white/5 pt-4 mt-2">
                    <span className="font-headline-md text-lg uppercase italic text-primary">
                      Total Commitment
                    </span>
                    <span className="font-display-hero text-3xl text-primary-container font-black leading-none">
                      ${finalTotal > 0 ? finalTotal.toFixed(2) : '0.00'}
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
              className="bg-primary text-black font-label-caps text-xs px-6 py-3 uppercase hover:bg-primary-container transition-colors cursor-pointer"
            >
              Retry Transaction
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
