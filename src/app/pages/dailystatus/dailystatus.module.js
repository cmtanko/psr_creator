'use strict';

import route from './dailystatus.route';

const dailyStatusPageModule = angular.module('status-module', [
  'ui.router'
]);

dailyStatusPageModule
    .config(route);

export default dailyStatusPageModule;
