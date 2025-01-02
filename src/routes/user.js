const express = require("express");
const userRouter = express.Router();
const {userAuth} = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

userRouter.get("/user/requests/received", userAuth, async (req, res) =>{
    try {
        const loggedinUser = req.user;
        
        const userRequests = await ConnectionRequest.find({
            toUserId : loggedinUser._id,
            status : "interested"
        }).populate("fromUserId", "firstName lastName photoUrl age gender skills about")

        res.json({
            messgae : "All Pending Connection requests",
            userRequests
        })

    } catch (error) {
        res.status(400).send("ERROR: "+ error.message);
    }

})

module.exports = userRouter;