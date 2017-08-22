import 'babel-polyfill';
import cors from 'cors';
import path from 'path';
import routes from './routes';
import express from  'express';
import bodyParser from 'body-parser';

const app = express();
var port = process.env.PORT || 3000;
app.use(cors());
app.use(bodyParser.json());
app.use('/api', routes);
app.use(express.static(path.join(__dirname, '/../public')));
app.get('/', function (req, res) {
    res.send({'result' :'Here'});
});
app.listen(port, function () {
 console.log('app listening on', port);
})

export default app;