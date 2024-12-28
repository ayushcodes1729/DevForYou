const jwt = require("jsonwebtoken");
require('dotenv').config();
const User = require("../models/user");
const { request } = require("express");

const privateKey = process.env.PRIVATE_KEY;

const userAuth = async (req, res, next) =>{
    try {
        const {token} = req.cookies;
        if(!token){
            throw new Error("Invalid token");
        }

        const decodeMessage = await jwt.verify(token, privateKey);
        const {_id} = decodeMessage;

        const user = await User.findById(_id);
        if(!user){
            throw new Error("User doesn't exists");
        }
        req.user = user;
        next();

    } catch (error) {
        res.status(400).send("Error : " + error.message);
    }
};

module.exports = {
    userAuth
}