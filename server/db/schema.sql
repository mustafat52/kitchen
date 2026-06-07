-- ── Kitchen Cleaning Task Manager — DB Schema ──
-- Run this once against your PostgreSQL database

-- Users
CREATE TABLE IF NOT EXISTS users (
  id         SERIAL PRIMARY KEY,
  its        VARCHAR(20) UNIQUE NOT NULL,
  name       VARCHAR(100) NOT NULL,
  initials   VARCHAR(4)  NOT NULL,
  phone      VARCHAR(20),
  city       VARCHAR(50),
  role       VARCHAR(20) NOT NULL CHECK (role IN ('zone_admin', 'volunteer')),
  zone_id    INTEGER,
  is_active  BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Zones
CREATE TABLE IF NOT EXISTS zones (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(50) UNIQUE NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 1
);

-- Templates
CREATE TABLE IF NOT EXISTS templates (
  id                SERIAL PRIMARY KEY,
  title             VARCHAR(150) NOT NULL,
  default_zone_id   INTEGER REFERENCES zones(id),
  default_priority  VARCHAR(10) NOT NULL DEFAULT 'medium' CHECK (default_priority IN ('high','medium','low')),
  display_order     INTEGER NOT NULL DEFAULT 99,
  is_active         BOOLEAN NOT NULL DEFAULT TRUE
);

-- Tasks
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

-- Moods
CREATE TABLE IF NOT EXISTS moods (
  id           SERIAL PRIMARY KEY,
  user_id      INTEGER NOT NULL REFERENCES users(id),
  rating       INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  day_number   INTEGER NOT NULL DEFAULT 1,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, day_number)
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_tasks_zone_id     ON tasks(zone_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tasks_day_number  ON tasks(day_number);
CREATE INDEX IF NOT EXISTS idx_moods_user_day    ON moods(user_id, day_number);
