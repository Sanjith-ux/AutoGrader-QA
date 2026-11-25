# Evidence handling — Member 4

**No real execution evidence is included in this package.**

Capture evidence only when running the actual local LabTrack project. Before saving/pushing, remove all real credentials, bearer tokens, cookies, personal student data and private MongoDB connection strings.

Suggested filenames after verification:
- `perf-local-db-isolation-redacted.png`
- `perf-run-10-terminal.png`, `perf-run-25-terminal.png`, `perf-run-50-terminal.png`
- `perf-summary-aggregate-<users>.png`
- `perf-dashboard-<users>.png`
- `ST-01-student-denied.png`, `ST-02-missing-token.png`, `ST-02-invalid-token.png`
- `usability-U-<id>-finding.png`
- `DEF-<issueid>-new.png`, `DEF-<issueid>-assigned.png`, `DEF-<issueid>-fixed.png`
- `DEF-<issueid>-verified.png`, `DEF-<issueid>-closed.png`

Each screenshot needs an accompanying report reference with exact date, tested Git commit, action/method, expected outcome and actual result. Blank templates, the supplied branch diagram and offline syntax checks do not count as empirical testing evidence.

Raw JTLs/logs can contain test infrastructure details; review before commit. Avoid screenshots that display authorization values.
