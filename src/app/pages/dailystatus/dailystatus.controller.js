'use strict';

import moment from 'moment';

class DailyStatusController {
    constructor($log, $base64, dailyReportService) {
        'ngInject';
        $log.debug('Hello from report controller!');

        // SET DEFAULT DATES
        this.initialize();
        this.moment = moment;
        this.dailyReportService = dailyReportService;
    }

    initialize() {
        this.results = [];
        this.currentDate = new Date();
        this.currentDate.setDate(this.currentDate.getDate());
    }

    getReport(form) {
        if (form.$invalid) { return; }
        let gitAttrs = {
            date: form.date.$viewValue,
            username: form.username.$viewValue,
            reponame: form.reponame.$viewValue,
            token: form.token.$viewValue,
        };
        this.dailyReportService.getGitReport(gitAttrs,
            (data) => {
                this.onGitDataRetrievedSuccess(data, gitAttrs);
            }, (data) => {
                if (data.status === 401) {
                    this.errorMessage = 'Unauthorized, Wrong username or password!';
                } else {
                    this.errorMessage = 'Error : Unable to retrieve data from JIRA!';
                }
            });
    }

    onGitDataRetrievedSuccess(results, gitAttrs) {
        this.repoDatas = results;
        this.dailyReportService.getGitCommitsReport(results,
            (commits) => {
                this.dailyReportService.getUserList(commits, (userDatas) => {
                    this.commitsByUsers = [];
                    userDatas.forEach(function (a) {
                        let newObject = {
                            'user': a,
                            'commits': []
                        };
                        let counter = 1;
                        let totalTimeSpent = 0;

                        commits.forEach(function (r) {
                            totalTimeSpent += (r.taskTimeSpent / 60);
                            if (a === r.committedBy) {
                                r.id = counter++;
                                newObject['commits'].push(r);
                                newObject['totalTime'] = Math.round(totalTimeSpent);
                            }
                        }, this);
                        this.commitsByUsers.push(newObject);
                    }, this);
                });
            },
            (data) => {
                debugger;
            });
    }

    getDate(date) {
        return moment(date).format('MM/DD/YYYY');
    }
}

export default DailyStatusController;
