import express from "express";
import {
  urlDetailType,
  pageDetailType,
  pageDetail,
  updatePageDetailType,
  updatePageDetail,
  urlDetail,
} from "../schema";
import { PrismaClient } from "@prisma/client";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotevn from "dotenv";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
import { middleware } from "../middleware/middleware";
import { Request, Response, NextFunction } from "express";
import axios from "axios";

const prisma = new PrismaClient();

dotevn.config();
const app = express();
app.use(express.json());
app.use(cookieParser());

const JWT_SECRET = process.env.JWT_SECRET;
const BACKEND_URL = process.env.BACKEND_URL;
if (!JWT_SECRET) throw Error("No JWT Present");
if (!BACKEND_URL) throw Error("No BACKEND_URL present");

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
      return res.status(400).json({
        msg: "Invalid Data",
      });
    }

    const userPages = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        pages: true,
      },
    });

    if (userPages?.pages.length === 10) {
      return res.status(403).json({
        msg: "Only 10 pages can be created per user",
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

    return res.status(200).json({
      msg: "Page Created Successfully",
    });
  } catch (err) {
    return res.status(500).json({
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
      return res.status(400).json({
        msg: "Invalid Data",
      });
    }

    if (updateFields.password != undefined) {
      let password = updateFields.password;
      if (password != "") password = await bcrypt.hash(password, 10);
      const updated = await prisma.page.update({
        where: {
          id: updateFields.id,
          userId: userId,
        },
        data: {
          password: password,
        },
      });
      return res.status(200).json({
        msg: "Page Password Updated",
      });
    } else if (updateFields.description != undefined) {
      const updated = await prisma.page.update({
        where: {
          id: updateFields.id,
          userId: userId,
        },
        data: {
          description: updateFields.description,
        },
      });
      return res.status(200).json({
        msg: "Description Password Updated",
      });
    }
  } catch (err) {
    return res.status(401).json({
      msg: "Invalid owner of page",
    });
  }
});

router.get("/getPages", middleware, async (req: any, res) => {
  try {
    const userId = req.userId;

    const pages = await prisma.page.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
        description: true,
        pageUID: true,
        visitorCount: true,
      },
    });

    return res.status(200).json({
      msg: "Fetched Successfully",
      Data: pages,
    });
  } catch (err) {
    return res.status(401).json({
      msg: "Invalid Request",
    });
  }
});

router.post("/geturls", async (req: any, res) => {
  try {
    const pageFields: {
      password: string;
      pageUID: string;
      isFirstTime: boolean;
    } = req.body;

    const response = await prisma.page.findUnique({
      where: {
        pageUID: pageFields.pageUID,
      },
      include: {
        urls: true,
      },
    });

    if (!response) {
      return res.status(401).json({
        msg: "Invalid Page",
      });
    }

    if (response.password == null || response.password == "") {
      await prisma.page.update({
        where: {
          pageUID: pageFields.pageUID,
        },
        data: {
          visitorCount: {
            increment: 1,
          },
        },
      });

      return res.status(200).json({
        msg: "Url's Fetched Successfully",
        urls: response.urls,
      });
    } else {
      bcrypt.compare(
        pageFields.password,
        response.password,
        async (err, result) => {
          if (err || result == false) {
            return res.status(401).json({
              msg: "Invalid Password",
            });
          }

          await prisma.page.update({
            where: {
              pageUID: pageFields.pageUID,
            },
            data: {
              visitorCount: {
                increment: 1,
              },
            },
          });

          return res.status(200).json({
            msg: "Url's Fetched Successfully",
            urls: response.urls,
          });
        }
      );
    }
  } catch (err) {
    return res.status(401).json({
      msg: "Something Went Wrong",
    });
  }
});

router.delete("/deleteUrl/*", middleware, async (req: any, res) => {
  try {
    const userId = req.userId;
    const fullPath: string = req.params[0];

    const response = await prisma.page.delete({
      where: {
        userId: userId,
        pageUID: fullPath,
      },
    });

    return res.status(200).json({
      msg: "Page Deleted Successfully",
    });
  } catch (err: any) {
    return res.status(403).json({
      msg: "You Are Not Authorized To Delete This Page",
    });
  }
});

router.post("/isValidUID/*", async (req: any, res) => {
  try {
    const fullPath: string = req.params[0].split(",")[0];

    let result = true;

    const response = await prisma.page.findUnique({
      where: {
        pageUID: fullPath,
      },
    });

    if (response) result = false;

    return res.status(200).json({
      result,
    });
  } catch (err) {
    return res.status(500).json({
      msg: "Internal Server Error",
    });
  }
});

router.get("/hasPassword", async (req: any, res) => {
  try {
    const pageUID: string = req.query.id;
    const token = req.cookies.token;
    let IsOwner = false;
    if (token) {
      const decode = jwt.verify(token, JWT_SECRET) as JwtPayload;
      const userId = decode.id;
      const response = await prisma.page.findUnique({
        where: {
          userId: userId,
          pageUID: pageUID,
        },
      });
      if (response) {
        IsOwner = true;
      }
    }
    const response = await prisma.page.findUnique({
      where: {
        pageUID: pageUID,
      },
    });
    if (!response) {
      return res.status(400).json({
        msg: "Invalid Page Request",
      });
    }
    if (response.password != "") {
      return res.status(200).json({
        msg: "yes",
        IsOwner,
      });
    }
    return res.status(200).json({
      msg: "no",
      IsOwner,
    });
  } catch (err) {
    return res.status(500).json({
      msg: "Something Went Wrong",
    });
  }
});

router.post("/insertUrl", middleware, async (req: any, res) => {
  const userId = req.userId;
  const urlDetails: urlDetailType = req.body;
  try {
    const isSuccess = pageDetail.safeParse(urlDetails);

    if (!isSuccess.success) {
      return res.status(400).json({
        msg: "Invalid Data",
      });
    }

    await axios.post(
      `${BACKEND_URL}/generateUrl`,
      {
        url: urlDetails.url,
        pageUID: urlDetails.pageUID,
        description: urlDetails.description,
        customised_url_name: urlDetails.customised_url_name,
      },
      {
        withCredentials: true,
      }
    );

    return res.status(200).json({
      msg: "Url Added Successfully",
    });
  } catch (err) {
    return res.status(500).json({
      msg: "Internal Server Error",
    });
  }
});

export const pageRoute = router;
