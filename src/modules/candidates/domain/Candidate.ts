import { DomainError } from '../../../shared/DomainError';

export interface Candidate {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  companyId: string | null;
}

export type NewCandidate = Omit<Candidate, 'id'>;

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim() !== '';

export const parseNewCandidate = (input: unknown): NewCandidate => {
  const data = (input ?? {}) as Record<string, unknown>;
  const { firstName, lastName, email, phone, companyId } = data;

  if (!isNonEmptyString(firstName) || firstName.trim().length > 100 ||
      !isNonEmptyString(lastName) || lastName.trim().length > 100) {
    throw new DomainError('El nombre y el apellido son obligatorios y no deben superar 100 caracteres');
  }
  if (!isNonEmptyString(email) || email.trim().length > 150) {
    throw new DomainError('El correo es obligatorio y no debe superar 150 caracteres');
  }

  const normalizedEmail = email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    throw new DomainError('El correo electrónico no es válido');
  }

  let normalizedPhone: string | null = null;
  if (phone !== undefined && phone !== null) {
    if (typeof phone !== 'string' || phone.trim().length > 20) {
      throw new DomainError('El teléfono no debe superar 20 caracteres');
    }
    normalizedPhone = phone.trim() || null;
  }

  let normalizedCompanyId: string | null = null;
  if (companyId !== undefined && companyId !== null) {
    if (typeof companyId !== 'string' || companyId.trim() === '') {
      throw new DomainError('El identificador de la empresa no es válido');
    }
    normalizedCompanyId = companyId.trim();
  }

  return {
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    email: normalizedEmail,
    phone: normalizedPhone,
    companyId: normalizedCompanyId,
  };
};
