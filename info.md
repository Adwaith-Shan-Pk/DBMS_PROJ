# 📁 info.md — File Reference Guide
## Inventory Management System (Nuxt.js Full Stack)

This file describes every file inside the `backend/` and `frontend/` folders,
what it does, and why it exists. Read this after the code has been generated.

---

## `backend/` — Nuxt 3 API Server

```
backend/
├── .env
├── nuxt.config.ts
├── package.json
├── server/
│   ├── utils/
│   │   └── db.ts
│   ├── middleware/
│   │   └── cors.ts
│   └── api/
│       ├── auth/
│       │   ├── login.post.ts
│       │   └── logout.post.ts
│       ├── dashboard.get.ts
│       ├── items/
│       │   ├── index.get.ts
│       │   ├── index.post.ts
│       │   ├── [id].get.ts
│       │   ├── [id].put.ts
│       │   └── [id].delete.ts
│       ├── customers/
│       │   ├── index.get.ts
│       │   ├── index.post.ts
│       │   ├── [id].get.ts
│       │   ├── [id].put.ts
│       │   └── [id].delete.ts
│       ├── vendors/
│       │   ├── index.get.ts
│       │   ├── index.post.ts
│       │   ├── [id].get.ts
│       │   ├── [id].put.ts
│       │   └── [id].delete.ts
│       ├── sales/
│       │   ├── index.get.ts
│       │   ├── index.post.ts
│       │   ├── [id].get.ts
│       │   ├── [id].put.ts
│       │   └── [id].delete.ts
│       ├── purchases/
│       │   ├── index.get.ts
│       │   ├── index.post.ts
│       │   ├── [id].get.ts
│       │   ├── [id].put.ts
│       │   └── [id].delete.ts
│       └── admins/
│           ├── index.get.ts
│           ├── index.post.ts
│           ├── [id].put.ts
│           └── [id].delete.ts
```

### Root Files

| File | Description |
|------|-------------|
| `.env` | Environment variables: `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `FRONTEND_URL`. Never commit this file to git. |
| `nuxt.config.ts` | Nuxt configuration for the backend. Disables Vue rendering (API-only mode), sets Nitro port (e.g. 3001), configures CORS route rules to allow requests from the frontend origin. |
| `package.json` | Node.js project manifest. Lists dependencies: `nuxt`, `mysql2`. |

### `server/utils/`

| File | Description |
|------|-------------|
| `db.ts` | Creates and exports a shared MySQL connection pool using `mysql2/promise`. All API route handlers import `pool` from here to run queries. Using a pool (not a single connection) prevents connection drops under concurrent requests. |

### `server/middleware/`

| File | Description |
|------|-------------|
| `cors.ts` | Global Nitro middleware that sets `Access-Control-Allow-Origin`, `Access-Control-Allow-Methods`, and `Access-Control-Allow-Headers` on every response. Required so the frontend (running on port 3000) can call the backend (running on port 3001) without browser CORS errors. |

### `server/api/auth/`

| File | Description |
|------|-------------|
| `login.post.ts` | Handles `POST /api/auth/login`. Reads `username` and `password` from the request body, queries the `ADMIN` table, and returns the matching admin object (password field excluded). Returns 401 if credentials don't match. |
| `logout.post.ts` | Handles `POST /api/auth/logout`. Returns a success message. Session clearing is done on the frontend (localStorage). |

### `server/api/dashboard.get.ts`

Handles `GET /api/dashboard`. Runs 6 COUNT queries in parallel (items, sales, purchases, customers, vendors, low-stock items where stock < 5), plus fetches the 5 most recent sales and current low-stock items. Returns all results as a single JSON object for the dashboard page.

### `server/api/items/`

| File | Description |
|------|-------------|
| `index.get.ts` | `GET /api/items` — Returns all items with their associated vendor name and customer name via SQL JOINs. |
| `index.post.ts` | `POST /api/items` — Inserts a new item into the `ITEM` table. Validates required fields (itemno, itemname, stock, unitprice). |
| `[id].get.ts` | `GET /api/items/:id` — Returns a single item by its primary key. |
| `[id].put.ts` | `PUT /api/items/:id` — Updates an existing item's fields. |
| `[id].delete.ts` | `DELETE /api/items/:id` — Deletes an item by ID. |

### `server/api/customers/`

| File | Description |
|------|-------------|
| `index.get.ts` | `GET /api/customers` — Returns all customer records. |
| `index.post.ts` | `POST /api/customers` — Creates a new customer. Validates name and mobile. |
| `[id].get.ts` | `GET /api/customers/:id` — Returns a single customer. |
| `[id].put.ts` | `PUT /api/customers/:id` — Updates customer details. |
| `[id].delete.ts` | `DELETE /api/customers/:id` — Deletes a customer. |

### `server/api/vendors/`

| File | Description |
|------|-------------|
| `index.get.ts` | `GET /api/vendors` — Returns all vendor records. |
| `index.post.ts` | `POST /api/vendors` — Creates a new vendor. Validates name and mobile. |
| `[id].get.ts` | `GET /api/vendors/:id` — Returns a single vendor. |
| `[id].put.ts` | `PUT /api/vendors/:id` — Updates vendor details. |
| `[id].delete.ts` | `DELETE /api/vendors/:id` — Deletes a vendor. |

### `server/api/sales/`

| File | Description |
|------|-------------|
| `index.get.ts` | `GET /api/sales` — Returns all sales joined with the `ADMIN` table to include the admin's username. |
| `index.post.ts` | `POST /api/sales` — Inserts a new sale. After insert, automatically runs `UPDATE ITEM SET stock = stock - quantity WHERE id = <item_id>` to reduce inventory. Sets `saledate` to current timestamp if not provided. |
| `[id].get.ts` | `GET /api/sales/:id` — Returns a single sale record. |
| `[id].put.ts` | `PUT /api/sales/:id` — Updates the sale's status (Completed / Pending / Cancelled). |
| `[id].delete.ts` | `DELETE /api/sales/:id` — Deletes a sale record. |

### `server/api/purchases/`

| File | Description |
|------|-------------|
| `index.get.ts` | `GET /api/purchases` — Returns all purchase records. |
| `index.post.ts` | `POST /api/purchases` — Inserts a new purchase. After insert, automatically runs `UPDATE ITEM SET stock = stock + quantity WHERE itemno = <itemno>` to increase inventory. Sets `purchase_date` to current timestamp if not provided. |
| `[id].get.ts` | `GET /api/purchases/:id` — Returns a single purchase record. |
| `[id].put.ts` | `PUT /api/purchases/:id` — Updates an existing purchase. |
| `[id].delete.ts` | `DELETE /api/purchases/:id` — Deletes a purchase record. |

### `server/api/admins/`

| File | Description |
|------|-------------|
| `index.get.ts` | `GET /api/admins` — Returns all admin records. Password field is always excluded from the response. |
| `index.post.ts` | `POST /api/admins` — Creates a new admin. Validates username, password, and fullname. |
| `[id].put.ts` | `PUT /api/admins/:id` — Updates an admin's details (username, fullname, status, or password). |
| `[id].delete.ts` | `DELETE /api/admins/:id` — Deletes an admin record. |

---

## `frontend/` — Nuxt 3 Vue Application

```
frontend/
├── .env
├── nuxt.config.ts
├── package.json
├── tailwind.config.ts
├── app.vue
├── layouts/
│   ├── default.vue
│   └── auth.vue
├── pages/
│   ├── login.vue
│   ├── index.vue          (redirects to /dashboard)
│   ├── dashboard.vue
│   ├── items.vue
│   ├── sales.vue
│   ├── purchases.vue
│   ├── customers.vue
│   ├── vendors.vue
│   └── admins.vue
├── components/
│   ├── ThemeToggle.vue
│   ├── SidebarNav.vue
│   ├── TopNavbar.vue
│   ├── BaseModal.vue
│   ├── BaseTable.vue
│   ├── BaseButton.vue
│   ├── BaseBadge.vue
│   ├── StatsCard.vue
│   └── ConfirmDialog.vue
└── composables/
    ├── useTheme.ts
    ├── useAuth.ts
    └── useApi.ts
```

### Root Files

| File | Description |
|------|-------------|
| `.env` | Frontend environment variables. Primarily `NUXT_PUBLIC_API_BASE=http://localhost:3001` — the URL of the backend. |
| `nuxt.config.ts` | Nuxt configuration for the frontend. Registers `@nuxtjs/tailwindcss`, sets `runtimeConfig.public.apiBase`, enables auto-imports for components and composables. |
| `package.json` | Lists frontend dependencies: `nuxt`, `@nuxtjs/tailwindcss`, `lucide-vue-next` (or `@iconify/vue`). |
| `tailwind.config.ts` | Tailwind configuration. Sets `darkMode: 'class'` so dark mode is triggered by adding the `dark` class to `<html>`. Extends theme if needed. Contains no purple color definitions. |
| `app.vue` | Root Vue component. Contains `<NuxtLayout>` and `<NuxtPage>`. Applies the dark class to `<html>` based on the persisted theme preference on mount. |

### `layouts/`

| File | Description |
|------|-------------|
| `default.vue` | Main application layout used by all authenticated pages. Contains the `SidebarNav` on the left and `TopNavbar` at the top. The page content renders inside a `<slot />`. Handles sidebar collapse on mobile. |
| `auth.vue` | Minimal layout used only by the `/login` page. Centers the login card on screen. No sidebar or topbar. |

### `pages/`

| File | Description |
|------|-------------|
| `login.vue` | Login page at `/login`. Uses `auth` layout. Submits credentials to `POST /api/auth/login`. On success, saves admin info to localStorage and redirects to `/dashboard`. Shows inline error on failure. |
| `index.vue` | Root route `/`. Immediately redirects to `/dashboard` (or `/login` if not authenticated). |
| `dashboard.vue` | Dashboard at `/dashboard`. Fetches `GET /api/dashboard` and renders 6 `StatsCard` components plus two summary tables (recent sales, low stock items). |
| `items.vue` | Items management at `/items`. Full CRUD: list all items in a table, add/edit via `BaseModal` form, delete via `ConfirmDialog`. Stock levels are color-coded green/amber/red. |
| `sales.vue` | Sales management at `/sales`. Full CRUD. Status column uses `BaseBadge`. The Add Sale form lets the user pick the admin from a dropdown. |
| `purchases.vue` | Purchases management at `/purchases`. Full CRUD for purchase records. |
| `customers.vue` | Customer management at `/customers`. Full CRUD with modal forms. |
| `vendors.vue` | Vendor management at `/vendors`. Full CRUD with modal forms. |
| `admins.vue` | Admin management at `/admins`. Full CRUD. Password is rendered as a password input (never plain text). Status shown as `BaseBadge`. |

### `components/`

| File | Description |
|------|-------------|
| `ThemeToggle.vue` | A button that shows a sun icon in light mode and a moon icon in dark mode. On click it calls `useTheme().toggleTheme()`. Used in `TopNavbar`. |
| `SidebarNav.vue` | Left sidebar with navigation links (Dashboard, Items, Sales, Purchases, Customers, Vendors, Admins). Highlights the currently active route. Collapses to a hamburger menu on mobile. Full dark/light support. |
| `TopNavbar.vue` | Top navigation bar. Displays the current page title, the `ThemeToggle` button, the logged-in admin's full name, and a Logout button. On logout it calls `useAuth().logout()` and redirects to `/login`. |
| `BaseModal.vue` | A reusable modal dialog component. Accepts a `title` prop and a default slot for content. Has an X close button and closes when the backdrop is clicked. Emits a `close` event. Used by all CRUD forms. |
| `BaseTable.vue` | A reusable table wrapper. Accepts a `headers` prop (array of column names) and a default slot for `<tr>` rows. Wraps in an overflow container so it scrolls horizontally on small screens. |
| `BaseButton.vue` | A styled button component. Accepts a `variant` prop: `primary` (blue), `secondary` (gray), `danger` (red). Handles disabled and loading states. |
| `BaseBadge.vue` | A small pill-shaped label. Accepts `label` (text) and `color` props (`green`, `amber`, `red`, `gray`). Used for sale statuses, admin statuses, etc. |
| `StatsCard.vue` | A summary card for the dashboard. Displays an icon, a label (e.g. "Total Items"), and a number. Accepts `icon`, `label`, `value`, and `color` props. |
| `ConfirmDialog.vue` | A confirmation modal that appears before a destructive action (delete). Displays a warning message and two buttons: Confirm (red) and Cancel. Emits `confirm` and `cancel` events. |

### `composables/`

| File | Description |
|------|-------------|
| `useTheme.ts` | Manages the dark/light theme. Reads the initial preference from `localStorage.theme`. Exposes `isDark` (ref) and `toggleTheme()`. On toggle, adds/removes the `dark` class from `document.documentElement` and persists the new value to localStorage. |
| `useAuth.ts` | Manages authentication state. Stores the logged-in admin object in `localStorage` as `currentAdmin`. Exposes `currentAdmin` (ref), `isLoggedIn` (computed), `login(adminData)`, and `logout()`. `logout()` clears localStorage and navigates to `/login`. |
| `useApi.ts` | A thin wrapper around Nuxt's `$fetch`. Automatically prepends `runtimeConfig.public.apiBase` to all paths. Provides typed helper functions: `apiGet(path)`, `apiPost(path, body)`, `apiPut(path, body)`, `apiDelete(path)`. Surfaces API errors as thrown exceptions so pages can catch and display them. |

---

## Notes

- The `backend/` and `frontend/` projects are independent Nuxt apps. Run them separately:
  - Backend: `cd backend && npm run dev` → runs on `http://localhost:3001`
  - Frontend: `cd frontend && npm run dev` → runs on `http://localhost:3000`
- The backend must be running before the frontend can fetch data.
- All color choices avoid purple. Approved Tailwind color classes: `blue-*`, `green-*`, `amber-*`, `red-*`, `gray-*`, `slate-*`, `zinc-*`.
- Dark mode is class-based. The `dark` class is applied to `<html>` by `useTheme.ts` on app load.