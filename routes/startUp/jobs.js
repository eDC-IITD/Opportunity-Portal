import express from "express"
const router = express.Router()
import Jobs from '../../models/student/jobs.js';
import StartUp from '../../models/startUp/register.js';
import Student from '../../models/student/register.js';
import { ObjectId } from 'mongodb';

//Get
router.get('/', async (req, res) => {
    try {
        const jobs = await Jobs.find(
            { 
                $and: [
                    { startUpId: req.query.startUpId }, 
                    { type: req.query.type },
        ]}).sort({"createdAt":-1,"deadline":1})

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
        const idToSearch = new ObjectId(req.params.jobId);
        const job = await Jobs.findById(idToSearch);
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

//POST
router.post('/', async (req, res) => {
    try {
        const job = new Jobs({
            companyName: req.body.companyName,
            designation: req.body.designation,
            type: req.body.type,
            duration: req.body.duration,
            stipend: req.body.stipend,
            noOfOffers: req.body.noOfOffers,
            skillsRequired: req.body.skillsRequired,
            jobLocation: req.body.jobLocation,
            responsibilities: req.body.responsibilities,
            assignment: req.body.assignment,
            deadline:req.body.deadline,
            selectionProcess: req.body.selectionProcess,
            startUpId: req.body.startUpId,
            createdAt: req.body.createdAt,
            approval : "pending",
        })
        const newJob = await job.save()

        //Added job id in startUp list
        const startUpDetails = await StartUp.findByIdAndUpdate(newJob.startUpId, {
            $push: {
                "jobs": {
                    "jobId": newJob._id
                }
            }
        }, { 'new': true })

        res.status(201).json({
            status: 201,
            jobDetails: newJob,
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


//PUT
router.put('/:jobId', async (req, res) => {
    try {
        const jobIdToSearch = new ObjectId(req.params.jobId);
        const updatedjob = await Jobs.updateOne(
            { _id: jobIdToSearch, "studentsApplied.studentId": req.body.studentId },
            { $set: { "studentsApplied.$.status": req.body.status } },
            { 'new': true }
        )

        const studentIdToSearch = new ObjectId(req.body.studentId);
        const updatedStudent = await Student.updateOne(
            { _id: studentIdToSearch, "jobsApplied.jobId": req.params.jobId },
            { $set: { "jobsApplied.$.status": req.body.status } },
            { 'new': true }
        )

        res.status(200).json({
            status: 200,
            studentDetails: updatedStudent,
            jobDetails: updatedjob
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
router.put('/update/:jobId', async (req, res) => {
    try {
        const jobIdToSearch = new ObjectId(req.params.jobId);
        const updatedjob = await Jobs.updateOne(
            { _id: jobIdToSearch },
            {
                $set: {
                    designation: req.body.designation,
                    duration: req.body.duration,
                    stipend: req.body.stipend,
                    noOfOffers: req.body.noOfOffers,
                    skillsRequired: req.body.skillsRequired,
                    jobLocation: req.body.jobLocation,
                    responsibilities: req.body.responsibilities,
                    assignment: req.body.assignment,
                    deadline: req.body.deadline,
                    selectionProcess: req.body.selectionProcess,
                    createdAt: req.body.createdAt,
                    approval : "pending",

                }
            },
            { 'new': true }
        )
        res.status(200).json({
            status: 200,
            jobDetails: updatedjob
        })
    }
    catch (err) {
        res.status(500).json({
            status: 500,
            message: err.message
        })
    }
})


export default router