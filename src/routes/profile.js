const express = require('express');
const profileRouter = express.Router();
const {userAuth} = require("../middlewares/auth");
const {validatorUpdateProfile} = require("../utils/validation")

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

        if (req.body?.skills && req.body.skills){
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

module.exports = profileRouter;