var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var querystring= require('queryString');
var app = express();

var port = process.env.port || 3000;

//SETUP PUBLIC DIRCTORY
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());

app.set('views', 'src/views');

var handlebars = require('express-handlebars');
app.engine('.hbs', handlebars({ extname: '.hbs' }));
app.set('view engine', '.hbs');

//ROUTES
var reportRouter = require('./src/routes/reportRoutes')(querystring);

app.use('/report', reportRouter);
app.get('/', function (req, res) {
    res.render('index.hbs');
});


app.listen(port, function (err) {
    console.log('running server on port ' + port);
});