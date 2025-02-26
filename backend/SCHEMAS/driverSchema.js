//importing mongoose
const mongoose=require('mongoose');

//creating a schema for driver
const driverSchema=new mongoose.Schema(
    {
        username:{
            type:String,
            required:true
        },
        driverId:{
            type:String,
            required:true,
            unique:true
        },
        phoneno:{
            type:String,
            required:true,
            unique:true
        },
        licenceno:{
            type:String,
            required:true
        },
        blocked:{
            type:Boolean,
            required:true,
            default:false
        },
        dateOfBirth:{
            type:Date,
            required:true
        },
        dateOfJoining:{
            type:Date,
            required:true
        },
        occupied:{
            type:[
                {
                    operatorname:{type:String,default:null},
                    salary:{type:Number,required:true}
                }
            ]
        },
        pending:{
            type:[
                {
                    operatorname:{type:String,default:null},
                    salary:{type:Number,required:true}
                }
            ]
        },
        location:{
            type:String,
            required:true
        },
        yearsOfExperience:{
            type:Number,
            required:true
        },
        fullName:{
            type:String,
            required:true
        },
        imageUrl:{
            type:String,
            required:true
        }
    }
)

//creating a collection for drivers
const driverModel=mongoose.model("driver",driverSchema);

//exporting drivers collection
module.exports=driverModel;
