# Frontend Architecture — SkFabricatorAndErector-Frontend

**Framework**: Angular 19.2 (Standalone Components, RxJS, Signals)
**Architecture Pattern**: Modern Feature-Based Architecture
**Repository**: `SkFabricatorAndErector-Frontend` (Standalone)

---

## High-Level Architecture Diagram

```
                       HTTPS API Requests
Browser (Angular UI) ──────────────────────► Backend API (Render.com)
                                                  │
                                                  ▼
                                              PostgreSQL
```

---

## Directory Structure

```
SkFabricatorAndErector-Frontend/
│
├── src/
│   ├── app/
│   │   ├── app.component.*         # App shell layout (Header + RouterOutlet + Footer)
│   │   ├── app.config.ts           # App-level providers (HttpClient, Router, Interceptor)
│   │   ├── app.config.server.ts    # SSR configuration
│   │   └── app.routes.ts           # Main router table & guards
│   │
│   ├── core/                       # Technical Infrastructure (Application-wide)
│   │   ├── api/
│   │   │   ├── api-client.service.ts  # Centralized HTTP client (get, post, put, delete)
│   │   │   └── api-error.model.ts
│   │   └── auth/
│   │       ├── auth.service.ts     # Auth state, JWT management, login/logout, refresh
│   │       ├── auth.interceptor.ts # Bearer token injection & 401 refresh handling
│   │       └── auth.guard.ts       # Role-based functional route guard
│   │
│   ├── features/                   # Self-contained Domain Features
│   │   ├── authentication/         # Login page
│   │   ├── home/                   # Hero slider, featured services preview
│   │   ├── gallery/                # Photo gallery & upload/delete admin
│   │   ├── projects/               # Portfolio list & admin CRUD
│   │   ├── our-services/           # Services catalog & admin CRUD
│   │   ├── team/                   # Team roster & admin CRUD
│   │   ├── clients/                # Client logos & admin CRUD
│   │   ├── inquiries/              # Public inquiry form & admin inquiry dashboard
│   │   ├── about/                  # Company history & about slider
│   │   └── contact/                # Contact information & embedded map
│   │
│   ├── shared/                     # Reusable UI & Utilities
│   │   ├── components/             # Header, Footer, Map, ScrollingClients
│   │   └── constants/              # Contact details & business constants
│   │
│   ├── environments/               # Environment Configuration
│   │   ├── environment.ts          # Dev: /api proxy -> http://localhost:8080
│   │   └── environment.prod.ts     # Prod: https://sk-fabricator-api.onrender.com/api
│   │
│   ├── assets/
│   ├── index.html
│   ├── main.ts
│   └── styles.scss
│
├── docs/
│   ├── architecture/
│   ├── migration/
│   └── deployment/
│
├── angular.json
├── Dockerfile                      # Multi-stage Docker build for Nginx deployment
├── Dockerfile.ui                   # Docker alias for container registry compatibility
├── nginx.conf                      # Nginx SPA static routing configuration
├── package.json
└── tsconfig.json
```

---

## Core Principles

1. **Feature Encapsulation**: Each domain feature under `features/` owns its own pages, components, services, and models. Features do not depend on sibling features.
2. **Centralized Infrastructure**: `core/` owns technical infrastructure (HTTP client, Auth management, Interceptors, Guards).
3. **No Direct Backend Dependency**: The frontend communicates exclusively via HTTPS REST API calls. No direct database access or backend code imports.
4. **Single API Client**: All HTTP requests use `ApiClientService` which reads `environment.apiUrl` and handles error status code mapping automatically.
5. **Interceptor Auth Injection**: `AuthInterceptor` attaches the JWT Bearer header to every request and automatically handles 401 token refresh queuing.
