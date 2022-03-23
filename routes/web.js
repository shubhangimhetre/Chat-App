const express=require('express')
const router=express.Router()
const web2=require('../controllers/user')
const verify=require('../middlewares/verifytoken');


//user registration and login APIs
router.get('/user/all',web2.get_all)

router.post('/user/register',web2.user_register)

router.patch('/user/verify',verify,web2.verify_otp)

router.post('/user/login',verify,web2.user_login)

router.patch('/user/resend_otp',web2.resend_otp)

router.get('/users/logout',verify,web2.user_logout)


module.exports=router