# Dataflow & Wireframe Specification
## Project: JCRM Technology LMS Platform

This document outlines the core transaction dataflows, structural layouts, and user interface wireframes for the JCRM Technology LMS platform.

---

## 1. System Dataflows (Sequence Diagrams)

### 1.1. User Registration & Onboarding Flow
Handles user registration, optional Phone/Email OTP checks, Google Auth linking, and role-based onboarding.

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Frontend as React SPA (Client)
    participant Backend as Django API
    participant DB as PostgreSQL (Supabase)
    participant Firebase as Firebase Client Auth

    User->>Frontend: Click "Sign Up" or "Google Sign In"
    alt Google Sign In
        Frontend->>Firebase: Google Popup Login
        Firebase-->>Frontend: Returns Auth Token & Email
        Frontend->>Backend: POST /api/auth/google/ (Token)
        Backend->>DB: Query User by Email
        alt User Exists
            DB-->>Backend: Return User (Role, Onboarded)
            Backend-->>Frontend: JWT Token + Onboarded Status
        else User is New
            Backend->>DB: Create User (Role="STUDENT", email_verified=True)
            DB-->>Backend: User created
            Backend-->>Frontend: JWT Token + Onboarded=False
        end
    else Credentials Signup
        User->>Frontend: Enter Name, Email, Phone, Password
        Frontend->>Backend: POST /api/auth/register/
        alt OTP Enabled
            Backend->>Backend: Generate & Send OTP (SMS/Email)
            Backend-->>Frontend: OTP Sent (Status 200)
            User->>Frontend: Enter OTP Code
            Frontend->>Backend: POST /api/auth/verify-otp/
        end
        Backend->>DB: Hash Password & Create User (Onboarded=False)
        DB-->>Backend: User created
        Backend-->>Frontend: JWT Token + Onboarded=False
    end

    alt Onboarded is False
        Frontend->>User: Display Onboarding Form
        User->>Frontend: Choose Role (STUDENT / FACULTY), Specialization, Bio
        Frontend->>Backend: POST /api/user/onboarding/ (Headers: JWT)
        Backend->>DB: Create UserProfile & Update User Role
        DB-->>Backend: Profile saved
        Backend-->>Frontend: Update Session Role
        Frontend->>User: Redirect to respective Dashboard
    else Onboarded is True
        Frontend->>User: Redirect directly to Dashboard
    end
```

---

### 1.2. Course Upload & Admin Approval Workflow
Ensures no course goes public without admin review and consent.

```mermaid
sequenceDiagram
    autonumber
    actor Faculty
    actor Admin
    participant Frontend as React SPA (Client)
    participant Backend as Django API
    participant DB as PostgreSQL (Supabase)

    Faculty->>Frontend: Click "Create Course"
    Frontend->>Faculty: Display Course Wizard
    Faculty->>Frontend: Fill details (Title, Price, Syllabus) & Click "Submit"
    Frontend->>Backend: POST /api/courses/ (Status="DRAFT")
    Backend->>DB: Insert Course Record
    DB-->>Backend: Saved
    Backend-->>Frontend: Course Created (Success)

    Note over Admin: Admin visits /admin/courses
    Admin->>Frontend: Open Course Moderation
    Frontend->>Backend: GET /api/admin/courses/
    Backend->>DB: Query all Courses with status "DRAFT"
    DB-->>Backend: Return Courses List
    Backend-->>Frontend: Render Courses Table
    
    alt Approve Course
        Admin->>Frontend: Click "Approve"
        Frontend->>Backend: PUT /api/admin/courses/{id}/ (status="PUBLISHED")
        Backend->>DB: Update Course Status to "PUBLISHED"
        DB-->>Backend: Saved
        Backend-->>Frontend: Success Response
        Frontend->>Admin: Update status badge to "Approved & Published"
    else Reject / Suggest Updates
        Admin->>Frontend: Click "Message"
        Frontend->>Frontend: Redirect to /admin/messages?chatWith={faculty_id}&prefill={taggedText}
        Frontend->>Admin: Display prefilled feedback textbox (focused)
        Admin->>Frontend: Add suggestion & Send
        Frontend->>Backend: POST /api/messages/send/ (prefilled details + message)
        Backend->>DB: Save Message
        DB-->>Backend: Saved
    end
```

---

## 2. Wireframe & Structural Layouts

### 2.1. Public Landing Page Layout
High-end, responsive layout utilizing dark modes, gradient backgrounds, and subtle scroll indicators.

```
+-----------------------------------------------------------------------------------+
|  [Logo] Lumina        Courses   About   Placements   Testimonials   [Theme] [Auth]|
+-----------------------------------------------------------------------------------+
|                                                                                   |
|         Build skills that [ SHIP REAL PRODUCTS ] <--- (Shimmer Gradient Text)      |
|         Interactive project cohorts led by expert faculty.                        |
|                                                                                   |
|              [ Get Started (Primary) ]    [ Explore Courses (Ghost) ]             |
|                                                                                   |
|   +---------------------------------------------------------------------------+   |
|   |  Stats Strip:                                                             |   |
|   |  10,000+ Students  |  98% Satisfaction  |  4.9★ Rating  |  $34M+ Salary   |   |
|   +---------------------------------------------------------------------------+   |
|                                                                                   |
|   Features Bento Grid:                                                            |
|   +----------------------------------+ +--------------------------------------+   |
|   | Project-Based Learning           | | Live Cohorts                         |   |
|   | (Stretches 2/3 cols)             | | (1/3 col card)                       |   |
|   +----------------------------------+ +--------------------------------------+   |
|   +----------------------------------+ +--------------------------------------+   |
|   | Verified Credentials             | | Career Placements                    |   |
|   | (1/2 col card)                   | | (1/2 col card)                       |   |
|   +----------------------------------+ +--------------------------------------+   |
|                                                                                   |
+-----------------------------------------------------------------------------------+
```

---

### 2.2. Split-Pane Auth Page Layout (`/auth`)
Left pane contains branding assets and trust anchors; right pane houses login/signup action selectors.

```
+------------------------------------------+----------------------------------------+
| LEFT PANEL (Hidden on Mobile)            | RIGHT PANEL                            |
| Background: .dot-grid + Violet Orb       |                                        |
|                                          |           [ Sign In ]   [ Sign Up ]     |
| [Logo] Lumina                            |                                        |
|                                          |    Full Name                           |
| Headline:                                |    [                               ]   |
| "Learn from engineers who have shipped   |                                        |
| production code at scale."               |    Email Address                       |
|                                          |    [                               ]   |
| Feature Bullets:                         |                                        |
| - Interactive video classroom            |    Password                            |
| - Dedicated Discord support channels     |    [                               ]   |
| - Verified job references                |                                        |
|                                          |    Role Selection:                     |
| Testimonial Card (Glassmorphic):         |    ( ) Student          ( ) Faculty    |
| "This platform changed my career path."  |                                        |
| - Sarah K., Software Engineer            |              [ Submit Button ]         |
+------------------------------------------+----------------------------------------+
```

---

### 2.3. Student Portal Layout (`/student`)
Dynamic sticky navigation header combined with dynamic layouts for bento modules.

```
+-----------------------------------------------------------------------------------+
|  [Logo] Student  Overview  My Courses  Assignments  Live [Pulse]  Messages  [SG]  |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|   Welcome back, Student! [ Live Cohort Starts In: 02h 45m ] ---> (RSVP Pill)       |
|                                                                                   |
|   Metrics Cards:                                                                  |
|   +-------------+  +-------------+  +-------------+  +-------------+              |
|   | Enrolled: 3 |  | Streak: 12d |  | Time: 14.5h |  | Certificates|              |
|   +-------------+  +-------------+  +-------------+  +-------------+              |
|                                                                                   |
|   Bento Layout (2:1 Grid):                                                        |
|   +------------------------------------------+ +------------------------------+   |
|   | Continue Learning                        | | Next Live Cohort             |   |
|   | Course: System Design                    | | Topic: DB Sharding           |   |
|   | Progress: [========------] 68%           | | Instructor: Marcus Chen      |   |
|   | [ Resume Class ]                         | | [ Join Cohort (Cyan) ]       |   |
|   +------------------------------------------+ +------------------------------+   |
|                                                                                   |
+-----------------------------------------------------------------------------------+
```

---

### 2.4. Admin Courses Moderation console (`/admin/courses`)
Secure workspace featuring tabular filters and actionable controls for course vetting.

```
+-----------------------------------------------------------------------------------+
|  [Logo] Admin  Overview  Users  [Courses]  Messages  CMS  Leads  Settings   [SA]  |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|   Global Course Catalog                                                           |
|   Review, approve, reject, or edit faculty courses across the platform.            |
|                                                                                   |
|   Filters: [ All Statuses \/ ]   [ Search courses...                        ]     |
|                                                                                   |
|   Data Table:                                                                     |
|   +------------------------------------+----------------+---------+-----------+   |
|   | Course Title                       | Instructor     | Status  | Actions   |   |
|   +------------------------------------+----------------+---------+-----------+   |
|   | Intro to AI/ML & Python            | Sarah Jenkins  | DRAFT   | [Approve] |   |
|   | Learn basics from scratch.         |                |         | [Edit]    |   |
|   |                                    |                |         | [Message] |   |
|   +------------------------------------+----------------+---------+-----------+   |
|   | Full Stack React & Next.js         | Sarah Jenkins  | ACTIVE  | [Demote]  |   |
|   | Master frontend design frameworks. |                |         | [Edit]    |   |
|   |                                    |                |         | [Message] |   |
|   +------------------------------------+----------------+---------+-----------+   |
|                                                                                   |
+-----------------------------------------------------------------------------------+
```
