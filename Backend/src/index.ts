import express from "express";
import cors from "cors";
import { urlRoute } from "./routes/url";
import { userRoute } from "./routes/user";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { pageRoute } from "./routes/page";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "https://turl.co.in",
    credentials: true,
  })
);
app.use("/user", userRoute);
app.use("/pages", pageRoute);
app.use("/", urlRoute);

app.listen(PORT);
