import { BaseViewModel } from '../../../core/BaseViewModel.js';
import { DownloadModel } from '../models/DownloadModel.js';

export class DownloadViewModel extends BaseViewModel {
    constructor(options = {}) {
        const model = options.model || new DownloadModel();
        super({ ...options, model });
    }

    _initState() {
        super._initState();
    }
}
