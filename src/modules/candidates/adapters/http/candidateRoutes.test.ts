import express from 'express';
import request from 'supertest';
import { errorHandler, notFoundHandler } from '../../../../shared/httpErrorHandlers';
import { InMemoryCandidateRepository } from '../persistence/InMemoryCandidateRepository';
import { CandidateService } from '../../application/CandidateService';
import { createCandidateRouter } from './candidateRoutes';

const candidate = {
  firstName: 'Ana',
  lastName: 'Torres',
  email: 'ana@correo.com',
  phone: '555-1234',
  companyId: null,
};

const createApp = () => {
  const app = express();
  const service = new CandidateService(new InMemoryCandidateRepository());
  app.use(express.json());
  app.use('/candidates', createCandidateRouter(service));
  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
};

describe('candidate routes', () => {
  it('creates and lists candidates', async () => {
    const app = createApp();
    const created = await request(app).post('/candidates').send(candidate);

    expect(created.status).toBe(201);
    expect(created.body).toEqual({ id: 1, ...candidate });
    expect((await request(app).get('/candidates')).body).toEqual([created.body]);
  });

  it('validates candidate data and prevents duplicate emails', async () => {
    const app = createApp();
    expect((await request(app).post('/candidates').send({ ...candidate, email: 'invalid' })).status).toBe(400);

    await request(app).post('/candidates').send(candidate);
    const duplicate = await request(app).post('/candidates').send({ ...candidate, email: 'ANA@CORREO.COM' });
    expect(duplicate.status).toBe(400);
    expect(duplicate.body.error).toBe('Ya existe un candidato con ese correo');
  });

  it('gets, updates and removes candidates', async () => {
    const app = createApp();
    const created = await request(app).post('/candidates').send(candidate);
    const id = created.body.id;

    expect((await request(app).get(`/candidates/${id}`)).body).toEqual(created.body);
    const updated = await request(app).put(`/candidates/${id}`).send({ ...candidate, firstName: 'Ana Maria' });
    expect(updated.status).toBe(200);
    expect(updated.body.firstName).toBe('Ana Maria');
    expect((await request(app).delete(`/candidates/${id}`)).status).toBe(204);
    expect((await request(app).get(`/candidates/${id}`)).status).toBe(404);
  });

  it('returns 404 for missing candidates and 400 for an empty id', async () => {
    const app = createApp();

    expect((await request(app).get('/candidates/missing')).status).toBe(400);
    expect((await request(app).get('/candidates/%20')).status).toBe(400);
    expect((await request(app).delete('/candidates/missing')).status).toBe(400);
  });
});
