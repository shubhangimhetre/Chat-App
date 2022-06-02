const jwt=require('jsonwebtoken');
function verifytoken(req,res,next) {
    const token=req.cookies;
    if (!token){
        return res.status(401).send("Access Denied..")
    }else{
        verified= jwt.verify(token.user,process.env.token_secret,(err,tokendata)=>{
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