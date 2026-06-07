-- ════════════════════════════════════════════════════════
--  Kitchen Cleaning Task Manager — Full Setup
--  Run this entire file in pgAdmin Query Tool
--  IMPORTANT: After running this, see STEP 4 note below
-- ════════════════════════════════════════════════════════

-- ── 1. Tables ──────────────────────────────────────────

CREATE TABLE IF NOT EXISTS zones (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(50) UNIQUE NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  its           VARCHAR(20) UNIQUE NOT NULL,
  name          VARCHAR(100) NOT NULL,
  initials      VARCHAR(4)  NOT NULL,
  phone         VARCHAR(20),
  city          VARCHAR(50),
  role          VARCHAR(20) NOT NULL CHECK (role IN ('zone_admin', 'volunteer')),
  zone_id       INTEGER REFERENCES zones(id),
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  password_hash VARCHAR(100),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS templates (
  id               SERIAL PRIMARY KEY,
  title            VARCHAR(150) NOT NULL,
  default_zone_id  INTEGER REFERENCES zones(id),
  default_priority VARCHAR(10) NOT NULL DEFAULT 'medium' CHECK (default_priority IN ('high','medium','low')),
  display_order    INTEGER NOT NULL DEFAULT 99,
  is_active        BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS tasks (
  id           SERIAL PRIMARY KEY,
  title        VARCHAR(200) NOT NULL,
  zone_id      INTEGER NOT NULL REFERENCES zones(id),
  assigned_to  INTEGER NOT NULL REFERENCES users(id),
  assigned_by  INTEGER NOT NULL REFERENCES users(id),
  template_id  INTEGER REFERENCES templates(id),
  priority     VARCHAR(10) NOT NULL DEFAULT 'medium' CHECK (priority IN ('high','medium','low')),
  status       VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','in_progress','done')),
  notes        TEXT,
  day_number   INTEGER NOT NULL DEFAULT 1,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  marked_at    TIMESTAMPTZ,
  retroactive  BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS moods (
  id           SERIAL PRIMARY KEY,
  user_id      INTEGER NOT NULL REFERENCES users(id),
  rating       INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  day_number   INTEGER NOT NULL DEFAULT 1,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, day_number)
);

-- ── 2. Indexes ─────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_tasks_zone_id     ON tasks(zone_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tasks_day_number  ON tasks(day_number);
CREATE INDEX IF NOT EXISTS idx_moods_user_day    ON moods(user_id, day_number);

-- ── 3. Zone ────────────────────────────────────────────

INSERT INTO zones (id, name, display_order)
VALUES (1, 'CMZ', 1)
ON CONFLICT (name) DO NOTHING;

-- ── 4. Users ───────────────────────────────────────────
-- NOTE: password_hash is left NULL here.
-- After running this SQL, run the seed script from your
-- local machine to populate the hashes:
--   cd server && npm install && npm run db:seed
-- This will hash each user's ITS number as their password.

INSERT INTO users (id, its, name, initials, city, role, zone_id, is_active)
VALUES
  (1, '20346916', 'Mustafa Hamid', 'MH', 'London', 'zone_admin', 1, TRUE),
  (2, '40481762', 'Aamir Hazari',  'AH', 'London', 'volunteer',  1, TRUE)
ON CONFLICT (its) DO NOTHING;

-- ── 5. Templates ───────────────────────────────────────

INSERT INTO templates (title, default_zone_id, default_priority, display_order, is_active) VALUES
  ('Sanitize work surfaces',                     1, 'high',   1,  TRUE),
  ('Sweep and mop floor',                        1, 'high',   2,  TRUE),
  ('Empty trash bins',                           1, 'medium', 3,  TRUE),
  ('Clean food processing equipment',            1, 'high',   4,  TRUE),
  ('Wipe equipment surfaces',                    1, 'medium', 5,  TRUE),
  ('Clean cold storage',                         1, 'medium', 6,  TRUE),
  ('Clean offices and corridor',                 1, 'low',    7,  TRUE),
  ('Degrease ventilation hoods',                 1, 'medium', 8,  TRUE),
  ('Inspect freezers',                           1, 'high',   9,  TRUE),
  ('Thoroughly clean food processing equipment', 1, 'high',   10, TRUE),
  ('Empty bins, rinse and re-line',              1, 'medium', 11, TRUE),
  ('Wipe all touch points',                      1, 'high',   12, TRUE),
  ('Clean sinks and drains',                     1, 'high',   13, TRUE),
  ('Wash all work surfaces (tables)',            1, 'high',   14, TRUE),
  ('Clean and scrape stoves',                    1, 'high',   15, TRUE),
  ('Wash 4ft walls',                             1, 'medium', 16, TRUE),
  ('Wash and scrub floor',                       1, 'high',   17, TRUE),
  ('Flush drains',                               1, 'medium', 18, TRUE),
  ('Spray pesticide in drains',                  1, 'medium', 19, TRUE)
ON CONFLICT DO NOTHING;

-- ── 6. Fix sequences ───────────────────────────────────

SELECT setval('zones_id_seq',     (SELECT MAX(id) FROM zones));
SELECT setval('users_id_seq',     (SELECT MAX(id) FROM users));
SELECT setval('templates_id_seq', (SELECT MAX(id) FROM templates));

-- ── 7. Verify ──────────────────────────────────────────

SELECT id, its, name, role, zone_id FROM users;
SELECT id, name FROM zones;
SELECT COUNT(*) AS template_count FROM templates;