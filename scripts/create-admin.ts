import { prisma } from "../lib/db"
import { hashPassword } from "../lib/auth"

async function main() {
  const args = process.argv.slice(2)
  
  if (args.length < 3) {
    console.log("Usage: npx ts-node scripts/create-admin.ts <email> <password> <fullName>")
    console.log("Example: npx ts-node scripts/create-admin.ts admin@freshfarm.vn admin123 Admin User")
    process.exit(1)
  }

  const [email, password, fullName] = args

  try {
    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email }
    })

    if (existing) {
      // Update existing user to admin
      const updated = await prisma.user.update({
        where: { email },
        data: {
          role: "ADMIN",
          password: await hashPassword(password),
          fullName: fullName || existing.fullName,
        },
        select: {
          id: true,
          email: true,
          fullName: true,
          role: true,
          createdAt: true,
        }
      })

      console.log("✅ User updated to ADMIN successfully!")
      console.log(`   ID: ${updated.id}`)
      console.log(`   Email: ${updated.email}`)
      console.log(`   Full Name: ${updated.fullName}`)
      console.log(`   Role: ${updated.role}`)
      process.exit(0)
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create admin user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName,
        role: "ADMIN",
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        createdAt: true,
      }
    })

    console.log("✅ Admin user created successfully!")
    console.log(`   ID: ${user.id}`)
    console.log(`   Email: ${user.email}`)
    console.log(`   Full Name: ${user.fullName}`)
    console.log(`   Role: ${user.role}`)
    console.log(`   Created At: ${user.createdAt}`)
    console.log("\n📝 You can now login at: http://localhost:3000/auth/login")
    console.log(`   Email: ${email}`)
    console.log(`   Password: ${password}`)
    console.log("\n🔗 After login, go to: http://localhost:3000/dashboard/admin")
  } catch (error) {
    console.error("❌ Error creating admin user:", error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()

