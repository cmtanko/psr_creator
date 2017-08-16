'use strict';

import moment from 'moment';
import _ from 'lodash';

class ReportController {
  constructor($log) {
    'ngInject';
    $log.debug('Hello from report controller!');

    console.log('Hello wolrd');
    this.abc = "Suchan";
  }

  getReport(form) {
    let projectJiraAttrs = {
      username: form.username.$viewValue,
      projectName: form.projectName.$viewValue,
      projectStatus: form.projectStatus.$viewValue,
      startDate: moment(form.since.$viewValue),
      endDate: moment(form.until.$viewValue),
      token: form.token.$viewValue,
    }
    console.log(projectJiraAttrs);
  }
}

export default ReportController;
