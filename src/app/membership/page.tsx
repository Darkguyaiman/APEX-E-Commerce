'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const fieldClass = 'w-full bg-surface-container border border-white/10 px-4 py-3 text-sm text-primary placeholder:text-on-surface-variant/50 focus:border-primary-container focus:outline-none transition-colors';
const labelClass = 'font-label-caps text-[10px] text-on-surface-variant tracking-widest uppercase';

export default function MembershipPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    size: '9',
    position: 'Midfielder'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [memberId, setMemberId] = useState('');
  const memberCardRef = useRef<HTMLDivElement>(null);

  const handleCardMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!memberCardRef.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rotateY = (x - 0.5) * 14;
    const rotateX = (0.5 - y) * 14;

    memberCardRef.current.style.transformOrigin = `${Math.round(x * 100)}% ${Math.round(y * 100)}%`;
    memberCardRef.current.style.transform = `rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale(1.045)`;
  };

  const resetCardMove = () => {
    if (!memberCardRef.current) {
      return;
    }

    memberCardRef.current.style.transformOrigin = 'center center';
    memberCardRef.current.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const generatedId = `APX-${Math.floor(1000 + Math.random() * 9000)}`;

    try {
      const res = await fetch('/api/membership', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          member_id: generatedId
        })
      });

      if (!res.ok) throw new Error('Registration failed');
      
      setMemberId(generatedId);
      setSubmitted(true);
    } catch {
      alert('Could not submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-primary relative pb-20">
      <div className="absolute inset-0 carbon-pattern opacity-5 pointer-events-none"></div>

      {/* Decorative blurred backgrounds */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 w-96 h-96 bg-primary-container/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 w-96 h-96 bg-secondary-container/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="px-margin-mobile md:px-margin-desktop max-w-6xl mx-auto pt-24 md:pt-32 relative z-10">
        
        {/* Hero Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="font-label-caps text-xs text-primary-container tracking-widest border-l-2 border-primary-container pl-3 block w-fit mx-auto mb-4 uppercase">
            Exclusive Access
          </span>
          <h1 className="font-headline-lg text-5xl md:text-6xl uppercase italic leading-none tracking-tight mb-6">
            THE APEX CLUB
          </h1>
          <p className="font-body-lg text-base md:text-lg text-on-surface-variant/80 leading-relaxed">
            Gain entry into the design lab. Get early prototype access, custom product diagnostics, and direct collaboration opportunities with our engineers.
          </p>
        </div>

        {/* Form and Perks Section Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          
          {/* Perks - Left Column (7/12) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <h2 className="font-headline-md text-3xl uppercase italic leading-none mb-2">
              MEMBERSHIP PRIVILEGES
            </h2>

            <a
              href="#membership-application"
              className="hover-3d mt-3 block w-full max-w-[24rem] cursor-pointer select-none"
              aria-label="Preview Apex Club member credential"
              onMouseMove={handleCardMove}
              onMouseLeave={resetCardMove}
            >
              <div
                ref={memberCardRef}
                className="member-card-example relative overflow-hidden bg-black text-white border border-white/10"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,#ffffff08_35%,transparent_36%),radial-gradient(circle_at_top_right,#ffffff08_35%,transparent_36%)] bg-[length:4.95em_4.95em]"></div>
                <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-primary-container/20 blur-3xl"></div>
                <div className="relative p-6 sm:p-7">
                  <div className="mb-10 flex items-start justify-between gap-4">
                    <div>
                      <div className="font-label-caps text-[10px] uppercase tracking-widest text-primary-container">
                        Apex Club
                      </div>
                      <div className="font-headline-md text-2xl uppercase italic leading-none">
                        Member Credential
                      </div>
                    </div>
                    <Image
                      src="/apex-logo.png"
                      alt="Apex"
                      width={72}
                      height={72}
                      className="h-14 w-14 object-contain opacity-25"
                    />
                  </div>

                  <div className="mb-5 font-mono text-base tracking-[0.22em] text-white/45">
                    0210 8820 1150 0222
                  </div>

                  <div className="flex items-end justify-between gap-6">
                    <div>
                      <div className="font-label-caps text-[9px] uppercase tracking-widest text-white/25">
                        Card Holder
                      </div>
                      <div className="font-label-caps text-xs uppercase tracking-widest">
                        Apex Athlete
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-label-caps text-[9px] uppercase tracking-widest text-white/25">
                        Expires
                      </div>
                      <div className="font-label-caps text-xs uppercase tracking-widest">
                        29/08
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </a>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Perk 1 */}
              <div className="glass-card p-6 flex flex-col justify-between border border-white/5 hover:border-primary-container/10 transition-colors">
                <div>
                  <span className="material-symbols-outlined text-primary-container text-3xl mb-4 font-bold select-none">
                    schedule
                  </span>
                  <h3 className="font-headline-md text-lg text-primary uppercase italic mb-2">
                    24H EARLY DROPS
                  </h3>
                  <p className="text-xs text-on-surface-variant/80 leading-relaxed">
                    Purchase limited prototype cleats and exclusive colorways 24 hours before the general public release.
                  </p>
                </div>
              </div>

              {/* Perk 2 */}
              <div className="glass-card p-6 flex flex-col justify-between border border-white/5 hover:border-primary-container/10 transition-colors">
                <div>
                  <span className="material-symbols-outlined text-primary-container text-3xl mb-4 font-bold select-none">
                    3d_rotation
                  </span>
                  <h3 className="font-headline-md text-lg text-primary uppercase italic mb-2">
                    3D FIT ANALYTICS
                  </h3>
                  <p className="text-xs text-on-surface-variant/80 leading-relaxed">
                    Access custom recommendation algorithms matching our carbon plate stiffness configurations to your play style.
                  </p>
                </div>
              </div>

              {/* Perk 3 */}
              <div className="glass-card p-6 flex flex-col justify-between border border-white/5 hover:border-primary-container/10 transition-colors">
                <div>
                  <span className="material-symbols-outlined text-primary-container text-3xl mb-4 font-bold select-none">
                    science
                  </span>
                  <h3 className="font-headline-md text-lg text-primary uppercase italic mb-2">
                    LAB TELEMETRY
                  </h3>
                  <p className="text-xs text-on-surface-variant/80 leading-relaxed">
                    Collaborate with engineers by submitting fit telemetry logs and vote on upcoming cleat upper concepts.
                  </p>
                </div>
              </div>

              {/* Perk 4 */}
              <div className="glass-card p-6 flex flex-col justify-between border border-white/5 hover:border-primary-container/10 transition-colors">
                <div>
                  <span className="material-symbols-outlined text-primary-container text-3xl mb-4 font-bold select-none">
                    sports_soccer
                  </span>
                  <h3 className="font-headline-md text-lg text-primary uppercase italic mb-2">
                    PITCH PRIVILEGES
                  </h3>
                  <p className="text-xs text-on-surface-variant/80 leading-relaxed">
                    Receive direct invitations to regional trial camp tours, amateur speed tournaments, and coaching clinics.
                  </p>
                </div>
              </div>
            </div>

            <div className="border border-white/10 bg-surface-container-low p-4 flex gap-4 items-center">
              <span className="material-symbols-outlined text-primary-container text-2xl font-bold select-none">
                info
              </span>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                APEX Club membership is free but applications are audited. Design feedback logs must match real pitch utilization.
              </p>
            </div>
          </div>

          {/* Form - Right Column (5/12) */}
          <div id="membership-application" className="lg:col-span-5 scroll-mt-28">
            <div className="glass-card p-6 md:p-8 border border-white/10 bg-surface-container-low shadow-2xl relative overflow-hidden h-full flex flex-col justify-between">
              
              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-5 h-full flex flex-col justify-between">
                  <div>
                    <h3 className="font-headline-md text-2xl uppercase italic leading-none text-primary mb-2">
                      APPLY FOR ACCESS
                    </h3>
                    <p className="text-xs text-on-surface-variant/70 mb-6">
                      Complete registration below to initialize your digital laboratory credentials.
                    </p>

                    <div className="space-y-4">
                      <label className="block space-y-2">
                        <span className={labelClass}>Full Name</span>
                        <input
                          type="text"
                          required
                          className={fieldClass}
                          value={form.name}
                          onChange={e => setForm({ ...form, name: e.target.value })}
                          placeholder="e.g. Marcus Alisson"
                        />
                      </label>

                      <label className="block space-y-2">
                        <span className={labelClass}>Email Address</span>
                        <input
                          type="email"
                          required
                          className={fieldClass}
                          value={form.email}
                          onChange={e => setForm({ ...form, email: e.target.value })}
                          placeholder="e.g. marcus@pitch.com"
                        />
                      </label>

                      <div className="grid grid-cols-2 gap-4">
                        <label className="block space-y-2">
                          <span className={labelClass}>Cleat Size (US)</span>
                          <select
                            className={fieldClass}
                            value={form.size}
                            onChange={e => setForm({ ...form, size: e.target.value })}
                          >
                            {['7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12'].map(sz => (
                              <option key={sz} value={sz}>{sz}</option>
                            ))}
                          </select>
                        </label>

                        <label className="block space-y-2">
                          <span className={labelClass}>Main Position</span>
                          <select
                            className={fieldClass}
                            value={form.position}
                            onChange={e => setForm({ ...form, position: e.target.value })}
                          >
                            {['Forward', 'Midfielder', 'Defender', 'Goalkeeper'].map(pos => (
                              <option key={pos} value={pos}>{pos}</option>
                            ))}
                          </select>
                        </label>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-6 bg-primary-container hover:bg-white text-black font-label-caps text-xs font-bold py-4 px-6 uppercase transition-colors flex items-center justify-center gap-2 select-none disabled:opacity-75 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="material-symbols-outlined text-lg animate-spin">sync</span>
                        Creating Credentials...
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-lg font-bold">fingerprint</span>
                        Initialize Credentials
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <div className="text-center py-10 flex flex-col items-center justify-center h-full my-auto animate-fade-in">
                  <div className="w-16 h-16 rounded-full bg-primary-container/10 border border-primary-container flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-primary-container text-3xl font-bold select-none">
                      check_circle
                    </span>
                  </div>
                  
                  <span className="font-label-caps text-[10px] text-primary-container tracking-widest mb-2 block uppercase font-bold">
                    Credentials Issued
                  </span>
                  
                  <h3 className="font-headline-md text-3xl uppercase italic leading-none text-primary mb-4">
                    WELCOME, {form.name.split(' ')[0]}
                  </h3>
                  
                  <p className="text-sm text-on-surface-variant/80 leading-relaxed mb-6 max-w-sm">
                    Your digital laboratory membership profile has been created. A verification dispatch has been sent to **{form.email}**.
                  </p>

                  <div className="border border-white/10 bg-surface-container-lowest py-3 px-6 rounded w-full max-w-xs mx-auto mb-8">
                    <span className="font-label-caps text-[9px] text-on-surface-variant/50 block mb-1">
                      MEMBER ID CODE
                    </span>
                    <span className="font-mono text-lg text-primary tracking-widest font-bold">
                      {memberId}
                    </span>
                  </div>

                  <Link
                    href="/"
                    className="inline-flex items-center justify-center gap-2 border border-white/15 hover:bg-white/5 py-3 px-6 text-xs font-label-caps text-primary transition-all select-none"
                  >
                    <span className="material-symbols-outlined text-base">arrow_back</span>
                    Return to Pitch
                  </Link>
                </div>
              )}

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
