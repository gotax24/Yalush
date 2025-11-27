# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

Yalush is an e-commerce application for a Venezuelan store with a React frontend and Express/MongoDB backend. The app supports product management, shopping cart, favorites, user authentication (via Clerk), and an admin panel. Prices are displayed in both USD and VES (Venezuelan Bolivar) using live exchange rates from BCV.

## Commands

### Backend (from `/backend`)
```bash
pnpm dev          # Start dev server with nodemon (port 3001)
pnpm start        # Start production server
```

### Frontend (from `/frontend`)
```bash
yarn dev          # Start Vite dev server
yarn build        # Build for production
yarn lint         # Run ESLint
yarn preview      # Preview production build
```

## Architecture

### Backend (`/backend`)
- **Stack**: Express 5, MongoDB/Mongoose, CommonJS modules
- **Entry**: `src/server.js` → `src/app.js`
- **Pattern**: Controllers organized by resource in subdirectories (e.g., `controllers/products/createProduct.controller.js`)

**Models** (`src/models/`):
- `product.model.js` - Products with SKU format `XXX-XXX-NNN`, references Category and Supplier
- `user.model.js` - Users with admin flag, synced with Clerk
- `cartItem.model.js`, `favorite.model.js`, `sale.model.js`, `review.model.js`, `category.model.js`, `supplier.model.js`, `clientMessage.model.js`

**Security**: helmet, cors, rate limiting (100 req/15min)

### Frontend (`/frontend`)
- **Stack**: React 19, Vite, react-router-dom v7, Clerk authentication
- **Entry**: `src/main.jsx` - Sets up ClerkProvider, UserProvider, and routing

**Key Components**:
- `App.jsx` - Layout wrapper with Menu and Footer
- `AdminPanel.jsx` / `AdminRoute.jsx` - Admin-only functionality
- `ProductPage.jsx`, `Cart.jsx`, `FavPage.jsx` - Core shopping features

**State Management**:
- `context/UserContext.jsx` - Provides user data from backend synced with Clerk user

**Custom Hooks** (`src/hooks/`):
- `useDollarToday.jsx` - Fetches daily BCV exchange rate, caches until 9AM next day

**Helpers** (`src/helpers/`):
- `SkuGenerator.js` - Generate product SKUs
- `SendEmailConfirm.js`, `SendEmailContact.js` - EmailJS integrations
- `Translator.js` - Translation utilities

### Environment Variables

**Backend** (`.env`):
- `MONGO_URI` - MongoDB connection string
- `PORT` - Server port (default 3001)

**Frontend** (`.env.local`):
- `VITE_CLERK_PUBLISHABLE_KEY` - Clerk auth key
- `VITE_SERVER_URL` - Backend API URL
- `VITE_EMAILJS_*` - EmailJS configuration

## Conventions

- Backend uses CommonJS (`require`/`module.exports`)
- Frontend uses ES modules
- Controller files export a single function matching filename (e.g., `createProduct.controller.js` exports `createProduct`)
- Spanish comments and error messages throughout codebase
