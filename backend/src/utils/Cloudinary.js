import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLUDINARY_API_SECRET,
})

const uploadFile= async(localFilePath)=>{

try{
    if(!localFilePath) return null

    const response=await cloudinary.uploader.upload(localFilePath,{
        resource_type: "auto"
    })
    console.log(response.url)
    return response

}catch(err){
    fs.unlinkSync(localFilePath)
    return null

}

}

export {uploadFile}