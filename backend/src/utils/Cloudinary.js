import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

cloudinary.config({
    cloud_name:"ddk13bn3l",
    api_key :324689639989513,
    api_secret:"12FW2JmohSFDCqfDHNDxx8Q7xHA",
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
    
    console.log(err)
    fs.unlinkSync(localFilePath)
    return null

}

}

export {uploadFile}