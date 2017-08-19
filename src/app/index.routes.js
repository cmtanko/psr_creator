'use strict';



function routeConfig($urlRouterProvider,$httpProvider) {
  'ngInject';


  $httpProvider.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
  $urlRouterProvider.otherwise('/');

}

export default angular
  .module('index.routes', [])
    .config(routeConfig);

