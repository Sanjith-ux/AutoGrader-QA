#!/usr/bin/env bash
set -euo pipefail

package=${1:-}
case "$package" in
  backend|FrontEnd) ;;
  *) printf 'Usage: bash qa/member3/test-with-coverage.sh {backend|FrontEnd}\n' >&2; exit 2 ;;
esac

repo=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../.." && pwd)
results="$repo/qa/member3/results"
mkdir -p "$results"
report="$results/$package.lcov.info"
rm -f -- "$report"
cd "$repo/$package"

if node -e 'process.exit(require("./package.json").scripts?.["test:coverage"] ? 0 : 1)'; then
  # The Member 2 handoff contract is package/coverage/lcov.info.
  npm run test:coverage
  cp coverage/lcov.info "$report"
else
  npm test -- --experimental-test-coverage --test-coverage-include='src/**' \
    --test-reporter=spec --test-reporter-destination=stdout \
    --test-reporter=lcov --test-reporter-destination="$report"
fi

test -s "$report"
