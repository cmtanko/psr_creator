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

router.post('/', function (req, res, next) {
    var query = req.body;
    _axios2.default.get('https://api.github.com/repos/' + query.username + '/' + query.reponame + '/events?', {
        method: 'GET',
        headers: { 'Authorization': 'token ' + query.token }
    }).then(function (data) {
        res.send({ 'result': data.data });
    }).catch(function (data) {
        res.send({ 'error': 'Unable to fetch data!' + data });
    });
});

exports.default = router;
//# sourceMappingURL=dailyReport.controller.js.map