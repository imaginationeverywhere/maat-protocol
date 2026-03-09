# Maat Protocol: Open Source / Local Stack

Complete working example using Llama 405B, Llama via Ollama, and Aider. Zero ongoing API cost for the Manager tier.

---

## Why Local Models for Maat Protocol

The Manager tier is where Maat Protocol delivers its most dramatic savings — and local models make those savings absolute. A Manager loop running 24/7 on `ollama run llama3.2` costs nothing. No API calls. No rate limits. No per-token billing. Just your hardware.

The trade-off: local models require a machine with sufficient GPU/RAM (16GB+ VRAM for capable models). If you have the hardware, the Manager tier is free forever.

---

## Setup

**Prerequisites:**
- [Ollama](https://ollama.com) installed and running (`brew install ollama` on macOS)
- A strong Architect model (API-based or local 70B+)
- [Aider](https://aider.chat) installed (`pip install aider-chat`)
- A project repository

**Tier assignments:**
```
Tier 1 — Architect:  llama3.1:405b (via Ollama) OR claude-opus-4-6 (API)
Tier 2 — Manager:    llama3.2 (via Ollama) — FREE, local, unlimited
Tier 3 — Workers:    aider (open source, any LLM backend)
```

---

## Installing Models

```bash
# Pull the Manager model — fast, lightweight, free
$ ollama pull llama3.2

# Pull the Architect model — large, powerful, local
$ ollama pull llama3.1:405b  # Requires ~230GB disk, 128GB+ RAM

# For GPU-limited machines, use a smaller but capable architect
$ ollama pull llama3.1:70b   # Requires ~45GB disk, 48GB+ VRAM

# Verify both are available
$ ollama list
NAME                ID              SIZE    MODIFIED
llama3.1:405b       ...             231 GB  ...
llama3.2            ...             2.0 GB  ...
```

**Hardware requirements:**

| Model | VRAM Required | RAM Required | Use Case |
|-------|--------------|--------------|---------|
| llama3.2 | 4GB | 8GB | Manager (always running) |
| llama3.1:70b | 48GB | 64GB | Architect (mid-tier) |
| llama3.1:405b | GPU cluster or CPU+RAM | 256GB RAM | Architect (full power) |
| deepseek-r1:70b | 48GB | 64GB | Architect (strong reasoning) |

For most teams: run Llama 3.2 locally for the Manager, use Claude Opus or GPT-5 API for the Architect. This hybrid eliminates Manager costs entirely.

---

## Step 1: Architect Session (Terminal 1)

### Option A: Local Llama 405B (Zero API Cost)

```bash
# Start Ollama server (if not running as a service)
$ ollama serve &

# Start Architect session
$ ollama run llama3.1:405b
```

Architect opening prompt:
```
You are the Architect for this software project.

Your role:
- Define technical architecture and system design
- Review escalations written to ESCALATION.md
- Write decisions to DECISION.md with precise implementation specs
- Break features into work packages the Manager can dispatch

Your rules:
- Never monitor builds, tests, or file changes
- Never write code directly — specify what Workers should implement
- Never dispatch Workers — write the spec, let the Manager dispatch
- Only engage when ESCALATION.md is updated by the Manager

When you see an escalation: read ESCALATION.md, make a decision,
write it to DECISION.md in enough detail that a code agent can execute.

Current project: [describe your project]
```

### Option B: Claude Opus as Remote Architect (Hybrid Mode)

If local 405B is too slow or not available:

```bash
# Use Claude Opus API for Architect tier only
$ claude --model claude-opus-4-6
```

This hybrid setup is common: local models for the free Manager tier, premium API for the rare Architect decisions.

### Option C: DeepSeek R1 for Reasoning-Heavy Architecture

```bash
$ ollama pull deepseek-r1:70b
$ ollama run deepseek-r1:70b
```

DeepSeek R1 shows its chain-of-thought reasoning, making architectural decisions auditable. Good for teams that need to understand the reasoning behind design decisions.

---

## Step 2: Manager Loop (Terminal 2) — Fully Local, Free

```bash
$ ollama run llama3.2
```

Manager opening prompt for Llama 3.2:
```
You are the Manager for this project. Run the Monitor-Decide-Dispatch (MDD) loop.

Every 2 minutes, you will receive the current system state and must output
a structured decision.

MONITOR tasks (I will provide the output):
- TypeScript/Python errors
- Test results
- Worker completion status (check *.done files)

DECIDE:
- Simple error (type cast, missing import, test mock) → dispatch Worker
- Architectural conflict or repeated Worker failure → escalate to Architect
- All clear → do nothing

DISPATCH (output the exact shell command):
Format: DISPATCH: aider --message "..." <files>

ESCALATE (write the escalation):
Format: ESCALATE: [write the ESCALATION.md content]

NOTHING:
Format: NOTHING: [brief reason]

Keep responses short and structured. You are a routing engine, not an analyst.
```

### Manager Loop Script for Ollama

```python
#!/usr/bin/env python3
# manager_loop_ollama.py — Free, local Manager loop

import subprocess
import time
import requests
import json
import os

OLLAMA_URL = "http://localhost:11434/api/generate"
MANAGER_MODEL = "llama3.2"
CYCLE_SECONDS = 120  # 2-minute cycles
MAX_WORKERS = 4

MANAGER_SYSTEM = """You are the Manager for this project. Follow the MDD loop exactly.

Given system state, output ONE of:
- DISPATCH: <exact shell command to run aider>
- ESCALATE: <markdown content for ESCALATION.md>
- NOTHING: <one-line reason>

Rules:
- Max 4 concurrent Workers (aider processes)
- DISPATCH only for simple, well-defined fixes
- ESCALATE when fix requires architectural judgment
- Be terse. 3 sentences max for any response.
"""

def run_shell(cmd, timeout=30):
    try:
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=timeout)
        return (result.stdout + result.stderr).strip()
    except subprocess.TimeoutExpired:
        return "[command timed out]"

def query_ollama(prompt):
    payload = {
        "model": MANAGER_MODEL,
        "prompt": MANAGER_SYSTEM + "\n\n" + prompt,
        "stream": False,
        "options": {"temperature": 0.1, "num_predict": 300}
    }
    response = requests.post(OLLAMA_URL, json=payload, timeout=60)
    return response.json()["response"].strip()

def count_active_workers():
    result = run_shell("pgrep -f 'aider' | wc -l")
    try:
        return int(result.strip())
    except:
        return 0

def manager_cycle():
    # Gather system state
    tsc = run_shell("npx tsc --noEmit 2>&1 | head -30")
    tests = run_shell("npm test -- --passWithNoTests 2>&1 | tail -20")
    escalation_resp = run_shell("cat ESCALATION_RESPONSE.md 2>/dev/null | head -30")
    active_workers = count_active_workers()
    done_files = run_shell("ls *.worker.done 2>/dev/null")

    state = f"""SYSTEM STATE:

TypeScript check:
{tsc if tsc else "No errors"}

Test output:
{tests if tests else "No test output"}

Escalation response from Architect:
{escalation_resp if escalation_resp else "None"}

Active Workers: {active_workers}/{MAX_WORKERS}

Completed Worker signals:
{done_files if done_files else "None"}
"""

    print(f"[Manager] Querying {MANAGER_MODEL}...")
    decision = query_ollama(state)
    print(f"[Manager] Decision: {decision[:100]}...")

    if decision.startswith("DISPATCH:"):
        command = decision[9:].strip()
        if active_workers < MAX_WORKERS:
            print(f"[Manager] Running: {command}")
            subprocess.Popen(command, shell=True)
        else:
            print(f"[Manager] Worker limit reached. Queuing: {command}")
            with open("WORKER_QUEUE.txt", "a") as f:
                f.write(command + "\n")

    elif decision.startswith("ESCALATE:"):
        content = decision[9:].strip()
        print("[Manager] Writing escalation to Architect...")
        with open("ESCALATION.md", "w") as f:
            f.write(content)

    elif decision.startswith("NOTHING:"):
        print(f"[Manager] {decision}")

    # Process queued Workers if under limit
    if active_workers < MAX_WORKERS and os.path.exists("WORKER_QUEUE.txt"):
        with open("WORKER_QUEUE.txt", "r") as f:
            queued = f.readlines()
        if queued:
            cmd = queued[0].strip()
            remaining = queued[1:]
            subprocess.Popen(cmd, shell=True)
            with open("WORKER_QUEUE.txt", "w") as f:
                f.writelines(remaining)

if __name__ == "__main__":
    print(f"[Manager] Starting MDD loop with {MANAGER_MODEL} (FREE, local)")
    print(f"[Manager] Cycle: every {CYCLE_SECONDS}s | Max Workers: {MAX_WORKERS}")
    while True:
        try:
            manager_cycle()
        except Exception as e:
            print(f"[Manager] Cycle error: {e}")
        time.sleep(CYCLE_SECONDS)
```

Run:
```bash
$ python3 manager_loop_ollama.py
```

---

## Step 3: Worker Dispatch with Aider

Aider supports any LLM backend. Configure based on available models.

### Aider with Local Model (Zero API Cost)

```bash
# Configure aider to use local Ollama model
$ export OLLAMA_API_BASE=http://localhost:11434

# Fix TypeScript error
$ aider --model ollama/llama3.1:70b \
  --message "Fix TS2345 in src/auth/service.ts line 47.
  The validateUser() function expects UserID but receives string.
  Add a cast: (userId as UserID). Do not change function signatures." \
  src/auth/service.ts

# No API call. No cost. Runs locally.
```

### Aider with DeepSeek API (Very Low Cost)

For better Worker quality at minimal cost:

```bash
$ aider --model deepseek/deepseek-coder \
  --message "Fix the TypeScript error in src/auth/service.ts line 47:
  Cast userId to UserID type when calling validateUser()" \
  src/auth/service.ts

# DeepSeek pricing: ~$0.14/M tokens — ~10x cheaper than GPT-4o
```

### Aider with Claude Sonnet (High Quality Workers)

For production-grade Worker output:

```bash
$ export ANTHROPIC_API_KEY=...
$ aider --model claude-sonnet-4-6 \
  --message "Fix TS2345 in src/auth/service.ts:47.
  Cast the userId argument to UserID type." \
  src/auth/service.ts
```

### Dispatching Workers Programmatically

The Manager dispatch command (generated by Llama 3.2):

```bash
# Manager outputs this command:
DISPATCH: aider --model ollama/llama3.1:70b --yes-always \
  --message "Fix TS2345 in src/auth/service.ts line 47: cast userId to UserID" \
  src/auth/service.ts

# Manager runs it as background process:
aider --model ollama/llama3.1:70b --yes-always \
  --message "Fix TS2345 in src/auth/service.ts line 47: cast userId to UserID" \
  src/auth/service.ts &
echo $! > auth-fix.worker.pid
```

---

## Cost Analysis

Full local stack (hardware you already own):

| Tier | Model | Cost/Month |
|------|-------|-----------|
| Architect | llama3.1:405b (local) | $0 |
| Manager | llama3.2 (local) | $0 |
| Workers | aider + llama3.1:70b (local) | $0 |
| **Total** | | **$0/month** |

Hardware cost amortized:
- A machine capable of running 405B needs ~$8,000–15,000 in GPU hardware
- At $0 API costs forever, this pays back in 1–2 years vs. cloud API costs
- For teams, one shared inference server pays back in months

Hybrid stack (local Manager, cloud Architect):

| Tier | Model | Cost/Month |
|------|-------|-----------|
| Architect | claude-opus-4-6 (API) | ~$20–50/month |
| Manager | llama3.2 (local) | $0 |
| Workers | aider + deepseek (API) | ~$5–15/month |
| **Total** | | **~$25–65/month** |

Compare to a naive single-model approach (Opus for everything):
- 24/7 monitoring + coding assistance: ~$300–500/month
- **Hybrid savings: ~85%**

---

## Model Comparison for Each Tier

### Architect Tier (Local Options)

| Model | Params | VRAM | Architecture Quality | Speed |
|-------|--------|------|---------------------|-------|
| llama3.1:405b | 405B | 240GB | Excellent | Slow |
| llama3.1:70b | 70B | 48GB | Very good | Medium |
| deepseek-r1:70b | 70B | 48GB | Excellent (reasoning) | Medium |
| mistral-large | 123B | 80GB | Good | Medium |
| qwen2.5:72b | 72B | 48GB | Very good | Medium |

### Manager Tier (Local Options)

| Model | Params | VRAM | Instruction-Following | Speed |
|-------|--------|------|----------------------|-------|
| llama3.2 | 3B | 4GB | Good | Very fast |
| llama3.2:1b | 1B | 2GB | Adequate | Extremely fast |
| mistral:7b | 7B | 6GB | Good | Fast |
| phi3:mini | 3.8B | 4GB | Good | Very fast |
| gemma2:2b | 2B | 3GB | Good | Very fast |

For the Manager, prioritize speed and instruction-following over raw capability. A 3B model that reliably classifies "simple vs. complex" errors is better than a 70B model that's slow to respond.

---

## Full Session Example

```
[Terminal 1 — Architect, Llama 405B or Opus API]
$ ollama run llama3.1:405b
> [Waiting for escalations. Idle.]

[Terminal 2 — Manager, Llama 3.2 via manager_loop_ollama.py]
[Manager] Starting MDD loop with llama3.2 (FREE, local)
[Manager] Cycle: every 120s | Max Workers: 4

[14:00] Cycle 1:
[Manager] Querying llama3.2...
[Manager] Decision: DISPATCH: aider --model ollama/llama3.1:70b --yes-always...
[Manager] Running: aider --model ollama/llama3.1:70b --yes-always \
  --message "Fix TS2345 in auth/service.ts:47..." auth/service.ts

[14:02] Cycle 2:
[Manager] Querying llama3.2...
[Manager] Decision: NOTHING: No errors detected. Worker completed successfully.

[Cost for this session]
Manager queries: 2 × Llama 3.2 = $0.00
Worker execution: 1 × Llama 70B (local) = $0.00
Total: $0.00
```

---

## Tips for the Open Source / Local Stack

**Llama 3.2 for Manager is sufficient.** The Manager's job is pattern recognition and routing, not reasoning. A 3B model with a good prompt reliably classifies TypeScript errors as "simple" or "complex." Don't over-provision the Manager tier.

**--yes-always with aider.** For non-destructive fixes (type errors, test mocks), run aider with `--yes-always` so it applies changes without prompting. For migrations or schema changes, drop the flag and review.

**Architect locally if possible.** Running 405B locally is slow (minutes per response) but fine for architectural decisions that happen 10–20 times per day. The Architect waits until it's needed.

**DeepSeek for cost-efficient Workers.** If you want API-backed Workers but need to minimize cost, DeepSeek Coder at $0.14/M tokens is excellent for code tasks. The quality difference from GPT-4o is small for scoped fixes.

**Test your Manager model before production.** Run a few manual cycles with your chosen Manager model and verify it correctly classifies a variety of errors. Some small models misclassify architectural issues as "simple." If that happens, switch to a slightly larger model or improve the prompt.

**Aider's --architect flag.** Aider has its own two-model mode (`--architect` flag) that uses a strong model for planning and a cheaper model for editing. This mirrors Maat's philosophy within the Worker tier itself.
