import 'dotenv/config';

import { PrismaClient } from '@prisma/client';
import { createPrismaClient } from '../../../../shared/database/prismaClient';
import { DomainError } from '../../../../shared/DomainError';
import { PrismaCandidateRepository } from './PrismaCandidateRepository';

if (!process.env.TEST_DATABASE_URL || process.env.TEST_DATABASE_URL === process.env.DATABASE_URL) {
  throw new Error('TEST_DATABASE_URL debe existir y ser distinta de DATABASE_URL');
}

const candidate = {
  firstName: 'Ana',
  lastName: 'Torres',
  email: 'ana@correo.com',
  phone: '555-1234',
  companyId: null,
};

describe('PrismaCandidateRepository', () => {
  let prisma: PrismaClient;
  let repository: PrismaCandidateRepository;

  beforeAll(async () => {
    prisma = createPrismaClient(process.env.TEST_DATABASE_URL as string);
    repository = new PrismaCandidateRepository(prisma);
    await prisma.$connect();
  });

  beforeEach(async () => {
    await prisma.candidate.deleteMany();
  });

  afterAll(async () => {
    if (prisma) await prisma.$disconnect();
  });

  it('creates, lists and finds candidates', async () => {
    const saved = await repository.save(candidate);

    expect(saved).toMatchObject(candidate);
    expect(saved.id).toBeTruthy();
    expect(await repository.findAll()).toEqual([saved]);
    expect(await repository.findById(saved.id)).toEqual(saved);
    expect(await repository.findById(999)).toBeUndefined();
  });

  it('updates and removes candidates', async () => {
    const saved = await repository.save(candidate);

    expect(await repository.update(saved.id, { ...candidate, firstName: 'Ana Maria' })).toEqual({
      ...saved,
      firstName: 'Ana Maria',
    });
    expect(await repository.update(999, candidate)).toBeUndefined();
    expect(await repository.remove(saved.id)).toBe(true);
    expect(await repository.remove(saved.id)).toBe(false);
  });

  it('rejects duplicate email addresses', async () => {
    await repository.save(candidate);

    await expect(repository.save(candidate)).rejects.toThrow(DomainError);
  });
});
