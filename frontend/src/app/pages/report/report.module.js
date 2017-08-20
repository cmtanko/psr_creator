'use strict';

import route from './report.route';
import service from './report.service';
import angular from 'angular';

const reportPageModule = angular.module('report-module', [
    'ui.router'
]);

reportPageModule
  .config(route)
  .service('reportService',service).name;


export default reportPageModule;
