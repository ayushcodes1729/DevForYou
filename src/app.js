const express = require("express");


const app = express();

app.get("/user", (req,res)=>{
    // try {
    //     //logic of fetching data from db
        throw new Error("jiordnaeifj");
    // } catch (error) {
    //     console.log(error);
    //     res.status(500).send("Something went wrong");
    // }
});

app.use('/', (err, req, res, next)=>{
    if(err){
        res.status(500).send("Error occured contact support team");
    }
})

app.listen(3000, () => {
    console.log("Server listening successfully on port 3000...");
});
