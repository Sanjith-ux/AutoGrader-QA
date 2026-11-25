# Member 1 — Manual Test Execution Guide

**EC4206 · LabTrack · Section 3.2 · Branch `qa/member-1`**

This guide accompanies [04-test-cases.csv](04-test-cases.csv), [02-stlc.md](02-stlc.md) and [01-test-plan.md](01-test-plan.md). It describes future execution only. Do not prepare fixtures, send requests or run the cases until execution is approved. No accounts, sample files, screenshots or results were created while writing this guide.

## 1. Confirm the environment and record a run

1. Follow [03-test-environment.md](03-test-environment.md) to check/start the existing QA services. Do not launch duplicates, change `.env` files or reset a database.
2. Confirm frontend `http://127.0.0.1:5173`, API `http://127.0.0.1:5002/api`, MongoDB `127.0.0.1:27028/labtrack_qa_member1`, and the isolated upload root `qa/member1/runtime/submissions/`. If isolation is uncertain, stop dependent testing.
3. Record branch/commit, date/time in Asia/Colombo, browser/version, tester and a unique alphanumeric **RUN** value, for example `20261125T1900`. Replace RUN in every fixture below with the same actual value; do not type the placeholder literally. A fresh run uses new names/emails instead of deleting old data.
4. Record **F** as a concrete local date/time at least seven days after starting the run; all MAIN uploads and student withdrawal must finish before F. Record **P** as yesterday at 12:00 local time, and **D** as a lab date at least seven days ahead. Use years within 2000–2100. Record the resolved values before execution; do not change the system clock. If the run reaches F, mark dependent cases Blocked and agree a new run rather than silently editing prerequisites.
5. Use separate browser profiles/windows for S1 and L1 if convenient. Tabs in the same profile share local storage, so otherwise explicitly Log out and sign in when switching roles. Refresh pages after another role changes data; the app does not provide live cross-session updates.

The environment record describes earlier checks and is not evidence that services are still running. Record any new readiness observations separately from functional case outcomes.

## 2. Required synthetic accounts

| Alias | Full name | Email after substituting RUN | Role | Creation |
| --- | --- | --- | --- | --- |
| S1 | QA Student RUN | `student.RUN@example.test` | Student | M1-AUTH-01 |
| L1 | QA Lecturer RUN | `lecturer.RUN@example.test` | Lecturer | M1-AUTH-02 |
| L2 | QA Other Lecturer RUN | `lecturer.other.RUN@example.test` | Lecturer | Prerequisite setup before M1-RBAC-23 |

Use `QaMember1!2026` as the password and confirmation for these disposable local accounts. This is synthetic test data, not an existing credential. Do not reuse it outside QA or save it in the browser password manager. `short.RUN@example.test` is an unused email for the rejected short-password case and should not be registered successfully.

Create L2 later through `/register`: select Lecturer, fill the L2 row, enter matching passwords and click Create account. Record this as fixture preparation, not another numbered case or an inferred pass. If a fixture cannot be created, record dependent cases as Blocked. Avoid repeated sign-in/registration attempts that could trigger the implemented rate limits.

For routine login, open `/`, select the account's actual role, enter its email/password and click Sign in. The app intentionally rejects a mismatch between the selected login role and the account's stored role.

## 3. Assignment, session and file data

### Assignment values

The **BASE** values below must all be filled, including Submission requirements, which the UI requires even though the API allows it to be optional.

| Field | BASE value |
| --- | --- |
| Assignment title | **MAIN:** `QA Main RUN` |
| Lab subject / module | `EC4206` |
| Description / instructions | `Synthetic QA report task` |
| Deadline | F, recorded as a concrete local date/time |
| Total marks | `100` |
| Submission requirements | `Upload a synthetic PDF and label it Report.` |
| Allowed file types | PDF only; uncheck any other selected types |
| Required files | `Report` |
| Maximum file size per file | `5 MB` |
| Allow late submissions | Unchecked; the new-assignment UI initially enables it, so explicitly disable it |

M1-ASG-07 uses title `QA Invalid Marks RUN` and total marks `0`. M1-ASG-09 changes MAIN's description to `Synthetic QA report task - revised`. M1-ASG-10 deliberately repeats MAIN's exact title/module under L1.

Before M1-SUB-16, prepare **OVERDUE** as L1 through Assignments → Create Assignment. Use BASE values but title `QA Overdue RUN`, deadline P, and late submissions unchecked; click Publish Assignment. It should remain Published with no attempts. Record its setup and identifier; preparation is not an extra test case. Do not change MAIN's deadline to create a late scenario.

For lab cases use **LAB** `QA Lab RUN`, module `EC4206`, date D, start `09:00`, end `10:00`, room `QA Lab`, capacity `20`, instructions `Bring synthetic report`, safety notes `Follow lab instructions`, status `Upcoming`.

### Required sample files

| File | Required content and size | Purpose |
| --- | --- | --- |
| `report-valid.pdf` | Valid synthetic PDF, under 5 MiB | Successful attempt A, download and late-block check |
| `report-second.pdf` | Separate filename containing a valid synthetic PDF, under 5 MiB | Resubmission B with an intentionally missing label |
| `report-oversize.pdf` | Valid PDF header; exactly 5,242,881 bytes | One byte above the configured 5 MiB limit |
| `report-fake.pdf` | Plain synthetic text with no PDF signature, despite its filename | Server-side content mismatch |

After approval, the following optional commands can prepare these files **from the repository root** without changing existing fixtures. They use the existing small synthetic PDF at `backend/test/fixtures/report.pdf`. The source fixture is a one-page PDF; a blank page is acceptable. Do not use personal documents.

```bash
python3 - <<'PY'
from pathlib import Path
source = Path('backend/test/fixtures/report.pdf').read_bytes()
folder = Path('qa/member1/runtime/fixtures')
folder.mkdir(parents=True, exist_ok=True)
samples = {
    'report-valid.pdf': source,
    'report-second.pdf': source,
    'report-oversize.pdf': source + b' ' * (5242881 - len(source)),
    'report-fake.pdf': b'Synthetic QA text. This is not a PDF.\n',
}
assert source.startswith(b'%PDF-') and len(source) < 5242880
for name, content in samples.items():
    target = folder / name
    if target.exists():
        assert target.read_bytes() == content, f'Different existing fixture: {target}'
    else:
        target.write_bytes(content)
    print(name, len(content), 'bytes')
PY
```

Open the valid PDF locally before testing to check the fixture itself. The oversized file is padded with whitespace for a size test; do not mistake a preview problem in a deliberately invalid fixture for an application defect. No sample files are generated by this documentation task.

## 4. Recommended execution order and dependencies

Use the numbered Test Steps and Expected Result in the CSV as the detailed procedure for each case. A case ID remains stable even when it is executed later than its position in the CSV.

1. Run **M1-AUTH-01 through M1-AUTH-06**. These create S1/L1 and check duplicates, a seven-character password, invalid login and the session lifecycle. After logout, protected navigation should return to login.
2. Run **M1-ASG-07 through M1-ASG-10** as directed. MAIN is created as Draft, edited and Published. Capture **MAIN_ID** from S1's `/student/assignments/<id>` URL when opening it. Keep the assignment Published and do not close/delete it.
3. Run **M1-SUB-12 through M1-SUB-15**, then prepare OVERDUE and run **M1-SUB-16**. SUB-12 creates **A**, the compliant attempt. SUB-15 creates the newer **B**, the missing-label attempt. Record their filenames, timestamps and, where visible in browser Network response data, submission `_id` values as **A_ID/B_ID**. Do not depend on list row order; newest attempts normally appear first. Do not expose request Authorization headers in evidence.
4. Run **M1-MARK-17 through M1-MARK-19 on A only**. Use L1's **Student Submissions → Review** panel, whose action is **Publish Feedback**. The separate Marks & Feedback page uses **Publish Review**; do not mix instructions from the two panels. Keep B unreviewed. Refresh S1 views when checking privacy/publication. S1's fresh run has only one graded assignment, making the expected average unambiguous.
5. Run **M1-WDR-20 on B**, then **M1-WDR-21** as L1. B must still be Awaiting Review, unmarked, active and before F. In the lecturer history selector use **Withdrawn submissions (audit)** to find withdrawn B and **Active submissions** after restoring it.
6. Run **M1-ASG-11 now**, after submission history exists. This is a deletion-refusal check on MAIN, not permission to clean up fixtures. If uploads did not succeed, do not attempt deletion; mark this case Blocked.
7. Run **M1-RBAC-22** using S1 and the limited API procedure below. Prepare L2, then run **M1-RBAC-23** using L2 and the recorded MAIN_ID. Return to L1 to confirm MAIN is unchanged.
8. Run **M1-LAB-24**, then **M1-LAB-25**. LAB must be created by L1 and retained after the invalid edit. Do not use Cancel/Delete for cleanup.

If an earlier case fails, record it and check dependent preconditions. Do not mark a later case Failed merely because its fixture is absent: mark it Blocked with the dependency ID. Independent cases may proceed. Do not silently repair application data, review B, or create substitute attempts; any approved recovery setup must be recorded. Keep all synthetic history; no resets or automated suites are part of this manual run.

## 5. Limited direct API check for M1-RBAC-22

This request is necessary because student route guards hide assignment creation. Browser redirection alone does not verify server authorization. Use an already available local Postman client or equivalent HTTP client; no new installation is required. Prefer local requests without cloud synchronization. All other designed cases can use the UI.

1. Sign in as S1 in the QA browser. First visit `/lecturer/assignments/create` and record the redirect to the student dashboard.
2. In browser Developer Tools → Application (or Storage) → Local Storage → `http://127.0.0.1:5173`, obtain `labtrack_token` privately. Never paste it into documentation, a shared workspace, a screenshot or a defect message. Do not obtain or use L1's token for this request.
3. Create a POST request to `http://127.0.0.1:5002/api/assignments`. Set Authorization to Bearer Token using S1's token, and Body → raw → JSON. Confirm the URL is local before sending. Use the following body, replacing RUN and F_ISO with the actual run suffix and F converted to an ISO timestamp with the correct offset, for example an execution-day-derived value ending `+05:30`:

```json
{
  "title": "QA Forbidden RUN",
  "module": "EC4206",
  "description": "Synthetic student authorization probe",
  "submissionRequirements": "Upload a synthetic PDF labelled Report.",
  "deadline": "F_ISO",
  "totalMarks": 100,
  "allowedFileTypes": ["PDF"],
  "requiredFiles": ["Report"],
  "maxFileSizeMB": 5,
  "lateSubmissionAllowed": false,
  "status": "Draft"
}
```

4. Send once. Expected response: HTTP **403**, with `You do not have permission to access this resource.` A 401 means the authentication prerequisite failed and does not establish successful role enforcement. A malformed-data response also does not establish the intended 403 check.
5. Capture only the local URL, HTTP method and response status/body, with credentials hidden. As L1, verify no `QA Forbidden RUN` assignment exists. Clear the temporary client token/request credentials when finished without sharing them. If the server unexpectedly creates a record, record the genuine defect and preserve it for investigation rather than deleting it.

HTTP status inspection in other cases is optional supporting evidence. For UI-blocked cases, do not bypass controls or claim the server rejected a request that was never sent.

## 6. Suggested screenshots

These are future filenames, not existing evidence. Use `qa/member1/evidence/RUN/` after approval and substitute the actual RUN. Capture enough context to identify the case, synthetic record, outcome and local URL. Add `-01`, `-02` or `-r2` for additional stages/retests instead of overwriting earlier evidence.

| Test Case ID | Suggested screenshot filename(s) |
| --- | --- |
| M1-AUTH-01 | `M1-AUTH-01-student-created.png` |
| M1-AUTH-02 | `M1-AUTH-02-lecturer-created.png` |
| M1-AUTH-03 | `M1-AUTH-03-duplicate-email.png` |
| M1-AUTH-04 | `M1-AUTH-04-short-password.png` |
| M1-AUTH-05 | `M1-AUTH-05-invalid-login.png` |
| M1-AUTH-06 | `M1-AUTH-06-restored-session.png`, `M1-AUTH-06-logged-out.png` |
| M1-ASG-07 | `M1-ASG-07-zero-total-marks.png` |
| M1-ASG-08 | `M1-ASG-08-draft-lecturer.png`, `M1-ASG-08-hidden-student.png` |
| M1-ASG-09 | `M1-ASG-09-published-details.png` |
| M1-ASG-10 | `M1-ASG-10-duplicate-assignment.png` |
| M1-ASG-11 | `M1-ASG-11-delete-refused.png`, `M1-ASG-11-history-retained.png` |
| M1-SUB-12 | `M1-SUB-12-attempt-A.png`, `M1-SUB-12-downloaded-pdf.png` |
| M1-SUB-13 | `M1-SUB-13-oversize-blocked.png` |
| M1-SUB-14 | `M1-SUB-14-content-mismatch.png` |
| M1-SUB-15 | `M1-SUB-15-missing-label.png`, `M1-SUB-15-two-attempts.png` |
| M1-SUB-16 | `M1-SUB-16-late-blocked.png` |
| M1-MARK-17 | `M1-MARK-17-lecturer-draft.png`, `M1-MARK-17-student-private.png` |
| M1-MARK-18 | `M1-MARK-18-over-maximum.png` |
| M1-MARK-19 | `M1-MARK-19-published-zero.png`, `M1-MARK-19-pending-B.png` |
| M1-WDR-20 | `M1-WDR-20-withdrawn-B.png` |
| M1-WDR-21 | `M1-WDR-21-restored-B-audit.png` |
| M1-RBAC-22 | `M1-RBAC-22-student-redirect.png`, `M1-RBAC-22-api-403.png` |
| M1-RBAC-23 | `M1-RBAC-23-other-owner-denied.png` |
| M1-LAB-24 | `M1-LAB-24-lecturer-session.png`, `M1-LAB-24-student-session.png` |
| M1-LAB-25 | `M1-LAB-25-invalid-end-time.png` |

An empty list screenshot alone is weak evidence of absence: record the exact filter, synthetic name, role and refresh in Actual Result. Supplement screenshots with observed counts, filenames or sanitized response details where required. Keep passwords, bearer tokens, unrelated browser tabs and any private records out of captures.

## 7. Recording results

After each approved execution, update the matching CSV row, preserving its ID, design fields and column structure:

1. **Actual Result:** Write what was observed, with RUN, timestamp, role, relevant fixture ID/filename, message/state and any HTTP status actually inspected. Do not copy Expected Result without checking it. For a multi-stage case, report each required stage.
2. **Status:** Use `Passed` only when every required expected outcome is observed; `Failed` for an observed product deviation; `Blocked` for an unmet prerequisite/environment problem; keep `Not Executed` for untouched cases.
3. **Evidence Reference:** Enter existing relative paths such as `evidence/20261125T1900/M1-SUB-12-attempt-A.png`; separate multiple references with semicolons. Missing evidence must not be replaced with a proposed filename presented as real.
4. **Defect ID:** Leave blank unless a genuine issue has been logged and its real ID is available. Do not invent a Member 4 ID. Record a pending report in Actual Result if necessary.
5. Preserve the original run when retesting. Record a later run/attempt and evidence separately according to the team's agreed record method; do not overwrite an earlier failure with an unexplained pass.

CSV contains commas in prose, so use a CSV-aware editor or quote affected fields correctly. It is UTF-8 with 13 columns. No results or evidence references are prefilled in the delivered catalogue.

## 8. Reporting genuine defects to Member 4

Only report defects actually observed during approved execution. First check the expected rule, correct role, run data, clock, selected attempt and service availability. A deliberately rejected input, an unimplemented feature excluded by the plan, or a failed setup prerequisite is not automatically an application defect.

Prepare a concise report for Member 4 containing:

- Related test case ID, RUN, date/time, tester, branch/commit and browser/version.
- Specific summary, module and proposed severity, with the observed impact.
- Preconditions, synthetic record IDs and exact steps to reproduce.
- Expected result compared with actual result, plus reproduction frequency.
- Existing sanitized screenshot/log references and any safe workaround.

Member 4 should confirm the issue, assign the team's actual defect ID and coordinate its lifecycle. Sharing or sending reports is future team work; this guide does not send messages, create a defect log or start section 3.3. Do not include tokens, secret configuration or real student data. No code fix, database cleanup or configuration change is authorized by test execution alone.

## 9. Sources and coverage limits

The existing test plan and environment record remain unchanged. Targeted checks used `FrontEnd/src/pages/RegisterPage.jsx`, `LoginPage.jsx`, `LecturerAssignmentFormPage.jsx`, `AssignmentDetailsPage.jsx`, `LecturerSubmissionsPage.jsx`, `MarksFeedbackPage.jsx`, `LecturerSchedulePage.jsx`, `auth/ProtectedRoute.jsx`, `components/SubmissionWithdrawalDialog.jsx`, and `api/submissions.js`. Backend expectations reuse the inspected authentication routes, assignment/submission/lab controllers, models and file service. The source-reference map in the test plan provides repository links.

The 25 cases sample the planned scope. They do not cover all authentication limits, file formats, exact accepted size boundaries, permitted late submissions, concurrent requests, every authorization endpoint, full accessibility or recovery after crashes. The two role-based cases complement workflow checks rather than certify the entire security model. Browser-blocked size/deadline checks are explicitly labelled as UI coverage. Fixture setup, browser/version recording, peer review and execution remain pending approval.
