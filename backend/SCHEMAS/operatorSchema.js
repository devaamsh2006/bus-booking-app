//importing mongoose
const mongoose=require('mongoose');

//creating a schema for operator
const operatorSchema=new mongoose.Schema(
    {
        username:{
            type:String,
            required:true,
            unique:true
        },
        operatorId:{
            type:String,
            required:true,
            unique:true
        },
        phoneno:{
            type:String,
            required:true,
            unique:true
        },
        location:{
            type:String,
            required:true
        },
        blocked:{
            type:Boolean,
            required:true,
            default:false
        },
        fullName:{
            type:String,
            required:true
        },
        imageUrl:{
            type:String,
            required:true
        },
        dateOfBirth:{
            type:Date,
            required:true
        },
        dateOfJoining:{
            type:Date,
            required:true
        },
        accepted:{
            type:Boolean,
            required:true,
            default:false
        },
        address:{
            type:String,
            required:true
        },
        gstNo:{
            type:String,
            required:true,
            unique:true
        },
        drivers:{
            type:[
                {
                    drivername:{type:String,required:true},
                    email:{type:String,required:true},
                    salary:{type:Number,required:true}
                }
            ],
            default:[]
        }
    }
)

//creating a collection for operator
const operatorModel=mongoose.model("operator",operatorSchema);

//exporting operator collection
module.exports=operatorModel;