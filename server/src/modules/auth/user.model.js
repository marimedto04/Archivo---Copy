/**
 * UserModel (server-side)
 * ------------------------
 * Mapea la tabla `users` y expone helpers de consulta.
 * No contiene lógica de negocio — eso va en AuthService.
 */

import db from '../../database/db.js'

export class UserModel {
    // ── Consultas ─────────────────────────────────────────────────────────────

    /**
     * Busca un usuario por email.
     * @param {string} email
     * @returns {object|undefined}
     */
    static findByEmail(email) {
        return db.prepare('SELECT * FROM users WHERE email = ?').get(email)
    }

    /**
     * Busca un usuario por ID.
     * @param {number} id
     * @returns {object|undefined}
     */
    static findById(id) {
        return db.prepare('SELECT * FROM users WHERE id = ?').get(id)
    }

    /**
     * Crea un nuevo usuario.
     * @param {{ email, name, password, character, grade }} data
     * @returns {{ id: number }}
     */
    static create({ email, name = '', password, character = 'pollo', grade = 1 }) {
        const stmt = db.prepare(`
      INSERT INTO users (email, name, password, character, grade)
      VALUES (@email, @name, @password, @character, @grade)
    `)
        const result = stmt.run({ email, name, password, character, grade })
        return { id: result.lastInsertRowid }
    }

    /**
     * Actualiza el perfil de un usuario (name, character).
     * @param {number} id
     * @param {{ name?: string, character?: string, grade?: number }} data
     */
    static updateProfile(id, { name, character, grade }) {
        const fields = []
        const values = {}

        if (name !== undefined) { fields.push('name = @name'); values.name = name }
        if (character !== undefined) { fields.push('character = @character'); values.character = character }
        if (grade !== undefined) { fields.push('grade = @grade'); values.grade = grade }

        if (fields.length === 0) return

        values.id = id
        db.prepare(`UPDATE users SET ${fields.join(', ')} WHERE id = @id`).run(values)
    }

    /**
     * Retorna el usuario sin campos sensibles.
     * @param {object} user — fila cruda de la BD
     * @returns {object}
     */
    static sanitize(user) {
        if (!user) return null
        const { password, ...safe } = user
        return safe
    }
}