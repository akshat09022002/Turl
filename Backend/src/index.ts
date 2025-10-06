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
const JWT_SECRET = process.env.JWT_SECRET;
const BACKEND_URL = process.env.BACKEND_URL;
const FRONTEND_URL = process.env.FRONTEND_URL;
const DATABASE_URL = process.env.DATABASE_URL;

if (!JWT_SECRET) throw Error("No JWT Present");
if (!BACKEND_URL) throw Error("No BACKEND_URL present");
if (!FRONTEND_URL) throw Error("No FRONTEND_URL present");
if (!DATABASE_URL) throw Error("No DATABASE_URL present");

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
<<<<<<< HEAD
    origin: FRONTEND_URL,
=======
    origin: ["http://turl.co.in","https://turl-87gzpggx2-akshat09022002s-projects.vercel.app/"],
>>>>>>> f15980bcde031a5d383568f03be6fa46bc229e17
    credentials: true,
  })
);
app.use("/user", userRoute);
app.use("/pages", pageRoute);
app.use("/", urlRoute);

app.listen(PORT);
