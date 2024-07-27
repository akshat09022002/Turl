import express from 'express';
import cors from 'cors';
import {urlRoute} from './routes/url';
import {userRoute} from './routes/user';
import cookieParser from 'cookie-parser';

const app=express();
const PORT= process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use('/user',userRoute);
app.use('/tinyurl',urlRoute);

app.listen(PORT);