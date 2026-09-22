import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

// In-memory / persistent mock store for faculty opportunities
let facultyOpportunities = {
  industryInternships: [
    {
      id: "f-int-1",
      title: "Faculty Research & Cloud Residency",
      company: "Google Cloud Platform",
      department: "Computer Science / Cloud Architecture",
      duration: "8 Weeks (Summer Sabbatical)",
      stipend: "₹1,20,000 / month + Research Grant",
      mode: "Hybrid (Bangalore Campus)",
      deadline: "2026-08-30",
      openings: 3,
      eligibility: "Associate Professors & Professors with distributed systems or Kubernetes research",
      description: "Collaborate with Google Cloud engineering leads on sovereign cloud virtualization, microservice resilience, and automated edge telemetry.",
      skills: ["Kubernetes", "Distributed Systems", "Cloud Security", "Golang"],
      status: "OPEN"
    },
    {
      id: "f-int-2",
      title: "Enterprise AI & LLM Systems Immersion",
      company: "Infosys Labs",
      department: "Artificial Intelligence & Data Science",
      duration: "12 Weeks (Full Semester)",
      stipend: "₹1,00,000 / month + Lab Endowment",
      mode: "On-site (Electronic City)",
      deadline: "2026-09-15",
      openings: 2,
      eligibility: "Ph.D. holders in AI/ML, NLP, or Computational Mathematics",
      description: "Join our enterprise GenAI engineering guild to build production evaluation benchmarks and hallucination mitigation architectures.",
      skills: ["PyTorch", "Vector Databases", "Prompt Engineering", "MLOps"],
      status: "OPEN"
    },
    {
      id: "f-int-3",
      title: "Automotive Embedded Systems & EV Telemetry",
      company: "Bosch Engineering",
      department: "Electronics & Communication",
      duration: "6 Weeks",
      stipend: "₹85,000 / month",
      mode: "On-site (Adugodi Tech Center)",
      deadline: "2026-09-01",
      openings: 4,
      eligibility: "Faculty members teaching Embedded C, RTOS, or CAN-bus protocols",
      description: "Direct hands-on involvement with automotive firmware security, AUTOSAR compliant microcontrollers, and real-time battery analytics.",
      skills: ["Embedded C", "RTOS", "AUTOSAR", "IoT Architecture"],
      status: "OPEN"
    }
  ],

  industrialTraining: [
    {
      id: "f-trn-1",
      title: "Enterprise Kubernetes & Service Mesh Masterclass",
      organizer: "Red Hat & Linux Foundation",
      duration: "4 Weeks (Hands-on Lab Track)",
      seats: 30,
      mode: "Virtual + Weekend Labs",
      certification: "Certified Kubernetes Administrator (CKA) Alignment",
      startDate: "2026-07-01",
      status: "ACTIVE",
      description: "Deep dive into multi-cluster pod topology, ingress networking, Cilium eBPF monitoring, and GitOps workflows."
    },
    {
      id: "f-trn-2",
      title: "Modern VLSI Physical Design & Silicon Tapeout",
      organizer: "Synopsys Academic Guild",
      duration: "6 Weeks",
      seats: 25,
      mode: "Bangalore Lab Residency",
      certification: "Synopsys Certified Silicon Design Specialist",
      startDate: "2026-07-15",
      status: "ACTIVE",
      description: "Cadence & Synopsys EDA toolchain training from RTL synthesis to floorplanning, static timing analysis (STA), and DRC verification."
    },
    {
      id: "f-trn-3",
      title: "Production Data Engineering with Apache Spark & Iceberg",
      organizer: "Databricks University Alliance",
      duration: "3 Weeks",
      seats: 35,
      mode: "Online Live Cohort",
      certification: "Databricks Certified Data Engineer Professional",
      startDate: "2026-08-01",
      status: "UPCOMING",
      description: "ETL pipelines, Delta Lake transaction log architecture, structured streaming, and scalable Lakehouse governance."
    }
  ],

  fdps: [
    {
      id: "f-fdp-1",
      title: "AICTE-ATAL FDP on Generative AI & Foundation Models in Academic Pedagogy",
      sponsor: "AICTE & Microsoft Research",
      department: "Cross-Discipline (CS/IT/ECE)",
      duration: "5 Days Intensive (40 Contact Hours)",
      dates: "July 20 - July 24, 2026",
      venue: "Main Auditorium & Hybrid Stream",
      credits: 2,
      coordinator: "Dr. Arvind Ramanathan",
      seatsAvailable: 12,
      topics: [
        "Architectural Foundations of Transformers and Attention Mechanisms",
        "Integrating Open-Source Models (Llama 3, Gemma) into Student Labs",
        "Ethics, Intellectual Property, and Academic Integrity in AI-Assisted Work",
        "Hands-on Fine-Tuning Labs with HuggingFace and LoRA"
      ],
      status: "ENROLLING"
    },
    {
      id: "f-fdp-2",
      title: "National FDP on Zero-Trust Cloud Security & DevSecOps",
      sponsor: "Palo Alto Networks Academic Security Alliance",
      department: "Information Technology & Cyber",
      duration: "5 Days",
      dates: "August 10 - August 14, 2026",
      venue: "Cyber Defense Simulation Lab",
      credits: 2,
      coordinator: "Dr. Sunita Kulkarni",
      seatsAvailable: 8,
      topics: [
        "Cloud Identity Governance & IAM Least Privilege",
        "Container Runtime Security & Vulnerability Scanning",
        "Automated CI/CD Pipeline Hardening with GitHub Actions",
        "Incident Response & MITRE ATT&CK Mapping"
      ],
      status: "ENROLLING"
    },
    {
      id: "f-fdp-3",
      title: "Industry Pedagogy Sabbatical & NEP 2020 Skill Matrix Harmonization",
      sponsor: "NASSCOM FutureSkills Prime",
      department: "All Engineering Branches",
      duration: "1 Week",
      dates: "September 05 - September 09, 2026",
      venue: "Executive Council Hall",
      credits: 2,
      coordinator: "Dr. Rajeshwar Sharma",
      seatsAvailable: 20,
      topics: [
        "Outcome-Based Education (OBE) Metric Mapping for NAAC/NBA",
        "Designing Industry-Sponsored Capstone Project Frameworks",
        "Formative Technical Assessments vs Rote Learning Exams",
        "Micro-Credentials and Academic Bank of Credits (ABC)"
      ],
      status: "UPCOMING"
    }
  ],

  applications: [
    {
      id: "f-app-101",
      facultyName: "Dr. Arvind Ramanathan",
      department: "Computer Science",
      designation: "Professor & HOD",
      category: "Industry Internship",
      opportunityTitle: "Faculty Research & Cloud Residency",
      organization: "Google Cloud Platform",
      duration: "8 Weeks",
      submittedDate: "2026-06-12",
      status: "APPROVED_BY_DEAN",
      leaveSanction: "Sanctioned (Duty Leave)",
      fundingGrant: "₹2,40,000 Total Stipend + ₹1,50,000 Lab Equipment Grant",
      remarks: "Recommended by Academic Council for Sovereign Cloud R&D collaboration."
    },
    {
      id: "f-app-102",
      facultyName: "Prof. Priya Chandrasekar",
      department: "Information Technology",
      designation: "Assistant Professor",
      category: "FDP",
      opportunityTitle: "AICTE-ATAL FDP on Generative AI & Foundation Models",
      organization: "AICTE & Microsoft Research",
      duration: "5 Days",
      submittedDate: "2026-06-15",
      status: "COMPLETED",
      leaveSanction: "Approved",
      fundingGrant: "AICTE Sponsored Travel & Kit",
      remarks: "Certificate issued (Grade: O - Outstanding). Added to NBA Faculty Appraisal File."
    },
    {
      id: "f-app-103",
      facultyName: "Dr. Rajeshwar Sharma",
      department: "AI & Data Science",
      designation: "Associate Professor",
      category: "Industry Internship",
      opportunityTitle: "Enterprise AI & LLM Systems Immersion",
      organization: "Infosys Labs",
      duration: "12 Weeks",
      submittedDate: "2026-06-18",
      status: "PENDING_SANCTION",
      leaveSanction: "Under Review by Principal",
      fundingGrant: "₹3,00,000 Stipend + Research Lab Grant",
      remarks: "Awaiting teaching load distribution plan from department coordinator."
    },
    {
      id: "f-app-104",
      facultyName: "Dr. Meenakshi Sundaram",
      department: "Electronics & Communication",
      designation: "Professor",
      category: "Industrial Training",
      opportunityTitle: "Modern VLSI Physical Design & Silicon Tapeout",
      organization: "Synopsys Academic Guild",
      duration: "6 Weeks",
      submittedDate: "2026-06-19",
      status: "CORPORATE_CONFIRMED",
      leaveSanction: "Approved (Duty Leave)",
      fundingGrant: "Synopsys Sponsored Lab Licenses (Worth ₹12 Lakhs)",
      remarks: "Includes campus donation of 30 Synopsys educational EDA dongles."
    }
  ]
};

export async function GET() {
  return NextResponse.json({
    success: true,
    ...facultyOpportunities
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { facultyName, department, designation, category, opportunityTitle, organization, duration, remarks } = body;

    const newApp = {
      id: `f-app-${Date.now()}`,
      facultyName: facultyName || "Faculty Member",
      department: department || "Computer Science",
      designation: designation || "Assistant Professor",
      category: category || "FDP",
      opportunityTitle: opportunityTitle || "Professional Development Program",
      organization: organization || "Corporate Partner",
      duration: duration || "1-4 Weeks",
      submittedDate: new Date().toISOString().split("T")[0],
      status: "SUBMITTED_FOR_SANCTION",
      leaveSanction: "Under Review by HOD",
      fundingGrant: "Eligible for Institutional Faculty Development Fund",
      remarks: remarks || "Application submitted via Faculty Opportunities portal."
    };

    facultyOpportunities.applications.unshift(newApp);

    return NextResponse.json({
      success: true,
      message: "Faculty application successfully registered and routed to Academic Dean for leave sanction.",
      application: newApp
    });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to submit faculty application" }, { status: 500 });
  }
}
