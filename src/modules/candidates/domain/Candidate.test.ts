import { DomainError } from '../../../shared/DomainError';
import { parseNewCandidate } from './Candidate';

const validInput = {
  firstName: ' Ana ',
  lastName: ' Torres ',
  email: ' Ana@Correo.com ',
  phone: ' 555-1234 ',
  companyId: null,
};

describe('parseNewCandidate', () => {
  it('trims text fields and normalizes email', () => {
    expect(parseNewCandidate(validInput)).toEqual({
      firstName: 'Ana',
      lastName: 'Torres',
      email: 'ana@correo.com',
      phone: '555-1234',
      companyId: null,
    });
  });

  it('rejects missing required fields', () => {
    expect(() => parseNewCandidate({ firstName: 'Ana' })).toThrow(DomainError);
  });

  it('rejects invalid email addresses', () => {
    expect(() => parseNewCandidate({ ...validInput, email: 'invalid' })).toThrow(
      'El correo electrónico no es válido',
    );
  });

  it('allows an omitted phone and rejects values longer than the database column', () => {
    expect(parseNewCandidate({ ...validInput, phone: undefined }).phone).toBeNull();
    expect(() => parseNewCandidate({ ...validInput, phone: '1'.repeat(21) })).toThrow(DomainError);
  });
});
