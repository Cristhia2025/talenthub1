import { MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';

import { createMongoClient } from '../../../../shared/database/mongoClient';
import { MongoCompanyRepository } from './MongoCompanyRepository';

// Empresa de ejemplo con datos flexibles - datos de prueba en español.
const sampleCompany = {
  name: 'Tech Andes',
  industry: 'Tecnología',
  benefits: ['Seguro médico', 'Trabajo remoto'],
  socialLinks: { linkedin: 'https://linkedin.com/company/techandes' },
  locations: [{ city: 'Quito' }, { city: 'Guayaquil' }],
};

describe('MongoCompanyRepository', () => {
  let server: MongoMemoryServer;
  let client: MongoClient;
  let repository: MongoCompanyRepository;

  beforeAll(async () => {
    server = await MongoMemoryServer.create();
    client = createMongoClient(server.getUri());
    repository = new MongoCompanyRepository(client);
  });

  // Antes de CADA prueba - vacía la colección
  beforeEach(async () => {
    await client.db().collection('companies').deleteMany({});
  });

  // Una vez al final - cierra la conexión para que Jest pueda terminar.
  afterAll(async () => {
    if (client) await client.close();
    if (server) await server.stop();
  });

  it('starts empty', async () => {
    expect(await repository.findAll()).toEqual([]);
  });

  it('saves a company with its flexible data and assigns a text id', async () => {
    const saved = await repository.save(sampleCompany);

    // El id es un texto de 24 caracteres hexadecimales y los datos flexibles se conservan intactos
    expect(saved.id).toMatch(/^[0-9a-f]{24}$/);
    expect(saved).toEqual({ id: saved.id, ...sampleCompany });
  });

  it('lists what was saved', async () => {
    const saved = await repository.save(sampleCompany);

    expect(await repository.findAll()).toEqual([saved]);
  });

  it('finds a company by id', async () => {
    const saved = await repository.save(sampleCompany);

    expect(await repository.findById(saved.id)).toEqual(saved);
  });

  it('returns undefined when the id does not exist or is not valid', async () => {
    expect(await repository.findById('507f1f77bcf86cd799439011')).toBeUndefined();
    expect(await repository.findById('abc')).toBeUndefined();
  });
});
