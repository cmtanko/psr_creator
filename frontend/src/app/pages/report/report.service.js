'use strict';
import _ from 'lodash';

class ReportService {
    constructor($resource) {
        'ngInject';
        this.$resource = $resource;
    }

    getJiraIssues(query, successFn, failFn) {
        this.$resource(query.projectURL + '/rest/api/latest/search?jql=assignee=' + query.assignee + '&maxResults=' + '100',
            {},
            {
                get: {
                    method: 'GET',
                    headers: { 'Authorization': 'Basic ' + query.token }
                }
            }).get().$promise.then((data) => {
                let results = data.issues;
                let issues = [];
                _.each(results, (result) => {
                    if (_.get(result, 'fields.status.name') !== 'Done') {
                        issues.push({
                            task_id: result.key,
                            task_type: _.get(result, 'fields.issuetype.name'),
                            task_description: _.get(result, 'fields.summary'),
                            task_creation_date: _.get(result, 'fields.created'),
                            task_updated_date: _.get(result, 'fields.updated'),
                            task_assignee: _.get(result, 'fields.assignee.displayName'),
                            task_status: this.getStatus(_.get(result, 'fields.status.name'))
                        });
                    }
                }, this);
                successFn(_.sortBy(issues, ['task_status', 'task_id']));
            })
            .catch((data) => {
                failFn(data);
            });
    }

    getStatus(statusCode) {
        if (statusCode === 'In Progress') { return 'In Progress'; }
        else if (statusCode === 'Ready For Testing') { return 'Completed'; }
        else if (statusCode === 'Selected for Development') { return 'To Do'; }
     
        return statusCode;
    }
}

export default ReportService;
