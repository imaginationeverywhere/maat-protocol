# Maat Protocol

**Model-agnostic multi-tier agent orchestration for AI-powered development teams.**

> *Maat (Ma'at) — the ancient Kemetic principle of truth, balance, order, and justice. In the Kemetic cosmology, Maat is the foundation upon which all systems operate in harmony. Without Maat, there is chaos.*

Maat Protocol brings that same principle to AI agent orchestration: **order from chaos, discipline from disorder, harmony from noise.**

---

## The Problem

Everyone is talking about AI agents. Nobody is using them right.

The typical approach:
- One AI model does everything (expensive, slow, wasteful)
- Multiple agents with no coordination (chaos, conflicts, duplicate work)
- Complex frameworks that add more problems than they solve

The result? Burned tokens, wasted compute, and AI agents fighting each other instead of working together.

## The Solution

Maat Protocol defines a **three-tier hierarchy** for AI agent teams that works with ANY LLM provider:

```
ARCHITECT (Tier 1) — Strategy, architecture, complex decisions
    |
MANAGER (Tier 2) — Monitoring, dispatching, quality control
    |
WORKERS (Tier 3) — Code, tests, messages, grunt work
```

**The rules are simple:**
1. **Architects think.** They never do grunt work.
2. **Managers coordinate.** They monitor and dispatch — never write code themselves.
3. **Workers execute.** They do ALL the actual work.

Each tier uses the right tool for the job. An expensive reasoning model for architecture. A cheap/free model for monitoring loops. CLI-based agents for execution.

## Why It Works

| Without Maat | With Maat |
|-------------|-----------|
| Opus/GPT-5 burns messages on monitoring loops | Cheap model handles monitoring (unlimited) |
| One agent tries to do everything | Each agent has ONE focused job |
| No quality gates between steps | Manager validates before moving on |
| Complex orchestration frameworks | Simple hierarchy anyone can implement |
| Locked to one LLM provider | Works with Claude, GPT, Llama, Gemini, Mistral... |

## Quick Start

### Example: Claude Ecosystem

```
Terminal 1 (Architect): claude                    # Opus — architecture only
Terminal 2 (Manager):   claude --model haiku      # Haiku — monitoring loop
Background (Workers):   cursor agent --print ...  # Cursor — code execution
```

### Example: OpenAI Ecosystem

```
Terminal 1 (Architect): chatgpt                   # GPT-5 — architecture only
Terminal 2 (Manager):   chatgpt --model gpt-4o-mini  # Mini — monitoring loop
Background (Workers):   codex agent ...           # Codex — code execution
```

### Example: Open Source / Mixed

```
Terminal 1 (Architect): claude                    # Any strong reasoner
Terminal 2 (Manager):   ollama run llama3         # Local model — free, unlimited
Background (Workers):   aider --model deepseek    # Any code agent
```

## Core Principles

### 1. Separation of Concerns

Every agent has exactly ONE role. An architect never monitors. A manager never writes code. A worker never makes architectural decisions.

### 2. Cost Optimization Through Tiers

The most expensive models (Opus, GPT-5) handle the fewest but most impactful decisions. Cheap/unlimited models handle repetitive work. Workers use specialized code tools.

### 3. Monitor-Decide-Dispatch (MDD)

The Manager tier follows a strict loop:
1. **Monitor** — Check agent output, type errors, test results, file changes
2. **Decide** — Is this a simple fix or an architectural issue?
3. **Dispatch** — Simple? Send a worker. Complex? Escalate to architect.

The manager NEVER does the work itself. It DISPATCHES.

### 4. Model Agnostic

Maat Protocol is not tied to any LLM provider. The pattern works with:
- **Anthropic:** Claude Opus (Architect) + Haiku (Manager) + Cursor (Workers)
- **OpenAI:** GPT-5 (Architect) + GPT-4o-mini (Manager) + Codex (Workers)
- **Meta:** Llama 405B (Architect) + Llama 8B (Manager) + Aider (Workers)
- **Google:** Gemini Ultra (Architect) + Gemini Flash (Manager) + IDX (Workers)
- **Mixed:** Use the best model from each provider at each tier

### 5. Escalation Protocol

```
Simple issues (lint, types, imports)     → Manager dispatches Worker to fix
Test readiness                           → Manager dispatches Worker to notify team
Architectural issues                     → Manager writes report, Architect reviews
```

## Use Cases

### For Solo Developers
Run a Manager loop that monitors your code and dispatches Workers to fix lint errors, type issues, and failing tests while you focus on features.

### For AI-Augmented Teams
Architect plans the sprint. Manager monitors multiple Workers building features in parallel. Workers handle code, tests, and notifications.

### For CI/CD Pipelines
Manager watches deployments. On failure, it dispatches a Worker to diagnose and fix. On success, it dispatches a Worker to notify the team. Architect only engages for rollback decisions.

### For Open Source Maintainers
Manager monitors incoming PRs. Workers run automated reviews, check for breaking changes, and label issues. Architect reviews complex architectural PRs.

### For Cost-Conscious Teams
Stop burning $20/message Opus tokens on "did the build pass?" Use a free local model for monitoring. Reserve premium models for decisions that actually need intelligence.

### For Multi-Model Strategies
Cherry-pick the best model from each provider. Claude for reasoning, GPT for code generation, Llama for local monitoring. Maat Protocol doesn't care what's behind the API.

## Project Structure

```
maat-protocol/
├── README.md              # You are here
├── LICENSE                # Apache 2.0
├── docs/
│   ├── principles.md      # Core principles deep-dive
│   ├── tiers.md           # Tier definitions and responsibilities
│   ├── patterns.md        # Common orchestration patterns
│   └── examples/          # Provider-specific examples
│       ├── claude.md       # Anthropic ecosystem
│       ├── openai.md       # OpenAI ecosystem
│       ├── llama.md        # Meta / open source
│       └── mixed.md        # Multi-provider setups
├── templates/
│   ├── manager-loop.md     # Copy-paste manager loop template
│   └── escalation.md      # Escalation rules template
└── CONTRIBUTING.md        # How to contribute
```

## Roadmap

### Phase 1 (Current)
- Core documentation and principles
- Provider-specific examples (Claude, OpenAI, Llama, Gemini)
- Copy-paste templates for common setups

### Phase 2
- CLI tool for bootstrapping Maat Protocol in any project
- Configuration file format (`.maat.yml`)
- Integration with popular agent frameworks

### Phase 3
- Telemetry and cost tracking across tiers
- Auto-scaling worker count based on queue depth
- Visual dashboard for monitoring agent activity

## The Name

**Maat** (also written Ma'at) is the Kemetic (ancient Egyptian) Neteru (divine principle) of truth, balance, order, harmony, law, morality, and justice. She is depicted with an ostrich feather — the feather against which hearts are weighed in the Hall of Judgment.

In the Kemetic cosmology:
- Without Maat, the universe descends into **Isfet** (chaos, disorder)
- Every action must be measured against Maat — is it balanced? Is it just? Is it ordered?
- The 42 Declarations of Maat guide ethical conduct

Maat Protocol embodies these principles:
- **Truth** — Each agent does exactly what it claims. No hidden complexity.
- **Balance** — Resources allocated where they create the most value.
- **Order** — Clear hierarchy. Clear roles. Clear escalation.
- **Justice** — The right tool for the right job. No waste.

This is not just a clever name. It is a thesis statement. Technology should serve order, not create chaos.

## Contributing

We welcome contributions from AI engineers using any LLM provider. See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

Areas where we need help:
- Examples with LLM providers we haven't covered
- Real-world case studies of multi-agent orchestration
- Templates for specific use cases (CI/CD, code review, testing)
- Translations of documentation

## Author

**Amen Ra** — Builder, architect, member of the Ausar Auset Society.

Building IT economy for communities worldwide. Technology should serve people, not exploit them.

## License

Apache License 2.0 — See [LICENSE](LICENSE) for details.

---

*"Order is the first law of Heaven." — Maat Protocol is the first law of agent orchestration.*
