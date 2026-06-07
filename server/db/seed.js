// Populates password hashes for existing users
// Run: npm run db:seed
// Requires DATABASE_URL in .env

import 'dotenv/config'
import pkg from 'pg'
const { Pool } = pkg
import bcrypt from 'bcryptjs'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})

const USERS = [
  { its: '20346916', name: 'Mustafa Hamid' },
  { its: '40481762', name: 'Aamir Hazari'  },
]

async function seed() {
  const client = await pool.connect()
  try {
    console.log('🔑 Generating password hashes...')
    for (const u of USERS) {
      const hash = await bcrypt.hash(u.its, 10)
      await client.query(
        `UPDATE users SET password_hash = $1 WHERE its = $2`,
        [hash, u.its]
      )
      console.log(`   ✅ ${u.name} (${u.its}) — password set`)
    }
    console.log('\n✅ Done! Both users can now log in with their ITS number.')
  } catch (err) {
    console.error('❌ Seed failed:', err.message)
    process.exit(1)
  } finally {
    client.release()
    await pool.end()
  }
}

seed()