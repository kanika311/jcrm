import { prisma } from "../lib/prisma";

const catalogCourses = [
  {
    title: "Frontend Development",
    instructor: "Aisha Verma",
    level: "Beginner",
    tags: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
    price: 14999,
    badge: "100% Placement",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
    description: "Master modern responsive web apps, state management, and Next.js frontend architecture."
  },
  {
    title: "Backend Development",
    instructor: "Gautam Sahu",
    level: "Intermediate",
    tags: ["Java Spring Boot", "Node.js", "Microservices", "PostgreSQL"],
    price: 16999,
    badge: "High Demand",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
    description: "Build high-scale microservices, REST APIs, Kafka streaming, and robust backend architectures."
  },
  {
    title: "AI & Machine Learning",
    instructor: "Dr. Sarah Jenkins",
    level: "Advanced",
    tags: ["Python", "PyTorch", "LLMs", "RAG Pipeline", "MLOps"],
    price: 19999,
    badge: "Flagship",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80",
    description: "Build Neural Networks, Generative AI models, Retrieval-Augmented Generation (RAG), and AI agents."
  },
  {
    title: "Data Science",
    instructor: "Dr. Rajesh Verma",
    level: "Intermediate",
    tags: ["Python", "Pandas", "SQL", "Tableau", "Power BI"],
    price: 15999,
    badge: "Popular",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
    description: "Master statistical modeling, data visualization, predictive analytics, and enterprise data warehousing."
  },
  {
    title: "Cyber Security",
    instructor: "Vikram Malhotra",
    level: "Advanced",
    tags: ["Ethical Hacking", "VAPT", "SOC Operations", "SIEM"],
    price: 17999,
    badge: "Critical Skill",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80",
    description: "Master network penetration testing, SOC monitoring, incident response, and ethical hacking protocols."
  },
  {
    title: "Forensic Science",
    instructor: "Dr. Ananya Roy",
    level: "Specialized",
    tags: ["Digital Forensics", "Cyber Crime Investigation", "Memory Analysis"],
    price: 18999,
    badge: "Specialized",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
    description: "Investigate digital evidence, memory & disk forensic analysis, mobile forensics, and chain of custody."
  },
  {
    title: "Cloud & DevOps",
    instructor: "Shwati Singh",
    level: "Intermediate",
    tags: ["AWS", "Docker", "Kubernetes", "Terraform", "CI/CD"],
    price: 16999,
    badge: "Bestseller",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
    description: "Automate cloud deployment pipelines, container orchestration with Kubernetes, and IaC with Terraform."
  },
  {
    title: "QA Automation",
    instructor: "Pronay Dey",
    level: "Beginner",
    tags: ["Selenium", "Cypress", "Java", "API Testing", "Playwright"],
    price: 13999,
    badge: "Job Ready",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80",
    description: "Master automated software testing, E2E browser testing, REST API automation, and CI test suites."
  },
  {
    title: "Digital Marketing",
    instructor: "Neha Sharma",
    level: "Beginner",
    tags: ["SEO", "Performance Ads", "Google Ads", "Meta Ads", "Analytics"],
    price: 12999,
    badge: "Fast Track",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    description: "Master performance marketing, Search Engine Optimization (SEO), PPC campaigns, and conversion analytics."
  },
  {
    title: "Zen AI",
    instructor: "Rohan Verma",
    level: "Advanced",
    tags: ["Zen AI", "Autonomous Agents", "Prompt Engineering", "Multi-Agent Workflows"],
    price: 21999,
    badge: "Cutting Edge",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    description: "Build autonomous AI agents, multi-agent orchestrations, and enterprise cognitive software with Zen AI."
  }
];

async function main() {
  console.log("Seeding Catalog Courses to MongoDB Atlas...");

  // Find an admin or instructor user to own the courses
  const admin = await prisma.user.findFirst({
    where: { role: "ADMIN" }
  });

  if (!admin) {
    console.error("❌ No admin user found. Please run scripts/reset-admin.ts first.");
    process.exit(1);
  }

  for (const c of catalogCourses) {
    const existing = await prisma.course.findFirst({
      where: { title: c.title }
    });

    if (!existing) {
      await prisma.course.create({
        data: {
          title: c.title,
          description: c.description,
          price: c.price,
          status: "PUBLISHED",
          level: c.level,
          tags: c.tags,
          badge: c.badge,
          image: c.image,
          instructor: c.instructor,
          facultyId: admin.id,
        }
      });
      console.log(`✓ Created: ${c.title}`);
    } else {
      console.log(`- Already exists: ${c.title}`);
    }
  }

  console.log("\n✅ All Catalog Courses successfully seeded in MongoDB Atlas!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
