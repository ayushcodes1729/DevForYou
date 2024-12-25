const validator = require("validator");

const  validatorSignupData =(req)=>{
    const {firstName, lastName, emailId, password} = req.body;
    if(!firstName || !lastName){
        throw new Error("Enter your name");
    }
    else if (!validator.isEmail(emailId)) throw new Error("Enter a valid emailId") ;
    else if (!validator.isStrongPassword(password)) throw new Error("Enter a strong password") ;
}

module.exports = {
    validatorSignupData
}