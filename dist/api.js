'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

require('babel-polyfill');

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _routes = require('./routes');

var _routes2 = _interopRequireDefault(_routes);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
var port = process.env.PORT || 3000;
app.use((0, _cors2.default)());
app.use(_bodyParser2.default.json());
app.use('/api', _routes2.default);
app.use(_express2.default.static(_path2.default.join(__dirname, '/../public')));
app.get('/', function (req, res) {
  res.send({ 'result': 'Here' });
});
app.listen(port, function () {
  console.log('app listening on', port);
});

exports.default = app;
//# sourceMappingURL=api.js.map