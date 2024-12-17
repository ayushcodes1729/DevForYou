const express = require("express");

const app = express();

app.use(
    "/user",
    (req, res, next) => {
        console.log("1st Route Handler");
        // res.send("1st Response");
        next();
    },
    (req, res, next) => {
        console.log("2nd Route Handler");
        // res.send("2nd Response");
        next()
    },
    (req, res, next) => {
        console.log("3rd Route Handler");
        // res.send("3rd Response");
        next();
    },
    (req, res, next) => {
        console.log("4th Route Handler");
        // res.send("4th Response");
        next();
    },
    (req, res, next) => {
        console.log("5th Route Handler");
        res.send("5th Response");
        next();
    },
    (req, res, next) => {
        console.log("6th Route Handler");
        // res.send("6th Response");
        // next();
    },
);

app.listen(3000, () => {
    console.log("Server listening successfully on port 3000...");
});
