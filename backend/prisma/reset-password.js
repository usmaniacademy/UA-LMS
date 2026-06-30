/**
 * Reset any user's password WITHOUT changing their role.
 *
 * Usage:
 *   node prisma/reset-password.js <email> <newPassword>
 *
 * Password must be at least 8 characters. After updating it re-reads the
 * hash and verifies the new password matches, so you get confirmation it worked.
 */
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const [, , email, newPassword] = process.argv

  if (!email || !newPassword || newPassword.length < 8) {
    console.error('\nUsage: node prisma/reset-password.js <email> <newPassword>')
    console.error('Password must be at least 8 characters.\n')
    process.exit(1)
  }

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    console.error(`\n❌ No account found with email: ${email}\n`)
    process.exit(1)
  }

  const passwordHash = await bcrypt.hash(newPassword, 12)
  await prisma.user.update({ where: { email }, data: { passwordHash } })

  // Verify the new password against the freshly stored hash
  const updated = await prisma.user.findUnique({ where: { email } })
  const ok = await bcrypt.compare(newPassword, updated.passwordHash)

  console.log(`\n${ok ? '✅' : '❌'} Password reset for ${email} (role: ${user.role})`)
  console.log(`   Verification: ${ok ? 'PASSED — new password works' : 'FAILED — hash mismatch'}`)
  console.log(`\n   Email:    ${email}`)
  console.log(`   Password: ${newPassword}`)
  console.log(`\n   Log in at /auth/sign-in\n`)
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
