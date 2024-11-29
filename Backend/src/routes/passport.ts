// passport-setup.js
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import { userCredenType } from '../schema';
import bcrypt from 'bcrypt';

dotenv.config();
const prisma = new PrismaClient();

const GOOGLE_CLIENT_ID=process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET= process.env.GOOGLE_CLIENT_SECRET

if(!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) throw Error("No Google Client Credentials Present");

async function generateRandomPassword() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:3000/user/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
  try {

    if(profile===undefined || profile.emails===undefined || profile.name===undefined) {
        return done(null,false);
    }

    let user = await prisma.user.findUnique({ where: { email: profile.emails[0].value } });

    const randomPassword= await generateRandomPassword();
    const hashedPassword =await bcrypt.hash(await generateRandomPassword(),10);

       
        if (!user) {
            user= await prisma.user.create({
              data: {
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                email: profile.emails[0].value,
                password: hashedPassword
                
              },
            });
          }
        else{

            user= await prisma.user.update({
                where:{
                    email:profile.emails[0].value,
                },
                data:{
                    googleId:profile.id,
                    firstName: profile.name.givenName,
                    lastName: profile.name.familyName,
                    email: profile.emails[0].value,
                    password:hashedPassword,
                    refreshToken:refreshToken,
                    accessToken: accessToken,
                }
            })

        } 

    return done(null, user);
  } catch (error) {
    return done(error);
  }
}));

export default passport;
