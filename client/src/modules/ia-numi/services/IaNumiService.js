import { httpClient } from '../../../shared/utils/httpClient.js';

/**
 * IaNumiService
 * -------------
 * Capa de SERVICIOS. Maneja las peticiones HTTP relacionadas con IA Numi.
 */
export class IaNumiService {
  /**
   * Obtiene la configuración o datos iniciales para IA Numi.
   * @returns {Promise<any>}
   */
  async getInitialData() {
    // Ejemplo de llamada a la API usando httpClient
    // const response = await httpClient.get('/ia-numi/config');
    // return response;
    
    // Por ahora retornamos una promesa resuelta
    return Promise.resolve({ success: true, subjects: [] });
  }

  /**
   * Envía una consulta a la IA para una materia específica.
   * @param {string} subjectId 
   * @param {string} query 
   * @returns {Promise<any>}
   */
  async askIA(subjectId, query) {
    return await httpClient.post(`/ia-numi/ask`, { subjectId, query });
  }
}
