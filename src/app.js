const express = require("express");

const app = express();

app.get("/", (req, res) => {
    res.send("Hello from the server");
});

app.get("/test", (req, res) => {
    res.send("This is test route");
});

app.listen(3000, () => {
    console.log("Server listening successfully on port 3000...");
});
