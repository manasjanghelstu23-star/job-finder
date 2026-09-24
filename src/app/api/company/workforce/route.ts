import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();

    // =========================================================================
    // 1. DEPARTMENT WORKFORCE CAPACITY (High-Level Analysis)
    // =========================================================================
    const departments = [
      {
        id: "dept-eng",
        name: "Engineering",
        currentHeadcount: 84,
        requiredHeadcount: 100,
        gap: -16,
        status: "HIGH_SHORTAGE",
        description: "Core software engineering, platform architecture, and site reliability teams."
      },
      {
        id: "dept-data",
        name: "Data & Analytics",
        currentHeadcount: 22,
        requiredHeadcount: 30,
        gap: -8,
        status: "MODERATE_SHORTAGE",
        description: "Data platform pipelines, ETL processing, and business intelligence."
      },
      {
        id: "dept-prod",
        name: "Product",
        currentHeadcount: 18,
        requiredHeadcount: 20,
        gap: -2,
        status: "OPTIMAL",
        description: "Product management, technical product owners, and UX research."
      },
      {
        id: "dept-cyber",
        name: "Cybersecurity",
        currentHeadcount: 7,
        requiredHeadcount: 12,
        gap: -5,
        status: "HIGH_SHORTAGE",
        description: "InfoSec compliance, application security posture, and cloud IAM auditing."
      }
    ];

    // =========================================================================
    // 2. ROLE BREAKDOWN BY DEPARTMENT (Role Analysis)
    // =========================================================================
    const rolesByDepartment: Record<string, any[]> = {
      "Engineering": [
        {
          id: "role-be",
          role: "Backend Engineer",
          currentHeadcount: 32,
          requiredHeadcount: 42,
          gap: -10,
          priority: "Critical",
          salaryRange: "₹45,000 / month (Intern) or 16-22 LPA",
          canonicalSkills: ["Java", "Spring Boot", "SQL", "REST APIs", "Data Structures", "Docker", "Kubernetes", "AWS"]
        },
        {
          id: "role-fe",
          role: "Frontend Engineer",
          currentHeadcount: 24,
          requiredHeadcount: 28,
          gap: -4,
          priority: "High",
          salaryRange: "₹40,000 / month (Intern) or 14-18 LPA",
          canonicalSkills: ["React", "TypeScript", "Tailwind CSS", "Next.js", "Web Accessibility (a11y)"]
        },
        {
          id: "role-devops",
          role: "DevOps / SRE Engineer",
          currentHeadcount: 8,
          requiredHeadcount: 10,
          gap: -2,
          priority: "High",
          salaryRange: "₹50,000 / month (Intern) or 18-24 LPA",
          canonicalSkills: ["Kubernetes", "Docker", "AWS", "Linux & Bash", "Terraform", "Prometheus"]
        },
        {
          id: "role-qa",
          role: "QA & Automation Engineer",
          currentHeadcount: 20,
          requiredHeadcount: 20,
          gap: 0,
          priority: "Optimal",
          salaryRange: "₹35,000 / month (Intern) or 10-14 LPA",
          canonicalSkills: ["Playwright", "Selenium", "Jest", "CI/CD Integration"]
        }
      ],
      "Data & Analytics": [
        {
          id: "role-de",
          role: "Data Engineer",
          currentHeadcount: 14,
          requiredHeadcount: 20,
          gap: -6,
          priority: "Critical",
          salaryRange: "₹45,000 / month (Intern) or 15-20 LPA",
          canonicalSkills: ["Python", "SQL", "Kafka", "PostgreSQL", "Apache Spark"]
        },
        {
          id: "role-ml",
          role: "Machine Learning Engineer",
          currentHeadcount: 8,
          requiredHeadcount: 10,
          gap: -2,
          priority: "High",
          salaryRange: "₹55,000 / month (Intern) or 20-25 LPA",
          canonicalSkills: ["Python", "PyTorch", "Vector DBs", "FastAPI"]
        }
      ],
      "Product": [
        {
          id: "role-pm",
          role: "Technical Product Manager",
          currentHeadcount: 12,
          requiredHeadcount: 14,
          gap: -2,
          priority: "Medium",
          salaryRange: "₹50,000 / month (Intern) or 18-24 LPA",
          canonicalSkills: ["Product Roadmapping", "SQL & Metrics", "AI Product Architecture"]
        },
        {
          id: "role-uiux",
          role: "Product & UI Designer",
          currentHeadcount: 6,
          requiredHeadcount: 6,
          gap: 0,
          priority: "Optimal",
          salaryRange: "₹40,000 / month",
          canonicalSkills: ["Figma", "Design Systems", "User Research"]
        }
      ],
      "Cybersecurity": [
        {
          id: "role-sec",
          role: "Security Analyst",
          currentHeadcount: 4,
          requiredHeadcount: 7,
          gap: -3,
          priority: "High",
          salaryRange: "₹45,000 / month",
          canonicalSkills: ["OAuth2 & OIDC", "Vulnerability Scanning", "OWASP Top 10"]
        },
        {
          id: "role-csec",
          role: "Cloud Security Architect",
          currentHeadcount: 3,
          requiredHeadcount: 5,
          gap: -2,
          priority: "Critical",
          salaryRange: "₹60,000 / month (Intern) or 22-28 LPA",
          canonicalSkills: ["AWS IAM", "Kubernetes RBAC", "Zero Trust Architecture"]
        }
      ]
    };

    // =========================================================================
    // 3. CONNECT ROLES TO ACTUAL PROJECTS & SPRINT COMMITMENTS
    // =========================================================================
    const projectStaffing = [
      {
        projectId: "proj-a",
        projectName: "Project A: Real-Time Telemetry & Observability Pipeline",
        department: "Engineering",
        targetDeadline: "2026-08-15",
        roles: [
          { role: "Backend Engineer", required: 8, assigned: 5, gap: -3 },
          { role: "Frontend Engineer", required: 4, assigned: 4, gap: 0 },
          { role: "DevOps / SRE", required: 2, assigned: 1, gap: -1 }
        ],
        businessImpact: "Handles 500k telemetry events/sec. Staffing gap directly impacts sub-second latency SLA."
      },
      {
        projectId: "proj-b",
        projectName: "Project B: NextGen Enterprise Responsive Portal",
        department: "Engineering",
        targetDeadline: "2026-07-30",
        roles: [
          { role: "Frontend Engineer", required: 6, assigned: 4, gap: -2 },
          { role: "Backend Engineer", required: 2, assigned: 2, gap: 0 },
          { role: "QA Automation", required: 2, assigned: 2, gap: 0 }
        ],
        businessImpact: "Client contract requires WCAG 2.1 AA accessibility and sub-second bundle hydration."
      },
      {
        projectId: "proj-c",
        projectName: "Project C: Enterprise AI Semantic Search & Knowledge Graph",
        department: "Data & Analytics",
        targetDeadline: "2026-09-30",
        roles: [
          { role: "Data Engineer", required: 5, assigned: 3, gap: -2 },
          { role: "Backend Engineer", required: 3, assigned: 2, gap: -1 }
        ],
        businessImpact: "Vector database clustering and retrieval indexing for enterprise compliance search."
      }
    ];

    // =========================================================================
    // 4. CANONICAL SKILL PROFILE & IMPORTANCE RATINGS
    // =========================================================================
    const roleSkillProfiles: Record<string, any> = {
      "Backend Engineer": {
        required: [
          { name: "Java", requirement: "Proficient (75%)", importance: "Critical", weight: 1.0 },
          { name: "Spring Boot", requirement: "Proficient (75%)", importance: "Critical", weight: 1.0 },
          { name: "SQL", requirement: "Proficient (75%)", importance: "High", weight: 0.9 },
          { name: "REST APIs", requirement: "Proficient (75%)", importance: "High", weight: 0.8 },
          { name: "Data Structures", requirement: "Proficient (75%)", importance: "High", weight: 0.8 }
        ],
        preferred: [
          { name: "Docker", requirement: "Developing (60%)", importance: "Medium", weight: 0.7 },
          { name: "Kubernetes", requirement: "Developing (60%)", importance: "Medium", weight: 0.7 },
          { name: "AWS", requirement: "Developing (60%)", importance: "Preferred", weight: 0.6 }
        ]
      },
      "Frontend Engineer": {
        required: [
          { name: "React", requirement: "Advanced (85%)", importance: "Critical", weight: 1.0 },
          { name: "TypeScript", requirement: "Advanced (85%)", importance: "Critical", weight: 1.0 },
          { name: "Tailwind CSS", requirement: "Proficient (75%)", importance: "High", weight: 0.8 },
          { name: "Web Accessibility (a11y)", requirement: "Proficient (75%)", importance: "High", weight: 0.8 }
        ],
        preferred: [
          { name: "Next.js", requirement: "Proficient (75%)", importance: "Medium", weight: 0.7 },
          { name: "Jest Testing", requirement: "Developing (60%)", importance: "Preferred", weight: 0.5 }
        ]
      },
      "DevOps / SRE Engineer": {
        required: [
          { name: "Kubernetes", requirement: "Advanced (85%)", importance: "Critical", weight: 1.0 },
          { name: "Docker", requirement: "Advanced (85%)", importance: "Critical", weight: 1.0 },
          { name: "AWS", requirement: "Proficient (75%)", importance: "High", weight: 0.9 },
          { name: "Linux & Bash", requirement: "Proficient (75%)", importance: "High", weight: 0.8 }
        ],
        preferred: [
          { name: "Terraform", requirement: "Developing (60%)", importance: "Medium", weight: 0.7 },
          { name: "Prometheus & Grafana", requirement: "Developing (60%)", importance: "Preferred", weight: 0.6 }
        ]
      },
      "Data Engineer": {
        required: [
          { name: "Python", requirement: "Advanced (85%)", importance: "Critical", weight: 1.0 },
          { name: "SQL", requirement: "Advanced (85%)", importance: "Critical", weight: 1.0 },
          { name: "Kafka", requirement: "Proficient (75%)", importance: "High", weight: 0.9 },
          { name: "PostgreSQL", requirement: "Proficient (75%)", importance: "High", weight: 0.8 }
        ],
        preferred: [
          { name: "Apache Spark", requirement: "Developing (60%)", importance: "Medium", weight: 0.7 },
          { name: "Airflow", requirement: "Developing (60%)", importance: "Preferred", weight: 0.6 }
        ]
      }
    };

    // =========================================================================
    // 5. HIRING REASONS TAXONOMY
    // =========================================================================
    const hiringReasons = [
      { id: "hr-shortage", label: "Workforce shortage", description: "Current staffing cannot meet active delivery volume" },
      { id: "hr-newproj", label: "New project", description: "Upcoming Q3/Q4 initiatives without dedicated team allocation" },
      { id: "hr-expansion", label: "Project expansion", description: "Project A & B scale requires additional parallel sprint workers" },
      { id: "hr-replace", label: "Replacement", description: "Backfilling team members transitioning to architectural roles" },
      { id: "hr-tech", label: "New technology initiative", description: "Adopting Generative AI & Kubernetes service mesh" },
      { id: "hr-biz", label: "Business expansion", description: "Enterprise client portfolio increased by 35%" },
      { id: "hr-season", label: "Seasonal demand", description: "Internship campus intake for summer engineering batch" }
    ];

    // =========================================================================
    // 6. INTERNAL TALENT ANALYSIS ("Internal Talent First" Decision Engine)
    // =========================================================================
    const internalTalentCandidates: Record<string, any[]> = {
      "Backend Engineer": [
        {
          id: "emp-a",
          name: "Employee A (Aditya Varma)",
          currentRole: "Backend Engineer (Intermediate)",
          skillMatchScore: 87,
          matchedSkills: ["Java", "Spring Boot", "SQL", "Docker"],
          developmentRequired: "AWS (Bridging 60% -> 75%)",
          upskillTime: "2-3 Weeks",
          upskillPath: "Assign 'AWS Cloud Practitioner Lab' + Mentorship Pairing",
          recommendation: "STRONG_INTERNAL_UPSKILL"
        },
        {
          id: "emp-b",
          name: "Employee B (Bhavna Patel)",
          currentRole: "Frontend Engineer (Advanced)",
          skillMatchScore: 82,
          matchedSkills: ["TypeScript", "REST APIs", "System Thinking"],
          developmentRequired: "Kubernetes & Java Backend Concurrency",
          upskillTime: "4-5 Weeks",
          upskillPath: "Full-Stack Conversion Pathway",
          recommendation: "POTENTIAL_ROLE_TRANSFER"
        },
        {
          id: "emp-c",
          name: "Employee C (Chirag Sen)",
          currentRole: "Data Engineer (Proficient)",
          skillMatchScore: 79,
          matchedSkills: ["SQL", "Kafka", "Data Structures"],
          developmentRequired: "System Design & Spring Boot Framework",
          upskillTime: "3 Weeks",
          upskillPath: "Enroll in 'Designing Large Scale Distributed Systems Masterclass'",
          recommendation: "SUITABLE_INTERNAL_CANDIDATE"
        }
      ]
    };

    // =========================================================================
    // 7. WORKFORCE OUTLOOK & FORECASTING (Next 3, 6, 12 Months)
    // =========================================================================
    const workforceOutlook = [
      {
        horizon: "Next 3 Months",
        targetQuarter: "Q3 2026",
        projectedRole: "Backend Engineers",
        headcountNeeded: 5,
        driver: "Project A Telemetry Pipeline launch and microservices autoscaling",
        status: "Immediate Need",
        recommendedAction: "Hybrid: Upskill 2 internal engineers + Hire 3 external candidates"
      },
      {
        horizon: "Next 6 Months",
        targetQuarter: "Q4 2026",
        projectedRole: "Data & ML Engineers",
        headcountNeeded: 8,
        driver: "Project C Enterprise AI Semantic Search expansion",
        status: "Strategic Expansion",
        recommendedAction: "Begin Campus Internship Pipeline for 2026 Grads"
      },
      {
        horizon: "Next 12 Months",
        targetQuarter: "H1 2027",
        projectedRole: "Cloud & SRE Engineers",
        headcountNeeded: 12,
        driver: "Multi-cloud infrastructure migration and FinOps tooling",
        status: "Long-Range Forecast",
        recommendedAction: "Internal Certification Guild (CKAD / AWS) for 8 existing engineers"
      }
    ];

    // =========================================================================
    // 8. COMPANY SKILL DEMAND RADAR (Internal Upskill vs External Hire Split)
    // =========================================================================
    const companySkillDemand = [
      {
        skill: "Java",
        currentEmployeesCount: 32,
        requiredEmployeesCount: 42,
        gap: 10,
        employeesToUpskill: 6,
        employeesToHire: 4,
        category: "Core Languages"
      },
      {
        skill: "AWS",
        currentEmployeesCount: 9,
        requiredEmployeesCount: 18,
        gap: 9,
        employeesToUpskill: 5,
        employeesToHire: 4,
        category: "Cloud Infrastructure"
      },
      {
        skill: "Kubernetes",
        currentEmployeesCount: 4,
        requiredEmployeesCount: 12,
        gap: 8,
        employeesToUpskill: 4,
        employeesToHire: 4,
        category: "DevOps & Containers"
      },
      {
        skill: "React",
        currentEmployeesCount: 18,
        requiredEmployeesCount: 22,
        gap: 4,
        employeesToUpskill: 2,
        employeesToHire: 2,
        category: "Frontend"
      },
      {
        skill: "Data Engineering",
        currentEmployeesCount: 8,
        requiredEmployeesCount: 15,
        gap: 7,
        employeesToUpskill: 3,
        employeesToHire: 4,
        category: "Data Platforms"
      }
    ];

    // =========================================================================
    // 9. QUESTION BANK ASSESSMENT ATTACHMENTS FOR CANDIDATE MATCHING
    // =========================================================================
    const questionBankAssessmentMappings: Record<string, any[]> = {
      "Backend Engineer": [
        { topic: "Java Concurrency & Multi-threading", questionCount: 10, source: "Question Bank (Java)", difficulty: "Advanced" },
        { topic: "Spring Boot REST Microservices", questionCount: 8, source: "Question Bank (Spring Boot)", difficulty: "Intermediate" },
        { topic: "PostgreSQL Query Optimization & Indexing", questionCount: 7, source: "Question Bank (SQL)", difficulty: "Intermediate" }
      ],
      "Frontend Engineer": [
        { topic: "React 19 Hooks & Concurrency", questionCount: 8, source: "Question Bank (React)", difficulty: "Advanced" },
        { topic: "TypeScript Strict Typing & Generics", questionCount: 8, source: "Question Bank (TypeScript)", difficulty: "Intermediate" }
      ],
      "DevOps / SRE Engineer": [
        { topic: "Kubernetes Pod Lifecycle & Networking", questionCount: 8, source: "Question Bank (Kubernetes)", difficulty: "Advanced" },
        { topic: "Docker Container Hardening & Multi-Stage Builds", questionCount: 6, source: "Question Bank (Docker)", difficulty: "Intermediate" }
      ]
    };

    // Calculate totals
    const totalCurrent = departments.reduce((acc, d) => acc + d.currentHeadcount, 0);
    const totalRequired = departments.reduce((acc, d) => acc + d.requiredHeadcount, 0);
    const totalGap = departments.reduce((acc, d) => acc + d.gap, 0);

    return NextResponse.json({
      success: true,
      departments,
      rolesByDepartment,
      projectStaffing,
      roleSkillProfiles,
      hiringReasons,
      internalTalentCandidates,
      workforceOutlook,
      companySkillDemand,
      questionBankAssessmentMappings,
      summary: {
        totalCurrent,
        totalRequired,
        totalGap: Math.abs(totalGap),
        departmentsCount: departments.length
      }
    });

  } catch (error: any) {
    console.error("Error fetching workforce analysis:", error);
    return NextResponse.json({ error: "Failed to load workforce analysis" }, { status: 500 });
  }
}
