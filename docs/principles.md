# Core Principles of Maat Protocol

Five principles separate disciplined agent orchestration from expensive chaos. Each one has a name, a reason, and a concrete before/after.

---

## 1. Separation of Concerns

**The principle:** Every agent has exactly one role. That role never bleeds into another tier.

An Architect that monitors build status is wasting premium tokens on a task a free model can handle. A Manager that writes code is bypassing the Worker tier — and destroying accountability. A Worker that makes design decisions is introducing unauthorized complexity into a system someone else owns.

When roles blur, costs spike and quality degrades. You lose auditability. You lose predictability. You lose the ability to reason about what your agents are doing.

**Without it:**

You assign one powerful AI (say, Claude Opus) to "manage the project." It writes code, answers questions, monitors CI, reviews PRs, and makes architecture calls — all in the same context window. It burns tokens on trivial tasks. It can't parallelize. When something goes wrong, you don't know which "role" caused it.

```
# Bad: One model doing everything
claude "You are my AI engineer. Monitor the build, fix any errors,
write the new auth module, review PRs, and tell me if we need
to change the database schema."

# Result: Opus burns $0.80/message checking if the build passed.
# Single-threaded. No parallelism. No accountability.
```

**With it:**

Three tiers, three tools, each doing one thing.

```
# Terminal 1 — Architect (Opus): Architecture only
claude "We need to redesign the auth module to support OAuth2.
Design the approach."

# Terminal 2 — Manager (Haiku): Monitoring only
claude --model haiku "Monitor the build. If it passes, dispatch
a worker to notify Slack. If it fails, write a report for the architect."

# Background — Worker (Cursor): Execution only
cursor agent --print "Implement the OAuth2 auth module per the
architect's spec in SPEC.md"
```

Each agent does one thing. Each can run independently. If Haiku makes a bad dispatch decision, that's a Manager problem — not an Architect problem, not a Worker problem. Isolated. Debuggable.

---

## 2. Cost Optimization Through Tiers

**The principle:** Match model capability to task complexity. Never use a $20/million-token model for a $0.01 task.

The most capable AI models are also the most expensive. That's fine — when they're doing work that actually requires their capability. The problem is using them for monitoring loops, status checks, and file scanning that a model 50x cheaper handles just as well.

Maat Protocol forces you to think about which tier a task belongs to before assigning a model to it.

| Task | Required Intelligence | Right Tier | Right Model |
|------|----------------------|-----------|-------------|
| Design a new microservice architecture | High | Architect | Opus / GPT-5 |
| Decide if a TypeScript error is simple or complex | Medium | Manager | Haiku / GPT-4o-mini |
| Fix a missing import statement | Low | Worker | Cursor / Codex / Aider |
| Check if `npm test` passed | Near-zero | Manager | Haiku / local Llama |

**Without it:**

A team uses Claude Opus for everything. The Opus agent runs a monitoring loop checking build status every 5 minutes and dispatching fixes. At $15 per million output tokens, a busy day of monitoring costs $40–80 in tokens alone — for tasks that require no reasoning.

```
# Expensive mistake: Opus monitoring builds
$ claude  # Opus, ~$15/M output tokens
> Monitor the CI build every 5 minutes. If it fails, fix it.

# 288 checks per day × average 500 output tokens = 144,000 tokens/day
# 144,000 × $0.000015 = $2.16/day just for "did it pass?"
# With complex context: easily $10–40/day
```

**With it:**

Haiku handles monitoring at 1/15th the cost. Opus only engages when Haiku escalates a genuinely complex issue.

```
# Tier 2: Haiku monitoring (~$0.25/M output tokens)
$ claude --model haiku
> Monitor CI every 5 minutes. Simple failures: dispatch a worker.
> Complex issues: write a report for the architect.

# Same 144,000 tokens/day = $0.036/day
# Savings: ~98% on monitoring costs
# Opus only pays for architectural decisions — where it's worth $15/M
```

Real-world breakdown for a 10-hour coding day:

| Role | Model | Messages | Cost/Day |
|------|-------|---------|---------|
| Architect | Opus | ~20 | ~$3.00 |
| Manager | Haiku | ~500 | ~$0.50 |
| Workers | Cursor | unlimited | subscription |
| **Total** | | | **~$3.50** |
| **Without Maat** | Opus only | ~520 | ~$78.00 |

---

## 3. Monitor-Decide-Dispatch (MDD)

**The principle:** The Manager tier follows a strict three-step loop — never skipping, never short-circuiting, never doing the work itself.

MDD is the heartbeat of Maat Protocol. It defines exactly what a Manager does and — critically — what it never does.

```
MONITOR  →  DECIDE  →  DISPATCH
   ↑                        |
   └────────────────────────┘
```

**Monitor:** Observe the system state. Read logs. Check test output. Scan for type errors. Watch for file changes. This is passive data collection — the Manager doesn't act yet.

**Decide:** Classify what was observed. Is this a simple fix (missing import, lint error, typo)? Is it something the architect needs to review (API design conflict, database schema question, security concern)? Is it nothing (build passed, tests green)?

**Dispatch:** Act on the decision. Send a Worker to fix it. Write a report for the Architect. Do nothing. The Manager never executes the fix itself.

**Without it:**

A "Manager" agent detects a TypeScript error and immediately tries to fix it in the same context. It modifies code files, creates new ones, runs tests to verify the fix — all in the Manager's context. Now the Manager is a Worker. The Worker tier is bypassed. If the "fix" introduces new problems, you can't tell where the error originated.

```
# Bad: Manager acting as Worker
Manager: "I see a type error in auth.ts line 42. Let me fix it.
(writes code) (runs tests) (commits) Done."

# Problems:
# - Manager context bloated with code changes
# - No separation between "decided to fix" and "fixed"
# - Manager state becomes unpredictable after many fixes
# - Can't audit: was this a Manager decision or Worker execution?
```

**With it:**

The Manager observes, classifies, and dispatches. The Worker executes in isolation.

```
# Good: Manager following MDD
Manager (MONITOR):
  "Checking tsc output..."
  "Found: TS2345 in auth.ts:42 — Argument of type 'string' not
   assignable to parameter of type 'UserID'"

Manager (DECIDE):
  "This is a type mismatch on a plain function argument.
   No architectural implications. Simple fix. → Dispatch Worker."

Manager (DISPATCH):
  cursor agent --print "Fix TS2345 in auth.ts line 42.
  The argument passed to validateUser() needs to be cast to UserID.
  Do not change function signatures." --apply
```

The Manager's context stays clean. The Worker handles the change. The Manager loops back to Monitor to verify the fix worked.

**The MDD cycle time** should be fast — 30 seconds to 5 minutes depending on the monitoring target. Long Manager context windows are a code smell: the Manager is doing too much.

---

## 4. Model Agnostic

**The principle:** The hierarchy is the framework. Any model can fill any tier. No vendor lock-in.

Maat Protocol is a pattern, not a product. It doesn't care whether your Architect is Claude Opus, GPT-5, Gemini Ultra, or a fine-tuned Llama. What matters is the role each model plays and the rules it follows.

This is deliberate. LLM pricing changes every quarter. Models improve faster than documentation. The best model for your use case in March might be a different provider in June. You should be able to swap providers without rebuilding your orchestration logic.

**The tier requirements are behavioral, not model-specific:**

| Tier | Requirements |
|------|-------------|
| Architect | Strong reasoning. Handles ambiguity. Makes architectural decisions. Can be interrupted rarely (expensive is fine). |
| Manager | Fast. Cheap. Follows structured instructions. Handles the MDD loop reliably. |
| Workers | Tool use. Code execution. Can operate via CLI. Handles scoped tasks without persistent context. |

**Without it:**

A team builds their entire orchestration around Claude-specific tooling. Prompt formats assume Anthropic's system prompt structure. The Manager loop uses Claude Code-specific slash commands. When Anthropic changes pricing, they're locked in.

```
# Locked-in: Claude-specific orchestration
# Uses Claude Code's /loop command, Claude-specific prompts,
# assumes Haiku is always the cheapest option.
# When prices change or a better option emerges — rework everything.
```

**With it:**

The same hierarchy runs on any provider. The prompts are behavioral, not model-specific.

```
# Anthropic stack
Architect: claude --model claude-opus-4-6
Manager:   claude --model claude-haiku-4-5
Workers:   cursor agent

# OpenAI stack (same pattern, different tools)
Architect: openai api chat.completions --model gpt-5
Manager:   openai api chat.completions --model gpt-4o-mini
Workers:   codex agent

# Local / open source (zero API cost for Manager)
Architect: claude --model claude-opus-4-6  # or any strong model
Manager:   ollama run llama3.2             # free, local, unlimited
Workers:   aider --model deepseek/deepseek-coder

# Mixed (cherry-pick best per tier)
Architect: claude --model claude-opus-4-6  # best reasoner
Manager:   ollama run llama3.2             # free monitoring
Workers:   cursor agent                    # best code tool
```

The pattern is identical. The tools change. Migration to a new provider is a configuration change, not a rewrite.

---

## 5. Escalation Protocol

**The principle:** Every issue has a predetermined escalation path. Workers never skip to Architect. Managers never handle what belongs to Architect. The path is defined before work starts.

Without a clear escalation protocol, agents improvise. A Worker that hits a confusing requirement might try to design around it — silently introducing technical debt. A Manager that finds an architectural conflict might try to resolve it without the Architect — silently breaking the system design. Clear escalation rules prevent this.

The protocol has three levels:

```
Level 1 — Worker handles it:
  Lint errors, type errors, missing imports, test failures with
  known fix patterns, formatting, documentation updates

Level 2 — Manager reports to Architect:
  Conflicting requirements, performance questions, security concerns,
  API design ambiguities, unclear specifications, failures that
  require understanding intent

Level 3 — Architect decides:
  New feature design, system architecture changes, breaking API
  changes, vendor/model selection, prioritization conflicts
```

**Without it:**

A Worker encounters a requirement that contradicts an earlier design decision. It guesses. It implements something that "works" but violates the intent. The Manager doesn't recognize the issue as architectural. The Architect finds out three features later when the technical debt has compounded.

```
# No escalation protocol
Worker: "The spec says use UUID for user IDs but the existing
code uses integer IDs everywhere. I'll just convert everything
to UUIDs. That seems right."

# Worker made an architectural decision.
# Manager didn't know to escalate it.
# Architect wasn't consulted.
# Result: breaking database migration that affects 12 other services.
```

**With it:**

The escalation rule is explicit. When the Worker hits ambiguity, it stops and reports. The Manager recognizes the pattern and escalates.

```
# With escalation protocol defined upfront:

# In templates/escalation.md:
# "If a Worker encounters a spec that conflicts with existing
#  implementation decisions, STOP. Report to Manager.
#  Do not implement a resolution."

Worker (STOPS): "Conflict detected: spec requires UUID IDs, but
  existing schema uses integers. See escalation-report.md."

Manager (RECOGNIZES): "Worker stopped on architectural conflict.
  This is Level 2 — requires Architect review."

Manager (REPORTS to Architect): "Auth service has a UUID/integer
  ID conflict. Worker is paused. Needs architectural decision."

Architect (DECIDES): "Keep integers. Add a UUID alias column.
  Here's the migration plan..."

# Result: One clear decision. No guessing. No hidden debt.
```

The escalation protocol is the Architect's insurance policy. It guarantees that decisions requiring architectural judgment always reach the Architect — regardless of which model is running the Manager or Worker tiers.

---

## How the Principles Work Together

These five principles are not independent. They reinforce each other:

- **Separation of Concerns** makes **Cost Optimization** possible — you can only use cheap models for cheap tasks if roles are clearly separated.
- **MDD** operationalizes **Separation of Concerns** — the loop structure is what keeps the Manager from becoming a Worker.
- **Model Agnostic** makes the system durable — you don't build around a specific model's quirks, you build around the hierarchy.
- **Escalation Protocol** makes **Separation of Concerns** enforceable — without it, Workers would still make architectural decisions, just accidentally.

Together, they define a system where every agent knows its role, works at the right cost point, and passes decisions up the chain when they exceed its authority.

That is Maat. Order from chaos.
