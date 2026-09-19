import Link from "next/link";
import CurriculumAccordion from "./CurriculumAccordion";
import { prisma } from "@/lib/prisma";

export const dynamicParams = true;

export async function generateStaticParams() {
  const staticList = [
    { course_id: 'frontend-development' },
    { course_id: 'backend-development' },
    { course_id: 'ai-machine-learning' },
    { course_id: 'data-science' },
    { course_id: 'cyber-security' },
    { course_id: 'forensic-science' },
    { course_id: 'cloud-devops' },
    { course_id: 'qa-automation' },
    { course_id: 'digital-marketing' },
    { course_id: 'zen-ai' }
  ];

  try {
    const dbCourses = await prisma.course.findMany({
      select: { id: true, title: true }
    });
    const dbParams = dbCourses.flatMap(c => {
      const slug = c.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      return [{ course_id: c.id }, { course_id: slug }];
    });
    return [...staticList, ...dbParams];
  } catch {
    return staticList;
  }
}

const COURSES_DATA: Record<string, any> = {
  "frontend-development": {
    title: "Frontend Development",
    badge: "100% Placement Track",
    level: "Beginner to Advanced",
    instructor: "Aisha Verma",
    instructorRole: "Senior Frontend Lead @ JCRM Technologies",
    rating: "4.9",
    ratingsCount: "1,840",
    studentsCount: "14,250",
    lastUpdated: "Jan 2026",
    price: "₹14,999",
    duration: "3 Months • 120 Hours",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
    description: "Master modern responsive web development with React, TypeScript, Next.js, and Tailwind CSS. Learn to build production-grade UI design systems, master state management with Redux Toolkit, and deploy server-rendered web applications.",
    whatYouLearn: [
      "Master HTML5, CSS3, JavaScript ES6+, and TypeScript from ground up",
      "Build high-performance web applications with React 19 & Next.js 15 App Router",
      "Style modern interfaces with Tailwind CSS and Framer Motion animations",
      "Manage client & server state using Redux Toolkit, React Query, and Context API",
      "Implement Responsive Design, Web Accessibility (a11y), and SEO best practices",
      "Integrate RESTful & GraphQL APIs with client-side caching strategies",
      "Perform unit & component testing using Jest, React Testing Library, and Cypress",
      "Deploy scalable web apps to Vercel, AWS S3, and Cloudflare CDN"
    ],
    curriculum: [
      {
        title: "Module 1: HTML5, Modern CSS3 & JavaScript (ES6+)",
        expanded: true,
        topics: [
          "Semantic HTML Elements & Accessibility Standards",
          "CSS Grid, Flexbox & Responsive Layout Engineering",
          "JavaScript ES6+ Syntax, Closures & Async Programming",
          "DOM Manipulation, LocalStorage & Web APIs"
        ]
      },
      {
        title: "Module 2: TypeScript & Modern React 19 Essentials",
        expanded: false,
        topics: [
          "TypeScript Types, Interfaces & Generics",
          "React 19 Components, Props, State & Hooks",
          "Form Handling with React Hook Form & Zod Validation",
          "Client-side Routing & Component Lifecycle"
        ]
      },
      {
        title: "Module 3: Next.js 15 App Router & Server Architecture",
        expanded: false,
        topics: [
          "Next.js App Router Directory Architecture",
          "Server Components (RSC) vs Client Components",
          "Server Actions, Mutations & Data Fetching",
          "SEO Optimization, Metadata & Performance Tuning"
        ]
      },
      {
        title: "Module 4: Enterprise State Management & Live ERP Project",
        expanded: false,
        topics: [
          "Redux Toolkit & React Query Integration",
          "Complex Form Workflows & Data Pipelines",
          "Full-Stack ERP Frontend Integration",
          "Vercel & AWS Production Cloud Deployment"
        ]
      }
    ]
  },
  "backend-development": {
    title: "Backend Development",
    badge: "High Demand Track",
    level: "Intermediate to Advanced",
    instructor: "Gautam Sahu",
    instructorRole: "Senior Backend Architect @ LTI Mindtree",
    rating: "4.9",
    ratingsCount: "2,150",
    studentsCount: "18,400",
    lastUpdated: "Jan 2026",
    price: "₹16,999",
    duration: "4 Months • 140 Hours",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
    description: "Master enterprise backend engineering using Java Spring Boot, Node.js, and Microservices. Learn distributed systems design, database ORMs, Kafka event-driven architectures, and high-concurrency API performance tuning.",
    whatYouLearn: [
      "Design and implement production-ready microservices architecture",
      "Master Core Java, Spring Boot 3, Spring Security, and Node.js / Express",
      "Architect relational database schemas using PostgreSQL, MySQL, and Prisma / Hibernate",
      "Build high-throughput event-driven messaging with Apache Kafka and RabbitMQ",
      "Implement Redis caching, rate limiting, and JWT OAuth2 authentication",
      "Write clean RESTful & gRPC endpoints with OpenAPI/Swagger documentation",
      "Containerize microservices with Docker and orchestrate with Kubernetes",
      "Monitor backend health using Prometheus, Grafana, and ELK Stack logging"
    ],
    curriculum: [
      {
        title: "Module 1: Advanced Java / Node.js & OOP System Design",
        expanded: true,
        topics: [
          "Core Java 21 & Node.js Asynchronous Runtime",
          "Object-Oriented Design Patterns & SOLID Principles",
          "Data Structures & Algorithmic Problem Solving",
          "Git Workflow & Development Environment Setup"
        ]
      },
      {
        title: "Module 2: Spring Boot 3 / Express Microservices & REST APIs",
        expanded: false,
        topics: [
          "Spring Boot 3 / Express Web Framework Setup",
          "RESTful API Architecture & gRPC Service Design",
          "Spring Security, JWT & OAuth2 Authentication",
          "API Documentation with Swagger / OpenAPI"
        ]
      },
      {
        title: "Module 3: PostgreSQL Database Design & Caching",
        expanded: false,
        topics: [
          "Relational Database Modeling & Normalization",
          "Complex SQL Queries, Indexing & Query Optimization",
          "ORM Integration (Prisma / Spring Data JPA)",
          "High-Performance Redis Caching & Rate Limiting"
        ]
      },
      {
        title: "Module 4: Event-Driven Kafka Messaging & Cloud Deployment",
        expanded: false,
        topics: [
          "Apache Kafka Event Streaming & Message Queues",
          "Microservices Service Discovery & API Gateways",
          "Docker Containerization & Kubernetes Orchestration",
          "Monitoring with Prometheus, Grafana & Cloud Log Tracing"
        ]
      }
    ]
  },
  "ai-machine-learning": {
    title: "AI & Machine Learning",
    badge: "Flagship AI Track",
    level: "Advanced",
    instructor: "Dr. Sarah Jenkins",
    instructorRole: "AI Research Lead & Ex-Google AI Scientist",
    rating: "4.9",
    ratingsCount: "1,920",
    studentsCount: "11,800",
    lastUpdated: "Jan 2026",
    price: "₹19,999",
    duration: "4 Months • 150 Hours",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80",
    description: "Master Deep Learning, Computer Vision, Natural Language Processing (NLP), and Generative AI. Build custom LLM applications, RAG pipelines, vector search databases, and deploy MLOps inference endpoints.",
    whatYouLearn: [
      "Master Python for Data Science (NumPy, Pandas, Matplotlib, Scikit-Learn)",
      "Build Deep Learning models with PyTorch and TensorFlow / Keras",
      "Train Transformers, Convolutional Networks (CNNs), and Recurrent Neural Nets (RNNs)",
      "Develop Generative AI apps with LangChain, LlamaIndex, and OpenAI / Gemini APIs",
      "Implement RAG (Retrieval-Augmented Generation) with Pinecone & Qdrant vector databases",
      "Fine-tune Open-Source Large Language Models (LLaMA 3, Mistral, Gemma)",
      "Deploy model inference endpoints using FastAPI, TorchServe, and Triton Server",
      "Establish MLOps pipelines with MLflow, DVC, and automated model tracking"
    ],
    curriculum: [
      {
        title: "Module 1: Mathematical Foundations & Scikit-Learn ML Models",
        expanded: true,
        topics: [
          "Linear Algebra, Calculus & Probability for Machine Learning",
          "Data Preprocessing, Feature Engineering & Scaling",
          "Supervised Learning: Regression & Classification",
          "Unsupervised Learning: Clustering & Dimensionality Reduction"
        ]
      },
      {
        title: "Module 2: PyTorch Deep Learning & Computer Vision",
        expanded: false,
        topics: [
          "PyTorch Tensors, Autograd & Neural Network Training",
          "Convolutional Neural Networks (CNNs) for Vision",
          "Object Detection & Image Segmentation Architecture",
          "Transfer Learning with Pre-trained Vision Models"
        ]
      },
      {
        title: "Module 3: Natural Language Processing & Transformers",
        expanded: false,
        topics: [
          "Text Tokenization, Word Embeddings & Recurrent Neural Nets",
          "Transformer Architecture: Self-Attention & Multi-Head Attention",
          "BERT, RoBERTa & Fine-tuning Sequence Classifiers",
          "Sequence-to-Sequence Generation & Translation"
        ]
      },
      {
        title: "Module 4: Generative AI, RAG Systems & MLOps",
        expanded: false,
        topics: [
          "Generative AI Models & Open Source LLMs (LLaMA 3, Gemma)",
          "Retrieval-Augmented Generation (RAG) with Vector Databases",
          "LangChain & LlamaIndex Agentic Workflows",
          "MLOps Model Deployment with FastAPI, Triton & MLflow"
        ]
      }
    ]
  },
  "data-science": {
    title: "Data Science",
    badge: "100% Placement Track",
    level: "Intermediate",
    instructor: "Dr. Rajesh Verma",
    instructorRole: "Data Analytics Director & Healthcare Analytics Expert",
    rating: "4.8",
    ratingsCount: "1,640",
    studentsCount: "13,600",
    lastUpdated: "Jan 2026",
    price: "₹15,999",
    duration: "3.5 Months • 130 Hours",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
    description: "Extract strategic business insights through advanced statistical analysis, predictive modeling, big data queries, and executive dashboards using Python, SQL, Tableau, and Power BI.",
    whatYouLearn: [
      "Master exploratory data analysis (EDA) with Python Pandas & Seaborn",
      "Write complex SQL queries, window functions, and database transformations",
      "Build predictive machine learning models for classification, regression & clustering",
      "Design interactive executive dashboards with Tableau and Microsoft Power BI",
      "Apply hypothesis testing, A/B testing methodologies, and probability distributions",
      "Perform automated web scraping and ETL data pipeline processing",
      "Process large-scale data with PySpark and BigQuery data warehouses",
      "Present data-driven insights to executive stakeholders with business acumen"
    ],
    curriculum: [
      {
        title: "Module 1: Advanced SQL for Analytics & Data Wrangling",
        expanded: true,
        topics: [
          "Complex SQL Aggregations, Window Functions & CTEs",
          "Data Cleaning, Transformation & Quality Checks",
          "Python Pandas DataFrames & NumPy Array Operations",
          "ETL Data Pipeline Processing & Automation"
        ]
      },
      {
        title: "Module 2: Python Data Science Ecosystem & Statistics",
        expanded: false,
        topics: [
          "Descriptive & Inferential Statistical Analysis",
          "Hypothesis Testing, A/B Testing & Confidence Intervals",
          "Exploratory Data Analysis (EDA) & Data Visualization",
          "Handling Imbalanced Datasets & Missing Data Mitigation"
        ]
      },
      {
        title: "Module 3: Applied Predictive ML & Time-Series Forecasting",
        expanded: false,
        topics: [
          "Predictive Analytics with Scikit-Learn",
          "Time-Series Analysis: ARIMA, Prophet & Trend Models",
          "Feature Selection & Model Performance Metrics",
          "Customer Churn & Revenue Prediction Systems"
        ]
      },
      {
        title: "Module 4: Business Intelligence Dashboards (Tableau & Power BI)",
        expanded: false,
        topics: [
          "Tableau Dashboard Design & Calculated Fields",
          "Power BI Data Modeling & DAX Expressions",
          "Interactive Executive Reporting & Data Storytelling",
          "BigData Analytics with PySpark & Google BigQuery"
        ]
      }
    ]
  },
  "cyber-security": {
    title: "Cyber Security",
    badge: "Critical Industry Track",
    level: "Advanced",
    instructor: "Vikram Malhotra",
    instructorRole: "Senior Security Operations Lead & Certified Ethical Hacker",
    rating: "4.9",
    ratingsCount: "1,420",
    studentsCount: "9,750",
    lastUpdated: "Jan 2026",
    price: "₹17,999",
    duration: "4 Months • 140 Hours",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80",
    description: "Master offensive and defensive cybersecurity. Learn network vulnerability assessment & penetration testing (VAPT), SOC monitoring with Splunk, ethical hacking tools, and cloud infrastructure defense.",
    whatYouLearn: [
      "Perform Ethical Hacking, Network Reconnaissance, and Port Scanning (Nmap, Wireshark)",
      "Execute Web Application Penetration Testing following OWASP Top 10 guidelines",
      "Configure Security Information and Event Management (SIEM) with Splunk & Elastic SOC",
      "Analyze malware, reverse engineer binaries, and perform incident response triage",
      "Implement Identity & Access Management (IAM), Zero-Trust Architecture, and Cryptography",
      "Conduct Wireless Network Attacks, MitM Interception, and Social Engineering audits",
      "Secure AWS, Azure & Cloud Native Kubernetes infrastructure against cyber threats",
      "Prepare for CEH (Certified Ethical Hacker) & CompTIA Security+ certifications"
    ],
    curriculum: [
      {
        title: "Module 1: Networking Fundamentals & Packet Triage",
        expanded: true,
        topics: [
          "TCP/IP Protocol Suite, OSI Model & Port Architecture",
          "Network Packet Capture & Analysis using Wireshark",
          "Router & Firewall Security Configurations",
          "Vulnerability Scanning with Nmap & Nessus"
        ]
      },
      {
        title: "Module 2: OWASP Top 10 Web Application Penetration Testing",
        expanded: false,
        topics: [
          "SQL Injection, Cross-Site Scripting (XSS) & CSRF Exploitation",
          "Authentication & Session Management Attacks",
          "API Security Auditing & Burp Suite Professional Workflow",
          "Vulnerability Assessment & Penetration Testing (VAPT) Reporting"
        ]
      },
      {
        title: "Module 3: SOC Operations, SIEM Log Analysis & Threat Hunting",
        expanded: false,
        topics: [
          "Security Operations Center (SOC) Workflows",
          "SIEM Monitoring & Rule Engine Setup in Splunk",
          "Malware Triage & Reverse Engineering Basics",
          "Incident Response & Threat Intelligence Gathering"
        ]
      },
      {
        title: "Module 4: Cloud Security Defense, IAM & Ethical Hacking Capstone",
        expanded: false,
        topics: [
          "AWS & Azure Cloud Security Configurations",
          "Zero-Trust Network Architecture & IAM Policy Enforcement",
          "Wireless Network Defense & Social Engineering Audits",
          "Ethical Hacking Capstone Project & Certification Prep"
        ]
      }
    ]
  },
  "forensic-science": {
    title: "Forensic Science",
    badge: "Specialized Track",
    level: "Specialized",
    instructor: "Dr. Ananya Roy",
    instructorRole: "Digital Forensics Lead & Forensic Consultant",
    rating: "4.8",
    ratingsCount: "1,150",
    studentsCount: "7,400",
    lastUpdated: "Jan 2026",
    price: "₹18,999",
    duration: "4 Months • 135 Hours",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
    description: "Specialized training in digital forensics, cybercrime investigation methodologies, disk & memory forensic analysis, mobile device extraction, and chain of custody legal evidence preparation.",
    whatYouLearn: [
      "Master Digital Forensic Incident Response (DFIR) methodologies and legal standards",
      "Perform forensic disk imaging and data recovery using EnCase, FTK Imager & Autopsy",
      "Analyze volatile system memory (RAM forensics) using Volatility Framework",
      "Extract and reconstruct mobile device forensic artifacts (Android & iOS)",
      "Conduct Network Forensics, packet analysis, and email header tracking",
      "Investigate ransomware, log manipulation, and anti-forensics techniques",
      "Maintain legal Chain of Custody and author court-admissible expert witness reports",
      "Prepare for Certified Forensic Computer Examiner (CFCE) standards"
    ],
    curriculum: [
      {
        title: "Module 1: Principles of Digital Forensics & Chain of Custody",
        expanded: true,
        topics: [
          "Digital Forensic Incident Response (DFIR) Standards",
          "Legal Admissibility & Evidence Handling Protocols",
          "Chain of Custody Documentation & Evidence Hashing",
          "Crime Scene Digital Evidence Preservation"
        ]
      },
      {
        title: "Module 2: Disk Forensics & Data Carving",
        expanded: false,
        topics: [
          "NTFS, FAT32 & ext4 File System Analysis",
          "Forensic Disk Imaging using FTK Imager & EnCase",
          "Deleted File Recovery & Unallocated Space Carving",
          "Registry & System Log Forensic Analysis"
        ]
      },
      {
        title: "Module 3: Volatile Memory (RAM) Analysis & Anti-Forensics",
        expanded: false,
        topics: [
          "RAM Memory Acquisition & Dump Analysis",
          "Volatility Framework & Process Memory Inspection",
          "Malware Artifact Extraction & Anti-Forensics Detection",
          "Network Traffic Reconstruction & Log Correlation"
        ]
      },
      {
        title: "Module 4: Mobile & Network Forensics + Court Testimony",
        expanded: false,
        topics: [
          "Android & iOS Mobile Artifact Extraction",
          "Browser & Email Header Investigation",
          "Expert Witness Report Authoring & Legal Defense Strategy",
          "Comprehensive Forensic Case Simulation"
        ]
      }
    ]
  },
  "cloud-devops": {
    title: "Cloud & DevOps",
    badge: "100% Placement Track",
    level: "Intermediate",
    instructor: "Shwati Singh",
    instructorRole: "Senior DevOps Engineer @ Tech Solutions",
    rating: "4.9",
    ratingsCount: "2,310",
    studentsCount: "16,800",
    lastUpdated: "Jan 2026",
    price: "₹16,999",
    duration: "4 Months • 140 Hours",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
    description: "Master DevOps engineering, cloud infrastructure automation, CI/CD pipelines, container orchestration, and Infrastructure as Code using AWS, Docker, Kubernetes, Terraform, and GitHub Actions.",
    whatYouLearn: [
      "Master Linux System Administration, Bash Shell Scripting & Networking Fundamentals",
      "Architect cloud infrastructure on AWS (EC2, S3, RDS, VPC, IAM, Route 53)",
      "Containerize applications with Docker multi-stage builds and Docker Compose",
      "Orchestrate microservices with Kubernetes (EKS), Helm charts, and ingress controllers",
      "Build automated CI/CD pipelines using GitHub Actions, Jenkins & GitLab CI",
      "Provision declarative infrastructure using Terraform and Ansible automation",
      "Monitor cluster health with Prometheus, Grafana, and Datadog APM",
      "Implement Site Reliability Engineering (SRE) practices and GitOps with ArgoCD"
    ],
    curriculum: [
      {
        title: "Module 1: Linux Administration & AWS Architecture",
        expanded: true,
        topics: [
          "Linux Command Line, Shell Scripting & File Permissions",
          "AWS Cloud Services: EC2, S3, RDS, VPC & IAM",
          "Cloud Networking, Subnets & Security Groups",
          "System Monitoring & Resource Optimization"
        ]
      },
      {
        title: "Module 2: Docker Containerization & Microservices",
        expanded: false,
        topics: [
          "Docker Engine Architecture, Images & Containers",
          "Writing Efficient Multi-Stage Dockerfiles",
          "Docker Compose Multi-Container Applications",
          "Container Registry Management (ECR & Docker Hub)"
        ]
      },
      {
        title: "Module 3: Kubernetes Orchestration & GitOps",
        expanded: false,
        topics: [
          "Kubernetes Architecture: Pods, Services, Deployments & Ingress",
          "Cluster Management with kubectl & Helm Charts",
          "GitOps Continuous Deployment with ArgoCD",
          "Storage Management (PV/PVC) & ConfigMaps/Secrets"
        ]
      },
      {
        title: "Module 4: Terraform Infrastructure as Code & CI/CD Pipelines",
        expanded: false,
        topics: [
          "Terraform State Management, Modules & HCL Syntax",
          "Building CI/CD Pipelines with GitHub Actions & Jenkins",
          "Prometheus & Grafana Enterprise Cloud Monitoring",
          "Site Reliability Engineering (SRE) & Incident Response"
        ]
      }
    ]
  },
  "qa-automation": {
    title: "QA Automation",
    badge: "Job Ready Track",
    level: "Beginner",
    instructor: "Pronay Dey",
    instructorRole: "QA Automation Architect @ Apexon",
    rating: "4.8",
    ratingsCount: "1,280",
    studentsCount: "10,200",
    lastUpdated: "Jan 2026",
    price: "₹13,999",
    duration: "3 Months • 110 Hours",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80",
    description: "Master automated software quality assurance. Build robust test automation frameworks for web, API, and mobile applications using Java, Selenium WebDriver, Cypress, Playwright, and TestNG.",
    whatYouLearn: [
      "Master Core Java / JavaScript for test automation framework development",
      "Build Page Object Model (POM) automation frameworks with Selenium WebDriver",
      "Master modern end-to-end web testing using Cypress and Playwright",
      "Automate REST API testing using RestAssured, Postman, and Newman CLI",
      "Configure TestNG / JUnit for parallel test execution andExtent Reports generation",
      "Integrate test suites into Jenkins & GitHub Actions CI/CD pipelines",
      "Perform Mobile Automation testing for Android & iOS using Appium",
      "Practice Agile QA methodologies, Jira bug tracking, and BDD with Cucumber"
    ],
    curriculum: [
      {
        title: "Module 1: Core Java / JS & QA Fundamentals",
        expanded: true,
        topics: [
          "Software Testing Lifecycle (STLC) & Agile QA Roles",
          "Object-Oriented Programming for Test Automation",
          "Test Case Design & Bug Tracking in Jira",
          "Environment Setup & IDE Configuration"
        ]
      },
      {
        title: "Module 2: Selenium WebDriver & POM Framework",
        expanded: false,
        topics: [
          "Selenium Element Locators (XPath, CSS Selectors)",
          "Page Object Model (POM) Design Pattern",
          "Handling Dynamic Web Elements, Alerts & Frames",
          "TestNG / JUnit Test Execution & Extent Reporting"
        ]
      },
      {
        title: "Module 3: Cypress, Playwright & Modern E2E Testing",
        expanded: false,
        topics: [
          "Cypress Test Runner Setup & Assertions",
          "Playwright Multi-Browser End-to-End Automation",
          "Visual Regression Testing & Component Testing",
          "Headless Browser Automation in CI Pipelines"
        ]
      },
      {
        title: "Module 4: REST API Automation & CI/CD Integration",
        expanded: false,
        topics: [
          "RestAssured Framework for Java API Testing",
          "Postman Collections, Environment Variables & Newman CLI",
          "Parallel Test Execution & Cross-Browser Automation",
          "Integrating Test Suites into Jenkins & GitHub Actions"
        ]
      }
    ]
  },
  "digital-marketing": {
    title: "Digital Marketing",
    badge: "Fast Track Career",
    level: "Beginner",
    instructor: "Neha Sharma",
    instructorRole: "Growth & Performance Marketing Specialist",
    rating: "4.7",
    ratingsCount: "1,520",
    studentsCount: "12,100",
    lastUpdated: "Jan 2026",
    price: "₹12,999",
    duration: "2.5 Months • 90 Hours",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    description: "Master performance marketing, Search Engine Optimization (SEO), paid acquisition (Google Ads & Meta Ads), conversion rate optimization (CRO), and growth analytics to scale digital businesses.",
    whatYouLearn: [
      "Master On-Page, Off-Page, Technical SEO, and Keyword Strategy (Ahrefs, SEMrush)",
      "Create high-converting Google Search, Display, and Video PPC ad campaigns",
      "Execute targeted Meta (Facebook & Instagram) paid acquisition funnels",
      "Perform Conversion Rate Optimization (CRO) and A/B split landing page testing",
      "Analyze user journeys using Google Analytics 4 (GA4) & Google Tag Manager",
      "Develop content marketing strategies, email marketing automation, and copywriting",
      "Manage social media brand presences and influencer campaign partnerships",
      "Calculate Customer Acquisition Cost (CAC), Return on Ad Spend (ROAS), and LTV"
    ],
    curriculum: [
      {
        title: "Module 1: Fundamentals of Digital Growth & Technical SEO",
        expanded: true,
        topics: [
          "Search Engine Optimization (SEO) On-Page & Technical Audits",
          "Keyword Research & Competitor Analysis (SEMrush / Ahrefs)",
          "Content Strategy & Copywriting for Conversions",
          "Website Architecture & Mobile Optimization"
        ]
      },
      {
        title: "Module 2: Performance Marketing — Google Ads & SEM",
        expanded: false,
        topics: [
          "Google Search, Display & Video PPC Ad Setup",
          "Bidding Strategies, Quality Score & Keyword Match Types",
          "Negative Keywords & Ad Extensions Optimization",
          "Remarketing & Audience Targeting Funnels"
        ]
      },
      {
        title: "Module 3: Meta Paid Social Acquisition & Copywriting",
        expanded: false,
        topics: [
          "Meta Business Suite & Ads Manager Setup",
          "Facebook & Instagram Campaign Structure & Ad Creatives",
          "Pixel Integration & Custom Conversions Tracking",
          "A/B Creative Testing & Ad Copy Optimization"
        ]
      },
      {
        title: "Module 4: GA4 Analytics, CRO & Email Funnels",
        expanded: false,
        topics: [
          "Google Analytics 4 (GA4) Custom Events & Funnel Tracking",
          "Google Tag Manager (GTM) Event Implementation",
          "Landing Page Conversion Rate Optimization (CRO)",
          "Email Marketing Automation & Customer Lifecycle Nurturing"
        ]
      }
    ]
  },
  "zen-ai": {
    title: "Zen AI",
    badge: "Next-Gen Flagship Track",
    level: "Advanced",
    instructor: "Rohan Verma",
    instructorRole: "Full-Stack AI Solutions Architect @ JCRM Labs",
    rating: "4.9",
    ratingsCount: "1,780",
    studentsCount: "8,900",
    lastUpdated: "Jan 2026",
    price: "₹21,999",
    duration: "4 Months • 160 Hours",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    description: "Cutting-edge artificial intelligence engineering using the Zen AI framework. Build autonomous multi-agent systems, intelligent tool-calling workflows, enterprise cognitive apps, and real-time AI agents.",
    whatYouLearn: [
      "Master the Zen AI framework core architecture and agent design patterns",
      "Build autonomous multi-agent workflows with tool-calling capabilities",
      "Implement memory persistence, stateful agent loops, and structured output parsing",
      "Integrate multi-modal LLM capabilities (Text, Vision, Code Generation, Audio)",
      "Build enterprise AI search engines using Hybrid Vector + Keyword Retrieval",
      "Develop custom AI agent tools for database querying, API execution, and code execution",
      "Secure AI deployments against prompt injection, data leakage, and jailbreak exploits",
      "Deploy scalable production AI Agent microservices using Docker & FastAPI"
    ],
    curriculum: [
      {
        title: "Module 1: Zen AI Framework & Core Architecture",
        expanded: true,
        topics: [
          "Zen AI Core Engine Concepts & Agent Lifecycle",
          "Stateful Agent Design & Prompt Structure",
          "Model Configuration & Provider Integration",
          "Structured Output Parsing & Validation"
        ]
      },
      {
        title: "Module 2: Multi-Agent Orchestration & Tool Calling",
        expanded: false,
        topics: [
          "Multi-Agent Collaboration Patterns (Swarm, Supervisor)",
          "Custom Tool Creation for Database & API Execution",
          "Dynamic Task Routing & Agent Delegation",
          "Error Handling & Self-Healing Agent Loops"
        ]
      },
      {
        title: "Module 3: Enterprise Memory & Hybrid Vector Search",
        expanded: false,
        topics: [
          "Short-term vs Long-term Vector Memory Architecture",
          "Hybrid Search (Dense Vector + BM25 Keyword Matching)",
          "Document Chunking & Knowledge Base Ingestion",
          "Context Window Management & Summarization"
        ]
      },
      {
        title: "Module 4: Production AI Security & ERP Integration",
        expanded: false,
        topics: [
          "Prompt Injection Defense & Guardrails Setup",
          "Scaling AI Agent Microservices with Docker & FastAPI",
          "Real-Time Enterprise ERP System Integration",
          "Latency Optimization & Token Cost Management"
        ]
      }
    ]
  }
};

export default async function CourseDetailPage({ params }: { params: Promise<{ course_id: string }> }) {
  const { course_id } = await params;
  
  // 1. Check if course exists in Database
  let dbCourse = null;
  try {
    dbCourse = await prisma.course.findUnique({
      where: { id: course_id }
    });
  } catch {
    // If not a valid ObjectId or other error, fallback to searching by slug or title
  }

  if (!dbCourse) {
    try {
      const allDbCourses = await prisma.course.findMany();
      dbCourse = allDbCourses.find(c => {
        const slug = c.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        return slug === course_id.toLowerCase() || c.id === course_id || c.title.toLowerCase() === course_id.toLowerCase();
      });
    } catch {
      // Prisma error fallback
    }
  }

  // Determine course data
  let course: any;

  if (dbCourse) {
    let parsedCurriculum: any[] = [];
    if (Array.isArray(dbCourse.curriculum)) {
      parsedCurriculum = dbCourse.curriculum;
    } else if (typeof dbCourse.curriculum === 'string') {
      try {
        parsedCurriculum = JSON.parse(dbCourse.curriculum);
      } catch {
        parsedCurriculum = [];
      }
    }

    if (!parsedCurriculum || parsedCurriculum.length === 0) {
      parsedCurriculum = [
        {
          title: `Module 1: Foundations of ${dbCourse.title}`,
          expanded: true,
          topics: [
            `Core Fundamentals & Overview of ${dbCourse.title}`,
            "Environment Setup & Tooling Configuration",
            "Essential Syntax, Data Structures & Architecture",
            "Hands-on Lab Exercises & Best Practices"
          ]
        },
        {
          title: `Module 2: Advanced ${dbCourse.title} & Industry Project`,
          expanded: false,
          topics: [
            "Advanced Design Patterns & Production Scalability",
            "Full-Stack Enterprise Integration Workflow",
            "Automated Testing, CI/CD Pipeline & Deployment",
            "Live Capstone Project & Mock Technical Interview"
          ]
        }
      ];
    }

    const whatYouLearn = (dbCourse.whatYouLearn && dbCourse.whatYouLearn.length > 0)
      ? dbCourse.whatYouLearn
      : [
          `Master core to advanced concepts in ${dbCourse.title}`,
          "Build production-grade real-world software applications",
          "Learn industry best practices from experienced tech mentors",
          "100% Placement assistance and dedicated mock interviews"
        ];

    const priceDisplay = typeof dbCourse.price === 'number'
      ? `₹${dbCourse.price.toLocaleString('en-IN')}`
      : String(dbCourse.price).startsWith('₹') ? dbCourse.price : `₹${dbCourse.price}`;

    course = {
      title: dbCourse.title,
      badge: dbCourse.badge || "100% Placement Track",
      level: dbCourse.level || "Beginner to Advanced",
      instructor: dbCourse.instructor || "JCRM Senior Tech Lead",
      instructorRole: dbCourse.instructorRole || "Senior Industry Practitioner",
      rating: "4.9",
      ratingsCount: "1,640",
      studentsCount: "12,500",
      lastUpdated: "Recently Updated",
      price: priceDisplay,
      duration: dbCourse.duration || "3 Months • 120 Hours",
      image: dbCourse.image || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
      description: dbCourse.description || `Master ${dbCourse.title} through hands-on project building and personalized 1-on-1 mentorship.`,
      whatYouLearn,
      curriculum: parsedCurriculum
    };
  } else if (COURSES_DATA[course_id]) {
    course = COURSES_DATA[course_id];
  } else {
    // Generic fallback for any unlisted course id
    course = {
      title: course_id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
      badge: "100% Placement Track",
      level: "Intermediate",
      instructor: "JCRM Senior Tech Lead",
      instructorRole: "Industry Expert Instructor",
      rating: "4.9",
      ratingsCount: "1,500",
      studentsCount: "12,000",
      lastUpdated: "Jan 2026",
      price: "₹14,999",
      duration: "3 Months • 120 Hours",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
      description: "Master industry-standard engineering tools and technologies through hands-on project building and personalized 1-on-1 mentorship.",
      whatYouLearn: [
        "Build production-grade real world applications",
        "Implement industry-standard architectural patterns",
        "Master core technologies and frameworks",
        "Receive 100% placement assistance & referral support"
      ],
      curriculum: [
        {
          title: "Module 1: Core Fundamentals & Environment Setup",
          expanded: true,
          topics: [
            "Core Principles & Setup",
            "Hands-on Implementation",
            "Enterprise Best Practices"
          ]
        }
      ]
    };
  }

  return (
    <div className="min-h-screen pt-32 pb-24 relative overflow-hidden bg-gradient-to-b from-blue-50/50 via-sky-50/20 to-transparent">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[#0055FF]/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Breadcrumb Navigation with Back Action */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-500">
            <Link href="/" className="hover:text-[#0055FF] transition-colors">Home</Link>
            <span>/</span>
            <Link href="/courses" className="hover:text-[#0055FF] transition-colors">Courses</Link>
            <span>/</span>
            <span className="text-[#0055FF] font-extrabold">{course.title}</span>
          </div>

          <Link
            href="/courses"
            className="text-xs sm:text-sm font-extrabold text-[#0055FF] hover:underline flex items-center gap-1.5"
          >
            ← Back to Course Catalog
          </Link>
        </div>

        {/* Hero Section Card */}
        <div className="p-8 sm:p-12 rounded-[36px] bg-white/85 backdrop-blur-2xl border border-white/90 shadow-[0_12px_45px_rgba(0,85,255,0.12),0_0_35px_rgba(255,255,255,0.9)] mb-12 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left 7 Cols - Course Details */}
            <div className="lg:col-span-7">
              <div className="flex flex-wrap gap-2.5 mb-6">
                <span className="px-3.5 py-1 text-xs font-extrabold rounded-full bg-[#0055FF] text-white shadow-xs">
                  {course.badge}
                </span>
                <span className="px-3.5 py-1 text-xs font-extrabold rounded-full bg-blue-50 text-[#0055FF] border border-blue-100">
                  {course.level}
                </span>
                <span className="px-3.5 py-1 text-xs font-extrabold rounded-full bg-slate-100 text-slate-700">
                  ⏱ {course.duration}
                </span>
              </div>

              <h1 className="heading-font text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight leading-tight">
                {course.title}
              </h1>

              <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed mb-8">
                {course.description}
              </p>

              {/* Stats & Meta */}
              <div className="flex flex-wrap items-center gap-6 text-xs sm:text-sm font-bold text-slate-700 mb-8 pt-6 border-t border-blue-100/80">
                <div className="flex items-center gap-2">
                  <div className="flex text-amber-400 text-base">★★★★★</div>
                  <span className="font-extrabold text-slate-900">{course.rating}</span>
                  <span className="text-slate-500 font-semibold">({course.ratingsCount} ratings)</span>
                </div>

                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#0055FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <span>{course.studentsCount} Students Enrolled</span>
                </div>

                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#0055FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Updated {course.lastUpdated}</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/contact"
                  className="px-8 py-4 rounded-2xl text-base font-extrabold text-white bg-[#0055FF] hover:bg-blue-600 shadow-xl hover:shadow-blue-500/30 hover:scale-105 transition-all flex items-center gap-2 cursor-pointer"
                >
                  Enroll Now — {course.price}
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>

                <Link
                  href="/contact"
                  className="px-8 py-4 rounded-2xl text-base font-extrabold text-slate-800 bg-white border border-blue-200 hover:bg-blue-50/80 transition-all flex items-center gap-2 shadow-xs cursor-pointer"
                >
                  Request Program Syllabus 📄
                </Link>
              </div>
            </div>

            {/* Right 5 Cols - Hero Thumbnail Preview Card */}
            <div className="lg:col-span-5">
              <div className="rounded-[28px] overflow-hidden border border-blue-100 shadow-2xl relative bg-slate-900 group">
                <div className="h-64 sm:h-72 w-full relative overflow-hidden">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent p-6 flex flex-col justify-end pointer-events-none">
                    <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest mb-1">
                      LIVE ONLINE PROGRAM
                    </span>
                    <h3 className="heading-font text-2xl font-extrabold text-white">
                      {course.title}
                    </h3>
                  </div>
                </div>

                <div className="p-6 bg-white space-y-4">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 border-b border-blue-50 pb-3">
                    <span>Program Duration</span>
                    <span className="text-[#0055FF] font-extrabold">{course.duration}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 border-b border-blue-50 pb-3">
                    <span>Placement Track</span>
                    <span className="text-emerald-600 font-extrabold">100% Assisted Referral</span>
                  </div>

                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span>Session Format</span>
                    <span className="text-slate-900 font-extrabold">1-on-1 Interactive</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Top Content Grid: What You'll Learn (7 cols) + Instructor & Questions (5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-12">
          
          {/* Left 7 Cols: What You'll Learn */}
          <div className="lg:col-span-7">
            <div className="h-full p-8 sm:p-10 rounded-[36px] bg-white/85 backdrop-blur-2xl border border-white/90 shadow-[0_12px_45px_rgba(0,85,255,0.1)] flex flex-col justify-between">
              <div>
                <h2 className="heading-font text-2xl sm:text-3xl font-extrabold text-slate-900 mb-6">
                  What you'll learn
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {course.whatYouLearn.map((item: string, i: number) => (
                    <div key={i} className="flex items-start gap-3 p-3.5 rounded-2xl bg-blue-50/40 border border-blue-100/70">
                      <div className="w-5 h-5 rounded-full bg-[#0055FF] text-white flex items-center justify-center text-xs shrink-0 mt-0.5 shadow-xs">
                        ✓
                      </div>
                      <span className="text-xs sm:text-sm font-bold text-slate-800 leading-snug">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right 5 Cols: Instructor & Advisor */}
          <div className="lg:col-span-5 space-y-8">
            {/* Instructor Card */}
            <div className="p-8 rounded-[36px] bg-white/85 backdrop-blur-2xl border border-white/90 shadow-[0_12px_45px_rgba(0,85,255,0.1)]">
              <span className="text-xs font-extrabold text-[#0055FF] uppercase tracking-wider block mb-4">
                YOUR INSTRUCTOR
              </span>

              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-[#0055FF] text-white flex items-center justify-center font-black text-xl shadow-md shrink-0">
                  {course.instructor.split(' ').map((n: string) => n[0]).join('')}
                </div>
                <div>
                  <h3 className="heading-font font-extrabold text-slate-900 text-lg">
                    {course.instructor}
                  </h3>
                  <p className="text-xs font-bold text-[#0055FF]">
                    {course.instructorRole}
                  </p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                Experienced industry practitioner dedicated to mentorship, enterprise architecture, and student placement success.
              </p>
            </div>

            {/* Questions Advisor Card */}
            <div className="p-8 rounded-[36px] bg-slate-900 text-white shadow-xl text-center space-y-4">
              <h3 className="heading-font font-extrabold text-xl text-white">
                Have Questions?
              </h3>
              <p className="text-xs text-slate-400 font-medium leading-relaxed">
                Connect with our academic counsel to clear course prerequisites, fee structures, and batch timings.
              </p>
              <Link
                href="/contact"
                className="w-full py-3.5 rounded-2xl text-xs font-extrabold text-white bg-[#0055FF] hover:bg-blue-600 transition-all block shadow-md"
              >
                Talk to Course Advisor
              </Link>
            </div>
          </div>

        </div>

        {/* BOTTOM FULL-WIDTH SECTION (12 COLS): Course Content & Syllabus */}
        <div className="w-full p-8 sm:p-12 rounded-[36px] bg-white/85 backdrop-blur-2xl border border-white/90 shadow-[0_12px_45px_rgba(0,85,255,0.12)]">
          <div className="max-w-3xl mb-8">
            <span className="inline-block px-3.5 py-1 mb-3 text-xs font-extrabold uppercase tracking-widest text-[#0055FF] bg-blue-50/90 rounded-full border border-blue-100/80">
              PROGRAM SYLLABUS OVERVIEW
            </span>
            <h2 className="heading-font text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3">
              Course Content & Syllabus
            </h2>
            <p className="text-base text-slate-600 font-medium leading-relaxed">
              Structured step-by-step curriculum & core learning topics taught by industry architects.
            </p>
          </div>

          <CurriculumAccordion initialSections={course.curriculum} />
        </div>

      </div>
    </div>
  );
}