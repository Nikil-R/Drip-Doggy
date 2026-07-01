# Drip Doggy Admin Design System Specification

This document details the visual identity, typography, color palette, and layout principles used in the Drip Doggy frontend, established to ensure the Admin Dashboard maintains the same premium, high-fashion streetwear aesthetic.

---

## 🎨 Color Palette & Tokens

The Drip Doggy aesthetic is built on high-contrast, minimalist, and warm editorial tones. Avoid using bright default blues, greens, or standard reds.

| Token | Light Theme Value | Dark Theme Value | Purpose |
| :--- | :--- | :--- | :--- |
| `--background` | `#FAF8F5` (Warm Cream) | `oklch(0.145 0 0)` | Base body background |
| `--foreground` | `#030213` (Deep Black) | `oklch(0.985 0 0)` | Main body text |
| `--primary` | `#030213` | `oklch(0.985 0 0)` | Prominent elements & high-fashion buttons |
| `--brand-accent` | `#b2533e` (Terracotta) | `#b2533e` | Secondary focus states & price tags |
| `--card` | `#FFFFFF` | `oklch(0.145 0 0)` | Data tables and dashboard containers |
| `--border` | `rgba(0, 0, 0, 0.1)` | `oklch(0.269 0 0)` | Thin borders separating UI sections |
| `--muted-text` | `#717182` | `oklch(0.708 0 0)` | Secondary labels and descriptions |
| `--muted-bg` | `#ececf0` | `oklch(0.269 0 0)` | Inactive pills or sidebar hover backing |

---

## ✍️ Typography & Font Family

We use premium geometric and neo-grotesque sans-serif fonts loaded from Google Fonts:

```css
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
```

- **Primary Font Family**: `'Outfit'`, `'Plus Jakarta Sans'`, sans-serif
- **Secondary / Monospace Font**: `'Courier New'`, monospace (used strictly for SKUs, order IDs, and numeric OTP entry codes)

### Typography Hierarchy & Spacing

To achieve a "Zara-style" fashion catalog look, rely heavily on **all-caps text, letter-spacing, and high weight contrasts**:

- **Section Headers**:
  - Use `uppercase`, `font-extrabold` (or `font-black`), and custom wide tracking.
  - Tailwind example: `text-[10px] font-black tracking-[0.2em] uppercase text-neutral-400`
- **Main Titles**:
  - Tailwind example: `text-2xl font-extrabold tracking-[0.05em] uppercase text-[#030213]`
- **Body Details**:
  - Tailwind example: `text-xs font-medium tracking-wide`

---

## 📐 Layout & Shapes

A key differentiator for Drip Doggy's streetwear branding is the rejection of generic rounded corners.

- **Sharp Corners Only**: All buttons, cards, dialogs, inputs, and badges must use **`rounded-none`** (or `--radius: 0px`). Do not use `rounded-md` or `rounded-lg` anywhere.
- **Thin High-Fashion Borders**: Containers should be enclosed in thin, clean borders (`border border-neutral-200/80` or `border-black`).
- **Data Table Layouts**:
  - Column headers must be uppercase, small, and tracked widely.
  - Rows should have thin divider lines (`divide-y divide-neutral-100`) and a subtle background fill on hover (`hover:bg-neutral-50/50`).

---

## ⚡ Micro-Interactions & Hover Effects

- **Hover Underlines**: For text links, use pure text underlines with high offsets.
  - Tailwind example: `hover:underline underline-offset-4 decoration-1 decoration-[#b2533e]`
- **Interactive Badges**: Badges (such as `Paid`, `Pending`, `Stock`) should use flat, low-opacity background fills with clear, matching border definitions:
  - `Paid` (Green badge): `bg-green-50 text-green-700 border-green-200`
  - `Stock Out` / `Canceled` (Red badge): `bg-red-50 text-red-700 border-red-200`
  - `Pending` / `Draft` (Yellow badge): `bg-amber-50 text-amber-700 border-amber-200`
