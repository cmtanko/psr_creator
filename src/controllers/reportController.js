var _ = require('lodash');

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

                console.log(commitsByUsers);
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
            res.render('reportView', {
                errorMessage: 'git username and reponame is required'
            });
            return;
        } else {
            var queryParamStr = querystring.stringify(queryParam);
            reportService.getGitCommits(queryParamStr, userInfo, function (err, repoDatas) {
                if (err) {
                    res.render('reportView', {
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

module.exports = reportController;