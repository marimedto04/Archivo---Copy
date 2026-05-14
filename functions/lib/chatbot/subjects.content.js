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
const espanol_level1_content_1 = require("./content/espanol-level1.content");
const matematicas_level1_content_1 = require("./content/matematicas-level1.content");
const ciencias_level1_content_1 = require("./content/ciencias-level1.content");
const sociales_level1_content_1 = require("./content/sociales-level1.content");
const ingles_level1_content_1 = require("./content/ingles-level1.content");
const espanol_level2_content_1 = require("./content/espanol-level2.content");
const matematicas_level2_content_1 = require("./content/matematicas-level2.content");
const ciencias_level2_content_1 = require("./content/ciencias-level2.content");
const sociales_level2_content_1 = require("./content/sociales-level2.content");
const ingles_level2_content_1 = require("./content/ingles-level2.content");
const espanol_level3_content_1 = require("./content/espanol-level3.content");
const matematicas_level3_content_1 = require("./content/matematicas-level3.content");
const ciencias_level3_content_1 = require("./content/ciencias-level3.content");
const sociales_level3_content_1 = require("./content/sociales-level3.content");
const ingles_level3_content_1 = require("./content/ingles-level3.content");
exports.SUBJECT_CONTENTS = {
    '1-espanol': espanol_level1_content_1.espanolLevel1,
    '1-matematicas': matematicas_level1_content_1.matematicasLevel1,
    '1-ciencias': ciencias_level1_content_1.cienciasLevel1,
    '1-sociales': sociales_level1_content_1.socialesLevel1,
    '1-ingles': ingles_level1_content_1.inglesLevel1,
    '2-espanol': espanol_level2_content_1.espanolLevel2,
    '2-matematicas': matematicas_level2_content_1.matematicasLevel2,
    '2-ciencias': ciencias_level2_content_1.cienciasLevel2,
    '2-sociales': sociales_level2_content_1.socialesLevel2,
    '2-ingles': ingles_level2_content_1.inglesLevel2,
    '3-espanol': espanol_level3_content_1.espanolLevel3,
    '3-matematicas': matematicas_level3_content_1.matematicasLevel3,
    '3-ciencias': ciencias_level3_content_1.cienciasLevel3,
    '3-sociales': sociales_level3_content_1.socialesLevel3,
    '3-ingles': ingles_level3_content_1.inglesLevel3,
};
//# sourceMappingURL=subjects.content.js.map