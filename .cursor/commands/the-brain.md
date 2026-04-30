# /the-brain — Query the Heru Knowledge Engine

Before answering any question about this project, the agent MUST check the brain.
This is the self-retrieval mandate in action. Never ask Mo what is already in the brain.

## Usage

```
/the-brain "what is the current sprint focus"
/the-brain "who owns the brain API deployment"
/the-brain "what is the pricing model for clara code"
/the-brain "what decisions were made about agent capacity limits"
/the-brain "what is the QCS1 directory structure"
```

## What This Command Does

1. Reads `.claude/brain-config.json` (or `.clara/brain-config.json`) to get `brain_url` and `tenant_id`
2. Runs `brain_query({ topic: "<your question>", k: 10 })` via the `clara-brain` MCP server
3. Returns the top results with source citations
4. If brain is unreachable → falls back to vault grep (see §6.10 of BRAIN.md)

## Execution

### Step 1 — Load brain config

```bash
CONFIG=$(cat .claude/brain-config.json 2>/dev/null || cat .clara/brain-config.json 2>/dev/null)
BRAIN_URL=$(echo "$CONFIG" | jq -r '.brain_url')
TENANT_ID=$(echo "$CONFIG" | jq -r '.tenant_id')

if [ -z "$BRAIN_URL" ] || [ "$BRAIN_URL" = "null" ]; then
  echo "⚠ No brain-config.json found. Run /brain-init first."
  exit 1
fi

echo "Brain: $BRAIN_URL"
echo "Tenant: $TENANT_ID"
```

### Step 2 — Query the brain

Use the MCP tool directly:

```
brain_query({ topic: "<ARGS>", k: 10 })
```

The `clara-brain` MCP server reads `tenant_id` from the brain config automatically.
Results come back as ranked chunks with source file paths.

### Step 3 — Degraded mode (brain unreachable)

If `brain_query` returns a 5xx, timeout, or MCP error:

```bash
echo "DEGRADED MODE — brain API unavailable; using vault grep fallback."
grep -Rl "<keyword>" ~/auset-brain/ --include='*.md' 2>/dev/null | head -10
```

Read the best-matching notes and flag the outage in `#maat-discuss`.

### Step 4 — Report results

Format output as:

```
BRAIN QUERY: "<topic>"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Tenant:  <tenant_id>
Brain:   <brain_url>  ✓ LIVE

RESULTS (top N):

[1] <source file>
    <excerpt — 2-4 sentences>

[2] <source file>
    <excerpt — 2-4 sentences>

...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

If no results: say so clearly and suggest ingesting the relevant docs via `brain-add`.

## When to use /the-brain

- Before asking Mo any question about the project
- When starting a new task — check context first
- When there's a decision to make — check what was already decided
- When the code doesn't explain itself — check the brain for the WHY

## The Rule (§6.10 BRAIN.md — NON-NEGOTIABLE)

> An agent that does not know or does not remember something about its own project
> MUST retrieve and verify BEFORE surfacing any question to Mo.

`/the-brain` is the primary retrieval tool. Use it. Every time.

## Related Commands

- `/brain-init` — Wire this Heru to its brain endpoint
- `/brain-add` — Ingest a file, URL, or transcript into the brain
- `/session-start` — Runs brain queries at session start automatically
