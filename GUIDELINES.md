# Project Guidelines & Styling Rules

To maintain high code quality and consistency with the **Drip Doggy** brand, follow these guidelines.

## 1. Design Aesthetics & Styling

- **Theme & Colors**: The website defaults to a light "Studio Gallery" theme with Warm Editorial Ivory background (`#Fef9f0`) and Rich Carbon text (`#1d1c16`). Custom accents use Burnt Copper.
- **Font Pairings**:
  - **Syne**: Geometric bold sans-serif for displays, major headings, and button caps.
  - **EB Garamond**: Serif styling for subheaders and italics.
  - **DM Sans**: Regular body copy and description blocks.
- **Corner Radii (Sharp 0)**:
  - Do not use rounded styling borders on buttons, input fields, and banners. Keep them sharp (`rounded-none` or `0px`) to project architectural precision.
- **Aesthetic Excellence**: Avoid generic layouts. Use asymmetric grids, dynamic overlays, subtle scale zooms, and crossfading.

## 2. Component Development

- Keep components dry and reusable.
- Put layout-related components (header, hero, footer, newsletter) inside `src/app/components/layout/`.
- Use Radix UI primitives with custom Tailwind styling when designing inputs, selects, or modal overlays to maintain accessibility.

## 3. Performance & Imports

- Use `../../../../assets/` path levels from components to import static assets.
- Clean up unused modules or debug console logs before committing changes.
