# EC4206 — LabTrack QA / Member 4

**Scope:** Section 3.7 (performance, security, usability), 3.8 (defect tracking, root cause, lifecycle), 3.10 (Agile / DevOps reflection).

**Status:** The corrected local performance test was executed on 25 November 2026; see `01-performance-testing.md` for results and limitations. Browser usability and manual security checks remain unexecuted. Do not treat expected statuses or templates as actual test results.

## Ownership and repository placement

Copy this directory to `qa/member4/` inside the real LabTrack repository. All files in this package are confined to that directory. Do not touch application source, existing tests, package files, `.github/workflows/`, `sonar-project.properties` or other members' folders.

Use a feature branch:

```bash
git switch main
git pull origin main
git switch -c qa/member-4
# Copy qa/member4/ into your checkout.
git status --short
git add qa/member4/
git commit -m "Add performance, security and defect testing reports"
git push -u origin qa/member-4
```

Review output and scrub screenshots/logs of credentials, bearer tokens, personally identifying records, URLs containing secrets and production data before commit. Never generate or assert fictitious screenshots, defects or performance metrics.

## Before any application test: blockers / safety gates

1. The checked-in backend exposes `GET /api/health`, authenticated `GET /api/assignments`, and lecturer-only assignment writes. Confirm the locally running build still matches these routes and record the commit.
2. Set up a **separate, disposable** local MongoDB database seeded only with synthetic lecturers, students and assignments. Confirm the actual backend MongoDB URI points to that database. Never bypass an existing environment guard. Do not run against a production or shared database.
3. Confirm frontend and backend start and that the relevant API operations work with authorized credentials.
4. Confirm you are permitted to run 10, 25 and 50 virtual-user tests against your **own local** QA server. Account for local CPU and MongoDB load.
5. Install Apache JMeter with compatible Java; install Postman for manual API requests. Verify `jmeter -v` and `java -version`.
6. For CLI helpers in this package, explicitly acknowledge the isolated environment with `LABTRACK_QA_ISOLATED_CONFIRMED=YES`; this is an operator confirmation, not an automatic database-safety verification. CLI tools refuse a non-loopback target.

## Deliverable index

| File | Purpose | Current execution state |
|---|---|---|
| `jmeter/labtrack-load.jmx` | Reusable JMeter plan, parameterized for 10/25/50 users | Executed locally after assertion correction |
| `jmeter/run-load-tests.sh` | Local-only CLI runner for three scenarios | Executed against isolated local QA backend |
| `jmeter/summarize_jtl.py` | Computes response statistics from genuine JTL rows | Used for recorded results |
| `01-performance-testing.md` | Load test protocol and actual results | Executed; screenshots pending |
| `02-security-testing.md` | OWASP-aligned role and authentication tests | NOT RUN |
| `03-usability-testing.md` | Frontend usability checklist | NOT RUN |
| `04-root-cause-analysis.md` | RCA method and confirmed-defect worksheets | NO CONFIRMED DEFECTS YET |
| `05-defect-lifecycle.md` | GitHub issue workflow and lifecycle evidence | NO VERIFIED LIFECYCLE YET |
| `06-reflection.md` | Evidence-aware reflection draft | Updated with local JMeter experience |
| `templates/github-issue.md` | Reproducible defect issue description | TEMPLATE |
| `evidence/README.md` | Evidence naming, privacy and traceability | NO EVIDENCE CAPTURED |

## Quick start (after verifying app routes)

```bash
cd qa/member4
export LABTRACK_QA_ISOLATED_CONFIRMED=YES
export QA_PORT=5002                  # project documentation's explicit local alignment port
export QA_TARGET_PATH=/api/assignments # authenticated, read-only application route
export QA_EXPECT_STATUS=200          # replace if your verified API responds differently
export QA_BODY_REGEX='(?s).+'        # replace with a meaningful stable body regex
# For protected routes only, set an ephemeral student or lecturer QA token:
# read -rs LABTRACK_QA_TOKEN; export LABTRACK_QA_TOKEN; echo
bash jmeter/run-load-tests.sh
```

The script saves genuine `.jtl` files and HTML dashboards in `jmeter/results/<UTC timestamp>/` and a CSV summary for your report. It **will fail** without JMeter or a reachable local backend. For authenticated targets, obtain a test token from an authorized local login and never commit it. A shared read-only route is preferable to a mutation endpoint for load generation.

## Team coordination

- Member 2: Provide any reproducible defect found by automated/unit/BDD testing to Member 4, with failing test output and exact build/commit.
- Member 3: Provide actual API route/methods and verified isolated local setup; forward CI/API defects with evidence. Member 3 owns workflows and SonarQube configuration.
- Member 4: Create GitHub Issues for **confirmed** defects only; link a genuine Member 2 fix and retest it for the bug-lifecycle demonstration.
- Pull requests merge into `main` only after review.

## Source-inspection notes (not runtime results)

The JMX loaded in JMeter and the corrected plan completed the local run documented in `01-performance-testing.md`. Backend source defaults to port `5001`, while `PROJECT_DOCUMENTATION.md` directs local setup to explicitly set `PORT=5002`, matching the frontend source fallback. The isolated test used port `5003`.
