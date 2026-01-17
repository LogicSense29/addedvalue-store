import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import { PrismaClient } from '../prisma/generated/prisma/index.js'

const connectionString = process.env.DATABASE_URL
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log("Connecting to DB...")
  
  // List all users to see who is available
  const users = await prisma.user.findMany({ select: { id: true, email: true } })
  console.log("Available Users:", users.map(u => u.email).join(', '))

  if (users.length < 2) {
    console.log("Not enough users to seed a conversation. Need at least 2.")
    process.exit(0)
  }

  const sender = users[0]
  const receiver = users[1]

  console.log(`Seeding message from ${sender.email} -> ${receiver.email}`)

  await prisma.message.create({
    data: {
      senderId: sender.id,
      receiverId: receiver.id,
      content: 'Hello! This is an automated test message to verify the chat system.',
      isRead: false
    }
  })

  console.log("Message seeded successfully.")
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
