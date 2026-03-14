# Backend — WastePlatform API

C# .NET 9 Clean Architecture backend for the Waste Recycling Platform.

## Structure

```
backend/
├── src/
│   ├── WastePlatform.Domain/         # Entities, Enums, Value Objects, Domain Events
│   ├── WastePlatform.Application/    # Use Cases (Commands & Queries via MediatR)
│   ├── WastePlatform.Infrastructure/ # EF Core, Repositories, JWT & external services
│   └── WastePlatform.API/            # Controllers, Middleware, DTOs, Swagger
└── Dockerfile
```

## Prerequisites

- [.NET 9 SDK](https://dotnet.microsoft.com/download/dotnet/9.0)
- MySQL 8.0 (or start via Docker Compose from the repo root)

## Running Locally

```bash
# From repo root — start the database first
docker compose up -d db

# Then run the API
cd backend
dotnet run --project src/WastePlatform.API
```

API available at **http://localhost:8080**
Swagger UI available at **http://localhost:8080/swagger**

## Configuration

The API reads settings from environment variables or `appsettings.json`:

| Key | Description |
|---|---|
| `ConnectionStrings__DefaultConnection` | MySQL connection string |
| `JwtSettings__SecretKey` | JWT signing secret (min 32 chars) |
| `JwtSettings__Issuer` | JWT issuer |
| `JwtSettings__Audience` | JWT audience |

Copy the repo root `.env.example` to `.env` and fill in the values. When running with Docker Compose, these are passed in automatically.

## Building for Production

```bash
dotnet publish src/WastePlatform.API -c Release -o ./publish
```

Or use the multi-stage Dockerfile:

```bash
docker build -t waste-backend .
```
