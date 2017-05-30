var express = require('express');
var dailyReportRouter = express.Router();
var router = function (querystring) {
    var dailyReportService = require('../services/dailyReportService')(querystring);
    var dailyReportController = require('../controllers/dailyReportController')(dailyReportService,querystring);

    dailyReportRouter.route('/')
        .get(dailyReportController.getReport);

    return dailyReportRouter;
};

module.exports = router;