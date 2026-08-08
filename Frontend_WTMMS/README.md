# Wasana TimberMill Management System (WTMMS) — Angular

A full-featured timber mill management system built with Angular 19, converted from the original React + Vite implementation. The application preserves the exact same UI, layout, styling, animations, responsiveness, and functionality.

## Prerequisites

- Node.js v18 or later (v20 LTS recommended)
- npm v9 or later
- Angular CLI v19

## Installation

```bash
# Navigate to the Angular project directory
cd wtmms-angular

# Install dependencies
npm install
```

## Running the Application

```bash
# Start the development server
npm start
```

Open your browser at `http://localhost:4200`.

Use the default credentials on the login screen:
- **Username:** admin
- **Password:** password

## Building for Production

```bash
npm run build
```

Output is placed in `dist/wtmms-angular/`.

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── layout/          # Main shell layout (sidebar + topbar + router-outlet)
│   │   ├── sidebar/         # Collapsible navigation sidebar
│   │   └── topbar/          # Top header bar with dark mode toggle
│   ├── models/
│   │   └── models.ts        # TypeScript interfaces for all data entities
│   ├── pages/
│   │   ├── login/           # Login page
│   │   ├── dashboard/       # Dashboard with charts and stat cards
│   │   ├── inventory/       # Inventory management with stock bars
│   │   ├── customers/       # Customer management card grid
│   │   ├── suppliers/       # Supplier management table
│   │   ├── sales/           # Sales & orders table
│   │   ├── reports/         # Reports with 4 Chart.js charts
│   │   ├── ai/              # AI demand forecasting with line chart
│   │   ├── notifications/   # Notification centre with read/unread state
│   │   ├── users/           # User management table
│   │   └── profile/         # Profile settings with 3-tab layout
│   ├── services/
│   │   ├── data.service.ts  # All mock data + reactive notification state
│   │   └── theme.service.ts # Dark/light mode toggle
│   ├── app.component.ts     # Root component (router-outlet)
│   ├── app.config.ts        # Application providers
│   └── app.routes.ts        # Route definitions
├── styles.css               # Global styles, CSS variables, theme tokens
└── main.ts                  # Bootstrap entry point
```

## Features

| Page | Features |
|------|----------|
| Login | Password show/hide, form validation, responsive split layout |
| Dashboard | Stat cards, revenue area chart, stock mix doughnut chart, activity feed, AI prediction widget, stock alerts |
| Inventory | Search/filter, stock level progress bars, status badges, alert banners |
| Customers | Card grid, star ratings, segment badges, search |
| Suppliers | Performance summary cards, on-time delivery bars, search |
| Sales & Orders | Summary cards, order table, status/payment badges, search |
| Reports | 4 Chart.js charts: line, bar, area, horizontal bar |
| AI Forecasting | 8-week demand forecast chart, recommendation cards |
| Notifications | Read/unread state, mark all read, click to mark individual |
| User Management | Role/status badges, search filter |
| Profile Settings | 3-tab layout: Personal Details, Security, Preferences |

## Technology Stack

- **Framework:** Angular 19 (standalone components)
- **Language:** TypeScript 5.7
- **Charts:** Chart.js 4
- **Routing:** Angular Router
- **State:** Angular Signals
- **Styling:** CSS custom properties (design tokens), component-scoped styles
- **Icons:** Inline SVG (matching Lucide icon set)
- **Fonts:** Playfair Display, Nunito, DM Mono (Google Fonts)

## Dark Mode

Click the moon/sun icon in the top bar to toggle dark mode. The theme is applied via a `.dark` class on `<html>` and CSS custom properties.
