"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require("express");

var _report = require("./report/report.controller");

var _report2 = _interopRequireDefault(_report);

var _dailyReport = require("./report/dailyReport.controller");

var _dailyReport2 = _interopRequireDefault(_dailyReport);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = (0, _express.Router)();

router.use('/report', _report2.default);
router.use('/status', _dailyReport2.default);

exports.default = router;
//# sourceMappingURL=routes.js.map