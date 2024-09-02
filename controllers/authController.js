import { comparePassword, hashPassword } from '../helpers/authHelpers.js'
import userModel from '../models/userModel.js'
import orderModel from '../models/orderModel.js'
import JWT from 'jsonwebtoken';

export const registerController = async(req, res)=>{
    try {
    
        const {name, email, password ,phone,address , answer} = req.body
        //Validations
        if (!name) {
            return res.send({message: 'Name is Required'})
        }
        if (!email) {
            return res.send({message: 'Email is Required'})
        }
        if (!password) {
            return res.send({message: 'Password is Required'})
        }
        if (!phone) {
            return res.send({message: 'Phone is Required'})
        } if (!address) {
            return res.send({message: 'Addrress is Required'})
        }
        if (!answer) {
            return res.send({message: 'Answer is Required'})
        }
    // Check 
    const existingUser = await userModel.findOne({email})
    // Existing User
    if (existingUser) {
        return res.status(200).send({
            success:false,
            message: 'Already Register Please Login'
        })
    }
    // Register User , hash it 
    const hashedPassword = await hashPassword(password)
        // Save 
        const user =await new userModel({
            name, 
            email,
            phone,
            address,
            password:hashedPassword,
            answer

        }).save()
        res.status(200).send({
            success: true,
            message: "User Register Successfully",
            user
        })
} catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error in Registration',
            error
        })
    }

}


// POST LOGIN
export const loginController = async(req, res)=>{
try {
    const {email, password} = req.body
    // Validation
if (!email || !password) {
    return res.status(404).send({
        success: false,
        message: 'Invalid Emial or Password'
    })
}
// check user
const user = await userModel.findOne({email});
if (!user) {
return res.status(404).send({
    success: false,
    message: 'Email is not Registered'
})    
}

const match = await comparePassword(password, user.password)
if (!match) {
    return res.status(200).send({
        success: false,
        message: 'Invalid Password'
    })
}

// token
const token = await JWT.sign({_id:user._id} , process.env.JWT_SECRET, {expiresIn:'7d'});
res.status(200).send({
    success : true,
    message : 'login successfully',
    user: {
        name : user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,

    },
    token,
})

} catch (error) {
    console.log(error)
    res.status(500).send({
        success:false,
        message: 'Error in Login',
        error
    })
}
}

// forgotPasswordController
export const forgotPasswordController = async(req, res)=>{
    try {
        const {email ,answer , newPassword} = req.body;
            if (!email) {
                res.status(400).send({message: 'Email is Required'})
            }
            if (!answer) {
                res.status(400).send({message: 'Answer is Required'})
            }
            if (!newPassword) {
                res.status(400).send({message: 'NewPassword is Required'})
            }
        // check
        const user = await userModel.findOne({email , answer})
        // Validation
        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'Wrong Email or Answer',
            })
        }
        const hashed = await hashPassword(newPassword);
        await userModel.findByIdAndUpdate(user._id , {password: hashed });
        res.status(200).send({
            success:true,
            message: 'Password Reset Successfully', 
        });

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Something went wrong..',
            error,
        })
    }
};


// test Controller
export const testController = (req, res)=>{
    res.send('Protected Route')
    console.log('Protected Route')
}


// Update Profile Controller
export const updateProfileController =async(req ,res )=>{
    try {
        const {name , email , password , address , phone} = req.body
        const user = await userModel.findById(req.user._id)
            // password 
            if (password && password.length < 3) {
                return res.json({error: 'Password is Required and 3 character long'})
            }
            const hashedPassword = password ? await hashPassword(password): undefined;
            const updatedUser = await userModel.findByIdAndUpdate(req.user._id,{
                name: name || user.name ,
                password : hashedPassword || user.password,
                phone : phone || user.phone ,
                address: address || user.address
            } , {new: true})
            res.status(200).send({
                success: true ,
                message: 'Profile Updated Successfully',
                updatedUser,
            })

    } catch (error) {
        console.log(error)
        res.status(400).send({
            success: false ,
            error ,
        message: 'Error While Update Profile'        })
    }
}


// Orders
export const getOrderController = async(req, res)=>{
    try {
        const orders = await orderModel
        .find({ buyer: req.user._id})
        .populate('products' , '-photo')
        .populate('buyer' , 'name');
        res.json(orders);
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false ,
            message: 'Error While Getting Orders' ,   
            error ,
    })
}
}


// get All orders
export const geAlltOrderController =async(req, res)=>{
try {
       const orders = await orderModel
        .find({})
        .populate('products' , '-photo')
        .populate('buyer' , 'name')
        .sort({createdAt:'-1'})
        res.json(orders);
} catch (error) {
    console.log(error)
        res.status(500).send({
            success: false ,
            message: 'Error While Getting All Orders' ,   
            error ,
    })
}
}


// Order Status  Update Controller
export const orderStatusController =async(req, res)=>{
    try {
        const {orderId} = req.params;
        const {status} = req.body;
        const orders = await orderModel.findByIdAndUpdate(
            orderId,
            {status} ,
            {new: true}
        );
        res.json(orders)
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false ,
            message: 'Error While Updating Status of Order' ,   
            error ,
    })
    }
}



