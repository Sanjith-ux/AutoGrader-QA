# 3.2 STLC & Test Cases — Member 1

**Course:** EC4206 – Software Testing and Quality Assurance\
**System:** LabTrack – AutoGrader & Lab Submission Portal\
**Branch:** `qa/member-1` · **Design baseline:** `8660e35`\
**Status date:** 25 November 2026 (Asia/Colombo)

This section applies the Software Testing Life Cycle (STLC) to the implemented LabTrack system. It builds on [the test plan](01-test-plan.md) and [the verified environment record](03-test-environment.md). The [manual case catalogue](04-test-cases.csv) contains 25 designed cases, and [the execution guide](08-test-execution-guide.md) explains their data and sequence. The original 25 cases have now been executed in manual run `20261125T190120`: 25 Passed, 0 Failed, 0 Blocked and 0 Not Executed. Six authentication results were recovered from their original evidence and were not repeated during continuation. Section 3.3 has now executed 52 separate black-box checks; see [the execution summary](10-test-execution-summary.md). Earlier environment checks and historical project test totals are not results for the original cases.

## 1. Requirement analysis

**Objective:** Identify testable behaviour and distinguish implemented workflows from demonstration screens.

**Activities:** The existing READMEs, project documentation and source analysis were reviewed. Targeted source checks confirmed registration/login rules, assignment form controls, upload labels, review controls, withdrawal reasons, role navigation and lab scheduling. Persistent scope covers accounts, assignments, submissions, marks/feedback, withdrawal/restoration and schedules. Attendance and medical requests are excluded as persistent workflows. Current code takes precedence over outdated README claims, while ambiguous user needs remain questions for team review.

**Deliverables:** Scope and source references in test-plan sections 4–6; validation rules and expected outcomes in the case catalogue; limitations listed below.

**Current status:** Completed for the inspected baseline. Stakeholder acceptance criteria and full team review remain pending. Source inspection establishes a basis for testing, not proof of correct runtime behaviour.

## 2. Test planning

**Objective:** Define priorities, resources, responsibilities and completion criteria before execution.

**Activities:** The existing plan defines risk-based testing, proposed four-member responsibilities, a five-session schedule, ISO/IEC 25010:2011 quality targets, entry/exit criteria and isolated-data requirements. Security, grading accuracy and preservation of academic history receive high priority. The execution guide proposes a reusable synthetic dataset and an order that avoids database resets.

**Deliverables:** [01-test-plan.md](01-test-plan.md), especially sections 7–14, plus execution dependencies in [08-test-execution-guide.md](08-test-execution-guide.md).

**Current status:** Plan drafted and available; team allocation, calendar dates and peer review remain pending. Additional Section 3.3 execution was authorized and performed. The original 25-case execution is now complete in its separate manual run. No development changes were made.

## 3. Test case design

**Objective:** Turn the selected requirements into repeatable manual checks with observable expected results.

**Activities:** Twenty-five cases have been designed using positive/negative scenarios, boundary values, state transitions and role/ownership checks. They use synthetic accounts and two identifiable attempts on one main assignment. Most checks are browser-based; one direct API request checks server-side role enforcement that the UI prevents a student from reaching. Each case identifies priority, prerequisites, data, numbered steps and expected outcome.

| Module | Designed cases | IDs |
| --- | ---: | --- |
| Authentication and registration | 6 | M1-AUTH-01–06 |
| Assignment management | 5 | M1-ASG-07–11 |
| File submission and validation | 5 | M1-SUB-12–16 |
| Marks and feedback | 3 | M1-MARK-17–19 |
| Withdrawal and restoration | 2 | M1-WDR-20–21 |
| Role-based access control | 2 | M1-RBAC-22–23 |
| Lab scheduling | 2 | M1-LAB-24–25 |
| **Total** | **25** | |

**Deliverables:** [04-test-cases.csv](04-test-cases.csv) and data/evidence instructions in [08-test-execution-guide.md](08-test-execution-guide.md).

**Current status:** Design executed against the runtime; peer review remains pending. All 25 cases are `Passed`, with observed Actual Result and existing evidence references. Defect ID remains blank because no genuine product defect was found. The catalogue is a selected sample of the broader plan, not exhaustive coverage.

## 4. Test environment setup

**Objective:** Provide a repeatable environment that protects development records and isolates uploaded files.

**Activities:** Earlier setup created a separate MongoDB process on `127.0.0.1:27028` using `labtrack_qa_member1`, isolated submission storage and local Git exclusions. The backend was configured through command-scoped overrides on port `5002`, with Vite on `5173`. The recorded checks covered MongoDB isolation, backend connectivity, health, CORS, frontend rendering and a synthetic invalid-login probe.

**Deliverables:** Existing [03-test-environment.md](03-test-environment.md), including versions, verified outcomes, restart instructions and limitations.

**Current status:** Setup was completed previously and the running frontend, backend, isolated MongoDB and backend overrides were rechecked for Section 3.3. Synthetic accounts, assignments and exact-sized upload data were prepared for the black-box run through normal APIs. The original manual run separately reused its recovered S1/L1 accounts, RUN, dates and files; MAIN, OVERDUE, A/B, L2 and LAB were prepared through the documented UI workflows. Existing environment documentation is retained unchanged as the historical setup record.

## 5. Test execution

**Objective:** Compare actual behaviour with the designed expected results and collect defensible evidence.

**Planned activities:** After approval, recheck entry criteria and execute cases in the guide's dependency order. Record actual messages, state changes and screenshots. Mark blocked prerequisites explicitly rather than inventing substitute data or reporting a pass. Send reproducible, genuine defect information to Member 4 for the agreed defect log. Retest only after an approved fix and record the new attempt separately.

**Deliverables:** The original CSV now contains all 25 results. Manual evidence under `evidence/20261125T190120/` includes per-case JSON, genuine screenshots, sanitized RBAC response and a recovery-environment record. The ignored local checkpoint was saved after each continued case. Separate Section 3.3 reports and their evidence remain unchanged.

**Current status:** Original Section 3.2 execution completed: 25 Passed, 0 Failed, 0 Blocked, 0 Not Executed. Section 3.3 remains separately complete for 52 distinct checks: 52 Passed (49 API checks and 3 browser flows); 14 shared EP/BVA observations are counted once. No authentication case or black-box suite was repeated during continuation. Existing automated suites were not run. No confirmed defect was found to send to Member 4.

## 6. Test closure

**Objective:** Summarize coverage and unresolved risks against the test plan's exit criteria.

**Planned activities:** Reconcile all 25 case statuses and evidence links, review genuine defects and retest outcomes with Member 4, identify uncovered requirements, and compare results with the exit criteria. Distinguish passed, failed, blocked and unexecuted work. Retain synthetic evidence and document lessons for future testing without resetting any database.

**Deliverables:** Updated [execution summary](10-test-execution-summary.md), [findings](09-defect-findings.md), evidence references and explicit coverage/procedure limitations. Team closure decision remains separate.

**Current status:** Both selected execution catalogues are complete and reconciled separately. Evidence review, peer review and team acceptance remain pending; selected passes alone do not certify every plan exit criterion or the whole application.

## Design limitations and traceability

The proposed distribution is unchanged. UI-only size/deadline checks do not prove server-side enforcement; the disguised-PDF case exercises server content checking. Not all limits or states in the test plan fit into 25 cases: expired tokens, rate-limit thresholds, exact accepted size boundaries, archive internals, permitted late uploads, every ownership endpoint, request races and crash recovery remain outside this catalogue. No production, load or complete accessibility assurance is implied.

Detailed traceability is provided by module/IDs in the catalogue and the source map in the execution guide. The team's actual allocation and deadline are still unspecified. Original catalogue results now link to actual manual evidence. Actual additional Section 3.3 evidence is linked from reports 05–07 and the execution summary; it is not evidence of executing the original cases.


## Section 3.3 progress update

The original Section 3.2 design is retained and its 25 executions are now complete in the separate manual run. Additional completed work comprises EP (30 referenced executions), BVA (23, including 14 reused EP observations) and login decisions (13). The union is 52 executed checks, all Passed, with zero confirmed defects. [Reports 05–07 and summary 10](10-test-execution-summary.md) provide the results and count reconciliation. The login rate-limit check may temporarily block further sign-ins; no expiry test or reset was performed. Original-case statuses reflect their own manual observations, not reused black-box passes.

## Manual execution continuation and limits

Run `20261125T190120` was recovered on branch `qa/member-1` at commit `8660e35a335e639e6fada4f434a3f3c468279ffd`. Safari 27.0 was used for all 19 continued cases. Existing services, dates and fixtures were retained without a reset, dependency installation, source/configuration edit, commit or push. Each case immediately saved JSON evidence, applicable screenshots, its CSV row and the ignored runtime checkpoint. A is the 20:08:30 report-valid.pdf attempt (published 0/100); B is the 20:12:13 report-second.pdf attempt (restored, Awaiting Review with missing Report label). Times are Asia/Colombo on 25 November 2026.

Safari date entry and file-picker issues were recovered before completing affected checks; initial observations are preserved separately. Browser zoom and keyboard navigation made table controls reachable. For RBAC-22, Safari Web Inspector was unavailable, so a local HTTP client privately obtained a fresh S1-only token through routine login instead of copying browser storage. The valid creation payload returned the expected 403; credentials were cleared. This procedure adaptation is disclosed, not a new authentication case. UI-only size/deadline checks do not establish server enforcement. No genuine defect report needs preparation for Member 4.
