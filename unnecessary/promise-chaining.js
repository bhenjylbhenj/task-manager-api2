// const mongoose = require('mongoose');
require('../src/db/mongoose');

const User = require('../src/model/user');

User.findByIdAndUpdate('64f80ec44a72a69c7b35ce7a', {name: 'Bhenjylbhenj'}).then((user) => {
    console.log(user);
    return User.countDocuments({ age: 28 });
}).then((userOfAge28) => {
    console.log(userOfAge28);
}).catch(e => console.log(e));