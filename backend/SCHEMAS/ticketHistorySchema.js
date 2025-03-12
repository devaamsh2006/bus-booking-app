const mongoose=require('mongoose');

const ticketSchema=new mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    busId:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        required:true
    },
    seats:{
        type:Array,
        required:true
    },
    source:{
        type:String,
        required:true
    },
    destination:{
        type:String,
        required:true
    },
    time:{
        type:String,
        required:true
    }
})

const ticketModel=mongoose.model('tickethistory',ticketSchema);

module.exports=ticketModel;