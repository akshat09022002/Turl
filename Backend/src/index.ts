import express from "express";
import cors from "cors";
import { urlRoute } from "./routes/url";
import { userRoute } from "./routes/user";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));
app.use("/user", userRoute);
app.use("/tinyurl", urlRoute);

app.listen(PORT);
