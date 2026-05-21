/**
 * ChatService.js
 * ---------------
 * Servicio del chatbot — llama a las Firebase Cloud Functions
 * en lugar del servidor Express local.
 *
 * Las Cloud Functions usan el protocolo de Firebase Callable Functions:
 *   - Request:  POST  { data: { ...payload } }
 *   - Response: { result: { ...data } }  o  { error: { message } }
 *
 * URL base se configura con la constante FUNCTIONS_BASE.
 * Cambiar a la URL real después de hacer deploy.
 */

// ── URL base de las Cloud Functions ──────────────────────────────────────
//
// Durante desarrollo con emulador:
//   const FUNCTIONS_BASE = 'http://localhost:5001/rag-numi/us-central1'
//
// En producción (reemplazar rag-numi con el ID real del proyecto Firebase):
//   const FUNCTIONS_BASE = 'https://us-central1-rag-numi.cloudfunctions.net'
//
// NOTA: El ID del proyecto Firebase se encuentra en:
//   Firebase Console → Configuración del proyecto → ID del proyecto
//   Ejemplo: si el ID es "rag-numi-abc12", la URL sería:
//   https://us-central1-rag-numi-abc12.cloudfunctions.net

const FUNCTIONS_BASE = 'https://us-central1-rag-numi.cloudfunctions.net'

// ── Helper: llamar a una Cloud Function ──────────────────────────────────

async function callFunction(functionName, payload) {
    const url = `${FUNCTIONS_BASE}/${functionName}`

    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: payload }),
    })

    if (!response.ok) {
        const errorText = await response.text().catch(() => 'Error desconocido')
        throw new Error(`Error ${response.status} en ${functionName}: ${errorText}`)
    }

    const json = await response.json()

    // Firebase Callable Functions devuelve { result: ... } en éxito
    // o { error: { message, status } } en error
    if (json.error) {
        throw new Error(json.error.message || 'Error en la función')
    }

    return json.result ?? json
}

// ── Clase ChatService ─────────────────────────────────────────────────────

class ChatService {

    /**
     * Obtiene las materias disponibles para un nivel educativo.
     * @param {number} level - 1, 2 o 3
     * @returns {Promise<{ subjects: Array }>}
     */
    async getSubjectsByLevel(level) {
        return callFunction('chatbotGetSubjects', { level })
    }

    /**
     * Descarga el contenido completo de una materia para uso offline.
     * @param {string} subjectId - ej: '1-espanol'
     * @returns {Promise<{ subject: object, content: string }>}
     */
    async downloadSubjectContent(subjectId) {
        const url = "https://chatbotgetcontent-avj22f3opa-uc.a.run.app";
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: { subjectId } }),
        });

        if (!response.ok) {
            const errorText = await response.text().catch(() => 'Error desconocido');
            throw new Error(`Error ${response.status} en chatbotGetContent: ${errorText}`);
        }

        const json = await response.json();

        if (json.error) {
            throw new Error(json.error.message || 'Error en la función');
        }

        return json.result ?? json;
    }

    /**
     * Envía una pregunta al chatbot RAG y recibe la respuesta.
     * @param {{ question: string, subjectId: string, level: number }} payload
     * @returns {Promise<{ answer: string }>}
     */
    async askQuestion({ question, subjectId, level }) {
        return callFunction('chatbotAsk', { question, subjectId, level })
    }
}

export const chatService = new ChatService()