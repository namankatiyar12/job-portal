import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
export const register=async(req,res)=>{
    try{
        const{fullname,email,phoneNumber,password,role}=req.body;
        if(!fullname||!email||!phoneNumber||!password||!role){
            return res.status(400).json({message:"Something is missing",
                success:false
            });
        };
        let user=await User.findOne({email});
        if(user){
            return res.status(400).json({message:"Email already exists",
                success:false})
        }
        const hashedPassword=await bcrypt.hash(password,10);
        await User.create({
            fullname,
            email,  
            phoneNumber,
            role,
            password:hashedPassword,
        });
        return res.status(201).json({message:"User created successfully",
            success:true})     
    }catch(error){
            console.log(error);
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
        let user=await User.findOne({email});

        if(!user){
            return res.status(400).json({message:"Incorrect Email or password",
                success:false})
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
        const token=await jwt.sign(tokenData,process.env.SECRET_KEY,{expiresIn:'1d'});
        user={
            _id:user._id,
            fullname:user.fullname,
            email:user.email,
            role:user.role,
            phoneNumber:user.phoneNumber,
            profile:user.profile

        }
        return res.status(200).cookie("token",token,{maxage:1*24*60*60*1000,httpsOly:true,sameSite:'strict'}).json({
            message:`Welcome back${user.fullname}`,
            success:true,
        })
    } catch(error){
        console.log(error);
    }
}
export const logout=async(req,res)=>{
    try{
        return res.status(200).clearCookie("token").json({
            message:"Logged out successfully",
            success:true
        })
    }catch(error){
        console.log(error);
    }

}
export const updateProfile=async(req,res)=>{
    try{
        const{fullname,email,phoneNumber,bio,skills
        }=req.body;
        const file=req.file;
        //cloudinary aayega idhar

        let skillsArray;
        if(skills){
            skillsArray=skills.split(',');
        }
        const userId=req.id;//middleware authentication
        let user=await User.findById(userId);
        if(!user){
            return res.status(400).json({message:"User does not exist",success:false});
        }
        if(fullname){
            user.fullname=fullname;
        }
        if(email){
            user.email=email;
        }
        if(phoneNumber){
            user.phoneNumber=phoneNumber;
        }
        if(bio){
            user.profile.bio=bio;
        }
        if(skills){
            user.profile.skills=skillsArray;
        }
        //resume section 

        await user.save();
        return res.status(200).json({
            message:"Profile updated successfully",
            user,
            success:true
        })
    }catch(error){
        console.log(error);
    }
}