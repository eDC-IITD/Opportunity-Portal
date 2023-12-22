-- CreateTable
CREATE TABLE "founder" (
    "id" INTEGER NOT NULL,
    "name" TEXT,
    "bio" TEXT,
    "linkedIn" TEXT,
    "website" TEXT,
    "startupId" TEXT NOT NULL,

    CONSTRAINT "founder_pkey" PRIMARY KEY ("id","startupId")
);

-- CreateTable
CREATE TABLE "startup" (
    "id" TEXT NOT NULL,
    "companyName" TEXT,
    "email" TEXT NOT NULL,
    "otp" TEXT,
    "linkedIn" TEXT,
    "website" TEXT,
    "tracxn" TEXT,
    "social" TEXT,
    "cruchbase" TEXT,
    "sector" TEXT,
    "noOfEmployees" TEXT,
    "companyVision" TEXT,
    "hrName" TEXT,
    "hrEmail" TEXT,
    "hrDesignation" TEXT,

    CONSTRAINT "startup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job" (
    "id" TEXT NOT NULL,
    "companyName" TEXT,
    "startupId" TEXT NOT NULL,
    "designation" TEXT,
    "type" TEXT,
    "duration" TEXT,
    "stipend" TEXT,
    "noOfOffers" TEXT,
    "skillsRequired" TEXT,
    "jobLocation" TEXT,
    "responsibilities" TEXT,
    "assignment" TEXT,
    "deadline" TEXT,
    "selectionProcess" TEXT,
    "startUpId" TEXT,
    "createdAt" TEXT,
    "approval" TEXT,

    CONSTRAINT "job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "studentApplication" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "status" TEXT,
    "whyShouldWeHireYou" TEXT,

    CONSTRAINT "studentApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "otp" TEXT,
    "course" TEXT,
    "department" TEXT,
    "year" TEXT,
    "cgpa" TEXT,
    "resumeLink" TEXT,
    "linkedIn" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "admin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "startup_id_key" ON "startup"("id");

-- CreateIndex
CREATE UNIQUE INDEX "startup_email_key" ON "startup"("email");

-- CreateIndex
CREATE UNIQUE INDEX "job_id_key" ON "job"("id");

-- CreateIndex
CREATE UNIQUE INDEX "studentApplication_id_key" ON "studentApplication"("id");

-- CreateIndex
CREATE UNIQUE INDEX "studentApplication_jobId_studentId_key" ON "studentApplication"("jobId", "studentId");

-- CreateIndex
CREATE UNIQUE INDEX "student_id_key" ON "student"("id");

-- CreateIndex
CREATE UNIQUE INDEX "student_email_key" ON "student"("email");

-- CreateIndex
CREATE UNIQUE INDEX "admin_id_key" ON "admin"("id");

-- CreateIndex
CREATE UNIQUE INDEX "admin_username_key" ON "admin"("username");

-- AddForeignKey
ALTER TABLE "founder" ADD CONSTRAINT "founder_startupId_fkey" FOREIGN KEY ("startupId") REFERENCES "startup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job" ADD CONSTRAINT "job_startupId_fkey" FOREIGN KEY ("startupId") REFERENCES "startup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "studentApplication" ADD CONSTRAINT "studentApplication_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "studentApplication" ADD CONSTRAINT "studentApplication_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "job"("id") ON DELETE CASCADE ON UPDATE CASCADE;
