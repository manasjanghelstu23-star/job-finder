## DEMO MODE & VERCEL DEPLOYMENT

This application is configured for a **100% Database-Free Vercel Demo Deployment**.

### Key Characteristics:
- **File-Based Mock Data:** All data (users, jobs, applications, internships, assessments, skills, communities, resumes) is loaded in-memory from `src/data/` and managed via `src/lib/mock-db.ts`.
- **Zero Database Requirement:** No PostgreSQL or `DATABASE_URL` is required for runtime or building.
- **Simulated OAuth Authentication:** Clicking Google, LinkedIn, Facebook, or Twitter/X login buttons automatically authenticates demo accounts with valid sessions.
- **Serverless Ephemerality:** Mutations (applying for jobs, posting internships, updating tasks, sending community messages) update in-memory state during active serverless container lifecycles.

### Available Demo Accounts:
| Role | Email | Login Method |
| --- | --- | --- |
| **Student** | `student.google@example.com` / `student@demo.com` | Google OAuth or Demo Login |
| **Company Recruiter** | `company.google@example.com` / `company@demo.com` | Google OAuth or Demo Login |
| **Institute Director** | `institute.google@example.com` / `director@iite.ac.in` | Google OAuth or Demo Login |
| **System Admin** | `admin@demo.com` | Demo Login |

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Deploy on Vercel

```bash
npm run build
```
Deploy directly to Vercel without configuring environment variables or database connections.

