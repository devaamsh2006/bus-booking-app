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
const ticketModel = require('../SCHEMAS/ticketHistorySchema');

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
        res.send({message:'error occured',payLoad:err.message});
    }
}))

//to get all the buses from source and destination
userApp.post('/buses',expressAsyncHandler(async(req,res)=>{
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
    res.send({message:"buses found",payLoad:buses,busDetails:busesList});
    }else{
    res.send({message:"no buses found",payLoad:buses,busDetails:busesList});
    }
    }
    catch(err){
        res.send({message:"error occurred",payLoad:err.message});
    }
}))

userApp.post('/availableSeats', expressAsyncHandler(async (req, res) => {
    try {
        const { busId, date, source, destination } = req.body;

        // Fetch the bus details
        const busDetails = await busInfoModel.findOne({ busId, date });
        if (!busDetails) {
            return res.status(404).send({ message: "Bus not found" });
        }

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

        // Find available seats
        const availableSeats = busDetails.seat.filter(seat => {
            return seat.occupied.every((station, index) => 
                (index < indexOfSource || index > indexOfDestination) || station.userId === null
            );
        }).map(seat => seat.seatNo);

        return res.send({ 
            message: "Available seats fetched successfully", 
            availableSeats 
        });

    } catch (err) {
        res.status(500).send({ message: "Error occurred", payLoad: err.message });
    }
}));

userApp.put('/book', expressAsyncHandler(async (req, res) => {
    try {
        const { busId, date, selectedSeats, source, destination, userId, action } = req.body;
        
        // Fetch the bus details
        const busDetails = await busInfoModel.findOne({ busId, date });
        if (!busDetails) {
            return res.status(404).send({ message: "Bus not found" });
        }

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

        // Validate all seat numbers first
        for (const seat of selectedSeats) {
            const seatNumber = Number(seat);
            const seatToCheck = busDetails.seat.find(s => s.seatNo === seatNumber);
            if (!seatToCheck) {
                return res.status(400).send({ message: `Invalid seat number: ${seatNumber}` });
            }
        }

        let updatedBusDetails = busDetails;
        let results = [];

        if (action === "book") {
            // Check availability for all seats first
            for (const seat of selectedSeats) {
                const seatNumber = Number(seat);
                const seatToCheck = updatedBusDetails.seat.find(s => s.seatNo === seatNumber);
                
                let isSeatAvailable = true;
                seatToCheck.occupied.forEach((station, index) => {
                    if (index >= indexOfSource && index <= indexOfDestination && station.booked === true) {
                        isSeatAvailable = false;
                    }
                });
                
                if (!isSeatAvailable) {
                    return res.status(400).send({ message: `Seat ${seatNumber} is already booked for this route` });
                }
            }

            // Book all seats
            for (const seat of selectedSeats) {
                const seatNumber = Number(seat);
                
                // Find and modify the seat in our local copy
                const seatToModify = updatedBusDetails.seat.find(s => s.seatNo === seatNumber);
                
                // Update seat booking status
                seatToModify.occupied.forEach((station, index) => {
                    if (index >= indexOfSource && index <= indexOfDestination) {
                        station.userId = userId;
                        station.bookedOn = new Date();
                        station.booked = true;
                    }
                });

                // Update in database
                const result = await busInfoModel.findOneAndUpdate(
                    { busId, date },
                    { $set: { "seat.$[elem]": seatToModify } },
                    { arrayFilters: [{ "elem.seatNo": seatNumber }], new: true }
                );

                if (!result) {
                    return res.status(500).send({ message: `Update failed for seat ${seatNumber}` });
                }
                
                // Keep the updated bus details for next iterations
                updatedBusDetails = result;
                results.push({ seatNo: seatNumber, status: "booked" });
            }

            return res.send({ 
                message: "Tickets booked successfully", 
                seatsBooked: results,
                payLoad: updatedBusDetails 
            });

        } else if (action === "cancel") {
            // Similar approach for cancellation
            for (const seat of selectedSeats) {
                const seatNumber = Number(seat);
                
                // Find and modify the seat
                const seatToModify = updatedBusDetails.seat.find(s => s.seatNo === seatNumber);
                
                // Check if the seat is booked by this user
                let isSeatBooked = false;
                seatToModify.occupied.forEach((station, index) => {
                    if (index >= indexOfSource && index <= indexOfDestination && station.userId === userId) {
                        isSeatBooked = true;
                    }
                });

                if (!isSeatBooked) {
                    return res.status(400).send({ message: `No booking found for seat ${seatNumber}` });
                }

                // Cancel the booking
                seatToModify.occupied.forEach((station, index) => {
                    if (index >= indexOfSource && index <= indexOfDestination && station.userId === userId) {
                        station.userId = null;
                        station.bookedOn = null;
                        station.booked = false;
                    }
                });

                // Update in database
                const result = await busInfoModel.findOneAndUpdate(
                    { busId, date },
                    { $set: { "seat.$[elem]": seatToModify } },
                    { arrayFilters: [{ "elem.seatNo": seatNumber }], new: true }
                );

                if (!result) {
                    return res.status(500).send({ message: `Cancellation failed for seat ${seatNumber}` });
                }
                
                updatedBusDetails = result;
                results.push({ seatNo: seatNumber, status: "cancelled" });
            }

            return res.send({ 
                message: "Tickets cancelled successfully", 
                seatsCancelled: results,
                payLoad: updatedBusDetails 
            });
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

userApp.post('/tickethistory',expressAsyncHandler(async(req,res)=>{
    try{
        const credObj = req.body;
        const doc=new ticketModel(credObj);
        const result= await doc.save();
        res.send({message:"tickets added",payLoad:result})
    }catch(err){
        res.send({message:"error occurred",payLoad:err.message})
    }
}))

userApp.post('/gettickets',expressAsyncHandler(async(req,res)=>{
    try{
        const userId=req.body.userId;
        const dbres=await ticketModel.find({userId:userId});
        res.send({message:"history found",payLoad:dbres});
    }catch(err){
        res.send({message:"error occurred",payLoad:err.message})
        mesaage
    }
}))

module.exports=userApp;