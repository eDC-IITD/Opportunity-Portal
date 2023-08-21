import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();
const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAILER_ID,
        pass: process.env.MAILER_APP_PASSWORD
    },
    debug : true
  });
export {transport}