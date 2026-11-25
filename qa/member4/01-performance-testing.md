# 3.7 — Performance Testing (Apache JMeter)

**Project:** LabTrack – AutoGrader & Lab Submission Portal
**Tester:** Member 4
**Execution status:** Executed locally on 25 November 2026; all 425 samples in the corrected run passed the configured assertions. Screenshots remain to be captured.

## Objective

Evaluate how a *verified, read-only* application API endpoint behaves as the number of simulated users increases. Begin with a health endpoint in a manual single-request check, then use a meaningful endpoint (e.g. real authenticated assignment-list GET **only if the repository confirms that endpoint**). Do not load-test a creation/deletion endpoint that would accumulate state.

## Environment log (complete after setup)

| Field | Actual, verified value |
|---|---|
| Git commit / branch | `8660e35` / `qa/member-4` (working tree included Member 4 QA artifacts) |
| Test date/time and timezone | 25 November 2026, approximately 19:42–19:43 Asia/Colombo |
| JMeter version / Java version | Apache JMeter 5.6.3 / OpenJDK 21.0.12.1 |
| Node.js version | 26.10.0 |
| Local backend and port | Separate local backend, `127.0.0.1:5003` |
| MongoDB QA database name (no credentials) | `labtrack_member4_test` on `127.0.0.1:27028` |
| Evidence of database isolation / safety guard | Separate MongoDB process with fresh temporary data directory; separate loopback-only backend explicitly configured to use that database. Operator verified setup; the runner's confirmation flag itself does not verify isolation. |
| Source-inspected health endpoint and expected response | `GET /api/health` → `200`, `{ "status": "ok" }` (confirm at runtime) |
| Source-inspected GET application endpoint and expected status/body | `GET /api/assignments` with valid student/lecturer bearer token → `200`, JSON object containing an `assignments` array (confirm at runtime) |
| Authentication role / token source (do **not** include token) | One synthetic student account, registered and logged in against the isolated QA backend; token reused by all virtual users |
| Host hardware / CPU / memory | TODO |

## Test plan design

- File: `jmeter/labtrack-load.jmx`
- One standard Thread Group parameterized by CLI property so each run is separately isolated.
- **10 / 25 / 50 virtual users**, **10-second ramp-up**, **5 loops/user**.
- Planned HTTP samples: 50 / 125 / 250. These are **test configuration totals, not observed results**.
- HTTP Request Defaults supply protocol `http`, loopback host and local backend port.
- A GET sampler targets the verified application API path supplied as `QA_TARGET_PATH`.
- JSR223 PreProcessor optionally adds `Authorization: Bearer ...` from ephemeral `LABTRACK_QA_TOKEN`, never embedding it in the JMX or invocation.
- Response Assertions check a configured expected HTTP status and a required, nonempty body pattern (strengthen `QA_BODY_REGEX` to an API-specific, stable response field).
- Summary Report and Aggregate Report listeners are included for GUI inspection; CLI also creates a JTL and HTML dashboard.
- Connection timeout: 5 seconds; response timeout: 15 seconds. A virtual-user setting with ramp-up **does not guarantee all users are active simultaneously**.

## Execution protocol

1. Confirm the backend connects only to a **synthetic, isolated local MongoDB**; do not disable existing safety protections. The project documentation specifies `PORT=5002` to align with the frontend. Its backend fallback is `5001`; use the actual running port.
2. Start backend locally. Verify a health request and authorized application GET request return expected responses. If the endpoint requires authentication, obtain a short-lived synthetic test account token.
3. Run `jmeter -v` and `java -version`.
4. Enter the verified path and expected values, and execute:

```bash
cd qa/member4
export LABTRACK_QA_ISOLATED_CONFIRMED=YES
export QA_PORT=5002
export QA_TARGET_PATH=/api/assignments
export QA_EXPECT_STATUS=200
export QA_BODY_REGEX='(?s).+'
# Only if the GET route requires an auth token; do not paste it into reports:
# read -rs LABTRACK_QA_TOKEN; export LABTRACK_QA_TOKEN; echo
bash jmeter/run-load-tests.sh
unset LABTRACK_QA_TOKEN 2>/dev/null || true
```

5. Find `jmeter/results/<UTC timestamp>/run-10.jtl`, `run-25.jtl`, `run-50.jtl`, `metrics.csv` and `dashboard-*/index.html`. The script does **not** continue to a larger load level after a nonzero failure.
6. If JMeter process exits successfully but API assertions fail, label the run **FAILED** and investigate; exit code alone never proves assertion success.
7. If script fails, preserve the actual error and record blocker. Review JTL and log for secrets before sharing.
8. Capture real evidence: terminal command and summary, Summary/Aggregate Reports, HTTP responses, dashboard overview and backend/MongoDB isolation config with sensitive strings masked.

### Actual result table — fill ONLY from real JTL / dashboard

| Measure | 10 users | 25 users | 50 users |
|---|---|---|---|
| Total executed requests | 50 | 125 | 250 |
| Average response time (ms) | 3.00 | 2.42 | 2.34 |
| Minimum (ms) | 1 | 0 | 0 |
| Maximum (ms) | 14 | 11 | 12 |
| 95th percentile (ms) | 6 | 5 | 5 |
| Throughput (requests/sec) | 5.68 | 13.31 | 26.06 |
| Error rate (%) | 0.00 | 0.00 | 0.00 |
| Successful / failed samples | 50 / 0 | 125 / 0 | 250 / 0 |
| JTL / dashboard evidence | `run-10.jtl` / `dashboard-10` | `run-25.jtl` / `dashboard-25` | `run-50.jtl` / `dashboard-50` |

Source: `jmeter/results/20261125T141204Z/metrics.csv` and corresponding JTL files. Every recorded response was HTTP 200; JTL records sample success, not a separate count of individual assertion evaluations. Screenshots have not yet been captured.

**Metric definitions:** `mean`/`min`/`max` of JMeter `elapsed`; nearest-rank p95 over `elapsed`; throughput = sample count divided by elapsed wall-clock time from first start to last completion; errors = number of `success=false` samples ÷ total × 100. If a different JMeter report definition is used, state it. GUI listeners and JTL may differ due to filtering or scope: specify the source.

## Findings / interpretation — complete after tests

- All 425 requests succeeded under the configured assertions; observed p95 was 6, 5 and 5 ms respectively. This single short run shows no assertion failures; it does not establish a production capacity or a bottleneck.
- The initial run at `20261125T140330Z` received 401 responses. The isolated run at `20261125T141020Z` received 200 responses but failed because the original JMX used literal equality for regex patterns. The assertions were corrected and a one-request smoke test passed before the reported run. Preserve these runs as troubleshooting evidence, not application performance results.
- Limitations: single local machine and database, short bursts with 10-second ramp, one shared student token, a fresh synthetic database with no seeded assignments, and no sustained load. The body assertion checked only for a nonempty response; it did not validate the JSON schema. Zero-millisecond samples reflect timer resolution, not zero latency. Throughput includes the ramp and is not a capacity measurement. Repeat with representative synthetic records and a schema-specific assertion for a more meaningful assessment.

Capture and sanitize genuine terminal or dashboard screenshots before submission.
