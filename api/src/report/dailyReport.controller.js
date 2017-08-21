import { Router } from 'express';
import axios from 'axios';
import _ from 'lodash';

const router = Router();

router.post('/', (req, res, next) => {
    let query = req.body;
    axios.get('https://api.github.com/repos/' + query.username + '/' + query.reponame + '/events?',
        {
            method: 'GET',
            headers: { 'Authorization': 'token ' + query.token }
        }
    ).then((data) => {
        res.send({ 'result': data.data });
    }).catch((data) => {
        res.send({ 'error': 'Unable to fetch data!' + data });
    });
});

export default router;