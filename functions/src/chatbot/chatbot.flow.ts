/**
 * chatbot.flow.ts — CORREGIDO
 * ----------------------------
 * Compatible con @genkit-ai/googleai ^0.9.0
 * Usa referencias de modelo como string en lugar de named exports.
 */

import { ai } from '../config/genkit.config'
import { getFirestore } from 'firebase-admin/firestore'
import { z } from 'zod'
import { solveBasicMath } from './math-solver'

// Modelos como strings — evita problemas con named exports según versión
const GEMINI_FLASH = 'googleai/gemini-2.0-flash'
const EMBEDDING_MODEL = 'googleai/text-embedding-004'

// ── Schemas ────────────────────────────────────────────────────────────────

const AskInputSchema = z.object({
    question: z.string().min(1).max(500),
    subjectId: z.string().min(1),
    level: z.number().int().min(1).max(3),
})

const AskOutputSchema = z.object({
    answer: z.string(),
})

const SubjectsInputSchema = z.object({
    level: z.number().int().min(1).max(3),
})

const SubjectsOutputSchema = z.object({
    subjects: z.array(z.object({
        id: z.string(),
        name: z.string(),
        slug: z.string(),
        level: z.number(),
        icon: z.string(),
        color: z.string(),
        description: z.string(),
    })),
})

// ── Helpers ────────────────────────────────────────────────────────────────

function cosine(a: number[], b: number[]): number {
    if (!a?.length || !b?.length || a.length !== b.length) return 0
    let dot = 0, na = 0, nb = 0
    for (let i = 0; i < a.length; i++) {
        dot += a[i] * b[i]
        na += a[i] * a[i]
        nb += b[i] * b[i]
    }
    return (na === 0 || nb === 0) ? 0 : dot / (Math.sqrt(na) * Math.sqrt(nb))
}

function gradeLabel(level: number): string {
    if (level === 1) return 'grados 1° y 2°'
    if (level === 2) return 'grados 3° y 4°'
    return 'grado 5°'
}

function extractVector(embedResult: any): number[] {
    if (Array.isArray(embedResult)) {
        if (embedResult[0] && typeof embedResult[0] === 'object' && embedResult[0].embedding) {
            return embedResult[0].embedding
        }
        if (typeof embedResult[0] === 'number') return embedResult
    }
    if (embedResult?.embedding && Array.isArray(embedResult.embedding)) {
        return embedResult.embedding
    }
    if (embedResult?.embeddings?.[0]?.values) {
        return embedResult.embeddings[0].values
    }
    return []
}

// ══════════════════════════════════════════════════════════════════════════
// FLOW 1: askChatbot — RAG completo
// ══════════════════════════════════════════════════════════════════════════

export const askChatbot = ai.defineFlow(
    {
        name: 'askChatbot',
        inputSchema: AskInputSchema,
        outputSchema: AskOutputSchema,
    },
    async ({ question, subjectId, level }) => {

        // 0. Interceptor matemático (Nivel 1)
        if (level === 1) {
            const mathAnswer = solveBasicMath(question)
            if (mathAnswer !== null) {
                return { answer: mathAnswer }
            }
        }

        // 1. Convertir pregunta en vector
        const embedResult = await ai.embed({
            embedder: EMBEDDING_MODEL,
            content: question.trim(),
        })

        const questionVector = extractVector(embedResult)

        if (!questionVector.length) {
            return { answer: 'Hubo un problema procesando tu pregunta. Intenta de nuevo. 😊' }
        }

        // 2. Obtener chunks de Firestore
        const db = getFirestore()
        const snap = await db
            .collection('subject_chunks')
            .where('subjectId', '==', subjectId)
            .get()

        if (snap.empty) {
            return {
                answer: 'No encontré contenido para esta materia. ' +
                    'Pídele a tu profe que lo configure. 😊',
            }
        }

        // 3. Calcular similitud coseno y tomar top 3
        const scored = snap.docs
            .map(doc => {
                const data = doc.data()
                return {
                    text: data.text as string,
                    score: cosine(questionVector, data.embedding as number[]),
                }
            })
            .sort((a, b) => b.score - a.score)
            .slice(0, 3)
            .filter(c => c.score > 0.08)

        if (scored.length === 0) {
            return {
                answer: 'Hmm 🤔 esa pregunta no parece estar en el contenido de esta materia. ' +
                    '¿Me puedes preguntar algo sobre los temas que estudiamos aquí? 😊',
            }
        }

        // 4. Construir contexto
        const context = scored.map(c => c.text).join('\n\n---\n\n')

        // 5. Llamar a Gemini Flash directamente con el SDK para evitar errores de validación en Genkit 0.9.x
        const { GoogleGenerativeAI } = await import('@google/generative-ai')
        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY || '')
        const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' })

        const prompt = `Eres NUMI, un asistente educativo amigable para estudiantes de ${gradeLabel(level)} de primaria en Colombia.
REGLAS:
1. Responde ÚNICAMENTE con base en el texto de contexto dado.
2. Si la pregunta no tiene respuesta en el contexto, díselo amablemente.
3. Usa lenguaje simple y claro para niños.
4. Máximo 120 palabras.
5. Usa emojis ocasionalmente.
6. Responde en español colombiano.
7. NO inventes información que no esté en el contexto.

Contexto:
---
${context}
---

Pregunta: ${question}`

        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: { maxOutputTokens: 2048, temperature: 0.3 }
        })
        const text = result.response.text()

        return {
            answer: text?.trim() ?? 'No pude responder ahora. ¿Intentas de nuevo? 😊',
        }
    }
)

// ══════════════════════════════════════════════════════════════════════════
// FLOW 2: getSubjects
// ══════════════════════════════════════════════════════════════════════════

export const getSubjects = ai.defineFlow(
    {
        name: 'getSubjects',
        inputSchema: SubjectsInputSchema,
        outputSchema: SubjectsOutputSchema,
    },
    async ({ level }) => {
        const db = getFirestore()
        const snap = await db
            .collection('subjects')
            .where('level', '==', level)
            .get()

        const subjects = snap.docs.map(doc => ({
            id: doc.id,
            name: doc.data().name ?? '',
            slug: doc.data().slug ?? '',
            level: doc.data().level ?? level,
            icon: doc.data().icon ?? '📖',
            color: doc.data().color ?? '#4CAF50',
            description: doc.data().description ?? '',
        }))

        subjects.sort((a, b) => a.name.localeCompare(b.name))
        return { subjects }
    }
)

// ══════════════════════════════════════════════════════════════════════════
// FLOW 3: getSubjectContent
// ══════════════════════════════════════════════════════════════════════════

export const getSubjectContent = ai.defineFlow(
    {
        name: 'getSubjectContent',
        inputSchema: z.object({ subjectId: z.string() }),
        outputSchema: z.object({ subject: z.any(), content: z.string() }),
    },
    async ({ subjectId }) => {
        const db = getFirestore()
        const doc = await db.collection('subjects').doc(subjectId).get()

        if (!doc.exists) {
            throw new Error(`Materia ${subjectId} no encontrada.`)
        }

        const data = doc.data()!
        return {
            subject: { id: doc.id, ...data, content: undefined },
            content: data.content ?? '',
        }
    }
)