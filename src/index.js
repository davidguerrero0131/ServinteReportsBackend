const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();

const reportsRoutes = require('./routes/reportsRoutes');

//settings
app.set('port', 3002);

//middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(reportsRoutes);
app.use(cors({
    origin: 'http://frontend.com:4200'
  }));
//run
app.listen(app.get('port'), () => {
    console.log('Server Reports Backend Servinte on Port 3002')
})
