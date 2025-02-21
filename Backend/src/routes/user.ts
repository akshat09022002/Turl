import express from "express";
import bcrypt from "bcrypt";
import {
  userCredenType,
  userCreden,
  loginCredenType,
  loginCreden,
  updatePasswordDetailType,
  updatePasswordDetail,
} from "../schema";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import otpGenerator from "otp-generator";
import { sendOtpEmail } from "./nodemailer";
import { middleware } from "../middleware/middleware";

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) throw Error("No JWT secret present");

const app = express();
app.use(express.json());
app.use(cookieParser());

const router = express.Router();

router.post("/signup", async (req, res) => {
  const userDetails: userCredenType = await req.body;

  const OTP = otpGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });

  const inputCheck = userCreden.safeParse(userDetails);
  if (inputCheck.success === false) {
    return res.status(403).json({
      message: "Invalid Credentials",
    });
  }

  try {
    const response = await prisma.user.findUnique({
      where: {
        email: userDetails.email,
      },
    });

    if (response) {
      return res.status(403).json({
        msg: "User Already Exists",
      });
    }

    const ispresent = await prisma.otp.findUnique({
      where: {
        email: userDetails.email,
      },
    });

    if (ispresent) {
      await prisma.otp.update({
        where: {
          email: userDetails.email,
        },
        data: {
          otp: OTP,
          expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        },
      });
    } else {
      await prisma.otp.create({
        data: {
          email: userDetails.email,
          otp: OTP,
          expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        },
      });
    }

    res.cookie("user", JSON.stringify(userDetails), {
      httpOnly: true,
      secure: true,
      maxAge: 60 * 1000,
      sameSite: "none",
    });

    await sendOtpEmail(userDetails.email, OTP).then((response) => {
      if (response) {
        return res.status(200).json({
          msg: "Otp Sent Successfully",
        });
      }
      return res.status(500).json({
        msg: "Something Went Wrong",
      });
    });
  } catch {
    return res.status(400).json({
      msg: "Something Went Wrong",
    });
  }
});

router.post("/login", async (req, res) => {
  const userDetails: loginCredenType = await req.body;

  const inputCheck = loginCreden.safeParse(userDetails);

  if (inputCheck.success === false) {
    return res.status(401).json({
      msg: "Invalid Credentials",
    });
  }

  try {
    const response = await prisma.user.findUnique({
      where: {
        email: userDetails.email,
      },
    });

    if (!response) {
      return res.status(401).json({
        msg: "Invalid Credentials",
      });
    }

    bcrypt.compare(userDetails.password, response.password, (err, result) => {
      if (err || result === false) {
        return res.status(401).json({
          msg: "Invalid Credentials",
        });
      }

      const token = jwt.sign({ userid: response.id }, JWT_SECRET);

      res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        maxAge: 60 * 24 * 60 * 60 * 1000,
      });

      res.clearCookie("user");

      return res.status(200).json({
        msg: "Login Successful",
        firstName: response.firstName.toUpperCase(),
        lastName: response.lastName?.toUpperCase(),
        email: response.email.toLowerCase(),
      });
    });
  } catch (err) {
    res.clearCookie("user");

    return res.status(401).json({
      msg: "Something Went Wrong Try Again After Some Time",
    });
  }
});

router.post("/updatePassword", middleware, async (req: any, res) => {
  try {
    const passwordDetails: updatePasswordDetailType = req.body;
    const userId = req.userId;

    if (!userId) {
      return res.status(403).json({
        msg: "Unauthorized Request",
      });
    }

    const success = updatePasswordDetail.safeParse(passwordDetails);

    if (!success.success) {
      return res.status(400).json({
        msg: "Invalid Input",
      });
    }

    const userDetails = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!userDetails) {
      return res.status(403).json({
        msg: "Unauthorized Request",
      });
    }

    bcrypt.compare(
      passwordDetails.currentPassword,
      userDetails.password,
      async (err, result) => {
        if (err || result === false) {
          return res.status(401).json({
            msg: "Invalid Credentials",
          });
        }

        const saltRounds = 10;
        bcrypt.hash(
          passwordDetails.newPassword,
          saltRounds,
          async (err, hash) => {
            if (err) {
              return res.status(500).json({
                msg: "Server Error",
              });
            }
            await prisma.user.update({
              where: {
                id: userId,
              },
              data: {
                password: hash,
              },
            });
            return res.status(200).json({
              msg: "Password Updated Successfully",
            });
          }
        );
      }
    );
  } catch (err) {
    return res.status(500).json({
      msg: "Server Error",
    });
  }
});

router.get("/verify-otp", async (req, res) => {
  try {
    const userDetails: userCredenType = JSON.parse(req.cookies.user);
    let inotp = req.query.otp;
    const response = await prisma.otp.findUnique({
      where: {
        email: userDetails.email,
      },
    });

    if (response == null || response.expiresAt < new Date()) {
      return res.status(401).json({
        msg: "Invalid Request",
      });
    }

    const checkotp = response.otp.toString();

    if (checkotp === inotp) {
      const saltRounds = 10;

      bcrypt.hash(userDetails.password, saltRounds, async (err, hash) => {
        const responseUser = await prisma.user.create({
          data: {
            firstName: userDetails.firstName,
            lastName: userDetails.lastName,
            email: userDetails.email,
            password: hash,
          },
        });

        await prisma.otp.delete({
          where: {
            id: response.id,
          },
        });
      });

      return res.status(200).json({
        msg: "Signed Up Successfully",
        firstName: userDetails.firstName.toUpperCase(),
        lastName: userDetails.lastName?.toUpperCase(),
        email: userDetails.email.toLowerCase(),
      });
    } else {
      return res.status(401).json({
        msg: "Invalid Otp",
      });
    }
  } catch (err) {
    return res.status(401).json({
      msg: "Something Went Wrong",
    });
  }
});

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

router.get("/logout", (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
      maxAge: 60 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      msg: "Logout Successful",
    });
  } catch (err) {
    return res.status(401).json({
      msg: "Something Went Wrong",
    });
  }
});

export const userRoute = router;
