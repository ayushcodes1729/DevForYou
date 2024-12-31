const express = require('express');
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");
const connectionRequest = require("../models/connectionRequest");

requestRouter.post("/request/send/:status/:requestId", userAuth, async (req, res) => {
    try {
        const fromUser = req.user;
        const toUserId = req.params.requestId;
        const fromUserId = req.user._id;
        const status = req.params.status;
        const toUser = await User.findById(toUserId)

        const allowedStatus = ["interested", "ignored"];

        if (!allowedStatus.includes(status)) {
            throw new Error("Invalid status type: " + status);
        }

        if(!toUser){
            return res.status(404).json({message : "User not found"})
        }

        const existingConnectionRequest = await connectionRequest.findOne({
            $or:[
                {fromUserId, toUserId},
                {
                    fromUserId : toUserId,
                    toUserId : fromUserId
                }
            ]
        })

        if(existingConnectionRequest){
            throw new Error("Cannot send request, request already exists");
        }

        const requestData = new connectionRequest({
            toUserId,
            fromUserId,
            status
        });
        const data = await requestData.save();
        res.json({
            message: `Connection request from ${fromUser.firstName} to ${toUser.firstName} with status ${status}`,
            data
        });
    } catch (error) {
        res.status(400).send("Error: " + error.message);
    }

})

module.exports = requestRouter;