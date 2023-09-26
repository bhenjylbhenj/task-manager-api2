const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true
})


// const bhenjyl = new User({
//     name: 'Craig Luan',
//     email: 'luan@sadf.com',
//     password: 'bhenjylpassword',
//     age: 1
// })

// const task1 = new Task({
//     description: '        Broomm              Road Trim          Trip diay      '
// })

// bhenjyl.save()
// .then((me) => {
//     console.log(me)
// })
// .catch((error) => {
//     console.log(error)
// })


// task1.save()
// .then((task) => {
//     console.log(task)
// }).catch(e => console.log(e));


//==============================
// const mongoose = require('mongoose');

// main().catch(err => console.log(err));

// async function main () {
//     await mongoose.connect('mongodb://127.0.0.1:27017/test');
//     console.log('connected successfulyy');

    
//     const kittenSchema = new mongoose.Schema({
//         name: String
//     });
    
//     // NOTE: methods must be added to the schema before compiling it with mongoose.model()

//     kittenSchema.methods.speak = function speak() {
//         const greeting = this.name ? 'Meow name is ' + this.name : 'I don\'t have a name';
//         console.log(greeting);
//     }

//     const Kitten = new mongoose.model('Kitten', kittenSchema);
    
//     const silence = new Kitten({ name: 'Silence'});
//     console.log(silence);
    
//     const fluffy = new Kitten({ name: 'fluffy'});
//     await fluffy.save();
//     await fluffy.speak();
    
//     const kittens = await Kitten.find();
//     console.log(kittens);
    
// }