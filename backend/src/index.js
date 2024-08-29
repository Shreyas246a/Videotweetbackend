import dotenv from 'dotenv'
dotenv.config({path:'src/.env',debug:true})
import { app } from './app.js';
import connectdb from './db/conect.js';


connectdb().then(()=>{
    app.listen(process.env.PORT, () => {
        console.log("listening on port " + process.env.PORT); //
    });
}).catch((err)=>{
    console.log(err)
})