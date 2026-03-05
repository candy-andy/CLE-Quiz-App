import { db } from '../src/lib/db'
import bcrypt from 'bcryptjs'

async function createAdmin() {
  const email = process.argv[2] || 'admin@example.com'
  const password = process.argv[3] || 'admin123'
  const name = process.argv[4] || 'Admin'

  try {
    // Check if user exists
    const existing = await db.user.findUnique({
      where: { email }
    })

    if (existing) {
      // Update to admin
      const updated = await db.user.update({
        where: { email },
        data: { role: 'admin' }
      })
      console.log(`✅ User ${email} wurde zum Admin gemacht!`)
      console.log(`   Name: ${updated.name}`)
      return
    }

    // Create new admin user
    const hashedPassword = await bcrypt.hash(password, 12)
    
    const user = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: 'admin'
      }
    })

    console.log(`✅ Admin erstellt!`)
    console.log(`   Email: ${email}`)
    console.log(`   Passwort: ${password}`)
    console.log(`   Name: ${name}`)
    console.log(`\n   Bitte ändere das Passwort nach dem ersten Login!`)
  } catch (error) {
    console.error('Fehler:', error)
    process.exit(1)
  }
}

createAdmin()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
