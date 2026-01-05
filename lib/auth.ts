import bcrypt from "bcryptjs"
import { prisma } from "./db"

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash)
}

export async function registerUser(email: string, password: string, fullName: string) {
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    throw new Error("Email already exists")
  }

  const hashedPassword = await hashPassword(password)
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      fullName,
    },
    select: { id: true, email: true, fullName: true },
  })

  return user
}

export async function authenticateUser(email: string, password: string) {
  try {
    // Use findFirst to get user by email
    // Handle potential null fullName by using select and then checking
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        fullName: true,
      },
    })

    if (!user) {
      throw new Error("Invalid credentials")
    }

    // Fix null fullName if needed
    if (!user.fullName || user.fullName === null) {
      const defaultFullName = email.split('@')[0] || 'User'
      await prisma.user.update({
        where: { id: user.id },
        data: { fullName: defaultFullName }
      })
      user.fullName = defaultFullName
    }

    // Verify password
    // Check if stored password is plain text (not a bcrypt hash)
    // Bcrypt hashes start with $2a$, $2b$, or $2y$ and are 60 characters long
    const isPlainTextPassword = !user.password || user.password.length < 60 || !user.password.startsWith('$2')
    
    let isValid = false
    
    if (isPlainTextPassword) {
      // Password is stored as plain text - compare directly (legacy support)
      // Also hash it for future use
      isValid = password === user.password
      if (isValid) {
        // Hash the password and update it in the database
        const hashedPassword = await hashPassword(password)
        await prisma.user.update({
          where: { id: user.id },
          data: { password: hashedPassword }
        })
      }
    } else {
      // Password is properly hashed - use bcrypt verification
      isValid = await verifyPassword(password, user.password)
    }
    
    if (!isValid) {
      throw new Error("Invalid credentials")
    }

    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName || email.split('@')[0] || 'User',
    }
  } catch (error: any) {
    // Re-throw original error if not handled
    if (error.message === "Invalid credentials") {
      throw error
    }
    throw new Error("Invalid credentials")
  }
}
