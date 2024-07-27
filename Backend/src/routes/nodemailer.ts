import nodemailer from 'nodemailer';
import {EMAIL,EMAIL_PASSWORD} from '../secret'

const transporter = nodemailer.createTransport({
  host: 'smtpout.secureserver.net',
  secure: true, // true for 465, false for other ports
  tls:{
    ciphers: 'SSLv3'
  },
  requireTLS:true,
  port: 465,
debug: true,
  auth: {
    user: EMAIL, // your GoDaddy email address
    pass: EMAIL_PASSWORD, // your GoDaddy email password
  },
});

export const sendOtpEmail = async (to: string, otp: string) => {
  try {
    await transporter.sendMail({
      from: EMAIL, // sender address
      to: to, // list of receivers
      subject: 'Please verify you email.', // Subject line
      html: `<p>Your OTP code is <strong>${otp}</strong></p>. This otp is only valid for 5 mins.`, // html body
    });
    return "OTP sent successfully";
  } catch (error) {
    return "Something went wrong";
  }
};
