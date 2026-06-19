# Tech Stack & Developer Guide

Welcome to the **Drip Doggy** workspace. This document serves as the guide for the technologies, configurations, conventions, and style constraints used in the codebase.

## Technical Core

The project is structured as a monorepo containing `frontend/` (React + Vite) and `backend/` (Java Spring Boot + MySQL).


### Frontend Architecture
- **Framework**: [React 18.3.1](https://react.dev/)
- **Build Tool**: [Vite 6.3.5](https://vite.dev/)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **Styling**: 
  - **Tailwind CSS v4** (using `@tailwindcss/vite` plugin for build integration)
  - **Custom CSS Variables** matching the Editorial luxury theme (`frontend/src/styles/theme.css`)
- **Animation**: [Motion v12](https://motion.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Key UI Primitives**: `@radix-ui` primitive components styled via Tailwind

---

## Code Quality & Conventions

1. **Strict Type Safety**: All components should be written in TypeScript (`.tsx` / `.ts`).
2. **Folder Layout**:
   - `frontend/src/app/components/layout/`: Global structure components (Header, Footer, Hero).
   - `frontend/src/app/components/shop/`: Product catalogs, grids, and filtering.
   - `frontend/src/app/components/home/`: Landing/home page specific sections (Categories, FeaturedProducts).
   - `frontend/src/app/components/search/`: Search overlay and query handling.
   - `frontend/src/app/components/ui/`: Zero-radius custom primitive inputs, dialogs, sheets, etc.
   - `frontend/src/app/pages/`: Main page components.
3. **Tailwind Customizations**:
   - Rely strictly on the **Sharp (0)** style system guidelines. Avoid rounded classes (`rounded-lg`, etc.) unless specifically requested.
