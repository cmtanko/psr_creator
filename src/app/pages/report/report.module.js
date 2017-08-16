'use strict';

import route from './report.route';

const reportPageModule = angular.module('report-module', [
  'ui.router'
]);

reportPageModule
    .config(route);

export default reportPageModule;
