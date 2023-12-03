import express from 'express';
const router = express.Router();
import Student from '../../models/student/register.js';
import { ObjectId } from 'mongodb';
import { transport } from '../../packages/mailer/index.js';

// OTP
import otpGenerator from 'otp-generator';
import { CONFIG } from '../../config.js';

//Get
router.get('/', async (req, res) => {
  try {
    const student = await Student.find();
    res.status(200).json({
      length: student.length,
      students: student,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

router.get('/:studentId', async (req, res) => {
  try {
    const idToSearch = new ObjectId(req.params.studentId);
    const studentDetails = await Student.findById(idToSearch);
    res.status(200).json({
      studentDetails: studentDetails,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

//POST
router.post('/', async (req, res) => {
  try {
    const checkUserAlreadyExist = await Student.findOne({ email: req.body.email });
    if (checkUserAlreadyExist === null) {
      const otp = otpGenerator.generate(6, {
        digits: true,
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false,
      });
      const student = new Student({
        name: req.body.name,
        email: req.body.email,
        otp: otp,
      });
      const newStudent = await student.save();
      res.status(200).json({
        studentDetails: newStudent,
      });
      let mailOptions = {
        from: CONFIG.MAILER_ID,
        to: newStudent.email,
        subject: 'Your One-Time Password (OTP) for Sign Up Verification',
        html: `
                    Dear ${newStudent.name},<br><br>
                    Thank you for choosing to sign up with Opportunity Portal eDC IIT Delhi. To complete your registration and verify your account, we require you to enter a One-Time Password (OTP) which has been generated exclusively for you.<br><br>
                    Please enter the following OTP to complete the verification process: <b>${newStudent.otp}</b><br><br>
                    If you did not initiate this sign-up request, please disregard this email and notify our customer support team immediately at <u>opportunities.edciitd@gmail.com</u><br><br>
                    Thank you for choosing to sign up. We look forward to providing you with a seamless and enjoyable experience.<br><br>
                    Best regards,<br>
                    eDC IIT Delhi<br>
               `,
      };
      transport.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        }
      });
    } else {
      res.status(401).json({
        message: 'Account already exist',
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

//PUT
router.put('/:studentId', async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.studentId,
      {
        $set: {
          course: req.body.course,
          department: req.body.department,
          year: req.body.year,
          cgpa: req.body.cgpa,
          resumeLink: req.body.resumeLink,
          linkedIn: req.body.linkedIn,
          isVerified: false,
        },
      },
      { new: true },
    );

    res.status(200).json({
      studentDetails: updatedStudent,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

export default router;
