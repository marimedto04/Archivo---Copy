/**
 * seed.ts — CORREGIDO
 * --------------------
 * Carga las 15 materias en Firestore con sus embeddings.
 * Compatible con @genkit-ai/googleai ^0.9.0
 *
 * Ejecutar en Windows PowerShell:
 *   $env:GOOGLE_AI_KEY="AIzaSy...tu_key"
 *   npx ts-node --skip-project src/chatbot/seed.ts
 *
 * Ejecutar en Mac/Linux:
 *   GOOGLE_AI_KEY=AIzaSy...tu_key npx ts-node --skip-project src/chatbot/seed.ts
 */

import 'dotenv/config'
import admin from 'firebase-admin'
import { SUBJECT_CONTENTS } from './subjects.content'

// ── Inicializar Firebase Admin ─────────────────────────────────────────────
// Si estás corriendo localmente contra producción, necesitas la variable:
// $env:GOOGLE_APPLICATION_CREDENTIALS="ruta/al/service-account.json"
try {
    admin.initializeApp({
        projectId: 'rag-numi'
    })
} catch (error) {
    console.error('Error al inicializar Firebase Admin:', (error as Error).message)
}

const db = admin.firestore()

// ── Verificar API Key ──────────────────────────────────────────────────────
const apiKey = process.env.GOOGLE_AI_KEY
if (!apiKey) {
    console.error('\n❌ ERROR: GOOGLE_AI_KEY no está definida.')
    console.error('Windows PowerShell:')
    console.error('  $env:GOOGLE_AI_KEY="AIzaSy...tu_key"')
    console.error('  npx ts-node --skip-project src/chatbot/seed.ts')
    process.exit(1)
}

// ── Importar Genkit ya configurado ─────────────────────────────────────────
import { ai } from '../config/genkit.config'

// Nombre del modelo de embeddings como string (evita problemas de exports)
const EMBEDDING_MODEL = 'googleai/text-embedding-004'

// ── Helper: dividir texto en chunks ───────────────────────────────────────
function splitText(text: string, maxLen = 480, overlap = 80): string[] {
    const paras = text
        .split(/\n{2,}/)
        .map(p => p.trim())
        .filter(p => p.length > 20)

    const chunks: string[] = []
    let current = ''

    for (const para of paras) {
        if (current.length + para.length + 2 <= maxLen) {
            current += (current ? '\n\n' : '') + para
        } else {
            if (current) {
                chunks.push(current)
                current = current.slice(-overlap) + '\n\n' + para
            } else {
                current = para
            }
        }
    }

    if (current) chunks.push(current)
    return chunks.filter(c => c.length > 20)
}

// ── Helper: pausa entre requests ──────────────────────────────────────────
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))

// ── Helper: extraer vector del resultado de embed ─────────────────────────
function extractVector(embedResult: any): number[] {
    // Genkit puede devolver distintos formatos según la versión
    if (Array.isArray(embedResult)) {
        // Formato: [{ embedding: [...] }]
        if (embedResult[0] && typeof embedResult[0] === 'object' && embedResult[0].embedding) {
            return embedResult[0].embedding
        }
        // Formato: directamente un array de números
        if (typeof embedResult[0] === 'number') {
            return embedResult
        }
    }
    // Formato: { embedding: [...] }
    if (embedResult && embedResult.embedding && Array.isArray(embedResult.embedding)) {
        return embedResult.embedding
    }
    // Formato: { embeddings: [{ values: [...] }] }
    if (embedResult && embedResult.embeddings && embedResult.embeddings[0]?.values) {
        return embedResult.embeddings[0].values
    }
    console.warn('Formato de embedding desconocido:', JSON.stringify(embedResult).slice(0, 100))
    return []
}

// ── Función principal ──────────────────────────────────────────────────────
async function seed() {
    console.log('\n╔══════════════════════════════════════════════╗')
    console.log('║   NUMI — Seed de Firestore con embeddings    ║')
    console.log('╚══════════════════════════════════════════════╝')
    console.log(`\nMaterias a procesar: ${Object.keys(SUBJECT_CONTENTS).length}`)
    console.log('Modelo: text-embedding-004 (768 dimensiones)\n')

    let totalChunks = 0
    let totalSubjects = 0

    for (const [subjectId, subject] of Object.entries(SUBJECT_CONTENTS)) {
        console.log(`\n▶ [${totalSubjects + 1}/15] ${subject.name} — Nivel ${subject.level}`)

        // 1. Guardar metadatos en Firestore
        const { content, ...meta } = subject
        await db.collection('subjects').doc(subjectId).set({
            ...meta,
            content,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        })
        console.log(`   ✅ Guardado en subjects (id: ${subjectId})`)

        // 2. Eliminar chunks anteriores
        const oldSnap = await db
            .collection('subject_chunks')
            .where('subjectId', '==', subjectId)
            .get()

        if (!oldSnap.empty) {
            const batch = db.batch()
            oldSnap.docs.forEach(doc => batch.delete(doc.ref))
            await batch.commit()
            console.log(`   🗑  ${oldSnap.size} chunks anteriores eliminados`)
        }

        // 3. Dividir en chunks
        const chunks = splitText(content)
        console.log(`   📄 ${chunks.length} chunks generados`)

        // 4. Generar embedding y guardar cada chunk
        for (let i = 0; i < chunks.length; i++) {
            const chunkText = chunks[i]

            // Llamar a la API de embeddings
            const embedResult = await ai.embed({
                embedder: EMBEDDING_MODEL,
                content: chunkText,
            })

            const vector = extractVector(embedResult)

            if (vector.length === 0) {
                console.warn(`   ⚠️  Chunk ${i + 1} sin vector — saltando`)
                continue
            }

            // Guardar en Firestore
            await db.collection('subject_chunks').add({
                subjectId,
                chunkIndex: i,
                text: chunkText,
                embedding: vector,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
            })

            console.log(`   📌 Chunk ${i + 1}/${chunks.length} guardado (${vector.length}D)`)

            // Pausa para no exceder rate limit
            if (i < chunks.length - 1) await sleep(350)
        }

        totalChunks += chunks.length
        totalSubjects += 1
        await sleep(500)
    }

    console.log('\n╔══════════════════════════════════════════════╗')
    console.log('║              SEED COMPLETADO ✅              ║')
    console.log('╚══════════════════════════════════════════════╝')
    console.log(`\n  Materias : ${totalSubjects}`)
    console.log(`  Chunks   : ${totalChunks}`)
    console.log('\nVerifica en Firebase Console → Firestore → subjects y subject_chunks\n')
    process.exit(0)
}

seed().catch(err => {
    console.error('\n❌ Error en el seed:', err.message)
    console.error(err.stack)
    process.exit(1)
})