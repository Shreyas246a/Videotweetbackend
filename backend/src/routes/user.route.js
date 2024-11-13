import { Router } from "express";
import { loginUser, logoutUser, refressAccessToken, registerUser, updatePassword } from "../controllers/users.controller.js";
import {upload} from '../middleware/multer.middleware..js'
import { verifyJWT } from "../middleware/auth.middleware.js";
const router=Router()

router.route('/register').post(
     upload.fields([
        {
            name:'avatar',
            maxCount:1

        },{
            name:"coverImg",
            maxCount:1
        }
     ])
    , registerUser)

router.route('/login').post(upload.none(),loginUser)
router.route('/RefreshToken').post(refressAccessToken)

//Secured Routes

router.route('/updatepassword').post(verifyJWT,updatePassword)
router.route("/logout").post(verifyJWT,logoutUser)

export default router