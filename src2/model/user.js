const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        default: "Maypa"
    },
    email: {
        type: String,
        lowercase: true,
        required: true,
        unique: true,
        trim: true,
        validate(value) {
            if(!validator.isEmail(value)) throw new Error('Invalid email address');
        }
    },
    password: {
        type: String,
        minLength: 8, 
        required: true, 
        trim: true,
        validate(value) {
            if(value.toLowerCase().includes('password')) throw new Error('Your password must not contain \'passowrd\'');
        }
    },
    tokens: {
        token: [{
            type: String,
            required: true
        }]
    }
})

userSchema.methods.generateAuthToken = async function() {
    const user = this;
    const token = jwt.sign({_id: user._id.toString()}, 'thisispractice');
    user.tokens = user.tokens.concat({token});

    await user.save();
    return token;
}

userSchema.statics.findByCredintials = async (email, password) => {
    const user = await User.findOne({email});

    if(!user) {
        console.log('No user found!');
        throw new Error('Invalid email or password!');
    }

    if(password !== user.password) {
        console.log('Incorrect password');
        throw new Error('Invalid email or password');
    }

    return user;
}

userSchema.pre('save', async function(next) {
    if(this.isModified('password')) this.password = await bcrypt.hash(this.password, 8);
    next();
});

const User = new mongoose.model('User', userSchema);

module.exports = User;