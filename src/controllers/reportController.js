var reportController = function (reportService, querystring) {
    var userInfo = {};
    var queryParam = {};

    var onRepoDataRetrivedSuccessfully = function (repoDatas, res) {
        reportService.getGitCommitsReport(repoDatas, function (err, reportDatas) {
            reportService.getUserList(repoDatas, function (err, userDatas) {
                console.log(userDatas);
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
        queryParam = {};
        userInfo = {};
        var today = new Date();
        if (query.since !== '' && query.since !== undefined) {
            queryParam['since'] = query.since;
        }
        if (query.until !== '' && query.until !== undefined) {
            queryParam['until'] = query.until;
        }
        if (query.author !== '' && query.author !== undefined) {
            queryParam['author'] = query.author;
        }
        queryParam['per_page'] = '100';
        if (query.sha !== '' && query.sha !== undefined) {
            queryParam['sha'] = query['sha']
        }

        userInfo['username'] = query['username'];
        userInfo['reponame'] = query['reponame'];
        userInfo['token'] = query['token'] === undefined || query['token'] === '' ? '' : 'token ' + query['token'];
        if (userInfo.username === undefined || userInfo.reponame === undefined || userInfo.username === '' || userInfo.reponame === '') {
            res.render('reportView', {
                errorMessage: 'username and reponame is required'
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
                onRepoDataRetrivedSuccessfully(repoDatas, res)
            });
        }
    }


    return {
        getReport: getReport
    };


};

module.exports = reportController;