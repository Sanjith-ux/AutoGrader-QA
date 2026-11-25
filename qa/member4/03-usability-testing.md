# 3.7 — Usability Testing Checklist

**Current status: NOT EXECUTED.** Test with synthetic student and lecturer accounts on a local QA database. Record actual browser/device, viewport and date.

For each item, record `PASS`, `FAIL` or `N/A`, what you observed, and a genuine sanitized screenshot reference. **All rows below are untested; checkboxes are not evidence.**

| ID | Role / view | Check | Expected usability behavior | Actual finding / evidence | Status |
|---|---|---|---|---|---|
| U-01 | Student | Navigation | Key pages (dashboard, assignments, submissions) discoverable with clear labels | — | NOT RUN |
| U-02 | Lecturer | Navigation | Lecturer-specific pages obvious; back navigation usable | — | NOT RUN |
| U-03 | Both | Form labels | Inputs have visible associated labels and useful placeholders | — | NOT RUN |
| U-04 | Student | Required fields | Empty required assignment submission prompts understandable feedback | — | NOT RUN |
| U-05 | Both | Validation messages | Invalid email/password/input gets specific readable errors; focus not lost | — | NOT RUN |
| U-06 | Student | Submission feedback | Successful submission shows confirmation/reference; errors do not look successful | — | NOT RUN |
| U-07 | Lecturer | Confirmation dialogs | Destructive action warns what will change and permits cancellation | — | NOT RUN |
| U-08 | Both | Mobile layout at 375 × 812 | No clipped controls or unintended horizontal scroll | — | NOT RUN |
| U-09 | Both | Tablet layout at 768 × 1024 | Forms, menus and tables remain operable | — | NOT RUN |
| U-10 | Both | Desktop layout at 1366 × 768 | Core workflows work without overlap or inaccessible controls | — | NOT RUN |
| U-11 | Both | Keyboard | Tab order, Enter/Space and focus visibility are usable | — | NOT RUN |
| U-12 | Both | Accessibility | Error text, labels and contrast are understandable (not formal WCAG certification) | — | NOT RUN |
| U-13 | Student | File selection | Supported file types and size limits clearly explained and enforced | — | NOT RUN |
| U-14 | Student | Duplicate submission | Behavior is explicit and avoids accidental duplicate records | — | NOT RUN |
| U-15 | Both | Waiting feedback | Slow API call displays pending state and prevents double clicks | — | NOT RUN |

## Test protocol

1. Record the real deployed URL (`localhost`), commit, browser version and device/viewport.
2. Perform actual student and lecturer workflows with synthetic records, without modifying real academic data.
3. For each failure note the exact click sequence, expected result, actual result, reproducibility, severity and sanitized screenshot.
4. Create a defect issue **only after confirming** a reproducible deviation from requirements. A subjective suggestion can be documented as an enhancement rather than a bug.
5. Retest after any team-approved fixes.

## Evidence capture sequence

For each completed row, name files `evidence/U-XX-<viewport>-<date>.png` and capture: (1) the initial state, (2) the action or invalid input, and (3) the resulting message/dialog/layout. For responsive checks, use browser device emulation at the exact dimensions in the table and include the browser's viewport indicator. Mask names, emails, tokens and files before saving. This remains a capture protocol, not evidence that the checks have passed.

## Summary (fill from completed checklist)

- Items tested: NOT RUN
- Pass / fail / N/A: NOT RECORDED
- High-priority usability defects: NOT IDENTIFIED
- Recommended improvements tied to real observations: PENDING
- Screenshot links: NOT CAPTURED
