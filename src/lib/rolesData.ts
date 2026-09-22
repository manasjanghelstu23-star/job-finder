export const rolesData: Record<string, Record<string, string[]>> = {
  "Software Development": {
    "Web Development": [
      "Frontend Developer", "Backend Developer", "Full Stack Developer", "Web Developer", 
      "UI Developer", "Web Application Developer", "WordPress Developer", "Shopify Developer", "E-commerce Developer"
    ],
    "Software Engineering": [
      "Software Engineer", "Software Developer", "Application Developer", "Application Engineer", 
      "Product Engineer", "Software Development Engineer (SDE)", "Graduate Software Engineer", "Junior Software Engineer"
    ],
    "Mobile Development": [
      "Android Developer", "iOS Developer", "Flutter Developer", "React Native Developer", 
      "Mobile App Developer", "Cross-Platform Developer", "Mobile Software Engineer"
    ],
    "Desktop / Application": [
      "Desktop Application Developer", "Windows Developer", "macOS Developer", "Java Developer", 
      ".NET Developer", "C++ Developer", "Python Developer", "JavaScript Developer"
    ]
  },
  "AI / Machine Learning": {
    "General": [
      "AI Engineer", "Machine Learning Engineer", "AI/ML Engineer", "Deep Learning Engineer", 
      "Generative AI Engineer", "LLM Engineer", "NLP Engineer", "Computer Vision Engineer", 
      "Robotics AI Engineer", "AI Research Engineer", "Machine Learning Researcher", 
      "Applied AI Engineer", "Prompt Engineer", "AI Solutions Engineer", "MLOps Engineer", "AI Product Engineer"
    ],
    "Specialized": [
      "Speech AI Engineer", "Recommendation Systems Engineer", "Autonomous Systems Engineer", 
      "Reinforcement Learning Engineer", "Generative AI Developer", "Multimodal AI Engineer"
    ]
  },
  "Data": {
    "Data Analysis": [
      "Data Analyst", "Business Data Analyst", "Product Data Analyst", "Marketing Data Analyst", 
      "Operations Data Analyst", "Financial Data Analyst", "BI Analyst"
    ],
    "Data Science": [
      "Data Scientist", "Applied Data Scientist", "Product Data Scientist", "Research Data Scientist", "Quantitative Analyst"
    ],
    "Data Engineering": [
      "Data Engineer", "Big Data Engineer", "Data Platform Engineer", "Analytics Engineer", 
      "ETL Developer", "Data Warehouse Engineer", "Database Developer"
    ],
    "Business Intelligence": [
      "BI Developer", "BI Engineer", "Business Intelligence Analyst", "Reporting Analyst", "Data Visualization Specialist"
    ]
  },
  "Cloud / DevOps / Infrastructure": {
    "General": [
      "Cloud Engineer", "Cloud Architect", "Cloud Developer", "Cloud Solutions Engineer", 
      "DevOps Engineer", "DevSecOps Engineer", "Site Reliability Engineer (SRE)", 
      "Infrastructure Engineer", "Platform Engineer", "Cloud Security Engineer", 
      "Systems Engineer", "Systems Administrator", "Linux Administrator", "Network Administrator", 
      "Cloud Operations Engineer", "Infrastructure Automation Engineer", "Release Engineer", "Build Engineer"
    ],
    "Cloud-specific": [
      "AWS Cloud Engineer", "Azure Cloud Engineer", "Google Cloud Engineer", "Kubernetes Engineer", "Cloud Solutions Architect"
    ]
  },
  "Cybersecurity": {
    "General": [
      "Cybersecurity Analyst", "Security Analyst", "Information Security Analyst", "Security Engineer", 
      "Cybersecurity Engineer", "Security Operations Center (SOC) Analyst", "SOC Engineer", 
      "Penetration Tester", "Ethical Hacker", "Vulnerability Analyst", "Vulnerability Assessment Engineer", 
      "Application Security Engineer", "Cloud Security Engineer", "Network Security Engineer", 
      "Security Architect", "Incident Response Analyst", "Digital Forensics Analyst", "Malware Analyst", 
      "Threat Intelligence Analyst", "Threat Hunter", "Security Consultant", "Identity and Access Management (IAM) Engineer", 
      "Security Operations Engineer", "DevSecOps Engineer", "GRC Analyst", "Information Security Auditor"
    ]
  },
  "Software Testing / QA": {
    "General": [
      "QA Engineer", "QA Analyst", "Software Test Engineer", "Software Tester", "Manual Tester", 
      "Automation Tester", "Test Automation Engineer", "SDET", "Performance Test Engineer", 
      "Security Test Engineer", "API Test Engineer", "Mobile Test Engineer", "QA Automation Engineer", 
      "Quality Assurance Analyst", "Test Architect", "Test Manager"
    ]
  },
  "Database": {
    "General": [
      "Database Administrator (DBA)", "Database Developer", "Database Engineer", "Database Architect", 
      "SQL Developer", "NoSQL Developer", "Data Warehouse Developer", "Database Reliability Engineer", 
      "Database Performance Engineer", "Database Security Engineer"
    ]
  },
  "System / Network Engineering": {
    "Systems": [
      "Systems Engineer", "Systems Administrator", "Systems Architect", "Infrastructure Engineer", 
      "Technical Support Engineer", "IT Engineer"
    ],
    "Networking": [
      "Network Engineer", "Network Administrator", "Network Architect", "Network Security Engineer", 
      "Wireless Network Engineer", "Network Operations Engineer", "NOC Engineer", "Telecom Network Engineer"
    ]
  },
  "UI/UX & Product Design": {
    "General": [
      "UI Designer", "UX Designer", "UI/UX Designer", "Product Designer", "Interaction Designer", 
      "UX Researcher", "UX Engineer", "Visual Designer", "Web Designer", "Design Systems Designer", 
      "Information Architect", "Service Designer", "Design Technologist"
    ]
  },
  "Game Development": {
    "General": [
      "Game Developer", "Game Programmer", "Gameplay Programmer", "Game Engine Developer", 
      "Unity Developer", "Unreal Engine Developer", "Game Designer", "Level Designer", 
      "Technical Game Designer", "Game AI Programmer", "Graphics Programmer", "Game Tools Programmer", "Game QA Tester"
    ]
  },
  "Embedded Systems / IoT": {
    "General": [
      "Embedded Systems Engineer", "Embedded Software Engineer", "Embedded Developer", 
      "Firmware Engineer", "Firmware Developer", "IoT Engineer", "IoT Developer", 
      "IoT Solutions Engineer", "Hardware-Software Integration Engineer", "RTOS Developer", 
      "Embedded Linux Engineer", "Device Software Engineer", "Automotive Embedded Engineer", "Robotics Engineer"
    ]
  },
  "Robotics / Automation": {
    "General": [
      "Robotics Engineer", "Robotics Software Engineer", "Robotics Programmer", "Automation Engineer", 
      "Robotics AI Engineer", "Control Systems Engineer", "Autonomous Systems Engineer", 
      "Robot Software Developer", "ROS Developer", "Industrial Automation Engineer", 
      "PLC Programmer", "Computer Vision Robotics Engineer"
    ]
  },
  "Hardware / Electronics": {
    "General": [
      "Hardware Engineer", "Electronics Engineer", "Hardware Design Engineer", "Electrical Engineer", 
      "PCB Design Engineer", "VLSI Engineer", "ASIC Design Engineer", "FPGA Engineer", 
      "Semiconductor Engineer", "Verification Engineer", "RTL Design Engineer", "IC Design Engineer", "Hardware Verification Engineer"
    ]
  },
  "Finance / Banking": {
    "General": [
      "Financial Analyst", "Investment Analyst", "Credit Analyst", "Risk Analyst", "Quantitative Analyst", 
      "Financial Planner", "Investment Banker", "Portfolio Manager", "Treasury Analyst", 
      "Corporate Finance Analyst", "Financial Consultant", "Banking Operations Analyst", "FinTech Analyst", "Financial Data Analyst"
    ],
    "FinTech Technology": [
      "FinTech Developer", "Financial Software Engineer", "Quant Developer", "Blockchain Developer", "Smart Contract Developer"
    ]
  },
  "Business / Management": {
    "General": [
      "Business Analyst", "Business Consultant", "Management Consultant", "Strategy Analyst", 
      "Strategy Consultant", "Operations Analyst", "Operations Manager", "Product Analyst", 
      "Product Manager", "Associate Product Manager", "Program Manager", "Project Manager", 
      "Technical Program Manager", "Business Operations Manager", "Process Analyst"
    ]
  },
  "Marketing": {
    "General": [
      "Digital Marketing Specialist", "Digital Marketing Analyst", "SEO Specialist", "SEO Analyst", 
      "SEM Specialist", "Social Media Manager", "Social Media Analyst", "Content Marketing Specialist", 
      "Growth Marketing Specialist", "Performance Marketing Specialist", "Marketing Analyst", 
      "Brand Manager", "Product Marketing Manager", "Marketing Operations Specialist", "CRM Marketing Specialist"
    ]
  },
  "Content / Media": {
    "General": [
      "Content Writer", "Technical Writer", "Copywriter", "Content Strategist", "Content Creator", 
      "Technical Content Developer", "Documentation Specialist", "Editor", "UX Writer", "Script Writer", 
      "SEO Content Writer", "Communications Specialist"
    ]
  },
  "Human Resources": {
    "General": [
      "HR Executive", "HR Analyst", "HR Business Partner", "Talent Acquisition Specialist", 
      "Recruiter", "Technical Recruiter", "Talent Management Specialist", "Learning & Development Specialist", 
      "Compensation Analyst", "People Operations Specialist", "HR Operations Analyst", "Employee Relations Specialist"
    ]
  },
  "Healthcare": {
    "General": [
      "Healthcare Data Analyst", "Health Informatics Analyst", "Clinical Data Analyst", 
      "Healthcare Software Developer", "HealthTech Engineer", "Medical Data Scientist", 
      "Bioinformatics Analyst", "Bioinformatics Scientist", "Clinical Research Associate", 
      "Healthcare IT Specialist", "Medical AI Engineer", "Health Information Manager"
    ]
  },
  "Biotechnology / Life Sciences": {
    "General": [
      "Bioinformatics Engineer", "Bioinformatics Scientist", "Computational Biologist", 
      "Biostatistician", "Biotechnology Researcher", "Genomics Data Analyst", 
      "Computational Genomics Scientist", "Biomedical Engineer", "Biomedical Data Scientist", 
      "Research Scientist", "Laboratory Analyst"
    ]
  },
  "Manufacturing / Industrial": {
    "General": [
      "Manufacturing Engineer", "Production Engineer", "Industrial Engineer", "Process Engineer", 
      "Quality Engineer", "Mechanical Design Engineer", "Industrial Automation Engineer", 
      "Manufacturing Data Analyst", "Supply Chain Analyst", "Production Planner", 
      "Operations Engineer", "Maintenance Engineer", "Reliability Engineer"
    ]
  },
  "Automotive": {
    "General": [
      "Automotive Software Engineer", "Automotive Embedded Engineer", "Autonomous Vehicle Engineer", 
      "ADAS Engineer", "Vehicle Systems Engineer", "Automotive Electronics Engineer", 
      "Automotive Controls Engineer", "EV Engineer", "Battery Engineer", "Automotive Data Analyst", "Automotive Cybersecurity Engineer"
    ]
  },
  "Aerospace / Defence": {
    "General": [
      "Aerospace Engineer", "Avionics Engineer", "Flight Systems Engineer", "Propulsion Engineer", 
      "Aerospace Software Engineer", "Embedded Aerospace Engineer", "Systems Engineer", 
      "Defence Software Engineer", "Radar Engineer", "Satellite Systems Engineer", 
      "Space Systems Engineer", "Flight Software Engineer"
    ]
  },
  "Civil / Construction": {
    "General": [
      "Civil Engineer", "Structural Engineer", "Construction Engineer", "Site Engineer", 
      "Project Engineer", "Transportation Engineer", "Environmental Engineer", 
      "Geotechnical Engineer", "Water Resources Engineer", "Urban Planning Analyst", 
      "Construction Project Manager", "BIM Engineer"
    ]
  },
  "Energy / Environment": {
    "General": [
      "Energy Engineer", "Renewable Energy Engineer", "Solar Engineer", "Wind Energy Engineer", 
      "Power Systems Engineer", "Electrical Power Engineer", "Environmental Engineer", 
      "Sustainability Analyst", "Energy Data Analyst", "Climate Data Analyst", "Environmental Data Scientist"
    ]
  },
  "Supply Chain / Logistics": {
    "General": [
      "Supply Chain Analyst", "Supply Chain Manager", "Logistics Analyst", "Logistics Manager", 
      "Procurement Analyst", "Procurement Specialist", "Inventory Analyst", "Demand Planner", 
      "Operations Analyst", "Warehouse Operations Manager", "Transportation Analyst"
    ]
  },
  "Legal / Compliance": {
    "General": [
      "Legal Analyst", "Legal Consultant", "Compliance Analyst", "Risk & Compliance Analyst", 
      "Regulatory Analyst", "Contract Analyst", "Legal Operations Specialist", 
      "Privacy Analyst", "Data Protection Specialist", "Cybersecurity Compliance Analyst"
    ]
  },
  "Research / Academia": {
    "General": [
      "Research Assistant", "Research Associate", "Research Scientist", "Research Engineer", 
      "Research Analyst", "Computational Researcher", "AI Research Scientist", 
      "Data Research Scientist", "Software Research Engineer", "Academic Researcher", "Laboratory Researcher"
    ]
  },
  "Education / EdTech": {
    "General": [
      "Instructional Designer", "Learning Experience Designer", "Curriculum Developer", 
      "Educational Technology Specialist", "EdTech Product Manager", "Learning Data Analyst", 
      "Education Data Scientist", "Online Course Developer", "Technical Trainer", 
      "Corporate Trainer", "Academic Program Coordinator"
    ]
  },
  "Creative / Design": {
    "General": [
      "Graphic Designer", "Motion Graphics Designer", "3D Artist", "3D Designer", "Animator", 
      "Video Editor", "Film Editor", "VFX Artist", "Visual Effects Artist", 
      "Creative Designer", "Art Director", "Creative Director"
    ]
  }
};
