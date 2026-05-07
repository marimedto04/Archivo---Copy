"use strict";
/**
 * math-solver.ts
 * ----------------
 * Interceptor para resolver operaciones matemáticas básicas (sumas y restas)
 * antes de enviar la pregunta al sistema RAG, enfocado en estudiantes de Nivel 1.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.solveBasicMath = solveBasicMath;
function solveBasicMath(question) {
    // Busca un patrón de "número + número" o "número - número" dentro de la pregunta
    // Ejemplos que detecta: "2 + 3", "cuánto es 5 + 7", "resuelve 20 - 8"
    const regex = /(\d+)\s*([\+\-])\s*(\d+)/;
    const match = question.match(regex);
    if (!match) {
        return null; // No es una operación matemática básica, continuar con el flujo normal
    }
    const num1 = Number(match[1]);
    const operator = match[2];
    const num2 = Number(match[3]);
    // Validación por seguridad
    if (isNaN(num1) || isNaN(num2)) {
        return null;
    }
    // Respuesta educativa para sumas
    if (operator === '+') {
        const result = num1 + num2;
        return `Para resolver la suma juntamos cantidades.\n${num1} + ${num2} = ${result}.\nLa respuesta es ${result}.`;
    }
    // Respuesta educativa para restas
    if (operator === '-') {
        const result = num1 - num2;
        return `Para resolver la resta quitamos una cantidad de otra.\n${num1} - ${num2} = ${result}.\nLa respuesta es ${result}.`;
    }
    return null;
}
//# sourceMappingURL=math-solver.js.map