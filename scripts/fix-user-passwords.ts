import { prisma } from "../lib/db"
import { hashPassword } from "../lib/auth"

async function main() {
  console.log("Fixing user passwords...")

  // Get all users using raw query to bypass Prisma validation
  const users = await prisma.user.findRaw({
    filter: {}
  }) as any[]

  let fixedCount = 0

  for (const user of users) {
    const password = user.password

    // Check if password is plain text (not a bcrypt hash)
    // Bcrypt hashes start with $2a$, $2b$, or $2y$ and are 60 characters long
    const isPlainText = !password || password.length < 60 || !password.startsWith('$2')

    if (isPlainText) {
      console.log(`Fixing password for user: ${user.email}`)
      
      // Hash the plain text password
      const hashedPassword = await hashPassword(password || 'default123')
      
      // Update using raw query
      await prisma.user.updateManyRaw({
        filter: { _id: user._id },
        update: { $set: { password: hashedPassword } }
      })
      
      fixedCount++
      console.log(`✅ Fixed password for ${user.email}`)
    }
  }

  console.log(`\n✅ Fixed ${fixedCount} user(s)!`)
  console.log("Note: If passwords were plain text, users will need to use their original passwords.")
}

main()
  .catch((e) => {
    console.error("❌ Error:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
