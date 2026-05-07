/**
 * genkit.config.ts
 * -----------------
 * Inicializa Genkit con el plugin de Google AI (Gemini + embeddings).
 * Se importa en todos los archivos que necesiten AI.
 *
 * Modelos disponibles con esta config:
 *   LLM:        gemini15Flash  (rápido, gratis 1M tokens/mes)
 *   Embeddings: textEmbedding004 (gratis 1M tokens/mes)
 */

import { genkit, z } from 'genkit'
import { googleAI } from '@genkit-ai/googleai'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Leer la API Key desde variables de entorno
// En local:       functions/.env  →  GOOGLE_AI_KEY=AIzaSy...
// En producción:  Firebase Console → Functions → Variables de entorno
const apiKey = process.env.GOOGLE_AI_KEY

if (!apiKey) {
    console.warn('[Genkit] ADVERTENCIA: GOOGLE_AI_KEY no está configurada.')
}

export const ai = genkit({
    plugins: [
        googleAI({ apiKey }),
    ],
})

// En Genkit 0.9.x, definimos explícitamente el modelo text-embedding-004
// usando el SDK de Google Generative AI directamente para evitar el error de v1beta.
ai.defineEmbedder(
    {
        name: 'googleai/text-embedding-004',
        configSchema: z.any(),
        info: { dimensions: 768, label: 'text-embedding-004', supports: { input: ['text'] } }
    },
    async (input) => {
        const genAI = new GoogleGenerativeAI(apiKey || '')
        const model = genAI.getGenerativeModel({ model: 'gemini-embedding-001' })
        const embeddings = await Promise.all(
            input.map(async (doc) => {
                const result = await model.embedContent(doc.text)
                return { embedding: result.embedding.values }
            })
        )
        return { embeddings }
    }
)