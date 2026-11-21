-- Replace the implicit many-to-many relation with candidates.company_id.
-- Existing candidate-company links are migrated where present.
ALTER TABLE "candidates" ADD COLUMN "company_id" TEXT;

UPDATE "candidates" AS candidate
SET "company_id" = relation."B"
FROM "_CandidateToCompany" AS relation
WHERE relation."A" = candidate."id";

DROP TABLE "_CandidateToCompany";

ALTER TABLE "candidates"
ADD CONSTRAINT "candidates_company_id_fkey"
FOREIGN KEY ("company_id") REFERENCES "companies"("id")
ON DELETE SET NULL ON UPDATE CASCADE;
