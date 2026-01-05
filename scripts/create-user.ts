import { prisma } from "../lib/db"
import { hashPassword } from "../lib/auth"

async function main() {
  const args = process.argv.slice(2)
  
  if (args.length < 3) {
    console.log("Usage: npx ts-node scripts/create-user.ts <email> <password> <fullName>")
    console.log("Example: npx ts-node scripts/create-user.ts admin@freshfarm.vn admin123 Admin User")
    process.exit(1)
  }

  const [email, password, fullName] = args

  try {
    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email }
    })

    if (existing) {
      console.error(`❌ User with email ${email} already exists!`)
      process.exit(1)
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        createdAt: true,
      }
    })

    console.log("✅ User created successfully!")
    console.log(`   ID: ${user.id}`)
    console.log(`   Email: ${user.email}`)
    console.log(`   Full Name: ${user.fullName}`)
    console.log(`   Created At: ${user.createdAt}`)
  } catch (error) {
    console.error("❌ Error creating user:", error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()

