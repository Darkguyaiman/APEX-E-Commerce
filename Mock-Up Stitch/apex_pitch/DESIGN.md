---
name: Apex Pitch
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#c4c9ac'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#8e9379'
  outline-variant: '#444933'
  surface-tint: '#abd600'
  primary: '#ffffff'
  on-primary: '#283500'
  primary-container: '#c3f400'
  on-primary-container: '#556d00'
  inverse-primary: '#506600'
  secondary: '#ffb3b2'
  on-secondary: '#680012'
  secondary-container: '#ff525c'
  on-secondary-container: '#5b000f'
  tertiary: '#ffffff'
  on-tertiary: '#313030'
  tertiary-container: '#e5e2e1'
  on-tertiary-container: '#656464'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#c3f400'
  primary-fixed-dim: '#abd600'
  on-primary-fixed: '#161e00'
  on-primary-fixed-variant: '#3c4d00'
  secondary-fixed: '#ffdad8'
  secondary-fixed-dim: '#ffb3b2'
  on-secondary-fixed: '#410008'
  on-secondary-fixed-variant: '#92001e'
  tertiary-fixed: '#e5e2e1'
  tertiary-fixed-dim: '#c8c6c5'
  on-tertiary-fixed: '#1c1b1b'
  on-tertiary-fixed-variant: '#474746'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  display-hero:
    fontFamily: Barlow Condensed
    fontSize: 72px
    fontWeight: '800'
    lineHeight: '1.0'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Barlow Condensed
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
  headline-lg-mobile:
    fontFamily: Barlow Condensed
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.1'
  headline-md:
    fontFamily: Barlow Condensed
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.2'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.0'
    letterSpacing: 0.1em
  stats-value:
    fontFamily: Barlow Condensed
    fontSize: 20px
    fontWeight: '700'
    lineHeight: '1.0'
spacing:
  unit: 4px
  container-max: 1440px
  gutter: 20px
  margin-desktop: 64px
  margin-mobile: 20px
  stack-tight: 8px
  stack-default: 24px
  section-gap: 80px
---

## Brand & Style

This design system embodies the "Sporty Premium" aesthetic, blending the elite atmosphere of professional football with high-performance technology. The personality is aggressive, precise, and sophisticated, targeting athletes who demand professional-grade gear.

The design style is **High-Contrast / Bold** with a **Glassmorphic** overlay. It utilizes deep, dark canvases to make product photography and performance callouts pop with intense energy. Expect sharp angles, carbon-fiber inspired patterns, and a sense of "forward motion" in every layout. The emotional response is one of adrenaline, exclusivity, and technological superiority.

## Colors

The palette is rooted in the "Midnight Pitch"—a range of deep blacks and charcoals that provide a high-performance backdrop. 

- **Primary (Electric Lime):** Used exclusively for high-priority actions, primary buttons, and performance tech indicators. It represents speed and visibility.
- **Secondary (Neon Crimson):** Reserved for "Flash" sales, price drops, live match updates, and urgent alerts.
- **Neutral / Background:** A tiered system of `#0A0A0A` (Deep Base), `#121212` (Surface), and `#1A1A1A` (Elevated Surface).
- **Accents:** Subtle carbon-grey gradients are used to add texture to backgrounds without distracting from content.

## Typography

Typography is used to convey speed and authority. **Barlow Condensed** is the driver for all headers, utilized in uppercase to maximize its athletic, high-energy impact. Its verticality mimics the lines of a stadium.

**Inter** provides a clean, neutral balance for product descriptions and technical specs, ensuring maximum legibility against dark backgrounds. **JetBrains Mono** is introduced for technical labels and "Spec Sheets" (e.g., weight in grams, stud configuration), evoking a sense of precise engineering and lab-tested performance.

## Layout & Spacing

The layout utilizes a **12-column fluid grid** for desktop and a **4-column grid** for mobile. Spacing is tight and intentional, using a 4px baseline grid to maintain high-density information layouts common in performance cockpits.

- **Asymmetry:** Use intentional offset placements for product images to create a sense of movement.
- **Skewed Containers:** Use 5-degree diagonal clips on section dividers and certain "speed" banners to break the traditional horizontal flow.
- **Safe Zones:** While spacing is tight between related elements (e.g., price and CTA), large "Section Gaps" (80px+) are used to separate different product tiers or tech stories, ensuring the "Premium" feel isn't lost to clutter.

## Elevation & Depth

Depth is created through light and material, rather than traditional shadows alone.

- **Tonal Layering:** The primary background is the deepest black. Product cards sit on a slightly lighter charcoal surface with a subtle 1px inner border (opacity 10% white) to define the edge.
- **Glassmorphism:** Navigation bars and filter overlays use a "Frosted Carbon" effect—60% opacity black with a 20px background blur.
- **Glows:** High-performance products feature a subtle "Electric Lime" outer glow (20% opacity, 40px blur) to simulate stadium lighting or futuristic energy.
- **Carbon Texture:** Use a repeating 4x4px diagonal pattern overlay at 3% opacity on secondary containers to provide a tactile, composite-material feel.

## Shapes

The shape language is primarily **Sharp (0px)** to reflect the aggressive nature of football studs and aerodynamic precision. 

- **Hard Edges:** All primary buttons, input fields, and product cards utilize 90-degree corners.
- **The "Blade" Motif:** Decorative elements and progress bars should use angled ends (45-degree cuts) rather than rounded caps.
- **Exceptions:** Only the smallest functional icons and "Live" status pips may use circular forms to ensure they are distinct from structural UI elements.

## Components

- **Primary CTA:** Sharp-edged, Electric Lime background, black uppercase Barlow Condensed text. Includes a "chevron" icon that shifts 4px to the right on hover.
- **Product Cards:** Glassmorphic base with a 1px border. On hover, the image scales 5% and the background glow intensifies.
- **Performance Chips:** Small, JetBrains Mono labels with a charcoal background and a left-hand 2px vertical accent line in Electric Lime. Used for "Lightweight," "Elite," or "Firm Ground."
- **Price Tags:** High-contrast Neon Crimson text. If a discount is applied, the original price is shown in a struck-through grey with the new price in Crimson.
- **Tech Callouts:** Small "hotspots" on product images that, when clicked, open a glassmorphic popover explaining the boot's material science.
- **Status Indicators:** "In Stock" or "Live Match" updates use a small pulsing Neon Crimson dot to create urgency.