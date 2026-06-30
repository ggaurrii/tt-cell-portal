# TT CELL – Vocational Training Management Portal
### 509 Army Base Workshop

Production-ready React frontend for TT Cell. Military green & gold branding, fully responsive, Django REST backend ready.

## Quick Start

```bash
npm install
cp .env.example .env   # set VITE_API_URL
npm run dev
```

## Demo Credentials
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@ttcell.in | admin123 |
| Student | student@ttcell.in | student123 |

## Tech Stack
React 19 · Vite · TypeScript · Tailwind CSS · React Router · Framer Motion · Recharts · Axios · React Hook Form + Zod · React Hot Toast

## Pages
- `/` Landing page (exact design match)
- `/login` Role-based auth (Admin / Student)
- `/admin` Full admin portal: Dashboard, Students, Projects, Attendance, Announcements, Repository, Reports, Analytics, Profile, Settings
- `/student` Student portal: Dashboard, Attendance, Projects, Announcements, Profile, Settings

## Project Structure
src/components/ui · src/layouts · src/pages/admin · src/pages/student · src/context (AuthContext) · src/services (Axios API layer) · src/routes (ProtectedRoute) · src/types · src/constants (mockData)

## API (Django REST)
Set VITE_API_URL in .env. Services in src/services/api.ts cover auth, students, projects, attendance, announcements, dashboard stats.

## Build
```bash
npm run build   # outputs dist/
```
