/**
 * Canonical Skill Normalization Dictionary & Target Role Definitions
 * 
 * Normalizes varied resume representations into canonical platform taxonomy IDs.
 * E.g., 'React.js', 'ReactJS', 'React' -> 'React'
 * E.g., 'AWS EC2', 'Amazon Web Services', 'AWS' -> 'AWS'
 */

export interface CanonicalSkill {
  canonicalName: string;
  category: "Front-End" | "Back-End" | "Database" | "DevOps" | "Quality Assurance" | "Mobile" | "AI & ML" | "Core CS";
  synonyms: string[];
}

export const CANONICAL_SKILL_DICTIONARY: Record<string, CanonicalSkill> = {
  "React": {
    canonicalName: "React",
    category: "Front-End",
    synonyms: ["react", "react.js", "reactjs", "react-dom", "react 18", "react 19"]
  },
  "Next.js": {
    canonicalName: "Next.js",
    category: "Front-End",
    synonyms: ["next", "next.js", "nextjs", "next 14", "next 15", "turbopack"]
  },
  "JavaScript": {
    canonicalName: "JavaScript",
    category: "Front-End",
    synonyms: ["javascript", "js", "es6", "es6+", "ecmascript", "vanilla js"]
  },
  "TypeScript": {
    canonicalName: "TypeScript",
    category: "Front-End",
    synonyms: ["typescript", "ts"]
  },
  "HTML/CSS": {
    canonicalName: "HTML/CSS",
    category: "Front-End",
    synonyms: ["html", "html5", "css", "css3", "sass", "scss", "tailwind", "tailwindcss", "responsive design"]
  },
  "Java": {
    canonicalName: "Java",
    category: "Back-End",
    synonyms: ["java", "core java", "j2ee", "java 17", "java 21", "jvm"]
  },
  "Spring Boot": {
    canonicalName: "Spring Boot",
    category: "Back-End",
    synonyms: ["spring", "spring boot", "springboot", "spring-boot", "spring mvc", "spring cloud", "spring data"]
  },
  "Node.js": {
    canonicalName: "Node.js",
    category: "Back-End",
    synonyms: ["node", "node.js", "nodejs", "express", "express.js", "expressjs", "nest", "nestjs"]
  },
  "Python": {
    canonicalName: "Python",
    category: "Back-End",
    synonyms: ["python", "python3", "py", "django", "fastapi", "flask"]
  },
  "REST APIs": {
    canonicalName: "REST APIs",
    category: "Back-End",
    synonyms: ["rest", "rest api", "rest apis", "restful", "restful api", "restful apis", "web apis", "http apis", "json api"]
  },
  "Microservices": {
    canonicalName: "Microservices",
    category: "Back-End",
    synonyms: ["microservices", "micro-services", "microservice architecture", "distributed systems", "event-driven", "grpc"]
  },
  "SQL": {
    canonicalName: "SQL",
    category: "Database",
    synonyms: ["sql", "rdbms", "relational database", "complex queries", "database indexing"]
  },
  "PostgreSQL": {
    canonicalName: "PostgreSQL",
    category: "Database",
    synonyms: ["postgresql", "postgres", "psql", "pg"]
  },
  "MongoDB": {
    canonicalName: "MongoDB",
    category: "Database",
    synonyms: ["mongodb", "mongo", "nosql", "documentdb", "mongoose"]
  },
  "Redis": {
    canonicalName: "Redis",
    category: "Database",
    synonyms: ["redis", "in-memory cache", "caching", "redis pub/sub"]
  },
  "Docker": {
    canonicalName: "Docker",
    category: "DevOps",
    synonyms: ["docker", "dockerfile", "docker-compose", "containerization", "containers"]
  },
  "Kubernetes": {
    canonicalName: "Kubernetes",
    category: "DevOps",
    synonyms: ["kubernetes", "k8s", "container orchestration", "helm", "kube"]
  },
  "AWS": {
    canonicalName: "AWS",
    category: "DevOps",
    synonyms: ["aws", "amazon web services", "ec2", "s3", "lambda", "ecs", "eks", "cloudformation", "iam"]
  },
  "CI/CD": {
    canonicalName: "CI/CD",
    category: "DevOps",
    synonyms: ["ci/cd", "cicd", "continuous integration", "github actions", "gitlab ci", "jenkins", "pipeline"]
  },
  "Git": {
    canonicalName: "Git",
    category: "DevOps",
    synonyms: ["git", "github", "gitlab", "bitbucket", "version control"]
  },
  "Linux": {
    canonicalName: "Linux",
    category: "DevOps",
    synonyms: ["linux", "unix", "bash", "shell scripting", "ubuntu", "debian"]
  },
  "Selenium": {
    canonicalName: "Selenium",
    category: "Quality Assurance",
    synonyms: ["selenium", "selenium webdriver", "automation testing", "e2e testing", "cypress", "playwright"]
  }
};

/**
 * Normalizes any detected raw skill keyword to its canonical platform name.
 */
export function normalizeSkillName(rawSkill: string): string {
  const clean = rawSkill.trim().toLowerCase();
  
  // Check exact canonical name match
  for (const [canonicalName, info] of Object.entries(CANONICAL_SKILL_DICTIONARY)) {
    if (clean === canonicalName.toLowerCase()) {
      return canonicalName;
    }
    for (const syn of info.synonyms) {
      if (clean === syn.toLowerCase()) {
        return canonicalName;
      }
    }
  }

  // Fallback: capitalize words if not explicitly in dictionary
  return rawSkill
    .split(/[\s-]+/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

/**
 * Target Industry Roles with required & preferred skills, expectations, and role descriptions
 */
export interface TargetRoleRequirement {
  id: string;
  title: string;
  department: string;
  experienceLevel: string;
  description: string;
  requiredSkills: Array<{
    name: string;
    importance: "MANDATORY" | "CRITICAL" | "EXPECTED";
    expectedProof: string; // What recruiters expect to see on resume
    weight: number;
  }>;
  preferredSkills: Array<{
    name: string;
    weight: number;
  }>;
  keyExpectations: string[];
}

export const TARGET_ROLES: TargetRoleRequirement[] = [
  {
    id: "backend-dev",
    title: "Backend Developer",
    department: "Platform Engineering",
    experienceLevel: "Entry / Early Career (0-2 Yrs)",
    description: "Architecting high-throughput REST APIs, database models, and resilient microservices.",
    requiredSkills: [
      { name: "Java", importance: "MANDATORY", expectedProof: "OOP design, collections, multi-threading or async logic", weight: 1.2 },
      { name: "Spring Boot", importance: "MANDATORY", expectedProof: "REST controllers, JPA/Hibernate, dependency injection", weight: 1.2 },
      { name: "SQL", importance: "CRITICAL", expectedProof: "Schema design, joins, indexes, query optimizations", weight: 1.0 },
      { name: "REST APIs", importance: "CRITICAL", expectedProof: "API contracts, error handling, status codes, JSON payload design", weight: 1.0 },
      { name: "Git", importance: "EXPECTED", expectedProof: "Branching, PRs, version control workflows", weight: 0.8 },
      { name: "Docker", importance: "EXPECTED", expectedProof: "Dockerfile, containerizing services, multi-stage builds", weight: 0.8 },
    ],
    preferredSkills: [
      { name: "Microservices", weight: 0.7 },
      { name: "PostgreSQL", weight: 0.6 },
      { name: "AWS", weight: 0.6 },
      { name: "Redis", weight: 0.5 },
      { name: "CI/CD", weight: 0.5 }
    ],
    keyExpectations: [
      "Demonstrable server-side API projects with documented endpoints.",
      "Clear database integration with query performance considerations.",
      "Measurable engineering outcomes (e.g. latency, user volume, throughput)."
    ]
  },
  {
    id: "frontend-dev",
    title: "Frontend Developer",
    department: "User Interface Engineering",
    experienceLevel: "Entry / Early Career (0-2 Yrs)",
    description: "Crafting modern, accessible, and fast web user interfaces with React and modern CSS.",
    requiredSkills: [
      { name: "React", importance: "MANDATORY", expectedProof: "Hooks, state management, component lifecycle, clean props", weight: 1.2 },
      { name: "JavaScript", importance: "MANDATORY", expectedProof: "ES6+, closures, async/await, DOM manipulation", weight: 1.1 },
      { name: "TypeScript", importance: "CRITICAL", expectedProof: "Type safety, generics, interfaces, strict mode", weight: 1.0 },
      { name: "HTML/CSS", importance: "CRITICAL", expectedProof: "Flexbox, Grid, responsive design, Tailwind or semantic CSS", weight: 1.0 },
      { name: "Git", importance: "EXPECTED", expectedProof: "Version control and collaborative GitHub projects", weight: 0.8 },
    ],
    preferredSkills: [
      { name: "Next.js", weight: 0.8 },
      { name: "REST APIs", weight: 0.7 },
      { name: "Docker", weight: 0.5 },
      { name: "CI/CD", weight: 0.4 }
    ],
    keyExpectations: [
      "Live deployed frontend projects or responsive web applications.",
      "Evidence of clean state management and reusable component architecture.",
      "Measurable performance improvements (Core Web Vitals, bundle optimization)."
    ]
  },
  {
    id: "fullstack-dev",
    title: "Full-Stack Web Developer",
    department: "Product Engineering",
    experienceLevel: "Entry / Mid (0-3 Yrs)",
    description: "End-to-end web application development covering client UI, server backend, and database persistence.",
    requiredSkills: [
      { name: "JavaScript", importance: "MANDATORY", expectedProof: "Full-stack JS/TS workflows across browser and server", weight: 1.1 },
      { name: "React", importance: "MANDATORY", expectedProof: "Interactive web applications and component hierarchies", weight: 1.1 },
      { name: "Node.js", importance: "CRITICAL", expectedProof: "Express or Nest backend APIs, middleware, routing", weight: 1.0 },
      { name: "PostgreSQL", importance: "CRITICAL", expectedProof: "Relational tables, foreign keys, migrations, ORM", weight: 1.0 },
      { name: "REST APIs", importance: "CRITICAL", expectedProof: "Client-server data contract implementation", weight: 1.0 },
      { name: "Git", importance: "EXPECTED", expectedProof: "Production repository management", weight: 0.8 },
    ],
    preferredSkills: [
      { name: "TypeScript", weight: 0.8 },
      { name: "Docker", weight: 0.7 },
      { name: "AWS", weight: 0.6 },
      { name: "Redis", weight: 0.5 }
    ],
    keyExpectations: [
      "At least one end-to-end full stack application with authentication and database.",
      "Clear separation of concerns between client and server layers.",
      "Deployment evidence on platforms like Vercel, Render, AWS, or Docker."
    ]
  },
  {
    id: "devops-engineer",
    title: "DevOps & Cloud Engineer",
    department: "Infrastructure & Platform",
    experienceLevel: "Entry / Mid (1-3 Yrs)",
    description: "Automating cloud infrastructure, CI/CD pipelines, container orchestration, and reliability.",
    requiredSkills: [
      { name: "Docker", importance: "MANDATORY", expectedProof: "Multi-stage Dockerfiles, image caching, container networking", weight: 1.2 },
      { name: "AWS", importance: "MANDATORY", expectedProof: "VPC, EC2, S3, IAM roles, cloud deployment patterns", weight: 1.2 },
      { name: "Linux", importance: "CRITICAL", expectedProof: "Bash scripting, system permissions, process management", weight: 1.0 },
      { name: "CI/CD", importance: "CRITICAL", expectedProof: "Automated test and build pipelines in GitHub Actions", weight: 1.0 },
      { name: "Git", importance: "EXPECTED", expectedProof: "GitOps workflows and repository automation", weight: 0.8 },
    ],
    preferredSkills: [
      { name: "Kubernetes", weight: 0.9 },
      { name: "Python", weight: 0.7 },
      { name: "PostgreSQL", weight: 0.5 },
      { name: "Microservices", weight: 0.5 }
    ],
    keyExpectations: [
      "Evidence of infrastructure automation and repeatable deployments.",
      "Experience setting up CI/CD pipeline triggers and artifact publishing.",
      "Knowledge of cloud security, secrets management, and basic monitoring."
    ]
  },
  {
    id: "data-engineer",
    title: "Python Data Engineer",
    department: "Data & Analytics",
    experienceLevel: "Entry / Early Career (0-2 Yrs)",
    description: "Developing automated ETL data pipelines, processing large datasets, and database modeling.",
    requiredSkills: [
      { name: "Python", importance: "MANDATORY", expectedProof: "Data manipulation, scripting, libraries, modular code", weight: 1.2 },
      { name: "SQL", importance: "MANDATORY", expectedProof: "Complex analytical queries, window functions, aggregations", weight: 1.2 },
      { name: "PostgreSQL", importance: "CRITICAL", expectedProof: "Database design, indexing, transactional queries", weight: 1.0 },
      { name: "REST APIs", importance: "EXPECTED", expectedProof: "Ingesting external datasets and webhook feeds", weight: 0.8 },
      { name: "Git", importance: "EXPECTED", expectedProof: "Code versioning and reproducible notebook workflows", weight: 0.8 },
    ],
    preferredSkills: [
      { name: "Docker", weight: 0.7 },
      { name: "AWS", weight: 0.7 },
      { name: "Redis", weight: 0.5 },
      { name: "Linux", weight: 0.5 }
    ],
    keyExpectations: [
      "Demonstrated data cleaning and transformation pipelines.",
      "Optimized SQL queries operating on realistic dataset volumes.",
      "Clear documentation of data schemas and ingestion validation."
    ]
  },
  {
    id: "qa-engineer",
    title: "QA Automation Test Engineer",
    department: "Quality Assurance",
    experienceLevel: "Entry / Early Career (0-2 Yrs)",
    description: "Designing automated regression test suites, API test automation, and validation workflows.",
    requiredSkills: [
      { name: "Selenium", importance: "MANDATORY", expectedProof: "Page Object Model, UI test scripts, assertions", weight: 1.2 },
      { name: "Java", importance: "CRITICAL", expectedProof: "Test framework authoring, TestNG or JUnit integration", weight: 1.0 },
      { name: "REST APIs", importance: "CRITICAL", expectedProof: "Postman, RestAssured, automated API endpoint testing", weight: 1.0 },
      { name: "Git", importance: "EXPECTED", expectedProof: "Version control for test repositories", weight: 0.8 },
    ],
    preferredSkills: [
      { name: "Python", weight: 0.7 },
      { name: "CI/CD", weight: 0.7 },
      { name: "Docker", weight: 0.6 },
      { name: "SQL", weight: 0.5 }
    ],
    keyExpectations: [
      "Automated test suites run against real or mock applications.",
      "Clear bug reports with reproducible steps and assertion criteria.",
      "Integration of automated tests into continuous integration pipelines."
    ]
  }
];
