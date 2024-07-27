import express from 'express';
import { urlDetailType,pageDetailType, pageDetail } from '../schema';
import { PrismaClient } from '@prisma/client'
import jwt, { JwtPayload } from 'jsonwebtoken';
import { JWT_SECRET } from '../secret';
import cookieParser from 'cookie-parser';

const prisma = new PrismaClient()

const app= express();
app.use(express.json());
app.use(cookieParser());

const router= express.Router();

// All routes still in development are stopped until more clarity is obtained.

router.get('/createPage',async (req,res)=>{

    const pageDetails:pageDetailType= req.body;
    const token= req.cookies.token;
    const userIdPayload= jwt.verify(token as string, JWT_SECRET) as JwtPayload;
    const userId= userIdPayload.userid;

    try{
        const isSuccess= pageDetail.safeParse(pageDetails);

        if(!isSuccess.success){
            res.status(400).json({
                msg: "Invalid Data"
            })
        }

        await prisma.page.create({
            data:{
                title: pageDetails.title,
                description: pageDetails.description,
                userId: userId,
                visitorCount: 0,
                password: pageDetails.password ? pageDetails.password : null,
            }
        })

        res.status(200).json({
            "msg": "Page Created Successfully"
        })

    }catch{
        res.status(500).json({
            msg: "Internal Server Error"
        })
    }

})


router.get('/insertUrl', async (req, res) => {
    
    const token= req.cookies.token;
    const userIdPayload= jwt.verify(token as string, JWT_SECRET) as JwtPayload;
    const userId= userIdPayload.userid;


    const pageDetails= req.body;

    try{

        const isSuccess= pageDetail.safeParse(pageDetails);
        if(!isSuccess.success){
            res.status(400).json({
                msg: "Invalid Data"
            })
        }

        
        
        

    }catch{
        res.status(500).json({
            msg: "Internal Server Error"
        })
    }


})