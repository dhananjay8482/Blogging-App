const { validateToken } = require("../services/authentication");

// checks everytime that we have token or not in cookie
function checkForAuthenticationCookie(cookieName){
    return (req, res, next)=> {
        const tokenCookieValue = req.cookies[cookieName];
        if(!tokenCookieValue){
           return next();
        }

        try{
            const userPayload = validateToken(tokenCookieValue)
            req.user = userPayload;
        }catch(error){}

       return next();
    }
}

module.exports = {
    checkForAuthenticationCookie
}