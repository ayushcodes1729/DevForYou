const express = require("express");
require('dotenv').config();
const bcrypt = require('bcrypt');

const connectDB = require("./config/database");
const User = require("./models/user");
const PORT = process.env.PORT
const app = express();
const { validatorSignupData } = require("./utils/validation");
const { default: isEmail } = require("validator/lib/isEmail");

app.use(express.json());

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
        authenticatePass = await bcrypt.compare(password, user.password)
        if (!authenticatePass){
            throw new Error("Invalid Credentials");
        }else{
            res.send("LogIn Successful!!");
        }
    } catch (error) {
        res.status(400).send("Error:" + error.message);
    }
})

app.get("/user", async (req, res) => {
    const userEmailId = req.query.emailId;
    // console.log(userEmailId)
    try {
        const users = await User.findById("67628352cf1ba682ea6f1b34");
        // console.log(users);
        if (users.length === 0) {
            res.status(404).send("User not found");
        } else {
            res.send(users);
        }
    } catch (error) {
        // console.log(error);
        res.status(400).send("Something Went Wrong");
    }
});

app.get("/feed", async (req, res) => {
    try {
        const feed = await User.find({});
        if (feed.length === 0) {
            res.status(404).send("Feed Not found");
        } else {
            res.send(feed);
        }
    } catch (error) {
        res.status(400).send("Something went wrong");
    }
});

app.delete("/user", async (req, res) => {
    const userName = req.body.firstName;
    try {
        const user = await User.deleteOne({ firstName: userName });
        res.send("User deleted successfully");
    } catch (error) {
        res.status(400).send("Something went wrong");
    }
});

app.patch("/user", async (req, res) => {
    const emailId = req.query.emailId;
    const data = req.body;

    try {
        const NOTALLOWEDUPDATES = ["emailId"];
        const isUpdateNotAllowed = Object.keys(data).some((k) => NOTALLOWEDUPDATES.includes(k));

        console.log(isUpdateNotAllowed)
        if (isUpdateNotAllowed) {
            throw new Error("Update Not Allowed")
        }
        if (data?.skills && data.skills.length > 10) {
            throw new Error("Only 10 skills can be added");
        }
        const user = await User.findOneAndUpdate(
            { emailId: emailId },
            data,
            { returnDocument: "after", runValidators: true }
        );
        if (!user) {
            return res.status(404).send("User not found");
        }
        res.send("User updated successfully");
    } catch (error) {
        res.status(400).send("Error: " + error.message);
    }
});
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
