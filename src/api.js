import 'babel-polyfill';
import cors from 'cors';
import path from 'path';
import routes from './routes';
import express from  'express';
import bodyParser from 'body-parser';

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/api', routes);
app.use(express.static(path.join(__dirname, '/../public')));

app.listen(3000, function () {
 console.log('app listening on', '3000');
})

export default app;