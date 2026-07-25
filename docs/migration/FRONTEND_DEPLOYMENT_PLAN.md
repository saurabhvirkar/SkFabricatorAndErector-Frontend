# Frontend Deployment Plan

**Date**: 2026-07-25
**Source**: sk-fabricator-ui (monorepo)
**Target**: SkFabricatorAndErector-Frontend (standalone)

---

## Current Deployment (Legacy)

The frontend is currently deployed as part of the combined `SkFabricatorAndErector` repository.

- **Dockerfile.ui**: Multi-stage (Node 20 build → Nginx Alpine)
- **Paths in Dockerfile**: Relative to parent monorepo root — `COPY sk-fabricator-ui/...`
- **Nginx config**: `nginx.conf` inside `sk-fabricator-ui/`
- **Platform**: Render.com (referenced in parent `render.yaml`)
- **Build output**: `dist/sk-fabricator-ui/browser/` (static SPA) or SSR server

---

## Target Deployment (New Repository)

The new frontend repository (`SkFabricatorAndErector-Frontend`) must be independently buildable and deployable.

### Recommended Platform

**Azure Static Web Apps** (recommended) or **Render Static Site**

| Option | Cost | HTTPS | Custom Domain | CI/CD |
|---|---|---|---|---|
| Azure Static Web Apps | Free tier | Yes | Yes | GitHub Actions built-in |
| Render Static Site | Free tier | Yes | Yes | Git-based auto deploy |
| Netlify | Free tier | Yes | Yes | Git-based auto deploy |

> Azure Static Web Apps is recommended for zero-cost static hosting with built-in GitHub Actions integration, global CDN, and proxy rules for API calls.

---

## Required Changes to Dockerfile

The existing `Dockerfile.ui` must be rewritten for standalone operation:

```dockerfile
# ── Stage 1: Build ─────────────────────────────────────────────
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . ./
RUN npm run build

# ── Stage 2: Serve ─────────────────────────────────────────────
FROM nginx:alpine AS final

COPY --from=build /app/dist/sk-fabricator-ui/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Key changes from legacy:
- Removed `sk-fabricator-ui/` path prefix (now in repo root)
- Uses `npm ci` instead of `npm install` for deterministic installs
- COPY paths are relative to repo root

---

## SSR Decision

The legacy app uses `@angular/ssr` with Express (port 4000). For deployment simplicity, two options:

### Option A: Static SPA (Recommended for small app)
- Build: `ng build --configuration production`
- Output: `dist/sk-fabricator-ui/browser/`
- Serve: Nginx / CDN
- No server required — cheaper, simpler
- SSR packages can be removed from `package.json`

### Option B: Keep SSR
- Build: `ng build --configuration production`
- Output: `dist/sk-fabricator-ui/` (browser + server)
- Serve: Node.js / Express container
- Required if SEO via SSR is a priority

> Recommendation: Switch to static SPA. The existing SSR implementation is not required for this type of company portfolio site.

---

## Environment Configuration

| Environment | Variable | Value |
|---|---|---|
| Development | `apiUrl` | `/api` (proxied via proxy.conf.json) |
| Production | `apiUrl` | `https://sk-fabricator-api.onrender.com/api` |

> Update production URL after new backend is deployed to Render.

---

## GitHub Actions CI/CD

### CI Workflow (ci.yml)
```yaml
on: push (main, develop), pull_request (main)

steps:
  - Checkout
  - Setup Node 20
  - npm ci
  - npm run lint (if configured)
  - npm test -- --no-watch --no-progress --browsers=ChromeHeadless
  - npm run build
```

### CD Workflow (cd.yml)
```yaml
on: push (main)

steps:
  - Checkout
  - Setup Node 20
  - npm ci
  - npm test
  - npm run build
  - Deploy to Azure Static Web Apps (or Render)
```

---

## Deployment Steps (Task 20)

1. Create `SkFabricatorAndErector-Frontend` repository
2. Connect to Azure Static Web Apps or Render
3. Configure `environment.prod.ts` with new backend URL
4. Configure CORS on backend to allow new frontend origin
5. Set up GitHub Actions workflows
6. Verify build passes
7. Verify all API calls reach new backend
8. Verify authentication works end-to-end
9. Run through all critical user flows manually
10. Cut over DNS / update old frontend links

---

## nginx.conf (for Docker-based deployment)

The existing `nginx.conf` is already correct:
```nginx
server {
  listen 80;
  location / {
    root /usr/share/nginx/html;
    try_files $uri $uri/ /index.html;
  }
}
```

Add security headers during Task 15:
```nginx
add_header X-Frame-Options "DENY";
add_header X-Content-Type-Options "nosniff";
add_header Referrer-Policy "strict-origin-when-cross-origin";
add_header Content-Security-Policy "default-src 'self'; ...";
```

---

## Production Checklist

Before cutover:

- [ ] New backend deployed and healthy (GET /health → 200)
- [ ] Frontend environment.prod.ts updated to new backend URL
- [ ] Backend CORS allows new frontend origin
- [ ] Authentication (login + refresh) working end-to-end
- [ ] All public pages loading correctly
- [ ] Admin CRUD working for at least one feature
- [ ] File uploads working
- [ ] CI pipeline passing (lint + test + build)
- [ ] CD pipeline deploying automatically on push to main
