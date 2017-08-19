var express = require('express');
var querystring = require('querystring');
var app = express();

var port = process.env.PORT || 3000;
//SETUP PUBLIC DIRCTORY
app.use(express.static('public'));

app.set('views', 'src/views');

var handlebars = require('express-handlebars');
app.engine('.hbs', handlebars({ extname: '.hbs' }));
app.set('view engine', '.hbs');

//ROUTES
var reportRouter = require('./src/routes/reportRoutes')(querystring);
var dailyReportRouter = require('./src/routes/dailyReportRoutes')(querystring);


app.use('/report', reportRouter);
app.use('/dailyreport', dailyReportRouter);

app.get('/', function (req, res) {
    res.render('index.hbs');
});


app.listen(port, function (err) {
    console.log('running server on port ' + port);
});