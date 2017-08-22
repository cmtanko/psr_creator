'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = (0, _express.Router)();
var getStatus = function getStatus(statusCode) {
  if (statusCode === 'In Progress') {
    return 'In Progress';
  } else if (statusCode === 'Ready For Testing') {
    return 'Completed';
  } else if (statusCode === 'Selected for Development') {
    return 'To Do';
  }

  return statusCode;
};
router.get('/abc', function (req, res, next) {
  res.send('asdfasdfsdf');
});

router.post('/', function (req, res, next) {
  var query = req.body;
  _axios2.default.get(query.url + '/rest/api/latest/search?jql=assignee=' + query.assignee + '&maxResults=' + '100', {
    method: 'GET',
    headers: { 'Authorization': 'Basic ' + query.token }
  }).then(function (data) {
    var results = data.data.issues;
    var issues = [];
    _lodash2.default.each(results, function (result) {
      if (_lodash2.default.get(result, 'fields.status.name') !== 'Done') {
        issues.push({
          task_id: result.key,
          task_type: _lodash2.default.get(result, 'fields.issuetype.name'),
          task_description: _lodash2.default.get(result, 'fields.summary'),
          task_creation_date: _lodash2.default.get(result, 'fields.created'),
          task_updated_date: _lodash2.default.get(result, 'fields.updated'),
          task_assignee: _lodash2.default.get(result, 'fields.assignee.displayName'),
          task_status: getStatus(_lodash2.default.get(result, 'fields.status.name'))
        });
      }
    }, undefined);
    results = _lodash2.default.sortBy(issues, ['task_status', 'task_id']);
    res.send({ 'result': results });
  }).catch(function (data) {
    res.send({ 'error': 'Unable to fetch data!' });
  });
});

exports.default = router;
//# sourceMappingURL=report.controller.js.map