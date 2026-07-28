# SkFabricatorAndErector-Frontend

[![Frontend CI](https://github.com/saurabhvirkar/SkFabricatorAndErector-Frontend/actions/workflows/ci.yml/badge.svg)](https://github.com/saurabhvirkar/SkFabricatorAndErector-Frontend/actions)

Standalone modern frontend application for **SK Fabricator & Erector**. Built with Angular 21 LTS (Standalone Architecture, Signals, RxJS) and styled with SCSS and Tailwind CSS.

---

## 🏛️ Architecture Overview

The frontend is completely decoupled from the backend and communicates exclusively via HTTPS API calls to `SkFabricatorAndErector-Backend`.

- **Framework**: Angular 21 LTS (Standalone Architecture, `@angular/build` system)
- **State Management**: Signals (`signal`, `computed`, `toSignal`) + RxJS `BehaviorSubject`
- **HTTP Layer**: Centralized `ApiClientService` with `AuthInterceptor` for automatic JWT Bearer token injection and 401 refresh handling
- **Routing**: Angular Router with functional `authGuard`
- **Security**: Security headers in `nginx.conf` (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`)

---

## 📁 Feature Structure

```
src/
├── app/                  # Application Shell & Config
├── core/                 # Centralized Infrastructure (ApiClientService, AuthService, Guards, Interceptors)
├── features/             # Domain Features (Encapsulated)
│   ├── authentication/   # Admin Login
│   ├── home/             # Hero Slider & Services Overview
│   ├── gallery/          # Photo Gallery & Upload/Delete Admin
│   ├── projects/         # Portfolio & Admin CRUD
│   ├── our-services/     # Services Catalog & Admin CRUD
│   ├── team/             # Team Roster & Admin CRUD
│   ├── clients/          # Client Logos & Admin CRUD
│   ├── inquiries/        # Public Inquiry Form & Admin Dashboard
│   ├── about/            # Company Story & About Slider
│   └── contact/          # Contact Page & Embedded Map
├── shared/               # Reusable UI (Header, Footer, Map, ScrollingClients, Constants)
└── environments/         # Dev (/api proxy) & Prod (Render backend URL)
```

---

## 🛠️ Local Development & Commands

```bash
# 1. Install dependencies
npm install

# 2. Run local dev server with API proxy (points /api to localhost:8080)
npm start

# 3. Execute unit test suite (40 tests)
npm test -- --watch=false --browsers=ChromeHeadless

# 4. Build production bundle
npm run build
```

---

## 🐳 Docker Deployment

The application includes a standalone multi-stage `Dockerfile`:

```bash
# Build container image
docker build -t sk-fabricator-ui .

# Run container locally on port 8080
docker run -d -p 8080:80 sk-fabricator-ui
```

---

## 📖 Migration Documentation

All migration documentation is available in `docs/`:
- [`docs/architecture/FRONTEND_ARCHITECTURE.md`](file:///c:/Develop/FinalCode/SkFabricatorAndErector-Frontend/docs/architecture/FRONTEND_ARCHITECTURE.md)
- [`docs/migration/FRONTEND_INVENTORY.md`](file:///c:/Develop/FinalCode/SkFabricatorAndErector-Frontend/docs/migration/FRONTEND_INVENTORY.md)
- [`docs/migration/FRONTEND_MIGRATION_MAP.md`](file:///c:/Develop/FinalCode/SkFabricatorAndErector-Frontend/docs/migration/FRONTEND_MIGRATION_MAP.md)
- [`docs/migration/API_INTEGRATION_MAP.md`](file:///c:/Develop/FinalCode/SkFabricatorAndErector-Frontend/docs/migration/API_INTEGRATION_MAP.md)
- [`docs/migration/FRONTEND_SECURITY_AUDIT.md`](file:///c:/Develop/FinalCode/SkFabricatorAndErector-Frontend/docs/migration/FRONTEND_SECURITY_AUDIT.md)
- [`docs/migration/FRONTEND_DEPLOYMENT_PLAN.md`](file:///c:/Develop/FinalCode/SkFabricatorAndErector-Frontend/docs/migration/FRONTEND_DEPLOYMENT_PLAN.md)
