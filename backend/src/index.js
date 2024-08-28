import dotenv from 'dotenv'
dotenv.config()

import express from 'express';
import connectdb from './db/conect.js';

console.log(process.env.PORT)
const app = express();

app.listen(process.env.PORT, () => {
    console.log("listening on port " + process.env.PORT); //
});

connectdb()