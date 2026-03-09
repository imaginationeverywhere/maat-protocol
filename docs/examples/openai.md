# Maat Protocol: OpenAI Ecosystem

Complete working example using GPT-5, GPT-4o-mini, and Codex CLI.

---

## Setup

**Prerequisites:**
- OpenAI API key (`export OPENAI_API_KEY=...`)
- `openai` CLI installed (`pip install openai` or `npm install -g openai`)
- `codex` CLI installed (`npm install -g @openai/codex`)
- A project repository to orchestrate

**Tier assignments:**
```
Tier 1 — Architect:  gpt-5 (or o3 for reasoning-heavy architecture)
Tier 2 — Manager:    gpt-4o-mini (fast, cheap, reliable loop)
Tier 3 — Workers:    codex agent (CLI-based code execution)
```

---

## Terminal Setup

```
┌─────────────────────────┐  ┌─────────────────────────┐
│   Terminal 1            │  │   Terminal 2            │
│   ARCHITECT             │  │   MANAGER               │
│   openai chat           │  │   openai chat           │
│   --model gpt-5         │  │   --model gpt-4o-mini   │
│                         │  │                         │
│   Active when engaged   │  │   Always running        │
└─────────────────────────┘  └─────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│   Background Processes                                   │
│   codex "Fix the TypeScript error in auth.ts line 42"   │
│   (Spawned by Manager via shell commands)                │
└──────────────────────────────────────────────────────────┘
```

---

## Step 1: Architect Session (Terminal 1)

```bash
# Option A: GPT-5 for general architecture
$ openai api chat.completions.create -m gpt-5 -t 0.3 \
  --system "You are the Architect. Design systems, review escalations,
  write decisions to DECISION.md. Never write code, never monitor builds.
  When the Manager writes ESCALATION.md, read it and respond with a
  precise technical decision."

# Option B: o3 for complex reasoning-heavy architectural decisions
$ openai api chat.completions.create -m o3 -t 1 \
  --system "You are the Architect. Handle complex trade-off decisions..."
```

For interactive use, you can use the ChatGPT web interface with a Project configured as the Architect. The key is maintaining the role discipline — the Architect only engages when escalated.

**Architect opening prompt:**
```
You are the Architect for this codebase.

Your responsibilities:
- Technical direction and system design
- Reviewing escalations from the Manager
- Writing precise implementation specs that Workers execute without clarification
- Making final calls on trade-offs

Your constraints:
- Do NOT monitor CI, builds, or test output
- Do NOT write or edit code directly
- Do NOT dispatch Workers — describe the work, let the Manager dispatch
- ONLY engage when the Manager writes to ESCALATION.md

Write your responses to DECISION.md when deciding.
Current project: [describe your project]
```

---

## Step 2: Manager Loop (Terminal 2)

GPT-4o-mini as the Manager loop. At ~$0.60/M output tokens, this runs cheaply.

```bash
$ openai api chat.completions.create -m gpt-4o-mini \
  --system "You are the Manager. Run the Monitor-Decide-Dispatch loop every 2 minutes."
```

Or use the OpenAI Python SDK to build a persistent loop:

```python
#!/usr/bin/env python3
# manager_loop.py — Run this in Terminal 2

import subprocess
import time
from openai import OpenAI

client = OpenAI()

MANAGER_SYSTEM = """You are the Manager for this project. Run the MDD loop.

MONITOR (check each cycle):
1. TypeScript errors: run `npx tsc --noEmit 2>&1 | head -50`
2. Test status: run `npm test -- --passWithNoTests 2>&1 | tail -30`
3. Escalation response: check if ESCALATION_RESPONSE.md exists

DECIDE for each observation:
- TypeScript errors: classify as simple (type cast, missing import) or complex
- Test failures: classify as simple (missing mock) or complex (design issue)
- ESCALATION_RESPONSE.md exists: execute the Architect's decision
- All clear: do nothing

DISPATCH rules:
- Simple fix: output the exact codex command to run
- Complex issue: write to ESCALATION.md in markdown format
- Never run more than 4 concurrent Workers

Output format: JSON with fields:
  { "action": "dispatch" | "escalate" | "nothing",
    "command": "...",    // if action=dispatch
    "escalation": "..."  // if action=escalate
  }
"""

def run_shell(cmd):
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=30)
    return result.stdout + result.stderr

def manager_cycle():
    tsc_output = run_shell("npx tsc --noEmit 2>&1 | head -50")
    test_output = run_shell("npm test -- --passWithNoTests 2>&1 | tail -30")
    escalation_response = run_shell("cat ESCALATION_RESPONSE.md 2>/dev/null")
    active_workers = run_shell("pgrep -f 'codex' | wc -l").strip()

    context = f"""
Current state:
TypeScript errors:
{tsc_output}

Test output:
{test_output}

Escalation response (if any):
{escalation_response}

Active Workers: {active_workers}
"""

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": MANAGER_SYSTEM},
            {"role": "user", "content": context}
        ],
        response_format={"type": "json_object"}
    )

    import json
    decision = json.loads(response.choices[0].message.content)

    if decision["action"] == "dispatch":
        print(f"[Manager] Dispatching: {decision['command']}")
        subprocess.Popen(decision["command"], shell=True)
    elif decision["action"] == "escalate":
        print("[Manager] Escalating to Architect...")
        with open("ESCALATION.md", "w") as f:
            f.write(decision["escalation"])
    else:
        print("[Manager] All clear. No action.")

    return decision

if __name__ == "__main__":
    print("[Manager] Starting MDD loop (2-minute cycles)...")
    while True:
        try:
            decision = manager_cycle()
            print(f"[Manager] Cycle complete. Action: {decision['action']}")
        except Exception as e:
            print(f"[Manager] Error in cycle: {e}")
        time.sleep(120)  # 2-minute cycle
```

Run:
```bash
$ python3 manager_loop.py
```

---

## Step 3: Worker Dispatch with Codex CLI

Workers use `codex` — OpenAI's terminal-based code agent.

### TypeScript Fix Worker

```bash
codex "
Fix TypeScript error in src/auth/service.ts line 47:
  Error: Argument of type 'string' is not assignable to parameter of type 'UserID'
  Fix: Cast the argument to UserID where validateUser() is called
  Do not change any function signatures or type definitions
  After fixing: run npx tsc --noEmit src/auth/service.ts to verify
" --approval-mode full-auto
```

### Test Fix Worker

```bash
codex "
Fix the failing test in tests/api/users.test.ts
  Failing: 'should return 404 for unknown user'
  Error: Expected status 404, received 200
  Likely cause: The mock for UserRepository.findById returns a user
    object instead of null for unknown IDs
  Fix: Update the mock in the beforeEach block to return null
    for IDs not in the test fixture
  Only edit the test file
" --approval-mode full-auto
```

### Automated Code Review Worker

```bash
codex "
Review the changes in git diff HEAD~1..HEAD
  Focus on:
  1. Security issues (SQL injection, XSS, auth bypasses)
  2. Type safety violations
  3. Missing error handling
  Output: Write a review to CODE_REVIEW.md
    Format: ## File\n- Issue: ...\n  Severity: low/medium/high\n  Suggestion: ...
  If no issues found, write: 'No issues found in this diff.'
" --approval-mode full-auto
```

---

## Step 4: Using o1/o3 for Complex Architecture

For architectural decisions that require deep reasoning (system design, trade-off analysis, refactoring strategy), use OpenAI's reasoning models:

```bash
# Use o3 for architecture when the decision requires chain-of-thought
$ openai api chat.completions.create -m o3 \
  --user "$(cat ESCALATION.md)"
```

Or in the Python workflow:

```python
# High-stakes architectural decision: use o3
response = client.chat.completions.create(
    model="o3",
    messages=[
        {"role": "user", "content": f"Architect decision needed:\n{escalation_content}"}
    ]
)
```

The Manager identifies when to escalate to o3 vs. GPT-5:

```
GPT-5: General architecture decisions, API design, feature scoping
o3: Algorithmic trade-offs, complex refactoring strategies,
    decisions that require deep reasoning chains
```

---

## Cost Analysis

Based on OpenAI's March 2026 pricing:

| Tier | Model | Daily Usage | Price | Daily Cost |
|------|-------|-------------|-------|------------|
| Architect | gpt-5 | 30 messages × 2,000 tokens | ~$15/M output | ~$0.90 |
| Manager | gpt-4o-mini | 300 cycles × 600 tokens | $0.60/M output | ~$0.11 |
| Workers | codex | 40 tasks × 1,500 tokens | ~$4/M output | ~$0.24 |
| **Total** | | | | **~$1.25/day** |

**Without Maat Protocol (GPT-5 doing everything):**

| Approach | Messages | Tokens | Cost |
|---------|---------|--------|------|
| GPT-5 for everything | 370 msgs | ~555,000 output | ~$8.33 |
| **Savings with Maat** | | | **~85%** |

For 24/7 monitoring:

| Setup | Model | Monthly Cost |
|-------|-------|-------------|
| GPT-5 monitoring loop | gpt-5 | ~$250/month |
| GPT-4o-mini monitoring | gpt-4o-mini | ~$18/month |
| Local Llama (via Ollama) | free | $0/month |

---

## Structured Manager Output (JSON Mode)

GPT-4o-mini works well with JSON mode for reliable Manager dispatch decisions. The Manager always outputs structured JSON, making it easy to parse and act on programmatically:

```python
MANAGER_DECISION_SCHEMA = {
    "type": "object",
    "properties": {
        "action": {"type": "string", "enum": ["dispatch", "escalate", "nothing"]},
        "priority": {"type": "string", "enum": ["high", "medium", "low"]},
        "command": {"type": "string"},  # codex command if action=dispatch
        "escalation_reason": {"type": "string"},  # if action=escalate
        "observations": {
            "type": "array",
            "items": {"type": "string"}
        }
    },
    "required": ["action"]
}
```

Example Manager output:
```json
{
  "action": "dispatch",
  "priority": "medium",
  "command": "codex 'Fix TS2345 in src/auth/service.ts line 47: cast userId argument to UserID type' --approval-mode full-auto",
  "observations": [
    "3 TypeScript errors in auth module",
    "All 3 are simple type cast issues",
    "No test failures",
    "2 active Workers (below limit of 4)"
  ]
}
```

This JSON-first approach makes the Manager's decisions auditable and easy to log.

---

## Full Session Example

```
[Terminal 1 — Architect, GPT-5, waiting]

[Terminal 2 — Manager Loop, gpt-4o-mini]
[Manager] Starting MDD loop...

[14:00] Cycle 1:
  TypeScript: 2 errors in auth/service.ts, api/handler.ts
  Tests: 18 passing
  Active Workers: 0
  Decision: {"action": "dispatch", "command": "codex 'Fix TS2345 auth/service.ts:47...'"}

[Manager] Dispatching Worker 1...
[Manager] Dispatching Worker 2...

[14:02] Cycle 2:
  TypeScript: 0 errors (Workers completed)
  Tests: 18 passing
  Active Workers: 0
  Decision: {"action": "nothing", "observations": ["All clear"]}

[Manager] All clear. No action.

[Total Manager cost for this session: ~$0.003]
[Total Worker cost for 2 fixes: ~$0.012]
[Architect not engaged — $0.00]
```

---

## Tips for the OpenAI Ecosystem

**Use response_format JSON for reliable dispatch.** GPT-4o-mini with `response_format={"type": "json_object"}` produces consistent, parseable Manager decisions. Don't rely on text parsing.

**o3 for architecture, GPT-5 for management.** Reserve o3 for decisions that genuinely need deep reasoning chains. Most architectural decisions are well-served by GPT-5, which is faster and cheaper.

**Codex --approval-mode full-auto.** For non-sensitive fixes (type errors, test mocks), run Codex with full auto-approval. For changes touching auth, payments, or migrations, use `--approval-mode suggest` so you review before applying.

**Set token limits on the Manager.** GPT-4o-mini can ramble. Set `max_tokens=500` on Manager responses. A good MDD decision is 200 tokens or fewer.

**Log every Manager decision.** Append each cycle's JSON output to `manager.log`. When something goes wrong, the log shows exactly what the Manager decided and why. This is your audit trail.
