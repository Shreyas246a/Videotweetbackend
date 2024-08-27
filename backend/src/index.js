import express from 'express'
import connectdb from './db/connectdb'

const app=express()

app.listen(process.env.PORT,(req,res,next)=>{
    console.log("listening")
})
