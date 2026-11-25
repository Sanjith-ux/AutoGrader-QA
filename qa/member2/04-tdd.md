# Section 3.5 – Test-Driven Development (TDD) Demonstration

**Cycle**: RED → APPROVAL → GREEN → REFACTOR  
**Module**: `backend/src/services/submissionFiles.js`  
**Defect Category**: Cross-Platform Storage Path Separator Normalization (Windows vs. POSIX)  
**Author / QA Engineer**: Member 2 (EC4206 Software Testing & Quality Assurance)  
**Branch**: `qa/member-2`

---

## 1. Defect Identification & Problem Statement

During baseline testing on Windows, a defect was identified in the file storage inspection pipeline:
- In `backend/src/services/submissionFiles.js` (line 74), `inspectFile()` computed the relative storage path via `path.relative(uploadRoot, file.path)`.
- On Windows operating systems, Node's `path.relative()` produces Windows-style backslashes (`\`), e.g.:
  `"4a22f715-1eca-47ae-96ca-7aa1141368d2\\97351cc4-e6c7-45f8-8056-6cb688e2cac2"`
- However, persistent submission records stored in MongoDB and API assertions throughout the system expect portable POSIX forward-slash paths (`UUID/UUID`), matching the regex `/^[a-f0-9-]+\/[a-f0-9-]+$/`.
- **Impact**: Storing OS-dependent backslashes in database documents breaks cross-platform data migration, leads to download routing inconsistencies, and caused the existing integration test at `backend/test/submissions.test.js:280` to fail with `ERR_ASSERTION`.

---

## 2. Stage 1: RED (Failing Test)

Before modifying any business logic, a targeted, isolated test was engineered to capture the failure:
- **Test File**: `backend/test/storage-path-normalization.test.js`
- **Assertion**:
  ```javascript
  assert.equal(inspected.storagePath.includes('\\'), false,
    `storagePath contains Windows backslash: "${inspected.storagePath}"`
  )
  assert.match(inspected.storagePath, /^[a-f0-9-]+\/[a-f0-9-]+$/)
  ```

### Terminal Evidence (RED)
- **Saved File**: [tdd-red-failure.txt](file:///C:/Users/Paviththiran/Desktop/AutoGrader-QA/qa/member2/evidence/tdd/tdd-red-failure.txt)
- **Captured Failure Output**:
  ```
  ▶ TDD Demonstration: Cross-Platform Storage Path Normalization
    ✖ TDD RED: inspectFile must return normalized POSIX storagePath with forward slashes on all platforms (12.4563ms)
  ✖ TDD Demonstration: Cross-Platform Storage Path Normalization (16.9676ms)
  ℹ tests 1
  ℹ suites 1
  ℹ pass 0
  ℹ fail 1
  ℹ cancelled 0
  ℹ skipped 0
  ℹ todo 0
  ℹ duration_ms 168.9877

  ✖ failing tests:

  test at test\storage-path-normalization.test.js:22:3
  ✖ TDD RED: inspectFile must return normalized POSIX storagePath with forward slashes on all platforms (12.4563ms)
    AssertionError [ERR_ASSERTION]: storagePath contains Windows backslash separator: "b4e54826-6f81-4bc9-9371-c03780517789\e1762744-a690-4822-a5ec-08f972e2764b". Expected forward slashes.
    true !== false
  ```

---

## 3. Formal Quality Gate & User Approval

As mandated by senior QA engineering standards, no production business logic was modified until explicit formal user authorization was received.

### Proposal Submitted to User
1. **Identified Problem**: `inspectFile()` produces un-sanitized Windows backslashes in `storagePath`.
2. **Failing Test**: `test/storage-path-normalization.test.js` failed with `AssertionError: true !== false`.
3. **Proposed Fix**: Normalize `path.relative()` using `.replaceAll('\\', '/')` on line 74 of `submissionFiles.js`.
4. **Expected Behavior**: Portable POSIX-style relative storage path (`UUID/UUID`) returned on all platforms.

**User Status**: **APPROVED** (Proceeded to GREEN and REFACTOR).

---

## 4. Stage 2: GREEN (Minimum Code Fix)

The minimum necessary code fix was applied to `backend/src/services/submissionFiles.js` (line 74):

```javascript
// BEFORE:
return { originalName, type, mimeType: ..., size: file.size, storagePath: path.relative(uploadRoot, file.path) }

// AFTER (Minimal Fix):
return { originalName, type, mimeType: ..., size: file.size, storagePath: path.relative(uploadRoot, file.path).replaceAll('\\', '/') }
```

### Verification
1. **New TDD Test**:
   - Command: `node --test test/storage-path-normalization.test.js`
   - Result: **Passed (1 pass, 0 fail in 16.8 ms)**.
   - Evidence: [tdd-green-success.txt](file:///C:/Users/Paviththiran/Desktop/AutoGrader-QA/qa/member2/evidence/tdd/tdd-green-success.txt)
2. **Previously Failing Baseline Test**:
   - Command: `node --test test/submissions.test.js`
   - Result: **All 40 tests passed** (including `stores a genuine PDF, metadata, requirements and pass results in MongoDB with private generated paths` in 27.8 ms).

---

## 5. Stage 3: REFACTOR & Full Regression

### Refactoring & Edge Case Verification
- We verified that `.replaceAll('\\', '/')` is completely idempotent: if run on Linux or POSIX environments where `path.relative` already returns forward slashes, `.replaceAll('\\', '/')` is a safe no-op.
- Added a second test verifying that paths already containing POSIX forward slashes remain unchanged and that file basenames with nested backslashes are sanitized properly.

### Terminal Evidence (REFACTOR)
- **Saved File**: [tdd-refactor-success.txt](file:///C:/Users/Paviththiran/Desktop/AutoGrader-QA/qa/member2/evidence/tdd/tdd-refactor-success.txt)
- **Output**:
  ```
  ▶ TDD Demonstration: Cross-Platform Storage Path Normalization
    ✔ TDD GREEN: inspectFile returns normalized POSIX storagePath with forward slashes on Windows paths (12.0032ms)
    ✔ TDD REFACTOR: Verifies normalization is idempotent on paths already using POSIX separators (1.287ms)
  ✔ TDD Demonstration: Cross-Platform Storage Path Normalization (17.4369ms)
  ℹ tests 2
  ℹ suites 1
  ℹ pass 2
  ℹ fail 0
  ℹ cancelled 0
  ℹ skipped 0
  ℹ todo 0
  ℹ duration_ms 170.0002
  ```

### Full Regression Suite Verification
- Ran complete backend test suite across all 25 test suites using the isolated test database `mongodb://127.0.0.1:27017/labtrack_test`.
- **Result**:
  ```
  ℹ tests 149
  ℹ suites 25
  ℹ pass 149
  ℹ fail 0
  ℹ cancelled 0
  ℹ skipped 0
  ℹ todo 0
  ℹ duration_ms 5249.7169
  ```
- 100% pass rate achieved with zero regressions.

---

## 6. Defect Coordination Note (For Member 4)
- **Bug ID**: `BUG-M2-001`
- **Title**: Cross-platform storage path separator inconsistency on Windows
- **Severity**: Medium
- **Root Cause**: `path.relative()` emits system-dependent path separators (`\`), causing schema mismatch in MongoDB and assertion failure in `submissions.test.js`.
- **Resolution**: Normalized storage paths using `.replaceAll('\\', '/')` in `inspectFile()`.
- **Status**: Verified and Fixed via TDD cycle.
