import { Router } from "express";
import { loginUser, logoutUser, registerUser } from "../controllers/users.controller.js";
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
    ,registerUser)

router.route('/login').post(loginUser)

//Secured Routes

router.route("/logout").post(verifyJWT,logoutUser)
export default router