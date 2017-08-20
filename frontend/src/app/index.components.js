'use strict';

import footerModule from './components/footer/footer.module';
import headerModule from './components/header/header.module';
export default angular.module('index.components', [
	footerModule.name, headerModule.name
]);
