import 'dotenv/config'
import pkg from 'pg'
const { Pool } = pkg
import bcrypt from 'bcryptjs'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Railway requires this specific SSL config
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL.includes('railway') 
    ? { rejectUnauthorized: false }
    : false,
})

const USERS = [
  { its: '20346916', name: 'Mustafa Hamid', initials: 'MH', city: 'London', role: 'zone_admin', zone_id: 1 },
  { its: '40481762', name: 'Aamir Hazari',  initials: 'AH', city: 'London', role: 'volunteer',  zone_id: 1 },
]

async function seed() {
  console.log('🔌 Connecting to database...')
  let client
  try {
    client = await pool.connect()
    console.log('   ✅ Connected!')
  } catch (err) {
    console.error('❌ Could not connect:', err.message)
    process.exit(1)
  }

  try {
    console.log('📋 Creating tables...')
    const schema = readFileSync(join(__dirname, 'schema.sql'), 'utf8')
    await client.query(schema)
    console.log('   ✅ Tables ready')

    console.log('🌍 Seeding zone...')
    await client.query(`
      INSERT INTO zones (id, name, display_order)
      VALUES (1, 'CMZ', 1)
      ON CONFLICT (name) DO NOTHING
    `)
    console.log('   ✅ Zone CMZ')

    console.log('🔑 Seeding users...')
    for (const u of USERS) {
      const hash = await bcrypt.hash(u.its, 10)
      await client.query(`
        INSERT INTO users (its, name, initials, city, role, zone_id, is_active, password_hash)
        VALUES ($1, $2, $3, $4, $5, $6, TRUE, $7)
        ON CONFLICT (its) DO UPDATE SET password_hash = EXCLUDED.password_hash, name = EXCLUDED.name
      `, [u.its, u.name, u.initials, u.city, u.role, u.zone_id, hash])
      console.log(`   ✅ ${u.name} (${u.its})`)
    }

    console.log('📝 Seeding templates...')
    const templates = [
      ['Sanitize work surfaces',                     'high',   1],
      ['Sweep and mop floor',                        'high',   2],
      ['Empty trash bins',                           'medium', 3],
      ['Clean food processing equipment',            'high',   4],
      ['Wipe equipment surfaces',                    'medium', 5],
      ['Clean cold storage',                         'medium', 6],
      ['Clean offices and corridor',                 'low',    7],
      ['Degrease ventilation hoods',                 'medium', 8],
      ['Inspect freezers',                           'high',   9],
      ['Thoroughly clean food processing equipment', 'high',   10],
      ['Empty bins, rinse and re-line',              'medium', 11],
      ['Wipe all touch points',                      'high',   12],
      ['Clean sinks and drains',                     'high',   13],
      ['Wash all work surfaces (tables)',            'high',   14],
      ['Clean and scrape stoves',                    'high',   15],
      ['Wash 4ft walls',                             'medium', 16],
      ['Wash and scrub floor',                       'high',   17],
      ['Flush drains',                               'medium', 18],
      ['Spray pesticide in drains',                  'medium', 19],
    ]
    for (const [title, priority, order] of templates) {
      await client.query(`
        INSERT INTO templates (title, default_zone_id, default_priority, display_order, is_active)
        VALUES ($1, 1, $2, $3, TRUE)
        ON CONFLICT DO NOTHING
      `, [title, priority, order])
    }
    console.log(`   ✅ ${templates.length} templates`)

    await client.query(`SELECT setval('zones_id_seq',     (SELECT MAX(id) FROM zones))`)
    await client.query(`SELECT setval('users_id_seq',     (SELECT MAX(id) FROM users))`)
    await client.query(`SELECT setval('templates_id_seq', (SELECT MAX(id) FROM templates))`)

    console.log('\n✅ All done!')
    console.log('   Mustafa Hamid  → ITS: 20346916')
    console.log('   Aamir Hazari   → ITS: 40481762')

  } catch (err) {
    console.error('❌ Seed failed:', err.message)
    process.exit(1)
  } finally {
    client.release()
    await pool.end()
  }
}

seed()