// Seeds (or resets) a single content_writer staff account for the blog portal.
// Idempotent: if the email already exists, its password + role are reset.
//
// Usage: node scripts/seed-content-writer.mjs <email> <password> [firstName] [lastName]
// Password is required as an argument so no credential is ever committed to git.
import 'dotenv/config'
import prisma from '../src/config/prisma.js'
import bcrypt from 'bcryptjs'

const EMAIL = process.argv[2]
const PASSWORD = process.argv[3]
const FIRST = process.argv[4] || 'Content'
const LAST = process.argv[5] || 'Writer'

if (!EMAIL || !PASSWORD || PASSWORD.length < 8) {
  console.error('Usage: node scripts/seed-content-writer.mjs <email> <password(min 8)> [firstName] [lastName]')
  process.exit(1)
}

const passwordHash = await bcrypt.hash(PASSWORD, 12)

const existing = await prisma.user.findUnique({ where: { email: EMAIL } })
if (existing) {
  await prisma.user.update({
    where: { email: EMAIL },
    data: { passwordHash, role: 'content_writer', isActive: true }
  })
  console.log('Reset existing account ->', EMAIL, '(role: content_writer)')
} else {
  await prisma.user.create({
    data: { email: EMAIL, passwordHash, firstName: FIRST, lastName: LAST, role: 'content_writer' }
  })
  console.log('Created content_writer ->', EMAIL)
}
console.log('Password:', PASSWORD)

await prisma.$disconnect()
