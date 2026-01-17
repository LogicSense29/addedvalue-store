import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import { PrismaClient } from '../prisma/generated/prisma/index.js'

const connectionString = process.env.DATABASE_URL
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  const emailArgument = process.argv[2]
  
  if (!emailArgument) {
    console.error('Please provide an email address.')
    process.exit(1)
  }

  console.log(`Searching for user: ${emailArgument}`)
  let user = await prisma.user.findUnique({ where: { email: emailArgument } })

  if (!user) {
    // Try appending .com
    if (!emailArgument.includes('@') || (!emailArgument.endsWith('.com') && !emailArgument.endsWith('.net'))) {
       const variant = emailArgument.includes('@') ? emailArgument + '.com' : emailArgument
       console.log(`User not found. Trying: ${variant}`)
       user = await prisma.user.findUnique({ where: { email: variant } })
    }
  }

  if (!user) {
    console.error(`User with email ${emailArgument} not found.`)
    console.log("Listing available users:")
    const users = await prisma.user.findMany({ select: { email: true } })
    users.forEach(u => console.log(`- ${u.email}`))
    process.exit(1)
  }

  const updatedUser = await prisma.user.update({
    where: { email: user.email },
    data: { role: 'ADMIN' },
  })
  
  console.log(`SUCCESS: User ${updatedUser.email} has been promoted to ADMIN.`)
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
