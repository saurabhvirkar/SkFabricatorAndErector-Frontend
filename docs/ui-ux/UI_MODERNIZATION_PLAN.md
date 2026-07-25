# UI Modernization Plan — SkFabricatorAndErector-Frontend

**Date**: 2026-07-25
**Application**: SkFabricatorAndErector-Frontend
**Target Stack**: Angular 19.2 + Angular Material 19 + Angular CDK + Tailwind CSS + Material Symbols

---

## 1. Execution Roadmap

```
TASK 1  — DONE: UI Audit & Inspection
TASK 2  — Angular Version Audit & Verification (Confirm 19.2 stable baseline)
TASK 3  — Angular Material & CDK Foundation (Setup Theme & Font Icons)
TASK 4  — Tailwind CSS Build Integration (Remove CDN script)
TASK 5  — Centralized Design System (_theme.scss, _variables.scss)
TASK 6  — Modern App Shell & Navigation (Header + Collapsible Sidebar Drawer)
TASK 7  — Admin Dashboard Feature (KPI Cards & Recent Activity)
TASK 8  — Feature UI Refactoring (Inquiries, Gallery, Projects, Services, Team, Clients)
TASK 9  — Data Tables Modernization (MatTable, MatSort, MatPaginator)
TASK 10 — Reactive Forms Modernization (MatFormField, MatInput, MatSelect)
TASK 11 — User Feedback System (MatSnackBar, MatDialog, Progress Spinners)
TASK 12 — Responsive Layout Verification (Mobile, Tablet, Desktop)
TASK 13 — Accessibility Hardening (ARIA, Focus Visibility, Keyboard Navigation)
TASK 14 — Performance Optimization (OnPush, Image Lazy Loading)
TASK 15 — Testing & Visual Verification
```

---

## 2. Target Component Hierarchy

```
src/
├── app/
│   ├── core/
│   │   ├── api/                # ApiClientService
│   │   ├── auth/               # AuthService, AuthInterceptor, AuthGuard
│   │   └── layout/             # AppShell, Header, Sidebar, Footer
│   │
│   ├── features/
│   │   ├── dashboard/          # Admin Dashboard KPI Cards
│   │   ├── inquiries/          # Inquiry Form & Admin Table
│   │   ├── gallery/            # Gallery Grid & Photo Upload Dialog
│   │   ├── projects/           # Project Portfolio & Dialog
│   │   ├── our-services/       # Services Catalog & Dialog
│   │   ├── team/               # Team Roster & Dialog
│   │   ├── clients/            # Client Logos & Dialog
│   │   ├── about/              # About Us & History
│   │   └── contact/            # Contact Us & Map
│   │
│   ├── shared/
│   │   ├── components/         # LoadingState, EmptyState, ErrorState, ConfirmationDialog
│   │   └── constants/          # Business Contact Constants
│   │
│   └── styles/
│       ├── _variables.scss     # Color Tokens & Breakpoints
│       ├── _theme.scss         # Angular Material Custom Theme
│       └── _utilities.scss     # Helper Classes
```

---

## 3. Technology Alignment

| Domain | Technology Selection | Purpose |
|---|---|---|
| **UI Components** | `@angular/material` 19 | Primary component library (Cards, Buttons, Tables, Form Fields, Dialogs, SnackBars) |
| **Accessibility** | `@angular/cdk` 19 | Dialog overlays, focus traps, ARIA primitives |
| **Layout & Utilities** | Tailwind CSS 4 | Grid, Flexbox, Spacing, Responsive Breakpoints |
| **Icons** | Material Symbols Rounded | Standardized Google icon set |
| **Forms** | Angular Typed Reactive Forms | Validated form controls with `mat-error` feedback |
| **State** | Angular Signals + Services | Component & Feature state management |
