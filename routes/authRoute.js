import express from 'express'
import {registerController , loginController , testController, forgotPasswordController, updateProfileController, getOrderController, geAlltOrderController, orderStatusController} from '../controllers/authController.js'
import { isAdmin, requireSignIn } from '../middlewares/authMiddlewares.js';
// router object
const router = express.Router();

// routing
//REGISTER || MEHOD POST
router.post('/register', registerController)

//LOGIN || METHOD POST
router.post('/login', loginController)

//Forgot Password || POST
router.post('/forgot-password' , forgotPasswordController)



// test Route
router.get('/test' ,requireSignIn ,isAdmin, testController)

// Protected User Route Auth
router.get('/user-auth', requireSignIn , (req, res)=>{
    res.status(200).send({ ok: true})
});

// Protected Admin Route Auth
router.get('/admin-auth', requireSignIn , isAdmin , (req, res)=>{
    res.status(200).send({ ok: true})
});


// update profile
router.put('/profile' , requireSignIn , updateProfileController)

// Orders
router.get('/orders' , requireSignIn , getOrderController)

// All  Orders
router.get('/all-orders' , requireSignIn  , isAdmin, geAlltOrderController)

// Order status update
router.put('/order-status/:orderId' , requireSignIn , isAdmin , orderStatusController )

export default router