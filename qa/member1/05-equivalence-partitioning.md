# 3.3 Equivalence Partitioning

**EC4206 · LabTrack · Member 1 · Branch `qa/member-1` · Baseline `8660e35`**

Executed on 25 November 2026 (Asia/Colombo), run **`bb-20261125T131845`**. Evidence is in [the run directory](evidence/bb-20261125T131845/). The [environment evidence](evidence/bb-20261125T131845/environment.json) records readiness; the existing [environment report](03-test-environment.md) supplies startup/configuration details. The backend process was checked for the QA database and isolated upload overrides before execution. Only `labtrack_qa_member1` on `127.0.0.1:27028` was used.

At the end of this black-box run, the original Section 3.2 catalogue was **25 Not Executed**. It has since completed separately with **25 Passed** in manual run `20261125T190120`; see [the execution summary](10-test-execution-summary.md). The results below remain the additional Section 3.3 checks and are counted separately. Passwords and tokens are redacted from evidence; password representatives are described by type/length/byte count rather than published as working credentials.

## Method and requirements

Inputs are grouped by the validation rule they exercise. Each representative was sent to the running application through its public HTTP API using Node fetch; no controller or validator was called directly. Other fields were valid, and fresh synthetic emails/titles prevented duplicate-record conflicts. Successful registrations/assignments remain in QA; nothing was reset.

The three selected fields are registration password, assignment total marks and registration user role. Valid Student role coverage reuses BB-PW-04 instead of creating an identical extra request.

## 1. Registration password

`backend/src/routes/auth.js` requires a nonempty string with JavaScript length at least 8 and UTF-8 size at most 72 bytes. These are different units; the maximum is not universally 72 characters. Evidence records both measurements. No password complexity rule is implemented. Registration and login have different limits.

| Case / evidence | Partition | Representative input | Expected result | Actual result | Status |
| --- | --- | --- | --- | --- | --- |
| [BB-PW-01](evidence/bb-20261125T131845/BB-PW-01.json) | Invalid: empty string | Empty string | 400; password required | HTTP 400: Password is required. | Passed |
| [BB-PW-02](evidence/bb-20261125T131845/BB-PW-02.json) | Invalid: non-string | Number with 8 decimal digits | 400; password required | HTTP 400: Password is required. | Passed |
| [BB-PW-03](evidence/bb-20261125T131845/BB-PW-03.json) | Invalid: below minimum | Random ASCII, 7 code units / 7 bytes | 400; at least 8 characters | HTTP 400: Password must be at least 8 characters. | Passed |
| [BB-PW-04](evidence/bb-20261125T131845/BB-PW-04.json) | Valid: ASCII within limits | Random ASCII, 8 code units / 8 bytes | 201; Student account created | HTTP 201: Created account; role=student | Passed |
| [BB-PW-05](evidence/bb-20261125T131845/BB-PW-05.json) | Valid: ASCII within limits | Random ASCII, 9 code units / 9 bytes | 201; account created | HTTP 201: Created account; role=student | Passed |
| [BB-PW-06](evidence/bb-20261125T131845/BB-PW-06.json) | Valid: ASCII within limits | Random ASCII, 71 code units / 71 bytes | 201; account created | HTTP 201: Created account; role=student | Passed |
| [BB-PW-07](evidence/bb-20261125T131845/BB-PW-07.json) | Valid: ASCII at byte maximum | Random ASCII, 72 code units / 72 bytes | 201; account created | HTTP 201: Created account; role=student | Passed |
| [BB-PW-08](evidence/bb-20261125T131845/BB-PW-08.json) | Invalid: exceeds byte maximum | Random ASCII, 73 code units / 73 bytes | 400; at most 72 bytes | HTTP 400: Password must be 72 bytes or fewer. | Passed |
| [BB-PW-09](evidence/bb-20261125T131845/BB-PW-09.json) | Valid: multibyte within byte limit | 36 copies of one two-byte BMP character; 36 code units / 72 bytes | 201; account created | HTTP 201: Created account; role=student | Passed |
| [BB-PW-10](evidence/bb-20261125T131845/BB-PW-10.json) | Invalid: multibyte exceeds byte limit | 37 copies of the same two-byte BMP character; 37 code units / 74 bytes | 400; at most 72 bytes | HTTP 400: Password must be 72 bytes or fewer. | Passed |
| [BB-PW-11](evidence/bb-20261125T131845/BB-PW-11.json) | Invalid: missing field | Password key omitted | 400; password required | HTTP 400: Password is required. | Passed |

## 2. Assignment total marks

`backend/src/controllers/assignments.js` accepts finite integer values from **1 to 1,000 inclusive**. Numeric nonblank strings are converted to numbers; nonnumeric strings, booleans, omitted values and fractional values fail. `backend/src/models/Assignment.js` also applies integer/range constraints. These tests use authenticated lecturer POST `/api/assignments` requests; accepted requests return 201 and rejected requests return 400 with validation errors.

| Case / evidence | Partition | Representative input | Expected result | Actual result | Status |
| --- | --- | --- | --- | --- | --- |
| [BB-MARK-01](evidence/bb-20261125T131845/BB-MARK-01.json) | Valid: integer in range | 50 | 201; saved totalMarks 50 | HTTP 201: Saved: totalMarks=50, maxFileSizeMB=5 | Passed |
| [BB-MARK-02](evidence/bb-20261125T131845/BB-MARK-02.json) | Invalid: below minimum | -1 | 400; positive whole number required | HTTP 400: Total marks must be a whole number greater than zero. | Passed |
| [BB-MARK-03](evidence/bb-20261125T131845/BB-MARK-03.json) | Invalid: below minimum | 0 | 400; positive whole number required | HTTP 400: Total marks must be a whole number greater than zero. | Passed |
| [BB-MARK-04](evidence/bb-20261125T131845/BB-MARK-04.json) | Valid: minimum | 1 | 201; saved totalMarks 1 | HTTP 201: Saved: totalMarks=1, maxFileSizeMB=5 | Passed |
| [BB-MARK-05](evidence/bb-20261125T131845/BB-MARK-05.json) | Valid: in range | 2 | 201; saved totalMarks 2 | HTTP 201: Saved: totalMarks=2, maxFileSizeMB=5 | Passed |
| [BB-MARK-06](evidence/bb-20261125T131845/BB-MARK-06.json) | Valid: in range | 999 | 201; saved totalMarks 999 | HTTP 201: Saved: totalMarks=999, maxFileSizeMB=5 | Passed |
| [BB-MARK-07](evidence/bb-20261125T131845/BB-MARK-07.json) | Valid: maximum | 1000 | 201; saved totalMarks 1000 | HTTP 201: Saved: totalMarks=1000, maxFileSizeMB=5 | Passed |
| [BB-MARK-08](evidence/bb-20261125T131845/BB-MARK-08.json) | Invalid: above maximum | 1001 | 400; maximum 1000 | HTTP 400: Total marks must be 1000 or less. | Passed |
| [BB-MARK-09](evidence/bb-20261125T131845/BB-MARK-09.json) | Invalid: fraction | 1.5 | 400; whole number required | HTTP 400: Total marks must be a whole number greater than zero. | Passed |
| [BB-MARK-10](evidence/bb-20261125T131845/BB-MARK-10.json) | Invalid: nonnumeric string | String abc | 400; whole number required | HTTP 400: Total marks must be a whole number greater than zero. | Passed |
| [BB-MARK-11](evidence/bb-20261125T131845/BB-MARK-11.json) | Invalid: missing | totalMarks omitted | 400; whole number required | HTTP 400: Total marks must be a whole number greater than zero. | Passed |
| [BB-MARK-12](evidence/bb-20261125T131845/BB-MARK-12.json) | Valid: numeric string | String 50 | 201; converted and saved as number 50 | HTTP 201: Saved: totalMarks=50, maxFileSizeMB=5 | Passed |
| [BB-MARK-13](evidence/bb-20261125T131845/BB-MARK-13.json) | Invalid: boolean | false | 400; whole number required | HTTP 400: Total marks must be a whole number greater than zero. | Passed |

## 3. Registration user role

`backend/src/routes/auth.js` and `backend/src/models/User.js` allow exactly the case-sensitive strings **student** and **lecturer**. The UI offers only these choices, so direct API checks are needed for unoffered values. Public lecturer registration is implemented behaviour, not a newly discovered defect.

| Case / evidence | Partition | Representative input | Expected result | Actual result | Status |
| --- | --- | --- | --- | --- | --- |
| [BB-PW-04](evidence/bb-20261125T131845/BB-PW-04.json) | Valid: Student | student | 201; Student account created (reused) | HTTP 201: Created account; role=student | Passed |
| [BB-ROLE-01](evidence/bb-20261125T131845/BB-ROLE-01.json) | Valid: Lecturer | lecturer | 201; Lecturer account created | HTTP 201: Created account; role=lecturer | Passed |
| [BB-ROLE-02](evidence/bb-20261125T131845/BB-ROLE-02.json) | Invalid: unsupported string | admin | 400; role must be student or lecturer | HTTP 400: Role must be either student or lecturer. | Passed |
| [BB-ROLE-03](evidence/bb-20261125T131845/BB-ROLE-03.json) | Invalid: incorrect case | Student | 400; role must be student or lecturer | HTTP 400: Role must be either student or lecturer. | Passed |
| [BB-ROLE-04](evidence/bb-20261125T131845/BB-ROLE-04.json) | Invalid: missing field | Role key omitted | 400; role must be student or lecturer | HTTP 400: Role must be either student or lecturer. | Passed |
| [BB-ROLE-05](evidence/bb-20261125T131845/BB-ROLE-05.json) | Invalid: non-string | Number 7 | 400; role must be student or lecturer | HTTP 400: Role must be either student or lecturer. | Passed |
| [BB-ROLE-06](evidence/bb-20261125T131845/BB-ROLE-06.json) | Invalid: empty string | Empty string | 400; role must be student or lecturer | HTTP 400: Role must be either student or lecturer. | Passed |

## Results and limits

**30 unique executions: 30 passed, 0 failed.** The Student role reference is shared with password coverage and is not another execution. Fourteen of these executions also support BVA and are counted once in the combined summary. Full names, synthetic emails and accepted IDs are available in the sanitized evidence; raw passwords/tokens are not.

These API results establish selected server-side partitions, not frontend form behaviour. Examples do not exhaust Unicode, object/array values, whitespace strings or every possible numeric representation. Existing historical results were not reused because no original case had matching executed input/conditions and evidence.
