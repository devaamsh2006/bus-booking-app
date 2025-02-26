//importing mongoose
const mongoose=require('mongoose');

//creating a schema for admin
const adminSchema=new mongoose.Schema(
    {
        username:{
            type:String,
            required:true
        },
        adminId:{
            type:String,
            required:true,
            unique:true
        },
        phoneno:{
            type:String,
            required:true,
            unique:true
        },
        email:{
            type:String,
            required:true,
            unique:true
        },
        password:{
            type:String,
            required:true
        }
    }
)

//creating a collection for users
const adminModel=mongoose.model("admin",adminSchema);

//exporting user collection
module.exports=adminModel;