import { Job } from "../models/job.model.js";

export const postJob=async(req,res)=>{
    try{
        const{title,description,requirements,salary,location,jobType,experience,position,companyId}=req.body;
        const userId=req.id;
        if(!title||!description||!requirements||!salary||!location||!jobType||!experience||!position||!companyId){
            return res.status(400).json({message:"Something is missing ",
                success:false
            });
        }
        const job=await Job.create({
            title,
            description,
            requirements:requirements.split(","),
            salary:Number(salary),
            location,
            jobType,
            experienceLevel:experience,
            position,
            company:companyId,
            created_by:userId

        });
        return res.status(201).json({message:"Job posted successfully",
            job,
            success:true
        });

    }catch(error){
        console.log(error);
    }
}
export const getAllJobs=async(req,res)=>{
    try{
        const keyword=req.query.keyword||"";
        const query={
            $or:[
                {title:{$regex:keyword,$options:"i"}},//i is used for case senstivity
                {description:{$regex:keyword,$options:"i"}},//i is used for cas

            ]
        };
        const jobs=await Job.find(query).populate("company").sort({createdAt:-1});
        if(!jobs){
            return res.status(404).json({message:"No jobs found",
                success:false});
        }
        return res.status(200).json({jobs,
            success:true});

    }catch(error){
        console.log(error);
    }

}

//student ke liye 
export const getJobById=async(req,res)=>{
    try{
        const jobId=req.params.id;
        const job=await Job.findById(jobId).populate("company").populate("created_by");
        if(!job){
            return res.status(404).json({message:"Job not found",
                success:false
                });
        }
        return res.status(200).json({job,
            success:true
            });
    }catch(error){
        console.log(error);
    }
}
//admin kitne job post kiye hain
export const getAdminJobs=async(req,res)=>{
    try{
        const adminId=req.id;
        const jobs=await Job.find({created_by:adminId}).populate("company");
        if(!jobs){
            return res.status(404).json({message:"No jobs found",
                success:false
                });
        }
        return res.status(200).json({jobs,
            success:true
            });
        
    }catch(error){
        console.log(error);
    }
}