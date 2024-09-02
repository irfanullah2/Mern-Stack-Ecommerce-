import { timeStamp } from "console";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true,
        trim: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true  
    },
    phone:{
        type:{},
        required: true
    },
    address:{
        type:String,
        required: true
    },
    answer:{
        type: String ,
        required: true
    },
    role:{
        type:Number,
        default:0
    }


},{timeStamp:true})

export default mongoose.model('users',userSchema);