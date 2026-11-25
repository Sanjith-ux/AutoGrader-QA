# Member 1 — Defect Findings for Member 4

**Reviewed runs:** manual `20261125T190120`; additional black-box `bb-20261125T131845`\
**Date:** 25 November 2026 (Asia/Colombo) · **Branch/commit:** `qa/member-1` / `8660e35a335e639e6fada4f434a3f3c468279ffd`

No genuine product defect was observed in the **25 original manual cases** or the **52 separate Section 3.3 checks**. These are separate catalogues, not a combined claim of exhaustive coverage. The [CSV](04-test-cases.csv) and [execution summary](10-test-execution-summary.md) contain the results and evidence references. No defect ID has been assigned, and no external message or defect report was sent to Member 4.

The continued 19 cases used Safari 27.0. Observed rejections of zero assignment marks, duplicate assignments, oversized/disguised uploads, late uploads, over-maximum review marks, deletion with history, unauthorized access and invalid lab times matched their expected outcomes. Failed compliance on accepted attempt B is intentional: its Supporting attachment label leaves Report missing. A's published zero grade and B's withdrawal/restoration audit remained intact.

Safari date fields needed complete AM/PM input. Native file-picker confirmation and coordinate actions intermittently failed; reopening the picker, list view, browser zoom and keyboard navigation recovered the required workflows. These tool/browser observations are not established application defects. The initial incomplete ASG-07 deadline observation is preserved in its JSON history, followed by a valid BASE retry. The initial SUB-13 picker screenshot is separate from the actual application size-rejection screenshot.

RBAC-22 used a fresh S1-only token obtained privately through local HTTP login because Safari's inspector shortcut was unavailable, rather than copying browser local storage. The valid assignment-creation payload returned the expected HTTP 403 and permission-denied body, and L1's exact-title search found no forbidden assignment. Temporary credentials were cleared. This is a disclosed procedure adaptation, not a product finding or an additional numbered authentication case.

The earlier temporary login block was expected rate-limiter behaviour. Known demo dashboard identities/totals are outside the selected persistent workflows and are not newly discovered defects.

**Member 4 handoff:** No genuine defect report requires preparation. Review the linked evidence through the normal team process. If a later discrepancy is observed, record its actual case/run, reproducible steps, expected/actual outcome, environment and sanitized evidence before assigning the team's real defect ID. No code fix or database cleanup was performed. Passing this sample does not certify all authorization endpoints, performance, concurrency, accessibility, recovery or production security.
