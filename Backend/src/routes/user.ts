import express from 'express';
import bcrypt from 'bcrypt';
import { userCredenType,userCreden, loginCredenType, loginCreden } from '../schema';
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken';
import {EMAIL, JWT_SECRET} from '../secret';
// import passport from 'passport';
import cookieParser from 'cookie-parser';
import otpGenerator from 'otp-generator';
import {sendOtpEmail} from './nodemailer';

const prisma = new PrismaClient()



const app=express();
app.use(express.json());
app.use(cookieParser());

const router=express.Router();

router.post('/signup',async(req,res)=>{
    const userDetails: userCredenType=await req.body;

    const OTP= otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });

    const inputCheck= userCreden.safeParse(userDetails);
    if(inputCheck.success===false){
        return res.status(403).json({
            message: "invalid credentials"
        })
    }

    try{

    const response= await prisma.user.findMany({
        where:{
            email: userDetails.email,
        }
    })

    if(response.length>0){
        return res.status(403).json({
            msg:"user already exists"
        })
    }

        const ispresent= await prisma.otp.findMany({
            where:{
                email:userDetails.email,
            }
        })

        if(ispresent.length>0){

            await prisma.otp.update({
                where:{
                    email:userDetails.email
                },
                data:{
                    otp:OTP,
                    expiresAt:new Date(Date.now() + 5*60*1000)
                }
            })
        }
        else{
            await prisma.otp.create({
                data:{
                    email:userDetails.email,
                    otp:OTP,
                    expiresAt:new Date(Date.now() + 5*60*1000)
                }
            })
        }

    }catch{
        
        res.status(400).json({
            msg:"something went wrong"
        })

    }
    

    res.cookie('user',userDetails,{
        httpOnly:true,
        secure:false,
        maxAge: 24*60*60*1000,
        sameSite: 'lax'
    })

    const msg= await sendOtpEmail(userDetails.email,OTP);

    return res.status(200).json({
        msg: msg,
        otp:OTP
    })
   
})

router.get('/login',async(req,res)=>{
    const userDetails: loginCredenType = await req.body;

   
    const inputCheck= loginCreden.safeParse(userDetails);
    
    if(inputCheck.success===false){
        return res.status(401).json({
            msg: "invalid credentials"
        })
    }

    try{
        const response= await prisma.user.findUnique({
            where:{
                email:userDetails.email
            }
        })

        if(!response){
            return res.status(401).json({
                msg:"invalid credentials"
            })
        }

        bcrypt.compare(userDetails.password,response.password,(err,result)=>{
           if(err || result===false){
                return res.status(401).json({
                    msg:"invalid credentials"
                })  
           }

           const token= jwt.sign({userid: response.id},JWT_SECRET);

        res.cookie('token',token,{
            httpOnly:true,
            secure:false,
            maxAge: 60*24*60*60*1000,
            sameSite: 'lax'
        })

        res.clearCookie('user');

        return res.status(200).json({
            msg:"login successful",
        })

        });

    }catch{

        res.clearCookie('user');

        return res.status(401).json({
            msg: "something went wrong try again after some time"
        })
    }
})

router.get('/verify-otp',async (req,res)=>{
    const userDetails:userCredenType = req.cookies.user;
    let inotp=req.query.otp;

    
    

    try{

        const response=await prisma.otp.findMany({
            where:{
                email: userDetails.email
            }
        })
    
        if(response.length===0 || response[0].expiresAt<new Date()){
            return res.status(401).json({
                msg:"invalid request",
            })
        }
    
        const checkotp= response[0].otp.toString();
    
        if(checkotp===inotp){

        const saltRounds=10;

        bcrypt.hash(userDetails.password,saltRounds,async (err,hash)=>{
        
                    const responseUser=await prisma.user.create({
                        data:{
                            firstName: userDetails.firstName,
                            lastName: userDetails.lastName,
                            email: userDetails.email,
                            password: hash,
                        
                        }
                    })

                    await prisma.otp.delete({
                        where:{
                            id: response[0].id
                        }
                    })
            
            })

            return res.status(200).json({
                message:"signed up successfully"
            })
        }
        else{
        return res.status(401).json({
            msg:"invalid otp"
        })
    
    }
    }
    catch(err){
        return res.status(401).json({
            msg:err
        })
    }

})

// router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
//     // Store user ID in cookie

//     if(!req.user || !req.user.id){
//         return res.status(401).json({
//             msg:"something went wrong"
//         })
//     }

//     res.cookie('userId', req.user.id, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production',
//       maxAge: 24 * 60 * 60 * 1000, // 1 day
//       sameSite: 'lax'
//     });
//     res.redirect('/dashboard');
//   });
  

router.get('/logout',(req,res)=>{
    res.clearCookie('token');
    return res.status(200).json({
        msg:"logout successful"
    })
})

export const userRoute=router;


