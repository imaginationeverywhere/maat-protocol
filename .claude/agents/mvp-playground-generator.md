# MVP Playground Generator Agent

**Version:** 1.0.0
**Category:** Project Management & Visualization
**Type:** Specialized Agent

---

## Purpose

Analyze any boilerplate project structure and generate/update the MVP Playground dashboard data (`frontend/public/mvp-playground-data.json`). This agent understands the Quik Nation boilerplate conventions and can identify completion status of features from code patterns.

## Capabilities

### 1. Codebase Analysis

- **Frontend Discovery**: Scan `frontend/src/app/` for page.tsx files, identify route groups, sections (public, admin, auth)
- **Backend Discovery**: Scan resolvers, models, services, and middleware for completeness
- **Mobile Discovery**: Scan `mobile/app/` for Expo Router screens and modules
- **TODO Detection**: Find TODO, FIXME, HACK comments across the codebase
- **Pattern Detection**: Identify stub implementations, placeholder code, incomplete features

### 2. Progress Calculation

- **Phase Progress**: Parse MASTER_TASKS.md task statuses to calculate phase completion
- **Component Progress**: Analyze code presence and completeness for each component (auth, payments, etc.)
- **Overall Progress**: Weighted average across all areas
- **Timeline Health**: Compare actual progress against expected milestones

### 3. Data Generation

- **JSON Output**: Generate well-structured `mvp-playground-data.json`
- **Incremental Updates**: Preserve manual overrides while updating automated sections
- **Validation Integration**: Include TypeScript/GraphQL/Database validation results

### 4. Manual Overrides

Supports user-specified completion percentages for components that can't be auto-detected:

```json
{
  "overrides": {
    "Clerk Authentication": { "pct": 85, "notes": "Missing email verification flow" },
    "Stripe Payments": { "pct": 40, "notes": "Checkout flow in progress" }
  }
}
```

Override file location: `frontend/public/mvp-playground-overrides.json`

---

## Activation

This agent is invoked by:

1. **`/project-playground`** command
2. **`/project-mvp-status`** command (final step)
3. **`/project-status`** command (final step)
4. **`/git-commit-docs`** command (step 8.5)
5. Direct invocation: "Generate playground data" or "Update MVP playground"

---

## Analysis Patterns

### Feature Completion Detection

The agent identifies feature completion by checking for:

| Pattern | Indicates |
|---------|-----------|
| `page.tsx` exists in route | Route is implemented |
| Resolver file with query/mutation handlers | Backend endpoint exists |
| Model file with associations | Database layer exists |
| `TODO:` / `FIXME:` comments | Incomplete implementation |
| Empty function bodies / `throw new Error('Not implemented')` | Stub implementation |
| Test files with passing tests | Feature is tested |
| `@clerk/nextjs` imports | Auth is integrated |
| `@stripe/stripe-js` imports | Payments integrated |

### Component Status Mapping

| Code Pattern | Status |
|--------------|--------|
| No files found | `not_started` |
| Files exist but mostly stubs/TODOs | `in_progress` (0-30%) |
| Core logic implemented, some TODOs | `in_progress` (30-70%) |
| Full implementation, needs testing | `in_progress` (70-90%) |
| Tested and documented | `complete` (100%) |

### Blocker Detection

The agent identifies blockers by looking for:
- `BLOCKER:` or `BLOCKED:` comments in code
- Entries in `docs/auto-claude/MVP_BLOCKERS.md`
- Failed validation results (TypeScript errors, GraphQL issues)
- Missing critical dependencies (Clerk, Stripe not configured)

---

## Output Schema

See `scripts/generate-playground-data.js` for the complete JSON schema.

Key sections:
- `phases` - Project phase progress (Foundation, Auth, Core Features, etc.)
- `components` - Individual component status (Clerk, Stripe, Admin Panel, etc.)
- `webPages` - Discovered frontend routes with status
- `mobileModules` - Mobile app module status
- `backendAreas` - Backend resolver/model/service areas
- `backendTodos` - TODO/FIXME/HACK items from code
- `blockers` - Active blockers with severity
- `gaps` - Feature gaps across platforms
- `kanban` - Kanban board items for task tracking
- `validation` - TypeScript/GraphQL/Database validation results

---

## Configuration

The agent reads configuration from:

1. **`package.json`** (root) - Project name, version
2. **`.boilerplate-manifest.json`** - Boilerplate version info
3. **`docs/auto-claude/MASTER_TASKS.md`** - Task definitions and status
4. **`docs/auto-claude/MVP_BLOCKERS.md`** - Blocker registry
5. **`frontend/public/mvp-playground-overrides.json`** - Manual overrides (optional)

---

## Related Agents

- **plan-mode-orchestrator** - Creates the plans that feed into progress tracking
- **business-analyst-bridge** - Provides business context for status reports
- **testing-automation** - Provides test coverage data

---

*This agent is part of the Quik Nation AI Boilerplate Agent System.*
