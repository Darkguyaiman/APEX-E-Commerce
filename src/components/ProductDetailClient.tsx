'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/db';
import { useCart } from '@/context/CartContext';

interface ProductDetailClientProps {
  product: Product;
  kitProducts: Product[];
}

const SHOE_SIZES = [
  { size: '7', inStock: true },
  { size: '7.5', inStock: true },
  { size: '8', inStock: true },
  { size: '8.5', inStock: true },
  { size: '9', inStock: true },
  { size: '9.5', inStock: false },
  { size: '10', inStock: true },
  { size: '10.5', inStock: true },
  { size: '11', inStock: true },
  { size: '12', inStock: false }
];

interface TechDetail {
  title: string;
  description: string;
  badges?: string[];
}

const PRODUCT_TECH_DETAILS: { [slug: string]: TechDetail[] } = {
  'apex-gold-elite': [
    { title: 'Grip Control Pro Tech', description: 'A specialized multi-layered responsive matrix coating applied to critical contact zones of the upper for surgical grip feel in all weather matches.', badges: ['WATER REPELLENT', 'HIGH COEFF FRICTION'] },
    { title: 'Carbon Chassis Plate', description: 'Proprietary full-foot carbon composite frame layout. Transports energy directly from stride down to studs without horizontal flexion collapse.' },
    { title: 'Agility Anatomical Last', description: 'Engineered with high density circular knit fibers wraps contours like second skin. Reduces inner lock slip by 35% during high speed pivots.' }
  ],
  'velocity-elite-neon': [
    { title: 'Velocity Speed Ribs', description: 'Raised aerodynamic texture lines on the upper redirect airflow and enhance ball rotation when shooting at full pace.', badges: ['AERODYNAMIC', 'SPIN INCREASE'] },
    { title: 'Featherweight Outsole', description: 'Crafted from high-tensile carbon fibers, this chassis is our lightest yet, shedding 20g of dead weight.' },
    { title: 'Anatomical Heel Notch', description: 'Specially sculpted rear cup shape relieves Achilles tendon pressure while retaining total lock stability.' }
  ],
  'apex-predator-carbon': [
    { title: 'Predator Grip Ribs', description: 'Strategic rubberized strike zones across the vamp deliver high friction spin and pinpoint accuracy.', badges: ['STRIKE CONTROL', 'HIGH FRICTION'] },
    { title: 'Carbon Sole Plate', description: 'Full-length 3K carbon fiber composite structure maximizes structural integrity and snap-back responsiveness.' },
    { title: 'Stability Claw Heel', description: 'External wrap-around heel chassis prevents roll-over during intense lateral cuts and sprints.' }
  ],
  'midnight-stealth-x': [
    { title: 'Stealth Knit Collar', description: 'Low-profile elastic collar wraps the ankle seamlessly for a clean boot-to-leg interface.', badges: ['SEAMLESS LOCK', 'LOW PROFILE'] },
    { title: 'Turf Micro-Stud Grid', description: 'Engineered pattern of hundreds of multi-directional rubber studs for unmatched grip on synthetic pitches.' },
    { title: 'Shock Absorbing Cushioning', description: 'Low-profile midsole cushioning redirects shock impact, reducing foot strain during hard turf plays.' }
  ],
  'titan-sg-reinforced': [
    { title: 'Armor Weave Upper', description: 'High-durability Kevlar-reinforced threads woven into key high-wear areas for protection and longevity.', badges: ['KEVLAR ENFORCED', 'HIGH SHEAR'] },
    { title: 'Metal SG Stud Set', description: 'Interchangeable steel studs provide deep penetration on soft, muddy natural grass surfaces.' },
    { title: 'Mud-Release Soleplate', description: 'Hydrophobic coating prevents wet mud from clinging to the outsole, preserving lightweight acceleration.' }
  ],
  'ghost-pro-white': [
    { title: 'Ghost Skin Upper', description: 'Ultra-thin translucent synthetic material offers a second-skin barefoot contact sensation.', badges: ['TRANSLUCENT', 'BAREFOOT TOUCH'] },
    { title: 'Traction Plate', description: 'Optimized TPU soleplate provides snappy acceleration and direct energy transfer.' },
    { title: 'Internal Cage Support', description: 'Underlay support structural webbing retains cleat shape and lockdown during high-speed shifts.' }
  ],
  'crimson-agility': [
    { title: 'Agility Last Framework', description: 'Anatomically designed based on female athletic scans, featuring narrower heels and adjusted arch heights.', badges: ['FEMALE SPECIFIC', 'HIGH ARCH'] },
    { title: 'React Midsole Cushioning', description: 'Calibrated foam returns maximum energy relative to lighter body weight profiles, adding spring to changes of direction.' },
    { title: 'Anatomical Stud Placement', description: 'Strategic stud distribution reduces joint stress and pressure hotspots.' }
  ],
  'crimson-vapor-elite': [
    { title: 'Vapor Skin Matrix', description: 'Sleek synthetic upper optimized for wet conditions, reducing water retention by 90%.', badges: ['WATERPROOF', 'ULTRA-THIN'] },
    { title: 'Crimson Carbon Soleplate', description: 'White carbon weave plate reduces weight while retaining extreme structural response.' },
    { title: 'Narrow Agility Fitting', description: 'Specifically contoured heel narrowness eliminates lift during high-speed cuts.' }
  ],
  'apex-ghost-phantom': [
    { title: '360 Flyknit Fit', description: 'Wraps the foot entirely in stretchy, breathable fibers for a custom compression feel.', badges: ['360 COMFORT', 'COMPRESSION'] },
    { title: 'Hybrid Stud Geometry', description: 'Combines conical studs for easy pivots and bladed studs for high-acceleration take-offs.' },
    { title: 'All Conditions Touch', description: 'Micro-grip treatment across the upper ensures consistent ball friction index in rainy or dry matches.' }
  ],
  'velocity-react-pro': [
    { title: 'React Core Midsole', description: 'High-responsiveness foam insertion in the heel plate absorbs landing shock and adds pop to strides.', badges: ['SHOCK ABSORB', 'HIGH REBOUND'] },
    { title: 'Carbon Weave Accents', description: 'Composite side supports keep the foot stable over the soleplate during heavy cutting forces.' },
    { title: 'Precision Touch Skin', description: 'Grip lines across the toe box optimize friction against the ball for curved passes and strikes.' }
  ],
  'merc-alpha-x': [
    { title: 'Speed Core Upper', description: 'Featherweight multi-layer mesh upper provides structure without bulk, optimizing foot speed.', badges: ['LIGHTWEIGHT MESH', 'SPEED DESIGN'] },
    { title: 'Flat Turf Sole', description: 'Flat micro-groove rubber outsole delivers ultimate traction on street courts and flat gym surfaces.' },
    { title: 'Dri-Mesh Lining', description: 'Internal breathable moisture-wicking lining keeps feet cool during long training drills.' }
  ]
};

const ProductDetailClient: React.FC<ProductDetailClientProps> = ({ product, kitProducts }) => {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState('8.5');
  const [scrollY, setScrollY] = useState(0);
  const [addedMain, setAddedMain] = useState(false);
  const [addedKits, setAddedKits] = useState<{ [id: number]: boolean }>({});
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const imagesList = product.images && product.images.length > 0
    ? product.images
    : [{ image_url: product.image_url, is_main: true }];

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [product.image_url]);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAddMainToCart = () => {
    addToCart(product, selectedSize);
    setAddedMain(true);
    setTimeout(() => setAddedMain(false), 2000);
  };

  const handleAddKitToCart = (kitProduct: Product) => {
    // Socks or bags have custom/one size
    const size = kitProduct.slug === 'core-compression-socks' ? 'L' : 'ONE SIZE';
    addToCart(kitProduct, size);
    
    setAddedKits(prev => ({ ...prev, [kitProduct.id]: true }));
    setTimeout(() => {
      setAddedKits(prev => ({ ...prev, [kitProduct.id]: false }));
    }, 2000);
  };

  const msrp = Number(product.price);

  const customDetails = React.useMemo<TechDetail[]>(() => {
    if (product.faqs) {
      try {
        const parsed = JSON.parse(product.faqs);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed as TechDetail[];
        }
      } catch (e) {
        console.error('Error parsing product faqs:', e);
      }
    }
    return (PRODUCT_TECH_DETAILS[product.slug] || [
      { title: 'Elite Performance Tech', description: 'This professional-grade cleat features premium textures, a carbon plate layout, and responsive structural mesh engineered for the modern athlete.' },
      { title: 'Anatomical Architecture', description: 'Engineered with anatomical contours to match the shape of the foot, reducing slippage during lateral shifts and acceleration.' }
    ]) as TechDetail[];
  }, [product.faqs, product.slug]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % imagesList.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + imagesList.length) % imagesList.length);
  };

  // Touch swipe events for mobile
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextImage();
    } else if (isRightSwipe) {
      prevImage();
    }
  };

  // Mouse swipe/drag events for desktop
  const [mouseDownX, setMouseDownX] = useState<number | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only track left clicks
    setMouseDownX(e.clientX);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (mouseDownX === null) return;
    const distance = mouseDownX - e.clientX;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextImage();
    } else if (isRightSwipe) {
      prevImage();
    }
    setMouseDownX(null);
  };

  const activeImage = imagesList[currentImageIndex]?.image_url || product.image_url;

  return (
    <div className="relative w-full overflow-hidden bg-background">
      {/* Product Image Banner Hero */}
      <section 
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        className="relative h-[60vh] md:h-[75vh] w-full overflow-hidden select-none animate-fade-in cursor-grab active:cursor-grabbing"
      >
        <div 
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ 
            transform: `scale(${1.02 + scrollY * 0.0001}) translateY(${scrollY * 0.15}px)` 
          }}
        >
          <Image 
            src={activeImage} 
            alt={product.name} 
            fill
            priority
            className="object-cover object-center transition-all duration-300"
          />
        </div>

        {/* Overlay Navigation Chevrons */}
        {imagesList.length > 1 && (
          <div className="absolute inset-0 flex items-center justify-between px-4 z-30 pointer-events-none">
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="w-12 h-12 rounded-full bg-black/40 hover:bg-black/75 border border-white/10 text-white flex items-center justify-center transition-all active:scale-90 group pointer-events-auto cursor-pointer"
              aria-label="Previous image"
            >
              <span className="material-symbols-outlined font-bold text-2xl group-hover:-translate-x-0.5 transition-transform">
                chevron_left
              </span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="w-12 h-12 rounded-full bg-black/40 hover:bg-black/75 border border-white/10 text-white flex items-center justify-center transition-all active:scale-90 group pointer-events-auto cursor-pointer"
              aria-label="Next image"
            >
              <span className="material-symbols-outlined font-bold text-2xl group-hover:translate-x-0.5 transition-transform">
                chevron_right
              </span>
            </button>
          </div>
        )}

        {/* Bullet Indicator Dots */}
        {imagesList.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2 pointer-events-auto">
            {imagesList.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImageIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                  currentImageIndex === idx ? 'bg-primary-container w-5' : 'bg-white/30 hover:bg-white/60'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}

        {/* Floating image gallery thumbnails */}
        {imagesList.length > 1 && (
          <div className="absolute right-margin-mobile md:right-margin-desktop bottom-12 z-30 flex gap-2 select-none pointer-events-auto">
            {imagesList.map((img, i) => (
              <button
                key={i}
                onClick={() => setCurrentImageIndex(i)}
                className={`relative w-16 h-16 border bg-black transition-all overflow-hidden cursor-pointer ${
                  currentImageIndex === i
                    ? 'border-primary-container scale-105 shadow-lg'
                    : 'border-white/20 opacity-70 hover:opacity-100 hover:scale-102'
                }`}
              >
                <Image
                  src={img.image_url}
                  alt={`Thumbnail ${i + 1}`}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Product Catalog Title Block */}
      <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mt-12 mb-4 animate-fade-in">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3 select-none">
            <div className="w-2 h-2 rounded-full bg-primary-container status-pulse"></div>
            <span className="font-label-caps text-xs text-primary-container tracking-widest font-black uppercase">
              {product.type_chip || 'ELITE LEVEL PERFORMANCE'}
            </span>
          </div>
          <h1 className="font-headline-lg text-4xl sm:text-5xl md:text-6xl uppercase italic leading-none text-primary font-black">
            {product.name}
          </h1>
          <p className="font-body-md text-sm md:text-base max-w-4xl text-on-surface-variant/80 leading-relaxed mt-2">
            {product.description}
          </p>
        </div>
      </section>

      {/* Details layout Grid */}
      <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mt-stack-default grid grid-cols-1 md:grid-cols-12 gap-gutter">
        {/* Left column config */}
        <div className="md:col-span-5 flex flex-col gap-stack-default">
          <div className="flex justify-between items-baseline border-b border-white/10 pb-4">
            <div>
              <span className="font-label-caps text-[9px] text-on-surface-variant/50 block mb-1">MSRP LOCK</span>
              <h2 className="font-headline-lg text-secondary-container text-4xl font-bold italic tracking-normal">
                RM {msrp.toFixed(2)}
              </h2>
            </div>
            <div className="text-right">
              <span className="font-label-caps text-[9px] text-on-surface-variant/50 block mb-1">COLORWAY</span>
              <p className="font-label-caps text-xs text-primary font-bold">
                {product.colorway}
              </p>
            </div>
          </div>

          {/* Size picker */}
          <div>
            <div className="flex justify-between items-center mb-4 select-none">
              <h3 className="font-label-caps text-xs text-primary font-bold tracking-wider">
                SELECT SIZE (US)
              </h3>
              <Link 
                href="/size-guide"
                className="font-label-caps text-[9px] underline text-on-surface-variant/70 hover:text-white cursor-pointer"
              >
                SIZE GUIDE
              </Link>
            </div>
            
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
              {SHOE_SIZES.map(({ size, inStock }) => {
                if (!inStock) {
                  return (
                    <button
                      key={size}
                      disabled
                      className="h-12 flex items-center justify-center bg-surface-container-low/30 font-label-caps text-xs text-on-surface-variant/20 cursor-not-allowed relative overflow-hidden select-none"
                    >
                      {size}
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-error/10 to-transparent rotate-45"></div>
                    </button>
                  );
                }
                
                const isSelected = selectedSize === size;
                return (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`h-12 flex items-center justify-center glass-card font-label-caps text-xs transition-all cursor-pointer ${
                      isSelected
                        ? 'border-primary-container border-2 bg-primary-container/10 text-primary-container font-bold'
                        : 'text-primary hover:bg-primary-container hover:text-black hover:border-transparent'
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Specs sheet */}
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-card p-4 carbon-pattern border border-white/10">
              <span className="material-symbols-outlined text-primary-container mb-2 font-bold">
                bolt
              </span>
              <p className="font-label-caps text-[9px] text-on-surface-variant/50">WEIGHT</p>
              <p className="font-stats-value text-xl text-primary font-bold">
                {product.weight_grams} <span className="text-[10px] font-normal text-on-surface-variant/70">/ LIGHTEST</span>
              </p>
            </div>
            
            <div className="glass-card p-4 border border-white/10">
              <span className="material-symbols-outlined text-primary-container mb-2 font-bold">
                settings_input_antenna
              </span>
              <p className="font-label-caps text-[9px] text-on-surface-variant/50">TRACTION</p>
              <p className="font-stats-value text-xl text-primary font-bold">
                {product.traction_type}
              </p>
            </div>
          </div>
        </div>

        {/* Right column details folders */}
        <div className="md:col-span-7 md:pl-12 space-y-4">
          {customDetails.map((detail, index) => (
            <details key={detail.title} className="group border-b border-white/10 pb-4" open={index === 0}>
              <summary className="flex justify-between items-center cursor-pointer list-none select-none py-2 hover:opacity-85">
                <h3 className="font-headline-md text-xl uppercase tracking-tight text-primary leading-none">
                  {detail.title}
                </h3>
                <span className="material-symbols-outlined group-open:rotate-180 transition-transform font-bold">
                  expand_more
                </span>
              </summary>
              <div className="mt-4 space-y-3 font-body-md text-sm text-on-surface-variant/80 leading-relaxed animate-fade-in">
                <p>
                  {detail.description}
                </p>
                {detail.badges && detail.badges.length > 0 && (
                  <div className="flex gap-2">
                    {detail.badges.map((badge) => (
                      <span key={badge} className="bg-surface-container-high px-3 py-1 text-[9px] font-label-caps border-l-2 border-primary-container text-on-surface select-none">
                        {badge}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* Product Videos Showcase */}
      {product.videos && product.videos.length > 0 && (
        <section className="mt-section-gap max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12">
          <div className="mb-8 border-b border-white/10 pb-6">
            <p className="font-label-caps text-xs text-primary-container tracking-widest font-black uppercase">PRODUCT SHOWCASE</p>
            <h2 className="mt-2 font-headline-lg text-4xl uppercase italic leading-none text-primary md:text-5xl">
              ACTION FOOTAGE & REVIEWS
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-on-surface-variant/80">
              Watch detailed reviews, wear tests, and technology breakdowns from experts.
            </p>
          </div>

          <div className={`grid gap-6 ${product.videos.length === 1 ? 'max-w-4xl mx-auto grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
            {product.videos.map((vid, index) => {
              const embedUrl = getYouTubeEmbedUrl(vid.video_url);
              if (!embedUrl) return null;
              return (
                <div key={index} className="flex flex-col gap-3 group">
                  <div className="relative aspect-video w-full border border-white/10 bg-black overflow-hidden shadow-2xl">
                    <iframe
                      src={embedUrl}
                      title={vid.title}
                      className="absolute inset-0 w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  </div>
                  <h3 className="font-headline-md text-lg uppercase tracking-tight text-primary leading-none mt-2 group-hover:text-primary-container transition-colors">
                    {vid.title}
                  </h3>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Complete the kit - upsell section */}
      <section className="mt-section-gap skew-divider bg-surface-container-low py-24 relative overflow-hidden">
        <div className="absolute inset-0 carbon-pattern opacity-10 pointer-events-none"></div>
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop relative z-10">
          <div className="mb-12 select-none">
            <h2 className="font-headline-lg text-3xl md:text-headline-lg uppercase italic mb-2 leading-none text-primary">
              COMPLETE THE KIT
            </h2>
            <p className="font-label-caps text-xs text-on-surface-variant/70 tracking-widest">
              ESSENTIAL APPARATUS FOR THE ELITE ATHLETE
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter">
            {kitProducts.map((kitItem) => {
              const isAdded = addedKits[kitItem.id];
              return (
                <div key={kitItem.id} className="group flex flex-col justify-between h-full">
                  <div>
                    <div className="aspect-square glass-card mb-4 overflow-hidden relative select-none">
                      <Image 
                        src={kitItem.image_url} 
                        alt={kitItem.name} 
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      
                      <div className="absolute bottom-2 right-2 z-10">
                        <button 
                          onClick={() => handleAddKitToCart(kitItem)}
                          className="w-9 h-9 rounded-full bg-primary-container text-black flex items-center justify-center shadow-lg cursor-pointer hover:brightness-110 active:scale-90 transition-all"
                        >
                          <span className="material-symbols-outlined text-xl font-bold">
                            {isAdded ? 'check' : 'add'}
                          </span>
                        </button>
                      </div>
                    </div>
                    
                    <h4 className="font-label-caps text-xs text-primary leading-tight uppercase font-bold pr-6">
                      {kitItem.name}
                    </h4>
                  </div>
                  
                  <p className="text-secondary-container font-stats-value text-base mt-2">
                    RM {Number(kitItem.price).toFixed(2)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Sticky Bottom Add To Cart Bar */}
      <div className="fixed bottom-20 md:bottom-6 left-0 md:left-auto md:right-6 w-full md:w-auto z-45 px-margin-mobile md:px-0 flex justify-center md:justify-end pointer-events-none animate-fade-in">
        <button 
          onClick={handleAddMainToCart}
          className="pointer-events-auto bg-primary-container text-black h-16 md:h-[72px] w-full md:w-80 max-w-xl px-8 flex items-center justify-between group glow-effect hover:brightness-110 active:scale-[0.98] transition-all select-none cursor-pointer"
        >
          <span className="font-headline-md text-xl md:text-base uppercase font-black tracking-tight md:tracking-normal">
            {addedMain ? 'DEPLOYED' : 'ADD TO KIT'}
          </span>
          <div className="flex items-center gap-2">
            <span className="font-stats-value text-lg md:text-base font-bold">
              RM {msrp.toFixed(2)}
            </span>
            <span className="material-symbols-outlined group-hover:translate-x-1.5 transition-transform font-bold text-lg md:text-base">
              chevron_right
            </span>
          </div>
        </button>
      </div>
    </div>
  );
};

function getYouTubeEmbedUrl(url: string): string | null {
  if (!url) return null;
  let videoId: string | null = null;
  try {
    const parsed = new URL(url);
    if (parsed.hostname === 'youtu.be') {
      videoId = parsed.pathname.substring(1);
    } else if (parsed.hostname.includes('youtube.com')) {
      if (parsed.pathname.includes('/embed/')) {
        videoId = parsed.pathname.split('/embed/')[1];
      } else {
        videoId = parsed.searchParams.get('v');
      }
    }
  } catch {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      videoId = match[2];
    }
  }
  return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
}

export default ProductDetailClient;
