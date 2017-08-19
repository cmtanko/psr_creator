'use strict';
import spinner from '../assets/images/loading.gif';



function routeConfig($urlRouterProvider, $httpProvider, blockUIConfig) {
    'ngInject';


    $httpProvider.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
    $urlRouterProvider.otherwise('/');

  // configure blockui options
    blockUIConfig.autoBlock = false;
    blockUIConfig.delay = 100;
    blockUIConfig.message = '';
    blockUIConfig.autoInjectBodyBlock = false;
    blockUIConfig.blockBrowserNavigation = true;
    blockUIConfig.template = `
	<span class="block-ui-message">
		<span ng-show="state.blocking"><img src="${spinner}"></span>
	</span>
	`;
}

export default angular
  .module('index.routes', [])
  .config(routeConfig);

