const adminAuth = (req, res, next) => {
    token = 'xyz';
    if(!(token === 'xyz')){
        res.status(401).send("Admin Unauthorised");
    }
    else{
        next();
    }
};

const userAuth = (req, res, next) =>{
    token = 'abc';
    if (!(token === 'abc')){
        res.status(401).send("Unauthorised User");
    }
    else {
        next();
    }
};

module.exports = {
    adminAuth,
    userAuth
}