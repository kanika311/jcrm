import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://www.jcrm.in";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/",
          "/student",
          "/student/",
          "/faculty",
          "/faculty/",
          "/jcrm-sushant",
          "/jcrm-sushant/",
          "/api/",
          "/onboarding",
          "/onboarding/",
        ],
      },
      {
        userAgent: [
          "GPTBot",
          "ClaudeBot",
          "PerplexityBot",
          "Google-Extended",
          "Applebot-Extended",
          "CCBot",
          "cohere-ai",
        ],
        allow: "/",
        disallow: [
          "/admin",
          "/admin/",
          "/student",
          "/student/",
          "/faculty",
          "/faculty/",
          "/jcrm-sushant",
          "/jcrm-sushant/",
          "/api/",
          "/onboarding",
          "/onboarding/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
