import { DomainError } from "../../../shared/DomainError";

export interface CompanyLocation {
  city: string;
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  benefits: string[];
  socialLinks: Record<string, string>;
  locations: CompanyLocation[];
}

export type NewCompany = Omit<Company, "id">;

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim() !== "";

const parseBenefits = (value: unknown): string[] => {
  if (value === undefined) return [];
  if (!Array.isArray(value) || !value.every(isNonEmptyString)) {
    throw new DomainError("Los beneficios deben ser una lista de textos");
  }
  return value.map((benefit) => benefit.trim());
};

const parseSocialLinks = (value: unknown): Record<string, string> => {
  if (value === undefined) return {};
  if (
    typeof value !== "object" ||
    value === null ||
    Array.isArray(value) ||
    !Object.values(value).every(isNonEmptyString)
  ) {
    throw new DomainError(
      "Las redes sociales deben ser un objeto con enlaces de texto",
    );
  }
  return Object.fromEntries(
    Object.entries(value).map(([key, link]) => [key, link.trim()]),
  );
};

const parseLocations = (value: unknown): CompanyLocation[] => {
  if (value === undefined) return [];
  if (
    !Array.isArray(value) ||
    !value.every(
      (item) =>
        typeof item === "object" &&
        item !== null &&
        isNonEmptyString((item as { city?: unknown }).city),
    )
  ) {
    throw new DomainError("Cada sede debe tener al menos una ciudad");
  }
  return value.map((location) => ({ city: location.city.trim() }));
};

export const parseNewCompany = (input: unknown): NewCompany => {
  const data = (input ?? {}) as Record<string, unknown>;
  const { name, industry, benefits, socialLinks, locations } = data;

  if (!isNonEmptyString(name) || !isNonEmptyString(industry)) {
    throw new DomainError("El nombre y el sector son obligatorios");
  }

  return {
    name: name.trim(),
    industry: industry.trim(),
    benefits: parseBenefits(benefits),
    socialLinks: parseSocialLinks(socialLinks),
    locations: parseLocations(locations),
  };
};
