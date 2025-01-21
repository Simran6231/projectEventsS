//this helps us to not go directly to the dashboard site
exports.isLoggedIn=function(req,res,next){
    if(req.user){
        next();
    }
    else{
        return res.status(401).send('Access Denied');
    }
}