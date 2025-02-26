//creating a sub express
const exp=require('express');
const adminApp=exp.Router();
const expressAsyncHandler=require('express-async-handler');
const bcryptjs=require('bcryptjs');
const jwt=require('jsonwebtoken');
const verifyToken=require('../TOKEN/verifyToken');

adminApp.use(exp.json())
//importing admin collection
const adminModel=require('../SCHEMAS/adminSchema');

//importing operator collection
const operatorModel=require('../SCHEMAS/operatorSchema');

adminApp.get('/admins',expressAsyncHandler(async(req,res)=>{
    res.send({message:"admin Api"});
}))

adminApp.post('/signup',expressAsyncHandler(async(req,res)=>{
    try{
        const credDetails=req.body;
        const newAdmin=new adminModel(credDetails);
        const dbres=await newAdmin.save();
        res.send({message:"admin created",payLoad:dbres});
        }
        catch(err){
            if(err.errorResponse.code===11000){
                const errMsg=err.errorResponse;
                const error=Object.keys(errMsg.keyValue)
                res.send({message:`${error} already exists`});
            }else{
                res.send({message:err.errorResponse});
            }
        }
}))

adminApp.post('/login',expressAsyncHandler(async(req,res)=>{
    try{
        const credObj=req.body;
        const dboperator=await adminModel.findOne({username:credObj.username});
        if(dboperator===null){
            res.send({message:"admin not exists"})
        }else{
            res.send({message:"login success",payLoad:dboperator,userType:"admin"});
        }   
    }
    catch(err){
        res.send({message:err.message});
    }
}))

adminApp.put('/accept',expressAsyncHandler(async(req,res)=>{
    const details=req.body;
    if(details.accepted===true){
        const result=await operatorModel.findOneAndUpdate({username:details.username},{$set:{accepted:true}},{returnOriginal:false});
        res.send({message:"operator accepted",payLoad:result});
    }else{
        await operatorModel.findOneAndDelete({username:details.username});
        re.send({message:"operator rejected"});
    }
}))

module.exports=adminApp;