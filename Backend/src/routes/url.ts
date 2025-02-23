import express from "express";
import {
  updateUrlDetail,
  updateUrlDetailType,
  urlDetail,
  urlDetailType,
} from "../schema";
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

const JWT_SECRET = process.env.JWT_SECRET as string;
const FRONTEND_URL = process.env.FRONTEND_URL as string;

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

router.post("/customiseUrl", middleware, async (req, res) => {
  try {
    const { url, customUID }: { url: string; customUID: string } = req.body;
    const uid = url.split("/")[1];

    const response = await prisma.uRL.findUnique({
      where: {
        uid: customUID,
      },
    });

    if (response) {
      return res.status(400).json({
        msg: "Custom UID already taken",
      });
    }

    await prisma.uRL.update({
      where: {
        uid: uid,
      },
      data: {
        uid: customUID,
      },
    });

    return res.status(200).json({
      msg: "Url updated successfully",
    });
  } catch (err) {
    return res.status(200).json({
      msg: "Record to update not found",
    });
  }
});

router.post("/generateUrl", async (req, res) => {
  try {
    const response: urlDetailType = req.body;
    const jwtuserId: string = req.cookies.token;

    const isSuccess = urlDetail.safeParse(response);
    if (!isSuccess.success) {
      return res.status(403).json({
        msg: "Input must be a valid URL",
      });
    }

    if (jwtuserId) {
      const userId: JwtPayload = jwt.verify(
        jwtuserId,
        JWT_SECRET
      ) as JwtPayload;

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

      if (response.pageUID) {
        const isOwner = await prisma.page.findUnique({
          where: {
            userId: userId.userid,
            pageUID: response.pageUID,
          },
          select: {
            urls: true,
            userId: true,
          },
        });

        if (isOwner) {
          if (isOwner.urls.length === 50) {
            return res.status(403).json({
              msg: "You have reached the maximum limit of 50 urls per page",
            });
          }

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
            short_url: `${FRONTEND_URL.split("/")[2]}/${UID}`,
            msg: "Url generated successfully.",
          });
        } else {
          return res.status(403).json({
            msg: "Invalid Page Ownership",
          });
        }
      } else {
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
          short_url: `${FRONTEND_URL.split("/")[2]}/${UID}`,
        });
      }
    } else {
      if (response.pageUID) {
        return res.status(403).json({
          msg: "Invalid Page Ownership",
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

      const extractor = await prisma.uRL.create({
        data: {
          uid: UID,
          url: response.url,
          lastVisit: new Date(),
          visitorCount: 0,
        },
      });

      return res.status(200).json({
        short_url: `${FRONTEND_URL.split("/")[2]}/${UID}`,
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(404).json({
      msg: "Something went wrong",
      error: err,
    });
  }
});

router.post("/isValidUID/*", async (req: any, res) => {
  try {
    const fullPath: string = req.params[0].split(",")[0];

    let result = true;

    const response = await prisma.uRL.findUnique({
      where: {
        uid: fullPath,
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

router.post("/updateUrl", middleware, async (req: any, res) => {
  const updateDetails: updateUrlDetailType = req.body;
  const userId = req.userId as string;

  const isSuccess = updateUrlDetail.safeParse(updateDetails);
  if (!isSuccess.success) {
    return res.status(403).json({
      msg: "Invalid Data",
    });
  }

  try {
    const updated = await prisma.uRL.update({
      where: {
        id: updateDetails.id,
        userId: userId,
      },
      data: {
        description: updateDetails.description,
      },
    });

    return res.status(200).json({
      msg: "Url Updated Successfully",
    });
  } catch (err) {
    return res.status(400).json({
      msg: "Invalid Request",
    });
  }
});

router.delete("/deleteUrl/*", middleware, async (req: any, res) => {
  const userId = req.userId;
  const fullPath: string = req.params[0];

  try {
    await prisma.uRL.delete({
      where: {
        id: fullPath,
        userId: userId,
      },
    });

    return res.status(200).json({
      msg: "Url Deleted Successfully",
    });
  } catch {
    return res.status(500).json({
      msg: "Something Went Wrong",
    });
  }
});

router.get("/getUrls", middleware, async (req: any, res) => {
  try {
    const userId = req.userId;
    const urls = await prisma.uRL.findMany({
      where: {
        userId: userId,
        pageId: null,
      },
      select: {
        id: true,
        url: true,
        lastVisit: true,
        visitorCount: true,
        description: true,
        uid: true,
      },
    });
    if (urls.length === 0) {
      return res.status(200).json({
        msg: "No Urls Found",
      });
    }
    return res.status(200).json({
      msg: "Urls Fetched Successfully",
      urls: urls,
    });
  } catch (err) {
    return res.status(500).json({
      msg: "Something Went Wrong",
    });
  }
});

router.get("/redirect/:urlCode", async (req, res) => {
  const urlCode = req.params.urlCode;

  try {
    const finder = await prisma.uRL.findUnique({
      where: { uid: urlCode },
    });

    if (!finder) {
      return res.status(404).json({ msg: "URL Not Found" });
    }

    await prisma.uRL.update({
      where: { uid: urlCode },
      data: {
        lastVisit: new Date(),
        visitorCount: { increment: 1 },
      },
    });

    return res.status(200).json({
      msg: "URL Found",
      url: finder.url,
    });
  } catch (err) {
    return res.status(500).json({ error: "Something went wrong" });
  }
});

export const urlRoute = router;
