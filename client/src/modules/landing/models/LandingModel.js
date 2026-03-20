import { BaseModel } from '../../../core/BaseModel.js';

export class LandingModel extends BaseModel {
  defaults() {
    return {
      title: 'Bienvenido a la Arquitectura MVVM',
      description: 'Una experiencia moderna y premium para el desarrollo web en JS vanilla.'
    };
  }

  validate() {
    return true;
  }
}
