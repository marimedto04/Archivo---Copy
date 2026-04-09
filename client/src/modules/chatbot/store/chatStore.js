const STORAGE_KEY = 'edural_chatbot_contents'

class ChatStore {
    constructor() {
        this._contents = new Map()
        this._history = new Map()
        this._listeners = []
        this._restore()
    }

    getContent(subjectId) { return this._contents.get(subjectId) ?? null }
    getHistory(subjectId) { return this._history.get(subjectId) ?? [] }
    isDownloaded(subjectId) { return this._contents.has(subjectId) }

    saveContent(subjectId, content) {
        this._contents.set(subjectId, content)
        this._persist()
        this._notify()
    }

    addMessage(subjectId, msg) {
        if (!this._history.has(subjectId)) this._history.set(subjectId, [])
        this._history.get(subjectId).push(msg)
        this._notify()
    }

    clearHistory(subjectId) {
        this._history.set(subjectId, [])
        this._notify()
    }

    subscribe(cb) {
        this._listeners.push(cb)
        return () => { this._listeners = this._listeners.filter(f => f !== cb) }
    }

    _persist() {
        try {
            const obj = {}
            this._contents.forEach((v, k) => { obj[k] = v })
            localStorage.setItem(STORAGE_KEY, JSON.stringify(obj))
        } catch { /* sin espacio */ }
    }

    _restore() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY)
            if (!raw) return
            Object.entries(JSON.parse(raw)).forEach(([k, v]) => this._contents.set(Number(k), v))
        } catch { /* datos corruptos */ }
    }

    _notify() { this._listeners.forEach(f => f()) }
}

export const chatStore = new ChatStore()