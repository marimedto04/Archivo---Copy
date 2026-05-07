/**
 * index.ts — CORREGIDO para Genkit 0.9.x
 * -----------------------------------------
 * En Genkit 0.9.x los flows son funciones callable directamente.
 * Se llaman como: await askChatbot(input)
 * NO existe runFlow — el flow ES la función.
 */

import { initializeApp } from 'firebase-admin/app'
import * as https from 'firebase-functions/v2/https'
import { askChatbot, getSubjects, getSubjectContent } from './chatbot/chatbot.flow'

// Inicializar Firebase Admin
initializeApp()

// ── chatbotAsk ─────────────────────────────────────────────────────────────
export const chatbotAsk = https.onRequest(
    { cors: true, timeoutSeconds: 60, invoker: 'public' },
    async (req, res) => {
        if (req.method === 'OPTIONS') { res.status(204).send(''); return }
        if (req.method !== 'POST') { res.status(405).send('Method Not Allowed'); return }

        try {
            // En Genkit 0.9.x el flow se llama directamente como función
            const input = req.body?.data ?? req.body
            const result = await askChatbot(input)
            res.status(200).json({ result })
        } catch (err: any) {
            console.error('[chatbotAsk]', err.message)
            res.status(500).json({ error: { message: err.message } })
        }
    }
)

// ── chatbotGetSubjects ─────────────────────────────────────────────────────
export const chatbotGetSubjects = https.onRequest(
    { cors: true, timeoutSeconds: 30, invoker: 'public' },
    async (req, res) => {
        if (req.method === 'OPTIONS') { res.status(204).send(''); return }
        if (req.method !== 'POST') { res.status(405).send('Method Not Allowed'); return }

        try {
            const input = req.body?.data ?? req.body
            const result = await getSubjects(input)
            res.status(200).json({ result })
        } catch (err: any) {
            console.error('[chatbotGetSubjects]', err.message)
            res.status(500).json({ error: { message: err.message } })
        }
    }
)

// ── chatbotGetContent ──────────────────────────────────────────────────────
export const chatbotGetContent = https.onRequest(
    { cors: true, timeoutSeconds: 30, invoker: 'public' },
    async (req, res) => {
        if (req.method === 'OPTIONS') { res.status(204).send(''); return }
        if (req.method !== 'POST') { res.status(405).send('Method Not Allowed'); return }

        try {
            const input = req.body?.data ?? req.body
            const result = await getSubjectContent(input)
            res.status(200).json({ result })
        } catch (err: any) {
            console.error('[chatbotGetContent]', err.message)
            res.status(500).json({ error: { message: err.message } })
        }
    }
)