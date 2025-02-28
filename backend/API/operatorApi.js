//creating a sub express
const exp=require('express');
const operatorApp=exp.Router();
const expressAsyncHandler=require('express-async-handler');
const bcryptjs=require('bcryptjs');
const jwt=require('jsonwebtoken');
const verifyToken=require('../TOKEN/verifyToken');

//using middleware for post and put methods
operatorApp.use(exp.json())

//importing operator collection
const operatorModel=require('../SCHEMAS/operatorSchema');

//importing driver collection
const driverModel=require('../SCHEMAS/driverSchema');

//importing new bus collection
const newBusModel=require('../SCHEMAS/newBusSchema');

//importing bus info collection
const busInfoModel = require('../SCHEMAS/busInfoSchema');

//importing user collection
const userModel=require('../SCHEMAS/userSchema');
const StationModel = require('../SCHEMAS/Stations');

//for checking operator api
operatorApp.get('/operators',expressAsyncHandler(async(req,res)=>{
    res.send({message:"operator Api"});
}))

//for creating new operator
operatorApp.post('/signup',expressAsyncHandler(async(req,res)=>{
    try{
    const credDetails=req.body.user;
    console.log(credDetails);
    const newOperator=new operatorModel(credDetails);
    const dbres=await newOperator.save();
    res.send({message:"operator created",payLoad:dbres});
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

//for login of operator
operatorApp.post('/login',expressAsyncHandler(async(req,res)=>{
    try{
        const credObj=req.body.email;
        const dboperator=await operatorModel.findOne({username:credObj});
        if(dboperator===null){
            res.send({message:"operator not exists"})
        }else{
            res.send({message:"login success",payLoad:dboperator,userType:"operator"});
        }   
    }
    catch(err){
        res.send({message:err.message});
    }
}))

//for getting drivers of operator
operatorApp.post('/drivers',expressAsyncHandler(async(req,res)=>{
    try{
    const credObj=req.body.email;
    const dboperator=await operatorModel.findOne({username:credObj},{drivers:1,_id:0});
    if(dboperator.drivers.length===0){
        res.send({message:"No drivers"});
    }else{
        res.send({message:"drivers found",payLoad:dboperator});
    }
    }catch(err){
        res.send({message:"error occurred",payLoad:err.message});
    }   
}))

//adding drivers to organisation
operatorApp.put('/adddrivers',expressAsyncHandler(async(req,res)=>{
    try{
        const credObj=req.body;
        const operator=await operatorModel.findOne({username:credObj.username});
        if(operator.accepted===true){
        const dbDriver=await driverModel.findOne({username:credObj.drivername});
        if(dbDriver.occupied.length===0){
            const request=await driverModel.findOne({username:credObj.drivername,'pending.operatorname':credObj.username})
            if(!request){
            const result = await driverModel.findOneAndUpdate(
                { username: credObj.drivername},
                { $push: { pending: { operatorname: credObj.username,salary:credObj.salary } } },
                { returnOriginal:false } 
            );
            res.send({message:"driver added",payLoad:result});
            }else{
                res.send({message:"request already sent"});
            }
        }else{
            res.send({message:"driver already taken"});
        }}else{
            res.send({message:"wait"});
        }
    }   
    catch(err){
        res.send({message:"error occured",payLoad:err.message})
    }
}))

//operator to upload new bus
operatorApp.post('/newbus',expressAsyncHandler(async(req,res)=>{
    try{
        const credObj=req.body;
        const operator=await operatorModel.findOne({username:credObj.username});
        if(operator.accepted===true){
        let newbus=req.body;
        const doc=new newBusModel(newbus);
        const result=await doc.save();
        res.send({message:"bus added",payLoad:result});
    }else{
        res.send({message:"wait"});
    }
}catch(err){
        res.send({message:"error occured",payLoad:err.message})
    }
}))

//operator to get buses
operatorApp.post('/buses',expressAsyncHandler(async(req,res)=>{
    try{
        const credObj=req.body;
        const operator=await operatorModel.findOne({username:credObj.username});
        if(operator.accepted===true){
        const operatorname=req.body;
        let result=await newBusModel.find({username:operatorname.username});
        res.send({message:"buses found",payLoad:result});
    }else{
        res.send({message:"wait"});
    }
}catch(err){
        res.send({message:"error occured",payLoad:err.message});
    }
}))

//to add trips to existing bus
operatorApp.post('/addbus',expressAsyncHandler(async(req,res)=>{
    try{
        const credDetails=req.body;
        const dateArray=[];
        for(let date=new Date(credDetails.stDate);date<=new Date(credDetails.endDate);date.setDate(date.getDate()+1)){
            dateArray.push(new Date(date));
        }
        for(let date of dateArray){
            let busInfo={};
            busInfo.busId=credDetails.busId;
            busInfo.date=date;
            let busDetails=await newBusModel.findOne({busId:credDetails.busId});
            let noOfStations=busDetails.route[0].intermediate.length;
            let stations=[];
            stations.push({station:busDetails.route[0].source,booked:false});
            for(let i=0;i<noOfStations;i++){
                let details={};
                details.station=busDetails.route[0].intermediate[i].station;
                details.booked=false;
                stations.push(details);
            }
            stations.push({station:busDetails.route[0].destination,booked:false});
            let noOfSeats=busDetails.seats;
            let seatsArray=[];
            for(let i=1;i<=noOfSeats;i++){
                let details={};
                details.seatNo=i;
                details.occupied=stations;
                seatsArray.push(details);
            }
            let doc=new busInfoModel(busInfo);
            let result=await doc.save();
            for(let seat of seatsArray){
                let temp=await busInfoModel.findOneAndUpdate({busId:credDetails.busId,date:date},{$push:{seat:seat}});
            }
        }
        let result=await busInfoModel.find({busId:credDetails.busId});
        res.send({message:"details added",payLoad:result});
    }catch(err){
        res.send({message:"error occured",payLoad:err.message});
    }
}))

//to get the details of the bus
operatorApp.get('/businfo',expressAsyncHandler(async(req,res)=>{
    try{
        const details=req.body;
        let result=await busInfoModel.find({busId:details.busId});
        res.send({message:"details found",payLoad:result});
    }catch(err){
        res.send({message:"error occured",payLoad:err.message});
    }
}))

//to know the passengers travelling in the bus
operatorApp.get('/passengers',expressAsyncHandler(async(req,res)=>{
    try{
        const Details=req.body;
        const busDetails=await busInfoModel.find({busId:Details.busId,date:Details.date});
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

//to remove driver from driverList
operatorApp.put('/removeDriver',expressAsyncHandler(async(req,res)=>{
    try{
        const details=req.body;
        const operatorDetails=await operatorModel.findOne({username:details.username});
        const drivers=operatorDetails.drivers;
        const index=drivers.findIndex(driver=>driver.drivername===details.drivername);
        const setDrivers=drivers.splice(index,1);
        const result=await operatorModel.findOneAndUpdate({username:details.username},{$set:{drivers:drivers}},{returnOriginal:false});
        const oldDriver=await driverModel.findOneAndUpdate({username:setDrivers[0].drivername},{$set:{occupied:[]}},{returnOriginal:false});
        res.send({message:"removed driver",payLoad:result,oldDriver:oldDriver});
    }catch(err){
        res.send({message:"error occured",payLoad:err.message});
    }
}))

//to cancel a bus
operatorApp.put('/cancelbus',expressAsyncHandler(async(req,res)=>{
    try{
        const details=req.body;
        const result=await busInfoModel.findOneAndUpdate({busId:details.busId,date:details.date},{$set:{status:false}},{returnOriginal:false});
        res.send({message:"bus cancelled",payLoad:result});
    }catch(err){
        res.send({message:"error occured",payLoad:err.message})
    }
}))

operatorApp.post('/newroute',expressAsyncHandler(async(req,res)=>{
    try{
    const details=req.body;
    const doc=new StationModel(details);
    const result=await doc.save();
    res.send({message:"station uploaded",payLoad:result});
    }catch(err){
        res.send({message:"error occured",payLoad:err.message});
    }
}))

operatorApp.get('/routes',expressAsyncHandler(async(req,res)=>{
    try{
        const result=await StationModel.find();
        res.send({message:"found",payLoad:result});
    }catch(err){
        res.send({message:"error occured",payLoad:err.message});
    }
}))
module.exports=operatorApp;