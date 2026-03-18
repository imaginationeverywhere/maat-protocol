# /session-start — Initialize Session with Full Context

**EXECUTE IMMEDIATELY when invoked.** This is not documentation — this is a startup sequence. Run every step below NOW.

## Execution Steps (DO ALL OF THESE)

### Step 1: Identify Who's Here
Run these commands and report the results:
```bash
GIT_EMAIL=$(git config user.email)
GH_USER=$(gh api user --jq '.login' 2>/dev/null)
PROJECT=$(basename $(pwd))
MACHINE=$(hostname -s)
ORG=$(git remote get-url origin 2>/dev/null | sed -E 's|.*github\.com[:/]([^/]+)/.*|\1|')
```

Determine role:
- `amenray2k` or `cto@quiknation.com` → **Founder (Amen Ra)** — full vault access
- `quikv` → **Founder (Quik)** — full vault access
- Anyone else → **Developer** — tracked, no vault access

### Step 2: Check Org Gate
Verify the git remote org is `imaginationeverywhere` or `Sliplink-Inc`. If not, WARN that platform features may be limited.

### Step 3: Pull Latest Vault from S3 (Founders Only)
```bash
aws s3 sync s3://auset-brain-vault/ ~/auset-brain/ --quiet 2>/dev/null
```

### Step 4: Show Cross-Project Context (MOST IMPORTANT)
Read and DISPLAY these files:
1. **`~/auset-brain/session-tracker.md`** — Show the last 5-10 session rows. This tells you what Amen Ra was doing in OTHER projects recently.
2. **`~/auset-brain/Daily/`** — Find the most recent daily note file and show its contents. This gives you the full context of the last session.
3. **Current project's recent git log** — `git log --oneline -10` to see recent activity in THIS project specifically.

### Step 5: Check Slack #maat-discuss
```bash
SLACK_TOKEN=$(aws ssm get-parameter --name '/quik-nation/shared/SLACK_BOT_TOKEN' --with-decryption --query 'Parameter.Value' --output text --region us-east-1) && curl -s "https://slack.com/api/conversations.history?channel=C0AKQ8J63CN&limit=5" -H "Authorization: Bearer $SLACK_TOKEN"
```
Summarize any flagged items from Amen Ra.

### Step 6: Read Session Checkpoint
Read `memory/session-checkpoint.md` for this project's last session state. Show what was pending/next from last time.

### Step 7: Show Startup Report
Format and display:
```
SESSION STARTED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Who: Amen Ra (amenray2k)
  Machine: <hostname>
  Project: <project-name>
  Org: <org-name> ✓

  CROSS-PROJECT CONTEXT (last 5 sessions):
  | Date | Machine | Project | What Happened |
  |------|---------|---------|---------------|
  (from session-tracker.md)

  THIS PROJECT (last 10 commits):
  (from git log)

  LAST SESSION NOTES:
  (from most recent Daily note)

  PENDING FROM LAST TIME:
  (from session-checkpoint.md)

  SLACK FLAGS:
  (from #maat-discuss)

  Ready. What are we working on?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## For Developers (Non-Founders)
- Org gate check only
- Their own session history from `~/auset-brain/developers/<username>/sessions/`
- No vault access, no Slack check, no cross-project context
- Log their session start to their tracking directory

## Related Commands
- `/session-end` — Close session, sync vault, update tracker
- `/vault-sync` — Manual vault sync
- `/brain-sync` — Push vault to all channels
