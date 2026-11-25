# Section 3.4 – Statement and Branch Coverage Report

**Date of Run**: 2026-11-25 18:42:25 UTC+5:30  
**Test Runner**: Node.js `node:test` + `c8@12.0.0` (V8-based code coverage)  
**Branch**: `qa/member-2`  
**QA Member**: Member 2 (EC4206 Software Testing & Quality Assurance)

---

## 1. Executive Summary

Code coverage was measured across the backend codebase for all isolated unit tests (including database safeguards, security validation, and our newly engineered white-box test suite for submission compliance).

Coverage was configured to collect:
1. **Statement Coverage (% Stmts)**
2. **Branch Coverage (% Branch)**
3. **Function Coverage (% Funcs)**
4. **Line Coverage (% Lines)**

### Overall Coverage Summary (Unit Test Scope)
- **Statement Coverage**: **49.42%**
- **Branch Coverage**: **95.18%**
- **Function Coverage**: **30.13%**
- **Line Coverage**: **49.42%**

Targeted module `src/services/submissionFiles.js` (containing our white-box function `checkCompliance`):
- **Branch Coverage**: **100.00%**
- **Uncovered lines in `submissionFiles.js`**: Only multipart file I/O and archive extraction routines (`receiveFiles`, `archiveEntries`, `inspectFile`, which are integration-level filesystem operations). The compliance checking logic (`checkCompliance`) and `submissionError` achieved **100% line, statement, and branch coverage**.

---

## 2. Granular Coverage by Component

| Module / File | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line Ranges |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **All files (Unit Scope)** | **49.42%** | **95.18%** | **30.13%** | **49.42%** | — |
| `src/app.js` | 96.55% | 100.00% | 100.00% | 96.55% | 18 |
| `src/controllers/assignments.js` | 52.00% | 97.33% | 52.63% | 52.00% | 139–146, 148–150, 153–174, 177–200 |
| `src/controllers/labSessions.js` | 14.84% | 100.00% | 0.00% | 14.84% | 6–11, 13–49, 51–53, 60–66, etc. |
| `src/controllers/submissions.js` | 14.79% | 100.00% | 0.00% | 14.79% | 7–9, 11–18, 48–85, etc. |
| `src/middleware/auth.js` | 15.87% | 100.00% | 33.33% | 15.87% | 5–10, 13–53, 57–62 |
| `src/middleware/errorHandler.js` | 88.88% | 85.71% | 100.00% | 88.88% | 21–23, 26–29 |
| `src/middleware/rateLimit.js` | 88.57% | 85.71% | 66.66% | 88.57% | 5–8 |
| `src/middleware/security.js` | 100.00% | 100.00% | 100.00% | 100.00% | *(Full Coverage)* |
| `src/models/Assignment.js` | 100.00% | 100.00% | 0.00% | 100.00% | *(Full Coverage)* |
| `src/models/LabSession.js` | 100.00% | 100.00% | 100.00% | 100.00% | *(Full Coverage)* |
| `src/models/Submission.js` | 100.00% | 100.00% | 100.00% | 100.00% | *(Full Coverage)* |
| `src/models/User.js` | 72.58% | 100.00% | 0.00% | 72.58% | 37–43, 47–48, 51–58 |
| `src/routes/assignments.js` | 100.00% | 100.00% | 100.00% | 100.00% | *(Full Coverage)* |
| `src/routes/auth.js` | 29.29% | 100.00% | 0.00% | 29.29% | 17–22, 24–38, 48–71 |
| `src/routes/labSessions.js` | 100.00% | 100.00% | 100.00% | 100.00% | *(Full Coverage)* |
| `src/routes/submissions.js` | 100.00% | 100.00% | 100.00% | 100.00% | *(Full Coverage)* |
| **`src/services/submissionFiles.js`** | **37.50%** | **100.00%** | **33.33%** | **37.50%** | 16–18, 21–34, 36–58, 61–75 |
| `src/utils/objectId.js` | 100.00% | 100.00% | 100.00% | 100.00% | *(Full Coverage)* |
| `testing/context.js` | 46.42% | 100.00% | 25.00% | 46.42% | 21–30, 61–62, 65–112 |

---

## 3. Evidence Artifacts Generated

All genuine coverage reports have been generated and archived under `qa/member2/evidence/coverage/`:

1. **Terminal Summary Report**:
   - Path: [coverage-summary.txt](file:///C:/Users/Paviththiran/Desktop/AutoGrader-QA/qa/member2/evidence/coverage/coverage-summary.txt)
2. **Interactive HTML Report**:
   - Path: [index.html](file:///C:/Users/Paviththiran/Desktop/AutoGrader-QA/qa/member2/evidence/coverage/index.html)
   - Contains line-by-line green/red branch and statement highlighting.
3. **LCOV Format Report**:
   - Path: [lcov.info](file:///C:/Users/Paviththiran/Desktop/AutoGrader-QA/qa/member2/evidence/coverage/lcov.info)
   - Compatible with SonarQube, Codecov, Coveralls, and IDE coverage gutters.

---

## 4. Instructions for Member 3 (Integration & Quality Metrics)

To import this coverage into SonarQube or CI/CD pipelines:
- **LCOV File Path**: `qa/member2/evidence/coverage/lcov.info`
- **SonarQube Property Key**:
  ```properties
  sonar.javascript.lcov.reportPaths=qa/member2/evidence/coverage/lcov.info
  ```
- **Command to Reproduce Coverage Report**:
  ```bash
  cd backend
  npx c8 --reports-dir="../qa/member2/evidence/coverage" --reporter=text --reporter=html --reporter=lcov node --test test/security.test.js test/database-safety.test.js test/compliance-whitebox.test.js
  ```
