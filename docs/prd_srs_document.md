# Product Requirements Document (PRD) & Software Requirements Specification (SRS)
## Project: JCRM Technology LMS Platform

---

## 1. Product Vision & Scope
JCRM Technology is a premium, project-based Learning Management System (LMS) designed to help students learn, build, and ship real products. The platform bridges the gap between learning and employment by connecting students with expert faculty, interactive live cohorts, verified credentials, and direct placements. 

The goal of this migration is to transition the current hybrid Next.js + Node.js/Express full-stack application into a highly stable **React SPA (Frontend) + Django REST API (Backend)** architecture using a hosted PostgreSQL database (via Supabase or Neon).

---

## 2. User Roles & Personas

The platform supports four primary user roles, each with custom permissions and interfaces:

1.  **Visitor / Guest**: Unauthenticated users exploring public landing pages, courses, about page, placements, testimonials, and contact forms.
2.  **Student**: Authenticated learners who enroll in courses, view video lessons, attend live classes, submit assignments, track progress, and communicate with instructors.
3.  **Faculty / Instructor**: Authenticated educators who create and organize course curricula, review/grade student submissions, host live classes, post announcements, and chat with students/admin.
4.  **Admin (Super Admin)**: The platform owner (explicitly restricted to `jcrm technology97@gmail.com`) who oversees platform statistics, approves/rejects faculty courses, modifies landing page copy (CMS), tracks leads, manages users, and moderates content.

---

## 3. Functional Requirements Specification

### 3.1. Authentication & Session Management
*   **Google OAuth (Social Login)**:
    *   Self-verified email (by Google). Skip any email OTP steps.
    *   If the user is new, redirect to the Onboarding Page to select their role and enter details.
    *   If the user is returning, redirect directly to their dashboard.
*   **Credentials Login/Signup**:
    *   Users can sign up with Email, Phone, Password, and Full Name.
    *   **Toggle OTP verification**: The platform supports a configuration toggle to determine whether the user must verify their Phone number via OTP, verify their Email via OTP, or both, during signup.
    *   **Verification Fallback**: Any unverified contact details (e.g., if phone OTP was toggled off during signup) must be editable and verifiable via OTP within the user's Profile/Settings page after onboarding.
*   **Hardcoded Super-Admin Security Rule**:
    *   To prevent privilege escalation (even if someone hacks the database and updates a role column), the system must enforce at the code level:
        *   **`jcrm technology97@gmail.com`** is the ONLY email assigned the `ADMIN` role.
        *   If any other email attempts to log in with an `ADMIN` role, the system will forcefully downgrade their session/token to `STUDENT` or `FACULTY` based on their onboarded profile.

### 3.2. User Onboarding Flow
*   When a new student or faculty signs up (either via Google or Credentials), they must be redirected to `/onboarding`.
*   **Role Selection**: The user selects their account type: `STUDENT` or `FACULTY`.
*   **Profile Setup**: Collects profile details (Specialization, Bio, Avatar, Phone number) and creates a record in the database.
*   Upon submission, the user's role is updated, and they are redirected to their respective dashboard.

### 3.3. Student Portal
*   **Dashboard (Overview)**: Welcoming dashboard featuring stats (progress, streak, active courses), weekly learning metrics, and a "Resume Course" card.
*   **Course Catalog & Classroom**:
    *   Catalog showing all approved/published courses.
    *   Interactive video classroom with lesson navigation (sections & accordions), Resources, Q&A, Notes tabs.
*   **Live Classroom**: Integrates live class streaming interface with count-downs, Join Session links, and past recorded lectures.
*   **Assignments & Calendar**:
    *   Filterable assignment list (Pending, Submitted, Graded) with upload forms.
    *   Personalized monthly study calendar showing assignment deadlines, live class schedules, and milestones.
*   **Messaging**: Dynamic direct message threads with instructors and support staff.

### 3.4. Faculty Portal
*   **Dashboard**: Overview of revenue statistics, enrollment graphs, student performance data, and quick actions.
*   **Course Creator**:
    *   Curriculum creator wizard (drafting title, syllabus, sections, lessons, uploading resources/videos, price).
    *   New courses are created as `DRAFT` and must be approved by the Admin before going live.
*   **Student Management & Grading**:
    *   Overview table of students enrolled in their courses.
    *   Submissions review queue to download homework files, add text feedback, and assign grades.
*   **Announcements**: Tool to draft and broadcast announcements to all students in specific courses.

### 3.5. Admin Console
*   **Global Overview**: Server stats, user registration trends, system alerts.
*   **User Management**: Editable data tables of all Students and Instructors, with Block/Unblock actions.
*   **Global Course Catalog & Approval Workflow**:
    *   Interactive catalog of all courses uploaded by faculty (categorized by status: All, Published, Drafts).
    *   **Approval Controls**: One-click "Approve" (publishes the course) or "Unpublish" (demotes course back to draft).
    *   **Edit Details**: Modal to override title, description, price, and status.
    *   **Message Instructor (Dynamic Prefill)**: Clicking this button opens a chat window directly with the course's faculty member, pre-filled with tagged details of the course (e.g., `[Discussion about Course: course_title (ID: course_id)]: `), allowing the admin to immediately type changes or feedback.
*   **CMS Management**: Form inputs to update landing page headlines, about text, stats, values, testimonials, and team directories.
*   **Leads Tracker**: Categorized view of leads generated from three sources: Contact Us forms, Career Guidance forms, and Signups. All records are clickable to show deep forms data.

---

## 4. System Non-Functional Requirements

### 4.1. Performance & Scalability
*   **Page Load Speeds**: Frontend static pages must be compiled and served via CDN edge caching for sub-second load times.
*   **Persistent Connections**: Websockets (via Django Channels) are required for real-time chat sync and notifications without client-side polling.
*   **Stateless Scaling**: Django backend must scale horizontally by keeping sessions and cache in Redis.

### 4.2. Security & Compliance
*   **SSL/HTTPS**: Mandatory for all traffic.
*   **Hashing**: Hashing passwords using `bcrypt` on the Django backend.
*   **API Protection**: All admin and faculty API endpoints must require secure session checks. Admin pages are restricted to `jcrm technology97@gmail.com`.
*   **Data Integrity**: Cascading deletes for user profiles on user account deletion.

### 4.3. High Availability
*   Zero downtime migrations through separate staging deployments.
*   Database connection pooling (via Supabase PgBouncer or Neon connection pooler) to handle spikes in traffic.
