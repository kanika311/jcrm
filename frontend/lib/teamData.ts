export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  city: string;
  state: string;
  maskedPhone: string;
  maskedEmail: string;
  college: string;
  education: string;
  experience: string;
  skills: string[];
  bio: string;
  isVerified?: boolean;
}

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: "akasha_s_990",
    name: "Akasha S",
    role: "AI/ML Engineer",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
    city: "Udupi",
    state: "Karnataka",
    maskedPhone: "xxxxxx9070",
    maskedEmail: "akxxxxxxxxxxxx@gmail.com",
    college: "Shri Madhwa Vadiraja Institute of Technology and Management, Bantakal",
    education: "B.E. Computer Science and Engineering",
    experience: "Fresher / AI Research Intern",
    skills: ["Python", "OpenCV", "NumPy", "PyTorch", "Machine Learning Fundamentals", "Cybersecurity"],
    bio: "My name is Akasha S, and I am from Udupi. I completed my Bachelor of Engineering in Computer Science and Engineering from SMVITM, Udupi in 2026. During my final semester, I completed a Cybersecurity & AI Internship where I developed a system for Ransomware Detection Using Machine Learning algorithms. My hobbies include building AI models, playing cricket, and tech research.",
    isVerified: true
  },
  {
    id: "nitya_102",
    name: "Nitya",
    role: "Social Media Manager",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
    city: "Bangalore",
    state: "Karnataka",
    maskedPhone: "xxxxxx8142",
    maskedEmail: "nixxxxxxxxx@gmail.com",
    college: "Christ University, Bangalore",
    education: "B.A. Media Studies & Digital Marketing",
    experience: "6 Months Internship",
    skills: ["Social Media Strategy", "Content Copywriting", "Canva Pro", "Meta Ads", "Google Analytics", "Brand Engagement"],
    bio: "Passionate digital marketer and social media manager with hands-on experience scaling brand reach across Instagram, LinkedIn, and YouTube. Specialized in creative campaign strategy, short-form reel video editing, and community engagement.",
    isVerified: true
  },
  {
    id: "priyanshu_s_304",
    name: "Priyanshu Shukla",
    role: "Full Stack Developer",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
    city: "Noida",
    state: "Delhi NCR",
    maskedPhone: "xxxxxx5510",
    maskedEmail: "prxxxxxxxxxxxx@gmail.com",
    college: "Jaypee Institute of Information Technology",
    education: "B.Tech Information Technology",
    experience: "1 Year Experience",
    skills: ["React.js", "Node.js", "Express.js", "MongoDB", "TypeScript", "Tailwind CSS", "RESTful APIs"],
    bio: "Full Stack Developer adept at designing modern MERN stack web applications. Developed scalable REST APIs, JWT authentication microservices, and real-time dashboard interfaces during my internship at JCRM Technologies.",
    isVerified: true
  },
  {
    id: "nisha_k_205",
    name: "Nisha Kumari",
    role: "Frontend Developer",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80",
    city: "Mumbai",
    state: "Maharashtra",
    maskedPhone: "xxxxxx4321",
    maskedEmail: "nixxxxxxxxxx@gmail.com",
    college: "Veermata Jijabai Technological Institute (VJTI)",
    education: "B.E. Computer Engineering",
    experience: "Fresher",
    skills: ["HTML5", "CSS3", "JavaScript ES6+", "React", "Redux Toolkit", "Responsive UI"],
    bio: "Frontend software engineer dedicated to crafting clean, accessible user interfaces with smooth micro-animations. Skilled in React 19, responsive grid layouts, and cross-browser web performance tuning.",
    isVerified: true
  },
  {
    id: "shruti_v_401",
    name: "Shruti Verma",
    role: "Data Scientist",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
    city: "Pune",
    state: "Maharashtra",
    maskedPhone: "xxxxxx7788",
    maskedEmail: "shxxxxxxxxxxxx@gmail.com",
    college: "COEP Technological University",
    education: "B.Tech Data Science & Analytics",
    experience: "6 Months Internship",
    skills: ["Python", "Pandas", "SQL", "Tableau", "Power BI", "Scikit-Learn", "Hypothesis Testing"],
    bio: "Data Science analyst experienced in exploratory data analysis (EDA), predictive regression modeling, and building executive dashboards using Power BI and Python Seaborn.",
    isVerified: true
  },
  {
    id: "manoj_k_502",
    name: "Manoj Kumar",
    role: "Backend Engineer",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
    city: "Hyderabad",
    state: "Telangana",
    maskedPhone: "xxxxxx6633",
    maskedEmail: "maxxxxxxxxxx@gmail.com",
    college: "JNTU Hyderabad",
    education: "B.Tech Computer Science",
    experience: "1 Year Experience",
    skills: ["Java", "Spring Boot", "PostgreSQL", "Kafka", "Docker", "Microservices"],
    bio: "Backend software engineer focused on building robust Java Spring Boot microservices, high-throughput Kafka event streaming queues, and relational database SQL tuning.",
    isVerified: true
  },
  {
    id: "pooja_r_603",
    name: "Pooja Rani",
    role: "QA Automation Engineer",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80",
    city: "Bangalore",
    state: "Karnataka",
    maskedPhone: "xxxxxx3322",
    maskedEmail: "poxxxxxxxxxx@gmail.com",
    college: "RV College of Engineering",
    education: "B.E. Telecommunication Engineering",
    experience: "Fresher",
    skills: ["Selenium", "Java", "Cypress", "RestAssured", "Postman", "TestNG", "Jira"],
    bio: "Quality assurance test engineer experienced in building Page Object Model (POM) Selenium web automation test scripts, REST API testing, and bug tracking in Agile sprints.",
    isVerified: true
  },
  {
    id: "rohit_s_704",
    name: "Rohit Sharma",
    role: "DevOps Engineer",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=800&q=80",
    city: "Delhi",
    state: "Delhi NCR",
    maskedPhone: "xxxxxx1199",
    maskedEmail: "roxxxxxxxxxxxx@gmail.com",
    college: "Delhi Technological University (DTU)",
    education: "B.Tech Computer Engineering",
    experience: "6 Months Internship",
    skills: ["AWS", "Docker", "Kubernetes", "Terraform", "GitHub Actions", "Linux Shell"],
    bio: "DevOps cloud engineer specializing in automated CI/CD pipeline deployment, Docker container packaging, and AWS EC2/S3 cloud infrastructure management.",
    isVerified: true
  }
];

export function getCandidateById(id: string): TeamMember | undefined {
  return TEAM_MEMBERS.find((m) => m.id === id);
}
