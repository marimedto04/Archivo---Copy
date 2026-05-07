"use strict";
/**
 * index.ts — CORREGIDO para Genkit 0.9.x
 * -----------------------------------------
 * En Genkit 0.9.x los flows son funciones callable directamente.
 * Se llaman como: await askChatbot(input)
 * NO existe runFlow — el flow ES la función.
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
exports.chatbotGetContent = exports.chatbotGetSubjects = exports.chatbotAsk = void 0;
const app_1 = require("firebase-admin/app");
const https = __importStar(require("firebase-functions/v2/https"));
const chatbot_flow_1 = require("./chatbot/chatbot.flow");
// Inicializar Firebase Admin
(0, app_1.initializeApp)();
// ── chatbotAsk ─────────────────────────────────────────────────────────────
exports.chatbotAsk = https.onRequest({ cors: true, timeoutSeconds: 60, invoker: 'public' }, async (req, res) => {
    if (req.method === 'OPTIONS') {
        res.status(204).send('');
        return;
    }
    if (req.method !== 'POST') {
        res.status(405).send('Method Not Allowed');
        return;
    }
    try {
        // En Genkit 0.9.x el flow se llama directamente como función
        const input = req.body?.data ?? req.body;
        const result = await (0, chatbot_flow_1.askChatbot)(input);
        res.status(200).json({ result });
    }
    catch (err) {
        console.error('[chatbotAsk]', err.message);
        res.status(500).json({ error: { message: err.message } });
    }
});
// ── chatbotGetSubjects ─────────────────────────────────────────────────────
exports.chatbotGetSubjects = https.onRequest({ cors: true, timeoutSeconds: 30, invoker: 'public' }, async (req, res) => {
    if (req.method === 'OPTIONS') {
        res.status(204).send('');
        return;
    }
    if (req.method !== 'POST') {
        res.status(405).send('Method Not Allowed');
        return;
    }
    try {
        const input = req.body?.data ?? req.body;
        const result = await (0, chatbot_flow_1.getSubjects)(input);
        res.status(200).json({ result });
    }
    catch (err) {
        console.error('[chatbotGetSubjects]', err.message);
        res.status(500).json({ error: { message: err.message } });
    }
});
// ── chatbotGetContent ──────────────────────────────────────────────────────
exports.chatbotGetContent = https.onRequest({ cors: true, timeoutSeconds: 30, invoker: 'public' }, async (req, res) => {
    if (req.method === 'OPTIONS') {
        res.status(204).send('');
        return;
    }
    if (req.method !== 'POST') {
        res.status(405).send('Method Not Allowed');
        return;
    }
    try {
        const input = req.body?.data ?? req.body;
        const result = await (0, chatbot_flow_1.getSubjectContent)(input);
        res.status(200).json({ result });
    }
    catch (err) {
        console.error('[chatbotGetContent]', err.message);
        res.status(500).json({ error: { message: err.message } });
    }
});
//# sourceMappingURL=index.js.map