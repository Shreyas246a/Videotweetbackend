import express from "express";
import cors from 'cors'
import cookieparser from "cookie-parser"
import userroute from './routes/user.route.js'


const app=express()

const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true, 
};

// app.use((req,res)=>{
//     console.log(req.headers)
// })

app.use(cors(corsOptions))
app.use(express.json({limit:'16kb'}))
app.use(express.urlencoded({extended:true}))
app.use(cookieparser())
app.use(express.static('public'))
app.use('/api/v1/users',userroute)
export {app}