import { BaseViewModel } from '../../../core/BaseViewModel.js';
import { HomeModel } from '../models/HomeModel.js';

export class HomeViewModel extends BaseViewModel {
  constructor(options = {}) {
    const model = options.model || new HomeModel();
    super({ ...options, model });
  }

  _initState() {
    super._initState();
  }
}
