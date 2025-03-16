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
const driverModel = require('../SCHEMAS/driverSchema');

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
        const dboperator=await adminModel.findOne({email:credObj.email});
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

adminApp.get('/requestsofAdmin',expressAsyncHandler(async(req,res)=>{
    try{
        const dbres=await operatorModel.find({accepted:false});
        res.send({message:'found requests',payLoad:dbres});
    }catch(err){
        res.send({message:'error occurred',payLoad:err.message});
    }
}))

adminApp.get('/operatorsofAdmin',expressAsyncHandler(async(req,res)=>{
    try{
        const dbres=await operatorModel.find({accepted:true});
        res.send({message:'found requests',payLoad:dbres});
    }catch(err){
        res.send({message:'error occurred',payLoad:err.message});
    }
}))

adminApp.get('/driversofAdmin',expressAsyncHandler(async(req,res)=>{
    try{
        const dbres=await driverModel.find();
        res.send({message:'found drivers',payLoad:dbres});
    }catch(err){
        res.send({message:'error occurred',payLoad:err.message});
    }
}))

adminApp.put('/accept',expressAsyncHandler(async(req,res)=>{
    const details=req.body;
    if(details.accept===true){
        const result=await operatorModel.findOneAndUpdate({username:details.username},{$set:{accepted:true}},{returnOriginal:false});
        res.send({message:"operator accepted",payLoad:result});
    }else{
        await operatorModel.findOneAndDelete({username:details.username});
        re.send({message:"operator rejected"});
    }
}))

adminApp.put('/block',expressAsyncHandler(async(req,res)=>{
    try{
        const details=req.body;
        const result=await operatorModel.findOneAndUpdate({username:details.username},{$set:{blocked:!details.blocked}},{returnOriginal:false});
        res.send({message:'operation done',payLoad:result});
    }catch(error){
        res.send({message:"error ocurred",payLoad:error.message});
    }
}))

module.exports=adminApp;