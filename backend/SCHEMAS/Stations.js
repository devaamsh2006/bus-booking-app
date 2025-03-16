const mongoose=require('mongoose');
const stationsSchema=new mongoose.Schema(
    {
        station:{
            type:String,
            required:true,
            unique:true
        },
        stationCode:{
            type:Number,
            required:true,
            unique:true
        }
    }
);
const StationModel=mongoose.model('station',stationsSchema);
module.exports=StationModel;
