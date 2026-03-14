# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**nnews-react** is a React component library (npm package) for news/article management. It provides ready-made components, hooks, API services, and context providers that consuming applications integrate via `NNewsProvider`. The `example-app/` directory contains a full working application demonstrating library usage.

## Commands

### Library (root)
- `npm run build` — Type-check (tsc) then build with Vite (outputs to dist/)
- `npm run lint` — ESLint with TypeScript extensions
- `npm run test` — Run Vitest once
- `npm run test:watch` — Vitest in watch mode
- `npm run test:coverage` — Coverage report (text, JSON, HTML)
- `npm run type-check` — tsc --noEmit

### Example App (example-app/)
- `npm run dev` — Start Vite dev server
- `npm run build` — Type-check and build

## Architecture

### Library Layer (src/)

**Provider pattern**: `NNewsProvider` is the entry point. It creates an Axios instance with request interceptors that inject `Authorization` and `X-Tenant-Id` headers dynamically. All API services and the client are exposed through React Context.

**Data flow**: `NNewsProvider` → creates `AxiosInstance` → instantiates API services (`ArticleAPI`, `CategoryAPI`, `TagAPI`) → exposes via `useNNews()` context → consumed by hooks (`useArticles`, `useCategories`, `useTags`) → used by components.

**Key directories**:
- `src/contexts/` — `NNewsContext.tsx` (provider, config interface, context)
- `src/services/` — Class-based API clients, one per resource. Each receives an AxiosInstance in constructor.
- `src/hooks/` — State-management wrappers around API services (loading, error, refresh, CRUD)
- `src/components/` — UI components organized by domain (articles/, categories/, tags/, editors/, ui/)
- `src/types/` — TypeScript types and enums (ArticleStatus, PagedResult, etc.)
- `src/i18n/` — i18next setup with "nnews" namespace, English and Portuguese translations

### Example App (example-app/)

Demonstrates integration: wraps with `NAuthProvider` (auth) then `NNewsProvider` (news API). Uses environment variables for API URLs and tenant ID. Protected routes via `ProtectedRoute` component.

## Key Conventions

- **Logging**: All API calls log with `[ServiceName]` prefix (e.g., `[ArticleAPI] list`)
- **Date handling**: API services transform date strings to Date objects via `transformArticleDates`/`transformCategoryDate`
- **Pagination**: `PagedResult<T>` pattern with `hasNext`/`hasPrevious`
- **Hook refresh**: All data hooks track `lastParams` to enable `refresh()` callbacks
- **Styling**: Tailwind CSS with class-based dark mode, Radix-UI primitives, `cn()` utility for class merging
- **Forms**: react-hook-form + Zod validation
- **Path alias**: `@` maps to `./src/` in tsconfig

## Build Configuration

- Library outputs both ESM (`dist/index.js`) and CJS (`dist/index.cjs`) with TypeScript declarations
- External peer dependencies: `react`, `react-dom`, `react-router-dom`, `nauth-react`
- Uses `@vitejs/plugin-react-swc` for fast compilation
- CSS is bundled as a side effect (`dist/style.css`)

## Multi-tenancy

`NNewsConfig.tenantId` is injected as `X-Tenant-Id` header on all requests via the Axios interceptor. In the example app, this comes from `VITE_TENANT_ID` env var.

## Environment Variables (example-app)

- `VITE_API_URL` — NAuth backend URL
- `VITE_NNEWS_API_URL` — NNews backend URL
- `VITE_TENANT_ID` — Tenant identifier for multi-tenant support
