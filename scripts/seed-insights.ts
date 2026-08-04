import { prisma } from "../lib/prisma";

async function main() {
  const admin = await prisma.user.findFirst({
    where: { role: 'ADMIN' }
  });

  let userId;
  if (!admin) {
    console.log("No admin user found. Falling back to any user...");
    const user = await prisma.user.findFirst();
    if (!user) {
        console.error("No users found at all. Cannot seed.");
        return;
    }
    userId = user.id;
  } else {
    userId = admin.id;
  }

  const post = await prisma.insightPost.create({
    data: {
      authorId: userId,
      title: 'Welcome to the New Insights Feed!',
      content: 'We have completely revamped our Insights engine. It is now powered by normalized PostgreSQL tables for blazing fast performance and infinite scalability. Feel free to like or comment below!',
      imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop',
    }
  });

  console.log("Seeded insight post:", post.id);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
