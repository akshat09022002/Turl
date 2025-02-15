import express from "express";
import { PrismaClient } from "@prisma/client";
import jwt, { JwtPayload } from "jsonwebtoken";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { middleware } from "../middleware/middleware";
import { excelUrlDetail, excelUrlDetailType, urlDetail } from "../schema";
import { saveAs } from "file-saver";

dotenv.config();
const prisma = new PrismaClient();

const app = express();
app.use(express.json());
app.use(cookieParser());

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) throw Error("No JWT secret present");

const router = express.Router();

router.post("/export-excel", async (req, res) => {
  try {
    const urlListDetail: excelUrlDetailType = req.body;
   
    const password= urlListDetail.password;
    // const isSuccess = excelUrlDetail.safeParse(urlListDetail);

    // if (!isSuccess.success) {
    //   return res.status(400).json({
    //     msg: "Invalid Input",
    //   });
    // }
    console.log(urlListDetail.password);

    const response= await prisma.page.findUnique({
        where:{
            pageUID: urlListDetail.pageUID,
        },
        include:{
            urls: true
        }
    });

    if(!response){
        return res.status(400).json({
            msg: "Invalid Page UID",
          });
    }
    //@ts-ignore
    const XlsxPopulate = (await import("xlsx-populate")).default;
    const tableData = response.urls;
    const workbook= await XlsxPopulate.fromBlankAsync();
    const sheet = workbook.sheet(0).name(urlListDetail.pageUID);
      // Add headers
      const headers = Object.keys(tableData[0]);
      sheet.row(1).cell(1).value(headers);

      console.log(tableData);
  
      // Add data rows
      tableData.forEach((row, rowIndex) => {
        const values = Object.values(row);
        sheet.row(rowIndex + 2).cell(1).value(values);
      });
  
      // Apply password protection
      if (password) {
        console.log("Applying password protection...");
        workbook.password(password);
      }
  
      // Generate the file
      const buffer = await workbook.outputAsync();
  
      // Send file to client
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=table_data.xlsx"
      );
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
  
      res.send(Buffer.from(buffer));

    return res.status(200).json({
        msg: "Success",
        response: response
      });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
});

export const xlsiRoute = router;
