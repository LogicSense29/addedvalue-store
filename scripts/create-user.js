const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const prisma = new PrismaClient()

async function main() {
  const email = 'admin_test@example.com'
  const password = 'password123'
  const hashedPassword = await bcrypt.hash(password, 10)

  try {
    const user = await prisma.user.upsert({
      where: { email },
      update: {
        password: hashedPassword,
        isVerified: true,
        // Ensure role is USER initially so we can test promotion
        role: 'USER' 
      },
      create: {
        email,
        password: hashedPassword,
        name: 'Test Admin Candidate',
        isVerified: true,
        role: 'USER'
      },
    })
    console.log(`User ${user.email} created/updated successfully.`)
  } catch (error) {
    console.error('Error creating user:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
