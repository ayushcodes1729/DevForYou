const validator = require("validator");

const  validatorSignupData =(req)=>{
    const {firstName, lastName, emailId, password} = req.body;
    if(!firstName || !lastName){
        throw new Error("Enter your name");
    }
    else if (!validator.isEmail(emailId)) throw new Error("Enter a valid emailId") ;
    else if (!validator.isStrongPassword(password)) throw new Error("Enter a strong password") ;
}

const validatorUpdateProfile = (req) => {
    const allowedUpdateFields = ["firstName", "lastName", "about", "age", "gender", "photoUrl", "skills"];
    const isUpdateAllowed = Object.keys(req.body).every((field)=> allowedUpdateFields.includes(field));
    return isUpdateAllowed;
}
module.exports = {
    validatorSignupData,
    validatorUpdateProfile
}