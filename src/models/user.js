const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('./task');

// middlewhere help to run some code before or after data saving into database
//create schema for use of mongooes middlewhare 
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw Error('Age must be positive number');
            }
        }
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw Error('Email is invalid');
            }
        },
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw Error('Password not contain passowrd');
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true,
        }
    }],
    avatar: {
        type: Buffer,
    }
}, {
    timestamps: true
});

userSchema.methods.genrateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWTSECRATEKEY);
    user.tokens = user.tokens.concat({ token });
    await user.save();
    return token;
}

//directly access method through class or model name
userSchema.statics.findByCredentials = async (email, passowrd) => {

    const user = await User.findOne({ email });

    if (!user) {
        throw new Error('Unable to Login! User not find');
    }

    const isPassowrdMatch = await bcrypt.compare(passowrd, user.password);

    if (!isPassowrdMatch) {
        throw new Error('Unable to Login! Password is incorrect');
    }

    return user;
}

userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;
    delete userObject.avatar;

    return userObject;
}

///Create Virtual property b/w two entity
userSchema.virtual('myTasks', {
    ref: 'Task', // same name as model
    localField: '_id', // local field that is under owner map that same in user table 
    foreignField: 'owner', //name of field that connect with this table like owner filed inside task table that contain user id
});

//Hash the plain text passowrd before saving
userSchema.pre('save', async function (next) {
    const user = this;

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    //tell to compiler that the task is done 
    //if we not specify next then it's always wating for end process
    next();
});

//delete task when user is remove 
userSchema.pre('remove', async function (next) {
    const user = this;
    await Task.deleteMany({ owner: user._id });
    next();
})

const User = mongoose.model('User', userSchema);

module.exports = User;