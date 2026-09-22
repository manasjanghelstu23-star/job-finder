// Map of skill knowledge gaps, corresponding courses, and professional certifications
export interface GapItem {
  gapTitle: string;
  description: string;
  severity: "High" | "Medium" | "Low";
  course: {
    title: string;
    provider: string;
    duration: string;
    type: "Interactive Course" | "Specialization" | "Video Masterclass" | "Bootcamp Track";
    level: "Beginner" | "Intermediate" | "Advanced";
    link?: string;
  };
  certification: {
    title: string;
    issuer: string;
    validity: string;
    badge: string;
  };
}

export interface SkillGapDefinition {
  benchmarkScore: number;
  overview: string;
  gaps: GapItem[];
}

export const SKILL_GAP_DATABASE: Record<string, SkillGapDefinition> = {
  // Front-End
  "javascript": {
    benchmarkScore: 85,
    overview: "JavaScript core engine mechanics, asynchronous concurrency, and modern ESNext patterns required for production web apps.",
    gaps: [
      {
        gapTitle: "Asynchronous JavaScript & Event Loop Mechanics",
        description: "Understanding microtasks vs macrotasks, Promise chaining, async/await error propagation, and non-blocking I/O.",
        severity: "High",
        course: {
          title: "Deep JavaScript Foundations & Concurrency",
          provider: "Frontend Masters",
          duration: "10 Hours",
          type: "Interactive Course",
          level: "Advanced"
        },
        certification: {
          title: "OpenJS Certified JavaScript Developer (JSD)",
          issuer: "Linux Foundation / OpenJS Foundation",
          validity: "3 Years",
          badge: "OpenJS JSD"
        }
      },
      {
        gapTitle: "Memory Management & Profiling Performance",
        description: "Identifying detached DOM trees, closures holding references, GC cycles, and Chrome DevTools heap snapshot audits.",
        severity: "Medium",
        course: {
          title: "Web Performance & Memory Diagnostics",
          provider: "Coursera / Google Web",
          duration: "4 Weeks",
          type: "Specialization",
          level: "Advanced"
        },
        certification: {
          title: "Google Professional Web Performance Certification",
          issuer: "Google Developers",
          validity: "2 Years",
          badge: "Google Certified"
        }
      },
      {
        gapTitle: "Modular Architecture & Design Patterns",
        description: "Applying Singleton, Factory, Observer, Pub/Sub, and functional composition in enterprise JavaScript codebases.",
        severity: "Medium",
        course: {
          title: "JavaScript Design Patterns in Practice",
          provider: "Educative",
          duration: "14 Hours",
          type: "Interactive Course",
          level: "Intermediate"
        },
        certification: {
          title: "Meta Certified Front-End Developer",
          issuer: "Meta (Facebook)",
          validity: "Lifetime",
          badge: "Meta Certified"
        }
      }
    ]
  },

  "react": {
    benchmarkScore: 85,
    overview: "Modern React architecture including Concurrent mode, state machines, custom hooks, and Server Components.",
    gaps: [
      {
        gapTitle: "Server Components & Next.js App Router Architecture",
        description: "Mastering React Server Components (RSC), hydration boundaries, streaming SSR, and server action mutations.",
        severity: "High",
        course: {
          title: "Advanced Next.js & React Server Components",
          provider: "Vercel Academy",
          duration: "12 Hours",
          type: "Interactive Course",
          level: "Advanced"
        },
        certification: {
          title: "Meta Certified Front-End React Specialist",
          issuer: "Meta",
          validity: "Lifetime",
          badge: "Meta React"
        }
      },
      {
        gapTitle: "Custom Hooks & Complex State Orchestration",
        description: "Designing reusable hook primitives, reducer state machines, and preventing unnecessary render cascading.",
        severity: "Medium",
        course: {
          title: "Epic React: Advanced React Hooks & State",
          provider: "EpicReact.dev",
          duration: "18 Hours",
          type: "Interactive Course",
          level: "Intermediate"
        },
        certification: {
          title: "Certified React Native & React Architect",
          issuer: "W3C / DevCert Global",
          validity: "2 Years",
          badge: "React Architect"
        }
      }
    ]
  },

  "typescript": {
    benchmarkScore: 85,
    overview: "Static typing system, conditional types, mapped types, and generics safety across full-stack applications.",
    gaps: [
      {
        gapTitle: "Type-Level Programming & Conditional Generics",
        description: "Writing complex conditional types (`T extends U ? X : Y`), template literal types, and mapped utility helpers.",
        severity: "High",
        course: {
          title: "Total TypeScript: Type Transformations",
          provider: "Matt Pocock / TotalTypeScript",
          duration: "8 Hours",
          type: "Interactive Course",
          level: "Advanced"
        },
        certification: {
          title: "Microsoft Certified: TypeScript Engineering Associate",
          issuer: "Microsoft",
          validity: "2 Years",
          badge: "MS TypeScript"
        }
      }
    ]
  },

  // Back-End
  "python": {
    benchmarkScore: 85,
    overview: "Pythonic idiomatic programming, async I/O (asyncio), memory optimization, and enterprise backend engineering.",
    gaps: [
      {
        gapTitle: "Asynchronous Programming with AsyncIO",
        description: "Coroutines, event loops, tasks, semaphores, and building high-throughput async microservices.",
        severity: "High",
        course: {
          title: "High Performance Async Python with FastAPI",
          provider: "Udemy",
          duration: "15 Hours",
          type: "Video Masterclass",
          level: "Advanced"
        },
        certification: {
          title: "PCPP1™ – Certified Professional in Python Programming 1",
          issuer: "Python Institute (OpenEDG)",
          validity: "Lifetime",
          badge: "PCPP1 Certified"
        }
      },
      {
        gapTitle: "Generators, Metaclasses & Python Internals",
        description: "Understanding dunder methods, descriptor protocols, metaclasses, and the CPython Global Interpreter Lock (GIL).",
        severity: "Medium",
        course: {
          title: "Python 3: Deep Dive (Metaprogramming & Internals)",
          provider: "Fred Baptiste / Udemy",
          duration: "24 Hours",
          type: "Interactive Course",
          level: "Advanced"
        },
        certification: {
          title: "PCEP™ & PCAP™ Certified Associate in Python Programming",
          issuer: "Python Institute",
          validity: "Lifetime",
          badge: "Python Institute"
        }
      }
    ]
  },

  "java": {
    benchmarkScore: 85,
    overview: "JVM memory model, multi-threading concurrency, Spring Boot microservices, and enterprise distributed systems.",
    gaps: [
      {
        gapTitle: "JVM Concurrency & Virtual Threads (Project Loom)",
        description: "ExecutorService, ForkJoinPool, thread pools, locks, synchronized blocks, and Java 21+ virtual thread scaling.",
        severity: "High",
        course: {
          title: "Java Multithreading, Concurrency & Performance Optimization",
          provider: "Michael Pogrebinsky / Udemy",
          duration: "14 Hours",
          type: "Video Masterclass",
          level: "Advanced"
        },
        certification: {
          title: "Oracle Certified Professional: Java SE 17 / 21 Developer (1Z0-829)",
          issuer: "Oracle University",
          validity: "Lifetime",
          badge: "OCP Java SE"
        }
      },
      {
        gapTitle: "Spring Boot Microservices & Reactive WebFlux",
        description: "Building resilient distributed microservices with Spring Cloud, Netflix Eureka, resilience4j, and WebFlux.",
        severity: "High",
        course: {
          title: "Building Microservices with Spring Boot & Spring Cloud",
          provider: "Coursera",
          duration: "6 Weeks",
          type: "Specialization",
          level: "Intermediate"
        },
        certification: {
          title: "Spring Certified Professional",
          issuer: "Broadcom / VMware Tanzu",
          validity: "2 Years",
          badge: "Spring Certified"
        }
      }
    ]
  },

  "node.js": {
    benchmarkScore: 85,
    overview: "V8 engine internals, Libuv thread pool, stream pipelines, event emitters, and high-load Node services.",
    gaps: [
      {
        gapTitle: "Node.js Streams & Buffer Processing",
        description: "Handling backpressure, transform streams, piping gigabyte-scale datasets without memory exhaustion.",
        severity: "High",
        course: {
          title: "Advanced NodeJS: Streams, Threads & Cluster Architecture",
          provider: "Pluralsight",
          duration: "8 Hours",
          type: "Video Masterclass",
          level: "Advanced"
        },
        certification: {
          title: "OpenJS Node.js Application Developer (JSNAD)",
          issuer: "Linux Foundation / OpenJS Foundation",
          validity: "3 Years",
          badge: "JSNAD Certified"
        }
      }
    ]
  },

  // Database
  "postgresql": {
    benchmarkScore: 85,
    overview: "Relational database tuning, index strategies (B-Tree, GIN, GiST), transaction isolation levels, and replication.",
    gaps: [
      {
        gapTitle: "Query Optimization & EXPLAIN ANALYZE Diagnostics",
        description: "Diagnosing sequential scans, optimizing nested loop vs hash joins, and partial index construction.",
        severity: "High",
        course: {
          title: "PostgreSQL High Performance Query Tuning",
          provider: "EnterpriseDB (EDB)",
          duration: "16 Hours",
          type: "Bootcamp Track",
          level: "Advanced"
        },
        certification: {
          title: "PostgreSQL Certified Associate / Professional (EDB)",
          issuer: "EnterpriseDB",
          validity: "3 Years",
          badge: "Postgres EDB"
        }
      },
      {
        gapTitle: "ACID Isolation Levels & Lock Contention",
        description: "Read Committed vs Repeatable Read vs Serializable, phantom reads, advisory locks, and row deadlock resolution.",
        severity: "Medium",
        course: {
          title: "Mastering Database Transactions & Concurrency",
          provider: "Coursera / UC Berkeley",
          duration: "3 Weeks",
          type: "Interactive Course",
          level: "Advanced"
        },
        certification: {
          title: "AWS Certified Database – Specialty (RDS / Aurora Postgres)",
          issuer: "Amazon Web Services",
          validity: "3 Years",
          badge: "AWS DB Specialty"
        }
      }
    ]
  },

  "sql": {
    benchmarkScore: 85,
    overview: "Relational algebra, complex window functions, CTEs, and analytics data modeling.",
    gaps: [
      {
        gapTitle: "Window Functions & Analytical Window Framing",
        description: "ROW_NUMBER, DENSE_RANK, LEAD, LAG, running totals with ROWS BETWEEN unbounded preceding and current row.",
        severity: "High",
        course: {
          title: "Advanced SQL for Data Engineers & Analysts",
          provider: "DataCamp",
          duration: "12 Hours",
          type: "Interactive Course",
          level: "Intermediate"
        },
        certification: {
          title: "Google Cloud Certified Professional Data Engineer",
          issuer: "Google Cloud",
          validity: "2 Years",
          badge: "GCP Data Engineer"
        }
      }
    ]
  },

  // DevOps & Cloud
  "docker": {
    benchmarkScore: 85,
    overview: "Containerization, multi-stage builds, rootless containers, namespaces, cgroups, and container networking.",
    gaps: [
      {
        gapTitle: "Multi-Stage Builds & Container Image Hardening",
        description: "Reducing image footprints from 1GB to 50MB with scratch/alpine, non-root user execution, and vulnerability scanning.",
        severity: "High",
        course: {
          title: "Docker Mastery: Container Security and Swarm",
          provider: "Bret Fisher / Udemy",
          duration: "18 Hours",
          type: "Video Masterclass",
          level: "Intermediate"
        },
        certification: {
          title: "Docker Certified Associate (DCA)",
          issuer: "Mirantis / Docker",
          validity: "2 Years",
          badge: "DCA Certified"
        }
      }
    ]
  },

  "kubernetes": {
    benchmarkScore: 85,
    overview: "Container orchestration, ingress controllers, custom resource definitions (CRDs), StatefulSets, and zero-downtime rollouts.",
    gaps: [
      {
        gapTitle: "Cluster Networking, Ingress & NetworkPolicies",
        description: "CNI plugins, CoreDNS debugging, pod-to-pod ingress egress security rules, and service mesh proxies.",
        severity: "High",
        course: {
          title: "Kubernetes Certified Administrator (CKA) Deep Dive",
          provider: "KodeKloud",
          duration: "25 Hours",
          type: "Bootcamp Track",
          level: "Advanced"
        },
        certification: {
          title: "Certified Kubernetes Administrator (CKA)",
          issuer: "Cloud Native Computing Foundation (CNCF)",
          validity: "3 Years",
          badge: "CKA CNCF"
        }
      }
    ]
  },

  "aws": {
    benchmarkScore: 85,
    overview: "Cloud infrastructure design, VPC peering, IAM least-privilege policies, ECS/EKS, and resilient multi-AZ deployment.",
    gaps: [
      {
        gapTitle: "VPC Subnetting, Route Tables & NAT Gateways",
        description: "Designing isolated public/private subnets, CIDR calculations, Transit Gateways, and zero-trust security groups.",
        severity: "High",
        course: {
          title: "AWS Certified Solutions Architect – Associate (SAA-C03)",
          provider: "Stephane Maarek / Udemy",
          duration: "28 Hours",
          type: "Bootcamp Track",
          level: "Intermediate"
        },
        certification: {
          title: "AWS Certified Solutions Architect - Associate",
          issuer: "Amazon Web Services (AWS)",
          validity: "3 Years",
          badge: "AWS SAA"
        }
      }
    ]
  },

  // QA & Testing
  "selenium": {
    benchmarkScore: 85,
    overview: "Automated test frameworks, Page Object Model (POM), explicit waits, grid parallelism, and CI/CD test execution.",
    gaps: [
      {
        gapTitle: "Page Object Model (POM) & Explicit Synchronization",
        description: "Refactoring flaky tests with ExpectedConditions, fluent waits, and modular object page repositories.",
        severity: "High",
        course: {
          title: "Selenium WebDriver with Java - Basics to Advanced Frameworks",
          provider: "Rahul Shetty Academy",
          duration: "30 Hours",
          type: "Video Masterclass",
          level: "Intermediate"
        },
        certification: {
          title: "ISTQB Certified Tester Foundation Level (CTFL)",
          issuer: "ISTQB",
          validity: "Lifetime",
          badge: "ISTQB CTFL"
        }
      }
    ]
  }
};

// Fallback dynamic generator for any skill pill taken from the 100+ tests
export function getGapsForSkill(skillName: string, studentScore: number): SkillGapDefinition {
  const normalizedKey = skillName.toLowerCase().trim();
  
  if (SKILL_GAP_DATABASE[normalizedKey]) {
    return SKILL_GAP_DATABASE[normalizedKey];
  }

  // Generic fallback if user took a skill not in the primary curated list (e.g. Redis, Flutter, Go, etc.)
  const benchmark = 80;
  return {
    benchmarkScore: benchmark,
    overview: `Enterprise proficiency requirements and production best practices for ${skillName}.`,
    gaps: [
      {
        gapTitle: `${skillName} Enterprise Architecture & Clean Code Principles`,
        description: `Applying SOLID principles, modular architectural patterns, and maintainability conventions in ${skillName}.`,
        severity: studentScore < 50 ? "High" : "Medium",
        course: {
          title: `Mastering ${skillName}: From Fundamentals to Production`,
          provider: "Coursera / Leading University",
          duration: "4 Weeks",
          type: "Specialization",
          level: "Intermediate"
        },
        certification: {
          title: `Professional ${skillName} Certified Developer`,
          issuer: "Global Tech Assessment Board",
          validity: "2 Years",
          badge: `${skillName} Pro`
        }
      },
      {
        gapTitle: `${skillName} Testing, Debugging & Performance Profiling`,
        description: `Diagnosing bottlenecks, writing comprehensive automated tests, and handling edge cases effectively in ${skillName}.`,
        severity: studentScore < 70 ? "High" : "Low",
        course: {
          title: `${skillName} Performance Tuning & Automated Testing`,
          provider: "Pluralsight",
          duration: "8 Hours",
          type: "Video Masterclass",
          level: "Advanced"
        },
        certification: {
          title: `Certified ${skillName} Engineering Specialist`,
          issuer: "DevOps & Software Standards Institute",
          validity: "3 Years",
          badge: `${skillName} Specialist`
        }
      }
    ]
  };
}
