# dispatch-cursor - Remote Control Cursor Agent from Claude Code

Dispatch tasks to Cursor Agent CLI without opening the IDE. Claude Code thinks, Cursor Agent builds. Save Max plan messages for architecture — let Cursor Ultra handle the scaffolding.

**Agent:** `cursor-orchestrator`
**Skill:** `cursor-orchestration`

**Why this matters:**
- Cursor Ultra = unlimited usage, Claude Max = hourly/weekly limits
- No IDE open = saves CPU/RAM (Cursor GUI eats ~1GB+ RAM)
- Claude Code orchestrates, Cursor Agent executes — parallel across Herus
- One brain (Opus), many hands (Cursor agents)

## Usage
```
/dispatch-cursor "Add CRUD resolvers for the booking feature"
/dispatch-cursor --heru quikcarrental "Scaffold the vehicle listing API"
/dispatch-cursor --all-herus "Add the auth middleware from .claude/plans/micro/16-auset-activation.md"
/dispatch-cursor --plan "What needs to change to add WebSocket support?"
/dispatch-cursor --model sonnet-4 "Generate test files for all resolvers"
/dispatch-cursor --parallel --herus quikcarrental,quikvibes,site962 "Add Clerk auth guards"
```

## Arguments
- `<prompt>` (required) — The task to send to Cursor Agent
- `--heru <name>` — Target a specific Heru project by name (fuzzy matched)
- `--herus <name1,name2,...>` — Target multiple specific Herus (comma-separated)
- `--all-herus` — Dispatch to ALL Heru projects (use with caution)
- `--plan` — Read-only mode: Cursor analyzes but makes no changes
- `--ask` — Q&A mode: Cursor answers questions about the codebase
- `--model <model>` — Cursor model to use (default: auto). Options: auto, sonnet-4, gpt-5.2, gpt-5.3-codex, etc.
- `--force` — Auto-approve all Cursor tool calls (no permission prompts)
- `--yolo` — Alias for --force
- `--parallel` — Run multiple Herus simultaneously (default for --all-herus)
- `--sequential` — Run Herus one at a time (safer, see output as it goes)
- `--context <file>` — Pass a file as additional context (e.g., a plan or spec)
- `--dry-run` — Show the command that would execute without running it
- `--background` — Run in background, report results when done

## How It Works

### Step 1: Resolve Target Project(s)

If `--heru <name>` is provided, fuzzy-match against discovered Heru projects:
```bash
# Discover all Herus
HERUS=$(find /Volumes/X10-Pro/Native-Projects -maxdepth 4 -name ".claude" -type d 2>/dev/null \
  | grep -v node_modules | grep -v ".git/" | grep -v quik-nation-ai-boilerplate)

# Fuzzy match: "quikcar" matches "quikcarrental"
MATCH=$(echo "$HERUS" | grep -i "$HERU_NAME" | head -1)
PROJECT=$(dirname "$MATCH")
```

If no `--heru` flag, use the current working directory.

### Step 2: Build the Cursor Agent Command

```bash
# Base command
CMD="cursor agent --print --trust"

# Add workspace
CMD="$CMD --workspace $PROJECT"

# Add model if specified
if [ -n "$MODEL" ]; then
  CMD="$CMD --model $MODEL"
fi

# Add mode if specified
if [ "$MODE" = "plan" ]; then
  CMD="$CMD --mode plan"
elif [ "$MODE" = "ask" ]; then
  CMD="$CMD --mode ask"
fi

# Add force if specified
if [ "$FORCE" = true ]; then
  CMD="$CMD --force"
fi

# Add the prompt
CMD="$CMD \"$PROMPT\""
```

### Step 3: Enhance the Prompt

Before dispatching, Claude Code enhances the raw prompt with context:

```
You are working on the {HERU_NAME} project, a Heru born from the Auset Platform.

TASK: {USER_PROMPT}

CONTEXT:
- This project uses the Quik Nation AI Boilerplate conventions
- Read CLAUDE.md for project-specific instructions
- Read .claude/commands/ for available workflows
- Follow Kemetic naming conventions (see CLAUDE.md)
{OPTIONAL: Contents of --context file}

CONSTRAINTS:
- Only modify files relevant to the task
- Follow existing code patterns in the project
- Do not modify .claude/ or .cursor/ directories (those are synced from boilerplate)
```

### Step 4: Execute

**Single Heru:**
```bash
cursor agent --print --trust --force --workspace "$PROJECT" "$ENHANCED_PROMPT"
```

**Multiple Herus (parallel):**
```bash
for PROJECT in $TARGET_PROJECTS; do
  cursor agent --print --trust --force --workspace "$PROJECT" "$ENHANCED_PROMPT" \
    > "/tmp/dispatch-$(basename $PROJECT).log" 2>&1 &
done
wait
```

**Multiple Herus (sequential):**
```bash
for PROJECT in $TARGET_PROJECTS; do
  echo "=== Dispatching to $(basename $PROJECT) ==="
  cursor agent --print --trust --force --workspace "$PROJECT" "$ENHANCED_PROMPT"
done
```

### Step 5: Collect and Report Results

```
DISPATCH RESULTS — Cursor Agent
================================

  Task: "Add CRUD resolvers for the booking feature"
  Model: auto
  Mode: agent (full access)

  quikcarrental ............. DONE (12 files modified, 3 created)
  quikvibes ................. DONE (8 files modified, 2 created)
  site962 ................... DONE (6 files modified, 1 created)

  Total: 3 Herus, 3 succeeded, 0 failed
  Time: 2m 34s

  Review the changes:
    cd /path/to/quikcarrental && git diff
    cd /path/to/quikvibes && git diff
```

## Workflow Patterns

### Pattern 1: Claude Plans, Cursor Builds
```bash
# 1. Claude Code creates the plan
/plan-design "Add real-time notifications to quikevents"

# 2. Dispatch each story to Cursor Agent
/dispatch-cursor --heru quikevents --context .claude/plans/notifications-plan.md \
  "Implement Story 1: WebSocket server setup"

/dispatch-cursor --heru quikevents --context .claude/plans/notifications-plan.md \
  "Implement Story 2: Notification GraphQL subscriptions"

# 3. Claude Code reviews
/review-code
```

### Pattern 2: Mass Scaffolding
```bash
# Scaffold the same feature across all Herus
/dispatch-cursor --all-herus --force \
  "Add the standard health check endpoint at GET /api/health that returns { status: 'ok', timestamp: Date.now() }"
```

### Pattern 3: Analysis Without Changes
```bash
# Ask Cursor to analyze without touching code
/dispatch-cursor --heru quikcarrental --plan \
  "What would need to change to add Yapit as a second payment provider alongside Stripe?"
```

### Pattern 4: Parallel Feature Sprint
```bash
# Different tasks to different Herus simultaneously
/dispatch-cursor --heru quikcarrental "Add vehicle image upload with S3" &
/dispatch-cursor --heru quikvibes "Add playlist sharing feature" &
/dispatch-cursor --heru site962 "Add event check-in QR code generator" &
# Wait for all to complete
```

### Pattern 5: Review and Fix Cycle
```bash
# 1. Cursor builds
/dispatch-cursor --heru dreamihaircare "Add the appointment booking flow"

# 2. Claude reviews (saves Max messages for the important stuff)
/review-code --workspace /path/to/dreamihaircare

# 3. Cursor fixes based on review
/dispatch-cursor --heru dreamihaircare "Fix the issues from the code review: [paste review]"
```

## Token Economics

| Action | Claude Max Cost | Cursor Ultra Cost |
|--------|----------------|-------------------|
| Planning & architecture | 1 message | $0 |
| Scaffolding 10 files | 0 messages | $0 (unlimited) |
| Code review | 1 message | $0 |
| Fix review issues | 0 messages | $0 (unlimited) |
| **Total per feature** | **2 messages** | **$0** |

vs. doing everything in Claude Code: **~8-15 messages per feature**

## Safety

- `--plan` and `--ask` modes are read-only — safe for exploration
- Without `--force`, Cursor Agent will prompt for each tool call (but you won't see it in --print mode, so use --force for non-interactive)
- `--all-herus` always requires confirmation before executing
- Changes are NOT auto-committed — review with `git diff` first
- Use `--dry-run` to preview the exact command before executing

## Related Commands
- `/sync-herus` — Push platform files to all Herus (file sync, not code generation)
- `/plan-design` — Create plans that Cursor Agent can execute
- `/review-code` — Review what Cursor Agent built
- `/gap-analysis` — Check what's done vs. what's planned
- `/progress` — Quick progress dashboard
