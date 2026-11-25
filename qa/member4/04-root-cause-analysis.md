# 3.8 — Root Cause Analysis

**Current status: NO CONFIRMED DEFECT PROVIDED.** Do not invent vulnerable functions, file names or root causes. Create one or two case records using the template below **after** a reproducible GitHub Issue exists.

## Candidate awaiting runtime confirmation: QA-M4-001

The checked-in source shows a default-port mismatch: backend fallback `5001` (`backend/src/server.js`) versus frontend API fallback `5002` (`FrontEnd/src/api/config.js`). This is documented as a **draft** issue in `issues/QA-M4-001-local-api-port-default-mismatch.md`; it is not yet an RCA case or a confirmed defect because Member 4 has not run the isolated local reproduction. If reproduced, use that draft's source references as the initial fault chain, confirm the intended port policy with the owner, and only then complete Case A.

## Root cause investigation process

1. Reproduce an observed defect using a documented local environment and sanitized synthetic dataset.
2. Link the issue and preserve before-fix evidence (actual failing response, test output, screenshot or JTL).
3. Trace the real request/UI interaction through the application source: route → authorization / validation middleware → controller / service → database query (adjust to actual architecture).
4. Separate **observation** from **hypothesis**. Verify the root cause using code references, targeted logging in a local environment, or a reproducing test prepared with the responsible member.
5. Agree on minimal fix with the team; Member 4 does not modify application source.
6. After Member 2/approved developer's fix, repeat the exact reproduction and relevant regression tests.
7. Record prevention measures (test addition, review rule, monitoring) supported by the case.

## RCA case A (fill after confirmed issue)

| Field | Evidence |
|---|---|
| GitHub Issue | NOT CREATED |
| Defect ID / title | NOT CONFIRMED |
| Role, environment, commit | NOT RECORDED |
| Real reproduction steps | NOT RECORDED |
| Actual vs expected behavior | NOT RECORDED |
| Affected source file, function and lines | NOT INVESTIGATED |
| Verified underlying cause | NOT ESTABLISHED |
| Five-whys/fault chain | NOT ESTABLISHED |
| Corrective action (approved owner) | PENDING |
| Regression test and passing evidence | NOT RUN |
| Prevention and limitations | PENDING |

## RCA case B (optional)

| Field | Evidence |
|---|---|
| GitHub Issue | NOT CREATED |
| Reproduction / observed defect | NOT CONFIRMED |
| Confirmed underlying cause and files | NOT INVESTIGATED |
| Fix / verification / prevention | PENDING |

A missing issue is a **blocker to RCA**, not a basis for inventing a defect.
