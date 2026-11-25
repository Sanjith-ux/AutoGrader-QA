# 3.7 — Security Testing (OWASP-Aligned)

**Scope:** Member 4's authorized, locally hosted LabTrack QA backend only. Use disposable synthetic data and at least one **student** and one **lecturer** test account. **Status: NOT RUN.** Source inspection identified the candidate routes below; runtime behavior is unverified.

## Pre-test evidence

Fill with facts from the actual source: backend commit, Node version, local port, MongoDB test DB name, route/method authorization middleware, exact HTTP response contract, and synthetic role names. Do not copy auth tokens or passwords into this report. A frontend-hidden button is **not** proof of backend access control.

## ST-01 — Broken Access Control (vertical privilege escalation)

**OWASP focus:** WSTG-ATHZ-02; authorization must be checked by backend for protected actions.

| Field | Actual value |
|---|---|
| Source-inspected lecturer-only API endpoint | `POST /api/assignments` (also `PATCH`/`DELETE /api/assignments/:id`) |
| Safe student challenge body | `{}` with `Content-Type: application/json`; source order applies `requireRole('lecturer')` before the create controller, so a student should receive `403` before validation or mutation (confirm at runtime) |
| Lecturer authorization baseline | NOT RUN |
| Student authorization challenge | NOT RUN |
| Expected behavior | Lecturer authorized; student denied without creating/updating/deleting a resource |
| Actual student HTTP code / safe response fields | NOT RUN |
| State-change verification | NOT RUN |
| Evidence screenshot | NOT CAPTURED |
| Verdict | NOT TESTED |

**How to execute in Postman**

1. Point your environment at `http://127.0.0.1:<verified-port>` and confirm MongoDB is a disposable QA database. The project documentation aligns frontend and backend on port `5002` when `PORT=5002` is set.
2. Log in using a synthetic **lecturer** and **student** account; store access tokens in local temporary Postman variables, not exported/shared environment values.
3. Establish the legitimate baseline using the lecturer token and a valid, clearly synthetic assignment payload; record it and clean up the synthetic record if created.
4. For the student challenge, send `POST /api/assignments` with `Authorization: Bearer <student token>`, `Content-Type: application/json` and `{}`. The source places `requireRole('lecturer')` before the create controller, so this probes the authorization gate without requiring a valid creation payload.
5. Check both the response status and **persistent data state**. A blocked operation usually returns 403, sometimes 401 or 404 depending the application's documented contract; a successful 2xx or a state change for a student is suspicious.
6. Capture sanitized request URL/method, response status/body, test-account role and affected data. If denied correctly, mark PASS; if unauthorized state change occurs, mark FAIL and create a GitHub Issue after reproducing.

## ST-02 — Missing and Invalid Authentication

**OWASP focus:** WSTG-ATHN-04; protected routes must not accept absent/malformed credentials.

| Variant | Action | Expected | Observed | Verdict |
|---|---|---|---|---|
| A: Missing bearer token | GET real **protected** endpoint with no `Authorization` header | Unauthorized; no protected data | NOT RUN | NOT TESTED |
| B: Invalid bearer token | Same GET with `Authorization: Bearer invalid-synthetic-token` | Unauthorized; no protected data | NOT RUN | NOT TESTED |
| C: Valid student token (control) | Same GET using valid synthetic student's token | Authorized per role policy | NOT RUN | NOT TESTED |

**How to execute in Postman**

1. Use `GET /api/auth/me` as the source-inspected protected GET path; first verify it succeeds with an appropriate valid synthetic token.
2. Remove the Authorization header completely and resend.
3. Send a known invalid **synthetic** token and resend.
4. Record exact response status/body and compare to the documented contract; commonly 401 for missing/invalid token. Ensure neither case exposes protected profile/assignment data.
5. Do not infer success merely because an error message is displayed in the frontend; inspect backend response and data.
6. Capture screenshots with tokens and any identifiers masked.

## Optional ST-03 — Horizontal Authorization

If an assignment has a lecturer-owner ID, prepare lecturer A and lecturer B and test whether B can modify A's assignment. Only attempt with team approval, on local synthetic records, and verify actual backend ownership rules. **NOT RUN.**

## Evidence / conclusions

- Test execution timestamp: **NOT RECORDED**
- Endpoint references and git commit: **NOT RECORDED**
- `evidence/ST-01-*.png`: **NOT CAPTURED**
- `evidence/ST-02-*.png`: **NOT CAPTURED**
- Confirmed security defects: **NONE VERIFIED (not equivalent to no defects)**
- Recommendations: **PENDING ACTUAL OBSERVATIONS**

### Security assessment notes

401 indicates missing/invalid authentication in many APIs; 403 indicates authenticated but not allowed. A 404 may intentionally obscure a protected resource. Record what *this* application specifies; never arbitrarily change assertions to pass. Respect authorization and never load-test a public system without permission.

References:
- OWASP WSTG authorization bypass: https://wstg.owasp.org/latest/09-Authorization/02-Bypassing_Authorization_Schema/
- OWASP WSTG authentication bypass: https://wstg.owasp.org/latest/08-Authentication/04-Bypassing_Authentication_Schema/
