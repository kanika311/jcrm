export interface Workshop {
  id: string;
  title: string;
  domain: string;
  badge: string;
  duration: string;
  deliveryMode: string;
  targetAudience: string;
  bannerImage: string;
  tagline: string;
  certificateCode: string;
  keyGains: string[];
  curriculumHighlights: { session: string; title: string; topics: string[] }[];
}

export const WORKSHOPS: Workshop[] = [
  {
    id: "genai-llm-workshop",
    title: "Generative AI, Agentic Workflows & LLM Engineering",
    domain: "Generative AI & LLMs",
    badge: "Top Requested by Universities",
    duration: "2 Days • 16 Hours Bootcamp",
    deliveryMode: "On-Campus / Hybrid / Live Online",
    targetAudience: "Engineering Students, CS/IT Faculty, Developers",
    bannerImage: "https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=800&q=80",
    tagline: "Master Transformer models, Retrieval-Augmented Generation (RAG) with Vector DBs, LangChain multi-agent workflows, and open-source LLaMA 3 fine-tuning.",
    certificateCode: "JCRM-CERT-2026-AI89",
    keyGains: [
      "Build production RAG pipelines with Pinecone & Qdrant vector databases",
      "Develop autonomous multi-agent systems using LangChain & LlamaIndex",
      "Fine-tune Open-Source LLMs (LLaMA 3, Gemma, Mistral) on custom datasets",
      "Implement structured output parsing & prompt injection defense guardrails",
      "Deploy AI Agent microservices using FastAPI, Docker & Cloud GPUs",
      "Receive 100% Verified JCRM Workshop Certificate & Project Code Repository",
      "Hands-on live coding with 1-on-1 mentor assistance",
      "Post-workshop access to JCRM AI developer Discord community"
    ],
    curriculumHighlights: [
      {
        session: "Day 1 - Morning",
        title: "Session 1: LLM Architecture, Embeddings & RAG Fundamentals",
        topics: [
          "Understanding Transformer Self-Attention & Tokenization",
          "Dense Vector Embeddings & Vector Search (Cosine Similarity)",
          "Building a RAG Pipeline with PyPDF & Pinecone Vector Database",
          "Hands-on Lab: Custom Knowledge Base Q&A Chatbot"
        ]
      },
      {
        session: "Day 1 - Afternoon",
        title: "Session 2: LangChain & LlamaIndex Agentic Frameworks",
        topics: [
          "Agent Tool Calling & External API Execution",
          "Multi-Agent Collaboration & Supervisor Architecture",
          "Stateful Agent Memory (Short-term vs Long-term Persistence)",
          "Hands-on Lab: Automated Research Agent with Web Search"
        ]
      },
      {
        session: "Day 2 - Morning",
        title: "Session 3: Open-Source LLM Fine-Tuning & Quantization",
        topics: [
          "Parameter-Efficient Fine-Tuning (PEFT / LoRA / QLoRA)",
          "Data Preparation & Instruction Tuning Datasets",
          "Model Quantization (GGUF, AWQ, 4-bit / 8-bit precision)",
          "Hands-on Lab: Fine-Tuning LLaMA 3 on Custom Domain Data"
        ]
      },
      {
        session: "Day 2 - Afternoon",
        title: "Session 4: AI Agent Security, MLOps & Production Cloud Deployment",
        topics: [
          "Prompt Injection Attacks & Guardrails (NeMo Guardrails / Guidance)",
          "FastAPI Microservice Wrapping & Docker Containerization",
          "Deploying Inference Endpoints to AWS / Cloud GPU Instances",
          "Certificate Distribution & Industry Project Hackathon Showcase"
        ]
      }
    ]
  },
  {
    id: "cybersecurity-vapt-workshop",
    title: "Cyber Security, Ethical Hacking & VAPT Defense",
    domain: "Cyber Security & VAPT",
    badge: "Industry Certified Track",
    duration: "2 Days • 16 Hours Bootcamp",
    deliveryMode: "On-Campus Lab / Live Online",
    targetAudience: "Cybersecurity Enthusiasts, IT Staff, Engineering Students",
    bannerImage: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80",
    tagline: "Practical offensive ethical hacking and defensive penetration testing. Master OWASP Top 10 web exploits, Wireshark packet analysis, and SOC Splunk threat hunting.",
    certificateCode: "JCRM-CERT-2026-SEC42",
    keyGains: [
      "Perform Ethical Hacking & Network Reconnaissance using Nmap & Nessus",
      "Audit Web Applications against OWASP Top 10 vulnerabilities (SQLi, XSS, CSRF)",
      "Analyze network traffic packets & hunt malware artifacts with Wireshark",
      "Configure Security Information and Event Management (SIEM) with Splunk",
      "Write professional VAPT Audit Reports & Remediation Checklists",
      "Hands-on CTF (Capture The Flag) Hacking Challenge Competition",
      "Receive Verified JCRM Cybersecurity Workshop Certificate",
      "Career roadmap guidance for CEH & CompTIA Security+ certifications"
    ],
    curriculumHighlights: [
      {
        session: "Day 1 - Morning",
        title: "Session 1: Network Reconnaissance & Vulnerability Assessment",
        topics: [
          "OSI & TCP/IP Security Architecture and Port Scanning",
          "Active & Passive Information Gathering with Nmap & Maltego",
          "Automated Vulnerability Scanning with Nessus & Nikto",
          "Hands-on Lab: Mapping Target Network Attack Surfaces"
        ]
      },
      {
        session: "Day 1 - Afternoon",
        title: "Session 2: OWASP Top 10 Web Application Exploitation",
        topics: [
          "SQL Injection (SQLi) & Database Exfiltration Techniques",
          "Cross-Site Scripting (XSS) & Session Hijacking Exploits",
          "Burp Suite Professional Proxy Workflows & API Hacking",
          "Hands-on Lab: Penetration Testing Vulnerable Web Applications"
        ]
      },
      {
        session: "Day 2 - Morning",
        title: "Session 3: Network Packet Triage & SOC Operations in Splunk",
        topics: [
          "Deep Packet Inspection & Wireshark Pcap Analysis",
          "Malware Communication Triage & Reverse Engineering Basics",
          "Splunk SIEM Dashboards & Real-time Alert Rule Creation",
          "Hands-on Lab: Investigating Live Cyber Threat Incidents"
        ]
      },
      {
        session: "Day 2 - Afternoon",
        title: "Session 4: Live CTF Hackathon & Defensive Security Blueprint",
        topics: [
          "Zero-Trust Network Architecture & Identity Access Management (IAM)",
          "Authoring Court-Admissible VAPT Security Reports",
          "Live Capture The Flag (CTF) Cyber Challenge Competition",
          "Certificate Award Ceremony & Industry Mentorship Session"
        ]
      }
    ]
  },
  {
    id: "cloud-devops-workshop",
    title: "Cloud Native DevOps, Kubernetes & IaC Automation",
    domain: "Cloud & DevOps Engineering",
    badge: "Enterprise Industry Track",
    duration: "2 Days • 16 Hours Bootcamp",
    deliveryMode: "On-Campus / Live Online",
    targetAudience: "DevOps Engineers, Cloud Developers, CS/IT Students",
    bannerImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
    tagline: "Accelerate software delivery with Docker containerization, Kubernetes EKS orchestration, Infrastructure as Code with Terraform, and GitHub Actions CI/CD pipelines.",
    certificateCode: "JCRM-CERT-2026-DO77",
    keyGains: [
      "Containerize complex multi-service applications using Docker & Compose",
      "Orchestrate microservices with Kubernetes clusters, Helm & ArgoCD",
      "Provision declarative AWS cloud infrastructure using Terraform HCL",
      "Build automated CI/CD deployment pipelines with GitHub Actions",
      "Monitor cluster health & metrics with Prometheus and Grafana dashboards",
      "Practice Site Reliability Engineering (SRE) incident management",
      "Receive Verified JCRM Cloud DevOps Workshop Certificate",
      "Complete reusable DevOps GitHub project repository for portfolio"
    ],
    curriculumHighlights: [
      {
        session: "Day 1 - Morning",
        title: "Session 1: Docker Containerization & Microservices Packaging",
        topics: [
          "Docker Engine Architecture & Multi-Stage Image Builds",
          "Container Storage Volumes & Bridge Networking",
          "Docker Compose for Multi-Container Web Applications",
          "Hands-on Lab: Packaging Full-Stack Apps into Microservices"
        ]
      },
      {
        session: "Day 1 - Afternoon",
        title: "Session 2: Kubernetes Orchestration & Cluster Management",
        topics: [
          "Kubernetes Architecture: Pods, Deployments, Services & Ingress",
          "Helm Package Manager & Configuration Management",
          "GitOps Continuous Deployment using ArgoCD",
          "Hands-on Lab: Deploying Microservices to Kubernetes Cluster"
        ]
      },
      {
        session: "Day 2 - Morning",
        title: "Session 3: Infrastructure as Code (Terraform) on AWS",
        topics: [
          "Terraform HCL Syntax, State Management & Remote Backends",
          "Provisioning AWS VPC, EC2, EKS & RDS Infrastructure",
          "Modularizing Terraform Infrastructure Blueprints",
          "Hands-on Lab: 1-Click Automated AWS Cloud Provisioning"
        ]
      },
      {
        session: "Day 2 - Afternoon",
        title: "Session 4: GitHub Actions CI/CD & Enterprise Monitoring",
        topics: [
          "Writing Automated GitHub Actions Pipelines (Build, Test, Deploy)",
          "Prometheus Metrics Scraping & Grafana Visual Dashboards",
          "Automated Zero-Downtime Rolling Deployment Strategies",
          "Certificate Distribution & SRE Career Guidance"
        ]
      }
    ]
  },
  {
    id: "data-engineering-workshop",
    title: "Data Engineering, BigData Analytics & PySpark",
    domain: "Data Engineering & Analytics",
    badge: "High Growth Domain",
    duration: "2 Days • 16 Hours Bootcamp",
    deliveryMode: "On-Campus / Live Online",
    targetAudience: "Data Engineers, Analytics Aspirants, CS/Math Students",
    bannerImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
    tagline: "Build enterprise ETL data pipelines, wrangle massive datasets with PySpark, write advanced analytical SQL queries, and publish executive Power BI dashboards.",
    certificateCode: "JCRM-CERT-2026-DE31",
    keyGains: [
      "Design scalable Batch & Streaming Data Pipelines using Apache Spark (PySpark)",
      "Write complex SQL aggregations, window functions & CTEs for analytics",
      "Process large-scale data warehouses in Google BigQuery & Snowflake",
      "Build interactive executive dashboards using Microsoft Power BI & Tableau",
      "Automate data quality checks & ETL pipeline orchestration",
      "Hands-on analytics project on real-world multi-gigabyte datasets",
      "Receive Verified JCRM Data Engineering Workshop Certificate",
      "Post-workshop data engineering interview prep guide"
    ],
    curriculumHighlights: [
      {
        session: "Day 1 - Morning",
        title: "Session 1: Advanced SQL for Analytics & Data Wrangling",
        topics: [
          "Complex SQL Aggregations, Window Functions (RANK, DENSE_RANK, LEAD, LAG)",
          "Common Table Expressions (CTEs) & Subquery Optimization",
          "Data Cleaning, Missing Data Imputation & Schema Validation",
          "Hands-on Lab: Analyzing 1M+ Row E-Commerce Dataset"
        ]
      },
      {
        session: "Day 1 - Afternoon",
        title: "Session 2: PySpark Distributed Data Processing",
        topics: [
          "Apache Spark Architecture & RDD vs DataFrame API",
          "Distributed Transformations, Actions & Lazy Evaluation",
          "PySpark SQL Queries & Data Ingestion from S3 / GCS",
          "Hands-on Lab: Building Distributed BigData Processing Pipeline"
        ]
      },
      {
        session: "Day 2 - Morning",
        title: "Session 3: Data Warehousing (BigQuery / Snowflake) & Data Modeling",
        topics: [
          "Star Schema & Snowflake Schema Data Modeling Concepts",
          "Partitioning & Clustering Strategies in Cloud Data Warehouses",
          "ETL vs ELT Architecture & Automated Data Pipelines",
          "Hands-on Lab: Ingesting & Querying Cloud Data Lakes"
        ]
      },
      {
        session: "Day 2 - Afternoon",
        title: "Session 4: Power BI Executive Dashboards & Portfolio Showcase",
        topics: [
          "Power BI Data Modeling, Relationships & DAX Calculations",
          "Interactive Dashboard Design & Executive Data Storytelling",
          "Automated Scheduled Refresh & Report Publishing",
          "Certificate Distribution & Data Engineering Placement Insights"
        ]
      }
    ]
  },
  {
    id: "fullstack-erp-workshop",
    title: "Full-Stack Next.js 15, React 19 & Enterprise ERP Architecture",
    domain: "Full-Stack & Web Architecture",
    badge: "Hands-on Product Building",
    duration: "2 Days • 16 Hours Bootcamp",
    deliveryMode: "On-Campus / Live Online",
    targetAudience: "Web Developers, Software Engineers, CS/IT Students",
    bannerImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
    tagline: "Build production-grade full-stack web applications and modular ERP systems using React 19, Next.js 15 App Router, TypeScript, Tailwind CSS, and Prisma ORM.",
    certificateCode: "JCRM-CERT-2026-FS19",
    keyGains: [
      "Master Next.js 15 App Router, React Server Components (RSC) & Server Actions",
      "Build modern responsive glassmorphism interfaces using Tailwind CSS",
      "Design relational database ORM schemas with Prisma & PostgreSQL",
      "Implement JWT OAuth2 authentication, role-based access & middleware",
      "Architect modular self-customizable ERP software components",
      "Deploy scalable full-stack applications to Vercel & AWS",
      "Receive Verified JCRM Full-Stack Workshop Certificate",
      "Complete codebase access to production-grade ERP starter kit"
    ],
    curriculumHighlights: [
      {
        session: "Day 1 - Morning",
        title: "Session 1: Next.js 15 App Router & React 19 Core Concepts",
        topics: [
          "React 19 Server Components (RSC) vs Client Components",
          "Next.js App Router Layouts, Nested Routes & Dynamic Parameters",
          "Tailwind CSS Glassmorphism Design Token Systems",
          "Hands-on Lab: Building Modern Interactive Dashboard UI"
        ]
      },
      {
        session: "Day 1 - Afternoon",
        title: "Session 2: Backend Server Actions & Database ORM (Prisma)",
        topics: [
          "Next.js Server Actions, Mutations & Form Validations (Zod)",
          "Prisma ORM Database Schema Modeling & Migration Workflows",
          "PostgreSQL Relational Queries, Indexes & Foreign Keys",
          "Hands-on Lab: Building Full-Stack CRUD & API Services"
        ]
      },
      {
        session: "Day 2 - Morning",
        title: "Session 3: Authentication, Security & Modular ERP Architecture",
        topics: [
          "NextAuth.js OAuth2 & JWT Token Session Management",
          "Role-Based Access Control (RBAC) & Middleware Protection",
          "Architecting Self-Customizable Modular ERP Components",
          "Hands-on Lab: Building Role-Protected Enterprise ERP Modules"
        ]
      },
      {
        session: "Day 2 - Afternoon",
        title: "Session 4: Live Deployment, Performance Optimization & Certification",
        topics: [
          "Static Generation (SSG), Server Rendering (SSR) & Caching",
          "1-Click Automated Vercel & Cloudflare CDN Deployment",
          "Project Hackathon Code Review & Industry Mentorship",
          "Certificate Distribution & Full-Stack Career Roadmap"
        ]
      }
    ]
  }
];

export function getWorkshopById(id: string): Workshop | undefined {
  return WORKSHOPS.find((w) => w.id === id);
}
