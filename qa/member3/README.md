# LabTrack QA — Member 3

## 3.6 — Automated testing and CI

GitHub Actions passed on `qa/member-3` at commit `bcbd930`. The workflow
ran the backend and frontend tests, frontend lint and build, and the Newman
API collection.

The Windows backend run had 134 passing tests and one failure. The failing
assertion expected a forward slash in a stored file path, while Windows
returned a backslash. The Ubuntu CI run passed.

- [Passing GitHub Actions run](https://github.com/Sanjith-ux/AutoGrader-QA/actions/runs/45628820732)
- [GitHub Actions screenshot](evidence/github-actions-passed.png)

## 3.9 — SonarQube analysis

| Measure | Result |
|---|---|
| Scanned commit | [Commit you scanned] |
| Quality gate | Passed |
| Overall coverage | 59.6% |
| Duplication | 3.9% |
| Reliability issues | 60 |
| Maintainability issues | 214 |
| Technical debt (remediation effort) | [Value from Measures] |
| Exact lines of code | [Value from Measures → Size] |
| Confirmed defect density | Pending defect triage |

Defect density = confirmed defects ÷ (lines of code ÷ 1,000).

- [SonarQube overview](evidence/sonarqube-overview.png)
- [Maintainability measures](evidence/sonarqube-maintainability.png)
- [Lines of code](evidence/sonarqube-size.png)

### Proposed improvements

1. Separate data loading from rendering on the assignment details page.
   Add tests for viewing an assignment and displaying submission errors.
2. Simplify the decision checks in `changeWithdrawal` and rerun the
   withdrawal and restoration regression tests.
3. Define the expected submission and audit data for the withdrawal
   components. Test how the UI handles missing optional metadata.
   