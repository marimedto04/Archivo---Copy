"use strict";
/**
 * subjects.content.ts
 * --------------------
 * Contenido educativo ampliado para 3 niveles de primaria.
 * Diseñado para:
 * - aprendizaje progresivo
 * - RAG / embeddings en Firestore
 * - chatbot educativo para niños
 * - contexto cercano: casa, escuela, barrio y vereda
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SUBJECT_CONTENTS = void 0;
const level1_content_1 = require("./content/level1.content");
const level2_content_1 = require("./content/level2.content");
const level3_content_1 = require("./content/level3.content");
exports.SUBJECT_CONTENTS = {
    ...level1_content_1.LEVEL_1_CONTENTS,
    ...level2_content_1.LEVEL_2_CONTENTS,
    ...level3_content_1.LEVEL_3_CONTENTS,
};
//# sourceMappingURL=subjects.content.js.map