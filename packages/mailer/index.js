import nodemailer from 'nodemailer';
import { CONFIG } from '../../config';

// TODO: Create a mail queue, also use AWS instead of Gmail

const transport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: CONFIG.MAILER_ID,
    pass: CONFIG.MAILER_APP_PASSWORD,
  },
  debug: true,
});
export { transport };
