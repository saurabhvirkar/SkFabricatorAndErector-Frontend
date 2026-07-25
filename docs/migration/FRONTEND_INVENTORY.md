# Frontend Inventory — sk-fabricator-ui

**Date**: 2026-07-25
**Status**: READ-ONLY ANALYSIS — No code modified.
**Source path**: `SkFabricatorAndErector/sk-fabricator-ui/`

---

## 1. Technology Stack (Confirmed from Source)

| Property | Value |
|---|---|
| **Framework** | Angular |
| **Framework Version** | 19.2.x |
| **Language** | TypeScript 5.7.2 |
| **Package Manager** | npm |
| **Build Tool** | Angular CLI 19.2.17 |
| **Style Language** | SCSS |
| **UI Libraries** | Angular Material 19.2.19 + Bootstrap 5.3.8 + Tailwind CSS 4.1.16 |
| **HTTP Client** | Angular HttpClient (provideHttpClient) |
| **Routing** | Angular Router (provideRouter) |
| **State Management** | None — local component state + RxJS BehaviorSubjects |
| **Rendering** | Angular SSR (@angular/ssr 19.2.17) + provideClientHydration() |
| **Testing** | Karma + Jasmine (skipTests: true — no tests exist) |
| **Server** | Express.js (SSR) |

> Three UI libraries present simultaneously (Material + Bootstrap + Tailwind). Risk: redundancy and conflicting styles.

---

## 2. Application Structure

```
sk-fabricator-ui/src/app/
├── _constants/
│   └── contact.constants.ts
├── _models/
│   ├── index.ts
│   ├── client-details.model.ts
│   ├── gallery-image.model.ts
│   ├── home-slider.model.ts
│   ├── inquiry.model.ts
│   ├── photo.model.ts
│   ├── project.model.ts
│   ├── service.model.ts
│   └── team-member.model.ts
├── _services/
│   ├── client.service.ts
│   ├── gallery.service.ts
│   ├── home-slider.service.ts
│   ├── inquiry.service.ts
│   ├── project.service.ts
│   ├── service.service.ts
│   └── team.service.ts
├── auth/
│   └── auth.interceptor.ts
├── environments/
│   ├── environment.ts
│   └── environment.prod.ts
├── pages/
│   ├── about-details/
│   ├── admin-login/
│   ├── clients-details/
│   ├── contact-us/
│   ├── gallery/
│   ├── home/
│   ├── inquiry-details/
│   ├── inquiry-form/
│   ├── map/
│   ├── our-services/
│   ├── projects/
│   ├── scrolling-clients/
│   └── team/
├── footer/
├── header/
├── api.service.ts
├── app.component.*
├── app.config.ts
├── app.config.server.ts
├── app.routes.ts
├── app.routes.server.ts
├── auth.guard.ts
└── auth.service.ts
```

Total source files (TS + HTML + SCSS): **80 files**

---

## 3. Routes

| Path | Component | Guard | Access |
|---|---|---|---|
| `/` | HomeComponent | None | Public |
| `/login` | AdminLoginComponent | None | Public |
| `/about` | AboutDetailsComponent | None | Public |
| `/projects` | ProjectsComponent | None | Public |
| `/team` | TeamComponent | None | Public |
| `/gallery` | GalleryComponent | None | Public |
| `/our-services` | OurServicesComponent | None | Public |
| `/contact-us` | ContactUsComponent | None | Public |
| `/clients` | ClientsDetailsComponent | None | Public |
| `/inquiries` | InquiryDetailsComponent | authGuard (roles: admin/manager) | Admin, Manager |

> No 404/catch-all route. No lazy loading.

---

## 4. Services

| Service | File | Endpoints |
|---|---|---|
| ApiService | api.service.ts | Base HTTP wrapper |
| AuthService | auth.service.ts | account/login, account/refresh |
| GalleryService | _services/gallery.service.ts | gallery, gallery/add-photo, gallery/delete-photo/{id} |
| HomeSliderService | _services/home-slider.service.ts | home-slider, home-slider/{id}, home-slider/add-image |
| ProjectService | _services/project.service.ts | projects, projects/{id} |
| ClientService | _services/client.service.ts | clients, clients/{id}, clients/add-image |
| ServiceService | _services/service.service.ts | our-services, our-services/{id}, our-services/add-image |
| TeamService | _services/team.service.ts | team, team/{id}, team/add-image |
| InquiryService | _services/inquiry.service.ts | inquiry, inquiry/{id} |

---

## 5. Models

| Model | File | Fields |
|---|---|---|
| GalleryImage | gallery-image.model.ts | id, url, isMain, publicId, category, isAboutSlider |
| HomeSlider | home-slider.model.ts | id, title, description, imageUrl, publicId, width, height |
| Inquiry | inquiry.model.ts | id?, name, email, phone?, subject?, category?, preferredContact?, message, submittedAt? |
| Project | project.model.ts | id, title, description, image, category, publicId |
| Service | service.model.ts | id, name, summary, description, imageUrl |
| TeamMember | team-member.model.ts | id, name, role, imageUrl, email?, linkedInUrl?, details? |
| ClientDetails | client-details.model.ts | id, name, imageUrl, clientUrl |
| Photo | photo.model.ts | id, url, isMain, publicId, category, isAboutSlider, width, height |

> GalleryImage and Photo are near-duplicates. Photo adds width/height. Should be unified.

---

## 6. Authentication

| Aspect | Implementation |
|---|---|
| Mechanism | JWT Bearer token |
| Token storage | localStorage (jwt_token, refresh_token, user_role) |
| Login | POST /api/account/login |
| Token refresh | POST /api/account/refresh — automatic on 401 via interceptor |
| Logout | Clears localStorage, navigates to /login |
| Guard | authGuard — functional, role-based |
| Interceptor | AuthInterceptor — Bearer injection + 401 refresh loop |
| Roles | Admin, Manager |
| SSR safety | isPlatformBrowser() guards all localStorage access |

---

## 7. All API Calls (32 total)

| Feature | Method | Endpoint | Auth | Request | Response |
|---|---|---|---|---|---|
| Login | POST | account/login | None | {email,password} | {token,refreshToken,email,role} |
| Refresh | POST | account/refresh | None | {accessToken,refreshToken} | {token,refreshToken} |
| Get photos | GET | gallery | None | — | GalleryImage[] |
| Get photos by cat | GET | gallery?category=X | None | — | GalleryImage[] |
| Upload photo | POST | gallery/add-photo | Bearer | FormData | GalleryImage |
| Delete photo | DELETE | gallery/delete-photo/{id} | Bearer | — | — |
| Get sliders | GET | home-slider | None | — | HomeSlider[] |
| Add slider | POST | home-slider | Bearer | {title,description} | HomeSlider |
| Add slider image | POST | home-slider/add-image | Bearer | FormData | HomeSlider |
| Update slider | PUT | home-slider/{id} | Bearer | {title,description} | HomeSlider |
| Delete slider | DELETE | home-slider/{id} | Bearer | — | — |
| Get projects | GET | projects | None | — | Project[] |
| Add project | POST | projects | Bearer | FormData | Project |
| Update project | PUT | projects/{id} | Bearer | any | Project |
| Delete project | DELETE | projects/{id} | Bearer | — | — |
| Get clients | GET | clients | None | — | ClientDetails[] |
| Add client | POST | clients | Bearer | FormData | ClientDetails |
| Add client image | POST | clients/add-image | Bearer | FormData | ClientDetails |
| Update client | PUT | clients/{id} | Bearer | ClientDetails | ClientDetails |
| Delete client | DELETE | clients/{id} | Bearer | — | — |
| Get services | GET | our-services | None | — | Service[] |
| Add service | POST | our-services | Bearer | FormData | Service |
| Add service image | POST | our-services/add-image | Bearer | FormData | Service |
| Update service | PUT | our-services/{id} | Bearer | any | Service |
| Delete service | DELETE | our-services/{id} | Bearer | — | — |
| Get team | GET | team | None | — | TeamMember[] |
| Add member | POST | team | Bearer | FormData | TeamMember |
| Add member image | POST | team/add-image | Bearer | FormData | TeamMember |
| Update member | PUT | team/{id} | Bearer | TeamMember | TeamMember |
| Delete member | DELETE | team/{id} | Bearer | — | — |
| Get inquiries | GET | inquiry | Bearer Admin/Manager | — | Inquiry[] |
| Delete inquiry | DELETE | inquiry/{id} | Bearer Admin/Manager | — | — |
| Submit inquiry | POST | inquiry | None | Inquiry | Inquiry |

---

## 8. Forms

| Form | Component | Validation |
|---|---|---|
| Admin login | admin-login | None |
| Inquiry submission | inquiry-form | HTML5 required only |
| Add/Edit Project | projects (inline) | required on title only |
| Add/Edit Team Member | team (inline) | None |
| Add/Edit Service | our-services (inline) | None |
| Add/Edit Client | clients-details (inline) | None |
| Add Gallery Photo | gallery (inline) | file required |
| Add Home Slider | home (inline) | None |

---

## 9. File Uploads

All uploads use FormData. No frontend file type or size validation on any form.

Features with uploads: gallery, home slider, project, team member, service, client.

---

## 10. Environment Configuration

| Variable | Dev | Prod |
|---|---|---|
| apiUrl | /api (proxy to localhost:5261) | https://skfabricatorapi.onrender.com/api |
| production | false | true |

Production URL points to old legacy backend — must be updated to new backend.

---

## 11. Deployment

| Artifact | Detail |
|---|---|
| Dockerfile.ui | Node 20 build + Nginx Alpine serve |
| nginx.conf | SPA routing: try_files $uri /index.html |
| SSR | Express server.ts (port 4000) |
| Dockerfile.ui paths | Assume monorepo parent: COPY sk-fabricator-ui/ — broken for standalone build |

---

## 12. Testing

No tests exist. skipTests: true is set in all angular.json schematics.

---

## 13. Page Component Sizes

| Component | TS Lines | Notes |
|---|---|---|
| home.component.ts | 264 | Largest — manages sliders, services preview, admin CRUD all in one |
| inquiry-details.component.ts | 153 | Admin view with inline delete |
| projects.component.ts | 147 | Gallery + admin add/edit/delete inline |
| our-services.component.ts | 148 | Services + admin CRUD inline |
| clients-details.component.ts | 141 | Clients + admin CRUD inline |
| team.component.ts | 138 | Team list + admin CRUD inline |
| gallery.component.ts | 143 | Gallery + admin upload/delete inline |
| about-details.component.ts | 75 | About content + slider images |
| inquiry-form.component.ts | 82 | Contact form |
| admin-login.component.ts | 44 | Login form |

---

## 14. Identified Issues & Risks

### Critical
| ID | Issue | Risk | Location |
|---|---|---|---|
| C1 | JWT in localStorage — XSS vulnerable | High | auth.service.ts |
| C2 | Production URL hardcoded to old backend | High | environment.prod.ts |
| C3 | No file type/size validation on any upload | High | All CRUD components |
| C4 | Dockerfile.ui paths assume monorepo — standalone build broken | High | Dockerfile.ui |

### Architecture
| ID | Issue | Risk | Location |
|---|---|---|---|
| A1 | Large components — display + CRUD + state mixed | Medium | home, projects, team, etc. |
| A2 | No lazy loading — all routes eager | Medium | app.routes.ts |
| A3 | Three competing UI libraries | Medium | package.json |
| A4 | Flat _services/ — no feature grouping | Low | _services/ |
| A5 | GalleryImage + Photo near-duplicate models | Low | _models/ |
| A6 | ServiceService name collision | Low | service.service.ts |

### Backend Compatibility (routes changed in new backend)
| ID | Old Endpoint | New Endpoint | Affected Service |
|---|---|---|---|
| B1 | gallery | photos | gallery.service.ts |
| B2 | gallery/add-photo | photos | gallery.service.ts |
| B3 | gallery/delete-photo/{id} | photos/{id} | gallery.service.ts |
| B4 | home-slider | homeslider | home-slider.service.ts |
| B5 | home-slider/add-image | homeslider (merged) | home-slider.service.ts |
| B6 | home-slider/{id} PUT/GET | Dropped | home-slider.service.ts |
| B7 | projects | project | project.service.ts |
| B8 | clients | clientdetails | client.service.ts |
| B9 | clients/add-image | clientdetails (merged) | client.service.ts |
| B10 | our-services | ourservices | service.service.ts |
| B11 | our-services/add-image | ourservices (merged) | service.service.ts |
| B12 | team | teammembers | team.service.ts |
| B13 | team/add-image | teammembers (merged) | team.service.ts |
| B14 | account/refresh | account/refresh-token | auth.service.ts |
| B15 | Raw login response | Wrapped in ApiResponse.data | auth.service.ts |
