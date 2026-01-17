import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import { PrismaClient } from '../prisma/generated/prisma/index.js'

const connectionString = process.env.DATABASE_URL
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  const email1 = 'admin_test@example.com' // Our test user
  const email2 = 'lappiconnect@gmail.com' // The user we just promoted (or any other)
  
  // Ensure both users exist
  const user1 = await prisma.user.findUnique({ where: { email: email1 } })
  const user2 = await prisma.user.findUnique({ where: { email: email2 } })

  if (!user1 || !user2) {
    console.error('One or both users not found. Create them first.')
    process.exit(1)
  }

  // Create a message from User 2 to User 1
  await prisma.message.create({
    data: {
      senderId: user2.id,
      receiverId: user1.id,
      content: 'Hello Admin Test! This is a test message from LappiConnect.',
      isRead: false
    }
  })

  console.log(`Seeded message from ${user2.email} to ${user1.email}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
