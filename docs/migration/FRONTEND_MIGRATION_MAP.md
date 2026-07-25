# Frontend Migration Map

**Date**: 2026-07-25
**Source**: sk-fabricator-ui (legacy)
**Target**: SkFabricatorAndErector-Frontend (new)

---

## Migration Sequence

```
Task 1  — DONE: Inventory (this document)
Task 2  — Create SkFabricatorAndErector-Frontend repository
Task 3  — Make standalone build pass
Task 4  — Create feature-based structure
Task 5  — Centralize API client
Task 6  — Configure new backend API URL
Task 7  — Migrate authentication (core/auth)
Task 8  — Migrate smallest feature (inquiry-form)
Task 9  — Migrate remaining features one by one
Task 10 — Modernize forms + validation
Task 11 — Centralize error handling
Task 12 — Loading / empty / error states
Task 13 — Unit and component tests
Task 14 — Integration / E2E tests
Task 15 — Security hardening
Task 16 — Dependency cleanup
Task 17 — Performance optimization
Task 18 — UI/UX modernization
Task 19 — CI/CD
Task 20 — Deployment
Task 21 — End-to-end frontend + backend testing
Task 22 — Production cutover
```

---

## File Migration Map

Every source file is mapped to its target location in the new repository.

### Core Infrastructure

| Legacy File | Responsibility | Target Location | Refactoring Required | Risk |
|---|---|---|---|---|
| `api.service.ts` | Central HTTP client | `core/api/api-client.service.ts` | Rename, remove manual header building (interceptor handles it) | Low |
| `auth.service.ts` | JWT state + token management | `core/auth/auth.service.ts` | Update refresh endpoint URL | Low |
| `auth/auth.interceptor.ts` | JWT injection + 401 refresh | `core/auth/auth.interceptor.ts` | Migrate to functional interceptor (Angular 19 preferred) | Medium |
| `auth.guard.ts` | Role-based route guard | `core/auth/auth.guard.ts` | No changes needed | Low |
| `environments/environment.ts` | Dev API URL | `src/environments/environment.ts` | Update apiUrl for new backend | Low |
| `environments/environment.prod.ts` | Prod API URL | `src/environments/environment.prod.ts` | Update to new backend URL | Low |
| `app.config.ts` | App-level providers | `app/app.config.ts` | Migrate interceptors to functional style | Low |
| `app.routes.ts` | Routes | `app/app.routes.ts` | Add lazy loading per feature, add 404 route | Medium |
| `app.component.*` | Shell / root | `app/app.component.*` | No changes needed | Low |

### Shared

| Legacy File | Responsibility | Target Location | Refactoring Required | Risk |
|---|---|---|---|---|
| `pages/map/` | Google Maps embed | `shared/components/map/` | Move — used by multiple pages | Low |
| `pages/scrolling-clients/` | Animated client ticker | `shared/components/scrolling-clients/` | Move — used by home | Low |
| `footer/` | App footer | `shared/components/footer/` | No changes | Low |
| `header/` | App header + nav | `shared/components/header/` | No changes | Low |

### Models

| Legacy File | Target Location | Refactoring Required |
|---|---|---|
| `_models/inquiry.model.ts` | `features/inquiries/models/inquiry.model.ts` | None |
| `_models/gallery-image.model.ts` | `features/gallery/models/photo.model.ts` | Merge with photo.model.ts, add width/height |
| `_models/photo.model.ts` | Merged into gallery/models/photo.model.ts | Remove duplicate |
| `_models/project.model.ts` | `features/projects/models/project.model.ts` | None |
| `_models/service.model.ts` | `features/our-services/models/our-service.model.ts` | Rename to avoid collision |
| `_models/team-member.model.ts` | `features/team/models/team-member.model.ts` | None |
| `_models/client-details.model.ts` | `features/clients/models/client-details.model.ts` | None |
| `_models/home-slider.model.ts` | `features/home/models/home-slider.model.ts` | None |
| `_constants/contact.constants.ts` | `shared/constants/contact.constants.ts` | None |

### Features

| Feature | Legacy Files | Target Feature Folder | Priority |
|---|---|---|---|
| Authentication | `pages/admin-login/`, `auth.service.ts`, `auth.guard.ts`, `auth/auth.interceptor.ts` | `features/authentication/` | High (Task 7) |
| Inquiries (public form) | `pages/inquiry-form/`, `_services/inquiry.service.ts` | `features/inquiries/` | High (Task 8 — smallest) |
| Inquiries (admin) | `pages/inquiry-details/` | `features/inquiries/pages/inquiry-admin/` | High |
| Home | `pages/home/` | `features/home/` | High |
| Gallery | `pages/gallery/`, `_services/gallery.service.ts` | `features/gallery/` | Medium |
| Projects | `pages/projects/`, `_services/project.service.ts` | `features/projects/` | Medium |
| Our Services | `pages/our-services/`, `_services/service.service.ts` | `features/our-services/` | Medium |
| Team | `pages/team/`, `_services/team.service.ts` | `features/team/` | Medium |
| Clients | `pages/clients-details/`, `_services/client.service.ts` | `features/clients/` | Medium |
| About | `pages/about-details/` | `features/about/` | Low |
| Contact | `pages/contact-us/` | `features/contact/` | Low |

---

## Target Folder Structure

```
SkFabricatorAndErector-Frontend/
src/
├── app/
│   ├── app.component.*
│   ├── app.config.ts
│   └── app.routes.ts
│
├── core/
│   ├── api/
│   │   ├── api-client.service.ts
│   │   └── api-error.model.ts
│   ├── auth/
│   │   ├── auth.service.ts
│   │   ├── auth.guard.ts
│   │   └── auth.interceptor.ts
│   └── config/
│       └── environment (via angular.json fileReplacements)
│
├── features/
│   ├── authentication/
│   │   ├── pages/login/
│   │   └── routes.ts
│   ├── home/
│   │   ├── pages/home/
│   │   ├── models/home-slider.model.ts
│   │   ├── services/home-slider.service.ts
│   │   └── routes.ts
│   ├── gallery/
│   │   ├── pages/gallery/
│   │   ├── models/photo.model.ts
│   │   ├── services/gallery.service.ts
│   │   └── routes.ts
│   ├── projects/
│   │   ├── pages/projects/
│   │   ├── models/project.model.ts
│   │   ├── services/project.service.ts
│   │   └── routes.ts
│   ├── our-services/
│   │   ├── pages/our-services/
│   │   ├── models/our-service.model.ts
│   │   ├── services/our-services.service.ts
│   │   └── routes.ts
│   ├── team/
│   │   ├── pages/team/
│   │   ├── models/team-member.model.ts
│   │   ├── services/team.service.ts
│   │   └── routes.ts
│   ├── clients/
│   │   ├── pages/clients/
│   │   ├── models/client-details.model.ts
│   │   ├── services/client.service.ts
│   │   └── routes.ts
│   ├── inquiries/
│   │   ├── pages/inquiry-form/
│   │   ├── pages/inquiry-admin/
│   │   ├── models/inquiry.model.ts
│   │   ├── services/inquiry.service.ts
│   │   └── routes.ts
│   ├── about/
│   │   ├── pages/about/
│   │   └── routes.ts
│   └── contact/
│       ├── pages/contact/
│       └── routes.ts
│
├── shared/
│   ├── components/
│   │   ├── header/
│   │   ├── footer/
│   │   ├── map/
│   │   └── scrolling-clients/
│   ├── constants/
│   │   └── contact.constants.ts
│   └── models/
│
├── assets/
├── environments/
└── styles.scss
```

---

## SRP Violations to Address (After Functional Parity)

| Component | Violation | Resolution |
|---|---|---|
| home.component.ts (264 lines) | Display + admin slider CRUD + services preview | Extract admin section to admin subcomponent |
| projects.component.ts (147 lines) | Public gallery + admin add/edit/delete | Extract AdminProjectsComponent |
| gallery.component.ts (143 lines) | Public gallery + admin upload/delete | Extract AdminGalleryComponent |
| our-services.component.ts (148 lines) | Public services + admin CRUD | Extract AdminServicesComponent |
| team.component.ts (138 lines) | Public team list + admin CRUD | Extract AdminTeamComponent |
| clients-details.component.ts (141 lines) | Public logos + admin CRUD | Extract AdminClientsComponent |
| inquiry-details.component.ts (153 lines) | Admin inquiry list + delete | Clean — admin only, acceptable size |

---

## Recommended Migration Order

1. **Task 7**: `core/auth/` — AuthService, AuthGuard, AuthInterceptor
2. **Task 8**: `features/inquiries/` (inquiry-form) — smallest, no CRUD complexity
3. **Task 9a**: `features/home/` — highest traffic public page
4. **Task 9b**: `features/gallery/`
5. **Task 9c**: `features/projects/`
6. **Task 9d**: `features/our-services/`
7. **Task 9e**: `features/team/`
8. **Task 9f**: `features/clients/`
9. **Task 9g**: `features/about/` and `features/contact/`
10. **Task 9h**: Admin inquiries page
