# Frontend Structure & React Architecture
## Project: JCRM Technology LMS Platform

This document describes the directory tree, routing structure, state management, and design system configuration for the React Single Page Application (SPA) frontend of JCRM Technology.

---

## 1. Directory Structure

A clean, component-oriented structure separating global setups, hooks, features, and stylesheets.

```
jcrm technology-frontend/
├── public/                    # Static assets (favicons, manifest)
├── src/
│   ├── assets/                # Logos, SVG icons, background vectors
│   ├── components/            # Shared UI components
│   │   ├── ui/                # Base primitives (Buttons, Inputs, Modals, Cards)
│   │   ├── Navbar.tsx         # Responsive public navbar
│   │   ├── ThemeToggle.tsx    # Theme switch toggle
│   │   └── ProtectedRoute.tsx # Route authentication guards
│   │
│   ├── context/               # Global state contexts
│   │   ├── AuthContext.tsx    # Login sessions, JWT caching, role mappings
│   │   ├── ThemeContext.tsx   # Light/Dark mode state controller
│   │   └── SocketContext.tsx  # Persistent WebSocket manager
│   │
│   ├── hooks/                 # Reusable React hooks
│   │   ├── useAuth.ts         # Authentication utility helpers
│   │   └── useSocket.ts       # Socket event listeners
│   │
│   ├── pages/                 # Route-specific page components
│   │   ├── public/            # Public marketing pages (Landing, About, Courses, Placements)
│   │   ├── auth/              # Auth split-pane page (Login, Signup)
│   │   ├── onboarding/        # Onboarding step fields
│   │   ├── student/           # Student portal pages (Overview, Classroom, Live, Settings)
│   │   ├── faculty/           # Faculty dashboard, creator wizard, review grading
│   │   └── admin/             # Admin console (Users, Leads, Courses Approval, Messages)
│   │
│   ├── services/              # API communications client
│   │   ├── api.ts             # Axios instance with auto JWT interceptors
│   │   ├── auth.ts            # Auth requests (login, google, verify)
│   │   └── courses.ts         # Course query/update functions
│   │
│   ├── styles/                # Styling variables and design system config
│   │   └── index.css          # Tailwind CSS layer declarations & Custom properties
│   │
│   ├── App.tsx                # Main router & provider wrapper
│   └── main.tsx               # Render entry point
```

---

## 2. Design System & Theme Custom Properties (`index.css`)

The frontend uses custom CSS properties to handle dual themes dynamically. Tailwind classes style coordinates via HSL mappings.

```css
@theme {
  --color-bg-base: var(--bg-base);
  --color-bg-card: var(--bg-card);
  --color-bg-surface: var(--bg-surface);
  --color-bg-elevated: var(--bg-elevated);
  
  --color-text-primary: var(--text-primary);
  --color-text-secondary: var(--text-secondary);
  --color-text-tertiary: var(--text-tertiary);
  
  --color-border-soft: var(--border-soft);
  --color-border-med: var(--border-med);
  --color-border-strong: var(--border-strong);
  
  --color-accent-primary: var(--accent-primary);
  --color-accent-light: var(--accent-light);
  --color-accent-lighter: var(--accent-lighter);
  --color-accent-cyan: var(--accent-cyan);
}

:root {
  /* LIGHT THEME TOKENS */
  --bg-base: hsl(220 14% 96%);
  --bg-card: hsl(0 0% 100%);
  --bg-surface: hsl(210 16% 98%);
  --bg-elevated: hsl(0 0% 100%);
  
  --text-primary: hsl(224 71% 4%);
  --text-secondary: hsl(220 9% 46%);
  --text-tertiary: hsl(220 9% 70%);
  
  --border-soft: hsl(220 13% 91%);
  --border-med: hsl(220 13% 86%);
  --border-strong: hsl(220 13% 76%);
  
  --accent-primary: hsl(263 70% 50%);
  --accent-light: hsl(263 70% 65%);
  --accent-lighter: hsl(263 70% 90%);
  --accent-cyan: hsl(190 90% 45%);
}

.dark {
  /* DARK THEME TOKENS */
  --bg-base: hsl(224 71% 4%);
  --bg-card: hsl(224 71% 7%);
  --bg-surface: hsl(224 71% 10%);
  --bg-elevated: hsl(224 71% 14%);
  
  --text-primary: hsl(210 20% 98%);
  --text-secondary: hsl(215 20% 65%);
  --text-tertiary: hsl(215 20% 45%);
  
  --border-soft: hsl(224 71% 12%);
  --border-med: hsl(224 71% 18%);
  --border-strong: hsl(224 71% 28%);
  
  --accent-primary: hsl(263 70% 55%);
  --accent-light: hsl(263 70% 70%);
  --accent-lighter: hsl(263 70% 25%);
  --accent-cyan: hsl(190 90% 50%);
}

/* Glassmorphism primitives */
.glass {
  background: color-mix(in srgb, var(--bg-card) 70%, transparent);
  backdrop-filter: blur(12px);
  border: 1px solid var(--border-soft);
}

.card-hover {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease;
}
.card-hover:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px -10px color-mix(in srgb, var(--accent-primary) 15%, transparent);
}
```

---

## 3. Global Contexts

### 3.1. Authentication Context (`AuthContext.tsx`)
Caches Access Token in memory and Refresh Token in Secure Cookies. Manages automatic token refresh via Axios interceptors.

```typescript
import React, { createContext, useState, useEffect } from "react";
import axiosInstance from "../services/api";

interface User {
  id: string;
  email: string;
  name: string;
  role: "STUDENT" | "INSTRUCTOR" | "ADMIN";
  onboarded: boolean;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  login: (credentials: any) => Promise<void>;
  logout: () => void;
  updateSessionRole: (role: string) => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Attempt silent token refresh on app boot
    const refreshSession = async () => {
      try {
        const res = await axiosInstance.post("/api/auth/refresh/");
        setAccessToken(res.data.access);
        setUser(res.data.user);
      } catch (err) {
        // No active refresh token, stay unauthenticated
      } finally {
        setIsLoading(false);
      }
    };
    refreshSession();
  }, []);

  // Login & Session modifiers defined here...
}
```

### 3.2. Axios API Client Interceptor (`services/api.ts`)
Attaches JWT Bearer token to request headers, and intercepts 401 Unauthorized errors to automatically refresh the session tokens in the background.

```typescript
import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "https://jcrm technology.com",
  withCredentials: true, // Send cookies (refresh token)
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken"); // In-memory cache fallback or localStore
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor handles auto-refresh on token expiry...
export default api;
```

---

## 4. Frontend Route Mapping

The React SPA router controls private route accessibility using role checking:

*   `/` — Landing Page (Public)
*   `/about` — About Page (Public)
*   `/courses` — Course Catalog (Public)
*   `/placements` — Placements (Public)
*   `/contact` — Contact Form (Public)
*   `/auth` — Login & Signup portal
*   `/onboarding` — Role choice & profile registration (Locked to users with `onboarded=false`)
*   `/student/*` — Student Dashboard, Classroom, Calendar, Live (Locked to `role=STUDENT`)
*   `/faculty/*` — Faculty console, Submissions queue, Creator builder (Locked to `role=INSTRUCTOR`)
*   `/admin/*` — Admin panel console, leads dashboard, CMS edits (Locked to `role=ADMIN` - email: `jcrm technology97@gmail.com`)
