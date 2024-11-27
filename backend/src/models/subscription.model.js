import mongoose, { Schema} from "mongoose";

const subscriptionSchema=Schema({
    subscriber:{                        //Info about channel user is subscribed to
        type : mongoose.Types.ObjectId,
        ref:Users
    },
    channel:{                           //User's Channel info
        type: mongoose.Types.ObjectId,
        ref:Users
    }
},{timestamps:true})

export const Subscription=mongoose.model("Subscription",subscriptionSchema)