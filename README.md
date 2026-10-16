# NTIS 2.0: Architecture & Developer Onboarding Guide
** Core Architecture Documentation**
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
├── middleware.ts                        # Edge module licensing guard (Directly under src/)
│
├── app/                                 # THIN NEXT.JS APP ROUTER SHELL
│   ├── property-tax/                    # Route entry points only
│   │   └── apartment/page.tsx           # Server Component (Prefetches & Dehydrates)
│   ├── water-bill/
│   ├── grievance/
│   ├── layout.tsx                       # Root layout & providers
│   ├── loading.tsx                      # Global streaming shimmer skeleton
│   ├── error.tsx                        # Global route error boundary (Try Again)
│   └── not-found.tsx                    # Clean 404 handler
│
├── modules/                             # ISOLATED BUSINESS DOMAIN SLICES
│   ├── property-tax/                    # DOMAIN: PTIS
│   │   ├── types/                       # TypeScript interfaces: assessment.types.ts
│   │   ├── schemas/                     # Zod validation schemas: assessment.schema.ts
│   │   ├── api/                         # API transport functions: assessment.api.ts
│   │   ├── hooks/                       # TanStack Query & custom hooks: useAssessment.ts
│   │   ├── components/                  # Reusable UI widgets: VirtualizedAssessmentTable.tsx
│   │   ├── views/                       # Full client workbenches: ApartmentAssessmentView.tsx
│   │   └── utils/                       # Tax math & difference engine algorithms
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
│   ├── services/                        # Service re-export aliases
│   ├── providers/                       # QueryProvider.tsx
│   ├── ui/                              # Design System (Button, Badge, Modal, Input, ErrorBoundary)
│   └── utils/                           # cn.ts, formatters, currency helpers
│
└── __tests__/                           # AUTOMATED TEST SUITE (Vitest + Testing Library)
    ├── setup.ts                         # Jest DOM matcher setup
    ├── modules/                         # Domain entity & schema unit tests
    └── shared/                          # Config, i18n, and utility tests
```

---

## 4. Modern Frontend Developer Naming Conventions (No Academic Java Jargon)

We replaced theoretical backend DDD terms (`domain/entities`, `infrastructure`, `application`, `presentation`) with **intuitive, standard React/TypeScript conventions**:

| Old Academic Term | Modern Frontend Standard | Responsibility |
| :--- | :--- | :--- |
| `domain/entities/` | **`types/`** | Pure TypeScript interfaces & data contracts (`assessment.types.ts`). |
| `domain/schemas/` | **`schemas/`** | Zod validation schemas at API boundaries (`assessment.schema.ts`). |
| `infrastructure/api/` | **`api/`** | Universal Axios/Fetch functions (`assessment.api.ts`). |
| `application/hooks/` | **`hooks/`** | TanStack Query hooks, query keys, SSR prefetch helpers (`useAssessment.ts`). |
| `presentation/components/` | **`components/`** | Reusable UI widgets (`VirtualizedAssessmentTable.tsx`). |
| `presentation/pages/` | **`views/`** | Full-screen interactive workbenches (`ApartmentAssessmentView.tsx`). |
| `domain/services/` | **`utils/`** | Calculation math, difference engines, formatters (`taxCalculation.utils.ts`). |

---

## 5. Architectural Evolution: Retiring the Legacy 6-Layer Chain

### Why the Old 6-Layer Chain (`UI -> Hook -> Action -> Service -> API`) Was Retired
In legacy guidance, operations were chained through 5 to 6 hops:
```
OLD LEGACY CHAIN (5 to 6 Hops for Every Operation):
UI Component 
   └──> Custom Hook 
         └──> Server Action ('use server') 
               └──> Service Layer 
                     └──> API Service 
                           └──> Backend REST API
```

#### Why That Old Chain Caused Severe Problems:
1. **The "Server Action" Read Anti-Pattern:**
   * Next.js Server Actions (`'use server'`) were designed for **mutations (POST requests)**.
   * When developers used Server Actions to fetch table data (reads), Next.js sent them as **HTTP POST requests** under the hood.
   * **Result:** No HTTP browser caching, no CDN edge caching, and duplicate network requests on every tab switch.
2. **File Fatigue (The 5-File Tax):**
   * To add one single field (e.g. `carpetArea`), a developer had to modify: (1) Component, (2) Hook, (3) Server Action, (4) Service, (5) DTO file.
   * Developers spent 80% of their day wiring glue code across 5 files instead of writing municipal business logic.

---

### What We Follow in the New Architecture (Streamlined 3-Tier Pattern)

We replaced the 6-layer chain with separate, optimized paths for **Reads** and **Writes**:

```
NEW MODERN PATTERN:

READ PATH (Data Tables, Ledgers, Dropdowns):
Page / View ───> Hook (useQuery) ───> API (api.ts) ───> Backend REST API
  │                                    │
  └─ SSR Prefetch (Zero Spinner)       └─ Zod Validation (Runtime Guard)

WRITE PATH (Form Submissions, Edits, Deletes):
Form Modal ───> Hook (useMutation) ───> API (api.ts) ───> Backend REST API
  │                                     │
  └─ React Hook Form + Zod Schema       └─ Auto-invalidates Query Cache on Success!
```

---

### Side-by-Side Comparison: Old vs. New

| Operation | Old Legacy NTIS Approach | New Prototype Architecture | Why the New Way Wins |
| :--- | :--- | :--- | :--- |
| **Fetching Data (Reads)** | `Component -> Hook -> Server Action -> Service -> api.service.ts` | **`View -> useQuery() -> api.ts`** | • Reads use true HTTP GET.<br>• Cached in memory via TanStack Query.<br>• Prefetched during SSR for instant FCP. |
| **Submitting Forms (Writes)** | `Component -> useActionState -> Server Action -> Service -> API` | **`Form -> useMutation() -> api.ts`** | • Validated by Zod before sending.<br>• On success, automatically invalidates table queries so UI updates instantly without full page reloads. |
| **DTO / Types** | Manual TypeScript interfaces with runtime `any` casts | **`types/` + `schemas/` (Zod)** | Types provide compile-time autocomplete; Zod guarantees runtime type safety and number coercion. |
| **Routing & URL State** | `useState` or complex router refreshes | **URL SearchParams (`searchParams`)** | Browser back/forward works; links are bookmarkable and shareable. |

---

### Where Did `Action` and `Service` Go?

* **Where did `Service` go?**  
  `Service` and `API` were merged into **`api/`** (e.g. `assessment.api.ts`). In frontend code, an Axios/Fetch caller that parses DTOs is simply your API client. Having both a `foo.service.ts` and a `foo.api.ts` was an artificial Java-style separation that just passed data through.

* **Where did `Action` go? Does it ever have a place?**  
  Server Actions (`'use server'`) are **only** needed for **Server-Only operations**:
  1. Managing `HttpOnly` security cookies on login/logout.
  2. Calling internal private microservices behind a corporate firewall that the browser cannot reach.
  3. Triggering heavy server background jobs (like an asynchronous 50,000-row Excel export generator).
  
  For standard data grids, ledgers, and CRUD operations, **using `useQuery` and `useMutation` is 10x faster, fully cached, and requires half the code.**

---

## 6. Why `config` and `i18n` Belong in the `shared/` Layer

### The Architectural Rule:
1. **One-Way Dependency Rule**: `src/modules/*` can import from `src/shared/*`. But **`src/shared/*` must NEVER import from `src/modules/*`**.
2. **`config` is Cross-Cutting**: API endpoints, tenant IDs, environment flags, and icon registries are needed across Property Tax, Water Tax, and Grievance.
3. **`i18n` is Cross-Cutting**: Multilingual translations (English, Marathi, Hindi) and date/currency formatters are used in every single screen and modal. Placing `i18n` inside a specific module causes circular dependency errors and duplicate bundle loading.

---

## 7. Automated Test Suite (Vitest + JSDOM)

The project includes an automated test runner configured in `vitest.config.ts`:

### Available Test Scripts:
* `npm test`: Interactive watch mode for TDD development.
* `npm run test:run`: Single-run CI test execution.
* `npm run test:coverage`: Generates test coverage reports (`v8` provider).

### What We Test:
1. **Domain Boundary Testing (`assessment.schema.test.ts`)**:
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
