# Section 3.4 – Unit Testing Report

**Test Suite File**: `backend/test/compliance-whitebox.test.js`  
**Test Framework**: Native Node.js `node:test` + `node:assert/strict`  
**Tested Module**: `backend/src/services/submissionFiles.js`  
**QA Member**: Member 2 (EC4206 Software Testing & Quality Assurance)  
**Branch**: `qa/member-2`

---

## 1. Unit Testing Strategy & Isolation

In contrast to integration tests that boot an Express HTTP server, write temporary files to disk, and query MongoDB, **unit tests must remain purely isolated, deterministic, and fast**.

The `compliance-whitebox.test.js` test suite validates `checkCompliance()` and `submissionError()` with zero database connection, zero disk I/O, and zero network calls. All data structures (`assignment`, `files`, `submittedAt`) are supplied in-memory, ensuring:
- Instant execution (~5 ms).
- No environmental dependencies or flakiness.
- Comprehensive verification of logical edge cases and boundary conditions.

---

## 2. Test Cases Breakdown

### 2.1 Basis Path White-Box Tests (Cyclomatic Complexity $V(G) = 6$)
- **TC-WB-01 (Path 1 - All Checks Pass)**: Nominal submission before deadline with valid file formats, within size limits, and containing all required attachment labels.
- **TC-WB-02 (Path 2 - Late Submission)**: Submitted 1 second after deadline. Validates that `checks.deadline.passed` is `false` and message specifies `'Submitted after the deadline; marked late.'`.
- **TC-WB-03 (Path 3 - Disallowed File Type)**: Uploads `PNG` file when only `PDF` and `ZIP` are accepted. Validates `checks.fileType.passed` is `false`.
- **TC-WB-04 (Path 4 - Oversized File)**: Uploads a 6 MB file when limit is 5 MB. Validates `checks.fileSize.passed` is `false`.
- **TC-WB-05 (Path 5 - Missing Required Attachment)**: Uploads report but omits mandatory `'Source Code'`. Validates `checks.requiredFiles.passed` is `false` and message names `'Source Code'`.
- **TC-WB-06 (Path 6 - Compound Failure)**: Uploads `EXE` past deadline exceeding size limit with arbitrary attachment label. Confirms all sub-checks fail simultaneously.

### 2.2 Boundary Value Analysis (BVA)
- **BVA-01 (Deadline Exact Boundary)**: `submittedAt.getTime() === deadline.getTime()`. Boundary condition `submittedAt <= assignment.deadline` evaluates to `true`.
- **BVA-02 (Deadline Upper Boundary + 1ms)**: `submittedAt.getTime() === deadline.getTime() + 1`. Fails on-time check (`passed = false`).
- **BVA-03 (File Size Exact Limit Boundary)**: File size equals `5 * 1024 * 1024` (5,242,880 bytes). Condition `file.size <= limit` evaluates to `true`.
- **BVA-04 (File Size Boundary + 1 Byte)**: File size equals `5,242,881` bytes. Fails file size check (`passed = false`).

### 2.3 Equivalence Partitioning & Normalization Edge Cases
- **EP-01 (Whitespace & Case Invariance)**: Attachment labels `'  lab report  '` and `'SOURCE CODE'` correctly match required files `['Lab Report', 'Source Code']` via `.toLowerCase().trim()`.
- **EP-02 (Empty Required Files List)**: An assignment configured with `requiredFiles: []` passes required attachment check regardless of uploaded labels.

### 2.4 Error Handling Utility
- **ERR-01 (`submissionError`)**: Validates that `submissionError(status, message, compliance)` returns an `Error` instance with appropriate `.status` (e.g. 400) and attached `.compliance` payload for downstream HTTP error handlers.

---

## 3. Execution Results

### Execution Command
```bash
cd backend
node --test test/compliance-whitebox.test.js
```

### Genuine Terminal Output
```
▶ White-Box Unit Testing: checkCompliance
  ▶ Basis Path Coverage (V(G) = 6)
    ✔ Basis Path 1 (TC-WB-01): Nominal / All checks pass (1-2-3-5-6-7-9-10-11-13-14-15-17-18-19-21) (0.9017ms)
    ✔ Basis Path 2 (TC-WB-02): Late submission failure (1-2-4-5-6-7-9-10-11-13-14-15-17-18-20-21) (0.2282ms)
    ✔ Basis Path 3 (TC-WB-03): Disallowed file type failure (1-2-3-5-6-8-9-10-11-13-14-15-17-18-20-21) (0.1662ms)
    ✔ Basis Path 4 (TC-WB-04): Oversized file failure (1-2-3-5-6-7-9-10-12-13-14-15-17-18-20-21) (0.2216ms)
    ✔ Basis Path 5 (TC-WB-05): Missing required attachment failure (1-2-3-5-6-7-9-10-11-13-14-16-17-18-20-21) (0.1808ms)
    ✔ Basis Path 6 (TC-WB-06): Compound failure across all predicates (1-2-4-5-6-8-9-10-12-13-14-16-17-18-20-21) (0.1501ms)
  ✔ Basis Path Coverage (V(G) = 6) (3.0939ms)
  ▶ Boundary Value Analysis (BVA)
    ✔ BVA-01: Deadline exact timestamp boundary (submittedAt == deadline) passes on-time check (0.2345ms)
    ✔ BVA-02: Deadline boundary + 1 millisecond fails on-time check (0.1776ms)
    ✔ BVA-03: File size exact maximum limit boundary (size == maxFileSizeMB * 1024 * 1024) passes (0.1501ms)
    ✔ BVA-04: File size exact boundary + 1 byte (limit + 1) fails file size check (0.1613ms)
  ✔ Boundary Value Analysis (BVA) (0.9259ms)
  ▶ Equivalence Partitioning & Normalization Edge Cases
    ✔ normalizes attachment label whitespace and case-insensitivity (0.1553ms)
    ✔ handles empty required files list when assignment has no required attachments (0.1193ms)
  ✔ Equivalence Partitioning & Normalization Edge Cases (0.3465ms)
  ▶ Helper Utility: submissionError
    ✔ constructs Error object decorated with HTTP status code and compliance object (0.3867ms)
  ✔ Helper Utility: submissionError (0.4587ms)
✔ White-Box Unit Testing: checkCompliance (5.3072ms)
ℹ tests 13
ℹ suites 5
ℹ pass 13
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 160.7472
```

---

## 4. Test Results Summary

| Suite Category | Tests Run | Passed | Failed | Execution Time |
| :--- | :--- | :--- | :--- | :--- |
| **Basis Path Tests** | 6 | 6 | 0 | 3.09 ms |
| **Boundary Value Analysis** | 4 | 4 | 0 | 0.93 ms |
| **Equivalence & Edge Cases** | 2 | 2 | 0 | 0.35 ms |
| **Error Handling Utility** | 1 | 1 | 0 | 0.46 ms |
| **Total** | **13** | **13** | **0** | **5.31 ms** |

All 13 unit tests passed successfully with 100% test reliability.
