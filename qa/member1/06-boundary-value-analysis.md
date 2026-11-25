# 3.3 Boundary Value Analysis

**EC4206 · LabTrack · Member 1 · Branch `qa/member-1` · Baseline `8660e35`**

Executed on 25 November 2026 (Asia/Colombo), run **`bb-20261125T131845`**. Evidence is in [the run directory](evidence/bb-20261125T131845/). The [environment evidence](evidence/bb-20261125T131845/environment.json) records readiness; the existing [environment report](03-test-environment.md) supplies startup/configuration details. The backend process was checked for the QA database and isolated upload overrides before execution. Only `labtrack_qa_member1` on `127.0.0.1:27028` was used.

At the end of this black-box run, the original Section 3.2 catalogue was **25 Not Executed**. It has since completed separately with **25 Passed** in manual run `20261125T190120`; see [the execution summary](10-test-execution-summary.md). The results below remain the additional Section 3.3 checks and are counted separately. Passwords and tokens are redacted from evidence; password representatives are described by type/length/byte count rather than published as working credentials.

## Method

The actual limits were verified from authentication routes, assignment controller/model and the upload file service. Public API requests tested values immediately below, at and above each chosen lower/upper limit. Existing Section 3.3 EP evidence is reused where input and conditions match; no original manual-case result is reused as evidence for these additional checks.

All rows below are **direct API testing**, not browser uploads. Except for the input being varied, requests used valid synthetic fixtures and the isolated QA database.

## 1. Registration password length and bytes

Minimum: **8 JavaScript code units**. Maximum: **72 UTF-8 bytes**. For ASCII these units coincide, allowing the six values 7/8/9 and 71/72/73. Random ASCII strings were used and redacted. Two supplementary multibyte representatives confirm that byte count, rather than a general character-count maximum, matters.

| Case / evidence | Partition | Representative input | Expected result | Actual result | Status |
| --- | --- | --- | --- | --- | --- |
| [BB-PW-03](evidence/bb-20261125T131845/BB-PW-03.json) | Invalid: below minimum | Random ASCII, 7 code units / 7 bytes | 400; at least 8 characters | HTTP 400: Password must be at least 8 characters. | Passed |
| [BB-PW-04](evidence/bb-20261125T131845/BB-PW-04.json) | Valid: ASCII within limits | Random ASCII, 8 code units / 8 bytes | 201; Student account created | HTTP 201: Created account; role=student | Passed |
| [BB-PW-05](evidence/bb-20261125T131845/BB-PW-05.json) | Valid: ASCII within limits | Random ASCII, 9 code units / 9 bytes | 201; account created | HTTP 201: Created account; role=student | Passed |
| [BB-PW-06](evidence/bb-20261125T131845/BB-PW-06.json) | Valid: ASCII within limits | Random ASCII, 71 code units / 71 bytes | 201; account created | HTTP 201: Created account; role=student | Passed |
| [BB-PW-07](evidence/bb-20261125T131845/BB-PW-07.json) | Valid: ASCII at byte maximum | Random ASCII, 72 code units / 72 bytes | 201; account created | HTTP 201: Created account; role=student | Passed |
| [BB-PW-08](evidence/bb-20261125T131845/BB-PW-08.json) | Invalid: exceeds byte maximum | Random ASCII, 73 code units / 73 bytes | 400; at most 72 bytes | HTTP 400: Password must be 72 bytes or fewer. | Passed |
| [BB-PW-09](evidence/bb-20261125T131845/BB-PW-09.json) | Valid: multibyte within byte limit | 36 copies of one two-byte BMP character; 36 code units / 72 bytes | 201; account created | HTTP 201: Created account; role=student | Passed |
| [BB-PW-10](evidence/bb-20261125T131845/BB-PW-10.json) | Invalid: multibyte exceeds byte limit | 37 copies of the same two-byte BMP character; 37 code units / 74 bytes | 400; at most 72 bytes | HTTP 400: Password must be 72 bytes or fewer. | Passed |

## 2. Assignment total marks

The allowed integer interval is **1–1,000 inclusive**. Lower boundary representatives are 0, 1 and 2; upper representatives are 999, 1000 and 1001. All other assignment fields were held valid. Each successful request created a separate synthetic assignment; no existing record was overwritten.

| Case / evidence | Partition | Representative input | Expected result | Actual result | Status |
| --- | --- | --- | --- | --- | --- |
| [BB-MARK-03](evidence/bb-20261125T131845/BB-MARK-03.json) | Invalid: below minimum | 0 | 400; positive whole number required | HTTP 400: Total marks must be a whole number greater than zero. | Passed |
| [BB-MARK-04](evidence/bb-20261125T131845/BB-MARK-04.json) | Valid: minimum | 1 | 201; saved totalMarks 1 | HTTP 201: Saved: totalMarks=1, maxFileSizeMB=5 | Passed |
| [BB-MARK-05](evidence/bb-20261125T131845/BB-MARK-05.json) | Valid: in range | 2 | 201; saved totalMarks 2 | HTTP 201: Saved: totalMarks=2, maxFileSizeMB=5 | Passed |
| [BB-MARK-06](evidence/bb-20261125T131845/BB-MARK-06.json) | Valid: in range | 999 | 201; saved totalMarks 999 | HTTP 201: Saved: totalMarks=999, maxFileSizeMB=5 | Passed |
| [BB-MARK-07](evidence/bb-20261125T131845/BB-MARK-07.json) | Valid: maximum | 1000 | 201; saved totalMarks 1000 | HTTP 201: Saved: totalMarks=1000, maxFileSizeMB=5 | Passed |
| [BB-MARK-08](evidence/bb-20261125T131845/BB-MARK-08.json) | Invalid: above maximum | 1001 | 400; maximum 1000 | HTTP 400: Total marks must be 1000 or less. | Passed |

## 3. Maximum-file-size configuration

The API permits an integer `maxFileSizeMB` from **1 to 100 inclusive**. The frontend dropdown offers only 5, 10, 20 and 50 MB, so API requests are needed to exercise the true configuration endpoints. These values test configuration validation, not the upload of a 100 MB document.

| Case / evidence | Partition | Representative input | Expected result | Actual result | Status |
| --- | --- | --- | --- | --- | --- |
| [BB-SIZECFG-01](evidence/bb-20261125T131845/BB-SIZECFG-01.json) | Lower boundary | 0 MB | 400; reject out-of-range limit | HTTP 400: Maximum file size must be a whole number greater than zero. | Passed |
| [BB-SIZECFG-02](evidence/bb-20261125T131845/BB-SIZECFG-02.json) | Lower boundary | 1 MB | 201; save requested limit | HTTP 201: Saved: totalMarks=100, maxFileSizeMB=1 | Passed |
| [BB-SIZECFG-03](evidence/bb-20261125T131845/BB-SIZECFG-03.json) | Lower boundary | 2 MB | 201; save requested limit | HTTP 201: Saved: totalMarks=100, maxFileSizeMB=2 | Passed |
| [BB-SIZECFG-04](evidence/bb-20261125T131845/BB-SIZECFG-04.json) | Upper boundary | 99 MB | 201; save requested limit | HTTP 201: Saved: totalMarks=100, maxFileSizeMB=99 | Passed |
| [BB-SIZECFG-05](evidence/bb-20261125T131845/BB-SIZECFG-05.json) | Upper boundary | 100 MB | 201; save requested limit | HTTP 201: Saved: totalMarks=100, maxFileSizeMB=100 | Passed |
| [BB-SIZECFG-06](evidence/bb-20261125T131845/BB-SIZECFG-06.json) | Upper boundary | 101 MB | 400; reject out-of-range limit | HTTP 400: Maximum file size must be 100 MB or less. | Passed |

## 4. Uploaded file size at a configured limit

The file service multiplies the configured value by **1,024 × 1,024**, so the UI's 5 MB setting means **5,242,880 bytes (5 MiB)**. Files larger than this limit should be rejected; equality should be accepted. A Published synthetic assignment allowed PDF, required the Report label, disabled late work and had a future deadline. Synthetic one-page PDF bytes were padded with spaces to exact sizes, submitted as multipart files with the Report label, using an authenticated synthetic student. The content source was the existing `backend/test/fixtures/report.pdf`; no personal files were used.

| Case / evidence | Partition | Representative input | Expected result | Actual result | Status |
| --- | --- | --- | --- | --- | --- |
| [BB-FILE-01](evidence/bb-20261125T131845/BB-FILE-01.json) | Below / at / above 5 MiB limit | 5,242,879 bytes | 201; retain compliant submission with exact file size | HTTP 201: Saved file size 5242879 bytes; compliance=True | Passed |
| [BB-FILE-02](evidence/bb-20261125T131845/BB-FILE-02.json) | Below / at / above 5 MiB limit | 5,242,880 bytes | 201; retain compliant submission with exact file size | HTTP 201: Saved file size 5242880 bytes; compliance=True | Passed |
| [BB-FILE-03](evidence/bb-20261125T131845/BB-FILE-03.json) | Below / at / above 5 MiB limit | 5,242,881 bytes | 413; reject oversized upload | HTTP 413: A file exceeds the assignment size limit. | Passed |

The two accepted response records report the exact submitted sizes and passed compliance checks. The oversized response reports the assignment size-limit error. This is actual HTTP upload evidence; a disabled frontend button was not used as a substitute.

## Results and limits

**23 boundary/supplementary executions: 23 passed, 0 failed.** Fourteen are reused from EP (eight password and six marks checks). Nine add new coverage (six configuration and three upload checks). No deadline BVA was selected: time-sensitive receipt boundaries require additional clock/latency control and are not claimed by these results.

This run does not establish all file-format checks, maximum number of files, zero-byte handling, maximum physical 100 MiB upload, or browser size feedback. No database reset or application fix was performed.
