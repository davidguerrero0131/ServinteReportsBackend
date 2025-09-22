const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();

const reportsRoutes = require('./routes/reportsRoutes');
const signosVitalesRoutes = require('./routes/signosVitalesroutes');
const pacientescirugiaRoutes = require('./routes/pacientesCirugiaRoutes');

//settings
app.set('port', 3002);
app.listen(3002, '0.0.0.0')
//middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(reportsRoutes);
app.use(signosVitalesRoutes);
app.use(pacientescirugiaRoutes);

//run
app.listen(app.get('port'), () => {
    console.log('Server Reports Backend Servinte on Port 3002')
})
