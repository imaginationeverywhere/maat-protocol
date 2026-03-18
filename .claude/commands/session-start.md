# session-start - Begin a Session with Full Context

Named after the ritual of preparation. Before Granville invented, before Mary built the business, before Maya wrote, before Nikki spoke — they prepared. They gathered what they knew. They remembered what mattered. Then they began.

That's what this command does. It prepares the mind before the work begins.

## Usage
```
/session-start
/session-start "Working on QCR pickup flow today"
/session-start --quick
```

## Arguments
- `<focus>` (optional) — What you plan to work on this session. Helps prioritize which memory to surface.
- `--quick` — Skip Slack check, just load memory and checkpoint. Fast start.
- `--full` — Full startup: memory + checkpoint + Slack + boilerplate update check + task list review.

## What This Command Does

Runs the session startup ritual in this order:

### 1. Read Session Checkpoint
Read `memory/session-checkpoint.md` to recover state from the last session:
- What was done
- Decisions made
- What's still pending
- Key context that survived compaction

**Display:** Brief summary of where we left off.

### 2. Read Memory Index
Read `memory/MEMORY.md` and load the LESSONS LEARNED section — these are the rules that prevent repeated mistakes:
- Opus doesn't dispatch or write code
- Never ask Quik to run commands
- Never touch Screen Sharing on QC1
- Ephemeral swarm, not static EC2s
- Cursor is primary agent
- And all other feedback files

If `<focus>` was provided, also load topic-specific memory files relevant to that work.

### 3. Check Slack #maat-discuss (unless --quick)
Read the last 10 messages from `#maat-discuss` (C0AKQ8J63CN) — Amen Ra's direct line:
```bash
SLACK_TOKEN=$(aws ssm get-parameter --name '/quik-nation/shared/SLACK_BOT_TOKEN' --with-decryption --query 'Parameter.Value' --output text --region us-east-1) && curl -s "https://slack.com/api/conversations.history?channel=C0AKQ8J63CN&limit=10" -H "Authorization: Bearer $SLACK_TOKEN"
```
Summarize any flagged items, priorities, blockers, or decisions.

### 4. Report to User
Display a clean startup report:

```
SESSION START — March 15, 2026
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

LAST SESSION:
  [2-3 line summary of what happened]

PENDING:
  - [unfinished items from checkpoint]

LESSONS LOADED: [count] rules active

SLACK (#maat-discuss):
  [any flagged items, or "No new items"]

FOCUS: [whatever the user said, or "General session"]

Ready. What are we building?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 5. Initialize Session Tracking
Start tracking significant actions for the checkpoint update cycle (~every 10 actions).

## What This Command Does NOT Do
- Does NOT run boilerplate update checks (that's `session-startup-handler`)
- Does NOT create tasks or plans
- Does NOT start any agents or dispatch work
- Does NOT write any code

This is PREPARATION. Gathering context. Becoming ready.

## Why This Matters

Context loss is the #1 killer of productivity across Claude sessions. Every session starts from zero unless we actively recover state. This command is the antidote.

**Without `/session-start`:** "What were we working on?" → 10 minutes of archaeology.
**With `/session-start`:** Full context in 15 seconds. Start building immediately.

## Related Commands
- `/session-end` — Close the session, write checkpoint, preserve context
- `/gran` — Talk to Granville (architecture)
- `/mary` — Talk to Mary (product/business)
- `/council` — Talk to both Granville and Mary
