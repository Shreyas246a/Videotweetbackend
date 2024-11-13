import mongoose, { Schema} from "mongoose";

const subscriptionSchema=Schema({
    suscriber:{
        type : mongoose.Types.ObjectId,
        ref:Users
    },
    channel:{
        type: mongoose.Types.ObjectId,
        ref:Users
    }
},{timestamps:true})

export const Subscription=mongoose.model("Subscription",subscriptionSchema)