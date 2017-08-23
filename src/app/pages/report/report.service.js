'use strict';
class ReportService {
    constructor($resource) {
        'ngInject';
        this.$resource = $resource;
    }

    getJiraIssues(query, successFn, failFn) {
        let payload = {
            'from': query.startDate,
            'to': query.endDate,
            'url': query.projectURL,
            'title': query.projectName,
            'assignee': query.assignee,
            'status': query.projectStatus,
            'token': query.token
        };
        let url = 'https://psrgenerator.herokuapp.com';
        this.$resource(url + '/api/report',
            {},
            {
                post: {
                    method: 'POST',
                    headers: { 'Authorization': 'Basic ' + query.token }
                }
            }).post(payload).$promise.then((data) => {
                successFn(data.result);
            })
            .catch((data) => {
                failFn(data);
            });
    }
}

export default ReportService;
