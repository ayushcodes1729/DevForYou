const express = require("express");
const connectDB = require("./config/database")
const User = require("./models/user")

const app = express();

app.post("/signup", async (req,res)=>{
    const userObj = {
        firstName: "Aditya",
        lastName: "Kumar",
        emailId: "ayushtiwari0803@gmail.com",
        password: "ayush@2004"
    }

    const user = new User(userObj); //creating a new instance of the user model

    try {
        await user.save();
        res.send("User Added Successfully");
    } catch (error) {
        res.status(400).send("Error occured while saving the data:", error.message)
    }
})
connectDB()
    .then(() => {
        console.log("Database Connection established...");
        app.listen(3000, () => {
            console.log("Server listening successfully on port 3000...");
        });
    })
    .catch((err) => {
        console.err("Database cannot be connected");
    })

