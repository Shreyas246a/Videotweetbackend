import dotenv from 'dotenv'
dotenv.config()
import cors from 'cors'
import { app } from './app.js';
import express, { urlencoded } from 'express';
import connectdb from './db/conect.js';

console.log(process.env.PORT)
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))
app.use(express.json({limit:'16kb'}))
app.use(urlencoded({extended:true}))



connectdb().then(()=>{
    app.listen(process.env.PORT, () => {
        console.log("listening on port " + process.env.PORT); //
    });
}).catch((err)=>{
    console.log(err)
})