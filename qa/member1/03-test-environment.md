# 3.2 Test Environment — Member 1

Verified on 25 November 2026 (Asia/Colombo) for the EC4206 Software Testing and Quality Assurance group assignment. This records environment setup and connectivity checks only; test-case design and execution have not begun.

## Platform and application

| Item | Verified configuration |
| --- | --- |
| Project | LabTrack — AutoGrader and Lab Submission Portal |
| Branch / starting commit | `qa/member-1` / `8660e35` |
| Operating system | macOS 27.0, arm64 |
| Node.js / npm | `v26.9.0` / `11.19.1` |
| MongoDB | `8.3.11`, separate local process |
| Frontend | React 19.3.0, Vite 8.3.0; http://127.0.0.1:5173 |
| Backend | Express 5.3.0, Mongoose 8.24.5; http://127.0.0.1:5002/api |
| Health endpoint | http://127.0.0.1:5002/api/health |
| Dependencies | Existing frontend/backend installations passed `npm ls --depth=0`; nothing installed |

## Isolation and configuration

- QA MongoDB URI: `mongodb://127.0.0.1:27028/labtrack_qa_member1`.
- MongoDB binds only to `127.0.0.1`; persistent data lives in `qa/member1/runtime/mongodb/` and logs in `qa/member1/runtime/logs/mongodb.log`.
- Submission upload root is the absolute path to `qa/member1/runtime/submissions/`. The existing development upload directory is not used by this QA backend.
- `/qa/member1/runtime/` is excluded through the local `.git/info/exclude`; the shared `.gitignore` is unchanged.
- Existing development configuration points to `labtrack_portal` on port `27017`. It was not started, altered, reset, or queried for data. Both existing environment files remain unchanged; SHA-256 comparisons before/after setup confirmed this.
- The existing JWT secret is loaded from `backend/.env`; no secret is copied into this report. No separate QA secret was configured.
- Only synthetic input was used. No user, assignment, lab-session, or submission records were created.

The actual implementation supports the command-scoped overrides:

| Override | Implementation and verification |
| --- | --- |
| `MONGODB_URI` | `backend/src/config/db.js` passes it to `mongoose.connect`; dotenv preserves an already-set environment value |
| `PORT=5002` | `backend/src/server.js` uses `Number(process.env.PORT)` |
| `SUBMISSION_STORAGE_DIR` | `backend/src/services/submissionFiles.js` resolves it with `path.resolve`; importing the module with the QA override confirmed the intended absolute upload root |
| `CORS_ORIGIN` | `backend/src/middleware/security.js` splits the comma-separated origins; `backend/src/app.js` supplies them to CORS middleware |
| `VITE_API_BASE_URL` | `FrontEnd/src/api/config.js` reads `import.meta.env.VITE_API_BASE_URL`; the served Vite module contained the QA API URL |

## Verification results

| Check | Actual result |
| --- | --- |
| MongoDB availability | `ping` returned `{ "ok": 1 }` on port `27028` |
| MongoDB isolation | `getCmdLineOpts` confirmed port `27028`, loopback binding, and the Member 1 runtime data path |
| Backend connection | Startup reported `MongoDB connected`; backend process TCP connections targeted only `127.0.0.1:27028` |
| Database name | `labtrack_qa_member1`; MongoDB logged creation of its application collections |
| Initial records | `users`, `assignments`, `labsessions`, and `submissions` each contained zero documents |
| API health | HTTP `200`, body `{ "status": "ok" }` |
| CORS | Health requests from `http://127.0.0.1:5173` and `http://localhost:5173` returned the matching `Access-Control-Allow-Origin` |
| CORS preflight | Login OPTIONS requests from both origins returned `204`, allowed POST, and allowed `content-type` |
| Frontend | HTTP `200`; login page rendered in Brave at `http://127.0.0.1:5173/` |
| Browser → API | Synthetic login using `qa.member1.smoke@example.invalid` displayed the backend message `Invalid email or password.`; no record was created |
| Git protection | `git check-ignore -v qa/member1/runtime/mongodb` matched `.git/info/exclude` |

## Restart commands

Use three terminals. Run the repository-root command in **each** terminal first; the trailing space in the directory name is intentional:

```bash
cd '/Users/sanjithab/Desktop/AutoGrader & lab Submissiton Portal '
```

Before restarting, stop any already-running QA services; do not launch duplicate instances. These commands reuse the QA data and do not clear it.

Terminal 1 — MongoDB (leave running):

```bash
mkdir -p qa/member1/runtime/mongodb qa/member1/runtime/submissions qa/member1/runtime/logs
mongod --dbpath "$PWD/qa/member1/runtime/mongodb" \
  --bind_ip 127.0.0.1 --port 27028 \
  --logpath "$PWD/qa/member1/runtime/logs/mongodb.log" --logappend
```

Terminal 2 — backend (after MongoDB is ready):

```bash
cd backend
MONGODB_URI=mongodb://127.0.0.1:27028/labtrack_qa_member1 \
SUBMISSION_STORAGE_DIR="$PWD/../qa/member1/runtime/submissions" \
PORT=5002 \
CORS_ORIGIN=http://127.0.0.1:5173,http://localhost:5173 \
npm run dev
```

Terminal 3 — frontend:

```bash
cd FrontEnd
VITE_API_BASE_URL=http://127.0.0.1:5002/api \
npm run dev -- --host 127.0.0.1 --port 5173 --strictPort
```

Open http://127.0.0.1:5173. Health check:

```bash
curl --fail http://127.0.0.1:5002/api/health
```

For normal terminal sessions, stop the frontend and backend with Ctrl-C, then stop MongoDB with Ctrl-C. Preserve the runtime directories. The current setup was started in managed terminal sessions; it is not a login service and will not automatically restart after a reboot. This macOS MongoDB build rejects `--fork`, so restart it in the foreground as shown.

## Limits and remaining blockers

No blocker remains for using this QA environment. The backend's existing `app.listen(port)` binds all interfaces (`*:5002`); MongoDB and Vite bind loopback. CORS restricts browser origins but does not act as a network firewall. Source code was left unchanged as requested.

Upload isolation was verified through configuration and module resolution; an actual submission upload was not performed. No accounts were seeded. The existing automated backend integration suite requires `MONGODB_TEST_URI` with a database name ending in `_test`; use a separate database such as `labtrack_qa_member1_test` if that suite is authorized later. Do not point it at the interactive QA database.

The only reviewable project file added by setup is this report. Local-only changes are `.git/info/exclude` and ignored runtime data/logs. Vite may refresh its existing ignored dependency cache during startup. No application source, dependencies, shared configuration, other members' files, commits, or pushes were changed.
