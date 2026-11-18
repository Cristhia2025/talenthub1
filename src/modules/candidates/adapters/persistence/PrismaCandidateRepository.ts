import { PrismaClient } from '../../../../generated/prisma/client';
import { DomainError } from '../../../../shared/DomainError';
import { Candidate, NewCandidate } from '../../domain/Candidate';
import { CandidateRepository } from '../../ports/CandidateRepository';

type CandidateRecord = {
  id: string;
  name: string;
  email: string;
  city: string;
  experienceYears: number;
  skills: string[];
};

const toCandidate = (record: CandidateRecord): Candidate => ({
  id: record.id,
  name: record.name,
  email: record.email,
  city: record.city,
  experienceYears: record.experienceYears,
  skills: record.skills,
});

const hasErrorCode = (error: unknown, code: string): boolean =>
  typeof error === 'object' && error !== null && (error as { code?: string }).code === code;

const CANDIDATE_EMAIL_ALREADY_EXISTS = 'Ya existe un candidato con ese correo';

export class PrismaCandidateRepository implements CandidateRepository {
  constructor(private readonly prisma: PrismaClient) {}

  findAll = async (): Promise<Candidate[]> => {
    const records = await this.prisma.candidate.findMany({ orderBy: { name: 'asc' } });
    return records.map(toCandidate);
  };

  findById = async (id: string): Promise<Candidate | undefined> => {
    const record = await this.prisma.candidate.findUnique({ where: { id } });
    return record ? toCandidate(record) : undefined;
  };

  save = async (candidate: NewCandidate): Promise<Candidate> => {
    try {
      return toCandidate(await this.prisma.candidate.create({ data: candidate }));
    } catch (error) {
      if (hasErrorCode(error, 'P2002')) {
        throw new DomainError(CANDIDATE_EMAIL_ALREADY_EXISTS);
      }
      throw error;
    }
  };

  update = async (id: string, candidate: NewCandidate): Promise<Candidate | undefined> => {
    try {
      return toCandidate(await this.prisma.candidate.update({ where: { id }, data: candidate }));
    } catch (error) {
      if (hasErrorCode(error, 'P2025')) return undefined;
      if (hasErrorCode(error, 'P2002')) {
        throw new DomainError(CANDIDATE_EMAIL_ALREADY_EXISTS);
      }
      throw error;
    }
  };

  remove = async (id: string): Promise<boolean> => {
    try {
      await this.prisma.candidate.delete({ where: { id } });
      return true;
    } catch (error) {
      if (hasErrorCode(error, 'P2025')) return false;
      throw error;
    }
  };
}
