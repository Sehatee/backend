# AGENTS.md

## Project Overview

Sehatte is a Healthcare Management API built with NestJS and MongoDB. It handles authentication, user management (admin/doctor/patient roles), medical records, appointments, real-time notifications, reviews, and file uploads.

## Tech Stack

- **Framework**: NestJS 11 (Express platform)
- **Language**: TypeScript (CommonJS, `target: ES2021`)
- **Database**: MongoDB via Mongoose (raw schemas + manual providers — no TypeORM/Prisma)
- **Auth**: JWT (`@nestjs/jwt`), custom guards
- **Files**: Cloudinary (images resized with `sharp` before upload)
- **Real-time**: WebSocket via Socket.IO (`@nestjs/websockets`)
- **Email**: Nodemailer (SMTP) and Resend, rendered with Pug templates
- **Validation**: `class-validator` + `class-transformer` (global `ValidationPipe`)
- **Security**: helmet, CORS allowlist, bcrypt password hashing

## Commands

```bash
npm run start:dev      # dev with hot reload (--watch)
npm run build          # compile to dist/
npm run start:prod     # run compiled dist/main
npm run lint           # eslint --fix on src/test
npm run format         # prettier --write
npm run test           # jest unit tests
npm run test:e2e       # jest e2e (test/jest-e2e.json)
npm run seed:db        # create initial admin user (ts-node)
npm run seed:db:prod   # create initial admin user (from dist)
```

## Architecture & Conventions

- **Global API prefix**: `/api/v1` (set in `src/main.ts`)
- **Modules** live under `src/<module>/` and follow the pattern:
  - `<module>.module.ts` — NestJS module definition
  - `<module>.controller.ts` — HTTP routes
  - `<module>.service.ts` — business logic
  - `dto/` — validation DTOs
  - `interfaces/` — TypeScript/Mongoose interfaces
  - `provider/` — Mongoose model providers
  - `interceptors/` — cross-cutting logic (e.g., attach `doctorId` from JWT)
- **Mongoose schemas** are centralized in `src/database/schemas/`.
- **Model injection**: providers export string-token factories, e.g. `'USERS_MODEL'`, injecting `'DATABASE_CONNECTION'`. Inject with `@Inject('USERS_MODEL') private userModel: Model<User>`.
- **Existing model tokens**: `DATABASE_CONNECTION`, `USERS_MODEL`, `APPOINTMENTS_MODEL`, `MEDICAL_RECORDS_MODEL`, `NOTIFICATION_MODEL`, `REVIEWS_MODEL`.
- **Auth pattern**: `AuthGuard` verifies JWT and sets `request.user = { id, email, role }`; `RolesGuard` + `@Roles('admin' | 'doctor' | 'patient')` enforce role access. Apply `@UseGuards(AuthGuard)` at controller level and `RolesGuard` per-route.
- **Response shape**: some controllers wrap responses with a `ResponseInterceptor` producing `{ status, message, data }`. Match existing behavior per controller.
- **Query helpers**: `src/utils/apiFeaturs.ts` provides filter/sort/fields/paginate chaining (like Mongo-style `gte/lte` operators).
- **Uploads**: multipart fields are `file` (single) or `files` (multiple); validate with `ParseFilePipe` + `MaxFileSizeValidator`/`FileTypeValidator`; store via `UploadFilesService.uploadFile(s)` which returns Cloudinary `secure_url`.
- **Notifications**: `NotificationGateway` joins socket rooms keyed by the user's MongoDB `_id` passed as query param `mongoDbId`. Emit to a doctor via room id.
- **Passwords**: hash with `bcrypt` (cost 10). Always exclude `password`/`confirmPassword` from query results via `.select('-password -confirmPassword')`.
- **Errors**: throw NestJS `HttpException` / `UnauthorizedException` / `BadRequestException` with numeric status codes (e.g. 404, 403, 401).
- **Comments**: existing code contains inline Arabic comments and dev/TODO markers — leave them unless a task explicitly concerns them.
- **Env config**: read from `.env` via `process.env` (not the `ConfigService`); there is no committed `.env.example` — do not commit secrets.
- **Strictness**: `tsconfig.json` has `strictNullChecks: false` and `noImplicitAny: false`; loose typing (`any`) is common. Match existing style.

## Key Files

- `src/main.ts` — bootstrap, CORS allowlist, helmet, global prefix/pipe
- `src/app.module.ts` — root module wiring
- `src/database/providers/database.provider.ts` — Mongoose connection factory
- `src/auth/guards/auth.guard.ts`, `src/auth/guards/Role.guard.ts` — auth/role guards
- `src/users/decorators/Roles.decorator.ts` — `@Roles()` decorator
- `src/scripts/init-admin.ts` — seeds the first admin user
- `docker-compose.yml` — Mongo + mongo-express for local dev

## Environment Variables (used in code)

```
PORT, URI (MongoDB), JWT_SECRET, JWT_EXPIRES_IN,
CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET,
EMAIL_HOST, EMAIL_PORT, EMAIL_USERNAME, EMAIL_PASSWORD, EMAIL_FROM, RESEND_API_KEY
```
