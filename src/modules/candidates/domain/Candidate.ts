import { DomainError } from '../../../shared/DomainError';

export interface Candidate {
  id: string;
  name: string;
  email: string;
  city: string;
  experienceYears: number;
  skills: string[];
}

export type NewCandidate = Omit<Candidate, 'id'>;

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim() !== '';

export const parseNewCandidate = (input: unknown): NewCandidate => {
  const data = (input ?? {}) as Record<string, unknown>;
  const { name, email, city, experienceYears, skills } = data;

  if (!isNonEmptyString(name) || !isNonEmptyString(email) || !isNonEmptyString(city)) {
    throw new DomainError('El nombre, el correo y la ciudad son obligatorios');
  }

  const normalizedEmail = email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    throw new DomainError('El correo electrónico no es válido');
  }

  if (typeof experienceYears !== 'number' || !Number.isInteger(experienceYears) || experienceYears < 0) {
    throw new DomainError('Los años de experiencia deben ser un entero mayor o igual a 0');
  }

  if (!Array.isArray(skills) || !skills.every(isNonEmptyString)) {
    throw new DomainError('Las habilidades deben ser una lista de textos válidos');
  }

  return {
    name: name.trim(),
    email: normalizedEmail,
    city: city.trim(),
    experienceYears,
    skills: skills.map((skill: string) => skill.trim()),
  };
};
