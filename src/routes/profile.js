const express = require('express');
const profileRouter = express.Router();
const bcrypt = require("bcrypt");
const {userAuth} = require("../middlewares/auth");
const {validatorUpdateProfile} = require("../utils/validation");
const User = require('../models/user');


profileRouter.get("/profile/view", userAuth, async (req,res) =>{
    try {
        const user = req.user;
        res.send(user);
    } catch (error) {
        res.status(400).send("Error:" + error.message);
    }
});

profileRouter.patch("/profile/edit", userAuth, async (req,res) =>{
    try {

        if(!validatorUpdateProfile(req)) {
            throw new Error("Invalid update request");
        }

        if (req.body?.skills && req.body.skills.length > 10){
            throw new Error("Only 10 skills can be entered");
            
        }
        const loggedinUser = req.user;
        Object.keys(req.body).forEach((key)=> loggedinUser[key] = req.body[key]);
        await loggedinUser.save();

        res.send(`${loggedinUser.firstName}, your profile updated successfuly`)
    } catch (error) {
        res.status(400).send("Error:" + error.message);
    }
})

profileRouter.patch('/profile/password', userAuth, async (req,res)=>{
    try {
        const existingPassword = req.body.existingPassword;
        const newPassword = req.body.newPassword;
        const newPasswordHash = await bcrypt.hash(newPassword, 10);
        const authenticateExistingPassword = await req.user.validatePassword(existingPassword);


        if (!authenticateExistingPassword){
            throw new Error("Password entered is not correct");
        }
        const loggedinUser = req.user;
        loggedinUser.password = newPasswordHash;
        await loggedinUser.save();
        res.send(`${loggedinUser.firstName}, your password updated successfuly`)
        
    } catch (error) {
        res.status(400).send("Error:" + error.message);
    }
})

module.exports = profileRouter;