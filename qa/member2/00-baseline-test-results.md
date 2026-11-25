# Baseline Test Results

**Date & Time**: 2026-11-25 18:35:00 UTC+5:30  
**Repository Branch**: `qa/member-2`  
**Working Workspace**: `C:\Users\Paviththiran\Desktop\AutoGrader-QA`  
**QA Member**: Member 2 (EC4206 Software Testing and QA)

---

## 1. Executive Summary

A comprehensive baseline test run was executed on the existing repository codebase before applying any new unit tests, refactoring, or BDD implementations. Testing was executed using the project's native test runner (`node:test`) under Node.js `v24.12.0` and npm `11.6.2`.

| Test Suite | Total Tests | Passed | Failed | Skipped | Duration (ms) | Exit Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Backend (Without Live DB)** | 53 | 53 | 0 | 3 suites skipped | ~1,376 ms | Code 0 (Success) |
| **Backend (With Isolated Test DB)** | 135 | 134 | 1 | 0 | ~7,113 ms | Code 1 (Failure) |
| **FrontEnd Portal Tests** | 16 | 16 | 0 | 0 | ~189 ms | Code 0 (Success) |
| **Total Test Assertions** | **151** | **150** | **1** | **0** | **~7,302 ms** | — |

---

## 2. Test Environment & Database Safety Verification

1. **Node.js & npm Versions**:
   - Node: `v24.12.0` (exceeds engine requirement `node: >=22`)
   - npm: `11.6.2`
2. **Database Isolation**:
   - `backend/testing/context.js` enforces `assertSafeTestDatabase()`.
   - The test database URI was strictly configured to: `mongodb://127.0.0.1:27017/labtrack_test`.
   - It strictly ends with `_test`, which prevents any conflict with the development database (`labtrack`) or any production database.
   - Temporary submission file storage uses OS temp folder via `mkdtempSync()`.
   - JWT secret is an isolated non-production secret.

---

## 3. Detailed Results by Suite

### 3.1 Backend Test Run (Without Live Database)
- **Command**: `npm test` inside `backend/` (with `MONGODB_TEST_URI` unset)
- **Terminal Evidence**: [backend-baseline-no-db.txt](file:///C:/Users/Paviththiran/Desktop/AutoGrader-QA/qa/member2/evidence/test-results/backend-baseline-no-db.txt)
- **Suites Executed**:
  - `test database safeguards (no database connection)`: 5 passed
  - `assignment payload validation`: 33 passed
  - `object id validation`: 1 passed
  - `rate limiter`: 4 passed
  - `error handler`: 6 passed
  - `security headers and CORS`: 2 passed
  - `assignment API (isolated test database)`: Skipped (condition: `!testMongoUri`)
  - `authentication API (isolated test database)`: Skipped (condition: `!testMongoUri`)
  - `persistent submissions API (isolated test database)`: Skipped (condition: `!testMongoUri`)
- **Outcome**: 53 passed, 0 failed, 3 suites skipped.

### 3.2 Backend Test Run (With Isolated Test Database)
- **Command**: `$env:MONGODB_TEST_URI="mongodb://127.0.0.1:27017/labtrack_test"; npm test` inside `backend/`
- **Terminal Evidence**: [backend-baseline-isolated-db.txt](file:///C:/Users/Paviththiran/Desktop/AutoGrader-QA/qa/member2/evidence/test-results/backend-baseline-isolated-db.txt)
- **Suites Executed**: 19 suites (135 tests total)
- **Passed**: 134 tests
- **Failed**: 1 test
- **Failing Test Details**:
  - **Test Name**: `stores a genuine PDF, metadata, requirements and pass results in MongoDB with private generated paths`
  - **File**: `backend/test/submissions.test.js:280:3`
  - **Error**: `AssertionError [ERR_ASSERTION]: The input did not match the regular expression /^[a-f0-9-]+\/[a-f0-9-]+$/`
  - **Actual Value**: `'4a22f715-1eca-47ae-96ca-7aa1141368d2\\97351cc4-e6c7-45f8-8056-6cb688e2cac2'`
  - **Root Cause Analysis**: On Windows platforms, `path.relative(uploadRoot, file.path)` in `backend/src/services/submissionFiles.js` generates Windows path separators (`\`). The test regex expects POSIX-style forward slashes (`/`). This represents a real cross-platform storage path normalization defect suitable for our TDD demonstration phase.

### 3.3 FrontEnd Test Run
- **Command**: `npm test` inside `FrontEnd/`
- **Terminal Evidence**: [frontend-baseline.txt](file:///C:/Users/Paviththiran/Desktop/AutoGrader-QA/qa/member2/evidence/test-results/frontend-baseline.txt)
- **Suites Executed**:
  - `studentMarks.test.js`: 9 passed
  - `studentWithdrawal.test.js`: 7 passed
- **Outcome**: 16 passed, 0 failed.

---

## 4. Coverage Information (Baseline)

No test coverage framework or reporting configuration was pre-configured in the repository. As measured with Node.js built-in coverage:
- Coverage instrumentation is required to calculate exact line, statement, function, and branch percentages.
- Dedicated coverage configuration (via Node `--experimental-test-coverage` or `c8`) will be implemented in Phase 5 to output Terminal, HTML, and LCOV reports.
