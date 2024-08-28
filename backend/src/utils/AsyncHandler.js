


const AsyncHandler=(func)=>(req,res,next)=>{
    try{
        func(req,res,next)
    }catch(err){
        res.status(500)
}
}

export {AsyncHandler}