'use strict';

import headerDirective from './header.directive';
import './header.scss';

const headerModule = angular.module('header-module', []);

headerModule
  .directive('headerComponent', headerDirective);

export default headerModule;
