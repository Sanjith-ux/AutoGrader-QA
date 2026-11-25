# QA-M4-001 — Default frontend API port does not match backend fallback

**Issue status:** Draft — source-inspection evidence is attached; reproduce on an isolated local runtime before creating the GitHub Issue.

## Description

With no explicit port configuration, the backend listens on port `5001`, but the frontend constructs API requests to `http://localhost:5002/api`. A first-time local setup that follows the backend default therefore cannot connect the frontend to the API. The project documentation recommends explicitly setting `PORT=5002`, which avoids the problem, but that does not make the two code defaults consistent.

## Classification

| Field | Value |
|---|---|
| Severity | Major — prevents normal frontend/API integration for a default local setup |
| Priority | P1 — triage with the team; configuration documentation may make P2 appropriate if setup always supplies `PORT=5002` |
| Environment | Local isolated QA environment; commit: record before filing |
| Assigned member | Unassigned — select the approved developer |
| Current status | Draft / needs runtime reproduction |

## Source evidence

- `backend/src/server.js`: `const port = Number(process.env.PORT) || 5001`
- `FrontEnd/src/api/config.js`: frontend fallback is `http://localhost:5002/api`
- `PROJECT_DOCUMENTATION.md`: instructs local setup to set `PORT=5002` so it aligns with the frontend.

## Reproduction steps (execute before filing)

1. Use an isolated local QA MongoDB database and a private test `JWT_SECRET`.
2. Start the backend with `PORT` unset; verify its startup output reports port `5001`.
3. Start the frontend with `VITE_API_BASE_URL` unset.
4. In the browser, attempt a harmless action that calls the API, such as the login request, and inspect the Network panel.
5. Observe whether the request targets `http://localhost:5002/api/...` and fails while the API is listening on `5001`.
6. Repeat after explicitly setting either both services to `5002` or the frontend URL to port `5001`, and record the outcome.

## Expected result

The frontend default API URL and backend default listening port are compatible, or setup configuration consistently supplies both values so that an ordinary local run connects without manual conflict resolution.

## Actual result

**Not yet runtime-observed by Member 4.** The inconsistent source defaults are confirmed above. Replace this field with the exact browser/network error and timestamp before filing.

## Evidence required

- Sanitized backend startup output.
- Browser Network screenshot showing request URL and failure, with identifiers masked.
- Git commit SHA and OS/browser version.
- Successful control evidence after the configuration is aligned.

## Root-cause hypothesis and recommended fix

The defaults drifted: `backend/src/server.js` and `FrontEnd/src/api/config.js` use different fallback ports. Choose one canonical local port, apply it consistently in the frontend/backend defaults and README files, then add a smoke test or setup check that detects a mismatch. This is a hypothesis until the owner confirms the intended configuration policy.

## GitHub issue body

Copy this file after replacing all “not yet” fields with genuine runtime evidence. Attach the evidence files rather than tokens, passwords, full `.env` files, or personal data.
