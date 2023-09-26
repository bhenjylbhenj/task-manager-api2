const express = require('express');
require('./db/mongoose');

const userRoute = require('./routes/user');

const app = express();
const port = process.env.port || 3000;

app.use(express.json());

app.use(userRoute)

app.listen(port, () => { 
    console.log('App is running at port ' + port);
})