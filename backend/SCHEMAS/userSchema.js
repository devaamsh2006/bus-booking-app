//importing mongoose
const mongoose=require('mongoose');

//creating a schema for user
const userSchema=new mongoose.Schema(
    {
        username:{
            type:String,
            required:true
        },
        userId:{
            type:String,
            required:true,
            unique:true
        },
        phoneno:{
            type:String,
            required:true,
            unique:true
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

//creating a collection for users
const userModel=mongoose.model("users",userSchema);

//exporting user collection
module.exports=userModel;