import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('Seeding database...');
  
  // Clean up existing data to prevent duplicates on re-seed
  await prisma.enrollment.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.course.deleteMany();
  await prisma.platformSettings.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('password123', 10);

  // Create Users
  const admin = await prisma.user.create({
    data: {
      fullName: 'JCRM Technology Admin',
      email: 'admin@jcrm technology.dev',
      passwordHash,
      role: 'ADMIN',
    },
  });

  const faculty1 = await prisma.user.create({
    data: {
      fullName: 'Sarah Jenkins',
      email: 'sarah@jcrm technology.dev',
      passwordHash,
      role: 'INSTRUCTOR',
    },
  });

  const faculty2 = await prisma.user.create({
    data: {
      fullName: 'David Kim',
      email: 'david@jcrm technology.dev',
      passwordHash,
      role: 'INSTRUCTOR',
    },
  });

  const student1 = await prisma.user.create({
    data: {
      fullName: 'Jane Student',
      email: 'demo@jcrm technology.dev', // Matches the default on the auth page
      passwordHash,
      role: 'STUDENT',
    },
  });

  const student2 = await prisma.user.create({
    data: {
      fullName: 'John Learner',
      email: 'john@jcrm technology.dev',
      passwordHash,
      role: 'STUDENT',
    },
  });

  console.log('Users created.');

  // Create Courses
  const course1 = await prisma.course.create({
    data: {
      facultyId: faculty1.id,
      title: 'Full Stack React & Next.js',
      description: 'Master the modern React ecosystem by building production-ready applications.',
      price: 199.99,
      status: 'PUBLISHED',
      lessons: {
        create: [
          { title: 'Introduction to Next.js', videoKey: 'intro_next.mp4', orderIndex: 1 },
          { title: 'Server Components', videoKey: 'rsc.mp4', orderIndex: 2 },
          { title: 'Prisma & Postgres', videoKey: 'db.mp4', orderIndex: 3 },
        ],
      },
    },
  });

  const course2 = await prisma.course.create({
    data: {
      facultyId: faculty2.id,
      title: 'Advanced System Design',
      description: 'Learn how to architect scalable, highly available systems for millions of users.',
      price: 299.99,
      status: 'PUBLISHED',
      lessons: {
        create: [
          { title: 'Microservices Architecture', videoKey: 'microservices.mp4', orderIndex: 1 },
          { title: 'Database Sharding', videoKey: 'sharding.mp4', orderIndex: 2 },
        ],
      },
    },
  });

  console.log('Courses & Lessons created.');

  // Create Enrollments
  await prisma.enrollment.create({
    data: {
      studentId: student1.id,
      courseId: course1.id,
      transactionId: 'txn_123456789',
      paymentStatus: 'COMPLETED',
      progressPercent: 45,
    },
  });

  await prisma.enrollment.create({
    data: {
      studentId: student2.id,
      courseId: course1.id,
      transactionId: 'txn_987654321',
      paymentStatus: 'COMPLETED',
      progressPercent: 100,
    },
  });

  await prisma.enrollment.create({
    data: {
      studentId: student1.id,
      courseId: course2.id,
      transactionId: 'txn_555555555',
      paymentStatus: 'COMPLETED',
      progressPercent: 10,
    },
  });

  console.log('Enrollments created.');

  // Create Global Settings
  await prisma.platformSettings.create({
    data: {
      themeConfig: { mode: 'dark', primaryColor: '#7C3AED' },
      globalContent: { platformName: 'JCRM Technology', supportEmail: 'support@jcrm technology.io' },
      footerLinks: [{ name: 'Privacy Policy', url: '/privacy' }],
      lastUpdatedBy: admin.id,
    }
  });

  console.log('Database seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
