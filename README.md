# Blog Workspace

This repository contains a React + Spring Boot personal blog system with a public site, a single-admin backend, automated tests, and containerized deployment files.

## Structure

- `frontend/`: React public site and admin pages
- `blog-server/`: Spring Boot backend API
- `sql/`: MySQL schema and seed scripts
- `docker/`: Docker Compose and Nginx deployment files
- `docs/`: design, plan, test, and review documents

## Local Development

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Backend:

```bash
cd blog-server
mvn spring-boot:run
```

The backend uses `SPRING_DATASOURCE_*` environment variables if provided. Without overrides, it falls back to a local MySQL `blog` database configuration from `application.yml`.

## Test Commands

Backend:

```bash
mvn -f blog-server/pom.xml test
```

Frontend:

```bash
cd frontend
npm test
npm run lint
npm run build
npm run test:coverage
```

## Docker Deployment

Validate the Compose file:

```bash
docker compose -f docker/docker-compose.yml config
```

Start the full stack:

```bash
docker compose -f docker/docker-compose.yml up --build
```
