import "dotenv/config";
import { prisma } from "../lib/prisma";

async function main() {
  const pageId = 'public-home';
  const existing = await prisma.siteContent.findUnique({ where: { pageId } });
  
  const content = existing?.content ? (typeof existing.content === 'string' ? JSON.parse(existing.content) : existing.content) : {};
  
  content.stats = [
    { value: "50+", label: "ERP Deployments", isActive: true },
    { value: "10+", label: "Industry Modules", isActive: true },
    { value: "99%", label: "Client Satisfaction", isActive: true },
    { value: "24x7", label: "Support", isActive: true }
  ];

  await prisma.siteContent.update({
    where: { pageId },
    data: { content: content },
  });

  console.log("Stats updated successfully.");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
