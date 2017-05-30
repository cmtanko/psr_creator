var express = require('express');
var reportRouter = express.Router();
var router = function (querystring) {
    var reportService = require('../services/reportService')(querystring);
    var reportController = require('../controllers/reportController')(reportService,querystring);

    reportRouter.route('/')
        .get(reportController.getReport);

    return reportRouter;
};

module.exports = router;