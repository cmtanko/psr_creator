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
        let url = 'https://psrgenerator.herokuapp.com'
        this.$resource(url + '/api/status',
            {},
            {
                post: {
                    method: 'POST',
                    headers: { 'Authorization': 'token ' + query.token }
                }
            }).post(payload).$promise.then((data) => {
                successFn(data);
            })
            .catch((data) => {
                failFn(data);
            });
    }
}

export default GitReportService;
