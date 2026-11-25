# 3.8 — Defect Tracking and Complete Bug Lifecycle

**Current status: not demonstrated.** Need one genuine confirmed defect, a GitHub Issue and an actual approved fix.

## Prepared intake: QA-M4-001

`issues/QA-M4-001-local-api-port-default-mismatch.md` is an evidence-backed **draft**, not a GitHub Issue yet. First perform its local isolated-runtime reproduction. If it occurs, submit the sanitized issue body, assign the approved developer, and use the lifecycle table below. Do not claim “New” before the issue exists or “Verified” before independently retesting a linked fix.

## Defect tracking responsibilities

Member 4 collects reproducible defects from all members, triages severity and priority separately, ensures evidence is attached, and owns GitHub issue labels/comments and final retesting. The original tester or assigned developer may implement and verify a fix; Member 4 must document independently reproducible steps.

Defect ID convention: `QA-M4-001`, `QA-M4-002`, ... assigned sequentially **only for genuine confirmed issues**.

## Severity vs priority (example guidelines, not a finding)

| Severity (impact) | Example impact | Priority (urgency) |
|---|---|---|
| Critical | Unauthorized mutation of another user's academic records | Usually P0/P1 after team triage |
| Major | Essential submission workflow consistently fails | Usually P1 |
| Minor | Non-critical UI action has a workaround | Usually P2 |
| Trivial | Cosmetic issue | Usually P3 |

Triage according to observed business impact and team policy; not every security symptom is automatically a confirmed vulnerability.

## Required lifecycle evidence (single confirmed defect)

| Stage | What must actually happen | Link / screenshot |
|---|---|---|
| New | Member 4 opens issue with reproducible expected vs actual, synthetic environment and evidence | NOT DONE |
| Assigned | Team assigns issue to Member 2 / approved developer; add issue label or comment | NOT DONE |
| Fixed | Approved developer links real fix commit / PR | NOT DONE |
| Verified | Member 4 reruns same steps plus relevant regression and attaches post-fix evidence | NOT DONE |
| Closed | Close issue **only after** successful verification, leaving audit trail | NOT DONE |

Suggested labels (use only if available in repository): `bug`, `qa`, `severity:major`, `status:new`, `status:assigned`, `status:fixed`, `status:verified`. GitHub's built-in Open/Closed status alone does not show every stage; use issue timeline comments or custom labels.

## Member 2 coordination: genuine TDD-based bug lifecycle

1. Member 2 finds a missing behavior/defect and sends Member 4 a failing automated test + expected behavior.
2. Member 4 reproduces it and creates the issue (New).
3. Team approves the minimal application source change; assign the responsible developer (Assigned).
4. Member 2 captures Red and Green evidence; developer commits linked fix (Fixed).
5. Member 4 retests independently; capture sanitized post-fix result (Verified).
6. Close issue after confirming regression status (Closed).

**Do not** label a test that never failed as the Red stage. Do not fake issue comments or passing screenshot.

## Lifecycle case to fill after real work

- Defect ID / GitHub Issue URL: NOT AVAILABLE
- Reported by: PENDING
- Real defect evidence: NOT CAPTURED
- Assignee & date: NOT ASSIGNED
- Fix commit/PR: NOT AVAILABLE
- Regression tests: NOT RUN
- Verified by / date: NOT VERIFIED
- Closing evidence: NOT AVAILABLE

## Group defect intake (fill as issues arrive)

| Source member | Defect ID | Summary | Reproduced? | Issue URL | State |
|---|---|---|---|---|---|
| Member 1 | — | — | — | — | NO REPORT RECEIVED |
| Member 2 | — | — | — | — | NO REPORT RECEIVED |
| Member 3 | — | — | — | — | NO REPORT RECEIVED |
| Member 4 | — | — | — | — | NOT TESTED |

**Note:** `NO REPORT RECEIVED` means no evidence was supplied to this package, not that the other members found zero defects.
