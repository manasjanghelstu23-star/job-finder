/**
 * Pre-packaged Sample Resumes for instant testing and demonstration
 * in the ATS-Style Resume Analyzer.
 */

export interface SampleResumeData {
  id: string;
  name: string;
  roleTarget: string;
  filename: string;
  rawText: string;
}

export const SAMPLE_RESUMES: Record<string, SampleResumeData> = {
  "backend-java": {
    id: "backend-java",
    name: "Arjun Verma (Backend Java & Spring Boot)",
    roleTarget: "backend-dev",
    filename: "Arjun_Verma_Backend_Resume.pdf",
    rawText: `ARJUN VERMA
Email: arjun.verma@demo.com | Phone: +91 98765 43210
LinkedIn: linkedin.com/in/arjun-verma-dev | GitHub: github.com/arjun-backend
Location: Bangalore, India

PROFESSIONAL SUMMARY
Backend Software Engineer with hands-on experience developing enterprise REST APIs and distributed microservices using Java 17 and Spring Boot. Skilled in relational database schema design with PostgreSQL and SQL, containerized deployment using Docker, and version control with Git. Passionate about system latency optimization and scalable software design.

TECHNICAL SKILLS
Languages: Java (Core Java, Collections, Multithreading), SQL, Python (Basics)
Frameworks & Libraries: Spring Boot, Spring Data JPA, Hibernate, REST APIs
Databases: PostgreSQL, MySQL, Redis (Caching)
DevOps & Tools: Docker, Git, GitHub, Maven, Postman, Linux

PROJECTS
E-Commerce Checkout & Order Microservice (Java, Spring Boot, PostgreSQL, Docker)
• Engineered a distributed checkout microservice using Spring Boot and Spring Data JPA, processing over 12,000 daily simulated orders.
• Designed relational database schemas in PostgreSQL with B-tree indexing on order IDs, reducing query latency by 34%.
• Integrated Redis caching layer for product inventory lookups, decreasing response times from 180ms to 24ms.
• Containerized the application using Docker and multi-stage Dockerfile builds, reducing final image footprint by 45%.
• Published interactive OpenAPI/Swagger documentation for 14 REST API endpoints with standardized error responses.

Automated Banking Transaction Engine (Java, REST APIs, SQL)
• Built secure banking transaction API adhering to ACID transaction guarantees and JWT token authentication.
• Authored comprehensive SQL stored procedures and complex join queries handling 50k+ ledger records.
• Applied Git branch-based workflow with automated unit testing using JUnit 5, achieving 82% code coverage.

EXPERIENCE
Backend Engineering Intern | CloudFin Solutions (Jan 2026 - Present)
• Collaborated with senior platform architects to refactor monolith invoice generator into standalone Spring Boot service.
• Designed 6 REST API endpoints integrated with external payment webhooks, handling peak traffic of 350 requests/sec.
• Identified slow SQL queries in production PostgreSQL logs and resolved N+1 Hibernate query issues.

EDUCATION
B.Tech in Computer Science & Engineering | National Institute of Technology (2022 - 2026)
CGPA: 8.7 / 10.0 | Relevant Coursework: Data Structures & Algorithms, Database Management Systems, Operating Systems, Computer Networks.

CERTIFICATIONS
• Oracle Certified Associate: Java SE Programmer
• Spring Boot 3 & Microservices Mastery (Udemy Verified)`
  },

  "frontend-react": {
    id: "frontend-react",
    name: "Sneha Nair (Frontend React & Next.js)",
    roleTarget: "frontend-dev",
    filename: "Sneha_Nair_Frontend_Resume.pdf",
    rawText: `SNEHA NAIR
Email: sneha.nair@demo.com | Phone: +91 91234 56789
LinkedIn: linkedin.com/in/sneha-ui-dev | Portfolio: snehanair.dev | GitHub: github.com/sneha-web
Location: Pune, India

PROFESSIONAL SUMMARY
Creative and detail-oriented Frontend Developer with 2+ years of project experience crafting responsive, accessible, and high-performance web applications using React, TypeScript, Next.js, and Tailwind CSS. Obsessed with clean component architecture, Core Web Vitals, and smooth micro-interactions.

TECHNICAL SKILLS
Languages: TypeScript, JavaScript (ES6+), HTML5, CSS3, Sass
Frameworks & Libraries: React, Next.js, Redux Toolkit, React Query, Tailwind CSS, Framer Motion
Testing & Tooling: Jest, React Testing Library, Git, GitHub, Vite, Webpack, Postman

PROJECTS
SaaS Analytics Dashboard (Next.js, TypeScript, Tailwind CSS, React Query)
• Built responsive multi-tenant analytics dashboard using Next.js 15 App Router and React Server Components.
• Implemented client-side caching with React Query, decreasing redundant API fetch calls by 58%.
• Styled 25+ reusable accessible UI components using Tailwind CSS and Radix UI primitives with full keyboard navigation.
• Achieved 98/100 Google Lighthouse performance score by implementing dynamic image optimization and route code splitting.

Interactive Learning Hub (React, TypeScript, Framer Motion, REST APIs)
• Developed single-page web application serving interactive quizzes and video lessons to 3,500 active campus learners.
• Designed responsive layouts using modern CSS Flexbox and Grid, tested across iOS, Android, and Desktop viewports.
• Integrated REST APIs for user progress synchronization with optimistic UI updates for instant feedback.

EXPERIENCE
Frontend Developer Intern | PixelCraft Media (Jun 2025 - Dec 2025)
• Converted Figma design wireframes into responsive production React components with 100% design fidelity.
• Refactored legacy JavaScript codebases to strict TypeScript, eliminating 85% of runtime undefined errors.
• Collaborated via Git pull requests and participated in daily agile standups.

EDUCATION
B.Tech in Information Technology | Pune University (2022 - 2026)
CGPA: 8.9 / 10.0`
  },

  "fresher-generalist": {
    id: "fresher-generalist",
    name: "Rohan Patel (CS Student / Generalist)",
    roleTarget: "backend-dev",
    filename: "Rohan_Patel_CS_Resume.pdf",
    rawText: `ROHAN PATEL
Email: rohan.patel@demo.com | Phone: +91 99887 76655
Location: Mumbai, India

OBJECTIVE
Passionate computer science student seeking an entry-level software developer opportunity. Fast learner with strong fundamental knowledge of programming, algorithms, and web development.

EDUCATION
B.Tech in Computer Science | Mumbai University
Expected Graduation: 2026 | CGPA: 7.8 / 10.0

SKILLS
Programming: C++, Java, Python, HTML, CSS, JavaScript, SQL, Spring Boot, Docker, AWS, Kubernetes

PROJECTS
College Library Management System
• Developed a library management system using Java and MySQL.
• Allowed students to check out books and view return dates.
• Used basic HTML and CSS for web frontend interface.

Weather App
• Simple weather forecasting app using JavaScript and open weather API.
• Displayed temperature and humidity based on user city input.

INTERESTS & ACTIVITIES
• Member of College Coding Club
• Participated in college annual hackathon 2025`
  }
};
