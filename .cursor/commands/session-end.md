# /session-end — Close Session and Sync Everything

**EXECUTE IMMEDIATELY when invoked.** This is not documentation — this is a shutdown sequence. Run every step below NOW.

## Arguments
- No args — Full shutdown with vault sync
- `--quick` — Just update tracker and checkpoint, skip S3/Slack
- `"<summary>"` — Use this as the session summary instead of auto-generating

## Execution Steps (DO ALL OF THESE)

### Step 1: Generate Session Summary
Review what was done in this session:
- What files were changed (`git diff --stat` or `git log` since session start)
- What commands were run
- What decisions were made
- What feedback was received from Amen Ra

Write a concise 1-3 line summary.

### Step 2: Update Session Tracker
Read `~/auset-brain/session-tracker.md` and append a new row to the "Most Recent Sessions" table:
```markdown
| <today's date> | <machine> | <project-name> | <summary> | Done |
```

### Step 3: Update or Create Daily Note
Check if `~/auset-brain/Daily/<today YYYY-MM-DD>.md` exists:
- **Exists** → Append this session's work under a new project header
- **Doesn't exist** → Create it with today's date, log this session

Include: project name, what was completed, decisions made, feedback received, what's next.

### Step 4: Update Session Checkpoint
Write `memory/session-checkpoint.md` with:
- What was done this session
- What's pending/next
- Key decisions made
- Any blockers
- Timestamp

### Step 5: Push Vault to S3 (Founders Only)
```bash
aws s3 sync ~/auset-brain/ s3://auset-brain-vault/ --exclude ".git/*" --exclude ".gate-token" --exclude "*.sh" --quiet
```

### Step 6: Post to Slack (if significant work)
If substantial work was done, post summary to #maat-brain:
```bash
SLACK_TOKEN=$(aws ssm get-parameter --name '/quik-nation/shared/SLACK_BOT_TOKEN' --with-decryption --query 'Parameter.Value' --output text --region us-east-1)
curl -s -X POST "https://slack.com/api/chat.postMessage" -H "Authorization: Bearer $SLACK_TOKEN" -H "Content-Type: application/json" -d "{\"channel\":\"C0AKANS4UNB\",\"text\":\"Session ended: $PROJECT — $SUMMARY\"}"
```

### Step 7: Show Shutdown Report
```
SESSION ENDED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Project: <project-name>
  Machine: <hostname>

  Completed:
  - <bullet list of what was done>

  Vault: Synced to S3 ✓
  Daily note: Updated ✓
  Session tracker: Updated ✓
  Checkpoint: Written ✓

  Next session pickup:
  - <what to do next>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## For Developers (Non-Founders)
- Write session log to `~/auset-brain/developers/<username>/sessions/<today>.md`
- Track: project, commands used, files changed, commits made
- No vault push, no Slack post

## Related Commands
- `/session-start` — Initialize session with full context
- `/vault-sync` — Manual vault sync
- `/brain-sync` — Push vault to all channels
