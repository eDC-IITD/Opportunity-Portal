import mongoose from 'mongoose';

const jobsSchema = new mongoose.Schema({
  companyName: {
    type: String,
  },
  designation: {
    type: String,
  },
  type: {
    type: String,
  },
  duration: {
    type: String,
  },
  stipend: {
    type: String,
  },
  noOfOffers: {
    type: String,
  },
  skillsRequired: {
    type: String,
  },
  jobLocation: {
    type: String,
  },
  responsibilities: {
    type: String,
  },
  assignment: {
    type: String,
  },
  deadline: {
    type: String,
  },
  selectionProcess: {
    type: String,
  },
  startUpId: {
    type: String,
  },
  createdAt: {
    type: String,
  },
  approval: {
    type: String,
  },
  studentsApplied: [
    {
      studentId: {
        type: String,
      },
      name: {
        type: String,
      },
      email: {
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
        type: String,
      },
      linkedIn: {
        type: String,
      },
      whyShouldWeHireYou: {
        type: String,
      },
      status: {
        type: String,
      },
    },
  ],
});

export default mongoose.model('Jobs', jobsSchema);
