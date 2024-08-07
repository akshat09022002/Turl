import express from 'express';
import { urlDetailType } from '../schema';
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../secret';
import cookieParser from 'cookie-parser';

const prisma = new PrismaClient()

const app= express();
app.use(express.json());
app.use(cookieParser());

const router= express.Router();

router.post('/generateUrl',async (req,res)=>{
    const response : urlDetailType = await req.body;
    const jwtuserId= req.cookies.token;

    const userId: any= jwt.verify(jwtuserId,JWT_SECRET);

    try{
        if(userId.userid){

            console.log(userId.userid);
    
            const isUserPresent= await prisma.user.findUnique({
                where:{
                    id:userId.userid
                }
            });
    
            if(!isUserPresent){
                return res.status(403).json({
                    error: "Unauthorized User Validation"
                })
            }
            
            const extractor=await prisma.uRL.create({
                data:{
                    url:response.url,
                    lastVisit: new Date(),
                    visitorCount: 0,
                    userId: userId.userid
                }
            });
    
            return res.status(200).json({
                "short url": "tinyurl/"+extractor.id+".turl.co.in"
            })
        
        }else{
    
            const extractor=await prisma.uRL.create({
                data:{
                    url:response.url,
                    lastVisit: new Date(),
                    visitorCount: 0
                }
            });
    
            return res.status(200).json({
                "short url": "tinyurl/"+extractor.id+".turl.co.in"
            })
        
        }
    }catch{
        return res.status(404).json({
            msg: "Something went wrong"
        })
    }
    
    
});


router.get('/*',async (req,res)=>{
    const fullPath : {[key:string]:string} = req.params;
    console.log(fullPath['0'].split('.')[0]);

    try{
        const finder= await prisma.uRL.findMany({
            where:{
                id:fullPath['0'].split('.')[0]
            }
        })
    
        if(finder.length==0){
            return res.status(403).json({
                "error": "url not found"
            })
        }
    
        else{

            const update= await prisma.uRL.update({
                where:{
                    id:fullPath['0'].split('.')[0]
                },
                data:{
                    lastVisit: new Date(),
                    visitorCount: finder[0].visitorCount+1
                }
            })

            return res.status(200).redirect(finder[0].url);
        }
    }
    catch{
        return res.status(404).json({
            "error": "Something went wrong"
        })
    }

   
})

export const urlRoute = router;