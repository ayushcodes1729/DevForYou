const express = require("express");
require('dotenv').config();
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const connectDB = require("./config/database");
const User = require("./models/user");
const PORT = process.env.PORT
const privateKey = process.env.PRIVATE_KEY
const app = express();
const { validatorSignupData } = require("./utils/validation");
const { default: isEmail } = require("validator/lib/isEmail");
const {userAuth} = require("./middlewares/auth");

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
    const userObj = req.body;
    const {firstName, lastName, emailId, password} = req.body;


    try {
        validatorSignupData(req);

        const passwordHash = await bcrypt.hash(password , 10);
        const existingUser = await User.findOne({ emailId: emailId });
        if (existingUser) {
            throw new Error("E-mail already in-use");
        }
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash
        }); //creating a new instance of the user model
        await user.save();
        res.send("User Added Successfully");
    } catch (error) {
        res.status(400).send("Error occured while saving the data:" + error.message);
    }
});

app.post("/login", async (req, res)=>{
    try {
        const {emailId, password} = req.body;
        const user = await User.findOne({emailId : emailId});
        if (!user || !isEmail(emailId)){
            throw new Error("Invalid Credentials");
        }
        authenticatePass = await user.validatePassword(password);

        if (!authenticatePass){
            throw new Error("Invalid Credentials");
        }else{
            const token = await user.getJWT();
            res.cookie(
                'token', token,
                {
                    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                }
            );
            res.send("LogIn Successful!!");
        }
    } catch (error) {
        res.status(400).send("Error:" + error.message);
    }
})

app.get("/profile", userAuth, async (req,res) =>{
    try {
        const user = req.user;
        res.send(user);
    } catch (error) {
        res.status(400).send("Error:" + error.message);
    }

});

app.post("/sendConnection", userAuth, async (req,res)=>{
    //Logic to send connection request
    const user = req.user;
    res.send("Connection Request Sent! by " + user.firstName );
})
connectDB()
    .then(() => {
        console.log("Database Connection established...");
        app.listen(PORT, () => {
            console.log("Server listening successfully on port", PORT + "...");
        });
    })
    .catch((err) => {
        console.error("Database cannot be connected");
    });
