var _ = require('lodash');
var moment = require('moment');

var reportController = function (reportService, querystring) {
    var userInfo = {};
    var queryParam = {};

    var onRepoDataRetrivedSuccessfully = function (repoDatas, res) {
        reportService.getGitCommitsReport(repoDatas, function (err, reportDatas) {
            reportService.getUserList(repoDatas, function (err, userDatas) {
                var commitsByUsers = [];
                userDatas.forEach(function (a) {
                    var newObject = {
                        'user': a,
                        'commits': []
                    };
                    var counter = 1;
                    reportDatas.forEach(function (r) {
                        if (a === r.committedBy) {
                            r.id = counter++;
                            newObject['commits'].push(r);
                        }
                    }, this);
                    commitsByUsers.push(newObject);
                }, this);

                res.render('reportView', {
                    reportPage: 'Hello from report Page',
                    repoDatas: repoDatas,
                    userInfo: userInfo,
                    queryParam: queryParam,
                    commitsByUsers: commitsByUsers
                });
            });
        });
    };

    var onReportSuccess = function (results, query, res) {

        var totalIssuesLastWeek = [];
        var totalIssuesThisWeek = [];
        var newIssues = [];
        _.each(JSON.parse(results), function (result) {
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

        res.render('reportView', {
            reportPage: 'Hello from report Page',
            repoDatas: 'repoDatas',
            userInfo: query,
            queryParam: 'queryParam',
            commitsByUsers: 'commitsByUsers',
            startDate: moment(query.from).format('MM/DD/YYYY'),
            endDate: moment(query.to).format('MM/DD/YYYY'),
            currentDate: moment(query.today).format('MM/DD/YYYY'),
            lastWeekIssues: _.sortBy(totalIssuesLastWeek, ['task_status', 'task_id']),
            thisWeekIssues: _.sortBy(totalIssuesThisWeek, ['task_status', 'task_id'])
        });
    }

    var getReport = function (req, res) {
        var query = req.query;


        userInfo = {};
        userInfo['username'] = query['username'];
        userInfo['reponame'] = query['reponame'];
        userInfo['token'] = query['token'] === undefined || query['token'] === '' ? '' : 'Basic ' + query['token'];

        query.username = undefined;
        query.reponame = undefined;
        query.token = undefined;
        queryParam = _.omitBy(query, _.isEmpty || _.isUndefined);

        let queryParamStr = {
            from: new Date(query.since),
            to: new Date(query.until),
            today: new Date()
        };

        //ASSIGNEE IS IMPORTANT
        if (!userInfo.username) {
            res.render('reportView', {});
            return;
        }

        reportService.getJiraIssues(queryParamStr, userInfo, function (err, results) {

            if (err || results.length === 0) {
                res.render('reportView', {
                    errorMessage: err
                });
                return;
            }
            onReportSuccess(results, queryParamStr, res);
        });
    };
    return {
        getReport: getReport
    };
};

module.exports = reportController;