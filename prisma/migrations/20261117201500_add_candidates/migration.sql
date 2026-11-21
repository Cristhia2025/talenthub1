-- CreateTable
CREATE TABLE "candidates" (
    "id" SERIAL NOT NULL,
    "first_name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "phone" VARCHAR(20),

    CONSTRAINT "candidates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CandidateToCompany" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CandidateToCompany_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "candidates_email_key" ON "candidates"("email");

-- CreateIndex
CREATE INDEX "_CandidateToCompany_B_index" ON "_CandidateToCompany"("B");

-- AddForeignKey
ALTER TABLE "_CandidateToCompany" ADD CONSTRAINT "_CandidateToCompany_A_fkey" FOREIGN KEY ("A") REFERENCES "candidates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CandidateToCompany" ADD CONSTRAINT "_CandidateToCompany_B_fkey" FOREIGN KEY ("B") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
