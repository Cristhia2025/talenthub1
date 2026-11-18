import { DomainError } from '../../../../shared/DomainError';
import { Candidate, NewCandidate } from '../../domain/Candidate';
import { CandidateRepository } from '../../ports/CandidateRepository';

const EMAIL_ALREADY_EXISTS = 'Ya existe un candidato con ese correo';

export class InMemoryCandidateRepository implements CandidateRepository {
  private candidates: Candidate[];
  private nextId: number;

  constructor(initialCandidates: Candidate[] = []) {
    this.candidates = structuredClone(initialCandidates);
    this.nextId = initialCandidates.length + 1;
  }

  findAll = async (): Promise<Candidate[]> => structuredClone(this.candidates);

  findById = async (id: string): Promise<Candidate | undefined> => {
    const candidate = this.candidates.find((item) => item.id === id);
    return candidate ? structuredClone(candidate) : undefined;
  };

  save = async (candidate: NewCandidate): Promise<Candidate> => {
    this.ensureEmailIsAvailable(candidate.email);
    const saved: Candidate = { id: String(this.nextId++), ...structuredClone(candidate) };
    this.candidates.push(saved);
    return structuredClone(saved);
  };

  update = async (id: string, data: NewCandidate): Promise<Candidate | undefined> => {
    const index = this.candidates.findIndex((item) => item.id === id);
    if (index === -1) return undefined;

    this.ensureEmailIsAvailable(data.email, id);
    const updated: Candidate = { id, ...structuredClone(data) };
    this.candidates[index] = updated;
    return structuredClone(updated);
  };

  remove = async (id: string): Promise<boolean> => {
    const index = this.candidates.findIndex((item) => item.id === id);
    if (index === -1) return false;

    this.candidates.splice(index, 1);
    return true;
  };

  private ensureEmailIsAvailable(email: string, exceptId?: string): void {
    const duplicate = this.candidates.some(
      (candidate) => candidate.id !== exceptId && candidate.email.toLowerCase() === email.toLowerCase(),
    );
    if (duplicate) {
      throw new DomainError(EMAIL_ALREADY_EXISTS);
    }
  }
}
