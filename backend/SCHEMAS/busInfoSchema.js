const mongoose=require('mongoose');

//creating a collection for busInfo
const busInfoCollection=new mongoose.Schema({
    busId:{
        type:String,
        required:true
    },
    seat:{
        type:
        [
            {
            seatNo:{type:Number,required:true},
            occupied:{
                type:[{
                    station:{type:String,required:true},
                    userId:{type:String,required:true,default:null},
                    booked:{type:Boolean,required:true,default:false},
                    bookedOn:{type:Date,required:true,default:"1800-01-01T00:00:00Z"},
                    boarded:{type:Boolean,required:true,default:false}
                }],
                default:[]
            },
            pending:{type:Boolean,required:true,default:false}
            }
        ],
        default:[]
    },
    date:{
        type:Date,
        required:true
    },
    status:{
        type:Boolean,
        required:true,
        default:true
    }
})

//creating unique constraint for bus and date
busInfoCollection.index({ busId: 1, date: 1 }, { unique: true });

//creating a collection for bus Info
const busInfoModel=mongoose.model('busInfo',busInfoCollection);

//exporting busInfoModel
module.exports=busInfoModel;