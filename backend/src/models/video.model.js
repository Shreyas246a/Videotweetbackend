import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2'

const videoSchema=Schema({
    videolink:{
        type:String
    },
    thumbnail:{
        type:String
    },
    owner:{
        type:mongoose.Types.ObjectId,
        ref:'User'
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    duration:{
        type:Number,
        required:true
    },
    views:{
        type:Number,
        default:0
    }
},{
    timestamps:true
})

videoSchema.plugin(mongooseAggregatePaginate)



export const Video=mongoose.model("Video",videoSchema)