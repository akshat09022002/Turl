import express from "express";
import { urlDetailType } from "../schema";
import { PrismaClient } from "@prisma/client";
import jwt, { JwtPayload } from "jsonwebtoken";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

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
    const response: urlDetailType = await req.body;
    const jwtuserId: string = req.cookies.token;
    
   
    if (jwtuserId!="") {
    
      const userId: JwtPayload = jwt.verify(jwtuserId, JWT_SECRET) as JwtPayload;

      console.log(userId.userid);

      const isUserPresent = await prisma.user.findUnique({
        where: {
          id: userId.userid,
        },
      });

      if (!isUserPresent) {
        return res.status(403).json({
          error: "Unauthorized User Validation",
        });
      }

      const UID = generateRandomCode();

      const extractor = await prisma.uRL.create({
        data: {
          url: response.url,
          uid: UID,
          lastVisit: new Date(),
          visitorCount: 0,
          userId: userId.userid,
        },
      });

      return res.status(200).json({
        short_url: "http://localhost:3000/" + UID,
      });
    } else {
     
      const UID = generateRandomCode();
      const extractor = await prisma.uRL.create({
        data: {
          uid: UID,
          url: response.url,
          lastVisit: new Date(),
          visitorCount: 0,
        },
      });

      return res.status(200).json({
        short_url: "http://localhost:3000/" + UID,
      });
    }
  } catch {
    return res.status(404).json({
      msg: "Something went wrong",
    });
  }
});

router.get("/*", async (req, res) => {
  const fullPath:string=JSON.parse(JSON.stringify(req.params))['0'];

  try {
    const finder = await prisma.uRL.findUnique({
      where: {
        uid: fullPath
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
            increment: 1
          }
        },
      });

      return res.status(200).redirect(finder.url);
    }
  } catch {
    return res.status(404).json({
      error: "Something went wrong",
    });
  }
});

export const urlRoute = router;
