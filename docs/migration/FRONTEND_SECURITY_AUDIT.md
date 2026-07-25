# Frontend Security Audit

**Date**: 2026-07-25
**Application**: sk-fabricator-ui
**Status**: Audit only — no changes made.

---

## 1. Authentication & Token Handling

### JWT in localStorage (HIGH RISK)
- **File**: `auth.service.ts`
- **Issue**: JWT access token, refresh token, and user role all stored in `localStorage`
- **Risk**: Accessible to any JavaScript on the page — XSS attacks can steal tokens
- **Recommendation**: During modernization, evaluate `httpOnly` cookie strategy or at minimum implement strict Content Security Policy headers

### Token Exposure in ApiService (MEDIUM RISK)
- **File**: `api.service.ts` (getHeaders method)
- **Issue**: Manual token reading from localStorage in ApiService header building — duplicates what the interceptor already does
- **Recommendation**: Remove manual header building from ApiService. The `AuthInterceptor` already handles Bearer injection. Double injection creates a race condition risk.

### No Token Expiry Handling in Guard (LOW RISK)
- **File**: `auth.guard.ts`
- **Issue**: Guard only checks for role presence — does not verify token expiry. An expired token would pass the guard check but fail the API call.
- **Recommendation**: Acceptably handled by the interceptor's 401→refresh loop, but worth documenting.

---

## 2. File Uploads (HIGH RISK)

- **Files**: `gallery.component.ts`, `home.component.ts`, `projects.component.ts`, `team.component.ts`, `our-services.component.ts`, `clients-details.component.ts`
- **Issue**: No frontend validation of file type, file size, or file name on any upload
- **Risk**: Users can upload non-image files or very large files — wasted bandwidth, potential server overload
- **Recommendation (Task 15)**: Add file type whitelist (`image/jpeg`, `image/png`, `image/webp`) and max size (5MB) on all upload inputs
- **Note**: Backend must also validate — frontend validation is UX only

---

## 3. Form Validation (MEDIUM RISK)

- **Files**: `admin-login`, all CRUD form components
- **Issue**: Admin login has no Angular validators — accepts empty credentials and submits
- **Issue**: Most CRUD forms have no validators at all — empty names, URLs, etc. are accepted
- **Recommendation (Task 10)**: Add `Validators.required`, `Validators.email`, `Validators.maxLength` where appropriate

---

## 4. Error Handling (MEDIUM RISK)

- **File**: `api.service.ts` (handleError method)
- **Issue**: Exposes raw `error.error.message` from backend in some paths — could leak internal backend messages to UI
- **Recommendation (Task 11)**: Implement centralized error handler that maps HTTP status codes to user-friendly messages:
  - 400 → "Invalid request. Please check your input."
  - 401 → "Session expired. Please log in again."
  - 403 → "You do not have permission to perform this action."
  - 404 → "The requested resource was not found."
  - 500 → "A server error occurred. Please try again later."

---

## 5. Hardcoded Business Information (LOW RISK)

- **File**: `_constants/contact.constants.ts`
- **Issue**: Business phone numbers, email address, GST number, address, and CEO name are hardcoded in source code
- **Risk**: Source code is public if repository is public — PII is visible in source
- **Recommendation**: Acceptable for now as this is public contact information. Move to environment config or CMS if required.

---

## 6. Production API URL (HIGH RISK — Immediate Action)

- **File**: `environments/environment.prod.ts`
- **Issue**: Production API URL points to old legacy backend: `https://skfabricatorapi.onrender.com/api`
- **Risk**: If new frontend deployed with old URL, all API calls fail
- **Recommendation (Task 6)**: Update to new backend URL immediately after new backend is deployed

---

## 7. No Content Security Policy

- **Files**: `src/index.html`, `nginx.conf`
- **Issue**: No CSP headers configured anywhere
- **Risk**: Increases XSS impact
- **Recommendation (Task 15)**: Configure CSP in nginx.conf:
  ```
  add_header Content-Security-Policy "default-src 'self'; ...";
  ```

---

## 8. No CSRF Protection

- **Issue**: App uses JWT Bearer in Authorization header (not cookies), so CSRF is not applicable in the standard sense
- **Status**: Acceptable — no action needed

---

## 9. Dependencies

| Package | Version | Known Vulnerability |
|---|---|---|
| @angular/core | ^19.2.0 | None known |
| express | ^4.18.2 | Low severity path-to-regexp (in 4.x) — update to 4.21+ |
| bootstrap | ^5.3.8 | None known |
| tailwindcss | ^4.1.16 | None known |

> Run `npm audit` after Task 16 (dependency cleanup) to get a current report.

---

## 10. Sensitive Data in Source

No secrets, API keys, database credentials, or private keys found in source code.
The only configuration values are:
- `apiUrl` (public API URL — acceptable)
- `contact.constants.ts` (public business contact — acceptable)

---

## Risk Summary

| ID | Issue | Severity | Task |
|---|---|---|---|
| S1 | JWT in localStorage | High | Task 15 |
| S2 | No file type/size validation | High | Task 15 |
| S3 | Production URL points to old backend | High | Task 6 |
| S4 | Form validation absent or minimal | Medium | Task 10 |
| S5 | Error messages may expose backend internals | Medium | Task 11 |
| S6 | Duplicate token injection (ApiService + Interceptor) | Medium | Task 5 |
| S7 | No Content Security Policy | Medium | Task 15 |
| S8 | express path-to-regexp low severity | Low | Task 16 |
