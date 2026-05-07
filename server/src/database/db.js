/**
 * db.js
 * ------
 * Conexión y configuración de la base de datos SQLite.
 * Crea las tablas si no existen al arrancar el servidor.
 *
 * Regla: Este módulo es el único que importa better-sqlite3 directamente.
 * Regla: Los Services acceden a la BD a través de este singleton.
 */

import Database from 'better-sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Carpeta data/ junto al src/ del servidor
const DATA_DIR = path.resolve(__dirname, '../../data')
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })

const DB_PATH = path.join(DATA_DIR, 'numi.db')

// Crear conexión singleton
const db = new Database(DB_PATH)

// Activar WAL para mejor rendimiento en lecturas concurrentes
db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

// ── Crear tablas ──────────────────────────────────────────────────────────────

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    email       TEXT    NOT NULL UNIQUE,
    name        TEXT    NOT NULL DEFAULT '',
    password    TEXT    NOT NULL,
    character   TEXT    NOT NULL DEFAULT 'pollo',
    grade       INTEGER NOT NULL DEFAULT 1,
    role        TEXT    NOT NULL DEFAULT 'student',
    created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS subjects (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT    NOT NULL,
    slug        TEXT    NOT NULL,
    level       INTEGER NOT NULL,
    icon        TEXT    NOT NULL DEFAULT '📖',
    color       TEXT    NOT NULL DEFAULT '#4CAF50',
    description TEXT    NOT NULL DEFAULT ''
  );

  CREATE TABLE IF NOT EXISTS chat_history (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subject_id  INTEGER NOT NULL,
    role        TEXT    NOT NULL,
    message     TEXT    NOT NULL,
    created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS progress (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id         INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subject_id      INTEGER NOT NULL,
    questions_count INTEGER NOT NULL DEFAULT 0,
    last_session    TEXT    NOT NULL DEFAULT (datetime('now')),
    UNIQUE(user_id, subject_id)
  );
`)

export default db