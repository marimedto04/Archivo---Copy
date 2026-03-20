import { BaseViewModel } from '../../../core/BaseViewModel.js';
import { eventBus } from '../../../shared/utils/eventBus.js';

export class LandingViewModel extends BaseViewModel {
  _initState() {
    this.setState({
      isLoading: false,
    });
  }

  goToLogin() {
    eventBus.emit('landing:goToLogin', {});
  }
}
