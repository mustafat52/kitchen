// Run with: npm run db:seed
// Seeds the database with 1 zone, 2 users, and task templates

import 'dotenv/config'
import pkg from 'pg'
const { Pool } = pkg
import bcrypt from 'bcryptjs'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } })

async function seed() {
  const client = await pool.connect()
  try {
    console.log('🌱 Running schema...')
    const schema = readFileSync(join(__dirname, 'schema.sql'), 'utf8')
    await client.query(schema)

    console.log('🌱 Seeding zone...')
    await client.query(`
      INSERT INTO zones (id, name, display_order)
      VALUES (1, 'CMZ', 1)
      ON CONFLICT (name) DO NOTHING
    `)

    console.log('🌱 Seeding users...')
    // ITS number is used as password (hashed)
    const adminHash = await bcrypt.hash('10000001', 10)
    const volHash   = await bcrypt.hash('10000002', 10)

    await client.query(`
      INSERT INTO users (id, its, name, initials, phone, city, role, zone_id, is_active)
      VALUES
        (1, '10000001', 'Zone Admin', 'ZA', NULL, 'London', 'zone_admin', 1, TRUE),
        (2, '10000002', 'Volunteer',  'VL', NULL, 'London', 'volunteer',  1, TRUE)
      ON CONFLICT (its) DO NOTHING
    `)

    // Store password hashes — add password column if not there
    await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash VARCHAR(100)`)
    await client.query(`UPDATE users SET password_hash = $1 WHERE its = '10000001'`, [adminHash])
    await client.query(`UPDATE users SET password_hash = $2 WHERE its = '10000002'`, [volHash])

    console.log('🌱 Seeding templates...')
    await client.query(`
      INSERT INTO templates (title, default_zone_id, default_priority, display_order, is_active) VALUES
        ('Sanitize work surfaces',                    1, 'high',   1,  TRUE),
        ('Sweep and mop floor',                       1, 'high',   2,  TRUE),
        ('Empty trash bins',                          1, 'medium', 3,  TRUE),
        ('Clean food processing equipment',           1, 'high',   4,  TRUE),
        ('Wipe equipment surfaces',                   1, 'medium', 5,  TRUE),
        ('Clean cold storage',                        1, 'medium', 6,  TRUE),
        ('Clean offices and corridor',                1, 'low',    7,  TRUE),
        ('Degrease ventilation hoods',                1, 'medium', 8,  TRUE),
        ('Inspect freezers',                          1, 'high',   9,  TRUE),
        ('Thoroughly clean food processing equipment',1, 'high',   10, TRUE),
        ('Empty bins, rinse and re-line',             1, 'medium', 11, TRUE),
        ('Wipe all touch points',                     1, 'high',   12, TRUE),
        ('Clean sinks and drains',                    1, 'high',   13, TRUE),
        ('Wash all work surfaces (tables)',           1, 'high',   14, TRUE),
        ('Clean and scrape stoves',                   1, 'high',   15, TRUE),
        ('Wash 4ft walls',                            1, 'medium', 16, TRUE),
        ('Wash and scrub floor',                      1, 'high',   17, TRUE),
        ('Flush drains',                              1, 'medium', 18, TRUE),
        ('Spray pesticide in drains',                 1, 'medium', 19, TRUE)
      ON CONFLICT DO NOTHING
    `)

    // Reset sequences to avoid PK conflicts
    await client.query(`SELECT setval('users_id_seq',    (SELECT MAX(id) FROM users))`)
    await client.query(`SELECT setval('zones_id_seq',    (SELECT MAX(id) FROM zones))`)
    await client.query(`SELECT setval('templates_id_seq',(SELECT MAX(id) FROM templates))`)

    console.log('✅ Seed complete!')
    console.log('   Zone Admin ITS: 10000001  (password: 10000001)')
    console.log('   Volunteer  ITS: 10000002  (password: 10000002)')
  } catch (err) {
    console.error('❌ Seed failed:', err.message)
    process.exit(1)
  } finally {
    client.release()
    await pool.end()
  }
}

seed()
