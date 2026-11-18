import { Candidate, NewCandidate } from '../domain/Candidate';

export interface CandidateRepository {
  findAll: () => Promise<Candidate[]>;
  findById: (id: string) => Promise<Candidate | undefined>;
  save: (candidate: NewCandidate) => Promise<Candidate>;
  update: (id: string, candidate: NewCandidate) => Promise<Candidate | undefined>;
  remove: (id: string) => Promise<boolean>;
}
