import { prisma } from "../lib/prisma";

async function main() {
  const globalSettings = await prisma.siteContent.findUnique({
    where: { pageId: 'global-settings' }
  });

  if (globalSettings && globalSettings.content) {
    const content = globalSettings.content as any;
    content.siteName = "JCRM Technologies";
    content.logoUrl = "/logo - JCRM.jpeg";

    await prisma.siteContent.update({
      where: { pageId: 'global-settings' },
      data: { content: content }
    });
    console.log("Updated global-settings in DB successfully");
  } else {
    console.log("No global-settings found.");
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
