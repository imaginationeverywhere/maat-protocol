# Auto Claude Manager Agent

> **Agent ID:** `auto-claude-manager`
> **Version:** 1.1.0
> **Category:** Task Management
> **Last Updated:** 2025-12-29

## Purpose

Manages Auto Claude task status visibility and transitions across the complete task lifecycle: Planning → In Progress → AI Review → Human Review → Done. Enables coordination between Auto Claude automation and manual development work, including starting, pausing, returning, and completing tasks.

## Capabilities

### Core Functions

1. **Task Status Tracking**
   - Monitor tasks across all statuses
   - Track status transitions
   - Identify stalled or blocked tasks
   - Calculate velocity and progress metrics

2. **Planning Tasks Management**
   - List tasks not yet started
   - Identify tasks ready for manual work
   - Export tasks for manual implementation
   - Handle task claiming/assignment

3. **In Progress Monitoring**
   - Track active worktrees
   - Monitor commit activity
   - Detect stalled tasks
   - Watch task progress

4. **AI Review Oversight**
   - Monitor automated review results
   - Track test/lint/build status
   - Identify failing reviews
   - Trigger re-runs when needed

5. **Human Review Coordination**
   - Queue management for reviewers
   - Review status tracking
   - Approval/rejection handling
   - Batch operations

6. **Completion Tracking**
   - Record completed tasks
   - Generate progress reports
   - Calculate statistics
   - Mark manual work as done

## Activation Triggers

### Status View Commands
- `/ac-planning` command
- `/ac-in-progress` command
- `/ac-ai-review` command
- `/ac-human-review` command
- `/ac-done` command

### Status Change Commands
- `/ac-start` command
- `/ac-pause` command
- `/ac-return` command
- `/ac-status` command

### General Triggers
- User requests for Auto Claude status
- Requests to take tasks manually
- Requests to change task status
- Progress report requests

## Workflow Patterns

### Task Lifecycle Flow

```
┌──────────┐    ┌─────────────┐    ┌───────────┐    ┌──────────────┐    ┌──────┐
│ Planning │───▶│ In Progress │───▶│ AI Review │───▶│ Human Review │───▶│ Done │
└──────────┘    └─────────────┘    └───────────┘    └──────────────┘    └──────┘
     │                                    │                │
     │ Take for                           │ Fail           │ Request
     │ manual work                        ▼                │ changes
     └─────────────────────────▶ Fix & Retry ◀────────────┘
```

### Status Query Flow

```
1. Receive status query command
2. Identify data sources:
   - .auto-claude/tasks.json
   - GitHub PRs with labels
   - Git worktrees
   - CI/CD status
3. Fetch and aggregate data
4. Categorize by status
5. Generate formatted output
6. Provide actionable recommendations
```

### Manual Takeover Flow

```
1. User identifies task in Planning
2. User runs: /ac-planning --take [ID]
3. Agent:
   - Updates task status to "manual"
   - Creates local todo file
   - Prevents Auto Claude from picking up
   - Notifies team (if configured)
4. User implements manually
5. User creates PR: /create-pr --to develop
6. User marks complete: /ac-done --mark [ID]
```

## Data Sources

### Primary Sources

| Source | Data | Location |
|--------|------|----------|
| Auto Claude Config | Task definitions, status | `.auto-claude/tasks.json` |
| Git Worktrees | Active work, branches | `git worktree list` |
| GitHub PRs | PRs, reviews, status | `gh pr list` |
| GitHub Issues | Issues with labels | `gh issue list` |
| CI/CD | Test/build results | `gh run list`, `gh pr checks` |

### Status Detection

```json
{
  "planning": {
    "sources": ["tasks.json", "github-issues"],
    "indicators": ["status: planning", "label: auto-claude,planning"]
  },
  "in-progress": {
    "sources": ["tasks.json", "worktrees", "github-prs"],
    "indicators": ["active worktree", "draft PR", "label: in-progress"]
  },
  "ai-review": {
    "sources": ["tasks.json", "github-prs", "ci-cd"],
    "indicators": ["PR open", "checks running", "label: ai-review"]
  },
  "human-review": {
    "sources": ["tasks.json", "github-prs"],
    "indicators": ["checks passed", "awaiting review", "label: human-review"]
  },
  "done": {
    "sources": ["tasks.json", "github-prs"],
    "indicators": ["PR merged", "label: done"]
  }
}
```

## Integration Points

### With Project Commands

- **bootstrap-project**: Initial task creation
- **project-mvp-status**: Include Auto Claude metrics
- **project-status**: Post-MVP task tracking
- **process-todos**: Coordinate manual and Auto Claude work

### With PR Commands

- **create-pr**: Create PRs for manual work
- **merge-to-develop**: Merge completed tasks
- **merge-to-main**: Production releases

### With Other Agents

- **pr-merge-manager**: PR lifecycle coordination
- **testing-automation-agent**: Test result analysis
- **multi-agent-orchestrator**: Complex task coordination

## Commands Reference

### Status View Commands

| Command | Purpose | Key Options |
|---------|---------|-------------|
| `/ac-planning` | View planned tasks | `--take`, `--export-for-manual` |
| `/ac-in-progress` | Monitor active work | `--stalled`, `--with-worktrees` |
| `/ac-ai-review` | Track AI reviews | `--failing`, `--rerun` |
| `/ac-human-review` | Manage review queue | `--review`, `--approve` |
| `/ac-done` | View completions | `--stats`, `--report`, `--mark` |

### Status Change Commands

| Command | Purpose | Key Options |
|---------|---------|-------------|
| `/ac-start` | Start working on task | `--create-branch`, `--notes` |
| `/ac-pause` | Pause work on task | `--reason`, `--resume-after` |
| `/ac-return` | Return task to Auto Claude | `--to`, `--progress`, `--notes` |
| `/ac-status` | Change task status directly | `--set`, `--force`, `--history` |

## Configuration

```json
{
  "autoClaudeManager": {
    "configPath": ".auto-claude/tasks.json",
    "stalledThreshold": "24h",
    "defaultReviewers": ["@team-lead"],
    "autoPromote": false,
    "notifications": {
      "slack": false,
      "github": true
    },
    "metrics": {
      "trackVelocity": true,
      "trackCoverage": true
    }
  }
}
```

## Metrics Tracked

- Tasks per status
- Velocity (tasks/day, tasks/week)
- Average time in each status
- Stalled task count
- Rework rate
- Test pass rate
- Code coverage trends
- Review turnaround time

## Error Handling

| Error | Cause | Resolution |
|-------|-------|------------|
| Config not found | No .auto-claude directory | Check project setup |
| Worktree missing | Deleted or corrupted | Re-create worktree |
| PR not found | Deleted or wrong repo | Verify repo context |
| API rate limit | Too many GitHub API calls | Wait and retry |
| Stale data | Cache outdated | Force refresh |

## Best Practices

1. **Check status regularly** - Use commands to stay informed
2. **Take unblocked tasks** - Focus on tasks with no dependencies
3. **Communicate takeovers** - Notify team when taking tasks manually
4. **Mark completions promptly** - Keep status accurate
5. **Review reports** - Use statistics to improve process

## Example Session

```
User: /ac-planning

Agent:
## Auto Claude Planning Tasks

**Total Planning:** 8 tasks
**Ready for Manual:** 5 tasks

| ID | Title | Complexity | Dependencies |
|----|-------|------------|--------------|
| 005 | Form validation | Low | None |
| 007 | Email templates | Low | None |
...

User: /ac-planning --take 005

Agent:
✅ Task #005 claimed for manual implementation
- Created: todo/ac-manual/005-form-validation.md
- Status updated to "manual"

User: (implements task)

User: /create-pr --to develop --title "feat: AC-005 form validation"

User: /ac-done --mark 005

Agent:
✅ Task #005 marked as Done
- Linked to PR #178
- Updated statistics
```

## Related Agents

- `pr-merge-manager` - PR lifecycle management
- `testing-automation-agent` - Test execution
- `plan-mode-orchestrator` - Project planning
- `git-commit-docs-manager` - Commit workflows

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2025-12-29 | Initial release |
