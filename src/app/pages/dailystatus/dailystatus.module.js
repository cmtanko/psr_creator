'use strict';

import route from './dailystatus.route';
import angular from 'angular';
import service from './dailystatus.service';

const dailyStatusPageModule = angular.module('status-module', [
    'ui.router'
]);

dailyStatusPageModule
  .config(route)
  .service('dailyReportService', service).name;

export default dailyStatusPageModule;
