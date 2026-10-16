# NTIS 2.0: Architecture & Developer Onboarding Guide
## The Modern Municipal ERP Engineering Standard
**Sthapatya Consultants (I) Pvt. Ltd. • Core Architecture Documentation**  
**Audience:** All Software Engineers, Technical Leads, and Solution Architects  

---

## 1. Welcome to NTIS 2.0

If you are a new developer or architect joining the project, **read this document first**.

This platform is a high-volume **Municipal Enterprise Resource Planning (ERP)** system running mission-critical civic workflows:
* **PTIS (Property Tax Information System)**: Multi-unit apartment assessments, retrospective tax recalculations, capital/rateable value registers.
* **WTIS (Water Tax Information System)**: Metered/unmetered billing, slab-based tariff engines, tap sizing.
* **Municipal Assets & GIS**: Spatial infrastructure registers, satellite wayback imagery (Leaflet / Esri).
* **Citizen Grievance Redressal**: Workflow routing, SLA escalation ladders.

---

## 2. High-Level Architectural Pattern: SSR + Hydration with Clean Vertical Slices

We use **Next.js 15+ App Router**, **React 19**, **TanStack Query v5**, **TanStack Virtual**, **Vitest**, and **Zod** configured in a **Hybrid Vertical Slice Architecture**:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 1. EDGE / MIDDLEWARE GATEKEEPER (src/middleware.ts)                          │
│    - Inspects session tokens & tenant product license                       │
│    - Blocks disabled modules at the edge before downloading any JS bundles   │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
┌──────────────────────────────────────▼──────────────────────────────────────┐
│ 2. SERVER LAYER (Next.js Server Component: page.tsx)                        │
│    - Runs on Node.js server (SSR)                                           │
│    - Reads URL searchParams & cookies                                       │
│    - Prefetches data: await prefetchDomainData(queryClient, queryParams)    │
│    - Dehydrates cache: <HydrationBoundary state={dehydrate(queryClient)}>   │
│    - Sends server-rendered HTML for instant First Contentful Paint (FCP)    │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ Streams initial HTML + Dehydrated Cache
┌──────────────────────────────────────▼──────────────────────────────────────┐
│ 3. CLIENT PRESENTATION LAYER ('use client' Workbench)                       │
│    - Client QueryClient receives dehydrated cache without a loading spinner │
│    - Virtualized Data Grids (@tanstack/react-virtual) render 60 FPS tables  │
│    - Fast, interactive client workbenches, filters, and inline calculators  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Directory Layout: Vertical Slice Architecture

We **strictly prohibit** dumping services, types, or hooks into giant global folders. Every business domain is an isolated vertical enclave, while cross-cutting concerns live in `src/shared/`:

```text
src/
├── app/                                 # THIN NEXT.JS APP ROUTER SHELL
│   ├── property-tax/                    # Route entry points only
│   │   └── apartment/page.tsx           # Server Component (Prefetches & Dehydrates)
│   ├── water-bill/
│   ├── grievance/
│   ├── layout.tsx                       # Root layout & providers
│   └── middleware.ts                    # Edge module licensing guard
│
├── modules/                             # ISOLATED BUSINESS DOMAIN SLICES
│   ├── property-tax/                    # DOMAIN: PTIS
│   │   ├── domain/                      # Layer 1: Entities & Zod Schemas
│   │   ├── infrastructure/              # Layer 2: API endpoints & DTO mappers
│   │   ├── application/                 # Layer 3: TanStack Query hooks & prefetchers
│   │   └── presentation/                # Layer 4: Virtualized tables, forms, pages
│   │
│   ├── water-bill/                      # DOMAIN: WTIS (Completely isolated)
│   ├── assets/                          # DOMAIN: Municipal Assets & GIS
│   └── grievance/                       # DOMAIN: Grievance Workflows
│
├── shared/                              # CROSS-CUTTING FOUNDATION LAYER
│   ├── config/                          # App config, runtime config, feature toggles
│   │   ├── app.config.ts                # Base URLs, timeouts, pagination limits
│   │   └── modules.config.ts            # Product licensing & tenant module catalogs
│   ├── i18n/                            # Internationalization (English, Marathi, Hindi)
│   │   └── config.ts                    # Locales, dictionary loaders, translation keys
│   ├── http/                            # Universal apiClient.ts & api-types.ts
│   ├── providers/                       # QueryProvider.tsx
│   ├── ui/                              # Design System (Button, Badge, Modal, Input)
│   └── utils/                           # cn.ts, formatters, currency helpers
│
└── __tests__/                           # AUTOMATED TEST SUITE (Vitest + Testing Library)
    ├── setup.ts                         # Jest DOM matcher setup
    ├── modules/                         # Domain entity & schema unit tests
    └── shared/                          # Config, i18n, and utility tests
```

---

## 4. Why `config` and `i18n` Belong in the `shared/` Layer

### The Architectural Rule:
1. **One-Way Dependency Rule**: `src/modules/*` can import from `src/shared/*`. But **`src/shared/*` must NEVER import from `src/modules/*`**.
2. **`config` is Cross-Cutting**: API endpoints, tenant IDs, environment flags, and icon registries are needed across Property Tax, Water Tax, and Grievance.
3. **`i18n` is Cross-Cutting**: Multilingual translations (English, Marathi, Hindi) and date/currency formatters are used in every single screen and modal. Placing `i18n` inside a specific module causes circular dependency errors and duplicate bundle loading.

---

## 5. Automated Test Suite (Vitest + JSDOM)

The project includes an automated test runner configured in `vitest.config.ts`:

### Available Test Scripts:
* `npm test`: Interactive watch mode for TDD development.
* `npm run test:run`: Single-run CI test execution.
* `npm run test:coverage`: Generates test coverage reports (`v8` provider).

### What We Test:
1. **Domain Boundary Testing (`AssessmentUnitSchema.test.ts`)**:
   * Ensures Zod rejects invalid inputs, coerces string numbers, and applies default values.
2. **Shared Config & i18n Testing (`configAndI18n.test.ts`)**:
   * Verifies supported languages (English, Marathi, Hindi) and fallback dictionary resolution.

---

## 6. Architectural Decision Records (ADRs): Why This Was Chosen vs. Why Others Were Avoided

### ADR 1: Why SSR + Hydration Boundary instead of Pure CSR?
* **Why Chosen**: Municipal clerks and citizens need fast page loads. Pure CSR sends a blank white HTML shell, forcing users to wait through a loading spinner while JavaScript downloads and requests fire. With SSR prefetching, the server generates HTML with the initial data already embedded.
* **Why Pure Old-School SSR was Avoided**: Pure SSR causes full page reloads whenever a user sorts, filters, or paginates. In a 20-column tax ledger, full page reloads destroy productivity.
* **The Hybrid Result**: Initial render has **zero spinner (SSR)**, but ongoing interactions (filtering, sorting, paging) happen **instantly on the client (CSR)**.

### ADR 2: Why Virtualized Data Grids instead of Native DOM Mapping?
* **Why Chosen**: In municipal offices, property registers and assessment lists easily reach 500 to 10,000 items. Rendering 500 items at 20 columns creates **10,000+ DOM nodes**, which freezes low-spec client PCs in ward offices.
* **How it works**: `@tanstack/react-virtual` calculates the scroll offset and only renders the ~15–20 rows currently visible in the viewport.
* **The Result**: 60 FPS butter-smooth scrolling regardless of whether there are 100 or 100,000 rows.

### ADR 3: Why TanStack Query v5 instead of ad-hoc `useEffect` or Redux?
* **Why Chosen**: 80% of application bugs in enterprise apps stem from managing server data manually inside `useEffect`. TanStack Query provides automatic caching, background deduplication, and automated garbage collection.
* **Why Redux was Avoided**: Redux treats server data as client state, requiring hundreds of lines of boilerplate actions, reducers, and selectors just to fetch a list of properties.

### ADR 4: Why Zod at API Boundaries instead of Plain TypeScript Types?
* **Why Chosen**: TypeScript types are completely erased at runtime. If a backend API changes a field name, returns `null` unexpectedly, or has a spelling mistake (e.g. `item.moduleNane`), pure TypeScript will not catch it—the UI crashes with `TypeError: Cannot read properties of undefined`.
* **The Result**: `Zod.safeParse()` intercepts corrupted data, coerces strings to numbers (`z.coerce.number()`), and applies default values before bad data reaches the React render tree.

### ADR 5: Why URL SearchParams instead of React `useState` for Filters?
* **Why Chosen**: If a municipal clerk filters by `Ward: 12`, `Usage: Commercial`, `Page: 4`:
  * If stored in `useState`: Refreshing the page or clicking Browser Back wipes all filters back to Page 1.
  * If stored in URL query parameters (`?ward=12&usage=commercial&page=4`): Browser Back/Forward works naturally, URLs are shareable, and Next.js Server Components read `searchParams` during SSR.

### ADR 6: Why Vertical Feature Slices instead of Micro-Frontends?
* **Why Chosen**: Micro-frontends (Webpack Module Federation) introduce severe DevOps complexity, complex cross-application authentication, CORS issues, and slow CI/CD pipelines.
* **The Result**: A **Modular Monolith** gives you 100% of the domain isolation benefits (PTIS developers never touch WTIS code) while preserving a single deployment pipeline and shared build system.

---

## 7. Developer Golden Rules (Do's and Don'ts)

| # | Never Do This (Forbidden) | Always Do This (Mandatory) |
| :--- | :--- | :--- |
| **1** | Never import code from another module's internal folder (e.g. importing from `@/modules/property-tax/presentation/` inside `water-bill`). | Keep modules self-contained. Place common code in `@/shared/`. |
| **2** | Never store table pagination, search, or active filters inside React `useState`. | Read and write filters using URL search parameters (`searchParams`). |
| **3** | Never render an array of unknown size using raw `.map()` without a table virtualizer. | Use `@tanstack/react-virtual` for all registers, ledgers, and data lists. |
| **4** | Never use `useEffect` to fetch data from backend APIs. | Use TanStack Query (`useQuery` / `useMutation`) in the `application/` layer. |
| **5** | Never bypass TLS security or store unencrypted citizen data in browser LocalStorage. | Use secure server-side tokens and forward audit headers with every mutation. |
| **6** | Never write business calculations directly inside JSX components. | Encapsulate tax math, slab tariffs, and formulas inside the module's `domain/` or `utils/`. |

---

## 8. Reference Project

For a full working reference implementation of this architecture, explore:
📂 **`C:\Users\ashutosh.chikhalkar\Desktop\ntis-v2-prototype`**
* Test Suite: `npm run test:run` (Vitest: 6/6 tests passing).
* Type Check: `npm run type-check` (TypeScript: 0 errors).
* Production Build: `npm run build` (Next.js 15 App Router: 0 errors).
