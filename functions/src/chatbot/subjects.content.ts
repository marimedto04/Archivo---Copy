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

import { LEVEL_1_CONTENTS } from './content/level1.content';
import { LEVEL_2_CONTENTS } from './content/level2.content';
import { LEVEL_3_CONTENTS } from './content/level3.content';

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
    ...LEVEL_1_CONTENTS,
    ...LEVEL_2_CONTENTS,
    ...LEVEL_3_CONTENTS,
};
