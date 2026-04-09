#!/usr/bin/env bash
set -euo pipefail

node tools/skill-gen/tests/run-smoke.js
node tools/skill-gen/tests/run-batch.js
