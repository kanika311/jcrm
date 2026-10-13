export interface KeyClientItem {
  id: string;
  name: string;
  category: "IT & Software" | "Enterprise ERP & Cloud" | "Corporate Conglomerate" | "Engineering & Manufacturing" | "Facilities & Infra" | "Healthcare & Hospitality";
  badge: string;
  roles: string[];
  packageRange: string;
  traineesHired: string;
  location: string;
  description: string;
  website?: string;
  partnerType: "Direct Hiring Partner" | "MOU Placement Partner" | "Industrial Training Tie-Up" | "Corporate Alliance";
  logoKey: string;
}

export const KEY_CLIENTS_DATA: KeyClientItem[] = [
  // --- Exact companies from reference screenshot ---
  {
    id: "capgemini",
    name: "Capgemini",
    category: "IT & Software",
    badge: "Tier-1 Hiring Partner",
    roles: ["Software Engineer", "Cloud Associate", "Full Stack Developer", "QA Analyst"],
    packageRange: "₹4.8 - ₹9.5 LPA",
    traineesHired: "140+",
    location: "Bengaluru, Mumbai, Pune, Hyderabad",
    description: "Global leader in consulting, digital transformation, technology and engineering services.",
    partnerType: "Direct Hiring Partner",
    logoKey: "capgemini"
  },
  {
    id: "reliance",
    name: "Reliance Industries",
    category: "Corporate Conglomerate",
    badge: "Corporate Tie-Up",
    roles: ["ERP Analyst", "Systems Engineer", "Data Operations", "Digital Associate"],
    packageRange: "₹5.5 - ₹12.0 LPA",
    traineesHired: "95+",
    location: "Mumbai, Ahmedabad, Delhi NCR, Bengaluru",
    description: "Fortune 500 conglomerate driving India's digital, retail, and energy revolutions.",
    partnerType: "Corporate Alliance",
    logoKey: "reliance"
  },
  {
    id: "nagarro",
    name: "Nagarro",
    category: "IT & Software",
    badge: "Campus Placement Partner",
    roles: ["Software Developer Trainee", "React/Node Engineer", "Automation Specialist"],
    packageRange: "₹5.0 - ₹10.5 LPA",
    traineesHired: "80+",
    location: "Gurugram, Bengaluru, Pune, Jaipur",
    description: "Digital engineering leader specializing in enterprise agile transformations.",
    partnerType: "Direct Hiring Partner",
    logoKey: "nagarro"
  },
  {
    id: "g4s",
    name: "G4S",
    category: "Facilities & Infra",
    badge: "Corporate Tie-Up",
    roles: ["IT Operations Trainee", "Infrastructure Coordinator", "ERP Helpdesk Specialist"],
    packageRange: "₹4.2 - ₹7.8 LPA",
    traineesHired: "65+",
    location: "Pan India",
    description: "World's leading integrated security and infrastructure management solutions company.",
    partnerType: "MOU Placement Partner",
    logoKey: "g4s"
  },
  {
    id: "hettich",
    name: "Hettich",
    category: "Engineering & Manufacturing",
    badge: "Industrial Partner",
    roles: ["SAP/ERP Operations", "Technical Support Engineer", "Digital Supply Chain Analyst"],
    packageRange: "₹4.5 - ₹8.5 LPA",
    traineesHired: "50+",
    location: "Vadodara, Delhi NCR, Bengaluru",
    description: "Global German manufacturer known for premium intelligent engineering hardware.",
    partnerType: "Industrial Training Tie-Up",
    logoKey: "hettich"
  },
  {
    id: "lenze",
    name: "Lenze",
    category: "Engineering & Manufacturing",
    badge: "Automation Alliance",
    roles: ["Automation Trainee", "Embedded Systems Engineer", "Technical Sales Trainee"],
    packageRange: "₹4.8 - ₹9.0 LPA",
    traineesHired: "45+",
    location: "Pune, Bengaluru, Chennai",
    description: "Specialist in machine automation, motion centric drive technology, and IoT engineering.",
    partnerType: "Industrial Training Tie-Up",
    logoKey: "lenze"
  },
  {
    id: "cushman-wakefield",
    name: "Cushman & Wakefield",
    category: "Facilities & Infra",
    badge: "Enterprise Tie-Up",
    roles: ["Facility IT Specialist", "Asset Data Analyst", "ERP Coordinator"],
    packageRange: "₹5.0 - ₹8.8 LPA",
    traineesHired: "55+",
    location: "Bengaluru, Mumbai, Gurugram",
    description: "Global commercial real estate and enterprise facility services giant.",
    partnerType: "Corporate Alliance",
    logoKey: "cushman-wakefield"
  },
  {
    id: "pentair",
    name: "Pentair",
    category: "Engineering & Manufacturing",
    badge: "Global Partner",
    roles: ["Process Engineer Trainee", "Industrial IoT Analyst", "Systems Support"],
    packageRange: "₹5.2 - ₹9.8 LPA",
    traineesHired: "40+",
    location: "Noida, Goa, Bengaluru",
    description: "Sustainable water solutions and industrial flow engineering multi-national company.",
    partnerType: "Industrial Training Tie-Up",
    logoKey: "pentair"
  },
  {
    id: "eureka-forbes",
    name: "Eureka Forbes",
    category: "Corporate Conglomerate",
    badge: "Placement Partner",
    roles: ["Customer Operations Tech", "ERP Field Ops", "Software QA Associate"],
    packageRange: "₹4.0 - ₹7.5 LPA",
    traineesHired: "75+",
    location: "Bengaluru, Mumbai, Kolkata, Delhi",
    description: "Pioneering consumer tech and health solutions conglomerate.",
    partnerType: "MOU Placement Partner",
    logoKey: "eureka-forbes"
  },
  {
    id: "haworth",
    name: "Haworth",
    category: "Engineering & Manufacturing",
    badge: "Design & Tech Alliance",
    roles: ["CAD/Design Technologist", "ERP Inventory Specialist", "Operations Trainee"],
    packageRange: "₹4.5 - ₹8.2 LPA",
    traineesHired: "35+",
    location: "Chennai, New Delhi, Bengaluru",
    description: "Global leader in workspace architecture, design technology, and organic workspace systems.",
    partnerType: "Corporate Alliance",
    logoKey: "haworth"
  },
  {
    id: "healthcare-global",
    name: "Healthcare Global",
    category: "Healthcare & Hospitality",
    badge: "Healthcare Tie-Up",
    roles: ["Healthcare Informatics Associate", "Hospital ERP Executive", "Billing Systems Trainee"],
    packageRange: "₹4.2 - ₹8.0 LPA",
    traineesHired: "60+",
    location: "Bengaluru, Hyderabad, Chennai",
    description: "Advanced healthcare network deploying modern digital patient care management systems.",
    partnerType: "Direct Hiring Partner",
    logoKey: "healthcare"
  },
  {
    id: "hotel-rivoli",
    name: "Hotel Rivoli",
    category: "Healthcare & Hospitality",
    badge: "Hospitality Partner",
    roles: ["Hotel ERP Executive", "Property Management Tech", "Front Office Systems Associate"],
    packageRange: "₹3.8 - ₹6.5 LPA",
    traineesHired: "45+",
    location: "New Delhi, Jaipur, Agra",
    description: "Boutique luxury hospitality brand utilizing automated enterprise reservation workflows.",
    partnerType: "MOU Placement Partner",
    logoKey: "hotel-rivoli"
  },
  {
    id: "armstrong-ceilings",
    name: "Armstrong Ceilings",
    category: "Facilities & Infra",
    badge: "Infrastructure Partner",
    roles: ["Specification Technologist", "ERP Procurement Trainee", "Field Tech Coordinator"],
    packageRange: "₹4.5 - ₹8.0 LPA",
    traineesHired: "38+",
    location: "Mumbai, Delhi NCR, Bengaluru",
    description: "World leader in architectural acoustic ceiling solutions and construction technologies.",
    partnerType: "Industrial Training Tie-Up",
    logoKey: "armstrong"
  },
  {
    id: "karcher",
    name: "Kärcher",
    category: "Engineering & Manufacturing",
    badge: "German Tech Tie-Up",
    roles: ["Service Tech Trainee", "ERP Field Operations", "Industrial Solutions Analyst"],
    packageRange: "₹4.6 - ₹8.4 LPA",
    traineesHired: "42+",
    location: "Noida, Pune, Bengaluru",
    description: "World-renowned German cleaning technology manufacturer with global smart operations.",
    partnerType: "Industrial Training Tie-Up",
    logoKey: "karcher"
  },
  {
    id: "haworth-design",
    name: "Haworth (Change by Design)",
    category: "Engineering & Manufacturing",
    badge: "Design Alliance",
    roles: ["Workspace Technologist", "Design System Analyst"],
    packageRange: "₹4.5 - ₹8.2 LPA",
    traineesHired: "30+",
    location: "Chennai, New Delhi, Bengaluru",
    description: "Workspace architecture, design technology, and organic workspace systems.",
    partnerType: "Corporate Alliance",
    logoKey: "haworth-design"
  },
  {
    id: "steelcase",
    name: "Steelcase",
    category: "Facilities & Infra",
    badge: "Corporate Recruiter",
    roles: ["Digital Workspace Specialist", "Supply Chain IT Associate", "Application Support"],
    packageRange: "₹5.0 - ₹9.2 LPA",
    traineesHired: "50+",
    location: "Gurugram, Bengaluru, Mumbai",
    description: "Global enterprise furniture, architecture, and technology workspace innovator.",
    partnerType: "Direct Hiring Partner",
    logoKey: "steelcase"
  },
  {
    id: "orient-craft",
    name: "Orient Craft Limited",
    category: "Corporate Conglomerate",
    badge: "Textile & Tech Partner",
    roles: ["Production ERP Trainee", "Quality Systems Auditor", "Operations Associate"],
    packageRange: "₹4.0 - ₹7.2 LPA",
    traineesHired: "70+",
    location: "Gurugram, Noida, Ranchi",
    description: "Leading garment manufacturing conglomerate with automated enterprise apparel pipelines.",
    partnerType: "MOU Placement Partner",
    logoKey: "orient-craft"
  },
  {
    id: "walking-tree",
    name: "Walking Tree",
    category: "IT & Software",
    badge: "Digital Partner",
    roles: ["Full Stack JavaScript Trainee", "Angular/React Developer", "UI/UX Engineer"],
    packageRange: "₹4.5 - ₹8.5 LPA",
    traineesHired: "52+",
    location: "Hyderabad, Bengaluru, Pune",
    description: "Boutique product engineering and enterprise mobility software consultancy.",
    partnerType: "Direct Hiring Partner",
    logoKey: "walking-tree"
  },

  // --- Premier Tech & ERP Giants for JCRM Trainees ---
  {
    id: "tcs",
    name: "Tata Consultancy Services (TCS)",
    category: "IT & Software",
    badge: "Tier-1 Hiring Partner",
    roles: ["Assistant System Engineer", "Cloud Associate", "Java Developer", "ERP Trainee"],
    packageRange: "₹4.5 - ₹9.2 LPA",
    traineesHired: "185+",
    location: "Pan India",
    description: "Global IT services, consulting, and business solutions leader.",
    partnerType: "Direct Hiring Partner",
    logoKey: "tcs"
  },
  {
    id: "infosys",
    name: "Infosys",
    category: "IT & Software",
    badge: "Campus Placement Partner",
    roles: ["Systems Engineer", "Specialist Programmer", "Full Stack Developer"],
    packageRange: "₹4.5 - ₹10.5 LPA",
    traineesHired: "160+",
    location: "Bengaluru, Pune, Hyderabad, Mysuru",
    description: "Global leader in next-generation digital services and consulting.",
    partnerType: "Direct Hiring Partner",
    logoKey: "infosys"
  },
  {
    id: "wipro",
    name: "Wipro",
    category: "IT & Software",
    badge: "Direct Hiring Partner",
    roles: ["Project Engineer", "Cloud & Infra Trainee", "Cybersecurity Trainee"],
    packageRange: "₹4.2 - ₹8.8 LPA",
    traineesHired: "135+",
    location: "Bengaluru, Chennai, Hyderabad, Pune",
    description: "Leading technology services and consulting company focused on innovative solutions.",
    partnerType: "Direct Hiring Partner",
    logoKey: "wipro"
  },
  {
    id: "cognizant",
    name: "Cognizant",
    category: "IT & Software",
    badge: "Tier-1 Hiring Partner",
    roles: ["Programmer Analyst Trainee", "GenAI Associate", "Data Analyst"],
    packageRange: "₹4.8 - ₹9.6 LPA",
    traineesHired: "120+",
    location: "Chennai, Bengaluru, Kolkata, Pune",
    description: "Engineers modern businesses to improve everyday life through smart IT solutions.",
    partnerType: "Direct Hiring Partner",
    logoKey: "cognizant"
  },
  {
    id: "tech-mahindra",
    name: "Tech Mahindra",
    category: "IT & Software",
    badge: "Direct Hiring Partner",
    roles: ["Associate Software Engineer", "Telecom ERP Specialist", "Network Tech"],
    packageRange: "₹4.2 - ₹8.5 LPA",
    traineesHired: "110+",
    location: "Pune, Hyderabad, Noida, Bengaluru",
    description: "Connected solutions provider for telecom, enterprise cloud, and automation.",
    partnerType: "Direct Hiring Partner",
    logoKey: "tech-mahindra"
  },
  {
    id: "hcltech",
    name: "HCLTech",
    category: "IT & Software",
    badge: "Tier-1 Hiring Partner",
    roles: ["Graduate Engineer Trainee", "Cloud DevOps Trainee", "Full Stack Engineer"],
    packageRange: "₹4.5 - ₹9.0 LPA",
    traineesHired: "115+",
    location: "Noida, Bengaluru, Chennai, Lucknow",
    description: "Supercharging progress through industry-leading engineering and digital services.",
    partnerType: "Direct Hiring Partner",
    logoKey: "hcltech"
  },
  {
    id: "accenture",
    name: "Accenture",
    category: "IT & Software",
    badge: "Global Hiring Partner",
    roles: ["Associate Software Engineer", "Application Development Analyst", "Cloud Tech"],
    packageRange: "₹5.2 - ₹11.5 LPA",
    traineesHired: "95+",
    location: "Bengaluru, Gurugram, Mumbai, Hyderabad",
    description: "Global professional services company with leading digital, cloud and security capabilities.",
    partnerType: "Direct Hiring Partner",
    logoKey: "accenture"
  },
  {
    id: "sap",
    name: "SAP Enterprise Solutions",
    category: "Enterprise ERP & Cloud",
    badge: "ERP Ecosystem Partner",
    roles: ["SAP ABAP Consultant Trainee", "SAP FICO Associate", "SAP MM Trainee"],
    packageRange: "₹6.0 - ₹14.0 LPA",
    traineesHired: "85+",
    location: "Bengaluru, Gurugram, Pune",
    description: "Market leader in enterprise application software and cloud business suites.",
    partnerType: "Industrial Training Tie-Up",
    logoKey: "sap"
  },
  {
    id: "oracle",
    name: "Oracle",
    category: "Enterprise ERP & Cloud",
    badge: "Cloud & Database Partner",
    roles: ["Cloud Infrastructure Trainee", "Database Admin Trainee", "Java Engineer"],
    packageRange: "₹6.5 - ₹15.0 LPA",
    traineesHired: "60+",
    location: "Bengaluru, Hyderabad, Noida",
    description: "Global provider of cloud infrastructure, database systems, and enterprise software.",
    partnerType: "Corporate Alliance",
    logoKey: "oracle"
  },
  {
    id: "salesforce",
    name: "Salesforce",
    category: "Enterprise ERP & Cloud",
    badge: "CRM Ecosystem Partner",
    roles: ["Salesforce Developer Trainee", "CRM Administrator", "Apex Consultant"],
    packageRange: "₹6.0 - ₹13.5 LPA",
    traineesHired: "55+",
    location: "Bengaluru, Hyderabad, Mumbai",
    description: "World's #1 AI CRM, connecting companies and customers across every touchpoint.",
    partnerType: "Corporate Alliance",
    logoKey: "salesforce"
  },
  {
    id: "google-cloud",
    name: "Google Cloud Ecosystem",
    category: "Enterprise ERP & Cloud",
    badge: "Cloud Alliance",
    roles: ["Associate Cloud Engineer", "Data Engineering Trainee", "DevOps Trainee"],
    packageRange: "₹7.5 - ₹18.5 LPA",
    traineesHired: "40+",
    location: "Bengaluru, Gurugram, Hyderabad",
    description: "Leading enterprise cloud provider offering cutting-edge infrastructure and AI engines.",
    partnerType: "Corporate Alliance",
    logoKey: "google-cloud"
  },
  {
    id: "lt-technology",
    name: "L&T Technology Services",
    category: "Engineering & Manufacturing",
    badge: "Engineering Partner",
    roles: ["Design Engineer Trainee", "Embedded C++ Trainee", "Industrial IoT Analyst"],
    packageRange: "₹5.0 - ₹9.8 LPA",
    traineesHired: "70+",
    location: "Vadodara, Bengaluru, Mumbai, Chennai",
    description: "Premier engineering research and development services provider for global leaders.",
    partnerType: "Industrial Training Tie-Up",
    logoKey: "lt-technology"
  }
];

export const PLACEMENT_STATS = [
  { value: "150+", label: "Active Hiring Partners", subtext: "From Fortune 500s to fast-scaling tech firms" },
  { value: "1,500+", label: "Trainees Placed", subtext: "Across IT, ERP, Cloud, and Engineering" },
  { value: "95.8%", label: "Placement Success Rate", subtext: "For graduates completing full training modules" },
  { value: "₹18.5 LPA", label: "Highest Package Offered", subtext: "Average starter package ₹6.2 LPA" }
];

export const PLACEMENT_STEPS = [
  {
    step: "01",
    title: "Industry-Aligned Curriculum",
    description: "Trainees undergo hands-on development in full stack, modern ERP, cloud architectures, and live project workflows matching partner requirements."
  },
  {
    step: "02",
    title: "Live Production Case Studies",
    description: "Real-world exposure through simulated client enterprise sprints, automated testing pipelines, and agile software development cycles."
  },
  {
    step: "03",
    title: "Mock Technical & HR Rounds",
    description: "1-on-1 interview practice with senior engineers, GitHub portfolio code reviews, and domain aptitude preparation."
  },
  {
    step: "04",
    title: "Dedicated Campus Drives & Hiring",
    description: "Exclusive drive access with direct interview scheduling, fast-track background verifications, and verified offer release."
  }
];
