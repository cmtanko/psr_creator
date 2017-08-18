'use strict';

import moment from 'moment';
import _ from 'lodash';

class ReportController {
  constructor($log, $base64, reportService) {
    'ngInject';
    $log.debug('Hello from report controller!');

    //SET DEFAULT DATES
    this.initialize();
    this.moment = moment;
    this.base64 = $base64;

    this.reportService = reportService;
  }

  initialize() {
    this.results = [];
    this.currentDate = new Date();
    this.entryStartDate = new Date();
    this.entryEndDate = new Date();
    this.entryStartDate.setDate(this.currentDate.getDate() - 14);
    this.entryEndDate.setDate(this.currentDate.getDate() + 1);
    this.projectStatus = 'On Track';
  }

  getReport(form) {
    if (form.$invalid) return;
    let projectJiraAttrs = {
      endDate: form.until.$viewValue,
      startDate: form.since.$viewValue,
      assignee: form.assignee.$viewValue,
      projectURL: form.projectURL.$viewValue,
      projectName: form.projectName.$viewValue,
      projectStatus: form.projectStatus.$viewValue,
      token: this.base64.encode(form.jiraUsername.$viewValue + ":" + form.jiraPassword.$viewValue),
    }
    this.projectAttrs = projectJiraAttrs;

    this.reportService.getJiraIssues(projectJiraAttrs,
      (data) => {
        this.onReportSuccess(data, projectJiraAttrs);
      }, (data) => {
        if (data.status === 401) {
          this.errorMessage = "Unauthorized, Wrong username or password!"
        } else {
          this.errorMessage = "Error : Unable to retrieve data from JIRA!"
        }
      });
  }

  onReportSuccess(results, projectJiraAttrs) {
    this.results = results;
    this.totalIssuesLastWeek = [];
    this.totalIssuesThisWeek = [];
    var newIssues = [];

    results.forEach((result) => {
      if (moment(projectJiraAttrs.startDate) <= moment(result.task_updated_date) && moment(projectJiraAttrs.endDate) >= moment(result.task_updated_date)) {
        if (moment(result.task_updated_date) <= moment(projectJiraAttrs.endDate) && moment(result.task_updated_date) >= moment(projectJiraAttrs.endDate).subtract(5, "d")) {
          this.totalIssuesThisWeek.push(result);
        } else {
          this.totalIssuesLastWeek.push(result)
        }
      } else {
        if (result.task_status === 'To Do') {
          this.totalIssuesThisWeek.push(result);
        }
      }
    }, this);
  }

  getDate(date) {
    return moment(date).format('MM/DD/YYYY');
  }
}

export default ReportController;
