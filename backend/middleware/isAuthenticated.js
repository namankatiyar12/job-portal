import jwt from "jsonwebtoken";
const isAuthenticated=async(req,res,next)=>
{
    try{
        const token=req.cookies.token;
        if(!token){
            return res.status(401).json({msg:"Please login to access this resource",
                success:false
            });
        };
        const decoded=jwt.verify(token, process.env.SECRET_KEY);
        if(!decoded){
            return res.status(401).json({msg:"Please login to access this resource",
                success:false})
        };
        req.id=decoded.userId;
        next();
    }catch(error){
        console.log(error);
    }
}
export default isAuthenticated;