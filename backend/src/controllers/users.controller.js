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

  if(!createduser){
    throw new ApiError(500,"Something Went Wrong while Registering")
  }

return res.status(201).json(
    new ApiResponse(200,createduser,"User Created Successfully")
)
})

const loginUser=asyncHandler(async(req,res,next)=>{
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
    ApiError(401,"Invalid Credentials")
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

  const options={
    httpOnly:true,
    secure:true
  }
  console.log(user)
  await User.findByIdAndUpdate(user._id,{
    set:{
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

export {registerUser,loginUser,logoutUser,refressAccessToken}