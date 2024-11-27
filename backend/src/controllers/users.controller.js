import { asyncHandler } from "../utils/AsyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadFile} from '../utils/Cloudinary.js'
import { ApiResponse } from "../utils/ApiResponse.js"
import jwt from 'jsonwebtoken'

const generateAccessAndRefreshToken=async(userId)=>{
  try {
   const user=await User.findById(userId)
   const accessToken=await user.generateAccessToken()
   const refreshToken=await user.generateRefreshToken()
   user.refreshToken=refreshToken
   await user.save({validateBeforeSave:false})
   return {accessToken,refreshToken}
  } catch (error) {
    throw new ApiError(501,"Something went wrong while generating tokens")
    
  }

}

const registerUser=asyncHandler(async (req,res,next)=>{
console.log(req.body,req.files);
const {username,fullname,email,password}=req.body

if(
    [fullname,username,email,password].some((field)=>field.trim()==="")
  )
  {
    throw new ApiError(400,"All fields are required")
  }
  console.table(req.body)
  console.log(req.files)
  
const existedUser=await User.findOne({
    $or :[{username},{email}]
  })

  if(existedUser){
    throw new ApiError(409,"User already Exists")
  }

  let coverImgLocalPath;
  let coverImg;

  if(req.files && Array.isArray(req.files.coverImg) && req.files.coverImg.length > 0){
    coverImgLocalPath=req.files.coverImg[0].path
    coverImg=await uploadFile(coverImgLocalPath)
  }

  const avatarLocalPath = req.files?.avatar[0]?.path
  
  if(!avatarLocalPath){
    throw new ApiError(400,"Avatar is needed")
  }

  const avatar=await uploadFile(avatarLocalPath)


  const user=await User.create({
    email:email,
    fullname,
    avatar:avatar.url,
    username:username.toLowerCase(),
    coverimg : coverImg?.url || "",
    password:password
  })

  const createduser=await User.findById(user._id).select(
    "-password -refreshToken"
  )
  console.log(createduser)

  if(!createduser){
    throw new ApiError(500,"Something Went Wrong while Registering")
  }

return res.status(201).json(
    new ApiResponse(200,createduser,"User Created Successfully")
)
})

const loginUser=asyncHandler(async(req,res,next)=>{
  console.log(req.body)
  const {email,username,password}=req.body

  if(!username && !email){
    throw new ApiError(400,"Username or Email is required")
  }
  const user=await User.findOne({$or:[{username},{email}]})

  if(!user){
    throw new ApiError(400,"User does not exist")
  }
  
  if(!password){
    throw new ApiError(400,"Password is required")
  }
  const isPassValid=await user.isPasswordCorrect(password)

  if(!isPassValid){
    throw new ApiError(401,"Invalid Credentials")
  }

  const {accessToken,refreshToken}=await generateAccessAndRefreshToken(user._id)

  const loggedinUser=await User.findById(user._id).select("-password -Refreshtoken")
  loggedinUser.Refreshtoken = refreshToken
  await loggedinUser.save()

  console.log(loggedinUser)
  const options={
    httpOnly:true,
    secure:true
  }


  res.status(200).
  cookie("accessToken" , accessToken,options).
  cookie("refreshToken" , refreshToken,options).
  json(
  new ApiResponse(200,{
    user:loggedinUser,refreshToken,accessToken
  },"User logged in Successfully")
  )  
})


const logoutUser=asyncHandler(async(req,res,next)=>{
  const user =req.user
  console.log("Logout", req)
  const options={
    httpOnly:true,
    secure:true
  }
  console.log(user)
  await User.findByIdAndUpdate(user._id,{
    $set:{
      Refreshtoken:undefined
    }
  },{
    new : true
  })
  
  return res.status(200).clearCookie("accessToken",options).clearCookie("refreshToken",options).json(new ApiResponse(200,{},"User Logged out Successfully"))

  

})

const refressAccessToken= asyncHandler(async(req,res,next)=>{
  console.log(req.body)
  const incomingToken=req.cookies.refreshToken || req.body.refreshToken
 
  if(!incomingToken){
    throw new ApiError(401,"Unauthorized Access")
  }
  const decoded = jwt.verify(
    incomingToken,
    process.env.REFRESH_TOKEN_SECRET
  )

  const ruser= await User.findById(decoded?._id)
  console.log(ruser)
  if(!ruser){
    throw new ApiError(401,"Invalid Token")
  }
  if(incomingToken !== ruser?.Refreshtoken){
   throw new ApiError(401,"Token is expired or used")
  }
  const options={
    httpOnly:true,
    secure : true
  }
  const {accessToken,newrefreshToken}=await generateAccessAndRefreshToken(ruser._id)

  return res.status(200).cookie('refreshToken',newrefreshToken,options).cookie('accessToken',accessToken,options).json(
    new ApiResponse(200,{accessToken,newrefreshToken},"Access Token Refreshed")
  )

})

const getUser= asyncHandler(async(req,res,next)=>{
    res.send(req.user);
})



const updatePassword= asyncHandler(async(req,res,next)=>{
  const {oldPassword,newPassword}=req.body;
  const curUser = req.user;
  if(!oldPassword || !newPassword){
    throw new ApiError(400,"Please enter both passwords")
  }
  const user=await User.findById(curUser._id);
  const passverify=await user.isPasswordCorrect(oldPassword);
  if(!passverify){
    throw new ApiError(401,"Invalid old password")
  }
  user.password=newPassword;
  await user.save({validateBeforeSave:false});
  return res.status(200).json(
    new ApiResponse(200,{},"Password changed successfuly")
  )
})


const updateAccountDetails=asyncHandler(async(req,res,next)=>{
  const {fullname,email}=req.body;  
    if(!fullname || !email){
      throw new ApiError(400,"All fields are required")
    }
    

  const user =await  User.findByIdAndUpdate(
      req.user._id
    ,{
      '$set':{
        fullname,email
      }
    },{new:true}).select("-password")
    return res.status(200)
    .json(new ApiResponse(200,user,"Updated successfully"))
})

const updateAvatar=asyncHandler(async(req,res,next)=>{
  const avatarLocalPath=req.file?.path;
  if(!avatarLocalPath){
    throw new ApiError(400,"Avatar is needed")
  }
  const avatar=await uploadFile(avatarLocalPath);
  if(!avatar.url){
    throw new ApiError(400,"Error while uploading")
  }

  const user=await User.findByIdAndUpdate(req.user._id,{
    '$set':{
        avatar:avatar.url
    }
  }).select("-password")

  return res.status(200)
  .json(new ApiResponse(200,user,"Updated Avatar"))
})


const updateCover=asyncHandler(async(req,res,next)=>{
  const coverLocalPath=req.file?.path;
  if(!coverLocalPath){
    throw new ApiError(400,"Cover image is needed")
  }
  const cover=await uploadFile(coverLocalPath);
  if(!cover.url){
    throw new ApiError(400,"Error while uploading")
  }

  const user=await User.findByIdAndUpdate(req.user._id,{
    '$set':{
        coverimg:cover.url
    }
  }).select("-password")

  return res.status(200)
  .json(new ApiResponse(200,user,"Updated Cover Image"))
});

const getUserChannelProfile=asyncHandler(async(req,res)=>{
  const {username}=req.params;

  if(!username?.trim()){
    throw new ApiError(400,"User not found")
  }

  const channnel=await User.aggregate([{
    $match:{
      username:username?.toLowerCase()
    }},
    {
      $lookup:{
        from : "subscriptions",
        localField:"_id",
        foreignField:"channel",
        as:"subscribers"
      },
    },{
      $lookup:{
        from:"subscriptions",
        localField:"_id",
        foreignField:"subscriber",
        as:"subscribedTo"
      },
    },{
      $addField:{
        'subscriberscount':{$size:subscribers},
        'subscribedtocount':{$size:subscribedto}      
      },
      isSubscribed:{
        $cond:{
        $if:{$in:[req.user?._id,"$subscribers.subscriber"]}
      }}
    },{
      $project:{
        fullname:1,
        email:1,
        username:1,
        subscriberscount:1,
        subscribedtocount:1,
        isSubscribed:1,
        avatar:1,
        coverImg:1,
      }
    }])

    if(channnel?.length){
      throw new ApiError(400,"Channel does not Exist")
    }

    return res.status(200)
    .json(
      new ApiResponse(200,channnel[0],"User channel fetched")
    )
    
})

export {registerUser,loginUser,logoutUser,getUserChannelProfile,refressAccessToken,updatePassword,updateAccountDetails,updateAvatar,updateCover,getUserChannelProfile}