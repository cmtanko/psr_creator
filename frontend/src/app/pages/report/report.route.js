'use strict';

import reportTpl from './report.html';
import reportController from './report.controller';

function routeConfig($stateProvider) {
    'ngInject';

    $stateProvider
    .state('report', {
        url: '/report',
        templateUrl: reportTpl,
        controller: reportController,
        controllerAs: 'ctrl'
    });

}

export default routeConfig;
