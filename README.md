# Educación Pública — Asistencia — Backend

> API de registro de asistencia escolar.

Template oficial de Yura para el dominio **Educación Pública — Asistencia**. API REST en **NestJS +
Prisma + PostgreSQL** con autenticación JWT (email + password). Punto de
partida curado para cursos universitarios LATAM.

**Problema que resuelve:** Las escuelas públicas controlan inasistencia en papel; esta API la digitaliza y permite avisar a apoderados.

## Setup

Requisitos: Node 20+, pnpm 9+, Docker (para Postgres).

```bash
pnpm install
cp .env.example .env
docker compose up -d            # levanta Postgres en :5432
pnpm db:deploy                  # aplica migraciones
pnpm db:seed                    # carga datos de ejemplo
pnpm dev                        # API en http://localhost:3000/api
```

Endpoints principales:

- `POST /api/auth/login` — `{ email, password }` → `{ accessToken, user }`.
- `GET  /api/educacion-asistencia` — lista del caso de uso del dominio.
- `POST /api/educacion-asistencia` — crea un registro.

Usuario seed: `docente@miyura.com` / `yura1234`.

## Architecture

```
src/
├── main.ts                 # bootstrap NestJS (prefijo /api)
├── app.module.ts           # módulo raíz
├── prisma/                 # PrismaService global
├── auth/                   # login JWT (bcrypt + @nestjs/jwt)
└── student/                 # caso de uso end-to-end del dominio
prisma/
├── schema.prisma           # modelos User + Student
├── migrations/             # migración inicial
└── seed.ts                 # 1 usuario + datos de ejemplo
docker-compose.yml          # servicio postgres
```

- **Persistencia:** Prisma sobre PostgreSQL. El esquema vive en
  `prisma/schema.prisma`; las migraciones en `prisma/migrations/`.
- **Auth:** `POST /auth/login` valida con bcrypt y firma un JWT (`@nestjs/jwt`).
- **Dominio:** el módulo `student/` expone el CRUD mínimo del caso de uso.

## Onboarding

Si es tu primer día en este proyecto:

1. Lee este README y levanta el stack local (`docker compose up -d` + migración
   + seed). Verifica que `GET /api/educacion-asistencia` responde con los datos de ejemplo.
2. Explora `src/student/`: ahí está el caso de uso del dominio. Amplíalo con
   validación (`class-validator`), paginación y guards JWT según el curso pida.
3. El frontend que consume esta API es el template `educacion-asistencia-frontend`.
4. Toda contribución entra por Pull Request; Yura evalúa tus PRs
   automáticamente. No hagas push directo a `main`.

¿Dudas de producto? El catálogo de Yura describe el dominio **Educación Pública — Asistencia**.
