import { prisma } from "../lib/prisma";

async function main() {
  console.log("Seeding rich demo data to CMS...");

  const richData = {
    "public-home": {
      stats: [
        { label: "Students Worldwide", value: "15,000+", isActive: true },
        { label: "Hiring Partners", value: "500+", isActive: true },
        { label: "Average Hike", value: "120%", isActive: true },
        { label: "Success Rate", value: "98%", isActive: true }
      ],
      marquee: [
        { name: "Google", isActive: true },
        { name: "Amazon", isActive: true },
        { name: "Microsoft", isActive: true },
        { name: "Meta", isActive: true },
        { name: "Netflix", isActive: true }
      ],
      features: [
        { title: "Project-Based Learning", description: "Build 10+ real-world applications that solve actual problems. Stop watching videos and start coding.", isActive: true },
        { title: "Live Mentorship", description: "Get unblocked instantly with 1-on-1 mentorship from engineers at top tech companies.", isActive: true },
        { title: "Code Reviews", description: "Every line of code you write gets reviewed by an expert. Learn best practices from day one.", isActive: true }
      ],
      howItWorks: [
        { step: "1", title: "Learn Concepts", description: "Master the fundamentals of System Design, DSA, and Full-Stack development.", isActive: true },
        { step: "2", title: "Build Projects", description: "Apply your knowledge by building production-ready applications.", isActive: true },
        { step: "3", title: "Get Hired", description: "Ace your interviews with our dedicated placement support and mock interviews.", isActive: true }
      ],
      testimonials: [
        { name: "Alex Chen", role: "Software Engineer @ Google", quote: "JCRM Technology completely transformed my career. I went from a junior role to L4 at Google in just 6 months.", isActive: true },
        { name: "Sarah Jenkins", role: "Frontend Lead @ Stripe", quote: "The curriculum is exactly what the industry needs. The project-based approach makes all the difference.", isActive: true },
        { name: "Michael O.", role: "Backend Engineer @ Amazon", quote: "The mentorship I received was invaluable. Highly recommend this to anyone serious about engineering.", isActive: true }
      ]
    },
    "public-about": {
      team: [
        { name: "Ashutosh Pandey", role: "Founder & Lead Instructor", imageUrl: "", isActive: true },
        { name: "Priya Sharma", role: "Head of Mentorship", imageUrl: "", isActive: true },
        { name: "David Kim", role: "Curriculum Director", imageUrl: "", isActive: true },
        { name: "Sarah Jenkins", role: "Frontend Lead", imageUrl: "", isActive: true }
      ]
    },
    "public-placements": {
      stats: [
        { title: "Average Salary Increase", value: "+₹42k", sub: "For students switching jobs", isActive: true },
        { title: "Placement Rate", value: "94%", sub: "Within 6 months of graduation", isActive: true },
        { title: "Hiring Partners", value: "300+", sub: "Top tech companies globally", isActive: true }
      ],
      companies: [
        { name: "Google", isActive: true },
        { name: "Amazon", isActive: true },
        { name: "Microsoft", isActive: true },
        { name: "Meta", isActive: true },
        { name: "Netflix", isActive: true }
      ],
      alumni: [
        { name: "Rahul S.", role: "SDE II @ Amazon", quote: "JCRM Technology helped me transition from a service-based company to a product-based giant.", isActive: true },
        { name: "Emily W.", role: "Frontend Engineer @ Meta", quote: "The focus on System Design and advanced React concepts was exactly what I needed.", isActive: true },
        { name: "Jason K.", role: "Backend Developer @ Netflix", quote: "The intense focus on system architecture helped me ace my design interviews effortlessly.", isActive: true }
      ]
    },
    "public-testimonials": {
      testimonials: [
        { name: "Alex Chen", role: "Software Engineer @ Google", quote: "JCRM Technology completely transformed my career.", rating: "5", isActive: true },
        { name: "Sarah Jenkins", role: "Frontend Lead @ Stripe", quote: "The curriculum is exactly what the industry needs.", rating: "5", isActive: true },
        { name: "Michael O.", role: "Backend Engineer @ Amazon", quote: "The mentorship I received was invaluable.", rating: "5", isActive: true },
        { name: "David K.", role: "Full Stack Developer", quote: "Best investment I ever made in my career.", rating: "4", isActive: true },
        { name: "Elena R.", role: "SDE @ Microsoft", quote: "The projects are extremely challenging but rewarding.", rating: "5", isActive: true }
      ]
    }
  };

  for (const [pageId, newContent] of Object.entries(richData)) {
    // Merge with existing
    const existing = await prisma.siteContent.findUnique({ where: { pageId } });
    const merged = { ...((existing?.content as any) || {}), ...newContent };
    
    await prisma.siteContent.upsert({
      where: { pageId },
      update: { content: merged },
      create: { pageId, category: "public", content: merged }
    });
    console.log(`Seeded rich data for ${pageId}`);
  }

  console.log("Successfully seeded demo data!");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect()
  });
