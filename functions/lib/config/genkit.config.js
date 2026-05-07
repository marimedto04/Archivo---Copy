"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ai = void 0;
const genkit_1 = require("genkit");
const googleai_1 = require("@genkit-ai/googleai");
const generative_ai_1 = require("@google/generative-ai");
// Leer la API Key desde variables de entorno
// En local:       functions/.env  →  GOOGLE_AI_KEY=AIzaSy...
// En producción:  Firebase Console → Functions → Variables de entorno
const apiKey = process.env.GOOGLE_AI_KEY;
if (!apiKey) {
    console.warn('[Genkit] ADVERTENCIA: GOOGLE_AI_KEY no está configurada.');
}
exports.ai = (0, genkit_1.genkit)({
    plugins: [
        (0, googleai_1.googleAI)({ apiKey }),
    ],
});
// En Genkit 0.9.x, definimos explícitamente el modelo text-embedding-004
// usando el SDK de Google Generative AI directamente para evitar el error de v1beta.
exports.ai.defineEmbedder({
    name: 'googleai/text-embedding-004',
    configSchema: genkit_1.z.any(),
    info: { dimensions: 768, label: 'text-embedding-004', supports: { input: ['text'] } }
}, async (input) => {
    const genAI = new generative_ai_1.GoogleGenerativeAI(apiKey || '');
    const model = genAI.getGenerativeModel({ model: 'gemini-embedding-001' });
    const embeddings = await Promise.all(input.map(async (doc) => {
        const result = await model.embedContent(doc.text);
        return { embedding: result.embedding.values };
    }));
    return { embeddings };
});
//# sourceMappingURL=genkit.config.js.map