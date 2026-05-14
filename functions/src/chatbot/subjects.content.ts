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

import { espanolLevel1 } from './content/espanol-level1.content';
import { matematicasLevel1 } from './content/matematicas-level1.content';
import { cienciasLevel1 } from './content/ciencias-level1.content';
import { socialesLevel1 } from './content/sociales-level1.content';
import { inglesLevel1 } from './content/ingles-level1.content';
import { espanolLevel2 } from './content/espanol-level2.content';
import { matematicasLevel2 } from './content/matematicas-level2.content';
import { cienciasLevel2 } from './content/ciencias-level2.content';
import { socialesLevel2 } from './content/sociales-level2.content';
import { inglesLevel2 } from './content/ingles-level2.content';
import { espanolLevel3 } from './content/espanol-level3.content';
import { matematicasLevel3 } from './content/matematicas-level3.content';
import { cienciasLevel3 } from './content/ciencias-level3.content';
import { socialesLevel3 } from './content/sociales-level3.content';
import { inglesLevel3 } from './content/ingles-level3.content';

export interface SubjectData {
    name: string
    level: number // 1 | 2 | 3
    slug: string
    icon: string
    color: string
    description: string
    content: string
}

export const SUBJECT_CONTENTS: Record<string, SubjectData> = {
    '1-espanol': espanolLevel1,
    '1-matematicas': matematicasLevel1,
    '1-ciencias': cienciasLevel1,
    '1-sociales': socialesLevel1,
    '1-ingles': inglesLevel1,
    '2-espanol': espanolLevel2,
    '2-matematicas': matematicasLevel2,
    '2-ciencias': cienciasLevel2,
    '2-sociales': socialesLevel2,
    '2-ingles': inglesLevel2,
    '3-espanol': espanolLevel3,
    '3-matematicas': matematicasLevel3,
    '3-ciencias': cienciasLevel3,
    '3-sociales': socialesLevel3,
    '3-ingles': inglesLevel3,
};
