CREATE TABLE "candidates" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "email" VARCHAR(254) NOT NULL,
    "city" VARCHAR(100) NOT NULL,
    "experience_years" INTEGER NOT NULL,
    "skills" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "candidates_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "candidates_email_key" ON "candidates"("email");
