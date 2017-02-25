var request = require('request');
var _ = require('lodash');
var headers = {
    'user-agent': 'node.js'
}


var reportService = function (querystring) {
    var getGitCommits = function (queryParamStr, userInfo, cb) {
        console.log('toke = ' + userInfo.token);
        console.log('https://api.github.com/repos/' + userInfo.username + '/' + userInfo.reponame + '/commits?' + queryParamStr);

        if (userInfo.token !== undefined && userInfo.token.trim() !== "") {
            console.log('...' + JSON.stringify(userInfo));
            headers['Authorization'] = userInfo.token;
        }
        console.log(JSON.stringify(headers));

        request.get({
            uri: 'https://api.github.com/repos/' + userInfo.username + '/' + userInfo.reponame + '/commits?' + queryParamStr,
            method: 'GET',
            headers: headers
        }, function (err, response, body) {
            if (response.statusCode === 200) {
                console.log('error =' + JSON.stringify(response));
                var results = JSON.parse(body);
                console.log("result= " + results.message);
                var repoDatas = [];

                results.forEach(function (c) {
                    var repoData = {
                        commitMessage: c.commit.message,
                        committedBy: c.commit.committer.name,
                        committedDate: c.commit.committer.date,
                    }
                    repoDatas.push(repoData);
                }, this);
                cb(null, repoDatas);
            } else {
                cb(JSON.stringify(response.body), repoDatas);
            }


        });
    };

    var getCleanSplittedData = function (data, splitBy) {
        switch (splitBy) {
            case 'space': {
                return data.trim().split(' ')[0].trim();
            }
            case '-m': {
                var messageDetail = data.trim().split('-m')[1];
                return messageDetail === undefined ? data.trim() : messageDetail.split('-')[0].trim();
            }
            case '-t': {
                var timeDetail = data.trim().split('-t')[1];
                return timeDetail === undefined ? "0 mins" : timeDetail.split('-')[0].trim();
            }
            case '-s': {
                var statusDetail = data.trim().split('-s')[1];
                return statusDetail === undefined ? "In Progress" : statusDetail.split('-')[0].trim();
            }
            default:
                return data;
        }
    }

    var getProjectStatus = function (status) {
        status = status.toLowerCase();
        if (status === "wip" || status === "progress" || status === "in progress") {
            return "In Progress";
        } else if (status === "completed" || status === "complete") {
            return "Completed";
        } else {
            return "In Progress";
        }
    }
    var getTimeInMins = function (timeSpent) {
        var timeInMin = '';
        if (!_.isNumber(parseFloat(timeSpent))) {
            timeInMin = '0 mins';
        }
        if ((timeSpent.indexOf('h') !== -1 || timeSpent.indexOf('H') !== -1)
            && (timeSpent.indexOf('m') !== -1 || timeSpent.indexOf('M') !== -1)) {
            var hourSplit = timeSpent.split('h')[0].trim();
            var minSplit = timeSpent.split('m')[0].trim().split(' ');
            timeInMin = parseFloat(hourSplit) * 60 + parseFloat(minSplit[minSplit.length - 1]);
        } else if (timeSpent.indexOf('h') !== -1 || timeSpent.indexOf('H') !== -1) {
            timeInMin = parseFloat(timeSpent) * 60;
        } else if (timeSpent.indexOf('m') !== -1 || timeSpent.indexOf('M') !== -1) {
            timeInMin = parseFloat(timeSpent);
        } else if (timeSpent < 8) {
            timeInMin = parseFloat(timeSpent) * 60;
        } else {
            timeInMin = parseFloat(timeSpent);
        }
        return timeInMin;
    }

    var getGitCommitsReport = function (repoDatas, cb) {
        var reportDatas = [];
        repoDatas.forEach(function (c) {
            var commitMessage = _.get(c, 'commitMessage') || '';
            var reportData = {
                committedBy: c.committedBy || '',
                committedDate: c.committedDate || '',
                taskId: getCleanSplittedData(commitMessage, 'space'),
                taskTitle: getCleanSplittedData(commitMessage, '-m'),
                taskTimeSpent: getTimeInMins(getCleanSplittedData(commitMessage, '-t')),
                taskStatus: getProjectStatus(getCleanSplittedData(commitMessage, '-s'))
            }
            reportDatas.push(reportData);
        }, this);

        //LETS MERGE COMMITS FOR SAME TASK, TIME SPENT IS ADDED, COMMIT MESSESS WOULD BE THE FIRST COMMIT
        var mergedCommitsDetail = [];
        for (var i = 0; i < reportDatas.length; i++) {
            for (var j = i + 1; j < reportDatas.length; j++) {
                if (reportDatas[i].taskId === reportDatas[j].taskId) {
                    reportDatas[i].taskTitle = reportDatas[j].taskTitle;
                    reportDatas[i].taskTimeSpent = reportDatas[i].taskTimeSpent + reportDatas[j].taskTimeSpent;
                    reportDatas[j].isUnique = false;
                } else {

                }
            }
            mergedCommitsDetail.push(reportDatas[i]);
        }

        //LETS REMOVE ALL THE NON-UNIQUE TASKS
        var finalCommitsReport = [];
        _.each(mergedCommitsDetail, function (a) {
            if (a.isUnique === undefined) {
                finalCommitsReport.push(a);
            }
        });

        //REMOVE MERGED COMMITS
        var noAutoGeneratedCommitsReport = [];
        _.each(finalCommitsReport, function (a) {
            if (a.committedBy !== "GitHub") {
                noAutoGeneratedCommitsReport.push(a);
            }
        });
        cb(null, noAutoGeneratedCommitsReport);
    };

    return {
        getGitCommits: getGitCommits,
        getGitCommitsReport: getGitCommitsReport
    };
};

module.exports = reportService;