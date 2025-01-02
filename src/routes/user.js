const express = require("express");
const userRouter = express.Router();
const {userAuth} = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require('../models/user');
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

userRouter.get("/user/feed", userAuth, async (req, res)=> {
    try {
        const loggedinUser = req.user;

        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;
        const skip = (page - 1)* limit;

        const connectionRequest = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedinUser._id},
                { toUserId: loggedinUser._id}
            ]
        }).select("fromUserId toUserId");

        const hiddenUsersFromFeed = new Set();
        connectionRequest.forEach((requests)=>{
            hiddenUsersFromFeed.add(requests.toUserId.toString());
            hiddenUsersFromFeed.add(requests.fromUserId.toString());
        })
        
        const feed = await User.find({
            $and : [
                {_id : {$nin : Array.from(hiddenUsersFromFeed)}},
            ]
        }).select(USER_PUBLIC_DATA).skip(skip).limit(limit)
        res.json(feed);
    } catch (error) {
        res.status(400).send("ERROR: "+ error.message);
    }
})
module.exports = userRouter;