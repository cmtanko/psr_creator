'use strict';

import statusTpl from './dailystatus.html';
import statusController from './dailystatus.controller';

function routeConfig($stateProvider) {
  'ngInject';

  $stateProvider
    .state('status', {
      url: '/status',
      templateUrl: statusTpl,
      controller: statusController,
      controllerAs: 'status'
    });

}

export default routeConfig;
