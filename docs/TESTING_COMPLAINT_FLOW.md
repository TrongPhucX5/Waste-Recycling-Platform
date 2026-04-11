# Testing: Complaint Flow (Citizen → Enterprise → Collection Task)

This document describes manual QA steps and example requests to validate the complaint flow and notifications.

## Run the system

- Docker (recommended, MySQL host port adjusted to 3307):

```bash
# from repo root
docker compose up --build
```

- Or run locally (no Docker):

```bash
# Backend
cd backend/src/WastePlatform.API
dotnet run

# Frontend
cd frontend
npm install
npm run dev
```

## Quick accounts (seeded in db/migrations/V6__sample_data.sql)

- Admin: admin@gmail.com / password
- Citizen: nguyenvana@gmail.com / password
- Enterprises: greenlife@gmail.com, ecofriendly@gmail.com, urbanwaste@gmail.com / password
- Collectors: collector1@gmail.com, collector2@gmail.com, collector3@gmail.com / password

## Endpoints (examples)

- Create complaint (Citizen):

```bash
curl -X POST "http://localhost:8080/api/complaints" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"reportId":"<report-id>","content":"Giải thích vấn đề..."}'
```

- Enterprise: get complaints

```bash
curl -X GET "http://localhost:8080/api/enterprise/complaints" -H "Authorization: Bearer <enterprise-token>"
```

- Enterprise: resolve complaint (creates collection task if report pending)

```bash
curl -X POST "http://localhost:8080/api/enterprise/complaints/<complaint-id>/resolve" \
  -H "Authorization: Bearer <enterprise-token>" \
  -H "Content-Type: application/json" \
  -d '{"adminResponse":"Đồng ý, sẽ thu gom"}'
```

- Enterprise: reject complaint

```bash
curl -X POST "http://localhost:8080/api/enterprise/complaints/<complaint-id>/reject" \
  -H "Authorization: Bearer <enterprise-token>" \
  -H "Content-Type: application/json" \
  -d '{"adminResponse":"Không phù hợp"}'
```

## Real-time notifications

- SignalR hub: `http://<api-host>/hubs/task`
- When a complaint is created, server attempts to notify:
  - `Admins` group (all admins)
  - Matching enterprises via `Enterprise-<enterpriseId>` groups (based on report waste category)
  - Fallback to `Enterprises` group if no matches

## QA scenario

1. Login as Citizen; create a report (or use seeded report IDs).
2. Submit a complaint against a report via the UI or the `POST /api/complaints` endpoint.
3. Confirm API returns 201 and complaint appears in DB (`complaints` table).
4. Login as the Enterprise that handles that waste category (or any enterprise). Open Enterprise → Complaints UI.
5. Confirm real-time notification appears (list reloads) or refresh list manually.
6. Click Resolve on an Open complaint. If report status was `Pending`, a `collection_tasks` row should be created and the report status updated.
7. Login as Admin and confirm the complaint appears in admin views.

## Notes and troubleshooting

- If Docker fails because host port 3306 is in use, `docker-compose.yml` has been adjusted to map host 3307 → container 3306. Use `mysql` client on port `3307` when connecting from host.
- SignalR uses JWT token for group assignment on connect; ensure client sets `Authorization: Bearer <token>` or uses the hub `accessTokenFactory` to provide token.
- To target enterprises by service area later, server logic can be enhanced to match `enterprise.ServiceArea` against report address or geolocation.

---

File created by automation to help QA the complaint flow.
