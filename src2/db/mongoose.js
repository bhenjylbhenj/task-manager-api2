const mongoose = require('mongoose');
try {
    mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api2', {
        useNewUrlParser: true
    })
    // console.log('connected to db');    
} catch (error) {
    console.log(error);
}