# Backend Structure & Django Architecture
## Project: JCRM Technology LMS Platform

This document describes the structure, architecture, and module configurations of the Django REST API backend for JCRM Technology.

---

## 1. Directory Structure

A clean, modular structure separating business domains into discrete Django applications.

```
jcrm technology-backend/
├── manage.py
├── requirements.txt
├── .env
├── jcrm technology/                # Main Settings & Core Configurations
│   ├── __init__.py
│   ├── settings.py            # Main settings (database, JWT, apps, cors)
│   ├── urls.py                # Core URL routing entry point
│   └── wsgi.py / asgi.py      # WSGI/ASGI configurations for hosting
│
├── apps/                      # Modular Business Applications
│   ├── authentication/        # User accounts, logins, profiles, & custom auth
│   │   ├── models.py          # Custom User and UserProfile models
│   │   ├── views.py           # Login, signup, onboarding, OTP verification
│   │   ├── serializers.py     # JWT & User profile serializers
│   │   └── urls.py
│   │
│   ├── courses/               # Courses, lessons, enrollment tracker
│   │   ├── models.py          # Course & Lesson models
│   │   ├── views.py           # Creator view, admin approvals, student classroom
│   │   ├── serializers.py
│   │   └── urls.py
│   │
│   ├── leads/                 # Lead collection endpoints (Contact Us, Careers)
│   │   ├── models.py          # ContactMessage & CareerGuidanceForm models
│   │   ├── views.py           # Lead ingestion & admin lists
│   │   ├── serializers.py
│   │   └── urls.py
│   │
│   ├── cms/                   # Page contents management
│   │   ├── models.py          # SiteContent model
│   │   ├── views.py           # CMS GET/PUT operations
│   │   ├── serializers.py
│   │   └── urls.py
│   │
│   └── chat/                  # Messaging, dynamic pre-fills, socket channel
│       ├── models.py          # ChatMessage model
│       ├── views.py           # Chat history view & Dynamic Prefills
│       ├── consumers.py       # Realtime WebSocket handlers (Django Channels)
│       └── urls.py
```

---

## 2. Core Configurations (`settings.py`)

### 2.1. Installed Apps & Middleware Setup
Ensure that modular apps, CORS, and REST Framework are properly registered:

```python
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # Third-Party Libraries
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
    'channels',                 # Required for realtime WebSockets
    
    # Local Apps
    'apps.authentication',
    'apps.courses',
    'apps.leads',
    'apps.cms',
    'apps.chat',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',      # Must be at the top
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]
```

### 2.2. REST Framework & JWT Configuration
Set default authentication permissions and configure Simple JWT tokens:

```python
from datetime import timedelta

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(days=1),      # Long session duration for ease of use
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': env('SECRET_KEY'),
    'AUTH_HEADER_TYPES': ('Bearer',),
}
```

---

## 3. Custom Authentication Security Model (`authentication/models.py`)

This handles user model overrides and implements our hardcoded Admin security rule during authentication token generation.

```python
import uuid
from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    # Override standard django user fields to support UUIDs and match current schema
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=255, null=True, blank=True)
    phone_number = models.CharField(max_length=50, null=True, blank=True)
    role = models.CharField(max_length=50, default="STUDENT")
    is_blocked = models.BooleanField(default=False)
    image = models.URLField(max_length=500, null=True, blank=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def save(self, *args, **kwargs):
        # HARD SECURITY RULE: Explicit super admin validation
        super_admin_email = "jcrm technology97@gmail.com"
        if self.email == super_admin_email:
            self.role = "ADMIN"
            self.is_staff = True
            self.is_superuser = True
        else:
            # Forcefully prevent anyone else from taking ADMIN role
            if self.role == "ADMIN":
                self.role = "STUDENT"
                self.is_staff = False
                self.is_superuser = False
        super().save(*args, **kwargs)
```

---

## 4. API Endpoint Routing Specifications

### 4.1. Authentication Routes (`/api/auth/`)
*   `POST /api/auth/signup/` — Sign up with credentials (Name, Email, Password, Phone).
*   `POST /api/auth/verify-otp/` — Verify Phone/Email OTP during registration.
*   `POST /api/auth/login/` — Login with credentials (returns SimpleJWT Access & Refresh tokens).
*   `POST /api/auth/google/` — Exchange a Google IDToken for JWT access/refresh tokens.
*   `POST /api/auth/refresh/` — Obtain a new access token using simple JWT refresh token.

### 4.2. Profile & User Routes (`/api/user/`)
*   `GET /api/user/profile/` — Fetch current user details & profile info.
*   `PUT /api/user/profile/` — Update user profile (Specialization, Bio, phone verification).
*   `POST /api/user/onboarding/` — Set user role & create profile records on first signup.

### 4.3. Courses Routes (`/api/courses/`)
*   `GET /api/courses/` — List all published courses (public endpoint).
*   `GET /api/courses/{id}/` — Get curriculum, lessons details (Student/Faculty).
*   `POST /api/courses/create/` — Upload a new course draft (Faculty permissions only).
*   `PUT /api/courses/builder/{id}/` — Modify sections/lessons (Faculty builder).

### 4.4. Admin Operations Routes (`/api/admin/`)
*   `GET /api/admin/courses/` — List all courses (All statuses: Published, Drafts, Archived).
*   `PUT /api/admin/courses/approve/{id}/` — Change course status to `PUBLISHED` (Admin permissions).
*   `PUT /api/admin/courses/edit/{id}/` — Modify course title, price, description (Admin override).
*   `GET /api/admin/leads/` — Fetch leads list categorized by Signups, Contact, Careers.
*   `GET /api/admin/users/` — List all users (Students, Faculty) with Block/Unblock toggle views.

### 4.5. Messaging Routes (`/api/chat/`)
*   `GET /api/chat/threads/` — List active chats / instructors.
*   `GET /api/chat/messages/{user_id}/` — Fetch chat history with specific faculty/admin.
*   `POST /api/chat/send/` — Send message (supporting tagged text pre-fills).
