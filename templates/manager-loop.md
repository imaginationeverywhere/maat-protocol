# Manager Loop Template

Copy-paste template for setting up a Manager monitoring loop. Provider-agnostic.

Replace `[PLACEHOLDER]` values with your project specifics before using.

---

## What This Template Does

This template sets up the Tier 2 Manager following the Monitor-Decide-Dispatch (MDD) cycle. The Manager monitors your project state every [CYCLE_INTERVAL] minutes, classifies issues, and dispatches Workers or escalates to the Architect.

---

## Template A: Conversational Manager Prompt

Use this as the opening prompt in any LLM chat session (Haiku, GPT-4o-mini, Llama 3.2, etc.).

```
You are the Manager for [PROJECT_NAME].

IDENTITY:
You are Tier 2 in the Maat Protocol hierarchy. You route work. You do not do the work.

YOUR CYCLE (run every [CYCLE_INTERVAL] minutes):

── MONITOR ─────────────────────────────────────────────────────────
Check these sources in order:
1. TypeScript/lint errors:  [TSC_COMMAND]
2. Test results:            [TEST_COMMAND]
3. Build status:            [BUILD_COMMAND]
4. Architect decisions:     cat DECISION.md (if exists, check timestamp)
5. Worker completions:      ls *.worker.done 2>/dev/null

── DECIDE ──────────────────────────────────────────────────────────
For each observation, classify:

  SIMPLE (→ dispatch Worker):
  - Type errors: missing cast, wrong type import, undefined property
  - Test failures: missing mock, wrong assertion format, import error
  - Lint/format: any auto-fixable issue
  - Notifications: build passed, tests green, PR ready

  COMPLEX (→ escalate to Architect):
  - Function signature changes required
  - API contract modifications
  - Worker failed 2+ times on same task
  - Requirement ambiguity or contradiction
  - Security, auth, or data model questions

  NOTHING:
  - All checks pass
  - Active Workers below [MAX_WORKERS] and work is in progress
  - Already escalated this issue (waiting for Architect)

── DISPATCH ────────────────────────────────────────────────────────
Before dispatching, check: are there fewer than [MAX_WORKERS] active Workers?
  YES → dispatch using the Worker command format below
  NO  → add to queue, wait for a Worker to complete

Worker command format:
  [WORKER_COMMAND_PREFIX] "[precise task description]" [WORKER_COMMAND_SUFFIX]

Task description must include:
  - What to do (specific action)
  - Where to do it (file path + line number)
  - Constraints (what NOT to change)
  - Verification (how to confirm success)

Escalation format: write to ESCALATION.md using the template in templates/escalation.md

── LOOP ────────────────────────────────────────────────────────────
After each cycle:
1. Log your decision to MANAGER.log (one line: timestamp | action | reason)
2. Wait [CYCLE_INTERVAL] minutes
3. Repeat from MONITOR

Start your first monitoring cycle now.
```

---

## Placeholder Reference

| Placeholder | Example Values |
|------------|---------------|
| `[PROJECT_NAME]` | `my-api`, `e-commerce-platform`, `auth-service` |
| `[CYCLE_INTERVAL]` | `2` (minutes) for active development; `5` for CI monitoring |
| `[TSC_COMMAND]` | `npx tsc --noEmit 2>&1 \| head -50` (TypeScript), `python -m mypy src/ 2>&1 \| head -50` (Python) |
| `[TEST_COMMAND]` | `npm test -- --passWithNoTests 2>&1 \| tail -30`, `pytest --tb=short 2>&1 \| tail -30` |
| `[BUILD_COMMAND]` | `npm run build 2>&1 \| tail -20`, `cargo build 2>&1 \| tail -20`, `make 2>&1 \| tail -20` |
| `[MAX_WORKERS]` | `4` (default), `2` (conservative), `6` (high-throughput) |
| `[WORKER_COMMAND_PREFIX]` | `cursor agent --print`, `codex`, `aider --yes-always --message` |
| `[WORKER_COMMAND_SUFFIX]` | `--apply` (cursor), ` ` (codex), `<file>` (aider) |

---

## Template B: Python Manager Loop Script

For programmatic use. Runs continuously with configurable cycle time.

```python
#!/usr/bin/env python3
"""
Maat Protocol Manager Loop
Provider-agnostic MDD cycle implementation.
Replace MANAGER_MODEL and WORKER_* with your stack.
"""

import subprocess
import time
import json
import os
from datetime import datetime

# ── CONFIGURATION ──────────────────────────────────────────────────
MANAGER_MODEL = "claude-haiku-4-5-20251001"    # or "gpt-4o-mini", "ollama/llama3.2"
CYCLE_SECONDS = 120                             # 2-minute cycles
MAX_WORKERS = 4
PROJECT_NAME = "[PROJECT_NAME]"

# Monitor commands — replace with your stack
MONITOR_COMMANDS = {
    "types":  "npx tsc --noEmit 2>&1 | head -50",
    "tests":  "npm test -- --passWithNoTests 2>&1 | tail -30",
    "build":  "npm run build 2>&1 | tail -20",
}

# Worker dispatch — replace with your tool
def build_worker_command(task: str, files: list[str] = None) -> str:
    files_str = " ".join(files) if files else ""
    # Choose your Worker tool:
    return f'cursor agent --print "{task}" --apply'
    # return f'codex "{task}"'
    # return f'aider --yes-always --message "{task}" {files_str}'
    # return f'aider --model deepseek/deepseek-coder --yes-always --message "{task}" {files_str}'

# ── MANAGER LLM CALL ───────────────────────────────────────────────
def query_manager(system_prompt: str, state: str) -> dict:
    """Query the Manager LLM. Adapt for your provider."""

    # Anthropic (Haiku)
    import anthropic
    client = anthropic.Anthropic()
    response = client.messages.create(
        model=MANAGER_MODEL,
        max_tokens=400,
        system=system_prompt,
        messages=[{"role": "user", "content": state}]
    )
    raw = response.content[0].text

    # OpenAI (GPT-4o-mini) — uncomment to use
    # from openai import OpenAI
    # client = OpenAI()
    # response = client.chat.completions.create(
    #     model=MANAGER_MODEL,
    #     messages=[{"role": "system", "content": system_prompt},
    #               {"role": "user", "content": state}],
    #     response_format={"type": "json_object"},
    #     max_tokens=400
    # )
    # raw = response.choices[0].message.content

    # Ollama (Llama) — uncomment to use
    # import requests
    # resp = requests.post("http://localhost:11434/api/generate",
    #     json={"model": MANAGER_MODEL, "prompt": system_prompt + "\n\n" + state,
    #           "stream": False, "options": {"temperature": 0.1, "num_predict": 300}})
    # raw = resp.json()["response"]

    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        # Fallback: parse text response
        if "DISPATCH:" in raw:
            return {"action": "dispatch", "command": raw.split("DISPATCH:")[1].strip()}
        elif "ESCALATE:" in raw:
            return {"action": "escalate", "content": raw.split("ESCALATE:")[1].strip()}
        else:
            return {"action": "nothing", "reason": raw.strip()}

# ── SYSTEM PROMPT ──────────────────────────────────────────────────
MANAGER_SYSTEM = f"""You are the Manager for {PROJECT_NAME}.

Run the MDD loop. Given system state, output JSON:
  {{"action": "dispatch", "command": "<shell command>", "reason": "..."}}
  {{"action": "escalate", "content": "<ESCALATION.md markdown>", "reason": "..."}}
  {{"action": "nothing", "reason": "..."}}

Rules:
- dispatch: simple type errors, test mocks, missing imports, notifications
- escalate: signature changes, repeated Worker failures (2+), architectural conflicts
- nothing: all clear, Worker in progress, already escalated
- Max active Workers: {MAX_WORKERS}
- Terse. 2 sentences max per reason.
"""

# ── UTILITIES ──────────────────────────────────────────────────────
def run_shell(cmd: str, timeout: int = 30) -> str:
    try:
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=timeout)
        return (result.stdout + result.stderr).strip()
    except subprocess.TimeoutExpired:
        return "[command timed out]"

def count_active_workers() -> int:
    result = run_shell("pgrep -f 'cursor agent\\|aider\\|codex' | wc -l")
    try:
        return int(result.strip())
    except ValueError:
        return 0

def log_decision(action: str, reason: str):
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    with open("MANAGER.log", "a") as f:
        f.write(f"{timestamp} | {action} | {reason[:100]}\n")

# ── MDD CYCLE ──────────────────────────────────────────────────────
def run_cycle():
    # MONITOR
    monitor_results = {}
    for name, cmd in MONITOR_COMMANDS.items():
        monitor_results[name] = run_shell(cmd)

    decision_md = run_shell("cat DECISION.md 2>/dev/null | head -40")
    done_files = run_shell("ls *.worker.done 2>/dev/null")
    active_workers = count_active_workers()

    state = f"""SYSTEM STATE — {datetime.now().strftime("%H:%M:%S")}

Active Workers: {active_workers}/{MAX_WORKERS}

TypeScript/Types check:
{monitor_results.get("types", "N/A")}

Test results:
{monitor_results.get("tests", "N/A")}

Build:
{monitor_results.get("build", "N/A")}

Architect decision (DECISION.md):
{decision_md or "None"}

Worker completions:
{done_files or "None"}
"""

    # DECIDE
    decision = query_manager(MANAGER_SYSTEM, state)
    action = decision.get("action", "nothing")
    reason = decision.get("reason", "")

    print(f"[Manager] {datetime.now().strftime('%H:%M')} | {action} | {reason[:80]}")
    log_decision(action, reason)

    # DISPATCH
    if action == "dispatch":
        if active_workers < MAX_WORKERS:
            command = decision.get("command", "")
            if command:
                print(f"[Manager] Running: {command[:80]}...")
                subprocess.Popen(command, shell=True)
        else:
            print(f"[Manager] Worker limit reached ({active_workers}/{MAX_WORKERS}). Queuing.")
            with open("WORKER_QUEUE.txt", "a") as f:
                f.write(decision.get("command", "") + "\n")

    elif action == "escalate":
        content = decision.get("content", "")
        if content:
            with open("ESCALATION.md", "w") as f:
                f.write(content)
            print("[Manager] Escalation written. Waiting for Architect.")

    # Clean up completed Worker signals
    for f in run_shell("ls *.worker.done 2>/dev/null").splitlines():
        if f.strip():
            os.remove(f.strip())

    # Process queued Workers if under limit
    if active_workers < MAX_WORKERS and os.path.exists("WORKER_QUEUE.txt"):
        with open("WORKER_QUEUE.txt", "r") as f:
            queued = f.readlines()
        if queued:
            cmd = queued[0].strip()
            subprocess.Popen(cmd, shell=True)
            with open("WORKER_QUEUE.txt", "w") as f:
                f.writelines(queued[1:])
            print(f"[Manager] Dequeued Worker: {cmd[:60]}...")

# ── MAIN LOOP ──────────────────────────────────────────────────────
if __name__ == "__main__":
    print(f"[Manager] Starting MDD loop for {PROJECT_NAME}")
    print(f"[Manager] Model: {MANAGER_MODEL} | Cycle: {CYCLE_SECONDS}s | Max Workers: {MAX_WORKERS}")

    while True:
        try:
            run_cycle()
        except KeyboardInterrupt:
            print("\n[Manager] Stopped.")
            break
        except Exception as e:
            print(f"[Manager] Cycle error: {e}")
            log_decision("error", str(e))
        time.sleep(CYCLE_SECONDS)
```

---

## Template C: MDD Cycle Card (Quick Reference)

Post this on the wall. Reference it when debugging Manager behavior.

```
┌─────────────────────────────────────────────────────────────┐
│            MANAGER MDD CYCLE — QUICK REFERENCE              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  MONITOR                                                    │
│  ├── npx tsc --noEmit                                       │
│  ├── npm test -- --passWithNoTests                          │
│  ├── cat DECISION.md (new from Architect?)                  │
│  └── ls *.worker.done (Workers finished?)                   │
│                                                             │
│  DECIDE                                                     │
│  ├── Simple error?      → DISPATCH Worker                   │
│  ├── Architectural?     → ESCALATE to Architect             │
│  ├── Worker failed 2x?  → ESCALATE to Architect             │
│  ├── New DECISION.md?   → Read and DISPATCH Workers         │
│  └── All clear?         → NOTHING                          │
│                                                             │
│  DISPATCH (only if action required)                         │
│  ├── Check: active Workers < MAX_WORKERS                    │
│  ├── Write: precise task (file + line + constraint)         │
│  └── Run: cursor agent / codex / aider in background        │
│                                                             │
│  LOG: timestamp | action | reason → MANAGER.log             │
│  WAIT: [CYCLE_INTERVAL] minutes                             │
│  REPEAT                                                     │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  MANAGER NEVER:                                             │
│  ✗ writes code or edits files directly                      │
│  ✗ makes architectural decisions                            │
│  ✗ runs more than MAX_WORKERS concurrent Workers            │
│  ✗ dispatches Workers to fix the same issue 3+ times        │
└─────────────────────────────────────────────────────────────┘
```

---

## Log File Conventions

Maintain consistent log files for auditability:

```
MANAGER.log        — One line per MDD cycle decision
ESCALATION.md      — Current active escalation (overwritten each cycle)
DECISION.md        — Latest Architect decision (overwritten by Architect)
WORKER_QUEUE.txt   — Pending Worker tasks when limit is reached
*.worker.pid       — PID file for each active Worker process
*.worker.done      — Signal file created when a Worker completes
```

Worker completion signal (Workers write this themselves or the Manager polls):
```bash
# Add to the end of any Worker script or command:
touch auth-fix.worker.done && rm -f auth-fix.worker.pid
```

---

## Adjusting Cycle Time

| Scenario | Recommended Cycle |
|---------|------------------|
| Active development, fast feedback | 1–2 minutes |
| Standard development | 2–5 minutes |
| CI/CD monitoring | 5–10 minutes |
| Overnight runs, low-frequency | 15–30 minutes |
| Production health monitoring | 1 minute (with cheap local model) |

Shorter cycles = faster feedback but more Manager token usage. With a local model (Ollama), you can run 1-minute cycles for free.
