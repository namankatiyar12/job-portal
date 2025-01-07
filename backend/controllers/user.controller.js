import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
export const register=async(req,res)=>{
    try{
        const{fullname,email,phoneNumber,password,role}=req.body;
        if(!fullname||!email||!phoneNumber||!password||!role){
            return res.status(400).json({message:"Something is missing",
                success:false
            });
        };
        const user=await User.findOne({email});
        if(user){
            return res.status(400).json({message:"Email already exists",
                success:false
        }
        const hashedPassword=await bcrypt.hash(password,10);
        await user.createdAt({
            fullname,
            email,  
            phoneNumber,
            role,
            password:hashedPassword,
        })
    }catch(error){

    }
}
export const login=async(req,res)=>{
    try{
        const {email,password,role}=req.body;
        if(!email||!password||!role){
            return res.status(400).json({message:"Something is missing",
                success:false
            });
        };
        const user=await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"Incorrect Email or password",
                success:false
        }
        const isPasswordMatch=await bcrypt.compare(password,user.password);
        if(!isPasswordMatch){
            return res.status(400).json({message:"Incorrect Email or password", success:false});
        }
        //role check
        if(role!=user.role){
            return res.status(400).json({message:"Account does not exist with current role", success:false});    
        }
        const tokenData={
            userId:user._id
        }
        const token=await Jso
    }catch(error){

    }
}