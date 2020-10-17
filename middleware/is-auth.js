const jwt = require('jsonwebtoken');
module.exports = async ( req, res, next)=>{
    const authHeader = req.get('Authorization');
    if(!authHeader){
        // we attach isAuth to the req, we can call it whatever we want
        req.isAuth = false;
        return next();
    }
    const token = authHeader.split(' ')[1]; // Bearer token
    if(!token || token === ''){
        req.isAuth = false;
        return next();
    }
    //  we use the key that we declared when we created the login
    let decodedToken
    try{
        decodedToken = jwt.verify(token, 'thisisthekeyl4zy');

    } catch(err){
        req.isAuth = false;
        return next();
    }

    if(!decodedToken){
        req.isAuth = false;
        return next();
    }

    req.isAuth = true;
    req.usedId = decodedToken.usedId;

    next();
}