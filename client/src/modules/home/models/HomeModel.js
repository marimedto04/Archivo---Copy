import { BaseModel } from '../../../core/BaseModel.js';

export class HomeModel extends BaseModel {
  defaults() {
    return {};
  }

  validate() {
    return true;
  }
}
