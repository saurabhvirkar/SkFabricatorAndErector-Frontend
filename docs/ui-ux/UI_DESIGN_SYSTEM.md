# UI Design System — SkFabricatorAndErector-Frontend

**Framework**: Angular 19.2 + Angular Material 19 + Angular CDK + Tailwind CSS 4

---

## 🎨 Color Palette & Tokens

| Token Name | Hex Code | Purpose |
|---|---|---|
| `--color-sk-primary` | `#1d4ed8` | Primary Brand Color (Deep Industrial Blue) |
| `--color-sk-primary-hover` | `#1e40af` | Hover / Active State |
| `--color-sk-dark` | `#0f172a` | Header background & dark surfaces |
| `--color-sk-accent` | `#0284c7` | Secondary Accent |
| `$color-success` | `#16a34a` | Success feedback & active status |
| `$color-warning` | `#d97706` | Warning status badges |
| `$color-error` | `#dc2626` | Destructive actions & error alerts |

---

## 🔤 Typography & Font Hierarchy

- **Primary Font**: `Inter`, `Roboto`, sans-serif
- **Icon Font**: `Material Symbols Outlined`
- **Scale**:
  - `Display / Heading 1`: 2rem (32px), Bold (`font-bold`)
  - `Heading 2`: 1.5rem (24px), Bold (`font-bold`)
  - `Heading 3`: 1.25rem (20px), Semi-bold (`font-semibold`)
  - `Body`: 0.875rem (14px) or 1rem (16px), Regular (`text-slate-700`)
  - `Caption / Badge`: 0.75rem (12px), Medium (`text-slate-500`)

---

## 📐 Layout & Spacing

- **Container Breakpoints**: `320px`, `375px`, `768px`, `1024px`, `1280px`, `1440px+`
- **Border Radius Tokens**:
  - `Card / Modal`: `1rem` (`rounded-2xl`)
  - `Button / Input`: `0.5rem` (`rounded-lg`)
  - `Badge`: `9999px` (`rounded-full`)
