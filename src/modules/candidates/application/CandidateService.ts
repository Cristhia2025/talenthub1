import { NotFoundError } from '../../../shared/NotFoundError';
import { Candidate, parseNewCandidate } from '../domain/Candidate';
import { CandidateRepository } from '../ports/CandidateRepository';

const CANDIDATE_NOT_FOUND_MESSAGE = 'Candidato no encontrado';

export class CandidateService {
  constructor(private readonly repository: CandidateRepository) {}

  list = async (): Promise<Candidate[]> => this.repository.findAll();

  getById = async (id: string): Promise<Candidate> => {
    const candidate = await this.repository.findById(id);
    if (!candidate) {
      throw new NotFoundError(CANDIDATE_NOT_FOUND_MESSAGE);
    }
    return candidate;
  };

  create = async (input: unknown): Promise<Candidate> => this.repository.save(parseNewCandidate(input));

  update = async (id: string, input: unknown): Promise<Candidate> => {
    const updated = await this.repository.update(id, parseNewCandidate(input));
    if (!updated) {
      throw new NotFoundError(CANDIDATE_NOT_FOUND_MESSAGE);
    }
    return updated;
  };

  remove = async (id: string): Promise<void> => {
    if (!(await this.repository.remove(id))) {
      throw new NotFoundError(CANDIDATE_NOT_FOUND_MESSAGE);
    }
  };
}
