import express from "express"
const router = express.Router()
// import StartUp from '../../models/startUp/register.js';
import {prisma} from "../../prisma/prisma.js";
import { transport } from "../../packages/mailer/index.js";

// OTP
import otpGenerator from 'otp-generator';

//Get
router.get('/', async (req, res) => {
    try {
        // const startUp = await StartUp.find()
        const startUp=await prisma.startup.findMany()
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
        // const idToSearch = new ObjectId(req.params.startUpId);
        // const startUpDetails = await StartUp.findById(idToSearch);
        const startUpDetails=await prisma.startup.findUnique({where:{id:req.params.startUpId},include:{founder:true}})
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
        // const checkUserAlreadyExist = await StartUp.findOne({ email: req.body.email })
        const checkUserAlreadyExist=await prisma.startup.findUnique({where:{email:req.body.email}})
        if (checkUserAlreadyExist === null) {
            const otp = otpGenerator.generate(6, { digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
            // const startup = new StartUp({
            //     companyName: req.body.companyName,
            //     email: req.body.email,
            //     otp: otp
            // })
            // const newStartUp = await startup.save()
            let newStartUp=await prisma.startup.create({data:{companyName:req.body.companyName,email:req.body.email,otp:otp}})
            delete newStartUp.otp
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
                    Please enter the following OTP to complete the verification process: <b>${otp}</b><br><br>
                    If you did not initiate this sign-up request, please disregard this email and notify our customer support team immediately at <u>opportunities.edciitd@gmail.com</u><br><br>
                    Thank you for choosing to sign up. We look forward to providing you with a seamless and enjoyable experience.<br><br>
                    Best regards,<br>
                    eDC IIT Delhi<br>
               `
            };
            console.log(mailOptions)
            transport.sendMail(mailOptions, function (error) {
                if (error) {
                    
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
        // const updatedStartUp = await StartUp.findByIdAndUpdate(req.params.startUpId, {
        //     $set: {
        //         "companyVision": req.body.companyVision,
        //         // "location": req.body.location,
        //         "founder": req.body.founder,
        //         "noOfEmployees": req.body.noOfEmployees,
        //         "linkedIn": req.body.linkedIn,
        //         "sector": req.body.sector,
        //         "hrName": req.body.hrName,
        //         "hrEmail": req.body.hrEmail,
        //         "hrDesignation": req.body.hrDesignation,
        //         "website": req.body.website,
        //         "tracxn": req.body.tracxn,
        //         "social": req.body.social,
        //         "cruchbase": req.body.cruchbase
        //     }
        // }, { 'new': true })
        await prisma.startup.update({where:{id:req.params.startUpId},data:{companyVision:req.body.companyVision,noOfEmployees:req.body.noOfEmployees,linkedIn:req.body.linkedIn,sector:req.body.sector,hrName:req.body.hrName,hrEmail:req.body.hrEmail,hrDesignation:req.body.hrDesignation,website:req.body.website,tracxn:req.body.tracxn,social:req.body.social,cruchbase:req.body.cruchbase}})
        for(let x of req.body.founder){
            // console.log(x)
            await prisma.founder.upsert({
                where: {
                    id_startupId: {
                        id: x.id,
                        startupId: req.params.startUpId,
                    },
                },
                update: {
                    name: x.name,
                    email: x.email,
                    designation: x.designation,
                    linkedIn: x.linkedIn,
                },
                create: {
                    id: x.id,
                    name: x.name,
                    email: x.email,
                    designation: x.designation,
                    linkedIn: x.linkedIn,
                    startup: {
                        connect: {
                            id: req.params.startUpId,
                        },
                    },
                },
            });
        }
        const updatedStartUp=await prisma.startup.findUnique({where:{id:req.params.startUpId},include:{founder:true}})
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