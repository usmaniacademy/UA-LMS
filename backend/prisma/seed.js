import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import readline from 'readline'

const prisma = new PrismaClient()

function ask(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
  return new Promise(resolve => rl.question(question, ans => { rl.close(); resolve(ans) }))
}

async function main() {
  console.log('\n=== Usmani Academy — Admin Seed ===\n')

  const email = (await ask('Admin email: ')).trim()
  const password = (await ask('Admin password (min 8 chars): ')).trim()
  const firstName = (await ask('First name: ')).trim()
  const lastName = (await ask('Last name: ')).trim()

  if (!email || !password || password.length < 8) {
    console.error('\nInvalid input. Password must be at least 8 characters.')
    process.exit(1)
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    if (existing.role === 'admin') {
      console.log(`\nAdmin already exists: ${email}`)
      process.exit(0)
    }
    // Upgrade existing user to admin
    await prisma.user.update({ where: { email }, data: { role: 'admin' } })
    console.log(`\nUser ${email} upgraded to admin role.`)
  } else {
    const passwordHash = await bcrypt.hash(password, 12)
    await prisma.user.create({
      data: { email, passwordHash, firstName, lastName, role: 'admin' }
    })
    console.log(`\nAdmin account created: ${email}`)
  }

  console.log('You can now log in at /auth/sign-in\n')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
