import express from "express";
import { updateUrlDetail, updateUrlDetailType, urlDetail, urlDetailType } from "../schema";
import { PrismaClient } from "@prisma/client";
import jwt, { JwtPayload } from "jsonwebtoken";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { middleware } from "../middleware/middleware";

dotenv.config();
const prisma = new PrismaClient();

const app = express();
app.use(express.json());
app.use(cookieParser());

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) throw Error("No JWT secret present");

const router = express.Router();

function generateRandomCode(): string {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";

  for (let i = 0; i < 5; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters[randomIndex];
  }

  return code;
}

router.post("/generateUrl", async (req, res) => {
  try {
    const response: urlDetailType = req.body;
    const jwtuserId: string = req.cookies.token;

    console.log(response);

    const isSuccess = urlDetail.safeParse(response);
    if (!isSuccess.success) {
      return res.status(403).json({
        msg: "Invalid Input",
      });
    }

    if (jwtuserId != "") {
      const userId: JwtPayload = jwt.verify(
        jwtuserId,
        JWT_SECRET
      ) as JwtPayload;

      console.log(userId.userid);

      const isUserPresent = await prisma.user.findUnique({
        where: {
          id: userId.userid,
        },
      });

      if (!isUserPresent) {
        return res.status(403).json({
          msg: "Unauthorized User Validation",
        });
      }

      const generateUniqueCode = async (): Promise<string> => {
        let uniqueCode: string;
        let isUnique: boolean = false;

        do {
          uniqueCode = generateRandomCode();
          const existingUrl = await prisma.uRL.findUnique({
            where: { uid: uniqueCode },
          });
          isUnique = !existingUrl;
        } while (!isUnique);

        return uniqueCode;
      };

      const UID = await generateUniqueCode();
      console.log("UID", UID);

      if (response.pageUID) {
        console.log("has pageUID", response.pageUID, userId.userid);
        const isOwner = await prisma.page.findUnique({
          where: {
            userId: userId.userid,
            pageUID: response.pageUID,
          },
        });

        if (isOwner) {
          console.log("istheOwner");

            const extractor = await prisma.uRL.create({
              data: {
                url: response.url,
                uid: response.customised_url_name
                  ? response.customised_url_name
                  : UID,
                description: response.description,
                pageId: response.pageUID,
                lastVisit: new Date(),
                visitorCount: 0,
                userId: userId.userid,
              },
            });

          return res.status(200).json({
            short_url: "localhost:3000/" + UID,
            msg:"Url generated successfully."
          });
        } else {
          console.log("not the owner");
          return res.status(403).json({
            msg: "Invalid Page Ownership",
          });
        }
      } else {
        console.log("no pg uid but signed in");
        const extractor = await prisma.uRL.create({
          data: {
            url: response.url,
            uid: response.customised_url_name
              ? response.customised_url_name
              : UID,
            lastVisit: new Date(),
            visitorCount: 0,
            userId: userId.userid,
          },
        });

        return res.status(200).json({
          short_url: "localhost:3000/" + UID,
        });
      }
    } else {
      console.log("none");
      if(response.pageUID){
        return res.status(403).json({
          msg:"Invalid Page Ownership"
        })
      }
      const generateUniqueCode = async (): Promise<string> => {
        let uniqueCode: string;
        let isUnique: boolean = false;
        do {
          uniqueCode = generateRandomCode();
          const existingUrl = await prisma.uRL.findUnique({
            where: { uid: uniqueCode },
          });
          isUnique = !existingUrl;
        } while (!isUnique);

        return uniqueCode;
      };

      const UID = await generateUniqueCode();

      const extractor = await prisma.uRL.create({
        data: {
          uid: UID,
          url: response.url,
          lastVisit: new Date(),
          visitorCount: 0,
        },
      });

      return res.status(200).json({
        short_url: "localhost:3000/" + UID,
      });
    }
  } catch {
    return res.status(404).json({
      msg: "Something went wrong",
    });
  }
});

router.post('/isValidUID/*',async(req:any,res)=>{
  
  try{
    const fullPath: string = req.params[0].split(',')[0];
   
    let result=true;

    const response=await prisma.uRL.findUnique({
      where:{
        uid:fullPath
      }
    });

    if(response) result=false;
    

    return res.status(200).json({
      result,
    })
  }catch(err){
    res.status(500).json({
      msg:"Internal Server Error"
    })
  }
});

router.post('/updateUrl',middleware, async(req:any , res)=>{
  const updateDetails:updateUrlDetailType= req.body;
  const userId=req.userId as string;

  const isSuccess= updateUrlDetail.safeParse(updateDetails);
  if(!isSuccess.success){
    return res.status(403).json({
      msg:"Invalid Data"
    })
  }

  try{
    const updated= await prisma.uRL.update({
      where:{
        id:updateDetails.id,
        userId: userId 
      },
      data:{
        description:updateDetails.description,
      }
    });
  
    console.log(updated);
    return res.status(200).json({
      msg:'Url Updated Successfully'
    });
  }catch(err){
    return res.status(400).json({
      msg:'Invalid Request'
    });
  }
})

router.delete('/deleteUrl/*',middleware,async(req:any ,res)=>{
  const userId=req.userId;
  const fullPath: string = req.params[0];
  
  try{
  await prisma.uRL.delete({
    where:{
      id:fullPath,
      userId:userId,
    }
  })

  res.status(200).json({
    msg:'Url Deleted Successfully'
  });
}catch{
  res.status(400).json({
    msg:'Something Went Wrong'
  });
}
  
})

router.get("/*", async (req, res) => {
  const fullPath: string = JSON.parse(JSON.stringify(req.params))["0"];

  try {
    const finder = await prisma.uRL.findUnique({
      where: {
        uid: fullPath,
      },
    });

    if (!finder) {
      return res.status(403).json({
        error: "url not found",
      });
    } else {
      const update = await prisma.uRL.update({
        where: {
          uid: fullPath,
        },
        data: {
          lastVisit: new Date(),
          visitorCount: {
            increment: 1,
          },
        },
      });

      return res.status(200).redirect(finder.url);
    }
  } catch (err) {
    console.log(err);
    return res.status(404).json({
      error: "Something went wrong",
    });
  }
});

export const urlRoute = router;
