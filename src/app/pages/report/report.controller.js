'use strict';

import moment from 'moment';
import _ from 'lodash';

class ReportController {
  constructor($log, reportService) {
    'ngInject';
    $log.debug('Hello from report controller!');

    //SET DEFAULT DATES
    this.initialize();

    this.reportService = reportService;
  }

  initialize() {
    this.currentStartDate = new Date();
    this.entryStartDate = new Date();
    this.entryEndDate = new Date();
    this.entryStartDate.setDate(this.currentStartDate.getDate() - 14);
    this.entryEndDate.setDate(this.currentStartDate.getDate() + 1);
    this.projectStatus = 'On Track';
  }

  getReport(form) {
    if (form.$invalid) return;

    let projectJiraAttrs = {
      username: form.username.$viewValue,
      projectName: form.projectName.$viewValue,
      projectStatus: form.projectStatus.$viewValue,
      startDate: moment(form.since.$viewValue),
      endDate: moment(form.until.$viewValue),
      token: form.token.$viewValue,
    }

    this.reportService.getJiraIssues(projectJiraAttrs,
      (data) => {
        this.onReportSuccess(data.issues, projectJiraAttrs);
      }, (data) => {
        console.log(data);
      });
  }

  onReportSuccess(results, projectJiraAttrs) {

    var totalIssuesLastWeek = [];
    var totalIssuesThisWeek = [];
    var newIssues = [];
    _.each(results, function (result) {
      debugger;
      if (moment(query.from) <= moment(result.task_updated_date) && moment(query.to) >= moment(result.task_updated_date)) {
        if (moment(result.task_updated_date) <= moment(query.to) && moment(result.task_updated_date) >= moment(query.to).subtract(5, "d")) {
          totalIssuesThisWeek.push(result);
        } else {
          totalIssuesLastWeek.push(result)
        }
      } else {
        if (result.task_status === 'To Do') {
          totalIssuesThisWeek.push(result);
        }
      }
    }, this);
  }
}

export default ReportController;
