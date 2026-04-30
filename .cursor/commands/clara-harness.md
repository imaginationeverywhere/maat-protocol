# /clara-harness — Talk to the Clara Harness Team

**Team alias:** `clara-harness` (was `/clara-platform`)
**Working directory:** `/Volumes/X10-Pro/Native-Projects/AI/clara-harness`
**Repo:** `imaginationeverywhere/clara-harness` (our customized harness — was the renamed Hermes fork)
**Upstream tracking:** `imaginationeverywhere/hermes-agent` (clean fork of `NousResearch/hermes-agent` — pull updates from there, never edit it)
**tmux tab:** `CH` (swarm:9)

**Team:** Annie · Jerry · Skip · Roy

---

## Architectural Premise (NON-NEGOTIABLE)

Clara Harness is **OUR runtime**. It is NOT the upstream Hermes fork.

- `clara-harness` repo = where /clara-platform builds, customizes, ships our agent runtime. All Clara-specific code lives here.
- `hermes-agent` repo (our org) = clean fork of NousResearch/hermes-agent. It exists ONLY to track upstream releases. Pull updates from it into `clara-harness` via `git fetch upstream && git merge upstream/main` (the `upstream` remote on the local `clara-harness` clone already points to `NousResearch/hermes-agent`).

The Hermes Release Watcher (cron `0 */6 * * *`, posts to `#maat-discuss` via Granville bot) tells us when upstream ships. Decision to absorb v0.X+ is /clara-platform-runtime team's call, made in this repo, on a feature branch.

---

## The Team

| Agent | Role | Namesake |
|---|---|---|
| **Annie** | PO | Annie J. Easley (1933-2011) — NASA rocket scientist, Centaur rocket programmer |
| **Jerry** | Tech Lead | Jerry Lawson (1940-2011) — Invented the video game cartridge / modular harness architecture |
| **Skip** | Backend Eng | Clarence "Skip" Ellis (1943-2014) — First Black CS PhD, Xerox PARC groupware pioneer |
| **Roy** | DevOps/Infra | Roy Clay Sr. (1929-2024) — "Godfather of Silicon Valley," built HP computing from nothing |

---

## Usage

```
/clara-harness                          # Open team conversation in clara-harness dir
/clara-harness "ship Clara tonight"     # Direct task to the team
/clara-harness --status                 # Current harness status
/clara-harness --upstream               # Check NousResearch/hermes-agent for new releases
/clara-harness --merge-upstream         # Pull latest upstream into a feature branch
/clara-harness --infra                  # Roy's infrastructure check
```

---

## What This Team Owns

```
┌─────────────────────────────────────────────────────────┐
│              Clara Harness Team Scope                    │
│                                                          │
│  Clara Harness runtime  (imaginationeverywhere/          │
│                          clara-harness)                  │
│  Modal serverless deployment (claraagents.com gateway)   │
│  AWS Bedrock — DeepSeek V3.2 (LLM inference)             │
│  Clara Voice server (STT/TTS/cloning)                    │
│  Agent SOUL.md configs (all 85+ agents eventually)       │
│  Memory system (~/auset-brain/agents/<name>/)            │
│  Talents system (capabilities)                           │
│  Gears system (service plug-ins)                         │
│  Upstream Hermes tracking + selective merging            │
└─────────────────────────────────────────────────────────┘
```

---

## Mo Communicates Directly

Mo talks to this team the same way he talks to any other — voice, Slack, or this command.
Annie takes the strategic questions. Jerry takes the technical ones. Skip takes the integration questions. Roy takes the infrastructure questions.

---

## Infrastructure Truth Table

| Layer | Platform | Owner |
|---|---|---|
| Voice STT/TTS | Modal (Clara Voice) | Roy (infra) + Skip (wiring) |
| LLM inference | AWS Bedrock — DeepSeek V3.2 | Roy (access) + Jerry (architecture) |
| Agent runtime | Modal (serverless, clara-harness build) | Jerry (deploy) + Roy (secrets) |
| Agent identity | SOUL.md + config.yaml | Skip (writes) + Annie (approves) |
| Gateway domain | claraagents.com | Roy (DNS) + Jerry (routing) |
| Upstream Hermes | NousResearch/hermes-agent | Jerry (decides what to merge) |

---

## Repo Discipline

- **Edits go in `clara-harness`** (this team's home repo). Never edit `imaginationeverywhere/hermes-agent` — that's the clean upstream fork.
- **Pulling upstream:** `cd clara-harness && git fetch upstream && git checkout -b absorb-upstream-vX.Y && git merge upstream/main` → resolve conflicts → review → merge to develop after Jerry approves.
- **Direct merges to develop** — no PRs while Mo is the only human (mandate 2026-04-27).
- **`develop → main` requires explicit Mo permission.**

---

## Related Commands
- `/gran` — Granville (HQ Architect) — escalate architecture decisions here
- `/mary` — Mary (Product) — escalate product decisions here
- `/devops` — DevOps Team — EC2, Cloudflare, AWS infra
- `/ruby` — Ruby — name new agents
- `/ossie` — Ossie — deploy new agents

---

## Notes
- `/clara-platform` slash command is kept as a **legacy alias** for muscle memory; both commands route to the same team.
- The Hermes Release Watcher (local cron, Granville bot voice) posts upstream releases to `#maat-discuss`. When a release lands, Jerry decides whether to absorb.
