/**
 * Reset / create an admin account non-interactively.
 *
 * Usage:
 *   node prisma/reset-admin.js <email> <password> [firstName] [lastName]
 *
 * - If the user exists: their password is reset and role set to admin.
 * - If the user does not exist: a new admin account is created.
 *
 * Password must be at least 8 characters.
 */
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const [, , email, password, firstName = 'Admin', lastName = 'User'] = process.argv

  if (!email || !password || password.length < 8) {
    console.error('\nUsage: node prisma/reset-admin.js <email> <password> [firstName] [lastName]')
    console.error('Password must be at least 8 characters.\n')
    process.exit(1)
  }

  const passwordHash = await bcrypt.hash(password, 12)
  const existing = await prisma.user.findUnique({ where: { email } })

  if (existing) {
    await prisma.user.update({
      where: { email },
      data: { passwordHash, role: 'admin' }
    })
    console.log(`\n✅ Password reset and admin role confirmed for: ${email}\n`)
  } else {
    await prisma.user.create({
      data: { email, passwordHash, firstName, lastName, role: 'admin' }
    })
    console.log(`\n✅ New admin account created: ${email}\n`)
  }

  console.log('Log in at /auth/sign-in\n')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
