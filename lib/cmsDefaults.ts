export type FieldType = "string" | "text" | "number" | "boolean" | "array" | "image";

export interface FieldSchema {
  type: FieldType;
  label: string;
  default?: any;
  itemSchema?: Record<string, FieldSchema>; // For arrays of objects
}

export interface PageSchema {
  id: string;
  name: string;
  category: "global" | "public" | "student" | "faculty" | "admin";
  schema: Record<string, FieldSchema>;
}

export const CMS_SCHEMAS: PageSchema[] = [
  {
    id: "cms-config",
    name: "CMS Configuration",
    category: "admin",
    schema: {
      publicOrder: {
        type: "array",
        label: "Public Pages Order",
        itemSchema: {
          id: { type: "string", label: "Page ID", default: "" },
          isHidden: { type: "boolean", label: "Hidden in CMS?", default: false }
        },
        default: [
          { id: "public-home", isHidden: false },
          { id: "public-about", isHidden: false },
          { id: "public-navbar", isHidden: false },
          { id: "public-courses", isHidden: false },
          { id: "public-placements", isHidden: false },
          { id: "public-testimonials", isHidden: false },
          { id: "public-insights", isHidden: false },
          { id: "public-careers", isHidden: false },
          { id: "public-contact", isHidden: false },
          { id: "public-feedback", isHidden: false },
          { id: "public-auth", isHidden: false },
          { id: "public-privacy", isHidden: false },
          { id: "public-terms", isHidden: false },
          { id: "public-cookie", isHidden: false },
          { id: "public-refund", isHidden: false },
          { id: "public-projects", isHidden: false },
          { id: "public-faculty", isHidden: false },
          { id: "public-community", isHidden: false }
        ]
      },
      studentOrder: {
        type: "array",
        label: "Student Pages Order",
        itemSchema: {
          id: { type: "string", label: "Page ID", default: "" },
          isHidden: { type: "boolean", label: "Hidden in CMS?", default: false }
        },
        default: [
          { id: "student-dashboard", isHidden: false },
          { id: "student-courses", isHidden: false },
          { id: "student-live", isHidden: false },
          { id: "student-assignments", isHidden: false },
          { id: "student-calendar", isHidden: false },
          { id: "student-messages", isHidden: false },
          { id: "student-settings", isHidden: false },
          { id: "student-navbar", isHidden: false }
        ]
      },
      facultyOrder: {
        type: "array",
        label: "Faculty Pages Order",
        itemSchema: {
          id: { type: "string", label: "Page ID", default: "" },
          isHidden: { type: "boolean", label: "Hidden in CMS?", default: false }
        },
        default: [
          { id: "faculty-dashboard", isHidden: false },
          { id: "faculty-courses", isHidden: false },
          { id: "faculty-builder", isHidden: false },
          { id: "faculty-analytics", isHidden: false },
          { id: "faculty-announcements", isHidden: false },
          { id: "faculty-submissions", isHidden: false },
          { id: "faculty-navbar", isHidden: false }
        ]
      },
      globalOrder: {
        type: "array",
        label: "Global Pages Order",
        itemSchema: {
          id: { type: "string", label: "Page ID", default: "" },
          isHidden: { type: "boolean", label: "Hidden in CMS?", default: false }
        },
        default: [
          { id: "global-settings", isHidden: false },
          { id: "global-footer", isHidden: false }
        ]
      },
      adminOrder: {
        type: "array",
        label: "Admin Pages Order",
        itemSchema: {
          id: { type: "string", label: "Page ID", default: "" },
          isHidden: { type: "boolean", label: "Hidden in CMS?", default: false }
        },
        default: [
          { id: "admin-dashboard", isHidden: false },
          { id: "admin-users", isHidden: false },
          { id: "admin-moderation", isHidden: false },
          { id: "admin-settings", isHidden: false }
        ]
      }
    }
  },
  {
    id: "global-settings",
    name: "Global Site Settings",
    category: "global",
    schema: {
      siteName: { type: "string", label: "Website Name", default: "JCRM Technologies" },
      logoUrl: { type: "string", label: "Logo URL (Optional)", default: "/logo - JCRM.png" },
      primaryColor: { type: "string", label: "Primary Brand Color (Hex)", default: "#7C3AED" },
    }
  },
  {
    id: "public-navbar",
    name: "Main Navigation Bar",
    category: "public",
    schema: {
      links: {
        type: "array",
        label: "Navigation Links",
        itemSchema: {
          name: { type: "string", label: "Link Text", default: "New Link" },
          href: { type: "string", label: "URL Path", default: "/" },
          isActive: { type: "boolean", label: "Is Active?", default: true }
        },
        default: []
      }
    }
  },
  {
    id: "public-projects",
    name: "Alumni Projects Page",
    category: "public",
    schema: {
      heroTitle: { type: "string", label: "Hero Title", default: "Alumni Projects" },
      heroSubtitle: { type: "text", label: "Hero Subtitle", default: "Explore production-grade applications built by our students. This is the portfolio you will graduate with." },
      projects: {
        type: "array",
        label: "Projects List",
        itemSchema: {
          title: { type: "string", label: "Project Title", default: "Full-Stack AI LMS Platform" },
          description: { type: "text", label: "Project Description", default: "A complete learning management system with AI integrations." },
          githubLink: { type: "string", label: "GitHub URL", default: "https://github.com" },
          demoVideoUrl: { type: "string", label: "Demo Video URL (YouTube embed or MP4)", default: "" },
          image: { type: "string", label: "Fallback Image URL", default: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800" },
          techStack: { 
            type: "array", 
            label: "Tech Stack (Strings)", 
            itemSchema: { tech: { type: "string", label: "Tech Name", default: "Next.js" } },
            default: []
          },
          isActive: { type: "boolean", label: "Is Active?", default: true }
        },
        default: []
      }
    }
  },
  {
    id: "public-faculty",
    name: "Faculty Overview Page",
    category: "public",
    schema: {
      heroTitle: { type: "string", label: "Hero Title", default: "Meet the Top 1% Engineers" },
      heroSubtitle: { type: "text", label: "Hero Subtitle", default: "Learn directly from industry veterans who have built products scaling to millions of users. No influencers, just real engineers." }
    }
  },
  {
    id: "public-community",
    name: "Community Page",
    category: "public",
    schema: {
      onlineCount: { type: "string", label: "Members Online Text", default: "1,204" },
      heroTitle: { type: "string", label: "Hero Title", default: "Join the Developer Network" },
      heroSubtitle: { type: "text", label: "Hero Subtitle", default: "Your network is your net worth. Connect with thousands of ambitious engineers building the next generation of software." },
      joinButtonText: { type: "string", label: "Join Button Text", default: "Join the Community" },
      joinLink: { type: "string", label: "Join Link URL", default: "/auth" },
      features: {
        type: "array",
        label: "Community Features",
        itemSchema: {
          title: { type: "string", label: "Feature Title", default: "Private Discord Server" },
          description: { type: "text", label: "Feature Description", default: "Get 24/7 access to our private Discord..." },
          icon: { type: "string", label: "Emoji Icon", default: "💬" }
        },
        default: []
      },
      members: {
        type: "array",
        label: "Types of Members",
        itemSchema: {
          roleName: { type: "string", label: "Role Name", default: "Frontend Developers" }
        },
        default: []
      }
    }
  },
  {
    id: "public-home",
    name: "Home Page",
    category: "public",
    schema: {
      heroTitle: { type: "string", label: "Hero Title Prefix", default: "Build skills that" },
      heroHighlight: { type: "string", label: "Hero Title Highlight", default: "ship real products." },
      heroSubtitle: { type: "text", label: "Hero Subtitle", default: "Project-based engineering courses taught by the industry's top 1%." },
      stats: {
        type: "array",
        label: "Key Statistics",
        itemSchema: {
          label: { type: "string", label: "Stat Label", default: "Students Worldwide" },
          value: { type: "string", label: "Stat Value", default: "10,000+" },
          isActive: { type: "boolean", label: "Show this stat?", default: true }
        },
        default: []
      },
      marquee: {
        type: "array",
        label: "Marquee Companies",
        itemSchema: {
          name: { type: "string", label: "Company Name", default: "GOOGLE" },
          isActive: { type: "boolean", label: "Show?", default: true }
        },
        default: []
      },
      techStackHeading: { type: "string", label: "Tech Stack Heading", default: "Mastering the most in-demand technologies" },
      techStackMarquee: {
        type: "array",
        label: "Tech Stack",
        itemSchema: {
          name: { type: "string", label: "Tech Name", default: "React" },
          isActive: { type: "boolean", label: "Show?", default: true }
        },
        default: []
      },
      features: {
        type: "array",
        label: "Features List",
        itemSchema: {
          title: { type: "string", label: "Feature Title", default: "Feature" },
          description: { type: "text", label: "Feature Description", default: "Description" },
          isActive: { type: "boolean", label: "Show?", default: true }
        },
        default: []
      },
      howItWorks: {
        type: "array",
        label: "How It Works Steps",
        itemSchema: {
          step: { type: "string", label: "Step Number", default: "1" },
          title: { type: "string", label: "Step Title", default: "Title" },
          description: { type: "string", label: "Step Description", default: "Description" },
          isActive: { type: "boolean", label: "Show?", default: true }
        },
        default: []
      },
      testimonials: {
        type: "array",
        label: "Testimonials",
        itemSchema: {
          name: { type: "string", label: "Name", default: "Jane Doe" },
          role: { type: "string", label: "Role", default: "Engineer" },
          quote: { type: "text", label: "Quote", default: "This is great!" },
          isActive: { type: "boolean", label: "Show?", default: true }
        },
        default: []
      }
    }
  },
  {
    id: "public-about",
    name: "About Us Page",
    category: "public",
    schema: {
      heading: { type: "string", label: "Page Heading", default: "About JCRM Technology" },
      story: { type: "text", label: "Our Story", default: "We started with a simple idea..." },
      team: {
        type: "array",
        label: "Team Members",
        itemSchema: {
          name: { type: "string", label: "Name", default: "John Doe" },
          role: { type: "string", label: "Role", default: "Instructor" },
          imageUrl: { type: "image", label: "Photo", default: "" },
          isActive: { type: "boolean", label: "Is Active?", default: true }
        },
        default: []
      }
    }
  },
  // --- ADDITIONAL PUBLIC PAGES ---
  {
    id: "public-courses",
    name: "Course Catalog",
    category: "public",
    schema: {
      heading: { type: "string", label: "Heading", default: "Explore Courses" },
      subtitle: { type: "text", label: "Subtitle", default: "Find the right path for your career." },
    }
  },
  {
    id: "public-placements",
    name: "Placements",
    category: "public",
    schema: {
      heading: { type: "string", label: "Heading", default: "Our Alumni Work At" },
      subtitle: { type: "text", label: "Subtitle", default: "Join thousands of engineers at top companies." },
      stats: {
        type: "array",
        label: "Placement Stats",
        itemSchema: {
          title: { type: "string", label: "Stat Title", default: "Average Salary Increase" },
          value: { type: "string", label: "Stat Value", default: "+₹42k" },
          sub: { type: "string", label: "Subtext", default: "For students switching jobs" },
          isActive: { type: "boolean", label: "Show?", default: true }
        },
        default: []
      },
      companies: {
        type: "array",
        label: "Hiring Partners",
        itemSchema: {
          name: { type: "string", label: "Company Name", default: "Google" },
          isActive: { type: "boolean", label: "Show?", default: true }
        },
        default: []
      },
      alumni: {
        type: "array",
        label: "Alumni Spotlights",
        itemSchema: {
          name: { type: "string", label: "Name", default: "Emily Rogers" },
          prev: { type: "string", label: "Before", default: "Junior Dev" },
          now: { type: "string", label: "After", default: "Software Engineer at Stripe" },
          quote: { type: "text", label: "Quote", default: "This course changed my life." },
          imgUrl: { type: "image", label: "Student Photo", default: "" },
          isActive: { type: "boolean", label: "Show?", default: true }
        },
        default: []
      }
    }
  },
  {
    id: "public-testimonials",
    name: "Testimonials",
    category: "public",
    schema: {
      heading: { type: "string", label: "Heading", default: "What our students say" },
      subtitle: { type: "text", label: "Subtitle", default: "Real reviews from real engineers." },
      testimonials: {
        type: "array",
        label: "Testimonials",
        itemSchema: {
          name: { type: "string", label: "Name", default: "Alex Chen" },
          role: { type: "string", label: "Role", default: "Frontend Engineer" },
          quote: { type: "text", label: "Quote", default: "This course was great." },
          imgUrl: { type: "image", label: "Student Photo", default: "" },
          isActive: { type: "boolean", label: "Show?", default: true }
        },
        default: []
      }
    }
  },
  {
    id: "public-contact",
    name: "Contact Us",
    category: "public",
    schema: {
      heading: { type: "string", label: "Heading", default: "Get in Touch" },
      subtitle: { type: "text", label: "Subtitle", default: "We'd love to hear from you." },
      email: { type: "string", label: "Support Email", default: "support@example.com" },
      address: { type: "text", label: "Office Address", default: "123 Engineering Way, Tech City" }
    }
  },
  {
    id: "public-feedback",
    name: "Feedback",
    category: "public",
    schema: {
      heading: { type: "string", label: "Heading", default: "Your Feedback Matters" },
      subtitle: { type: "text", label: "Subtitle", default: "Help us improve the platform." },
    }
  },
  {
    id: "public-auth",
    name: "Auth / Login Page",
    category: "public",
    schema: {
      heading: { type: "string", label: "Heading", default: "Welcome Back" },
      bulletPoints: {
        type: "array",
        label: "Feature Bullets",
        itemSchema: {
          text: { type: "string", label: "Text", default: "Learn from the best" },
          isActive: { type: "boolean", label: "Is Active?", default: true }
        },
        default: []
      }
    }
  },
  // --- STUDENT PORTAL ---
  {
    id: "student-navbar",
    name: "Student Navbar",
    category: "student",
    schema: {
      showNotifications: { type: "boolean", label: "Show Notifications Bell?", default: true },
    }
  },
  {
    id: "student-dashboard",
    name: "Student Dashboard",
    category: "student",
    schema: {
      welcomeMessage: { type: "string", label: "Welcome Message Prefix", default: "Welcome back," },
      showQuickStats: { type: "boolean", label: "Show Quick Stats?", default: true }
    }
  },
  {
    id: "student-courses",
    name: "My Courses",
    category: "student",
    schema: {
      heading: { type: "string", label: "Heading", default: "My Courses" },
      emptyState: { type: "string", label: "Empty State Message", default: "You haven't enrolled in any courses yet." }
    }
  },
  {
    id: "student-live",
    name: "Live Sessions",
    category: "student",
    schema: {
      heading: { type: "string", label: "Heading", default: "Upcoming Live Sessions" },
      guidelines: { type: "text", label: "Session Guidelines", default: "Please join 5 minutes early and mute your microphone." }
    }
  },
  {
    id: "student-assignments",
    name: "Assignments",
    category: "student",
    schema: {
      heading: { type: "string", label: "Heading", default: "My Assignments" }
    }
  },
  {
    id: "student-calendar",
    name: "Calendar",
    category: "student",
    schema: {
      heading: { type: "string", label: "Heading", default: "Schedule" },
      timezoneNotice: { type: "string", label: "Timezone Notice", default: "All times are shown in your local timezone." }
    }
  },
  {
    id: "student-messages",
    name: "Messages",
    category: "student",
    schema: {
      heading: { type: "string", label: "Heading", default: "Inbox" }
    }
  },
  {
    id: "student-settings",
    name: "Settings",
    category: "student",
    schema: {
      heading: { type: "string", label: "Heading", default: "Account Settings" },
      allowProfileEdit: { type: "boolean", label: "Allow students to edit profile?", default: true }
    }
  },
  // --- FACULTY PORTAL ---
  {
    id: "faculty-navbar",
    name: "Faculty Navbar",
    category: "faculty",
    schema: {
      showNotifications: { type: "boolean", label: "Show Notifications Bell?", default: true },
    }
  },
  {
    id: "faculty-dashboard",
    name: "Faculty Dashboard",
    category: "faculty",
    schema: {
      welcomeMessage: { type: "string", label: "Welcome Message Prefix", default: "Welcome back, Professor" },
    }
  },
  {
    id: "faculty-courses",
    name: "My Teaching Courses",
    category: "faculty",
    schema: {
      heading: { type: "string", label: "Heading", default: "Courses You Teach" }
    }
  },
  {
    id: "faculty-builder",
    name: "Course Builder",
    category: "faculty",
    schema: {
      guidelines: { type: "text", label: "Builder Guidelines", default: "Ensure all modules have at least one video and assignment." }
    }
  },
  {
    id: "faculty-analytics",
    name: "Analytics",
    category: "faculty",
    schema: {
      heading: { type: "string", label: "Heading", default: "Student Performance Analytics" }
    }
  },
  {
    id: "faculty-announcements",
    name: "Announcements",
    category: "faculty",
    schema: {
      heading: { type: "string", label: "Heading", default: "Broadcast Announcements" },
      defaultTemplate: { type: "text", label: "Default Template Text", default: "Hello class,\n\n..." }
    }
  },
  {
    id: "faculty-submissions",
    name: "Submissions",
    category: "faculty",
    schema: {
      heading: { type: "string", label: "Heading", default: "Review Submissions" },
      gradingPolicy: { type: "text", label: "Grading Policy Reminder", default: "Grades must be submitted within 48 hours." }
    }
  },
  // --- ADMIN PORTAL ---
  {
    id: "admin-dashboard",
    name: "Admin Dashboard",
    category: "admin",
    schema: {
      heading: { type: "string", label: "Heading", default: "Platform Overview" },
      showRevenue: { type: "boolean", label: "Show Revenue Metrics?", default: true }
    }
  },
  {
    id: "admin-users",
    name: "User Management",
    category: "admin",
    schema: {
      heading: { type: "string", label: "Heading", default: "Manage Users" }
    }
  },
  {
    id: "admin-moderation",
    name: "Moderation",
    category: "admin",
    schema: {
      heading: { type: "string", label: "Heading", default: "Content Moderation" },
      guidelines: { type: "text", label: "Moderator Guidelines", default: "Review flagged content within 24 hours." }
    }
  },
  {
    id: "admin-settings",
    name: "System Settings",
    category: "admin",
    schema: {
      heading: { type: "string", label: "Heading", default: "Advanced System Settings" },
      maintenanceMode: { type: "boolean", label: "Enable Maintenance Mode?", default: false }
    }
  },
  {
    id: "admin-courses",
    name: "Global Course Catalog",
    category: "admin",
    schema: {
      heading: { type: "string", label: "Heading", default: "Global Course Catalog" }
    }
  },
  {
    id: "admin-cms",
    name: "CMS Configuration",
    category: "admin",
    schema: {
      heading: { type: "string", label: "Heading", default: "Content Management" }
    }
  },
  {
    id: "admin-reports",
    name: "Financial Reports",
    category: "admin",
    schema: {
      heading: { type: "string", label: "Heading", default: "Financial Reports" }
    }
  },
  {
    id: "global-footer",
    name: "Footer Settings",
    category: "global",
    schema: {
      brandDescription: { type: "text", label: "Brand Description", default: "Engineering education for the future. Built by engineers, for engineers." },
      copyright: { type: "string", label: "Copyright Text", default: "© 2026 JCRM Technology Education Inc. All rights reserved." },
      learnLinks: {
        type: "array",
        label: "Learn Section Links",
        itemSchema: {
          label: { type: "string", label: "Label", default: "" },
          url: { type: "string", label: "URL", default: "" }
        },
        default: [
          { label: "Courses", url: "/courses" },
          { label: "Placements", url: "/placements" },
          { label: "Testimonials", url: "/testimonials" },
          { label: "Insights", url: "/insights" }
        ]
      },
      companyLinks: {
        type: "array",
        label: "Company Section Links",
        itemSchema: {
          label: { type: "string", label: "Label", default: "" },
          url: { type: "string", label: "URL", default: "" }
        },
        default: [
          { label: "About Us", url: "/about" },
          { label: "Careers", url: "/careers" },
          { label: "Contact", url: "/contact" },
          { label: "Feedback", url: "/feedback" }
        ]
      },
      legalLinks: {
        type: "array",
        label: "Legal Section Links",
        itemSchema: {
          label: { type: "string", label: "Label", default: "" },
          url: { type: "string", label: "URL", default: "" }
        },
        default: [
          { label: "Privacy Policy", url: "/legal/privacy" },
          { label: "Terms of Service", url: "/legal/terms" },
          { label: "Cookie Policy", url: "/legal/cookies" },
          { label: "Refund Policy", url: "/legal/refund" }
        ]
      }
    }
  },
  {
    id: "public-insights",
    name: "Insights Feed",
    category: "public",
    schema: {
      heading: { type: "string", label: "Heading", default: "Platform Insights" },
      subheading: { type: "string", label: "Subheading", default: "Stay up-to-date with the latest content, blogs, and course posters." },
      posts: {
        type: "array",
        label: "Feed Posts",
        itemSchema: {
          id: { type: "string", label: "Post ID", default: "1" },
          title: { type: "string", label: "Title", default: "" },
          content: { type: "text", label: "Content Text", default: "" },
          codeSnippet: { type: "text", label: "Code Snippet", default: "" },
          imageUrl: { type: "image", label: "Post Image", default: "" },
          videoUrl: { type: "string", label: "Video URL", default: "" },
          author: { type: "string", label: "Author Name", default: "Super Admin" },
          date: { type: "string", label: "Date", default: "Today" },
          likes: { type: "number", label: "Likes Count", default: 0 }
        },
        default: [
          {
            id: "demo-post-1",
            title: "Welcome to JCRM Technology Insights",
            content: "This is our new public feed where we share the latest updates, tutorials, and course posters.",
            codeSnippet: "console.log('Hello, World!');",
            imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80",
            videoUrl: "",
            author: "Founder",
            date: "Jul 9, 2026",
            likes: 42
          }
        ]
      }
    }
  },
  {
    id: "public-careers",
    name: "Careers Page",
    category: "public",
    schema: {
      heading: { type: "string", label: "Heading", default: "Join Our Team" },
      subheading: { type: "text", label: "Subheading", default: "Fill out the career guidance form below to explore opportunities with us." }
    }
  },
  {
    id: "public-privacy",
    name: "Privacy Policy",
    category: "public",
    schema: {
      heading: { type: "string", label: "Heading", default: "Privacy Policy" },
      content: { type: "text", label: "Content", default: "This is our privacy policy. It can be updated here." }
    }
  },
  {
    id: "public-terms",
    name: "Terms of Service",
    category: "public",
    schema: {
      heading: { type: "string", label: "Heading", default: "Terms of Service" },
      content: { type: "text", label: "Content", default: "These are our terms of service. They can be updated here." }
    }
  },
  {
    id: "public-cookie",
    name: "Cookie Policy",
    category: "public",
    schema: {
      heading: { type: "string", label: "Heading", default: "Cookie Policy" },
      content: { type: "text", label: "Content", default: "This is our cookie policy. It can be updated here." }
    }
  },
  {
    id: "public-refund",
    name: "Refund Policy",
    category: "public",
    schema: {
      heading: { type: "string", label: "Heading", default: "Refund Policy" },
      content: { type: "text", label: "Content", default: "This is our refund policy. It can be updated here." }
    }
  }
];

export const DEFAULT_CMS_ORDER = CMS_SCHEMAS.map(s => s.id);

export function getDefaultDataForSchema(schema: Record<string, FieldSchema>) {
  const data: any = {};
  for (const [key, field] of Object.entries(schema)) {
    data[key] = field.default;
  }
  return data;
}
