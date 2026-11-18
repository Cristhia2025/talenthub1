import { DomainError } from '../../../shared/DomainError';
import { parseNewCandidate } from './Candidate';

const validInput = {
  name: ' Ana Torres ',
  email: ' Ana@Correo.com ',
  city: ' Quito ',
  experienceYears: 2,
  skills: [' TypeScript ', 'SQL'],
};

describe('parseNewCandidate', () => {
  it('trims text fields and normalizes email', () => {
    expect(parseNewCandidate(validInput)).toEqual({
      name: 'Ana Torres',
      email: 'ana@correo.com',
      city: 'Quito',
      experienceYears: 2,
      skills: ['TypeScript', 'SQL'],
    });
  });

  it('rejects missing required fields', () => {
    expect(() => parseNewCandidate({ name: 'Ana' })).toThrow(DomainError);
  });

  it('rejects invalid email addresses', () => {
    expect(() => parseNewCandidate({ ...validInput, email: 'invalid' })).toThrow(
      'El correo electrónico no es válido',
    );
  });

  it('requires non-negative integer experience', () => {
    expect(() => parseNewCandidate({ ...validInput, experienceYears: -1 })).toThrow(DomainError);
    expect(() => parseNewCandidate({ ...validInput, experienceYears: 1.5 })).toThrow(DomainError);
  });

  it('rejects malformed skills', () => {
    expect(() => parseNewCandidate({ ...validInput, skills: ['TypeScript', ' '] })).toThrow(DomainError);
  });
});
