const mongoose = require("mongoose")
const validator = require("validator")
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
require('dotenv').config();

const privateKey = process.env.PRIVATE_KEY


const { Schema } = mongoose;

const userSchema = new Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true,
            maxLength: 10,
        }, // String is shorthand for {type: String}
        lastName: {
            type: String,
            trim: true,
            maxLength: 50,
        },
        emailId: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            maxLength: 80,
            immutable: true,
            validate(value){
                if (!validator.isEmail(value)){
                    throw new Error("Invalid E-mail Id: " + value)
                }
            }
        },
        password: {
            type: String,
            required: true,
            validate(value){
                if (!validator.isStrongPassword(value)){
                    throw new Error("Please Enter a strong password: "+ value);
                }
            }
        },
        about: {
            type : String,
            trim: true,
            maxLength: 150,
            default: "Hey I am a nerdy geek"
        },
        age: {
            type: Number,
            max: 100,
            min: 1,
        },
        gender: {
            type: String,
            enum: {
                values: ['M', 'F', 'Others'],
                message: '{VALUE} is not supported'
            }
        },
        photoUrl: {
            type: String,
            default: "https://frappecloud.com/files/user.png",
            lowercase: true,
            validate(value){
                if (!validator.isURL(value)){
                    throw new Error("Invalid photo URL: " + value)
                }
            }
        },
        skills:{
            type: [String],
            required: true,
            enum: {
                values: ['Web', 'Android', 'Web3', 'Reactjs', 'Expressjs', 'MongoDb', 'Nodejs', 'Javascript', 'HTML', 'CSS', 'Nextjs', 'Typescript', 'Git', 'Vim', 'Neovim', 'Linux', 'Docker', 'Kotlin', 'Android Studios'],
                message: '{VALUE} is not supported'
            },
        }
    },
    {
        timestamps: true
    },
);

userSchema.methods.getJWT = async function () {
    const user = this;

    const token = await jwt.sign(
        {_id : user._id}, privateKey, { expiresIn: '7d' }
    );
    return token;
}

userSchema.methods.validatePassword = async function (passwordInputByUser) {
    const user = this;
    const authenticatePass = await bcrypt.compare(passwordInputByUser, user.password);
    return authenticatePass;
}

const User = mongoose.model("User", userSchema);

module.exports = User;
