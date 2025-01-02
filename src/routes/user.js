const express = require("express");
const userRouter = express.Router();
const {userAuth} = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const USER_PUBLIC_DATA = "firstName lastName photoUrl age gender skills about";

userRouter.get("/user/requests/received", userAuth, async (req, res) =>{
    try {
        const loggedinUser = req.user;
        
        const userRequests = await ConnectionRequest.find({
            toUserId : loggedinUser._id,
            status : "interested"
        }).populate("fromUserId", USER_PUBLIC_DATA)

        res.json({
            messgae : "All Pending Connection requests",
            userRequests
        })

    } catch (error) {
        res.status(400).send("ERROR: "+ error.message);
    }

})

userRouter.get("/user/connections", userAuth, async (req, res) =>{
    try {
        const loggedinUser = req.user;

        const connections = await ConnectionRequest.find({
            $or : [
                {toUserId : loggedinUser._id, status: "accepted"},
                {fromUserId : loggedinUser._id, status: "accepted"}
            ]
        }).populate("fromUserId", USER_PUBLIC_DATA).populate("toUserId", USER_PUBLIC_DATA);

        const data = connections.map(row =>
            row.fromUserId._id.toString() === loggedinUser._id.toString() ?  row.toUserId :  row.fromUserId
        )

        res.json(data);
    } catch (error) {
        res.status(400).send("ERROR: "+ error.message)
    }

})

module.exports = userRouter;