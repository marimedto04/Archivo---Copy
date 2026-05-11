import { BaseModel } from '../../../core/BaseModel.js';
import imgMatematicas from '../../../../assets/styles/images/ia-numi/matematicas.png';
import imgSociales from '../../../../assets/styles/images/ia-numi/sociales.png';
import imgNaturales from '../../../../assets/styles/images/ia-numi/naturales.png';
import imgIngles from '../../../../assets/styles/images/ia-numi/ingles.png';
import imgEspanol from '../../../../assets/styles/images/ia-numi/espanol.png';

export class IaNumiModel extends BaseModel {
  defaults() {
    return {
      subjects: [
        {
          id: 'matematicas',
          name: 'Matemáticas',
          color: '#3b82f6',
          icon: imgMatematicas
        },
        {
          id: 'sociales',
          name: 'Ciencias Sociales',
          color: '#f97316',
          icon: imgSociales
        },
        {
          id: 'naturales',
          name: 'Ciencias Naturales',
          color: '#22c55e',
          icon: imgNaturales
        },
        {
          id: 'ingles',
          name: 'Inglés',
          color: '#a855f7',
          icon: imgIngles
        },
        {
          id: 'espanol',
          name: 'Español',
          color: '#f43f5e',
          icon: imgEspanol
        }
      ]
    };
  }

  validate(data) {
    const errors = {};
    return Object.keys(errors).length === 0 ? null : errors;
  }
}
