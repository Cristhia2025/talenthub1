import { DomainError } from '../../../shared/DomainError';
import { NotFoundError } from '../../../shared/NotFoundError';
import { InMemoryCandidateRepository } from '../adapters/persistence/InMemoryCandidateRepository';
import { CandidateService } from './CandidateService';

const validCandidate = {
  name: 'Ana Torres',
  email: 'ana@correo.com',
  city: 'Quito',
  experienceYears: 2,
  skills: ['TypeScript', 'SQL'],
};

const createService = (): CandidateService => new CandidateService(new InMemoryCandidateRepository());

describe('CandidateService', () => {
  it('creates candidates with an id', async () => {
    expect(await createService().create(validCandidate)).toEqual({ id: '1', ...validCandidate });
  });

  it('rejects invalid candidates', async () => {
    const service = createService();
    await expect(service.create({ ...validCandidate, experienceYears: -1 })).rejects.toThrow(DomainError);
    expect(await service.list()).toEqual([]);
  });

  it('lists and gets candidates', async () => {
    const service = createService();
    const created = await service.create(validCandidate);

    expect(await service.list()).toEqual([created]);
    expect(await service.getById(created.id)).toEqual(created);
    await expect(service.getById('missing')).rejects.toThrow(NotFoundError);
  });

  it('updates candidate data and keeps its id', async () => {
    const service = createService();
    const created = await service.create(validCandidate);
    const updated = await service.update(created.id, { ...validCandidate, city: 'Cuenca' });

    expect(updated).toEqual({ ...created, city: 'Cuenca' });
    await expect(service.update('missing', validCandidate)).rejects.toThrow(NotFoundError);
  });

  it('removes candidates and reports missing ids', async () => {
    const service = createService();
    const created = await service.create(validCandidate);

    await service.remove(created.id);
    expect(await service.list()).toEqual([]);
    await expect(service.remove(created.id)).rejects.toThrow(NotFoundError);
  });
});
