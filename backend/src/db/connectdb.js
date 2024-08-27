import mongoose from "mongoose"
import { DBNAME } from "../constants"


const connectdb= async()=>{
    try{
        const dbinstance = await mongoose.connect(`${process.env.DB_URL}`+`/${DBNAME}`)
        console.log("Connected to db",dbinstance)
    }
    catch(e){
        console.error(e)
        process.exit(1)
    }

}
export default connectdb