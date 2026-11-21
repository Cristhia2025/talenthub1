import { DomainError } from '../../../../shared/DomainError';
import { InMemoryCandidateRepository } from './InMemoryCandidateRepository';

const candidate = {
  firstName: 'Ana',
  lastName: 'Torres',
  email: 'ana@correo.com',
  phone: '555-1234',
  companyId: null,
};

describe('InMemoryCandidateRepository', () => {
  it('starts empty and stores candidates with sequential ids', async () => {
    const repository = new InMemoryCandidateRepository();
    expect(await repository.findAll()).toEqual([]);
    expect(await repository.save(candidate)).toEqual({ id: 1, ...candidate });
    expect((await repository.save({ ...candidate, email: 'otro@correo.com' })).id).toBe(2);
  });

  it('returns copies of saved candidate data', async () => {
    const repository = new InMemoryCandidateRepository();
    const saved = await repository.save(candidate);
    saved.phone = 'Mutated';

    expect(await repository.findById(1)).toEqual({ id: 1, ...candidate });
  });

  it('finds and updates candidates', async () => {
    const repository = new InMemoryCandidateRepository();
    const saved = await repository.save(candidate);

    expect(await repository.findById(saved.id)).toEqual(saved);
    expect(await repository.update(saved.id, { ...candidate, firstName: 'Ana Maria' })).toEqual({
      ...saved,
      firstName: 'Ana Maria',
    });
    expect(await repository.update(999, candidate)).toBeUndefined();
  });

  it('rejects duplicate email addresses case-insensitively', async () => {
    const repository = new InMemoryCandidateRepository();
    await repository.save(candidate);

    await expect(repository.save({ ...candidate, email: 'ANA@CORREO.COM' })).rejects.toThrow(DomainError);
  });

  it('removes candidates and returns whether one existed', async () => {
    const repository = new InMemoryCandidateRepository();
    const saved = await repository.save(candidate);

    expect(await repository.remove(saved.id)).toBe(true);
    expect(await repository.remove(saved.id)).toBe(false);
  });
});
