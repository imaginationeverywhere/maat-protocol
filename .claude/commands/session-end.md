# session-end - Close a Session and Preserve Context

Every great session deserves a proper ending. Not an abrupt stop — a deliberate close. Write down what happened. Flag what's unfinished. Set the next session up for success.

## Usage
```
/session-end
/session-end "Good session, QCR pickup flow is done"
/session-end --exit
```

## Arguments
- `<notes>` (optional) — Any final thoughts or notes to include in the checkpoint
- `--exit` — After writing the checkpoint, exit Claude Code. The session is over.

## What This Command Does

### 1. Gather Session Context
Review the conversation to identify:
- **What was done** — Features built, bugs fixed, decisions made, files changed
- **Decisions made** — Any architectural, strategic, or priority decisions
- **What's pending** — Unfinished work, blocked items, next steps
- **New facts learned** — Anything Amen Ra said that should be in memory but isn't yet

### 2. Write Session Checkpoint
Update `memory/session-checkpoint.md` with a structured summary:

```markdown
# Session Checkpoint — [Date]

## What Was Done
- [Concrete accomplishments]

## Decisions Made
- [Key decisions with context]

## Pending
- [ ] [Unfinished items]
- [ ] [Blocked items with reason]

## New Context
- [Anything important that came up]

## Next Session Should
- [Recommended first actions]
```

### 3. Write Any Pending Memory Files
If Amen Ra shared new facts, corrections, or feedback during the session that haven't been saved to memory yet — write them NOW. Don't let them die with the conversation.

Check:
- Did he correct something? → `feedback-*.md`
- Did he share a new fact about a project? → `project-*.md`
- Did he share something about himself or preferences? → `user-*.md`
- Did he mention an external resource? → `reference-*.md`

### 4. Session Summary
Display a clean closing report:

```
SESSION END — March 15, 2026
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ACCOMPLISHED:
  - [what got done]

DECISIONS:
  - [what was decided]

PENDING:
  - [what's left]

MEMORY UPDATED:
  - session-checkpoint.md (updated)
  - [any new memory files written]

NEXT SESSION:
  - [recommended first actions]

Session saved. Context preserved.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 5. Exit (if --exit flag)
If `--exit` was passed, after writing everything, exit Claude Code cleanly.

## What This Command Does NOT Do
- Does NOT commit code (use `/git-commit-docs` for that)
- Does NOT push to remote
- Does NOT post to Slack
- Does NOT dispatch any agents

This is PRESERVATION. Saving context so the next session doesn't start from zero.

## Why --exit Exists

Sometimes you're done for the night. You don't want to type `/session-end` and then also type `/exit`. One command, clean close:

```
/session-end --exit "Good night. QCR pickup done, start on FMO tomorrow."
```

Checkpoint written. Memory saved. Claude exits. Done.

## Why This Matters

**The self-improving loop depends on this.** If sessions end without checkpoints, the next session starts blind. Every uncheckpointed session is context permanently lost.

The AI takes notes on itself so compaction never loses critical context. This command is half of that loop. `/session-start` is the other half.

## Related Commands
- `/session-start` — Begin a session with full context recovery
- `/gran` — Talk to Granville (architecture)
- `/mary` — Talk to Mary (product/business)
- `/council` — Talk to both Granville and Mary
