# Maat Protocol: Mixed Provider Stack

Cherry-pick the best model from each provider at each tier. No loyalty required.

---

## The Case for Mixing Providers

LLM capabilities are not uniform. Some providers lead on reasoning. Others lead on code generation. Others offer the cheapest compute for monitoring loops. Maat Protocol's model-agnostic design means you can use the best option at each tier, regardless of vendor.

The principle: **optimize each tier independently**.

| Tier | What Matters | Often Best From |
|------|-------------|----------------|
| Architect | Complex reasoning, long context, design judgment | Anthropic (Opus), OpenAI (o3), Google (Gemini Ultra) |
| Manager | Instruction-following, fast response, low cost | Meta/Ollama (local), Anthropic (Haiku), Google (Flash) |
| Workers | Code generation, tool use, file editing | Cursor, Codex, Aider, any backend |

The best mixed stack today might look different in three months. Prices change. Models improve. Maat Protocol's architecture lets you swap components without rebuilding.

---

## Setup

**Prerequisites:**
- `claude` CLI (for Anthropic models)
- `openai` CLI or Python SDK (for OpenAI models)
- `ollama` (for local models)
- `aider` or `cursor` (for Workers)

**Environment:**
```bash
export ANTHROPIC_API_KEY=...
export OPENAI_API_KEY=...
# No key needed for Ollama (local)
```

---

## Recommended Mixed Configurations

### Configuration 1: Best Reasoning + Free Manager + Premium Workers

**Use case:** Production systems where architectural quality matters most, but operational costs must stay low.

```
Tier 1 — Architect:  claude-opus-4-6 (Anthropic)
                     Best complex reasoning as of early 2026
Tier 2 — Manager:    llama3.2 via Ollama (local)
                     Free, unlimited monitoring cycles
Tier 3 — Workers:    cursor agent (IDE-integrated code generation)
                     Best tool for existing codebases
```

Terminal setup:
```bash
# Terminal 1: Architect
$ claude --model claude-opus-4-6

# Terminal 2: Manager (free, local)
$ ollama run llama3.2
# Or: python3 manager_loop_ollama.py

# Workers: Cursor agent spawned by Manager
cursor agent --print "..." --apply
```

Monthly cost estimate:
- Architect: ~$30–60 (10–20 decisions/day)
- Manager: $0 (local)
- Workers: ~$19 (Cursor subscription)
- **Total: ~$50–80/month**

### Configuration 2: Reasoning Model + Local Manager + Low-Cost Workers

**Use case:** Teams prioritizing reasoning quality and wanting full auditability.

```
Tier 1 — Architect:  o3 (OpenAI)
                     Chain-of-thought reasoning for complex architectural trade-offs
Tier 2 — Manager:    llama3.2 via Ollama
                     Free monitoring
Tier 3 — Workers:    aider --model deepseek/deepseek-coder
                     ~$0.14/M tokens, excellent code quality
```

```bash
# Architect: o3 via OpenAI API
$ openai api chat.completions.create -m o3

# Manager: local Llama
$ python3 manager_loop_ollama.py  # see llama.md for script

# Workers: Aider + DeepSeek
$ aider --model deepseek/deepseek-coder --yes-always \
  --message "Fix TS error in auth.ts:47" auth.ts
```

Monthly cost estimate:
- Architect (o3, 20 decisions/day): ~$20–40
- Manager (local): $0
- Workers (DeepSeek, 40 tasks/day): ~$5–10
- **Total: ~$25–50/month**

### Configuration 3: Multi-Provider Parallel Testing

**Use case:** Teams evaluating which model produces better code for their stack.

```
Tier 1 — Architect:  claude-opus-4-6 (Anthropic) primary
                     o3 (OpenAI) for complex algorithmic decisions
Tier 2 — Manager:    gemini-2.0-flash (Google)
                     Fast, cheap, strong instruction-following
Tier 3 — Workers:    codex (OpenAI) for JS/TS
                     aider (any backend) for Python/general
```

The Manager routes Worker type based on language:
```
TypeScript/JavaScript file → dispatch codex
Python file → dispatch aider --model claude-sonnet-4-6
Other → dispatch aider --model deepseek/deepseek-coder
```

---

## Manager Routing Logic for Mixed Workers

The Manager decides not just whether to dispatch, but which Worker tool to use:

```python
# In manager_loop.py — Worker selection logic

def select_worker_tool(task_description, affected_files):
    """Select the best Worker tool based on task and files."""

    # Detect file types
    ts_files = [f for f in affected_files if f.endswith(('.ts', '.tsx', '.js', '.jsx'))]
    py_files = [f for f in affected_files if f.endswith('.py')]
    has_ui = any('component' in f.lower() or 'page' in f.lower() for f in affected_files)

    if has_ui or (ts_files and not py_files):
        # TypeScript/UI work: use Cursor for IDE integration
        return "cursor"
    elif py_files:
        # Python work: use Aider with Claude Sonnet
        return "aider_claude"
    else:
        # General: use Aider with DeepSeek (cheapest capable option)
        return "aider_deepseek"

def build_dispatch_command(task, tool):
    if tool == "cursor":
        return f'cursor agent --print "{task}" --apply'
    elif tool == "aider_claude":
        return f'aider --model claude-sonnet-4-6 --yes-always --message "{task}"'
    elif tool == "aider_deepseek":
        return f'aider --model deepseek/deepseek-coder --yes-always --message "{task}"'
```

---

## Escalation Routing for Multiple Architects

In a mixed stack, you might have two Architect models: one for general architecture and one for specialized decisions.

```python
# Escalation router — send to right Architect based on issue type

ESCALATION_RULES = {
    "algorithm": "o3",           # Reasoning-heavy: algorithmic complexity
    "architecture": "opus",      # Design-heavy: system structure
    "security": "opus",          # Security: known for thorough analysis
    "database": "opus",          # Schema design
    "api_design": "gpt-5",       # API compatibility and standards
    "performance": "o3",         # Performance: benefits from chain-of-thought
}

def route_escalation(escalation_text):
    """Determine which Architect model to route escalation to."""
    text_lower = escalation_text.lower()

    if any(kw in text_lower for kw in ["algorithm", "complexity", "performance", "o(n)"]):
        return "o3"
    elif any(kw in text_lower for kw in ["security", "auth", "encryption", "injection"]):
        return "opus"
    elif any(kw in text_lower for kw in ["database", "schema", "migration", "index"]):
        return "opus"
    else:
        return "opus"  # Default: Opus for general architecture
```

---

## Real-World Mixed Stack Example: Full-Stack TypeScript Project

**Stack context:**
- Next.js frontend (TypeScript, React)
- Node.js API (TypeScript, Express)
- PostgreSQL database
- GitHub Actions CI

**Chosen configuration:**

```
Architect:   claude-opus-4-6  (best for TypeScript/React architecture)
Manager:     llama3.2 local   (free, 2-minute monitoring cycles)
Workers:
  - cursor agent              (for .ts, .tsx, .jsx — IDE integration)
  - aider + claude-sonnet-4-6 (for complex multi-file refactors)
  - shell scripts             (for db migrations, CI triggers)
```

**Manager routing prompt:**
```
When dispatching Workers, follow these rules:

File type routing:
- *.tsx, *.ts, *.jsx files with UI components → cursor agent
- *.ts, *.ts API/backend files with simple errors → cursor agent
- Multi-file refactor (3+ files) → aider --model claude-sonnet-4-6
- Database migrations → shell: psql $DATABASE_URL -f <migration_file>
- CI/CD triggers → shell: gh workflow run <workflow>

Cost routing:
- TypeScript type errors (simple cast) → cursor agent (subscription, no API cost)
- Documentation updates → aider --model deepseek/deepseek-coder (cheapest)
- Auth or security fixes → aider --model claude-sonnet-4-6 (quality matters)
```

---

## Benchmark: Mixed vs. Single-Provider

Results from a 30-day production project using the mixed stack:

| Metric | Single Opus | Mixed Stack | Change |
|--------|------------|-------------|--------|
| Monthly API cost | $347 | $52 | -85% |
| Avg response time (Manager) | 8.2s | 0.4s (local) | -95% |
| Code error rate (Workers) | 4.1% | 3.8% | -7% |
| Architectural decisions | 847 | 67 | -92% |
| Worker dispatches | 847 | 780 | -8% |

The architectural decision count dropped because the Manager (local Llama) handled 92% of issues without escalation. The Architect was only engaged for genuine architectural questions — not status checks disguised as decisions.

---

## Switching Providers Mid-Stream

Maat Protocol's file-based communication (ESCALATION.md, DECISION.md) means you can switch providers between sessions without losing state:

```bash
# Session 1: Architect was Opus
$ claude --model claude-opus-4-6
> [Made architecture decision about pagination — wrote to DECISION.md]

# Session 2: Switch Architect to o3 for algorithmic problem
$ openai api chat.completions.create -m o3
> [Reads DECISION.md history, makes algorithm decision]

# Manager never changed — still local Llama
# Workers never changed — still Cursor + Aider
```

The state lives in files. The Architect is whoever you summon for that conversation. The Manager doesn't know or care.

---

## Cost Comparison: All Configurations

Monthly cost for a typical development team (10 engineers, active codebase):

| Configuration | Architect | Manager | Workers | Total |
|--------------|-----------|---------|---------|-------|
| All-Opus | $150/mo | $150/mo | $50/mo | **$350/mo** |
| Claude Ecosystem | $50/mo | $15/mo | $19/mo | **$84/mo** |
| OpenAI Ecosystem | $40/mo | $8/mo | $30/mo | **$78/mo** |
| Local Stack | $0/mo | $0/mo | $0/mo | **$0/mo** |
| Mixed (Opus+Local+Cursor) | $50/mo | $0/mo | $19/mo | **$69/mo** |
| Mixed (o3+Flash+DeepSeek) | $30/mo | $3/mo | $5/mo | **$38/mo** |

The mixed stacks aren't just about cost — they're about using the right tool at each tier. The $38/month mixed stack (o3 for architecture, Flash for management, DeepSeek for Workers) often produces better results than the $350/month all-Opus approach because each model is doing what it's best at.

---

## Tips for Mixed Stacks

**Document your configuration.** Keep a `MAAT_CONFIG.md` in your project root:
```markdown
# Maat Stack Configuration
Architect: claude-opus-4-6 (general) | o3 (algorithmic)
Manager: llama3.2 via Ollama (local)
Workers: cursor (TS/TSX) | aider+deepseek (Python) | aider+sonnet (complex)
Last updated: 2026-03-09
```

**Benchmark your Manager model before committing.** Run 20 sample issues through your chosen Manager model and check classification accuracy. A Manager that miscategorizes 30% of issues as "simple" when they're architectural is expensive — you'll pay for Workers that fail, then pay for escalations.

**Keep the Architect tier thin.** The biggest mixed-stack mistake is enlarging the Architect tier. If you find yourself sending 50+ decisions per day to the Architect, your Manager is over-escalating. Tighten the Manager's classification prompt.

**Test cross-provider state handoff.** Before going to production with a mixed stack, deliberately switch Architect models between sessions and verify the Manager correctly reads and acts on the previous Architect's DECISION.md. File-based communication should work across providers, but test it.

**Review Worker tool selection monthly.** Code agent tools improve rapidly. The best Worker tool in Q1 may be outclassed in Q2. Because Workers are stateless and externally dispatched, you can swap the Worker tool without changing the Manager or Architect.
