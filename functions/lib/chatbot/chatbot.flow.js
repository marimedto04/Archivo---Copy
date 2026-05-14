"use strict";
/**
 * chatbot.flow.ts — CORREGIDO
 * ----------------------------
 * Compatible con @genkit-ai/googleai ^0.9.0
 * Usa referencias de modelo como string en lugar de named exports.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSubjectContent = exports.getSubjects = exports.askChatbot = void 0;
const genkit_config_1 = require("../config/genkit.config");
const firestore_1 = require("firebase-admin/firestore");
const zod_1 = require("zod");
const math_solver_1 = require("./math-solver");
// Modelos como strings — evita problemas con named exports según versión
const GEMINI_FLASH = 'googleai/gemini-2.0-flash';
const EMBEDDING_MODEL = 'googleai/text-embedding-004';
// ── Schemas ────────────────────────────────────────────────────────────────
const AskInputSchema = zod_1.z.object({
    question: zod_1.z.string().min(1).max(500),
    subjectId: zod_1.z.string().min(1),
    level: zod_1.z.number().int().min(1).max(3),
});
const AskOutputSchema = zod_1.z.object({
    answer: zod_1.z.string(),
});
const SubjectsInputSchema = zod_1.z.object({
    level: zod_1.z.number().int().min(1).max(3),
});
const SubjectsOutputSchema = zod_1.z.object({
    subjects: zod_1.z.array(zod_1.z.object({
        id: zod_1.z.string(),
        name: zod_1.z.string(),
        slug: zod_1.z.string(),
        level: zod_1.z.number(),
        icon: zod_1.z.string(),
        color: zod_1.z.string(),
        description: zod_1.z.string(),
    })),
});
// ── Helpers ────────────────────────────────────────────────────────────────
function cosine(a, b) {
    if (!a?.length || !b?.length || a.length !== b.length)
        return 0;
    let dot = 0, na = 0, nb = 0;
    for (let i = 0; i < a.length; i++) {
        dot += a[i] * b[i];
        na += a[i] * a[i];
        nb += b[i] * b[i];
    }
    return (na === 0 || nb === 0) ? 0 : dot / (Math.sqrt(na) * Math.sqrt(nb));
}
function gradeLabel(level) {
    if (level === 1)
        return 'grados 1° y 2°';
    if (level === 2)
        return 'grados 3° y 4°';
    return 'grado 5°';
}
function extractVector(embedResult) {
    if (Array.isArray(embedResult)) {
        if (embedResult[0] && typeof embedResult[0] === 'object' && embedResult[0].embedding) {
            return embedResult[0].embedding;
        }
        if (typeof embedResult[0] === 'number')
            return embedResult;
    }
    if (embedResult?.embedding && Array.isArray(embedResult.embedding)) {
        return embedResult.embedding;
    }
    if (embedResult?.embeddings?.[0]?.values) {
        return embedResult.embeddings[0].values;
    }
    return [];
}
// ══════════════════════════════════════════════════════════════════════════
// FLOW 1: askChatbot — RAG completo
// ══════════════════════════════════════════════════════════════════════════
exports.askChatbot = genkit_config_1.ai.defineFlow({
    name: 'askChatbot',
    inputSchema: AskInputSchema,
    outputSchema: AskOutputSchema,
}, async ({ question, subjectId, level }) => {
    // 0. Interceptor matemático (Nivel 1)
    if (level === 1) {
        const mathAnswer = (0, math_solver_1.solveBasicMath)(question);
        if (mathAnswer !== null) {
            return { answer: mathAnswer };
        }
    }
    // 1. Convertir pregunta en vector
    const embedResult = await genkit_config_1.ai.embed({
        embedder: EMBEDDING_MODEL,
        content: question.trim(),
    });
    const questionVector = extractVector(embedResult);
    if (!questionVector.length) {
        return { answer: 'Hubo un problema procesando tu pregunta. Intenta de nuevo. 😊' };
    }
    // 2. Obtener chunks de Firestore
    const db = (0, firestore_1.getFirestore)();
    const snap = await db
        .collection('subject_chunks')
        .where('subjectId', '==', subjectId)
        .get();
    if (snap.empty) {
        return {
            answer: 'No encontré contenido para esta materia. ' +
                'Pídele a tu profe que lo configure. 😊',
        };
    }
    // 3. Calcular similitud coseno y tomar top 3
    const scored = snap.docs
        .map(doc => {
        const data = doc.data();
        return {
            text: data.text,
            score: cosine(questionVector, data.embedding),
        };
    })
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
        .filter(c => c.score > 0.08);
    if (scored.length === 0) {
        return {
            answer: 'Hmm 🤔 esa pregunta no parece estar en el contenido de esta materia. ' +
                '¿Me puedes preguntar algo sobre los temas que estudiamos aquí? 😊',
        };
    }
    // 4. Construir contexto
    const context = scored.map(c => c.text).join('\n\n---\n\n');
    // 5. Llamar a Gemini Flash directamente con el SDK para evitar errores de validación en Genkit 0.9.x
    const { GoogleGenerativeAI } = await Promise.resolve().then(() => __importStar(require('@google/generative-ai')));
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY || '');
    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });
    const prompt = `Eres NUMI, un asistente educativo amigable para estudiantes de ${gradeLabel(level)} de primaria en Colombia.
REGLAS:
1. Responde ÚNICAMENTE con base en el texto de contexto dado.
2. Si la pregunta no tiene respuesta en el contexto, díselo amablemente.
3. Usa lenguaje simple y claro para niños.
4. Máximo 120 palabras.
5. Usa emojis ocasionalmente.
6. Responde en español colombiano.
7. NO inventes información que no esté en el contexto.
8. IMPORTANTE: NO saludes ni te presentes (ej. no digas "Hola", "Soy NUMI"). Ve directamente a la respuesta.

Contexto:
---
${context}
---

Pregunta: ${question}`;
    const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 2048, temperature: 0.3 }
    });
    const text = result.response.text();
    return {
        answer: text?.trim() ?? 'No pude responder ahora. ¿Intentas de nuevo? 😊',
    };
});
// ══════════════════════════════════════════════════════════════════════════
// FLOW 2: getSubjects
// ══════════════════════════════════════════════════════════════════════════
exports.getSubjects = genkit_config_1.ai.defineFlow({
    name: 'getSubjects',
    inputSchema: SubjectsInputSchema,
    outputSchema: SubjectsOutputSchema,
}, async ({ level }) => {
    const db = (0, firestore_1.getFirestore)();
    const snap = await db
        .collection('subjects')
        .where('level', '==', level)
        .get();
    const subjects = snap.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name ?? '',
        slug: doc.data().slug ?? '',
        level: doc.data().level ?? level,
        icon: doc.data().icon ?? '📖',
        color: doc.data().color ?? '#4CAF50',
        description: doc.data().description ?? '',
    }));
    subjects.sort((a, b) => a.name.localeCompare(b.name));
    return { subjects };
});
// ══════════════════════════════════════════════════════════════════════════
// FLOW 3: getSubjectContent
// ══════════════════════════════════════════════════════════════════════════
exports.getSubjectContent = genkit_config_1.ai.defineFlow({
    name: 'getSubjectContent',
    inputSchema: zod_1.z.object({ subjectId: zod_1.z.string() }),
    outputSchema: zod_1.z.object({ subject: zod_1.z.any(), content: zod_1.z.string() }),
}, async ({ subjectId }) => {
    const db = (0, firestore_1.getFirestore)();
    const doc = await db.collection('subjects').doc(subjectId).get();
    if (!doc.exists) {
        throw new Error(`Materia ${subjectId} no encontrada.`);
    }
    const data = doc.data();
    return {
        subject: { id: doc.id, ...data, content: undefined },
        content: data.content ?? '',
    };
});
//# sourceMappingURL=chatbot.flow.js.map