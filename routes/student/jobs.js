import express from "express"
const router = express.Router()
// import Jobs from '../../models/student/jobs.js';
// import Student from '../../models/student/register.js';
// import { ObjectId } from 'mongodb';
import {prisma} from "../../prisma/prisma.js";
//Get
router.get('/', async (req, res) => {
    try {
        var jobs;
        if (req.query.type === undefined) {
            // jobs = await Jobs.find({$and : [{ isActive: "true"} , {approval : "approved"}]}).sort({"createdAt":-1,"deadline":1})
            jobs=await prisma.job.findMany({where:{AND:[{approval:"approved"}]},orderBy:{createdAt:"desc",deadline:"asc"}})
        }
        else {
            // jobs = await Jobs.find({ $and: [{ type: req.query.type }, {approval : "approved"}] }).sort({"createdAt":-1,"deadline":1})
            jobs = await prisma.job.findMany({
                where: {
                    AND: [
                        { type: req.query.type },
                        { approval: "approved" }
                    ]
                },
                include:{
                    studentsApplied:true
                },
                orderBy: [
                    { createdAt: "desc" },
                    { deadline: "asc" }
                ]
            });
        }
        res.status(200).json({
            status: 200,
            length: jobs.length,
            jobs: jobs
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
router.get('/:jobId', async (req, res) => {
    try {
        // const idToSearch = new ObjectId(req.params.jobId);
        // const job = await Jobs.findById(idToSearch);
        const job=await prisma.job.findUnique({where:{id:req.params.jobId}})
        res.status(200).json({
            status: 200,
            jobDetails: job
        })
    }
    catch (err) {
        res.status(500).json({
            status: 500,
            message: err.message
        })
    }
})

//PUT
router.put('/:jobId', async (req, res) => {
    try {
        // const studentIdToSearch = new ObjectId(req.user._id);
        // const student= await Student.findById(studentIdToSearch)
        const student=await prisma.student.findUnique({where:{id:req.body.studentId}})
        if(student.isVerified){
            // const jobIdToSearch = new ObjectId(req.params.jobId);
            // const updatedjob = await Jobs.findByIdAndUpdate(jobIdToSearch, {
            //     $push: {
            //         "studentsApplied": {
            //             "studentId": req.user._id,
            //             "name": req.body.name,
            //             "email": req.body.email,
            //             "course":req.body.course,
            //             "department":req.body.department,
            //             "year":req.body.year,
            //             "cgpa":req.body.cgpa,
            //             "resumeLink": req.body.resumeLink,
            //             "linkedIn":req.body.linkedIn,
            //             "whyShouldWeHireYou":req.body.whyShouldWeHireYou,
            //             "status": req.body.status
            //         }
            //     }
            // }, { 'new': true })
    
            
            // const updatedStudent = await Student.findByIdAndUpdate(studentIdToSearch, {
            //     $push: {
            //         "jobsApplied": {
            //             "jobId": req.params.jobId,
            //             "status": req.body.status
            //         }
            //     }
            // }, { 'new': true })
            await prisma.studentApplication.create({
                data:{
                    jobId:req.params.jobId,
                    studentId:req.body.studentId,
                    status:req.body.status
                }
            })
            const updatedStudent=await prisma.student.findUnique({where:{id:req.body.studentId}})
            const updatedjob=await prisma.job.findUnique({where:{id:req.params.jobId}})
            res.status(200).json({
                status: 200,
                studentDetails: updatedStudent,
                jobDetails: updatedjob
            })
        }else{
            res.status(401).json({
                status:401,
                message:"student is not verified yet"
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

export default router