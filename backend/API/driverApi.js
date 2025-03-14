//creating a sub express
const exp=require('express');
const driverApp=exp.Router();
const expressAsyncHandler=require('express-async-handler');
const bcryptjs=require('bcryptjs');
const jwt=require('jsonwebtoken');
const verifyToken=require('../TOKEN/verifyToken');

//importing driver collection
const driverModel=require('../SCHEMAS/driverSchema');

//import operator collection
const operatorModel=require('../SCHEMAS/operatorSchema');

//import newBusModel collection
const newBusModel = require('../SCHEMAS/newBusSchema');

//import userModel collection
const userModel=require('../SCHEMAS/userSchema');

//import busInfo collection
const busInfoCollection=require('../SCHEMAS/busInfoSchema');

//using middleware for post and put
driverApp.use(exp.json());

//testing for driver api
driverApp.get('/drivers',expressAsyncHandler(async(req,res)=>{
    res.send({message:"drivers Api"});
}))

//creating new driver
driverApp.post('/signup',expressAsyncHandler(async(req,res)=>{
    try{
    const credDetails=req.body.user;
    console.log(credDetails);
    const newDriver=new driverModel(credDetails);
    const dbres=await newDriver.save();
    res.send({message:"driver created",payLoad:dbres});
    }
    catch(err){
        if(err.errorResponse.code===11000){
            const error=Object.keys(err.errorResponse.keyValue);
            res.send({message:`${error} already exists`});
        }else{
            res.send({message:err.message});
        }
    }
}))

//login for driver
driverApp.post('/login',expressAsyncHandler(async(req,res)=>{
    try{
        const credDetails=req.body.email;
        const dbDriver=await driverModel.findOne({username:credDetails});
        if(dbDriver===null){
            res.send({message:"driver not exists"});
        }else{
            res.send({message:"login success",payLoad:dbDriver,userType:"driver"});
        }
    }
    catch(err){
        res.send({message:err.message});
    }
}))

//accepting or rejecting operator request
driverApp.put('/operators',expressAsyncHandler(async(req,res)=>{
    try{
        const acceptedOrRejected=req.body;
        const result=await driverModel.findOne({username:acceptedOrRejected.username});
        let operatorsinList=result.pending;
        let index=operatorsinList.findIndex(element=>element.operatorname===acceptedOrRejected.operatorname);
        const added=operatorsinList.splice(index,1);
        let temp=await driverModel.findOneAndUpdate({username:acceptedOrRejected.username},{$set:{pending:operatorsinList}});
        if(acceptedOrRejected.request==='add'){
            let final=await driverModel.findOneAndUpdate({username:acceptedOrRejected.username},{$push:{occupied:added}},{returnOriginal:false});
            let updatedoperator=await operatorModel.findOneAndUpdate({username:acceptedOrRejected.operatorname},{$push:{drivers:{drivername:acceptedOrRejected.fullName,email:acceptedOrRejected.email,salary:added[0].salary}}});
            return res.send({message:"operator finalized",payLoad:final});
        }else{
            let final=await driverModel.findOne({username:acceptedOrRejected.username});
            return res.send({message:"operator deleted",payLoad:final});
        }
    }catch(err){
        res.send({message:"error occured",payLoad:err.message});
    }
}))

//getting buses
driverApp.get('/buses',expressAsyncHandler(async(req,res)=>{
    try{
        const driver=req.body.username;
        const result=await newBusModel.findOne({drivername:driver});
        res.send({message:"buses found",payLoad:result});
    }catch(err){
        res.send({message:"error occurred",payLoad:err.message});
    }
}))

//getting users info of bus for driver
driverApp.get('/passengers',expressAsyncHandler(async(req,res)=>{
    try{
        const Details=req.body;
        const busDetails=await busInfoCollection.find({busId:Details.busId,date:Details.date});
        const users=[];
        const userDetails=busDetails[0].seat;
        userDetails.map(user=>{
            user.occupied.map(passenger=>{
                users.push(passenger.userId);
            })
        })
        let passengers=await userModel.find({userId:{$in:users}});
        res.send({message:"all passengers",payLoad:passengers});
    }catch(err){
        res.send({message:"error occurred",payLoad:err.message});
    }
}))

module.exports=driverApp;