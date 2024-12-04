import express from "express";
import {
  urlDetailType,
  pageDetailType,
  pageDetail,
  updatePageDetailType,
  updatePageDetail,
} from "../schema";
import { PrismaClient } from "@prisma/client";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotevn from "dotenv";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
import { middleware } from "../middleware/middleware";
import { Request, Response, NextFunction } from "express";

const prisma = new PrismaClient();

dotevn.config();
const app = express();
app.use(express.json());
app.use(cookieParser());

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw Error("No JWT Present");

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

interface CustomRequest extends Request {
  userId: string;
}

router.post("/createPage", middleware, async (req: any, res) => {
  try {
    const pageDetails: pageDetailType = req.body;

    const userId = req.userId;

    const isSuccess = pageDetail.safeParse(pageDetails);

    if (!isSuccess.success) {
      res.status(400).json({
        msg: "Invalid Data",
      });
    }

    const pageUID = pageDetails.customUID
      ? pageDetails.customUID
      : generateRandomCode();

    let password: string = pageDetails.password as string;

    if (password !== "") {
      password = await bcrypt.hash(password, 10);
    }

    await prisma.page.create({
      data: {
        pageUID: pageUID,
        description: pageDetails.description,
        userId: userId,
        visitorCount: 0,
        password: password,
      },
    });

    res.status(200).json({
      msg: "Page Created Successfully",
    });
  } catch (err) {
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
});

router.post("/updatePage", middleware, async (req: any, res) => {
  try {
    const updateFields: updatePageDetailType = req.body;
    const userId = req.userId;

    const isSuccess = updatePageDetail.safeParse(updateFields);

    if (!isSuccess.success) {
      res.status(400).json({
        msg: "Invalid Data",
      });
    }

    if (!updateFields.password) {
      console.log("password updating")
      const updated = await prisma.page.update({
        where: {
          pageUID: updateFields.pageUID,
        },
        data: {
          password: updateFields.password,
        },
      });
      res.status(200).json({
        msg: "Page Password Updated",
      });
    } else if (updateFields.description) {
      console.log("descirption updating");
      const updated = await prisma.page.update({
        where: {
          pageUID: updateFields.pageUID,
        },
        data: {
          description: updateFields.description,
        },
      });
      res.status(200).json({
        msg: "Description Password Updated",
      });
    }
  } catch (err) {
    res.status(401).json({
      msg: "Something Went Wrong",
    });
  }
});

router.get("/insertUrl", async (req, res) => {
  const token = req.cookies.token;
  const userIdPayload = jwt.verify(token as string, JWT_SECRET) as JwtPayload;
  const userId = userIdPayload.userid;

  const pageDetails = req.body;

  try {
    const isSuccess = pageDetail.safeParse(pageDetails);
    if (!isSuccess.success) {
      res.status(400).json({
        msg: "Invalid Data",
      });
    }
  } catch {
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
});

export const pageRoute = router;
