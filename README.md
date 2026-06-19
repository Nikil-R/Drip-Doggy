# Drip Doggy 🐶

A premium streetwear e-commerce platform.

## Project Structure

```
Drip-Doggy/
├── frontend/          ← React + Vite frontend application
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   │   ├── layout/    ← Header, Footer, Hero, Newsletter
│   │   │   │   ├── shop/      ← ProductGrid, ProductFilters, CuratedCollections
│   │   │   │   ├── home/      ← Categories, FeaturedProducts
│   │   │   │   ├── search/    ← SearchOverlay
│   │   │   │   ├── figma/     ← Figma-generated UI helpers
│   │   │   │   └── ui/        ← shadcn/ui primitives
│   │   │   └── pages/         ← Route pages (Home, Shop, ProductDetail, etc.)
│   │   ├── assets/            ← Static images and icons
│   │   └── styles/            ← Global CSS and theme
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
│
├── backend/           ← API server (coming soon)
│   └── README.md
│
└── README.md
```

## Getting Started

### Frontend
```bash
cd frontend
npm install    # or: pnpm install
npm run dev    # Starts dev server at http://localhost:5173
npm run build  # Production build
```

### Backend
> Coming soon.
