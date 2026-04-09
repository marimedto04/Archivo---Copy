import { BaseModel } from '../../../core/BaseModel.js'

export class ChatMessageModel extends BaseModel {
    defaults() {
        return { id: null, role: 'user', text: '', timestamp: null }
    }
    validate() {
        const errors = []
        if (!this.get('text')?.trim()) errors.push('El mensaje no puede estar vacío.')
        if (!['user', 'assistant', 'error'].includes(this.get('role'))) errors.push('Rol inválido.')
        return { valid: errors.length === 0, errors }
    }
}