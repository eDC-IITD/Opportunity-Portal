import express from "express"
const router = express.Router()
import StartUp from '../../models/startUp/register.js';
import { ObjectId } from 'mongodb';
import { transport } from "../../packages/mailer/index.js";

// OTP
import otpGenerator from 'otp-generator';

//Get
router.get('/', async (req, res) => {
    try {
        const startUp = await StartUp.find()
        res.status(200).json({
            status: 200,
            length: startUp.length,
            startUps: startUp
        })
    }
    catch (err) {
        res.status(500).json({
            status: 500,
            message: err.message
        })
    }
})

//Get
router.get('/:startUpId', async (req, res) => {
    try {
        const idToSearch = new ObjectId(req.params.startUpId);
        const startUpDetails = await StartUp.findById(idToSearch);
        res.status(200).json({
            status: 200,
            startUpDetails: startUpDetails
        })
    }
    catch (err) {
        res.status(500).json({
            status: 500,
            message: err.message
        })
    }
})

//POST
router.post('/', async (req, res) => {
    try {
        const checkUserAlreadyExist = await StartUp.findOne({ email: req.body.email })
        if (checkUserAlreadyExist === null) {
            const otp = otpGenerator.generate(6, { digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
            const startup = new StartUp({
                companyName: req.body.companyName,
                email: req.body.email,
                otp: otp
            })
            const newStartUp = await startup.save()
            res.status(200).json({
                status: 200,
                startUpDetails: newStartUp
            })
            let mailOptions = {
                from: process.env.MAILER_ID,
                to: newStartUp.email,
                subject: "Your One-Time Password (OTP) for Sign Up Verification",
                html: `
                    Dear ${newStartUp.companyName},<br><br>
                    Thank you for choosing to sign up with Opportunity Portal eDC IIT Delhi. To complete your registration and verify your account, we require you to enter a One-Time Password (OTP) which has been generated exclusively for you.<br><br>
                    Please enter the following OTP to complete the verification process: <b>${newStartUp.otp}</b><br><br>
                    If you did not initiate this sign-up request, please disregard this email and notify our customer support team immediately at <u>opportunity.portal.edciitd@gmail.com</u><br><br>
                    Thank you for choosing to sign up. We look forward to providing you with a seamless and enjoyable experience.<br><br>
                    Best regards,<br>
                    eDC IIT Delhi<br>
               `
            };
            console.log(mailOptions)
            transport.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log("ofodsf")
                    console.log(error);
                }
            });
        }
        else {
            res.status(401).json({
                status: 401,
                message: "Account already exist"
            })
        }
    }
    catch (err) {
        res.status(500).json({
            status: 500,
            message: err.message
        })
    }
})

//PUT
router.put('/:startUpId', async (req, res) => {
    try {
        const updatedStartUp = await StartUp.findByIdAndUpdate(req.params.startUpId, {
            $set: {
                "companyVision": req.body.companyVision,
                "location": req.body.location,
                "founder": req.body.founder,
                "noOfEmployees": req.body.noOfEmployees,
                "linkedIn": req.body.linkedIn,
                "sector": req.body.sector,
                "website": req.body.website,
                "tracxn": req.body.tracxn,
                "social": req.body.social,
                "cruchbase": req.body.cruchbase
            }
        }, { 'new': true })

        res.status(200).json({
            status: 200,
            startUpDetails: updatedStartUp
        })
    }
    catch (err) {
        res.status(500).json({
            status: 500,
            message: err.message
        })
    }
})

//

export default router