const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Task = require('./task');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true

    },
    email: {
        type: String,
        trim: true,
        unique: true,
        required: true,
        lowercase: true,
        validate(value) {
            if(!validator.isEmail(value)) throw new Error('Email is invalid!');
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minLength: 6,
        validate(value) {
            if(value.toLowerCase().includes('password')) throw new Error('Your password must not contain \'password\'.');
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if(value < 1) throw new Error('Age must be more than 0');
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, { // 2nd argument
    timestamps: true
});

userSchema.virtual('tasks', {
    ref: 'Task', // the reference model
    localField: '_id', // this refers to the id of the current model(ex. User) -- relates from the other model (ex. Task)
    foreignField: 'owner' // this how the related model named on the current model(ex. User)
}) // takes two arguments 1. the property that be added onto current user instance 2. options:object

// userSchema.methods.getPublicProfile = function() {
userSchema.methods.toJSON = function() {    
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;

    return userObject;
}

userSchema.methods.generateAuthToken = async function() {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
    user.tokens = user.tokens.concat({token});

    await user.save();

    return token;
}

userSchema.statics.findByCredintials = async (email, password) => {
    const user = await User.findOne({email});
    if(!user) {
        console.log('No user found');
        throw new Error('Unable to login');
    }

    const passwordMatched = await bcrypt.compare(password, user.password);
    if(!passwordMatched) {
        console.log('Invalid Password');
        throw new Error('Unable to login');
    }

    return user;
}

userSchema.pre('save', async function (next) {
    const user = this;

    if(user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    } 

    // console.log(user);
    next(); 
})

userSchema.pre('deleteOne', {query: false, document: true}, async function (next) {
    await Task.deleteMany({owner: this._id});
    next(); 
})

const User = mongoose.model('User', userSchema);

module.exports = User;