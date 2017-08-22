import { Router } from 'express';
import axios from 'axios';
import _ from 'lodash';

const router = Router();
const getStatus = (statusCode) => {
  if (statusCode === 'In Progress') { return 'In Progress'; }
  else if (statusCode === 'Ready For Testing') { return 'Completed'; }
  else if (statusCode === 'Selected for Development') { return 'To Do'; }

  return statusCode;
};
router.get('/abc', (req,res,next) =>{
  res.send('asdfasdfsdf');
});

router.post('/', (req, res, next) => {
  let query = req.body;
  axios.get(query.url + '/rest/api/latest/search?jql=assignee=' + query.assignee + '&maxResults=' + '100',
    {
      method: 'GET',
      headers: { 'Authorization': 'Basic ' + query.token }
    }
  ).then((data) => {
    let results = data.data.issues;
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
          task_status: getStatus(_.get(result, 'fields.status.name'))
        });
      }
    }, this);
    results = _.sortBy(issues, ['task_status', 'task_id']) ;
    res.send({ 'result': results });
  })
    .catch((data) => {
      res.send({ 'error': 'Unable to fetch data!' });
    });
});

export default router;