const jwt=require('jsonwebtoken');
// const TOKEN_SECRET="asdfghjklmnbvcx12345z";
// const cookies=require('cookies')
function verifytoken(req,res,next) {
    const token=req.cookies;
    if (!token){
        return res.status(401).send("Access Denied..")
    }else{
        verified= jwt.verify(token.user, "iamshubhangi",(err,tokendata)=>{
            if(err){
                res.send({message:"Authentication error.."})
            }else{
                res.tokendata=tokendata;
                next()
            }
        });
    }
}
module.exports=verifytoken