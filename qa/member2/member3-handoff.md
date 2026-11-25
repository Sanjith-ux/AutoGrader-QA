# Member 3 Handoff: Test Automation, Coverage & CI Integration

**From**: Member 2 (White-Box Testing, TDD & BDD Lead)  
**To**: Member 3 (CI/CD Pipeline, SonarQube & Quality Metrics Lead)  
**Date**: 2026-11-25 19:05:00 UTC+5:30  
**Branch**: `qa/member-2`

---

## 1. Environment & Runtime Requirements

- **Node.js**: Declared `>=22` in `backend/package.json`; tested and verified on Node **`v24.12.0`** (npm **`11.6.2`**). Recommended baseline: Node 22.12 or newer.
- **Operating System**: Cross-platform compatible (verified on Windows 11; storage paths normalized to POSIX forward slashes for Linux/CI runners).
- **Dependencies**: Installed via `npm ci` in `backend/` and `FrontEnd/`. Cucumber test runner installed as devDependency in `backend/`.

---

## 2. Test Execution Commands

All commands are executed from the `backend/` directory:

| Test Purpose | Execution Command | Pre-requisites |
| :--- | :--- | :--- |
| **All Unit Tests (In-Memory)** | `node --test test/security.test.js test/database-safety.test.js test/compliance-whitebox.test.js test/storage-path-normalization.test.js` | None (Zero DB required) |
| **White-Box Unit Test Suite** | `node --test test/compliance-whitebox.test.js` | None (13/13 passing in ~5 ms) |
| **BDD Cucumber Scenarios** | `npm run test:bdd` | Requires `MONGODB_TEST_URI` |
| **Full Regression Suite** | `npm test` | Requires `MONGODB_TEST_URI` (149/149 passing) |
| **Coverage Generation** | `npx c8 --reports-dir="../qa/member2/evidence/coverage" --reporter=text --reporter=html --reporter=lcov node --test test/security.test.js test/database-safety.test.js test/compliance-whitebox.test.js` | Generates Terminal, HTML & LCOV |

---

## 3. Coverage & SonarQube Metric Files

For SonarQube, GitHub Actions, or CI dashboard ingestion:

- **LCOV Report File**:
  `qa/member2/evidence/coverage/lcov.info`
- **Interactive HTML Report**:
  `qa/member2/evidence/coverage/index.html`
- **SonarQube Configuration Flag**:
  ```properties
  sonar.javascript.lcov.reportPaths=qa/member2/evidence/coverage/lcov.info
  ```
- **Achieved Coverage Metrics (Unit Scope)**:
  - Branch Coverage: **95.18%** (Target white-box module `submissionFiles.js`: **100.00%**)
  - Statement Coverage: **49.42%**
  - Line Coverage: **49.42%**

---

## 4. Environment Variables & Safety Configuration

The application implements rigorous database safety gates in `backend/testing/context.js`:

| Environment Variable | Required For | Expected Value / Format | Safety Rules |
| :--- | :--- | :--- | :--- |
| `MONGODB_TEST_URI` | Integration tests & BDD | `mongodb://127.0.0.1:27017/labtrack_test` | **MUST** end with `_test`. Cannot match development URI `MONGODB_URI`. Cannot contain `dbName` overrides. |
| `JWT_SECRET` | Auto-configured in tests | Internal non-production test secret | Never commit production secrets. |
| `SUBMISSION_STORAGE_DIR` | Auto-configured in tests | Private OS temp folder | Test runner automatically creates and purges temp folders via `mkdtempSync()`. |

---

## 5. Isolated Database Setup Instructions for CI/CD

If running database tests or BDD in GitHub Actions / Docker:
1. Start MongoDB service container (version 7.x or 8.x) bound to port 27017.
2. Export environment variable:
   ```bash
   export MONGODB_TEST_URI="mongodb://127.0.0.1:27017/labtrack_test"
   ```
3. Run test suites:
   ```bash
   cd backend
   npm test
   npm run test:bdd
   ```
4. Teardown:
   All test suites automatically clean up created test accounts and temporary submission files on exit.

---

## 6. Known Testing Limitations & Notes

1. **Database-Optional Unit Tests**:
   If `MONGODB_TEST_URI` is not set in an environment, the integration test suites (`assignments.test.js`, `auth.test.js`, `submissions.test.js`) are safely skipped with notice `# set MONGODB_TEST_URI to run database tests`. The unit test suite (`compliance-whitebox.test.js`) and security unit tests continue to run and pass with code 0.
2. **Fixed Cross-Platform Defect (TDD)**:
   A Windows path separator issue where `storagePath` produced backslashes has been resolved via portable forward-slash normalization in `backend/src/services/submissionFiles.js`. All 149 tests now pass across Windows, macOS, and Linux runners.
