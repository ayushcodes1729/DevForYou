const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const { default: isEmail } = require("validator/lib/isEmail");

const User = require("../models/user");
const { validatorSignupData } = require("../utils/validation");

authRouter.post("/signup", async (req, res) => {
    const userObj = req.body;
    const { firstName, lastName, emailId, password } = req.body;

    try {
        validatorSignupData(req);

        const passwordHash = await bcrypt.hash(password, 10);
        const existingUser = await User.findOne({ emailId: emailId });
        if (existingUser) {
            throw new Error("E-mail already in-use");
        }
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash,
        }); //creating a new instance of the user model
        const savedUser = await user.save();
        const token = await savedUser.getJWT();
        res.cookie("token", token, {
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });
        res.json({
            message: "User Added Successfully",
            data: savedUser,
        });
    } catch (error) {
        res
            .status(400)
            .send("Error occured while saving the data:" + error.message);
    }
});

authRouter.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;
        const user = await User.findOne({ emailId: emailId });
        if (!user || !isEmail(emailId)) {
            throw new Error("Invalid Credentials");
        }
        const authenticatePass = await user.validatePassword(password);

        if (!authenticatePass) {
            throw new Error("Invalid Credentials");
        } else {
            const token = await user.getJWT();
            res.cookie("token", token, {
                expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            });
            res.json({
                message: "Login Successful",
                user,
            });
        }
    } catch (error) {
        res.status(400).send("Error:" + error.message);
    }
});

authRouter.post("/logout", async (req, res) => {
    res
        .cookie("token", null, {
            expires: new Date(Date.now()),
        })
        .send("User Logged out...");
});

module.exports = authRouter;
