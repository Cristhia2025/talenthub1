# Registro de candidatos

Proyecto TalentHub. El módulo `candidates` permite registrar, consultar, actualizar y eliminar candidatos.

## Datos

```json
{
  "name": "Ana Torres",
  "email": "ana@correo.com",
  "city": "Quito",
  "experienceYears": 2,
  "skills": ["TypeScript", "SQL"]
}
```

El correo se normaliza a minúsculas y debe ser único. `experienceYears` debe ser un entero no negativo; `skills` debe ser una lista de textos.

## Endpoints

- `GET /candidates`: listar candidatos.
- `GET /candidates/:id`: consultar un candidato.
- `POST /candidates`: registrar un candidato.
- `PUT /candidates/:id`: actualizar un candidato.
- `DELETE /candidates/:id`: eliminar un candidato.

La persistencia se configura con `CANDIDATES_ADAPTER=prisma`; si no se selecciona Prisma o falta `DATABASE_URL`, la API usa memoria.
