import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
    },
    otp: {
        type: String,
    },
    course: {
        type: String,
    },
    department: {
        type: String,
    },
    year: {
        type: String,
    },
    cgpa: {
        type: String,
    },
    resumeLink: {
        type: String
    },
    linkedIn: {
        type: String
    },
    jobsApplied: [
        {
            jobId: {
                type: String
            },
            status: {
                type: String
            }
        }
    ]
})

export default mongoose.model('Student', studentSchema)