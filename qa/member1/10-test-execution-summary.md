# Member 1 — Test Execution Summary

**Status:** 25 November 2026 (Asia/Colombo) · `qa/member-1` · commit `8660e35a335e639e6fada4f434a3f3c468279ffd`\
**Original manual run:** `20261125T190120`\
**Additional black-box run:** `bb-20261125T131845`

## Original Section 3.2 catalogue

All **25 original manual cases passed**. The six previously completed authentication cases were recovered from their existing evidence and user-reconciled CSV rows; they were not repeated. The remaining 19 cases were executed in the requested dependency order, beginning with M1-ASG-07. Each continued case immediately saved a JSON result, applicable genuine screenshots, its CSV row and the local manual-state checkpoint.

| Catalogue | Total | Passed | Failed | Blocked | Not Executed | Execution coverage | Pass rate among executed |
| --- | ---: | ---: | ---: | ---: | ---: | --- | --- |
| Original manual cases | 25 | 25 | 0 | 0 | 0 | 100% of catalogue | 100% (25/25) |
| Additional Section 3.3 checks | 52 | 52 | 0 | 0 | 0 | 100% of selected checks | 100% (52/52) |

The catalogues remain separate. No original result was inferred from an overlapping black-box request.

| Original module | Passed / total |
| --- | ---: |
| Authentication and registration | 6 / 6 |
| Assignment management | 5 / 5 |
| File submission and validation | 5 / 5 |
| Marks and feedback | 3 / 3 |
| Withdrawal and restoration | 2 / 2 |
| Role-based access control | 2 / 2 |
| Lab scheduling | 2 / 2 |

The [CSV](04-test-cases.csv) contains each observed outcome and existing relative evidence paths. [Final reconciliation](evidence/20261125T190120/completion-check.json) verifies IDs, unchanged design fields, JSON status agreement and existing evidence links. Native CUA returned JPEG screenshot bytes under the existing `.png` filenames; the captures remain genuine and unedited. [Manual run evidence](evidence/20261125T190120/) contains the original and continued records. The [recovery environment record](evidence/20261125T190120/resume-environment.json) records readiness and procedure adaptations; setup observations are excluded from case counts.

## Manual run data and outcomes

The existing RUN, S1/L1 accounts, dates and four fixture files were recovered. F remained **2 December 2026, 19:01**, P **24 November 2026, 12:00**, and D **2 December 2026**, all Asia/Colombo. No new run or database reset was needed. MAIN, OVERDUE, L2 and LAB were prepared through their documented browser workflows; setup is not counted as extra cases.

| Retained fixture | Identifier / observed state |
| --- | --- |
| MAIN | `6b06f20604f568329bd47b1a`; QA Main 20261125T190120; Published, revised description, 100 marks, PDF / Report / 5 MB, late disabled |
| A | report-valid.pdf; submitted 25 Nov 2026 **20:08:30**; compliance Passed; published **0 / 100**, Synthetic published feedback - zero is valid |
| B | report-second.pdf; submitted 25 Nov 2026 **20:12:13**; missing Report label, other checks Pass; restored and Awaiting Review, unmarked |
| OVERDUE | `6b06f40b04f568329bd47c50`; Published with P and late disabled; no submission created |
| LAB | QA Lab 20261125T190120; EC4206, D, **09:00–10:00**, QA Lab, capacity 20, Upcoming; original values retained after invalid 08:59 end-time edit |

A/B were identified by filename and timestamp, not list order. Their database IDs were not exposed in the inspected UI and are not invented. B's audit retained withdrawal at **20:17:16** and restoration at **20:18:50** with original reasons and actors. A's grade survived those transitions. Both downloaded PDFs matched their original 329-byte fixtures; A's downloaded one-page PDF opened locally in Preview. MAIN deletion was refused and both attempts remained available.

Safari **27.0** was used for all 19 continued cases; recovered authentication evidence records its original Brave/Safari method. Complete native date input, picker list view/reopening, reduced browser zoom and keyboard navigation recovered intermittent computer-tool issues without changing application source or environment configuration. ASG-07 preserves the initial incomplete date-entry observation and subsequent valid BASE retry. The extra SUB-13 picker screenshot is a tooling observation, distinct from its actual UI size-block result.

**RBAC-22 procedure adaptation:** Student browser navigation redirected to `/student-dashboard`. Safari Web Inspector was unavailable, so an equivalent local HTTP client obtained a fresh S1-only token through routine login instead of copying browser storage. Identity and student role were checked privately. One valid assignment-creation probe returned **403**, `You do not have permission to access this resource.` L1's exact-title search found no QA Forbidden assignment. Temporary credentials were cleared. The sanitized [API evidence](evidence/20261125T190120/M1-RBAC-22-api-403.json) discloses this adaptation. It is not a repeated authentication case or an additional test count.

## Additional black-box results and counting

| Technique | Referenced executions | Passed | Failed | Reuse |
| --- | ---: | ---: | ---: | --- |
| Equivalence partitioning | 30 | 30 | 0 | 11 password, 13 marks and 6 additional role cases; Student role also references an existing password case |
| Boundary value analysis | 23 | 23 | 0 | 14 shared with EP; 9 newly executed size configuration/upload checks |
| Login decision table | 13 | 13 | 0 | 10 API plus 3 browser checks; 8 reduced rules covered |
| **Unique additional checks** | **52** | **52** | **0** | **30 + 23 + 13 − 14 shared EP/BVA executions** |

The completed black-box run contains **49 distinct API test requests and 3 browser flows**. Its **6 supporting API requests** (2 fixture/authentication setup requests and 4 limiter probes), readiness probes and browser-generated network requests are excluded. No Section 3.3 check was rerun during manual continuation.

Selected outcomes: registration distinguishes JavaScript length from UTF-8 bytes; valid role strings are case-sensitive; integer marks 1–1000 and numeric-string conversion follow the implemented rules; file-size settings 1–100 are enforced; actual 5 MiB uploads accept equality and reject one byte above; login validation, credential denial, role selection and rate-limit precedence match expectations.

[Reports 05](05-equivalence-partitioning.md), [06](06-boundary-value-analysis.md) and [07](07-decision-table.md) map each additional input/outcome to [its own run evidence](evidence/bb-20261125T131845/): 52 per-case JSON records, 4 genuine browser screenshots, 6 setup records and environment/final-state records. The black-box final snapshot (6 users, 11 assignments, 2 submissions, no lab sessions) describes that earlier run's endpoint, not the later manual run's final database state.

## Environment, findings and closure

The frontend `http://127.0.0.1:5173` served the QA API base `http://127.0.0.1:5002/api`; health returned 200. Existing backend connections targeted MongoDB port **27028**. MongoDB's recorded options confirmed loopback binding and the Member 1 runtime data directory. The established isolated database is **labtrack_qa_member1**, with submissions under `qa/member1/runtime/submissions/`. Services were reused; no restart, reset, configuration change or dependency installation was performed. [Environment setup](03-test-environment.md) remains the historical setup record.

**0 confirmed product defects.** [Findings for Member 4](09-defect-findings.md) record the reviewed result. No defect ID or report was invented, and no message was sent to Member 4. Evidence review, peer review and team acceptance remain pending; the selected executions are complete.

Coverage limits remain: manual size/deadline cases are UI-only, broad authorization mutations, other formats, permitted late uploads, concurrency, crash recovery, accessibility, load and production security are not comprehensively tested. Known dashboard demo content is not evidence of persistent data. Private runtime state is excluded from reviewable evidence. No existing automated suite was run; no application source, other member's files, dependencies or shared configuration were modified; no commit or push was made.
