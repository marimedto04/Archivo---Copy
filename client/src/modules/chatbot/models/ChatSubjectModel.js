import { BaseModel } from '../../../core/BaseModel.js'

export class ChatSubjectModel extends BaseModel {
    defaults() {
        return { id: null, name: '', slug: '', level: null, icon: '📖', color: '#4CAF50', description: '', content: null }
    }
    validate() {
        const errors = []
        if (!this.get('name')) errors.push('Nombre requerido.')
        if (![1, 2, 3].includes(this.get('level'))) errors.push('Nivel inválido.')
        return { valid: errors.length === 0, errors }
    }
    get isDownloaded() { return this.get('content') !== null }
    get levelLabel() {
        return { 1: 'Grados 1° y 2°', 2: 'Grados 3° y 4°', 3: 'Grado 5°' }[this.get('level')] || ''
    }
}