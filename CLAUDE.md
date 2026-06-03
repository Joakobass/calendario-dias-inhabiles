# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Proyecto

API REST para gestionar días inhábiles del Juzgado Nacional del Trabajo (Argentina).

**Stack:** Node.js 20 + TypeScript 5 (strict) + Express 4 + Winston
**Package manager:** pnpm

## Comandos

```bash
pnpm dev          # Desarrollo con hot-reload (ts-node-dev)
pnpm build        # Compila a dist/
pnpm start        # Build + ejecuta dist/app.js
pnpm test         # Tests con Mocha + Chai + Supertest
```

## Arquitectura

Flujo de una request:

```
Request → Router → Controller → Service → DAO → (archivo local / futura DB)
```

### Capa DAO (desacoplada del storage)

- `src/dao/interfaces/IFeriadosDAO.ts` — contrato de persistencia
- `src/dao/local/FeriadosLocalDAO.ts` — implementación con archivos JSON en `data/`
- Futuro: `src/dao/mongo/FeriadosMongoDAO.ts` sin cambiar el service

### Fuente de datos externa

API pública: `https://api.argentinadatos.com/v1/feriados/{anio}`
El service cachea la respuesta localmente en `data/feriados-{anio}.json`.

## Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/feriados` | Lista todos los años sincronizados |
| GET | `/api/feriados/:anio` | Devuelve feriados (cache local o sincroniza) |
| POST | `/api/feriados/:anio/sync` | Fuerza resincronización desde API |
| DELETE | `/api/feriados/:anio` | Elimina datos locales del año |
| GET | `/health` | Health check |

## Variables de entorno

Copiar `.env.example` a `.env`:

```
PORT=8080
DATA_DIR=data
```
