import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

// In-memory store for newly added employees
let customEmployees: any[] = [];

export async function GET() {
  try {
    const session = await getSession();

    // =========================================================================
    // 1. PROJECTS & WORK REPOSITORY
    // =========================================================================
    const projects = [
      {
        id: "proj-x",
        name: "Project X: Real-Time Telemetry & Observability Pipeline",
        codeName: "Project X",
        department: "Engineering",
        status: "Active",
        priority: "Critical",
        deadline: "2026-08-15",
        lead: "Vikram Rao",
        teamSize: 6,
        description: "High-throughput distributed telemetry processing engine capable of digesting 500k events/sec with sub-second latency.",
        responsibilities: [
          "Architect resilient message streaming pipeline",
          "Optimize database query execution and indexing",
          "Ensure 99.99% system availability and failover automation"
        ],
        technologies: ["Java 21", "Spring Boot", "Distributed SQL", "AWS MSK", "Docker", "Kubernetes"],
        tasks: [
          { id: "t1", title: "Migrate Redis pub/sub to Kafka consumer groups", assignee: "Employee A", status: "In Progress" },
          { id: "t2", title: "Implement distributed tracing with OpenTelemetry", assignee: "Employee A", status: "Done" },
          { id: "t3", title: "Kubernetes horizontal pod autoscaler load testing", assignee: "Employee C", status: "Blocked" }
        ],
        requiredSkills: [
          { name: "Java", requiredLevel: "Advanced", minScore: 85, weight: 1.0 },
          { name: "Spring Boot", requiredLevel: "Proficient", minScore: 75, weight: 0.9 },
          { name: "SQL", requiredLevel: "Proficient", minScore: 75, weight: 0.8 },
          { name: "AWS", requiredLevel: "Proficient", minScore: 70, weight: 0.8 },
          { name: "Docker", requiredLevel: "Proficient", minScore: 70, weight: 0.7 },
          { name: "Kubernetes", requiredLevel: "Proficient", minScore: 75, weight: 0.9 },
          { name: "System Design", requiredLevel: "Advanced", minScore: 80, weight: 1.0 }
        ]
      },
      {
        id: "proj-y",
        name: "Project Y: NextGen Responsive Enterprise Portal",
        codeName: "Project Y",
        department: "Engineering",
        status: "Active",
        priority: "High",
        deadline: "2026-07-30",
        lead: "Priya Sharma",
        teamSize: 4,
        description: "Client-facing modular web application featuring zero-bundle layout hydration, accessibility conformance, and live analytics.",
        responsibilities: [
          "Design atomic UI system components",
          "Implement WCAG 2.1 AA accessible workflows",
          "Optimize Core Web Vitals (LCP < 1.2s, INP < 100ms)"
        ],
        technologies: ["React 19", "TypeScript", "Next.js", "Tailwind CSS", "Jest"],
        tasks: [
          { id: "ty1", title: "Build accessible candidate inspection modal", assignee: "Employee B", status: "Done" },
          { id: "ty2", title: "Optimize client bundle tree-shaking", assignee: "Employee B", status: "In Progress" }
        ],
        requiredSkills: [
          { name: "TypeScript", requiredLevel: "Advanced", minScore: 85, weight: 1.0 },
          { name: "React", requiredLevel: "Advanced", minScore: 85, weight: 1.0 },
          { name: "Next.js", requiredLevel: "Proficient", minScore: 75, weight: 0.8 },
          { name: "Tailwind CSS", requiredLevel: "Proficient", minScore: 75, weight: 0.7 },
          { name: "Web Accessibility (a11y)", requiredLevel: "Proficient", minScore: 70, weight: 0.8 }
        ]
      },
      {
        id: "proj-z",
        name: "Project Z: Enterprise AI Semantic Search & Knowledge Graph",
        codeName: "Project Z",
        department: "Data & Product",
        status: "Active",
        priority: "High",
        deadline: "2026-09-30",
        lead: "Dr. Arvind Gupta",
        teamSize: 5,
        description: "Vector database indexing and semantic search orchestrator providing contextual knowledge synthesis across millions of enterprise documents.",
        responsibilities: [
          "Implement hybrid sparse-dense vector retrieval",
          "Construct entity relation graph",
          "Ensure role-based access control filtering on semantic search hits"
        ],
        technologies: ["Python", "PyTorch", "Vector DB (Qdrant)", "FastAPI", "Docker", "GCP"],
        tasks: [
          { id: "tz1", title: "Benchmark cosine vs dot product vector search latency", assignee: "Employee C", status: "In Progress" },
          { id: "tz2", title: "Define enterprise ontology schema and entity mapping", assignee: "Employee D", status: "Done" }
        ],
        requiredSkills: [
          { name: "Python", requiredLevel: "Advanced", minScore: 85, weight: 1.0 },
          { name: "Machine Learning", requiredLevel: "Advanced", minScore: 80, weight: 0.9 },
          { name: "Vector Databases", requiredLevel: "Proficient", minScore: 75, weight: 0.8 },
          { name: "System Design", requiredLevel: "Proficient", minScore: 75, weight: 0.8 },
          { name: "Data Modeling", requiredLevel: "Proficient", minScore: 75, weight: 0.8 }
        ]
      }
    ];

    // =========================================================================
    // 2. EVIDENCE-BASED EMPLOYEE DIRECTORY & SKILL PROFILES
    // =========================================================================
    const employees = [
      {
        id: "emp-a",
        name: "Employee A (Aditya Varma)",
        avatar: "AV",
        department: "Engineering",
        role: "Backend Engineer",
        experience: "3 years",
        email: "aditya.varma@infosys.demo",
        currentProject: "Project X",
        projectId: "proj-x",
        status: "ACTIVE",
        overallProficiency: "Proficient",

        // Company-level evidence-based skill profile
        skills: {
          technical: [
            {
              name: "Java",
              level: "Advanced",
              score: 91,
              category: "Languages",
              evidence: [
                { type: "Assessment", detail: "Internal Core Java & Concurrency Exam (91% Score)" },
                { type: "Project", detail: "Built async ingestion worker in Project X" },
                { type: "Manager Evaluation", detail: "Rated 'Exceeds Expectations' in 2025 Annual Review" }
              ]
            },
            {
              name: "Spring Boot",
              level: "Proficient",
              score: 82,
              category: "Frameworks",
              evidence: [
                { type: "Assessment", detail: "Spring Microservices Assessment (82% Score)" },
                { type: "Project", detail: "Maintained 14 production Spring Boot REST services" }
              ]
            },
            {
              name: "SQL",
              level: "Proficient",
              score: 84,
              category: "Databases",
              evidence: [
                { type: "Assessment", detail: "PostgreSQL Advanced Query Optimization (84%)" },
                { type: "Work Experience", detail: "2 years writing complex stored procedures & indexes" }
              ]
            },
            {
              name: "Docker",
              level: "Developing",
              score: 64,
              category: "DevOps",
              evidence: [
                { type: "Self Assessment", detail: "Hands-on multi-stage Dockerfiles" },
                { type: "Project", detail: "Dockerized local dev environments" }
              ]
            },
            {
              name: "AWS",
              level: "Developing",
              score: 60,
              category: "Cloud",
              evidence: [
                { type: "Self Assessment", detail: "Basic S3, EC2, and IAM role management" }
              ]
            },
            {
              name: "Kubernetes",
              level: "Not Assessed",
              score: 0,
              category: "Cloud & DevOps",
              evidence: []
            },
            {
              name: "System Design",
              level: "Developing",
              score: 62,
              category: "Architecture",
              evidence: [
                { type: "Manager Evaluation", detail: "Co-authored high-level design doc for telemetry ingestion" }
              ]
            }
          ],
          soft: [
            {
              name: "Communication",
              level: "Proficient",
              evidence: [{ type: "Manager Evaluation", detail: "Clear technical documentation and sprint updates" }]
            },
            {
              name: "Leadership",
              level: "Developing",
              evidence: [{ type: "Project", detail: "Mentored 1 junior developer during onboarding" }]
            },
            {
              name: "Teamwork",
              level: "Advanced",
              evidence: [{ type: "Peer Review", detail: "Highly collaborative across frontend and QA peers" }]
            },
            {
              name: "Problem Solving",
              level: "Proficient",
              evidence: [{ type: "Assessment", detail: "Algorithmic thinking benchmark (86%)" }]
            }
          ]
        },

        // Identified Skill Gaps (compared to Project X and Role Progression)
        skillGaps: [
          {
            skill: "Kubernetes",
            severity: "Critical Gap",
            status: "Not Assessed",
            requiredBy: "Project X (Load Testing & Autoscaling)",
            targetLevel: "Proficient (75%)",
            currentLevel: "Not Assessed (0%)",
            priorityRank: 1
          },
          {
            skill: "AWS",
            severity: "Moderate Gap",
            status: "Developing",
            requiredBy: "Project X (Cloud Migration & MSK)",
            targetLevel: "Proficient (70%)",
            currentLevel: "Developing (60%)",
            priorityRank: 2
          },
          {
            skill: "System Design",
            severity: "Strategic Gap",
            status: "Developing",
            requiredBy: "Senior Backend Engineer Promotion Path",
            targetLevel: "Advanced (80%)",
            currentLevel: "Developing (62%)",
            priorityRank: 3
          }
        ],

        // Current Development Areas
        developmentAreas: [
          "Cloud Infrastructure & Container Orchestration",
          "High-Throughput System Design",
          "CI/CD Automated Deployment Pipelines"
        ],

        // Productivity & Process Development Insights (constructive opportunities, not punitive)
        productivityInsights: [
          {
            id: "prod-1",
            observedArea: "Cloud Deployment Workflow",
            observation: "Frequent local build-and-test iteration cycles before deploying container images to staging.",
            opportunity: "Strengthen automated CI/CD and remote dev-container workflows to cut 45 minutes of manual verification daily.",
            improvementAction: "Adopt automated container testing and pre-commit lint validation pipelines.",
            recommendedResources: [
              "Internal CI/CD Pipeline Playbook",
              "Docker Multi-Stage Build Best Practices",
              "1-on-1 DevOps Pairing Session with Lead SRE"
            ]
          },
          {
            id: "prod-2",
            observedArea: "Async Queue Handling & Dead Letter Queues",
            observation: "Manual troubleshooting of poison pill messages during telemetry testing.",
            opportunity: "Implement standard dead-letter backoff pattern to automate retries.",
            improvementAction: "Study enterprise message retry protocols in Kafka / SQS.",
            recommendedResources: [
              "Resilient Messaging Patterns Guide"
            ]
          }
        ],

        // Personalized Learning & Resource Recommendations (Ranked)
        learningRecommendations: [
          {
            id: "res-k8s-1",
            targetSkill: "Kubernetes",
            title: "Production Kubernetes for Backend Engineers",
            type: "Company Training",
            difficulty: "Intermediate",
            estimatedDuration: "12 Hours",
            relevanceScore: 98,
            isCompanyApproved: true,
            certificationAligned: "CKAD Aligned",
            provider: "Enterprise Cloud Academy",
            status: "ASSIGNED",
            relevanceReason: "Required to unblock Task t3 in Project X (HPA load testing)"
          },
          {
            id: "res-aws-1",
            targetSkill: "AWS",
            title: "AWS Cloud Practitioner & Developer Associate Lab",
            type: "Hands-on Lab",
            difficulty: "Intermediate",
            estimatedDuration: "16 Hours",
            relevanceScore: 92,
            isCompanyApproved: true,
            certificationAligned: "AWS Certified Developer",
            provider: "Cloud Sandbox",
            status: "RECOMMENDED",
            relevanceReason: "Directly bridges 60% -> 75% gap for MSK and VPC networking"
          },
          {
            id: "res-sys-1",
            targetSkill: "System Design",
            title: "Designing Distributed Large-Scale Systems Masterclass",
            type: "Workshop & Mentor Session",
            difficulty: "Advanced",
            estimatedDuration: "8 Hours",
            relevanceScore: 88,
            isCompanyApproved: true,
            certificationAligned: "Internal Staff Architect Path",
            provider: "Tech Lead Mentorship Cohort",
            status: "RECOMMENDED",
            relevanceReason: "Accelerates readiness for Lead Engineer role"
          },
          {
            id: "res-doc-1",
            targetSkill: "Kubernetes",
            title: "Internal EKS Cluster Standard Operating Procedures",
            type: "Internal Documentation",
            difficulty: "Beginner - Intermediate",
            estimatedDuration: "2 Hours",
            relevanceScore: 95,
            isCompanyApproved: true,
            certificationAligned: "Internal Conformance",
            provider: "Platform SRE Team",
            status: "RECOMMENDED",
            relevanceReason: "Mandatory standard for deploying microservices"
          }
        ]
      },
      {
        id: "emp-b",
        name: "Employee B (Bhavna Patel)",
        avatar: "BP",
        department: "Engineering",
        role: "Frontend Engineer",
        experience: "2.5 years",
        email: "bhavna.patel@infosys.demo",
        currentProject: "Project Y",
        projectId: "proj-y",
        status: "ACTIVE",
        overallProficiency: "Advanced",
        skills: {
          technical: [
            {
              name: "React",
              level: "Advanced",
              score: 93,
              category: "Frontend",
              evidence: [
                { type: "Assessment", detail: "React 19 Hooks & Concurrency Evaluation (93%)" },
                { type: "Project", detail: "Architected component library for Project Y" }
              ]
            },
            {
              name: "TypeScript",
              level: "Advanced",
              score: 89,
              category: "Languages",
              evidence: [
                { type: "Assessment", detail: "Strict TypeScript & Generics Assessment (89%)" },
                { type: "Project", detail: "Zero 'any' policy enforcement in client codebase" }
              ]
            },
            {
              name: "Tailwind CSS",
              level: "Advanced",
              score: 92,
              category: "Design Systems",
              evidence: [
                { type: "Project", detail: "Designed enterprise theme tokens & responsive layouts" }
              ]
            },
            {
              name: "Next.js",
              level: "Proficient",
              score: 78,
              category: "Frameworks",
              evidence: [
                { type: "Project", detail: "App Router SSR & Server Actions implementation" }
              ]
            },
            {
              name: "Web Accessibility (a11y)",
              level: "Developing",
              score: 62,
              category: "Frontend Standards",
              evidence: [
                { type: "Self Assessment", detail: "Basic ARIA labels and keyboard tab indexing" }
              ]
            }
          ],
          soft: [
            { name: "Communication", level: "Advanced", evidence: [{ type: "Manager Evaluation", detail: "Excellent cross-functional alignment with Product and UX" }] },
            { name: "Leadership", level: "Proficient", evidence: [{ type: "Project", detail: "Organized bi-weekly Frontend chapter guild" }] },
            { name: "Teamwork", level: "Advanced", evidence: [{ type: "Peer Review", detail: "Always assists teammates with CSS and DOM debugging" }] },
            { name: "Problem Solving", level: "Proficient", evidence: [{ type: "Assessment", detail: "Interactive UI state debugging (84%)" }] }
          ]
        },
        skillGaps: [
          {
            skill: "Web Accessibility (a11y)",
            severity: "Moderate Gap",
            status: "Developing",
            requiredBy: "Project Y (WCAG 2.1 AA Compliance)",
            targetLevel: "Proficient (75%)",
            currentLevel: "Developing (62%)",
            priorityRank: 1
          },
          {
            skill: "Performance Optimization (INP & LCP)",
            severity: "Moderate Gap",
            status: "Developing",
            requiredBy: "Project Y Core Web Vitals targets",
            targetLevel: "Advanced (85%)",
            currentLevel: "Proficient (72%)",
            priorityRank: 2
          }
        ],
        developmentAreas: [
          "Accessible Rich Internet Applications (WAI-ARIA)",
          "Chrome DevTools Memory & Performance Profiling"
        ],
        productivityInsights: [
          {
            id: "prod-b1",
            observedArea: "A11y Audit Automation",
            observation: "Manual screen-reader testing is currently performed on every PR.",
            opportunity: "Integrate Axe-Core and automated Playwright accessibility sweeps into GitHub Actions.",
            improvementAction: "Set up CI pipeline accessibility linter.",
            recommendedResources: ["Automated Web Accessibility Testing Handbook"]
          }
        ],
        learningRecommendations: [
          {
            id: "res-a11y-1",
            targetSkill: "Web Accessibility (a11y)",
            title: "Accessible Web Applications & WCAG 2.1 Certification",
            type: "Course",
            difficulty: "Intermediate",
            estimatedDuration: "6 Hours",
            relevanceScore: 96,
            isCompanyApproved: true,
            certificationAligned: "IAAP CPACC",
            provider: "W3C Guild",
            status: "ASSIGNED",
            relevanceReason: "Required for Project Y client contract compliance"
          }
        ]
      },
      {
        id: "emp-c",
        name: "Employee C (Chirag Sen)",
        avatar: "CS",
        department: "Data & Analytics",
        role: "Data Engineer",
        experience: "2 years",
        email: "chirag.sen@infosys.demo",
        currentProject: "Project X",
        projectId: "proj-x",
        status: "ACTIVE",
        overallProficiency: "Proficient",
        skills: {
          technical: [
            {
              name: "Python",
              level: "Advanced",
              score: 90,
              category: "Languages",
              evidence: [
                { type: "Assessment", detail: "Python Data Processing & Pandas Exam (90%)" },
                { type: "Project", detail: "Built batch ETL pipeline processing 40GB daily logs" }
              ]
            },
            {
              name: "SQL",
              level: "Advanced",
              score: 88,
              category: "Databases",
              evidence: [
                { type: "Assessment", detail: "Analytical Window Functions & Partitioning (88%)" }
              ]
            },
            {
              name: "Kafka",
              level: "Proficient",
              score: 76,
              category: "Streaming",
              evidence: [
                { type: "Project", detail: "Configured Kafka consumer topics for telemetry" }
              ]
            },
            {
              name: "Kubernetes",
              level: "Developing",
              score: 55,
              category: "Cloud & DevOps",
              evidence: [
                { type: "Self Assessment", detail: "Basic kubectl command usage" }
              ]
            }
          ],
          soft: [
            { name: "Communication", level: "Proficient", evidence: [{ type: "Manager Evaluation", detail: "Well structured data schema presentations" }] },
            { name: "Teamwork", level: "Proficient", evidence: [{ type: "Peer Review", detail: "Punctual in sprint syncs" }] },
            { name: "Problem Solving", level: "Advanced", evidence: [{ type: "Assessment", detail: "ETL optimization and data pipeline recovery (92%)" }] },
            { name: "Leadership", level: "Developing", evidence: [{ type: "Self Assessment", detail: "Looking to take ownership of pipeline alerting" }] }
          ]
        },
        skillGaps: [
          {
            skill: "Kubernetes",
            severity: "Critical Gap",
            status: "Developing",
            requiredBy: "Project X (Containerized Kafka deployment)",
            targetLevel: "Proficient (75%)",
            currentLevel: "Developing (55%)",
            priorityRank: 1
          },
          {
            skill: "Apache Spark / Distributed Streaming",
            severity: "Moderate Gap",
            status: "Not Assessed",
            requiredBy: "Next sprint real-time aggregations",
            targetLevel: "Proficient (70%)",
            currentLevel: "Not Assessed (0%)",
            priorityRank: 2
          }
        ],
        developmentAreas: [
          "Cloud Native Data Infrastructure (Kubernetes & Helm)",
          "Real-Time Stream Processing (Spark Streaming / Flink)"
        ],
        productivityInsights: [
          {
            id: "prod-c1",
            observedArea: "Stream Pipeline Monitoring",
            observation: "Lag telemetry alerts are checked manually via Grafana dashboards.",
            opportunity: "Deploy automated Prometheus webhook alerts directly to Slack.",
            improvementAction: "Set up automated threshold alerting.",
            recommendedResources: ["Prometheus Alertmanager for Streaming Clusters"]
          }
        ],
        learningRecommendations: [
          {
            id: "res-k8s-c",
            targetSkill: "Kubernetes",
            title: "Kubernetes for Data Engineers & Streaming Workloads",
            type: "Workshop",
            difficulty: "Intermediate",
            estimatedDuration: "10 Hours",
            relevanceScore: 94,
            isCompanyApproved: true,
            certificationAligned: "Internal Cloud Native Specialization",
            provider: "Enterprise Cloud Academy",
            status: "RECOMMENDED",
            relevanceReason: "Resolves blocked Task t3 in Project X"
          }
        ]
      },
      {
        id: "emp-d",
        name: "Employee D (Divya Nair)",
        avatar: "DN",
        department: "Product",
        role: "Product Manager",
        experience: "4 years",
        email: "divya.nair@infosys.demo",
        currentProject: "Project Z",
        projectId: "proj-z",
        status: "ACTIVE",
        overallProficiency: "Advanced",
        skills: {
          technical: [
            {
              name: "Product Strategy & Roadmapping",
              level: "Advanced",
              score: 94,
              category: "Product Management",
              evidence: [
                { type: "Manager Evaluation", detail: "Authored H2 Product Strategy adopted by leadership" }
              ]
            },
            {
              name: "Data Analytics & SQL",
              level: "Proficient",
              score: 80,
              category: "Data",
              evidence: [
                { type: "Assessment", detail: "Product Metrics & Retention Cohort Analysis (80%)" }
              ]
            },
            {
              name: "Generative AI Product Patterns",
              level: "Proficient",
              score: 75,
              category: "AI & ML",
              evidence: [
                { type: "Project", detail: "Shipped enterprise semantic search PRD for Project Z" }
              ]
            }
          ],
          soft: [
            { name: "Communication", level: "Advanced", evidence: [{ type: "Leadership Review", detail: "Outstanding stakeholder communication" }] },
            { name: "Leadership", level: "Advanced", evidence: [{ type: "Project", detail: "Leads cross-functional team of 8" }] },
            { name: "Teamwork", level: "Advanced", evidence: [{ type: "Peer Review", detail: "Empathetic and clear roadmap priorities" }] },
            { name: "Problem Solving", level: "Advanced", evidence: [{ type: "Project", detail: "Resolved client escalation with phased rollout plan" }] }
          ]
        },
        skillGaps: [
          {
            skill: "AI Evaluation & Guardrails (RAG Triad)",
            severity: "Moderate Gap",
            status: "Developing",
            requiredBy: "Project Z (Enterprise Trust & Safety compliance)",
            targetLevel: "Proficient (75%)",
            currentLevel: "Developing (60%)",
            priorityRank: 1
          }
        ],
        developmentAreas: [
          "Enterprise AI Safety, Guardrails & LLM Red-Teaming",
          "Technical Product Management Architecture"
        ],
        productivityInsights: [
          {
            id: "prod-d1",
            observedArea: "Client Feedback Synthesis",
            observation: "User interview notes are manually consolidated into Jira stories.",
            opportunity: "Implement automated transcript summarization workflow.",
            improvementAction: "Leverage company internal LLM summarizer tool.",
            recommendedResources: ["Enterprise AI Workflow Automation"]
          }
        ],
        learningRecommendations: [
          {
            id: "res-ai-d",
            targetSkill: "AI Evaluation & Guardrails",
            title: "Evaluating RAG & LLM Applications for Enterprise",
            type: "Workshop",
            difficulty: "Advanced",
            estimatedDuration: "5 Hours",
            relevanceScore: 90,
            isCompanyApproved: true,
            certificationAligned: "AI Product Leader Badge",
            provider: "Cognitive Intelligence Lab",
            status: "RECOMMENDED",
            relevanceReason: "Crucial for Project Z enterprise launch readiness"
          }
        ]
      }
    ];

    // =========================================================================
    // 3. FUTURE PROJECTS & WORKFORCE DECISION LOOP
    // (Upskill Internal Employees vs. Hire External Talent via 7-Step Wizard)
    // =========================================================================
    const futureProjects = [
      {
        id: "fp-1",
        title: "Autonomous Agentic Orchestration Platform",
        plannedStartDate: "2026-10-01",
        estimatedDuration: "6 Months",
        department: "Cognitive Intelligence Lab",
        requiredRoles: [
          {
            role: "AI Systems Engineer",
            headcountNeeded: 3,
            requiredSkills: ["Python", "FastAPI", "Vector Databases", "Docker"],
            internalCandidatesAvailable: [
              {
                employeeId: "emp-c",
                name: "Employee C (Chirag Sen)",
                currentRole: "Data Engineer",
                readinessScore: 84,
                matchedSkills: ["Python", "Docker", "SQL"],
                gapSkills: ["Vector Databases"],
                recommendation: "UPSKILL_INTERNAL",
                upskillPlan: "Enroll in 10-day Vector Database & Agentic Architecture Sprint"
              }
            ],
            shortageGap: 2, // 3 needed, 1 upskillable -> 2 external hires needed
            decision: "HYBRID_STRATEGY"
          }
        ]
      },
      {
        id: "fp-2",
        title: "Multi-Cloud FinOps & Infrastructure Scaling",
        plannedStartDate: "2026-11-15",
        estimatedDuration: "9 Months",
        department: "Infrastructure & Platform",
        requiredRoles: [
          {
            role: "Cloud Infrastructure / DevOps Engineer",
            headcountNeeded: 4,
            requiredSkills: ["Kubernetes", "AWS", "Terraform", "CI/CD"],
            internalCandidatesAvailable: [
              {
                employeeId: "emp-a",
                name: "Employee A (Aditya Varma)",
                currentRole: "Backend Engineer",
                readinessScore: 72,
                matchedSkills: ["Java", "Docker", "System Design"],
                gapSkills: ["Kubernetes", "AWS"],
                recommendation: "UPSKILL_INTERNAL",
                upskillPlan: "Assign 'Production Kubernetes for Backend Engineers' + AWS Lab"
              }
            ],
            shortageGap: 3, // 4 needed, 1 upskillable -> 3 external hires needed
            decision: "POST_JOB_AND_UPSKILL"
          }
        ]
      }
    ];

    const allEmployees = [...customEmployees, ...employees];

    return NextResponse.json({
      success: true,
      employees: allEmployees,
      projects,
      futureProjects,
      stats: {
        totalEmployees: allEmployees.length,
        activeProjects: projects.length,
        identifiedGapsCount: allEmployees.reduce((acc, e) => acc + (e.skillGaps?.length || 0), 0),
        activeUpskillPlans: 4 + customEmployees.length,
        productivityInsightsCount: allEmployees.reduce((acc, e) => acc + (e.productivityInsights?.length || 0), 0)
      }
    });

  } catch (error: any) {
    console.error("Error fetching employee intelligence:", error);
    return NextResponse.json({ error: "Failed to load employee intelligence" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      department,
      role,
      experience,
      currentProject,
      technicalSkills = [],
      softSkills = [],
      developmentAreas = []
    } = body;

    if (!name || !email || !department || !role) {
      return NextResponse.json(
        { error: "Employee name, email, department, and role are required." },
        { status: 400 }
      );
    }

    // Generate avatar initials from name
    const initials = name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((p: string) => p[0].toUpperCase())
      .join("") || "EM";

    // Format technical skills
    const formattedTech = technicalSkills.map((sk: any) => ({
      name: sk.name,
      level: sk.level || "Proficient",
      score: sk.score ? parseInt(sk.score) : 75,
      category: sk.category || "Engineering",
      evidence: sk.evidenceDetail ? [
        { type: sk.evidenceType || "Assessment", detail: sk.evidenceDetail }
      ] : [
        { type: "Manager Evaluation", detail: `Baseline evaluated upon joining ${department}` }
      ]
    }));

    // Soft skills
    const formattedSoft = softSkills.length > 0 ? softSkills : [
      { name: "Communication", level: "Proficient", evidence: [{ type: "Manager Evaluation", detail: "Professional onboarding interview" }] },
      { name: "Teamwork", level: "Proficient", evidence: [{ type: "Peer Review", detail: "Team orientation assessment" }] },
      { name: "Problem Solving", level: "Proficient", evidence: [{ type: "Assessment", detail: "Analytical logic benchmark (78%)" }] }
    ];

    // Identify Gaps
    const generatedGaps = [];
    if (!formattedTech.some((s: any) => s.name.toLowerCase().includes("cloud") || s.name.toLowerCase().includes("aws"))) {
      generatedGaps.push({
        skill: "AWS Cloud Infrastructure",
        severity: "Moderate Gap",
        status: "Developing",
        requiredBy: `${currentProject || "Enterprise Projects"} deployment`,
        targetLevel: "Proficient (75%)",
        currentLevel: "Developing (55%)",
        priorityRank: 1
      });
    }
    if (!formattedTech.some((s: any) => s.name.toLowerCase().includes("system design"))) {
      generatedGaps.push({
        skill: "Distributed System Design",
        severity: "Strategic Gap",
        status: "Developing",
        requiredBy: "Role progression & Architecture alignment",
        targetLevel: "Advanced (80%)",
        currentLevel: "Developing (60%)",
        priorityRank: 2
      });
    }

    // Curated learning pathways for this new employee
    const learningRecommendations = [
      {
        id: `res-cust-${Date.now()}-1`,
        targetSkill: generatedGaps[0]?.skill || "Cloud Architecture",
        title: "Enterprise Architecture & Cloud Foundations",
        type: "Company Training",
        difficulty: "Intermediate",
        estimatedDuration: "8 Hours",
        relevanceScore: 94,
        isCompanyApproved: true,
        certificationAligned: "Internal Architecture Guild",
        provider: "Enterprise Cloud Academy",
        status: "RECOMMENDED",
        relevanceReason: `Immediate onboarding learning path for ${role} in ${department}`
      },
      {
        id: `res-cust-${Date.now()}-2`,
        targetSkill: "Code Quality & Testing",
        title: "Automated Integration Testing & Clean Code Standards",
        type: "Internal Documentation",
        difficulty: "Intermediate",
        estimatedDuration: "3 Hours",
        relevanceScore: 90,
        isCompanyApproved: true,
        certificationAligned: "Engineering Excellence Standard",
        provider: "Core Platform Guild",
        status: "ASSIGNED",
        relevanceReason: `Mandatory standard for all newly onboarded ${role}s`
      }
    ];

    // Constructive productivity development opportunity
    const productivityInsights = [
      {
        id: `prod-cust-${Date.now()}`,
        observedArea: "Onboarding & Toolchain Alignment",
        observation: "New employee onboarding ramp-up in first 30 days.",
        opportunity: "Pair with senior lead mentor for accelerated environment setup and repo access.",
        improvementAction: "Schedule bi-weekly pairing with Tech Lead.",
        recommendedResources: [
          "Engineering Onboarding Handbook",
          "Dev Environment Setup Automated Script"
        ]
      }
    ];

    const newEmployee = {
      id: `emp-${Date.now()}`,
      name: `${name} (New Addition)`,
      avatar: initials,
      department,
      role,
      experience: experience || "1-2 years",
      email,
      currentProject: currentProject || "Project X",
      projectId: "proj-x",
      status: "ACTIVE",
      overallProficiency: "Proficient",
      skills: {
        technical: formattedTech,
        soft: formattedSoft
      },
      skillGaps: generatedGaps,
      developmentAreas: developmentAreas.length > 0 ? developmentAreas : [
        "Cloud Architecture & High-Scale Systems",
        "CI/CD Pipeline Automation",
        "Domain-Driven Design"
      ],
      productivityInsights,
      learningRecommendations
    };

    customEmployees.unshift(newEmployee);

    return NextResponse.json({
      success: true,
      message: `Employee "${name}" successfully registered into the Skill & Productivity Intelligence Directory.`,
      employee: newEmployee
    }, { status: 201 });

  } catch (err: any) {
    console.error("Error creating employee:", err);
    return NextResponse.json({ error: "Failed to add employee to directory." }, { status: 500 });
  }
}
