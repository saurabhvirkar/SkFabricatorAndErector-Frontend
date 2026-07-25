# UI Component Guidelines — SkFabricatorAndErector-Frontend

This guide defines how UI components should be built and combined in `SkFabricatorAndErector-Frontend`.

---

## 🧩 Component Architecture Rules

1. **Angular Material = UI Components**: Use `@angular/material` for Form Fields, Buttons, Cards, Dialogs, SnackBars, and Data Tables.
2. **Tailwind CSS = Layout & Spacing**: Use Tailwind utility classes (`grid`, `flex`, `p-6`, `space-y-4`) for container layout and positioning.
3. **No Native Alert/Confirm**: Always use `MatDialog` with `ConfirmationDialogComponent` for destructive confirmation dialogs and `MatSnackBar` for feedback notifications.
4. **Icons**: Use Google `Material Symbols Outlined` icons with standardized class `.material-symbols-outlined`.

---

## 🛠️ Shared UI Components Overview

| Component | Selector | Location | Description |
|---|---|---|---|
| **HeaderComponent** | `<app-header>` | `shared/components/header` | App Shell navbar, brand badge, contact info bar, mobile drawer menu |
| **FooterComponent** | `<app-footer>` | `shared/components/footer` | App Shell footer, company details & quick links |
| **ConfirmationDialog** | `<app-confirmation-dialog>` | `shared/components/confirmation-dialog` | Reusable modal dialog for delete confirmation |
| **LoadingState** | `<app-loading-state>` | `shared/components/loading-state` | Centered spinner with configurable text |
| **EmptyState** | `<app-empty-state>` | `shared/components/empty-state` | Empty state card with icon & message |
| **ErrorState** | `<app-error-state>` | `shared/components/error-state` | Red alert box with retry event emitter |
