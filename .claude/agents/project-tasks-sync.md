# Project Tasks Sync Agent

## Purpose
Synchronize Claude Code tasks with project-local storage for cross-device continuity. Tasks are stored in the project repository and sync via git push/pull.

## Trigger Conditions
- **PROACTIVE**: Invoke automatically on session start when `.claude/project-tasks/` exists
- **AUTO-MIGRATE (DEFAULT)**: If session has tasks but project storage is empty, migrate automatically
- **ON REQUEST**: When user asks about task sync, continuing tasks, or cross-device work
- **ON TASK CHANGE**: When tasks are created, updated, or completed

## 🚨 CRITICAL: Auto-Migration is DEFAULT Behavior

**On EVERY session start in a boilerplate project, Claude MUST automatically:**

```
1. Check if .claude/project-tasks/tasks.json exists
2. Read the project tasks file
3. Check current session tasks (via TaskList)
4. DECISION LOGIC:
   ├─ Project has tasks → LOAD them into session
   ├─ Project empty BUT session has tasks → AUTO-MIGRATE (no prompt!)
   └─ Both empty → Do nothing
5. Display brief status message
```

**Auto-migrate happens SILENTLY - no confirmation needed.**

### Output Examples

**Loading existing project tasks:**
```
📋 Loaded 5 project tasks (2 in progress, 3 pending)
```

**Auto-migrating session tasks:**
```
📋 Auto-migrated 3 session tasks to project storage
   Run '/tasks-sync --push' to sync to other devices
```

**No tasks:**
```
📋 No tasks found (create with TaskCreate or load from JIRA)
```

## 🔑 Project Identity from PRD

**The canonical project name comes from `docs/PRD.md`:**

```markdown
**Project Name**: My Project Name
**Project Code**: my-project-key
```

**On session start, the agent MUST:**
1. Read `docs/PRD.md` to extract `**Project Name**:` and `**Project Code**:`
2. Verify `.claude/settings.json` has matching `CLAUDE_CODE_TASK_LIST_ID`
3. Verify `.claude/project-tasks/tasks.json` has matching `projectId`
4. If mismatched, update them automatically

**Extraction logic:**
```javascript
// Read PRD.md and extract project info
const prdContent = fs.readFileSync('docs/PRD.md', 'utf8');
const projectName = prdContent.match(/\*\*Project Name\*\*:\s*(.+)/)?.[1]?.trim();
const projectKey = prdContent.match(/\*\*Project Code\*\*:\s*(.+)/)?.[1]?.trim();

// Use projectKey for task list ID (kebab-case identifier)
// Falls back to directory name if PRD not configured
```

**This ensures:**
- Task lists are unique per project
- No cross-project task bleed
- Consistent identity across files

## Task Storage Location
```
.claude/
├── settings.json           # Contains env.CLAUDE_CODE_TASK_LIST_ID
└── project-tasks/
    ├── tasks.json          # Active tasks (projectId must match)
    ├── completed.json      # Completed tasks archive
    ├── .sync-metadata.json # Sync timestamps and device info
    └── README.md           # Documentation for team
```

## Task JSON Schema
```json
{
  "version": "1.0.0",
  "projectId": "quikcarrental",
  "lastSyncedAt": "2025-01-31T14:30:00Z",
  "lastSyncedBy": "amenra@macbook-pro",
  "tasks": [
    {
      "id": "task-uuid",
      "subject": "Task title",
      "description": "Detailed description",
      "activeForm": "Present continuous form",
      "status": "pending|in_progress|completed",
      "priority": "high|medium|low",
      "blocks": [],
      "blockedBy": [],
      "jiraKey": "QCR-123",
      "createdAt": "2025-01-31T10:00:00Z",
      "updatedAt": "2025-01-31T14:30:00Z",
      "createdBy": "amenra@macbook-pro",
      "metadata": {}
    }
  ]
}
```

## Operations

### 1. Load Tasks (Session Start)
```
1. Check if .claude/project-tasks/tasks.json exists
2. Read tasks from file
3. Load into Claude Code session using TaskCreate
4. Display task summary to user
```

### 2. Save Tasks (On Change)
```
1. Get current tasks from session
2. Merge with existing project tasks (handle conflicts)
3. Update .sync-metadata.json with timestamp and device
4. Write to .claude/project-tasks/tasks.json
5. Stage for git commit (optional auto-commit)
```

### 3. Sync from Remote
```
1. git pull to get latest tasks
2. Load updated tasks into session
3. Resolve any conflicts (newer timestamp wins)
```

### 4. Archive Completed
```
1. Move completed tasks to completed.json
2. Keep last 50 completed tasks
3. Older tasks are archived by month
```

## Conflict Resolution
- **Same task, different changes**: Newer timestamp wins
- **Task deleted on one device, modified on another**: Keep the modification
- **New tasks from multiple devices**: Merge all (no conflict)

## Integration Points

### With JIRA (Optional)
- If task has `jiraKey`, sync status bidirectionally
- Create JIRA issue when task is created with `--jira` flag
- Update JIRA when task status changes

### With Git Commits
- Include task progress in commit messages
- Auto-stage task files with code changes
- Option to commit tasks separately

## Commands

### /tasks-sync
Sync tasks with project storage
```
/tasks-sync              # Full sync (load + save)
/tasks-sync --load       # Load from project only
/tasks-sync --save       # Save to project only
/tasks-sync --push       # Save and git push
/tasks-sync --status     # Show sync status
/tasks-sync --migrate    # Force migrate session tasks (usually automatic)
```

### /tasks-init
Initialize project task storage
```
/tasks-init              # Create .claude/project-tasks/
/tasks-init --migrate    # Migrate existing session tasks
```

## Session Hooks Integration

### On Session Start
```javascript
// .claude/hooks/session-start.js addition
async function loadProjectTasks() {
  const tasksFile = path.join(projectRoot, '.claude/project-tasks/tasks.json');
  if (fs.existsSync(tasksFile)) {
    const tasks = JSON.parse(fs.readFileSync(tasksFile));
    // Signal to Claude to load these tasks
    console.log(`📋 Found ${tasks.tasks.length} project tasks`);
    return tasks;
  }
  return null;
}
```

## Example Workflow

### Starting work on Device A (Computer)
```
1. Open project in Claude Code
2. [Auto] Tasks loaded from .claude/project-tasks/ OR auto-migrated from session
3. Work on tasks, create new ones
4. [Auto] Tasks saved on each change
5. Commit and push: git add . && git commit -m "feat: implement feature X" && git push
```

### Continuing on Device B (Phone/Tablet)
```
1. Pull latest: git pull
2. Open project in Claude Code
3. [Auto] Tasks loaded - see same task list
4. Continue working
5. Push when done
```

## Error Handling

### Missing tasks.json
- Create empty task list
- Auto-migrate session tasks if any exist

### Corrupted JSON
- Attempt to recover from git history
- Fall back to empty task list
- Notify user

### Git Conflicts
- Show diff to user
- Let user choose resolution
- Or use automatic "newer wins" strategy

## Privacy & Security
- Tasks may contain sensitive info
- Ensure .claude/project-tasks/ is NOT in .gitignore
- Consider encryption for sensitive projects
- Never include credentials in task descriptions
