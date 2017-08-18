'use strict';

class ReportService {
    constructor($resource) {
        'ngInject';
        this.$resource = $resource;
        this.url = 'https://lftechnology.atlassian.net/rest/api/latest/search';
    }

    getJiraIssues(query, successFn, failFn) {
        console.log('from service= ' + query);
        let promise = this.$resource(this.url + '?jql=assignee=' + query.username + '&maxResults=' + '100',
            {},
            {
                get: {
                    method: 'GET',
                    headers: { 'Authorization': 'Basic ' + query.token }
                }
            }).get().$promise.then((data) => {
                successFn(data);
            })
            .catch((data) => {
                failFn(data);
            })
        // headers.Authorization = userInfo.token;
        // request.get({
        //     uri: 'https://lftechnology.atlassian.net/rest/api/latest/search?jql=assignee=' + userInfo.username + '&maxResults=100',
        //     method: 'GET',
        //     headers: headers
        // }, function (err, response, body) {
        //     if (response.statusCode === 200) {
        //         var results = JSON.parse(body).issues;
        //         var issues = [];
        //         _.each(results, function (result) {
        //             if (_.get(result, 'fields.status.name') !== 'Done') {
        //                 issues.push({
        //                     task_id: result.key,
        //                     task_type: _.get(result, 'fields.issuetype.name'),
        //                     task_description: _.get(result, 'fields.summary'),
        //                     task_creation_date: _.get(result, 'fields.created'),
        //                     task_updated_date: _.get(result, 'fields.updated'),
        //                     task_assignee: _.get(result, 'fields.assignee.displayName'),
        //                     task_status: getStatus(_.get(result, 'fields.status.name'))
        //                 });
        //             }
        //         }, this);
        //     }
        // }
    }
}

export default ReportService;