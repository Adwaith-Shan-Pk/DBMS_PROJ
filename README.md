# Inventory Management System

A full-stack web application built with Nuxt.js for managing products, sales, purchases, customers, and vendors. Developed as part of the 21CSC205P Database Management Systems mini project at SRM Institute of Science and Technology.

---

## Tech Stack

- **Frontend:** Nuxt.js 3, Vue 3, Tailwind CSS
- **Backend:** Nuxt.js 3 (Nitro server routes)
- **Database:** MySQL

---

## Project Structure

```
project-root/
├── frontend/    — UI application (pages, components, composables)
├── backend/     — REST API server (Nitro routes, DB connection)
├── task.md      — Full build specification
├── todo.md      — Step-by-step build checklist for professor
├── info.md      — File-by-file reference guide for professor
└── README.md    — This file
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- MySQL running locally

### Database Setup

Create a database named `inventory_db` and run the SQL schema to create the seven tables: `ADMIN`, `CUSTOMER`, `VENDOR`, `ITEM`, `SALE`, `PURCHASE`, and `SALE_PURCHASE`.

### Backend

```bash
cd backend
cp .env.example .env   # fill in your DB credentials
npm install
npm run dev            # runs on http://localhost:3001
```

### Frontend

```bash
cd frontend
npm install
npm run dev            # runs on http://localhost:3000
```

Start the backend before the frontend.

---

## Features

- Admin login and session management
- Dashboard with live inventory statistics and low-stock alerts
- Full CRUD for items, customers, vendors, sales, purchases, and admins
- Stock levels auto-update when a sale or purchase is recorded
- Dark and light theme toggle, persisted across sessions
- Responsive layout with collapsible sidebar

---

## Database Tables

| Table | Description |
|-------|-------------|
| ADMIN | System administrators |
| CUSTOMER | Buyers associated with sales |
| VENDOR | Suppliers associated with purchases |
| ITEM | Product inventory with stock levels |
| SALE | Sales transactions |
| PURCHASE | Purchase transactions |
| SALE_PURCHASE | Bridge table for sale-purchase relationships |

