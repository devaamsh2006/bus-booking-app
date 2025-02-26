//importing json-web-token
const jwt=require('jsonwebtoken');
require('dotenv').config();

//creating verifyToken
const verifyToken=(req,res,next)=>{
    const bearerToken=req.headers.authorization;
    
    //if no token is present send warning to them
    if(!bearerToken){
        res.send({message:"unauthorized access"});
    }

    //extracting the token
    const token=bearerToken.split(' ')[1];
    try{
        
        //verifying the token
        const decodedToken=jwt.verify(token,process.env.SECRET_KEY);
        next();
    }catch(err){

        //sending the err msg to error handling mechanism
        next(err);
    }
}

module.exports=verifyToken;