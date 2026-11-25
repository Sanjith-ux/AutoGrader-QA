# 3.3 Decision Table Testing — Login

**EC4206 · LabTrack · Member 1 · Branch `qa/member-1` · Baseline `8660e35`**

Executed on 25 November 2026 (Asia/Colombo), run **`bb-20261125T131845`**. Evidence is in [the run directory](evidence/bb-20261125T131845/). The [environment evidence](evidence/bb-20261125T131845/environment.json) records readiness; the existing [environment report](03-test-environment.md) supplies startup/configuration details. The backend process was checked for the QA database and isolated upload overrides before execution. Only `labtrack_qa_member1` on `127.0.0.1:27028` was used.

At the end of this black-box run, the original Section 3.2 catalogue was **25 Not Executed**. It has since completed separately with **25 Passed** in manual run `20261125T190120`; see [the execution summary](10-test-execution-summary.md). The results below remain the additional Section 3.3 checks and are counted separately. Passwords and tokens are redacted from evidence; password representatives are described by type/length/byte count rather than published as working credentials.

## Conditions and action precedence

Authentication uses POST `/api/auth/login`. Server validation requires a string email matching the implemented email pattern, no more than 254 trimmed characters, and a nonempty string password no longer than 1,000 JavaScript code units. Login does not impose registration's 8-character minimum or 72-byte maximum. Email is trimmed/lowercased before lookup. A missing account and incorrect password deliberately produce the same 401 message.

The IP-based limiter runs **before** validation and permits ten unsuccessful login responses in a 15-minute window. Responses below 400 are removed from its failed-attempt count; a blocked client receives 429 and Retry-After even when credentials would otherwise be valid. A selected login role is a **frontend** condition, not a trusted backend authorization input. The server returns the stored role; the frontend clears the session and shows a role-selection message when it differs from the selected radio button. No lecturer approval or email-verification restriction is implemented.

Sources: `backend/src/routes/auth.js`, `backend/src/middleware/rateLimit.js`, `FrontEnd/src/pages/LoginPage.jsx`, `FrontEnd/src/auth/AuthContext.jsx` and `ProtectedRoute.jsx`. No internals were invoked to obtain the test outcomes.

## Complete reduced decision table

Y = yes; N = no; — = irrelevant/not evaluated. R1 has precedence. With rate limiting allowed, R2–R4 cover all three invalid-format combinations; R5–R8 cover all feasible valid-format credential/role outcomes. Password correctness cannot meaningfully be evaluated for an absent account. Account existence and role matching are irrelevant when format validation fails. Role matching is evaluated only after successful credential verification. These infeasible or irrelevant combinations are collapsed rather than invented as additional rules.

| Condition / action | R1 | R2 | R3 | R4 | R5 | R6 | R7 | R8 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Client currently blocked by limiter? | Y | N | N | N | N | N | N | N |
| Email format/type valid? | — | N | N | Y | Y | Y | Y | Y |
| Password format/type valid? | — | N | Y | N | Y | Y | Y | Y |
| Account exists? | — | — | — | — | N | Y | Y | Y |
| Password matches account? | — | — | — | — | — | N | Y | Y |
| Selected browser role matches stored role? | — | — | — | — | — | — | Y | N |
| API action | 429 + Retry-After | 400 validation | 400 validation | 400 validation | 401 generic denial | 401 generic denial | 200 + stored-role session | 200 + stored-role session |
| Browser action where exercised | Not exercised | Not exercised | Not exercised | Not exercised | Not exercised | Not exercised | Appropriate role dashboard | Clear session; remain at login with mismatch message |

API errors are executed below; browser rendering of every API-error rule is not claimed. The table is complete for the selected conditions, not an exhaustive enumeration of every malformed input string, rate-limit timing event or browser state.

## API executions

Every evidence link contains the local endpoint, method, sanitized input, expected/actual HTTP status, response, timestamp and result. Account credentials are generated synthetic values and redacted. All expected responses were defined before requests.

| Rule | Case / evidence | Representative input / condition | Expected | Actual | Status |
| --- | --- | --- | --- | --- | --- |
| R1 | [BB-DT-10](evidence/bb-20261125T131845/BB-DT-10.json) | Correct student credentials after limiter has blocked client | 429; Retry-After present | HTTP 429: Too many failed sign-in attempts. Please try again later. | Passed |
| R2 | [BB-DT-01](evidence/bb-20261125T131845/BB-DT-01.json) | Malformed email plus empty password | 400; email and password validation errors | HTTP 400: Enter a valid email address.; Password is required. | Passed |
| R3 | [BB-DT-02](evidence/bb-20261125T131845/BB-DT-02.json) | Malformed email plus valid-format password | 400; email validation error | HTTP 400: Enter a valid email address. | Passed |
| R4 | [BB-DT-03](evidence/bb-20261125T131845/BB-DT-03.json) | Existing valid email; empty password | 400; Password is required. | HTTP 400: Password is required. | Passed |
| R4 | [BB-DT-07](evidence/bb-20261125T131845/BB-DT-07.json) | Existing valid email; 1001-code-unit ASCII password | 400; Password is too long. | HTTP 400: Password is too long. | Passed |
| R4 | [BB-DT-08](evidence/bb-20261125T131845/BB-DT-08.json) | Existing valid email; numeric password | 400; Password is required. | HTTP 400: Password is required. | Passed |
| R5 | [BB-DT-04](evidence/bb-20261125T131845/BB-DT-04.json) | Unused synthetic valid email; valid-format password | 401; Invalid email or password. | HTTP 401: Invalid email or password. | Passed |
| R6 | [BB-DT-05](evidence/bb-20261125T131845/BB-DT-05.json) | Existing synthetic student; incorrect random password | 401; Invalid email or password. | HTTP 401: Invalid email or password. | Passed |
| R7 | [BB-DT-06](evidence/bb-20261125T131845/BB-DT-06.json) | Existing student; correct password | 200; stored role student; token supplied but redacted | HTTP 200: Authenticated; role=student | Passed |
| R8 support | [BB-DT-09](evidence/bb-20261125T131845/BB-DT-09.json) | Correct student credentials with extra role=lecturer in body | 200; stored role remains student; supplied role cannot override it | HTTP 200: Authenticated; role=student | Passed |

R1 was exercised last to avoid blocking preceding checks. Seven deliberate invalid login requests had already consumed failures. Three additional wrong-password setup requests returned 401; the fourth setup probe returned the first 429. The final **BB-DT-10** request used correct credentials and still returned 429 with **Retry-After: 800 seconds**. [Setup observations](evidence/bb-20261125T131845/SETUP-LIMITER-04.json) and [the final request](evidence/bb-20261125T131845/BB-DT-10.json) preserve this sequence. Setup probes are not additional test cases. No rate-limit reset or server restart was used. Exact window-expiry recovery was not tested.

## Browser executions

Native Brave interaction through CUA exercised the rendered application. Password-manager prompts were dismissed without saving credentials. Both dashboards include known demonstration content; these checks assert successful role navigation, not live dashboard totals.

| Rule | Case / evidence | Expected | Actual | Status | Screenshot |
| --- | --- | --- | --- | --- | --- |
| R8 | [BB-UI-01](evidence/bb-20261125T131845/BB-UI-01.json) | Student credentials with Lecturer selected: mismatch message and no retained protected access | This account is registered as a student. Select student to continue. Protected /student/assignments navigation returned to login. | Passed | [Screenshot](evidence/bb-20261125T131845/BB-UI-01-role-mismatch.png) |
| R7 | [BB-UI-02](evidence/bb-20261125T131845/BB-UI-02.json) | Student credentials with Student selected: Student dashboard | Navigated to /student-dashboard with Student navigation | Passed | [Screenshot](evidence/bb-20261125T131845/BB-UI-02-student-login.png) |
| R7 | [BB-UI-03](evidence/bb-20261125T131845/BB-UI-03.json) | Lecturer credentials with Lecturer selected: Lecturer dashboard | Navigated to /lecturer-dashboard with Lecturer navigation | Passed | [Screenshot](evidence/bb-20261125T131845/BB-UI-03-lecturer-login.png) |

For BB-UI-01, [a second screenshot](evidence/bb-20261125T131845/BB-UI-01-protected-redirect.png) records return to login after entering `/student/assignments`. An intermediate address-entry typo was corrected before observing that outcome; it is not an application defect or another test. No failed page load from that typo is used as evidence.

## Results

**13 unique login checks: 10 direct API and 3 browser; all 13 passed.** Each of the eight reduced rules has corresponding execution evidence. Invalid password type/empty/length are multiple representatives of R4, not new decision rules. The 6 logged supporting API requests (lecturer login, upload-assignment setup, 4 limiter probes) are excluded from all case pass rates.

No genuine defect was observed. The mismatch response is expected frontend behaviour; an extra role property in an API body does not change the stored role. Testing is limited to a fresh local process/client window and the selected representatives; exhaustive browser error rendering, limit expiry and concurrent login requests remain untested.
