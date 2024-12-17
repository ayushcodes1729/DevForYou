const express = require("express");
const {adminAuth, userAuth} = require("./middlewares/auth")

const app = express();

app.use('/admin', adminAuth);
app.use('/user', userAuth);

app.get("/admin/:adminID", (req,res)=>{
    console.log(req.params);
    res.send(req.params);
})

app.get("/user/:userID", (req , res)=> {
    console.log(req.params);
    res.send(req.params);
})

app.listen(3000, () => {
    console.log("Server listening successfully on port 3000...");
});
