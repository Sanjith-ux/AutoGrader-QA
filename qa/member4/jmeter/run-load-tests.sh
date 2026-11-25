#!/usr/bin/env bash
set -Eeuo pipefail

# Run only after manually verifying LabTrack's backend uses a disposable local QA database.
if [[ "${LABTRACK_QA_ISOLATED_CONFIRMED:-}" != "YES" ]]; then
  echo "STOP: verify disposable local DB and export LABTRACK_QA_ISOLATED_CONFIRMED=YES" >&2
  exit 2
fi
command -v jmeter >/dev/null 2>&1 || { echo "Apache JMeter is not installed/in PATH" >&2; exit 2; }
command -v python3 >/dev/null 2>&1 || { echo "python3 is required" >&2; exit 2; }

QA_HOST="${QA_HOST:-127.0.0.1}"
case "$QA_HOST" in
  127.0.0.1|localhost) ;;
  *) echo "STOP: this runner permits loopback hosts only" >&2; exit 2 ;;
esac

QA_PORT="${QA_PORT:-5002}"
[[ "$QA_PORT" =~ ^[0-9]{1,5}$ ]] && (( 10#$QA_PORT >= 1 && 10#$QA_PORT <= 65535 )) || {
  echo "STOP: invalid QA_PORT" >&2; exit 2;
}
QA_TARGET_PATH="${QA_TARGET_PATH:-}"
[[ "$QA_TARGET_PATH" =~ ^/[A-Za-z0-9_./-]+$ ]] || {
  echo "STOP: set QA_TARGET_PATH to a verified, read-only API path (letters/numbers/_/./- only)" >&2
  exit 2
}
QA_EXPECT_STATUS="${QA_EXPECT_STATUS:-200}"
[[ "$QA_EXPECT_STATUS" =~ ^[1-5][0-9][0-9]$ ]] || {
  echo "STOP: QA_EXPECT_STATUS must be a valid 3-digit HTTP status code" >&2
  exit 2
}
QA_BODY_REGEX="${QA_BODY_REGEX:-(?s).+}"

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
RUN_DIR="$SCRIPT_DIR/results/$STAMP"
if [[ -e "$RUN_DIR" ]]; then
  echo "STOP: run directory already exists; do not overwrite evidence: $RUN_DIR" >&2
  exit 2
fi
mkdir -p "$RUN_DIR"
printf 'Results folder: %s\n' "$RUN_DIR"
printf 'Target: http://%s:%s%s (GET; no credentials printed)\n' "$QA_HOST" "$QA_PORT" "$QA_TARGET_PATH"

# A fast readiness probe: reachability only. It does not substitute for DB verification.
if ! python3 - "$QA_HOST" "$QA_PORT" <<'PY'
import socket, sys
s=socket.socket()
s.settimeout(3)
try:
    s.connect((sys.argv[1], int(sys.argv[2])))
except OSError:
    sys.exit(1)
finally:
    s.close()
PY
then
  echo "STOP: no backend listener at local QA host/port" >&2
  exit 3
fi

for USERS in 10 25 50; do
  printf '\nStarting %s virtual users, 10-second ramp, 5 loops (planned %s samples)\n' "$USERS" "$((USERS * 5))"
  # No real credentials appear on the command line. LABTRACK_QA_TOKEN is read
  # directly from the local environment inside the JMeter test plan if set.
  jmeter -n \
    -t "$SCRIPT_DIR/labtrack-load.jmx" \
    -l "$RUN_DIR/run-${USERS}.jtl" \
    -j "$RUN_DIR/jmeter-${USERS}.log" \
    -e -o "$RUN_DIR/dashboard-${USERS}" \
    -Jqa.host="$QA_HOST" \
    -Jqa.port="$QA_PORT" \
    -Jqa.path="$QA_TARGET_PATH" \
    -Jqa.expectedStatus="$QA_EXPECT_STATUS" \
    -Jqa.bodyRegex="$QA_BODY_REGEX" \
    -Jqa.users="$USERS" \
    -Jqa.ramp=10 \
    -Jqa.loops=5 \
    -Jjmeter.save.saveservice.output_format=csv \
    -Jjmeter.save.saveservice.timestamp_format=ms \
    -Jjmeter.save.saveservice.print_field_names=true
done

python3 "$SCRIPT_DIR/summarize_jtl.py" "$RUN_DIR" > "$RUN_DIR/metrics.csv"
printf '\nFinished. Compare results in %s/metrics.csv and dashboards.\n' "$RUN_DIR"
printf 'Review and sanitize all raw log/JTL artifacts before sharing.\n'
