import { prisma } from "../lib/prisma";

async function main() {
  console.log("Updating CMS content in database...");
  
  const allContent = await prisma.siteContent.findMany();
  let updatedCount = 0;

  for (const item of allContent) {
    if (item.content) {
      let dataStr = JSON.stringify(item.content);
      let changed = false;

      // Replace Aushutosh, Ashutosh, Lumina variants
      const replacements = [
        { from: /JavaCoders/g, to: 'JCRM Technology' },
        { from: /javacoders/g, to: 'jcrm technology' },
        { from: /JAVACODERS/g, to: 'CODERSSPOT' },
        { from: /Aushutosh/g, to: 'JCRM Technology' },
        { from: /aushutosh/g, to: 'jcrm technology' },
        { from: /Ashutosh/g, to: 'JCRM Technology' },
        { from: /ashutosh/g, to: 'jcrm technology' },
        { from: /Lumina/g, to: 'JCRM Technology' },
        { from: /lumina/g, to: 'jcrm technology' },
        { from: /AUSHUTOSH/g, to: 'CODERSSPOT' },
        { from: /ASHUTOSH/g, to: 'CODERSSPOT' }
      ];

      for (const { from, to } of replacements) {
        if (from.test(dataStr)) {
          dataStr = dataStr.replace(from, to);
          changed = true;
        }
      }

      if (changed) {
        if (dataStr.includes("pandey.jcrm technology699")) {
          dataStr = dataStr.replace(/pandey\.jcrm technology699/g, "pandey.ashutosh699");
        }

        await prisma.siteContent.update({
          where: { id: item.id },
          data: { content: JSON.parse(dataStr) }
        });
        updatedCount++;
        console.log(`Updated CMS content for: ${item.pageId}`);
      }
    }
  }

  console.log(`Successfully updated ${updatedCount} CMS records in the database.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
