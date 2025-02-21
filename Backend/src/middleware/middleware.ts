import { Request,Response,NextFunction } from "express";
import dotenv from "dotenv";
import jwt, { JwtPayload } from "jsonwebtoken";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw Error("No JWT Present");

interface CustomRequest extends Request {
    userId?: string;
}

export const middleware=(req:CustomRequest,res:Response,next:NextFunction)=>{
    try{
        const token=req.cookies.token;
        
        if(!token){
            return res.status(401).json({
                msg:"Unauthorized Access"
            })
        }
       
        const decode= jwt.verify(token,JWT_SECRET) as JwtPayload;
       
        req.userId=decode.userid;
        
        next();

    }catch(err:unknown){
        return res.status(200).json({
            msg:"Unauthorized Access"
        })
    }
}
