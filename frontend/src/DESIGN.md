---
name: Luxury Streetwear Editorial
colors:
  surface: '#fef9f0'
  surface-dim: '#ded9d1'
  surface-bright: '#fef9f0'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f8f3ea'
  surface-container: '#f2ede4'
  surface-container-high: '#ece8df'
  surface-container-highest: '#e7e2d9'
  on-surface: '#1d1c16'
  on-surface-variant: '#444748'
  inverse-surface: '#32302a'
  inverse-on-surface: '#f5f0e7'
  outline: '#747878'
  outline-variant: '#c4c7c7'
  surface-tint: '#5f5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1c1b1b'
  on-primary-container: '#858383'
  inverse-primary: '#c8c6c5'
  secondary: '#974721'
  on-secondary: '#ffffff'
  secondary-container: '#ff996c'
  on-secondary-container: '#772f09'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#271900'
  on-tertiary-container: '#9d8049'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e5e2e1'
  primary-fixed-dim: '#c8c6c5'
  on-primary-fixed: '#1c1b1b'
  on-primary-fixed-variant: '#474746'
  secondary-fixed: '#ffdbcd'
  secondary-fixed-dim: '#ffb597'
  on-secondary-fixed: '#360f00'
  on-secondary-fixed-variant: '#79310b'
  tertiary-fixed: '#ffdea6'
  tertiary-fixed-dim: '#e4c285'
  on-tertiary-fixed: '#271900'
  on-tertiary-fixed-variant: '#5a4313'
  background: '#fef9f0'
  on-background: '#1d1c16'
  surface-variant: '#e7e2d9'
typography:
  display-2xl:
    fontFamily: Syne
    fontSize: 120px
    fontWeight: '800'
    lineHeight: 110px
    letterSpacing: -0.04em
  display-lg:
    fontFamily: Syne
    fontSize: 72px
    fontWeight: '700'
    lineHeight: 76px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: EB Garamond
    fontSize: 48px
    fontWeight: '500'
    lineHeight: 52px
  headline-md:
    fontFamily: Syne
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  body-lg:
    fontFamily: DM Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: DM Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-caps:
    fontFamily: Syne
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.1em
spacing:
  container-max: 1440px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
  stack-xl: 160px
  stack-lg: 80px
  stack-md: 40px
---

## Brand & Style

This design system embodies the intersection of high-fashion editorial aesthetics and gritty streetwear culture. Inspired by the visual language of contemporary fashion houses and art catalogues, it prioritizes "expensive" whitespace, asymmetrical layouts, and a cinematic approach to product presentation. 

The aesthetic is **Minimalist and Editorial**, now presented through a "Studio Gallery" lens. By pivoting to a light mode default, the system evokes a sense of archival clarity, high-end boutiques, and pristine exhibition spaces. It remains characterized by a deliberate absence of UI "clutter" and a focus on art-directed imagery, moving away from standard SaaS patterns toward a high-end digital lookbook that feels like a physical magazine.

## Colors

The palette is anchored by **Warm Editorial Ivory**, providing a textured, parchment-like canvas that feels more premium and organic than a standard white theme. **Rich Carbon** is used for primary typography and structural elements to ensure surgical contrast against the soft background.

- **Primary Background:** Editorial Ivory (#F3EEE5) for all main page canvases, creating a sophisticated, high-contrast foundation that feels like heavy-weight paper.
- **Secondary Surface:** Linen Mist (#EBE5DA) for subtle section differentiation and UI containers.
- **Primary Ink:** Rich Carbon (#171717) used for headlines and core brand elements to provide an "ink-on-paper" feel.
- **Accents:** Burnt Copper (#B45D35) and Dusty Clay are used sparingly for call-to-actions or limited-edition signifiers.
- **Premium Highlight:** Muted Champagne (#D3B277) is reserved for subtle luxury cues, such as "Member Only" tags or collection titles.
- **Borders:** A consistent, low-contrast stroke (#D1CBC1) defines the grid without interrupting the editorial flow.

## Typography

The typographic system utilizes a "High-Low" mix. In this studio-light editorial, the geometric Syne takes center stage across both display and functional labels to reinforce a modern, aggressive edge against the classical background.

- **Syne** provides the "street" edge: a bold, geometric sans-serif used for massive display titles and impactful headers. It is also used for `label-caps`, ensuring even the smallest UI metadata has a structural, avant-garde character.
- **EB Garamond** provides the "luxury" edge: a classical serif used for sub-headers and editorial callouts, often in italics to contrast the heavy weight of Syne.
- **DM Sans** serves as the functional workhorse: an understated, clean sans-serif for body copy and product descriptions, ensuring maximum readability.

Use extreme scale contrasts—pair `display-2xl` headlines with small `label-caps` in Syne to create a rhythmic, magazine-like hierarchy.

## Layout & Spacing

This design system uses a **Fixed Grid** philosophy for desktop to maintain art-directed proportions, transitioning to a fluid model for mobile devices.

- **Grid System:** A 12-column grid with generous 24px gutters. Elements should often intentionally offset from the grid (e.g., an image spanning 7 columns with a 2-column offset) to create a dynamic, editorial feel.
- **Whitespace:** Use `stack-xl` (160px) between major sections to emphasize exclusivity. On a light ivory background, this whitespace acts as "gallery space," focusing the user's eye entirely on the content.
- **Magazine Grids:** Product listings should not follow a standard repetitive grid. Vary the size of product cards (e.g., 2nd and 5th items span 2 columns) to mimic a lookbook layout.
- **Breakpoints:** 
  - Desktop: 1440px+
  - Tablet: 768px - 1439px (8-column grid)
  - Mobile: <767px (4-column grid, margins reduced to 20px)

## Elevation & Depth

To maintain a "printed fashion magazine" aesthetic, this design system avoids traditional drop shadows and blurs. Depth is communicated through **Tonal Layering** and structural lines against the warm base.

- **Surfaces:** All elements sit on the primary Editorial Ivory background. When a container is needed (e.g., a modal or dropdown), use a slightly deeper Linen Mist (#EBE5DA) to create a subtle recessed or layered effect.
- **Borders:** Use thin, 1px solid borders (#D1CBC1) to define structural sections like navigation bars or product grid cells. 
- **High-Contrast Overlays:** For cinematic imagery, text can be overlaid directly on photos using Rich Carbon on light areas or Editorial Ivory on highlights, ensuring a flat, integrated look.

## Shapes

The shape language is strictly **Sharp (0)**. 

To evoke the precision of tailoring and architectural minimalism, all UI elements—including buttons, input fields, and image containers—feature 0px corner radii. This creates a bold, structural silhouette that differentiates the brand from more consumer-grade, rounded interfaces. 

Interactive elements should rely on color shifts or underline animations rather than rounded "pill" shapes to indicate state changes.

## Components

### Editorial Navigation
The navigation should be minimal and text-based. Use `label-caps` in **Syne** for menu items. On hover, implement a 1px carbon underline that expands from the center. The logo should be centered and significantly larger than the navigation links.

### Minimalist CTAs
Buttons are not blocks. They are text-based links using `headline-md` or `label-caps`. 
- **Primary CTA:** Text in Rich Carbon with a persistent 2px underline. On hover, the underline should shift to Burnt Copper.
- **Secondary CTA:** Text in a medium grey/linen with a 1px underline that appears only on hover.

### Magazine-Style Product Cards
Product cards feature large, high-aspect-ratio images. The product name (Syne) and price (DM Sans) should be placed either directly below the image in a tight vertical stack or overlaid in a corner using a sharp-edged background tag.

### Input Fields
Fields consist only of a bottom border (1px solid #D1CBC1). Labels should use `label-caps` in Syne and sit above the line. On focus, the bottom border darkens to Rich Carbon.

### Chips & Tags
Use Sharp (0) rectangles with a 1px carbon border. Backgrounds should be transparent or ivory, using `label-caps` in Syne for the internal text. Reserved for "New Arrival" or "Sold Out" indicators.