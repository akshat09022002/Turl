import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import jwt, { JwtPayload } from "jsonwebtoken";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw Error("No JWT Present");


export const middleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        msg: "Unauthorized Access",
      });
    }

    const decode = jwt.verify(token, JWT_SECRET) as JwtPayload;

    if(!decode.userid) {
      throw new Error("Invalid Token");
    }

    req.userId = decode.userid;

    next();
  } catch{
    return res.status(200).json({
      msg: "Unauthorized Access",
    });
  }
};
