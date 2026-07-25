# Project Baseline — SkFabricatorAndErector-Frontend

**Date**: 2026-07-25
**Repository**: `SkFabricatorAndErector-Frontend`
**Backend API**: `SkFabricatorAndErector-Backend` (`http://localhost:5229` / `https://sk-fabricator-api.onrender.com/api`)

---

## 1. System Version Audit

| Component | Version | Notes |
|---|---|---|
| **Angular Framework** | `19.2.0` | Latest stable Angular 19 release |
| **Angular CLI** | `19.2.17` | Angular DevKit 19 |
| **Angular Material & CDK** | `19.2.19` | Installed & Theme Integrated |
| **TypeScript** | `5.7.2` | Supported for Angular 19 |
| **Node.js** | `v20.19.5` | Recommended LTS |
| **npm** | `11.7.0` | Package manager |
| **Tailwind CSS** | `4.1.16` | Integrated via PostCSS `@use "tailwindcss";` |
| **RxJS** | `~7.8.0` | Reactive Stream Extensions |
| **State Engine** | Angular Signals (`signal`, `computed`) | Primary state strategy |

---

## 2. Baseline Verification Results

- **Production Build (`ng build --configuration production`)**: **PASS** (0 Errors)
- **Karma Unit Test Suite (`npm test`)**: **PASS** (**46/46 Passed**)
- **API Integration**: **PASS** (`ApiClientService` connected to ASP.NET Core 8 API)
- **Authentication**: **PASS** (JWT Bearer Injection + Refresh Token Handler)
