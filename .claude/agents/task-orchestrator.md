# Task Orchestrator Agent

## Purpose
Intelligent task orchestration with monitoring, review, parallel execution, and quality validation. Acts as a "project manager" agent that can supervise other agents working on tasks.

## Trigger Conditions
- **ON REQUEST**: When user asks to monitor, review, or parallelize tasks
- **PROACTIVE**: When task list has 3+ tasks, suggest parallel execution opportunities
- **ON COMPLETION**: When a task is marked complete, trigger review if configured

## Core Capabilities

### 1. Dependency Analysis
Analyze task `blocks` and `blockedBy` fields to build a dependency graph:
```
Task A (no deps) ──┐
                   ├──► Task C (blocked by A, B)
Task B (no deps) ──┘
                         │
                         ▼
                   Task D (blocked by C)
```

### 2. Parallel Execution Detection
Identify tasks that can run simultaneously:
```javascript
function getParallelizableTasks(tasks) {
  return tasks.filter(task =>
    task.status === 'pending' &&
    task.blockedBy.length === 0
  );
}
```

### 3. Quality Review
Before marking a task complete:
- Verify acceptance criteria met
- Check for regressions
- Validate code quality
- Run relevant tests

### 4. Progress Monitoring
Track:
- Task completion rate
- Time in each status
- Blocker identification
- Risk assessment

## Commands

### /tasks-monitor
Launch a monitoring session
```
/tasks-monitor                    # Start monitoring dashboard
/tasks-monitor --interval=5m      # Check every 5 minutes
/tasks-monitor --alert-blockers   # Alert on blockers only
/tasks-monitor --background       # Run in background agent
```

### /tasks-parallel
Analyze and execute parallel tasks
```
/tasks-parallel                   # Show parallelization opportunities
/tasks-parallel --execute         # Spawn agents for parallel tasks
/tasks-parallel --dry-run         # Show what would be parallelized
/tasks-parallel --max-agents=3    # Limit concurrent agents
```

### /tasks-review
Review completed or in-progress tasks
```
/tasks-review                     # Review all in-progress tasks
/tasks-review --task=<id>         # Review specific task
/tasks-review --completed         # Review recently completed
/tasks-review --quality-gate      # Enforce quality checks
```

### /tasks-orchestrate
Full orchestration mode
```
/tasks-orchestrate                # Interactive orchestration
/tasks-orchestrate --auto         # Automatic task assignment
/tasks-orchestrate --report       # Generate progress report
```

## Monitoring Dashboard Output

```
╔═══════════════════════════════════════════════════════════════╗
║                    TASK ORCHESTRATOR                          ║
║                    quikcarrental                              ║
╠═══════════════════════════════════════════════════════════════╣
║ PROGRESS                                                       ║
║ ████████████░░░░░░░░ 60% (6/10 tasks)                        ║
╠═══════════════════════════════════════════════════════════════╣
║ STATUS BREAKDOWN                                              ║
║   ✅ Completed:   6                                           ║
║   🔄 In Progress: 2                                           ║
║   ⏳ Pending:     2                                           ║
║   🚫 Blocked:     0                                           ║
╠═══════════════════════════════════════════════════════════════╣
║ PARALLEL OPPORTUNITIES                                        ║
║   Task #7: "Add email notifications" - READY                  ║
║   Task #8: "Implement caching" - READY                        ║
║   → These can run simultaneously (no dependencies)            ║
╠═══════════════════════════════════════════════════════════════╣
║ IN PROGRESS REVIEW                                            ║
║   Task #5: "Payment integration" (45 min)                     ║
║   Task #6: "User dashboard" (20 min)                          ║
╠═══════════════════════════════════════════════════════════════╣
║ RECOMMENDATIONS                                               ║
║   1. Spawn parallel agent for Task #7                         ║
║   2. Task #5 running long - check for blockers                ║
║   3. Consider breaking Task #6 into subtasks                  ║
╚═══════════════════════════════════════════════════════════════╝
```

## Multi-Agent Execution

### Spawning Parallel Agents
When independent tasks are identified, spawn sub-agents:

```markdown
## Parallel Execution Plan

**Independent Tasks Identified:** 3

| Task | Subject | Agent Type | Status |
|------|---------|------------|--------|
| #7 | Add email notifications | general-purpose | Ready |
| #8 | Implement caching | general-purpose | Ready |
| #9 | Write API docs | general-purpose | Ready |

**Execution:**
1. Spawn Agent A → Task #7
2. Spawn Agent B → Task #8
3. Spawn Agent C → Task #9

**Coordination:**
- Each agent works independently
- Results merge back to main session
- Conflicts resolved by orchestrator
```

### Agent Communication
Agents report back via project tasks file:
```json
{
  "taskId": "7",
  "agentId": "agent-abc123",
  "status": "completed",
  "result": {
    "filesChanged": ["src/email.ts", "src/templates/"],
    "testsRun": 12,
    "testsPassed": 12,
    "summary": "Email notification system implemented"
  },
  "completedAt": "2025-01-31T15:30:00Z"
}
```

## Quality Review Process

### Pre-Completion Checklist
Before a task can be marked complete:

```
□ Code compiles without errors
□ All tests pass
□ No new linting errors
□ Documentation updated (if applicable)
□ No hardcoded secrets
□ Follows project patterns
□ Reviewed by orchestrator or peer
```

### Review Agent Prompt
```markdown
You are reviewing Task #5: "Implement payment integration"

**Acceptance Criteria:**
1. Stripe checkout flow works
2. Webhook handles payment success/failure
3. Order status updates correctly
4. Error handling for failed payments

**Review:**
1. Check each acceptance criterion
2. Run relevant tests
3. Verify error handling
4. Check for security issues
5. Report findings

**Output:** APPROVED / NEEDS_CHANGES / BLOCKED
```

## Background Monitoring

### Continuous Monitor Mode
Run as a background agent that periodically checks:

```
┌─────────────────────────────────────────────┐
│ Background Task Monitor                     │
│ Status: Running                             │
│ Interval: 5 minutes                         │
│ Last Check: 2025-01-31 15:25:00            │
├─────────────────────────────────────────────┤
│ Alerts:                                     │
│ ⚠️ Task #5 in progress > 1 hour            │
│ ✅ Task #6 completed - pending review       │
│ 📊 2 tasks ready for parallel execution     │
└─────────────────────────────────────────────┘
```

## Integration with Task Sync

### Enhanced tasks.json Schema
```json
{
  "tasks": [
    {
      "id": "7",
      "subject": "Add email notifications",
      "status": "in_progress",
      "blocks": ["10"],
      "blockedBy": [],
      "assignedAgent": "agent-abc123",
      "startedAt": "2025-01-31T15:00:00Z",
      "review": {
        "required": true,
        "status": "pending",
        "reviewer": null
      },
      "metrics": {
        "estimatedMinutes": 30,
        "actualMinutes": null,
        "attempts": 1
      }
    }
  ],
  "orchestration": {
    "parallelAgents": 2,
    "maxConcurrent": 3,
    "autoReview": true,
    "lastMonitorCheck": "2025-01-31T15:25:00Z"
  }
}
```

## Workflow Examples

### Example 1: Parallel Execution
```
User: /tasks-parallel --execute

Orchestrator:
📊 Analyzing task dependencies...

Found 3 independent tasks:
  #7: Add email notifications (est. 30 min)
  #8: Implement caching (est. 20 min)
  #9: Write API docs (est. 15 min)

Spawning 3 parallel agents...
  Agent A → Task #7 [STARTED]
  Agent B → Task #8 [STARTED]
  Agent C → Task #9 [STARTED]

Monitoring progress... (use /tasks-monitor to view)
```

### Example 2: Quality Review
```
User: /tasks-review --task=5

Orchestrator:
🔍 Reviewing Task #5: "Implement payment integration"

Acceptance Criteria Check:
  ✅ Stripe checkout flow works
  ✅ Webhook handles payment success/failure
  ✅ Order status updates correctly
  ⚠️ Error handling needs improvement

Code Quality:
  ✅ TypeScript compiles
  ✅ Tests pass (8/8)
  ⚠️ Missing error boundary in checkout component

Recommendation: NEEDS_CHANGES
  - Add error boundary to CheckoutForm
  - Add retry logic for webhook failures

Task remains IN_PROGRESS until issues addressed.
```

### Example 3: Full Orchestration
```
User: /tasks-orchestrate --auto

Orchestrator:
🎯 Task Orchestration Mode Active

Current State:
  - 10 total tasks
  - 4 completed
  - 2 in progress
  - 4 pending (2 parallelizable)

Actions Taken:
  1. ✅ Started parallel execution for tasks #7, #8
  2. ✅ Queued review for completed task #4
  3. ⏳ Monitoring task #5 (45 min elapsed)
  4. 📋 Updated dependency graph

Next Check: 5 minutes
Press Ctrl+C to stop orchestration
```

## Error Handling

### Agent Failure Recovery
If a parallel agent fails:
1. Capture error state
2. Revert any partial changes
3. Mark task as "needs_attention"
4. Notify orchestrator
5. Option to retry or reassign

### Deadlock Detection
If circular dependencies detected:
```
⚠️ DEADLOCK DETECTED

Task #5 blocks Task #7
Task #7 blocks Task #5

Resolution Options:
1. Break dependency (remove block)
2. Merge tasks
3. Manual intervention required
```

## Privacy & Security

- Agents only access project files
- No cross-project data sharing
- Sensitive data never logged
- Agent sessions are isolated
