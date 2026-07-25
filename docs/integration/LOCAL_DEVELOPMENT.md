# End-to-End Local Development & Integration Guide

This guide documents how to run **SkFabricatorAndErector-Backend** and **SkFabricatorAndErector-Frontend** together locally.

---

## 🏛️ Local Runtime Architecture

```
Browser
   │
   │ http://localhost:4200 (Angular UI)
   ▼
Frontend Dev Server
   │
   │ /api HTTP Proxy -> http://localhost:5229
   ▼
SkFabricatorAndErector.Api (ASP.NET Core 8)
   │
   ▼
PostgreSQL / SQLite Database
```

---

## 📍 Configured Local Ports

| Service | Protocol / Path | Local URL |
|---|---|---|
| **Frontend UI** | HTTP | `http://localhost:4200` |
| **Backend API (HTTP)** | HTTP | `http://localhost:5229` |
| **Backend API (HTTPS)** | HTTPS | `https://localhost:7163` |
| **Swagger UI** | HTTP/HTTPS | `http://localhost:5229/swagger` |
| **Health Probe** | HTTP/HTTPS | `http://localhost:5229/health` |

---

## 🛠️ Step-by-Step Local Run Instructions

### 1. Terminal 1: Start Backend API

```bash
cd SkFabricatorAndErector-Backend

# Verify build and test suite
dotnet restore
dotnet build
dotnet test SkFabricatorAndErector.slnx

# Launch local backend API with hot reload
dotnet watch run --project src/SkFabricatorAndErector.Api/SkFabricatorAndErector.Api.csproj
```

**Verification**:
- Health probe: `GET http://localhost:5229/health` → `{"status":"Healthy"}`
- Swagger documentation: Open `http://localhost:5229/swagger`

---

### 2. Terminal 2: Start Frontend Application

```bash
cd SkFabricatorAndErector-Frontend

# Install dependencies (first time only)
npm install

# Run karma unit test suite (40 tests)
npm test -- --watch=false --browsers=ChromeHeadless

# Launch local Angular development server
npm start
```

**Verification**:
- Open browser: `http://localhost:4200`
- Open Browser DevTools Network tab: Verify requests to `/api/*` are proxied to `http://localhost:5229/api/*`.

---

## 🧪 Complete End-to-End Workflow Test

1. Open `http://localhost:4200` in browser.
2. Navigate to **Contact Us** (`/contact-us`).
3. Fill in the **Get a Free Consultation** inquiry form (Name, Email, Message) and click **Submit Inquiry**.
4. Verify HTTP `POST /api/inquiry` returns `200 OK` or `201 Created`.
5. Navigate to **Login** (`/login`).
6. Sign in with seed credentials (`admin@skfabricator.com` / `Admin@123`).
7. Verify JWT token stored in session and redirected to **Inquiries Dashboard** (`/inquiries`).
8. Verify admin can view the newly submitted inquiry and delete it.
9. Click **Logout** to verify session cleanup.

---

## 🔐 Environment & Security Checklist

- [x] CORS in `Program.cs` explicitly allows `http://localhost:4200`.
- [x] Proxy configuration in `proxy.conf.json` maps `/api` to `http://localhost:5229`.
- [x] JWT keys and credentials are environment-configurable and excluded from Git commits.
- [x] Health probe endpoint `/health` returns `200 OK` without requiring auth headers.
- [x] Backend tests (37/37) and Frontend tests (40/40) pass with 0 failures.
