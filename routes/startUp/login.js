import express from 'express';
const router = express.Router();
import StartUp from '../../models/startUp/register.js';
import { transport } from '../../packages/mailer/index.js';

import jwt from 'jsonwebtoken';
// OTP
import otpGenerator from 'otp-generator';
import { CONFIG } from '../../config.js';

//POST
router.post('/', async (req, res) => {
  try {
    const startUpDetails = await StartUp.findOne({ email: req.body.email });
    if (!startUpDetails) {
      res.status(401).json({ message: 'Account does not exist' });
    } else {
      const otp = otpGenerator.generate(6, {
        digits: true,
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false,
      });
      const findAndUpdateStartup = await StartUp.findOneAndUpdate(
        { email: req.body.email },
        {
          $set: {
            otp: otp,
          },
        },
        { new: true },
      ).lean();
      res.status(200).json({
        startUpDetails: findAndUpdateStartup,
      });

      // TODO: Refactor all mailOptions into packages/mailer/mailOptions.js
      // Create functions which input (to, name, otp), and return mailOptions object
      let mailOptions = {
        from: CONFIG.MAILER_ID,
        to: findAndUpdateStartup.email,
        subject: 'Your One-Time Password (OTP) for Sign In Verification',
        html: `
                    Dear ${findAndUpdateStartup.companyName},<br><br>
                    To complete your sign in process, we require you to enter a One-Time Password (OTP) which has been generated exclusively for you.<br><br>
                    Please enter the following OTP to complete the sign in process: <b>${findAndUpdateStartup.otp}</b><br><br>
                    If you did not initiate this sign-in request, please disregard this email and notify our customer support team immediately at <u>opportunities.edciitd@gmail.com</u><br><br>
                    Thank you for choosing to sign in. We look forward to providing you with a seamless and enjoyable experience.<br><br>
                    Best regards,<br>
                    eDC IIT Delhi<br>
               `,
      };
      transport.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.error(error);
        }
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

//OTP Verify
router.post('/otp/verify', async (req, res) => {
  try {
    const startUpDetails = await StartUp.findOne({ email: req.body.email });
    if (startUpDetails.otp === req.body.otp) {
      const token = jwt.sign({ _id: startUpDetails._id }, CONFIG.JWT_SECRET_KEY);
      res.status(200).json({
        startUpDetails: startUpDetails,
        token: token,
      });
      // Delete the OTP from the db
    } else {
      res.status(403).json({
        message: 'Wrong OTP',
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

export default router;
