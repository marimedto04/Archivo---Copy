import { BaseModel } from '../../../core/BaseModel.js';

export class DownloadModel extends BaseModel {
    defaults() {
        return {};
    }
    validate() {
        return true;
    }
}
