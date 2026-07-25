# API Integration Map

**Date**: 2026-07-25
**Backend**: SkFabricatorAndErector-Backend
**Frontend**: SkFabricatorAndErector-Frontend (target)

---

## Overview

The frontend calls 32 API endpoints across 9 features. The new backend changed 15 routes compared to the legacy backend. This document maps every frontend API call to the correct new backend route.

All calls must include:
- `Authorization: Bearer {jwt_token}` on protected endpoints (added by AuthInterceptor)
- `Content-Type: application/json` on JSON endpoints
- No header for FormData uploads (browser sets boundary automatically)

The new backend wraps authentication responses in `ApiResponse { statusCode, message, data }`. All other endpoints return raw arrays/objects.

---

## Authentication

| Frontend Feature | Frontend Service | HTTP | Old Route | New Route | Change |
|---|---|---|---|---|---|
| Admin login | AuthService.login() | POST | account/login | account/login | No route change — response now wrapped in ApiResponse.data |
| Token refresh | AuthService.refreshToken() | POST | account/refresh | account/refresh-token | Route suffix changed |

### Response Shape Change (Login)

**Old response (raw)**:
```json
{
  "token": "...",
  "refreshToken": "...",
  "email": "...",
  "role": "..."
}
```

**New response (wrapped)**:
```json
{
  "statusCode": 200,
  "message": "Login successful.",
  "data": {
    "token": "...",
    "refreshToken": "...",
    "email": "...",
    "role": "..."
  }
}
```

**Required change**: `auth.service.ts` must read `response.data.token` instead of `response.token`.

---

## Gallery / Photos

| Feature | Frontend Service | HTTP | Old Route | New Route | Notes |
|---|---|---|---|---|---|
| Get all photos | GalleryService.getPhotos() | GET | gallery | photos | Route renamed |
| Get by category | GalleryService.getImages(filter) | GET | gallery?category=X | photos (no category param) | New backend filters by IsAboutSlider internally; category-based filtering TBD |
| Upload photo | GalleryService.uploadImage() | POST | gallery/add-photo | photos | Route simplified — same FormData payload |
| Delete photo | GalleryService.deleteImage(id) | DELETE | gallery/delete-photo/{id} | photos/{id} | Route simplified |
| Get about slider photos | (not in legacy) | GET | — | photos/about-slider | New endpoint |
| Delete about slider photo | (not in legacy) | DELETE | — | photos/about-slider/{id} | New endpoint |

---

## Home Slider

| Feature | Frontend Service | HTTP | Old Route | New Route | Notes |
|---|---|---|---|---|---|
| Get sliders | HomeSliderService.getHomeSliders() | GET | home-slider | homeslider | Hyphen removed |
| Add slider | HomeSliderService.addHomeSlider() | POST | home-slider | homeslider | Hyphen removed; image now part of same FormData POST |
| Add slider image | HomeSliderService.addHomeSliderImage() | POST | home-slider/add-image | MERGED into POST homeslider | Separate image upload endpoint dropped |
| Update slider | HomeSliderService.updateHomeSlider() | PUT | home-slider/{id} | DROPPED | New backend removed this endpoint |
| Delete slider | HomeSliderService.deleteHomeSlider() | DELETE | home-slider/{id} | homeslider/{id} | Hyphen removed |

> The `update slider` workflow (title/description via PUT) is dropped in the new backend. The home admin UI must use delete + re-add instead.

---

## Projects

| Feature | Frontend Service | HTTP | Old Route | New Route | Notes |
|---|---|---|---|---|---|
| Get all | ProjectService.getProjects() | GET | projects | project | Plural removed |
| Add project | ProjectService.addProject() | POST | projects | project | Plural removed; single FormData POST |
| Add project image | ProjectService.addProjectImage() | POST | projects/image | MERGED into POST project | Separate image endpoint dropped |
| Update project | ProjectService.updateProject() | PUT | projects/{id} | project/{id} | Plural removed |
| Delete project | ProjectService.deleteProject() | DELETE | projects/{id} | project/{id} | Plural removed |
| Get by category | (not in legacy) | GET | — | project/category/{category} | New endpoint |

---

## Our Services

| Feature | Frontend Service | HTTP | Old Route | New Route | Notes |
|---|---|---|---|---|---|
| Get all | ServiceService.getServices() | GET | our-services | ourservices | Hyphen removed |
| Add service | ServiceService.addService() | POST | our-services | ourservices | Hyphen removed; image merged |
| Add service image | ServiceService.addServiceImage() | POST | our-services/add-image | MERGED into POST ourservices | Dropped |
| Update service | ServiceService.updateService() | PUT | our-services/{id} | ourservices/{id} | Hyphen removed |
| Delete service | ServiceService.deleteService() | DELETE | our-services/{id} | ourservices/{id} | Hyphen removed |

---

## Team Members

| Feature | Frontend Service | HTTP | Old Route | New Route | Notes |
|---|---|---|---|---|---|
| Get all | TeamService.getTeamMembers() | GET | team | teammembers | Route renamed |
| Add member | TeamService.addTeamMember() | POST | team | teammembers | Route renamed; image merged |
| Add member image | TeamService.addTeamMemberImage() | POST | team/add-image | MERGED into POST teammembers | Dropped |
| Update member | TeamService.updateTeamMember() | PUT | team/{id} | teammembers/{id} | Route renamed |
| Delete member | TeamService.deleteTeamMember() | DELETE | team/{id} | teammembers/{id} | Route renamed |

---

## Client Details

| Feature | Frontend Service | HTTP | Old Route | New Route | Notes |
|---|---|---|---|---|---|
| Get all | ClientService.getClientDetails() | GET | clients | clientdetails | Route renamed |
| Add client | ClientService.addClient() | POST | clients | clientdetails | Route renamed; image merged |
| Add client image | ClientService.addClientImage() | POST | clients/add-image | MERGED into POST clientdetails | Dropped |
| Update client | ClientService.updateClient() | PUT | clients/{id} | clientdetails/{id} | Route renamed |
| Delete client | ClientService.deleteClient() | DELETE | clients/{id} | clientdetails/{id} | Route renamed |

---

## Inquiries

| Feature | Frontend Service | HTTP | Old Route | New Route | Notes |
|---|---|---|---|---|---|
| Submit inquiry | InquiryService.submitInquiry() | POST | inquiry | inquiry | No change |
| Get all inquiries | InquiryService.getInquiries() | GET | inquiry | inquiry | No change — requires Bearer Admin/Manager |
| Delete inquiry | InquiryService.deleteInquiry() | DELETE | inquiry/{id} | inquiry/{id} | No change |

---

## Summary of Route Changes Required in Frontend

| Service File | Changes Required |
|---|---|
| auth.service.ts | Update refresh endpoint: account/refresh → account/refresh-token; Unwrap login response from ApiResponse.data |
| gallery.service.ts | All 3 routes changed: gallery → photos, gallery/add-photo → photos, gallery/delete-photo/{id} → photos/{id} |
| home-slider.service.ts | Routes: home-slider → homeslider; Remove update method (endpoint dropped); Merge add + add-image |
| project.service.ts | Routes: projects → project, projects/{id} → project/{id}; Remove separate addProjectImage method |
| service.service.ts | Routes: our-services → ourservices; Remove separate addServiceImage method |
| team.service.ts | Routes: team → teammembers; Remove separate addTeamMemberImage method |
| client.service.ts | Routes: clients → clientdetails; Remove separate addClientImage method |
| inquiry.service.ts | No route changes required |

---

## API Base URL Configuration

| Environment | URL |
|---|---|
| Development | http://localhost:8080/api |
| Production | https://sk-fabricator-api.onrender.com/api |

> Note: Dev proxy (proxy.conf.json) maps /api → localhost:8080 so environment.ts remains `/api` for dev.
