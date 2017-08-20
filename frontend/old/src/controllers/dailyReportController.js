var _ = require('lodash');

var dailyReportController = function (dailyReportService, querystring) {
    var userInfo = {};
    var queryParam = {};

    var onRepoDataRetrivedSuccessfully = function (repoDatas, res) {
        dailyReportService.getGitCommitsReport(repoDatas, function (err, reportDatas) {
            dailyReportService.getUserList(repoDatas, function (err, userDatas) {
                var commitsByUsers = [];
                userDatas.forEach(function (a) {
                    var newObject = {
                        'user': a,
                        'commits': []
                    };
                    var counter = 1;
                    let totalTimeSpent = 0;

                    reportDatas.forEach(function (r) {
                        totalTimeSpent += (r.taskTimeSpent / 60);
                        if (a === r.committedBy) {
                            r.id = counter++;
                            newObject['commits'].push(r);
                            newObject['totalTime'] =  Math.round(totalTimeSpent);
                        }
                    }, this);
                    commitsByUsers.push(newObject);
                }, this);

                res.render('dailyReportView', {
                    reportPage: 'Hello from report Page',
                    repoDatas: repoDatas,
                    userInfo: userInfo,
                    queryParam: queryParam,
                    commitsByUsers: commitsByUsers
                });
            });
        });
    };

    var getReport = function (req, res) {
        var query = req.query;

        userInfo = {};
        userInfo['username'] = query['username'];
        userInfo['reponame'] = query['reponame'];
        userInfo['token'] = query['token'] === undefined || query['token'] === '' ? '' : 'token ' + query['token'];

        query.username = undefined;
        query.reponame = undefined;
        query.token = undefined;
        queryParam = _.omitBy(query, _.isEmpty || _.isUndefined);

        var today = new Date();

        if (!userInfo.username || !userInfo.reponame) {
            res.render('dailyReportView', {
                errorMessage: 'git username and reponame is required'
            });
            return;
        } else {
            var queryParamStr = querystring.stringify(queryParam);
            dailyReportService.getGitCommits(query['date'], userInfo, function (err, repoDatas) {
                if (err) {
                    res.render('', {
                        errorMessage: err
                    });
                    return;
                }
                onRepoDataRetrivedSuccessfully(repoDatas, res);
            });
        }
    };
    return {
        getReport: getReport
    };
};

module.exports = dailyReportController;