//creating a sub express
const exp=require('express');
const userApp=exp.Router();
const expressAsyncHandler=require('express-async-handler');

userApp.use(exp.json());

//importing user collection
const userModel=require('../SCHEMAS/userSchema');

//importing newbuses collection
const newBusModel=require('../SCHEMAS/newBusSchema');

//importing busInfo collection
const busInfoModel=require('../SCHEMAS/busInfoSchema');

//importing station collection
const StationModel = require('../SCHEMAS/Stations');

userApp.get('/users',expressAsyncHandler(async(req,res)=>{
    res.send({message:"users Api"});
}))

userApp.post('/signup',expressAsyncHandler(async(req,res)=>{
    try{
    const credDetails=req.body.user;
    const newUser=new userModel(credDetails);
    const dbres=await newUser.save();
    res.send({message:"user created",payLoad:dbres});
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

//to get user
userApp.post('/login',expressAsyncHandler(async(req,res)=>{
    try{
        const credEmail=req.body.email;
        const user=await userModel.findOne({username:credEmail});
        if(user.length!==0){
        res.send({message:'login success',payLoad:user,userType:'user'});
        }else{
            res.send({message:'user not exists'});
        }
    }catch(err){
        res.send({mesaage:'error occured',payLoad:err.message});
    }
}))

//to get all the buses from source and destination
userApp.get('/buses',expressAsyncHandler(async(req,res)=>{
    try{
    const details=req.body;
    const busesList=await newBusModel.find({$or:[
        {'route.source':details.source,'route.destination':details.destination},
        {'route.intermediate.station':details.source,'route.intermediate.station':details.destination},
        {'route.source':details.source,'route.intermediate.station':details.destination},
        {'route.intermediate.station':details.source,'route.destination':details.destination}]}
    );
    const busIdList=[];
    busesList.map(bus=>busIdList.push(bus.busId));
    const buses=await busInfoModel.find({$and:[{busId:{$in:busIdList}},{date:details.date}]})
    if(buses.length>0){
    res.send({message:"buses found",payLoad:buses});
    }else{
    res.send({message:"no buses found",payLoad:buses});
    }
    }
    catch(err){
        res.send({message:"error occurred",payLoad:err.message});
    }
}))

//to confirm the seat
userApp.put('/confirm',expressAsyncHandler(async(req,res)=>{
    try{
        const Details=req.body;
        const busDetails=await busInfoModel.findOne({busId:Details.busId,date:Details.date})
        const bookedSeat=Number(Details.bookedSeat);
        const seatToBook=busDetails.seat.find(seat => seat.seatNo === bookedSeat);
        if (!seatToBook) {
            return res.status(400).send({ message: "Invalid seat number" });
        }
        if (seatToBook.pending) {
            return res.status(400).send({ message: "Sorry, the seat is not available for now" });
        }
        let updateDetails=busDetails.seat.map(seatInfo=>{
            if(seatInfo.seatNo===bookedSeat&&seatInfo.pending===false){
                delete seatInfo._id;
                seatInfo.pending=true;
            }else{
                delete seatInfo._id;
            }
            return seatInfo;
        })
        let result=await busInfoModel.findOneAndUpdate({busId:Details.busId,date:Details.date},{$set:{seat:updateDetails}},{returnOriginal:false});
        res.send({message:"ok",payLoad:result});
    }catch(err){
        res.send({message:"error occurred",payLoad:err.message});
    }
}))

//to cancel the confirm seat
userApp.put('/cancelconfirm',expressAsyncHandler(async(req,res)=>{
    try{
        const Details=req.body;
        const busDetails=await busInfoModel.findOne({busId:Details.busId,date:Details.date})
        const bookedSeat=Number(Details.bookedSeat);
        const seatToBook = busDetails.seat.find(seat => seat.seatNo === bookedSeat);
        if (!seatToBook){
            return res.status(400).send({ message: "Invalid seat number" });
        }
        if (seatToBook.pending===false) {
            return res.status(400).send({ message: "seat is already cancelled"});
        }
        let updateDetails=busDetails.seat.map(seatInfo=>{
            if(seatInfo.seatNo===bookedSeat&&seatInfo.pending===true){
                delete seatInfo._id;
                seatInfo.pending=false;
            }else{
                delete seatInfo._id;
            }
            return seatInfo;
        })
        let result=await busInfoModel.findOneAndUpdate({busId:Details.busId,date:Details.date},{$set:{seat:updateDetails}},{returnOriginal:false});
        res.send({message:"cancelled confirm",payLoad:result});
    }catch(err){
        res.send({message:"error occured",payLoad:err.message});
    }
}))


userApp.put('/book', expressAsyncHandler(async (req, res) => {
    try {
        const { busId, date, bookedSeat, source, destination, userId, action } = req.body;
        const seatNumber = Number(bookedSeat);

        // Fetch the bus details
        const busDetails = await busInfoModel.findOne({ busId, date });
        if (!busDetails) {
            return res.status(404).send({ message: "Bus not found" });
        }
        delete busDetails._id;

        // Fetch route details
        const detailsOfBus = await newBusModel.findOne({ busId });
        if (!detailsOfBus) {
            return res.status(404).send({ message: "Bus route not found" });
        }

        const destinations = [];
        const routeInfo = detailsOfBus.route;
        destinations.push(routeInfo[0].source);
        routeInfo[0].intermediate.map(station => destinations.push(station.station));
        destinations.push(routeInfo[0].destination);

        // Find indexes for source and destination
        const indexOfSource = destinations.findIndex(dest => dest === source);
        const indexOfDestination = destinations.findIndex(dest => dest === destination);
        if (indexOfSource === -1 || indexOfDestination === -1 || indexOfSource >= indexOfDestination) {
            return res.status(400).send({ message: "Invalid source or destination" });
        }

        // Find the seat to book/cancel
        const seatToModify = busDetails.seat.find(seat => seat.seatNo === seatNumber);
        if (!seatToModify) {
            return res.status(400).send({ message: "Invalid seat number" });
        }

        if (action === "book") {
            // Check if the seat is already booked for this route
            let isSeatAvailable = true;
            seatToModify.occupied.forEach((station, index) => {
                if (index >= indexOfSource && index <= indexOfDestination && station.booked === true) {
                    isSeatAvailable = false;
                }
            });
            if (!isSeatAvailable) {
                return res.send({ message: "Ticket already booked" });
            }

            // Update seat booking
            seatToModify.occupied.forEach((station, index) => {
                if (index >= indexOfSource && index <= indexOfDestination) {
                    station.userId = userId;
                    station.bookedOn = new Date();
                    station.booked = true;
                }
            });

            const result = await busInfoModel.findOneAndUpdate(
                { busId, date },
                { $set: { "seat.$[elem]": seatToModify } },
                { arrayFilters: [{ "elem.seatNo": seatNumber }], new: true }
            );

            if (!result) {
                return res.status(500).send({ message: "Update failed. No document found." });
            }

            return res.send({ message: "Ticket booked successfully", payLoad: result });

        } else if (action === "cancel") {
            // Check if the seat is already booked
            let isSeatBooked = false;
            seatToModify.occupied.forEach((station, index) => {
                if (index >= indexOfSource && index <= indexOfDestination && station.userId === userId) {
                    isSeatBooked = true;
                }
            });

            if (!isSeatBooked) {
                return res.send({ message: "No booking found to cancel" });
            }

            // Cancel the seat booking
            seatToModify.occupied.forEach((station, index) => {
                if (index >= indexOfSource && index <= indexOfDestination && station.userId === userId) {
                    station.userId = null;
                    station.bookedOn = null;
                    station.booked = false;
                }
            });

            const result = await busInfoModel.findOneAndUpdate(
                { busId, date },
                { $set: { "seat.$[elem]": seatToModify } },
                { arrayFilters: [{ "elem.seatNo": seatNumber }], new: true }
            );

            if (!result) {
                return res.status(500).send({ message: "Cancellation failed. No document found." });
            }

            return res.send({ message: "Ticket cancelled successfully", payLoad: result });
        } else {
            return res.status(400).send({ message: "Invalid action. Use 'book' or 'cancel'." });
        }

    } catch (err) {
        res.status(500).send({ message: "Error occurred", payLoad: err.message });
    }
}));

userApp.get('/bookings',expressAsyncHandler(async(req,res)=>{
    try{
        const details=req.body;
        const tickets=await busInfoModel.find({'seat.occupied.userId':details.userId});
        res.send({message:"tickets found",payLoad:tickets});
    }catch(err){
        res.send({message:"error occurred"});
    }
}))

userApp.get('/routes',expressAsyncHandler(async(req,res)=>{
    try{
        const result=await StationModel.find();
        res.send({message:"found",payLoad:result});
    }catch(err){
        res.send({message:"error occured",payLoad:err.message});
    }
}))
module.exports=userApp;