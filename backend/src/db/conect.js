import mongoose from "mongoose"
import { DBNAME } from "../constants.js"
import dotenv from 'dotenv'
dotenv.config()

const connectdb= async function(){
    
    try{
        console.log(process.env.DB_URL)
        const dbinstance = await mongoose.connect(`${process.env.DB_URL}`+`/${DBNAME}`)
        console.log("Connected to db",dbinstance.connection.host)
    }
    catch(e){
        console.error(e)
        process.exit(1)
    }

}
export default connectdb