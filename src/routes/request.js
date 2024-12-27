const express = require('express');
const requestRouter = express.Router();
const {userAuth} = require("../middlewares/auth");

requestRouter.post("/sendConnection", userAuth, async (req,res)=>{
    //Logic to send connection request
    const user = req.user;
    res.send("Connection Request Sent! by " + user.firstName );
})

module.exports = requestRouter;