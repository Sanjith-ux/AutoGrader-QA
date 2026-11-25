# 3.1 Introduction & Test Planning (LO-1)

**Assignment:** EC4206 – Software Testing and Quality Assurance\
**Project:** LabTrack – AutoGrader & Lab Submission Portal\
**Prepared by:** Member 1 · **Branch:** `qa/member-1`\
**Planning baseline:** commit `8660e35`, inspected on 25 November 2026

**Status:** Planning baseline retained from repository inspection. The activities below describe the proposed scope, not a claim that every planned activity was executed. The selected Section 3.2 manual catalogue (25 Passed) and separate Section 3.3 black-box checks (52 Passed) are now complete; [the execution summary](10-test-execution-summary.md) records their evidence and remaining coverage limits. Historical project test totals are not results of this assignment.

## 1. Project introduction

LabTrack is a university laboratory coursework portal with Student and Lecturer workspaces. Lecturers manage assignments and lab sessions, review student submissions and publish marks and feedback. Students view published assignments, upload work, inspect submission history and access published results. The application uses a React/Vite frontend, an Express API and MongoDB through Mongoose. Submission metadata is stored in MongoDB, while uploaded files are stored privately on disk.

The name “AutoGrader” refers to automatic checks of file requirements, size, format and submission timing. The implemented system does not execute student programs, assess academic content or calculate lecturer marks automatically. Attendance, medical-request pages and dashboard overview content include demonstrations rather than complete persistent workflows.

## 2. Purpose of testing

Testing will assess whether the implemented coursework workflow behaves consistently for students and lecturers and protects assessment records and files. It will identify defects and provide reproducible evidence for the group report. This is a coursework evaluation of the current application, not a production-readiness certification.

## 3. Testing objectives

- Check that implemented workflows produce the expected records, visible information and error messages.
- Assess input validation at the frontend and API, including invalid types, missing values and boundary values.
- Check authentication, role restrictions and ownership so one user cannot access or change another user's protected work.
- Check that repeated submissions, reviews, withdrawals and assignment changes preserve the correct history and requirement snapshots.
- Assess understandable feedback, basic keyboard operation and common failure handling.
- Record expected and actual outcomes separately, report defects with evidence and repeat affected checks after any separately approved fixes.

## 4. Software under test

The test boundary includes browser pages, API requests, server-side validation, MongoDB records and protected submission storage. The principal API groups are `/api/auth`, `/api/assignments`, `/api/submissions` and `/api/lab-sessions`. The four collections are `users`, `assignments`, `submissions` and `labsessions`.

Testing will use the verified Member 1 environment: frontend `http://127.0.0.1:5173`, backend `http://127.0.0.1:5002/api`, database `labtrack_qa_member1` on `127.0.0.1:27028`, and isolated uploads under `qa/member1/runtime/submissions/`. Versions, startup commands and completed setup checks are recorded in [03-test-environment.md](03-test-environment.md); they are not repeated as new execution evidence here.

Source references used to establish the scope are:

| Reference | Planning use |
| --- | --- |
| [Root README](../../README.md), [frontend README](../../FrontEnd/README.md), [backend README](../../backend/README.md) | Project overview and documented workflows; checked against current code |
| [PROJECT_DOCUMENTATION.md](../../PROJECT_DOCUMENTATION.md), especially sections 3–10 | Persistence boundaries, business rules, architecture and known limitations |
| [Frontend routes](../../FrontEnd/src/App.jsx), [pages](../../FrontEnd/src/pages/), [API adapters](../../FrontEnd/src/api/) and [authentication](../../FrontEnd/src/auth/) | Available screens, client validation, session handling and API integration |
| [Backend routes](../../backend/src/routes/), [controllers](../../backend/src/controllers/) and [models](../../backend/src/models/) | Endpoints, permissions, validation, state changes and data relationships |
| [File service](../../backend/src/services/submissionFiles.js) and [middleware](../../backend/src/middleware/) | Upload limits, compliance, authorization, rate limits and error handling |
| [Backend tests](../../backend/test/), [test safeguards](../../backend/testing/context.js) and [frontend tests](../../FrontEnd/test/) | Existing checks available for later regression testing; not executed for this plan |

Where documentation conflicts with code, current implementation defines the observed baseline. For example, the frontend README calls submissions placeholders, but current pages and API routes persist submissions. The backend README also omits eligible student withdrawal. These discrepancies should be recorded rather than treated as missing functionality.

## 5. In-scope functionality

| Module | Planned coverage and important rules |
| --- | --- |
| Accounts and sessions | Student/Lecturer registration, duplicate email handling, login, `/auth/me`, cached-session restoration, logout and protected navigation. Registration limits include names of 2–100 characters, valid emails up to 254 characters, and passwords of at least 8 characters and at most 72 bytes. Check missing, invalid and expired tokens, stored-role enforcement and implemented rate limiting. Logout clears the browser session; server-side token revocation is not implemented. |
| Assignment management | Lecturer create/read/update, publish, close and permitted deletion; owner restrictions; student visibility of Published assignments; implemented filters, search and sorting. Check duplicate lecturer/module/title combinations, forbidden return from Published/Closed to Draft, and deletion blocked by any submission history or upload reservation. |
| Assignment validation | Required fields; title ≤150, module ≤100 and description ≤5,000 characters; deadline years 2000–2100; integer total marks 1–1,000; 1–20 required attachment labels; integer maximum file size 1–100 MB; allowed formats PDF, DOCX, JPG, PNG and ZIP. |
| Uploads and compliance | Student uploads to Published assignments, multiple attempts, file downloads and own history. Check at most 20 files, per-file size limits, extension/content mismatch, multipart labels, archive checks and deadline enforcement. Missing required labels and permitted late work are saved with failed compliance checks; prohibited late work and invalid formats/sizes are rejected. Check requirement snapshots and cleanup of unsuccessful uploads. |
| Marks and feedback | Owner lecturer draft/published reviews, marks from zero to the saved maximum, feedback ≤5,000 characters, draft privacy and updates. Check attempt-specific results, preservation of earlier published grades after a newer pending attempt, and summaries based on the latest active graded attempt per assignment. |
| Withdrawal and restoration | Student withdrawal only for an own active, unreviewed attempt strictly before the current deadline, with no marks or review timestamp. Owner lecturer withdrawal/restoration, reasons of 5–1,000 trimmed characters, repeated-action conflicts and retained audit history/files. Check that withdrawn attempts cannot be graded and do not contribute to active grade summaries. Students cannot restore attempts. |
| Lab scheduling | Authenticated session lists/details; lecturer creation, owner-only updates/deletion, cancellation and status filters. Check required fields, positive integer capacity, date/time formats, end time after start time, instructions and safety notes. Both roles can read the session list; course enrollment filtering is not implemented. |
| Shared behaviour | Loading/empty/error states, confirmations, authorization failures, malformed input and identifiers, API health, CORS and security headers. Planned persistence/reconnection checks and selected request-race checks will use isolated fixtures only. |

Highest priority is given to unauthorized access, draft-mark disclosure, record/file loss, grading errors and deadline rules. Valid and invalid core workflows come next, followed by presentation and convenience behaviour.

## 6. Out-of-scope functionality

- Persistent attendance recording, medical-certificate submission/approval and live dashboard totals: current interfaces use static or in-memory data without corresponding persistent APIs.
- Program execution, automatic academic grading, plagiarism detection and antivirus scanning: these are not implemented.
- Password recovery, email verification, lecturer approval, administrator functions, enrollment management and live notifications: no complete workflow is implemented.
- Production deployment, external university integration, exhaustive penetration testing, large-scale load testing, disaster recovery and formal accessibility certification.
- Development/shared databases, real student data, changes to other members' work and implementation of new features. Navigation may reveal demo pages, but their temporary values will not be assessed as persistent records.

## 7. Testing approach and techniques

Testing will combine static review with risk-based dynamic testing. Browser checks will assess user workflows, while direct API checks will assess rules that frontend controls could otherwise hide. Expected outcomes will be derived from source rules and documented user needs; unclear requirements will be raised for team agreement rather than assumed correct merely because code implements them.

| Technique | Planned application |
| --- | --- |
| Equivalence partitioning | Valid/invalid account fields, roles, identifiers, file formats and payload types |
| Boundary value analysis | Text lengths, marks, capacity, file sizes/counts and times before/at/after deadlines; distinguish upload acceptance at the deadline from strictly-before student withdrawal |
| Decision tables | Role × ownership × assignment/review/withdrawal state, plus deadline and late-submission policy |
| State-transition testing | Draft/Published/Closed assignments; Awaiting Review/Draft/Graded reviews; active/withdrawn attempts |
| Integration and end-to-end testing | Lecturer publication → student upload → lecturer review → student result; verify records and authorized downloads |
| Exploratory and regression testing | Error recovery, misleading messages, keyboard use and layout; rerun existing relevant checks and affected workflows after approved changes |

Later test records should identify the feature, preconditions, synthetic inputs, expected result, actual result, status and evidence. Defects should include reproduction steps, severity and environment. No detailed test cases or execution records are created in this section.

## 8. Testing resources and tools

Resources will include four group members, the verified local environment, synthetic student/lecturer accounts, separate owners for permission checks and safe sample documents. Browser developer tools, curl or equivalent API requests, MongoDB read-only inspection, service logs and screenshots will support evidence collection. VS Code and Git will support review and version tracking without changing the baseline during execution.

Existing Node test runners (`npm test` in each package), frontend ESLint and Vite build scripts are available for planned checks; no additional framework is required. Browser observations must be recorded separately from utility-unit results. The backend integration suite requires a distinct database ending in `_test`, such as `labtrack_qa_member1_test`, and private temporary uploads. Provisioning that test context is future work; do not substitute the interactive QA database or development database. Store only sanitized evidence under the responsible member's evidence folder.

## 9. Four-member team responsibilities

The following is a proposed allocation for team agreement, not a claim about other members' assigned work or completed deliverables.

| Member | Proposed responsibility |
| --- | --- |
| Member 1 | Maintain introduction, scope and test plan; reference verified environment; coordinate traceability and review of the final evidence summary |
| Member 2 | Lead account/session, role/ownership and assignment validation/workflow testing |
| Member 3 | Lead uploads, compliance, attempt history, protected downloads and withdrawal/restoration testing |
| Member 4 | Lead grading/privacy, lab scheduling and shared UI/error-handling checks; coordinate regression results |

Each member will record their own outcomes and defects. Cross-module workflows will be reviewed by a second member, and the team will agree severity, unresolved risks and final conclusions. Member 1's local environment does not establish that the other members' environments are configured.

## 10. Testing schedule

This is a proposed five-session schedule beginning after plan approval. Calendar dates and task allocation must be agreed with the team and adjusted to the submission deadline, which has not been supplied.

| Session | Planned activity | Expected output |
| --- | --- | --- |
| 1 | Review scope, responsibilities, expected outcomes and entry criteria | Agreed plan and priority list |
| 2 | Design cases/data and review boundary, permission and state coverage | Reviewed cases and synthetic fixtures |
| 3 | Execute priority API and browser workflows | Recorded outcomes, evidence and defect reports |
| 4 | Complete remaining scope, retest approved fixes and run regression | Updated defect status and regression evidence |
| 5 | Review exit criteria and consolidate findings | Test summary, limitations and team sign-off |

At the planning baseline, repository inspection and environment setup were completed preparation activities and Sessions 1–5 were proposed. Subsequent selected execution is recorded in the execution summary; team allocation, peer review and sign-off remain separate. No implementation fixes are authorized by this plan.

## 11. ISO 25010 quality characteristics and their application to LabTrack

This plan explicitly uses the eight-characteristic product-quality model in [ISO/IEC 25010:2011](https://committee.iso.org/standard/35733.html) as its assessment framework. A newer [ISO/IEC 25010:2023](https://www.iso.org/standard/78176.html) model has nine characteristics; the two editions are not mixed here. These are selected testing targets, not a claim of ISO certification.

| Characteristic | Application and planned evidence |
| --- | --- |
| Functional suitability | Workflow outcomes, validation and grade calculations compared with agreed expectations |
| Reliability | Persistence, rejected-upload cleanup and controlled failure/reconnection behaviour |
| Security | Role/owner isolation, draft privacy, protected downloads and token handling |
| Usability | Clear errors, confirmations, status labels and basic keyboard navigation |
| Performance efficiency | Observe local response/upload times; no load or SLA claim without agreed thresholds |
| Compatibility | Browser/API exchange, CORS and supported file handling |
| Maintainability | Review separation of validation logic and availability of relevant repeatable checks |
| Portability | Assess restart instructions on the verified machine; cross-platform assurance remains excluded |

Functional suitability, security and reliability receive the highest priority. Browser compatibility observations will identify the browser/version actually used and will not imply coverage of untested browsers.

## 12. Verification and validation activities

**Verification** asks whether the software and test work products conform to specified rules. Planned activities include reviewing schemas/controllers against documentation, checking frontend/API field mappings, peer-reviewing planned cases and using existing unit, integration, lint and build checks. Verification is not limited to static review.

**Validation** asks whether the application supports intended student and lecturer tasks. Planned role-based browser walkthroughs will assess publication, submission, review and access to results, including understandable feedback when actions are denied. Group members will act as synthetic users; this does not replace acceptance by real university stakeholders.

At the planning baseline, completed work was limited to source/document inspection and environment/connectivity checks. Subsequent manual and black-box validation is recorded in the execution summary. Neither the planning work nor the selected passes establishes full stakeholder acceptance.

## 13. Test entry and exit criteria

**Entry criteria:** the team has agreed scope and expected outcomes; the baseline is identified; QA services and isolation are rechecked against the environment record; synthetic accounts/files and reviewed cases are ready; responsibilities and evidence locations are agreed. Automated integration testing additionally requires its separate safe test database. An unavailable service or uncertain database target blocks dependent execution.

**Exit criteria:** all agreed in-scope cases are executed or explicitly recorded as blocked/not run with reasons; every highest-priority permission, privacy, history and grading check passes; no unresolved critical/high-severity defect permits unauthorized access, exposes draft results, loses records/files or produces incorrect marks. Approved fixes have relevant retest/regression evidence. Remaining defects, omissions and risks are documented and accepted by the team. Failure to meet a criterion is reported as incomplete testing, not a pass.

## 14. Testing risks and limitations

- Documentation is partly outdated, so scope and expected results require source review and team agreement. Existing historical success totals must not be reused as current evidence.
- Lab-session date/time validation is largely format-based, and no dedicated lab-session test file was found. Invalid calendar/time values need attention; room conflicts and enrollment constraints have no established implemented rule.
- Server and browser clocks influence deadline behaviour. Later checks must record time zone and actual timestamps rather than rely on visual timing alone.
- Upload metadata and file bytes use different stores. A process crash may leave unreferenced files or conservative upload reservations; automatic crash recovery is not implemented. Disruptive checks require a disposable isolated context.
- Public lecturer registration, browser-local token storage and process-local rate limits limit production assurance. The existing backend listens on all interfaces; CORS is not a network firewall.
- Local timing and browser observations cannot establish scalability, cross-platform support or full accessibility. No numerical performance requirement or stakeholder acceptance criteria have been supplied.
- Four-member coordination, limited time and a shared code baseline can reduce coverage. Confirm allocation, use isolated data, record revisions and report blocked checks transparently. No application or database configuration change is part of this deliverable.
