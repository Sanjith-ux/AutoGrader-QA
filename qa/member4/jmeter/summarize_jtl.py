#!/usr/bin/env python3
'''Summarize actual, non-empty JMeter CSV JTL files. No fabricated rows or values.'''
import csv
import math
import pathlib
import sys

def summarize(path):
    with path.open(newline="", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        required = {"timeStamp", "elapsed", "success"}
        if not reader.fieldnames or not required.issubset(reader.fieldnames):
            raise ValueError(f"{path}: missing required CSV JTL headers; got {reader.fieldnames}")
        rows = list(reader)
    if not rows:
        raise ValueError(f"{path}: zero samples; results cannot be reported")
    latencies = sorted(float(r["elapsed"]) for r in rows)
    times = [float(r["timeStamp"]) for r in rows]
    finish = [float(r["timeStamp"]) + float(r["elapsed"]) for r in rows]
    failed = sum(r["success"].lower() != "true" for r in rows)
    duration_s = (max(finish) - min(times)) / 1000
    throughput = len(rows) / duration_s if duration_s > 0 else 0.0
    p95_index = max(0, math.ceil(0.95 * len(rows)) - 1)
    return len(rows), failed, sum(latencies) / len(rows), latencies[0], latencies[-1], latencies[p95_index], throughput, failed * 100 / len(rows)

def main():
    if len(sys.argv) != 2:
        raise SystemExit("Usage: python3 summarize_jtl.py path/to/results/run-folder")
    folder = pathlib.Path(sys.argv[1])
    names = [folder / f"run-{users}.jtl" for users in (10, 25, 50)]
    if any(not p.is_file() for p in names):
        raise SystemExit("Expected run-10.jtl, run-25.jtl and run-50.jtl under provided folder")
    out = csv.writer(sys.stdout, lineterminator="\n")
    out.writerow(["users", "ramp_up_s", "loops", "samples", "failed", "mean_ms", "min_ms", "max_ms", "p95_ms", "requests_per_sec", "errors_percent"])
    for n, path in zip((10, 25, 50), names):
        count, failed, avg, lo, hi, p95, rps, errpct = summarize(path)
        out.writerow([n, 10, 5, count, failed, f"{avg:.2f}", f"{lo:.2f}", f"{hi:.2f}", f"{p95:.2f}", f"{rps:.2f}", f"{errpct:.2f}"])
        if count != n * 5:
            print(f"WARNING: {path.name}: {count} samples found; expected {n*5}. Investigate!", file=sys.stderr)

if __name__ == "__main__":
    try:
        main()
    except (ValueError, OSError) as ex:
        raise SystemExit(str(ex))
