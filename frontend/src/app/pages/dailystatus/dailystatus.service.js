'use strict';
import _ from 'lodash';
import moment from 'moment';

class GitReportService {
    constructor($resource) {
        'ngInject';
        this.$resource = $resource;
    }

    getUserList(repoDatas, successFn) {
        let userList = [];
        repoDatas.forEach(function (r) {
            if (_.get(r, 'committedBy')) {
                if (!_.includes(userList, r.committedBy) && r.committedBy.toLowerCase() !== 'github') {
                    userList.push(r.committedBy);
                }
            }
        }, this);
        successFn(userList);
    }

    getGitReport(query, successFn, failFn) {
        let payload = {
            'date': query.date,
            'reponame': query.reponame,
            'username': query.username,
            'token': query.token
        };
        let url = window.location.protocol + '//' + window.location.hostname + ':3000';
        this.$resource(url + '/api/status',
            {},
            {
                post: {
                    method: 'POST',
                    headers: { 'Authorization': 'token ' + query.token }
                }
            }).post(payload).$promise.then((data) => {
                this.repoDatas = [];
                let results = data.result;
                results.forEach(function (c) {
                    let createdDate = moment(c.created_at).format('YYYY-MM-DD');
                    let queryDate = moment(query.date).format('YYYY-MM-DD');
                    let repoData = {};
                    if (createdDate === queryDate && c.type === 'PushEvent') {
                        c.payload.commits.forEach(function (commit) {
                            if (_.get(commit, 'message').toLowerCase().indexOf('merged') === -1) {
                                repoData = {
                                    commitMessage: commit.message,
                                    committedBy: commit.author.email,
                                    committedDate: c.created_at,
                                };
                            }
                            this.repoDatas.push(repoData);
                        }, this);
                    }

                    if (createdDate === queryDate && c.type === 'PullRequestEvent') {
                        this.$resource(_.get(c.payload.pull_request, 'commits_url'),
                            {},
                            {
                                get: {
                                    method: 'GET',
                                    isArray: true,
                                    headers: { 'Authorization': 'token ' + query.token }
                                }
                            }).get().$promise.then((results) => {
                                repoData = {
                                    commitMessage: results[0].commit.message,
                                    committedBy: results[0].commit.author.email,
                                    committedDate: results[0].commit.author.date,
                                };
                                this.repoDatas.push(repoData);
                            });
                    }
                }, this);

                setTimeout(() => {
                    this.repoDatas.push({});
                    successFn(this.repoDatas);
                }, 8000);
            })
            .catch((data) => {
                failFn(data);
            });
    }


    getGitCommitsReport(repoDatas, successFn, failFn) {
        let reportDatas = [];
        repoDatas.forEach(function (c) {
            let commitMessage = _.get(c, 'commitMessage') || '';
            let reportData = {
                committedBy: c.committedBy || '',
                committedDate: c.committedDate || '',
                taskId: this.getCleanSplittedData(commitMessage, 'space'),
                taskTitle: this.getCleanSplittedData(commitMessage, '-m'),
                taskTimeSpent: this.getTimeInMins(this.getCleanSplittedData(commitMessage, '-t')),
                taskStatus: this.getProjectStatus(this.getCleanSplittedData(commitMessage, '-s'))
            };
            reportDatas.push(reportData);
        }, this);

        // LETS MERGE COMMITS FOR SAME TASK, TIME SPENT IS ADDED, COMMIT MESSESS WOULD BE THE FIRST COMMIT
        let mergedCommitsDetail = [];
        for (let i = 0; i < reportDatas.length; i++) {
            for (let j = i + 1; j < reportDatas.length; j++) {
                if (reportDatas[i].taskId === reportDatas[j].taskId) {
                    reportDatas[i].taskTitle = reportDatas[j].taskTitle;
                    reportDatas[i].taskTimeSpent = reportDatas[i].taskTimeSpent + reportDatas[j].taskTimeSpent;
                    reportDatas[j].isUnique = false;
                }
            }
            mergedCommitsDetail.push(reportDatas[i]);
        }

        // LETS REMOVE ALL THE NON-UNIQUE TASKS
        let finalCommitsReport = [];
        _.each(mergedCommitsDetail, function (a) {
            if (a.isUnique === undefined) {
                finalCommitsReport.push(a);
            }
        });

        // REMOVE MERGED COMMITS
        let noAutoGeneratedCommitsReport = [];
        _.each(finalCommitsReport, function (a) {
            if (a.committedBy !== 'GitHub') {
                noAutoGeneratedCommitsReport.push(a);
            }
        });
        successFn(noAutoGeneratedCommitsReport);
    }

    getCleanSplittedData(data, splitBy) {
        switch (splitBy) {
            case 'space': {
                return data.trim().split(' ')[0].trim();
            }
            case '-m': {
                let messageDetail = data.trim().split('-m')[1];

                return messageDetail === undefined ? data.trim() : messageDetail.split('-')[0].trim();
            }
            case '-t': {
                let timeDetail = data.trim().split('-t')[1];

                return timeDetail === undefined ? '0 mins' : timeDetail.split('-')[0].trim();
            }
            case '-s': {
                let statusDetail = data.trim().split('-s')[1];

                return statusDetail === undefined ? 'In Progress' : statusDetail.split('-')[0].trim();
            }
            default:
                return data;
        }
    }

    getTimeInMins(timeSpent) {
        let timeInMin = '';
        if (!_.isNumber(parseFloat(timeSpent))) {
            timeInMin = '0 mins';
        }
        if (timeSpent.toLowerCase().indexOf('h') !== -1 && timeSpent.toLowerCase().indexOf('m') !== -1) {
            let hourSplit = timeSpent.toLowerCase().split('h')[0].trim();
            let minSplit = timeSpent.toLowerCase().split('m')[0].trim().split(' ');
            timeInMin = parseFloat(hourSplit) * 60 + parseFloat(minSplit[minSplit.length - 1]);
        } else if (timeSpent.toLowerCase().indexOf('h') !== -1) {
            timeInMin = parseFloat(timeSpent) * 60;
        } else if (timeSpent.toLowerCase().indexOf('m') !== -1) {
            timeInMin = parseFloat(timeSpent);
        } else if (timeSpent < 8) {
            timeInMin = parseFloat(timeSpent) * 60;
        } else {
            timeInMin = parseFloat(timeSpent);
        }

        return timeInMin;
    }

    getProjectStatus(status) {
        status = status.toLowerCase();
        if (status === 'wip' || status === 'progress' || status === 'in progress' || status === 'inprogress') {
            return 'In Progress';
        } else if (status === 'completed' || status === 'complete') {
            return 'Completed';
        } else {
            return 'In Progress';
        }
    };

}

export default GitReportService;
