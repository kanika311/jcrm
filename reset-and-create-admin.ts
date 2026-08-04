import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url';

// Load environment variables explicitly
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

// Import the pre-configured prisma client
import { prisma } from './lib/prisma';

async function main() {
  const superAdminEmail = 'gsanskargkp25@gmail.com'
  const superAdminPassword = 'sam@123admin'

  console.log('--- STARTING DATABASE RESET ---')

  // 0. Get IDs of users to delete to wipe their relations
  const usersToDelete = await prisma.user.findMany({
    where: {
      email: {
        not: superAdminEmail
      }
    },
    select: { id: true }
  })
  
  const userIds = usersToDelete.map(u => u.id)

  if (userIds.length > 0) {
    console.log(`Found ${userIds.length} users to delete. Wiping relations...`)
    
    // Enrollments reference Courses and Users
    await prisma.enrollment.deleteMany({}) 
    // Lessons reference Courses
    await prisma.lesson.deleteMany({})
    
    // Now safe to delete Courses
    await prisma.course.deleteMany({ where: { facultyId: { in: userIds } } })
    
    await prisma.userProfile.deleteMany({ where: { userId: { in: userIds } } })
    await prisma.session.deleteMany({ where: { userId: { in: userIds } } })
    await prisma.account.deleteMany({ where: { userId: { in: userIds } } })

    console.log('Deleting all existing users...')
    const deletedUsers = await prisma.user.deleteMany({
      where: {
        id: { in: userIds }
      }
    })
    console.log(`Deleted ${deletedUsers.count} old users.`)
  } else {
    console.log('No old users found to delete.')
  }

  // 2. Check if the Super Admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: superAdminEmail }
  })

  const passwordHash = await bcrypt.hash(superAdminPassword, 10)

  if (existingAdmin) {
    console.log(`Super Admin ${superAdminEmail} found. Updating credentials...`)
    await prisma.user.update({
      where: { email: superAdminEmail },
      data: {
        passwordHash: passwordHash,
        role: 'ADMIN',
        fullName: 'Super Admin'
      }
    })
    console.log('Super Admin credentials and role updated successfully.')
  } else {
    console.log(`Creating new Super Admin account for ${superAdminEmail}...`)
    await prisma.user.create({
      data: {
        email: superAdminEmail,
        passwordHash: passwordHash,
        role: 'ADMIN',
        fullName: 'Super Admin',
      }
    })
    console.log('Super Admin account created successfully.')
  }

  console.log('--- DATABASE RESET COMPLETE ---')
  console.log('You can now log in with:')
  console.log(`Email: ${superAdminEmail}`)
  console.log(`Password: ${superAdminPassword}`)
  console.log(`Or continue via Google using the same email address.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
