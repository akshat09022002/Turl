import express from "express";
import cors from "cors";
import { urlRoute } from "./routes/url";
import { userRoute } from "./routes/user";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { pageRoute } from "./routes/page";
import { secrets } from "./secrets";

dotenv.config();
const app = express();
const PORT = secrets.PORT;
const FRONTEND_URL = secrets.FRONTEND_URL;

if(!PORT) throw Error("No Port Specified");
if(!FRONTEND_URL) throw Error("No Frontend URL Present");

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [FRONTEND_URL],
    credentials: true,
  })
);
app.use("/user", userRoute);
app.use("/pages", pageRoute);
app.use("/", urlRoute);

app.listen(PORT,()=>{
  console.log(`server started at ${PORT}`)
});
