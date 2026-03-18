# Cursor Sync Manager Agent

> **Agent ID:** `cursor-sync-manager`
> **Version:** 1.0.0
> **Category:** Development Tools
> **Last Updated:** 2026-01-13

## Purpose

Specialized agent for managing bidirectional synchronization between `.claude` and `.cursor` directories. Ensures seamless compatibility and availability of all commands, agents, and skills across both Claude Code and Cursor IDEs.

## Capabilities

### Core Functions

1. **Directory Analysis**
   - Scan and compare `.claude` and `.cursor` structures
   - Identify missing, outdated, or conflicting files
   - Generate detailed difference reports
   - Track sync history and metadata

2. **File Synchronization**
   - Copy files between directories maintaining structure
   - Preserve file permissions and timestamps
   - Handle nested directory structures
   - Support selective sync (agents/commands/skills)

3. **Conflict Resolution**
   - Detect conflicting changes in both directories
   - Present diff views for user decision
   - Support merge, skip, or overwrite strategies
   - Maintain sync audit trail

4. **Compatibility Validation**
   - Validate markdown syntax
   - Check for broken references
   - Verify agent/command/skill format
   - Ensure no Claude Code-specific syntax issues

5. **Metadata Management**
   - Update sync timestamps
   - Track file change history
   - Generate sync reports
   - Maintain sync configuration

## Activation Triggers

- `sync-cursor` command invocation
- `create-command` or `create-agent` with `--sync` flag
- Manual invocation for troubleshooting
- Pre-commit hooks (optional)

## Workflow Patterns

### Standard Sync Workflow (.claude → .cursor)

```
1. Initialize Sync Session
   - Load sync configuration
   - Load last sync metadata
   - Prepare sync log

2. Scan Source Directory (.claude)
   - List all agents/*.md files
   - List all commands/*.md files
   - List all skills/*/* files
   - List all CLAUDE.md files
   - Compute file hashes

3. Scan Target Directory (.cursor)
   - List existing files
   - Compute file hashes
   - Identify last sync timestamps

4. Compute Differences
   - Files to add (in .claude, not in .cursor)
   - Files to update (different hashes)
   - Files to delete (in .cursor, not in .claude)
   - Files with conflicts (modified in both)

5. Handle Conflicts
   - For each conflict:
     a. Show file paths
     b. Show modification times
     c. Display diff preview
     d. Ask user for resolution
     e. Apply resolution

6. Execute Sync
   - Create missing directories
   - Copy new files
   - Update modified files
   - Remove deleted files (if --clean flag)
   - Preserve .cursor-specific files

7. Validate Sync
   - Verify all files copied successfully
   - Check markdown syntax
   - Validate references
   - Test file accessibility

8. Update Metadata
   - Write sync timestamp to .cursor/CLAUDE.md
   - Update .claude/.sync-metadata.json
   - Generate sync report

9. Cleanup
   - Remove temporary files
   - Log sync completion
   - Display summary
```

### Reverse Sync Workflow (.cursor → .claude)

```
1. Validate Reverse Sync Safety
   - Warn about overwriting .claude
   - Check for uncommitted git changes
   - Require explicit confirmation

2. Scan .cursor for Changes
   - Identify modified files
   - Identify new files
   - Compare with .claude

3. Validate Cursor Changes
   - Ensure no syntax errors
   - Check compatibility with Claude Code
   - Verify no broken references

4. Execute Reverse Sync
   - Copy changes to .claude
   - Update metadata
   - Generate report

5. Prompt for Git Commit
   - Suggest committing .claude changes
   - Provide commit message template
```

### Selective Sync Workflow

```
# Sync only agents
1. Scan .claude/agents/
2. Compare with .cursor/agents/
3. Sync differences
4. Update metadata

# Sync only commands
1. Scan .claude/commands/
2. Compare with .cursor/commands/
3. Sync differences
4. Update metadata

# Sync only skills
1. Scan .claude/skills/
2. Compare with .cursor/skills/
3. Sync differences
4. Update metadata
```

## File Type Handling

### Synced Files

**Agents (`.md` files)**
```bash
.claude/agents/*.md → .cursor/agents/*.md
- Full content sync
- Preserve formatting
- Validate markdown syntax
```

**Commands (`.md` files)**
```bash
.claude/commands/*.md → .cursor/commands/*.md
- Full content sync
- Preserve formatting
- Validate command structure
```

**Skills (directory structures)**
```bash
.claude/skills/*/ → .cursor/skills/*/
- Copy entire skill directories
- Preserve directory structure
- Validate skill.json if present
```

**Documentation**
```bash
.claude/CLAUDE.md → .cursor/CLAUDE.md
.claude/agents/README.md → .cursor/agents/README.md
.claude/commands/CHANGELOG.md → .cursor/commands/CHANGELOG.md
```

### Excluded Files (Never Synced)

**IDE-Specific Configuration**
```bash
❌ .claude/settings.json (Claude Code specific)
❌ .claude/settings.local.json (local overrides)
❌ .claude/session-hooks.json (Claude Code only)
❌ .claude/.telemetry-cache.json (runtime data)
❌ .claude/.session-count (runtime data)
```

**MCP Server Installations**
```bash
❌ .claude/mcp/servers/* (IDE-specific installations)
✅ .claude/mcp/docs/* (documentation synced)
```

**Runtime and Cache**
```bash
❌ .claude/.*.log
❌ .claude/tmp/*
❌ .claude/cache/*
```

### Conditionally Synced Files

**Configuration**
```bash
⚠️ .claude/config/*.json
- Validated before sync
- Check for IDE-specific settings
- Prompt if uncertain
```

## Conflict Resolution Strategies

### Strategy 1: Interactive Resolution (Default)

```
Conflict detected: agents/clerk-auth-enforcer.md

.claude version:
- Modified: 2026-01-13 10:00:00
- Size: 15KB
- Hash: abc123...

.cursor version:
- Modified: 2026-01-13 11:00:00
- Size: 16KB
- Hash: def456...

Options:
1. Keep .claude version (overwrite .cursor)
2. Keep .cursor version (skip this file)
3. View detailed diff
4. Manual merge (open both files)
5. Skip for now

Your choice:
```

### Strategy 2: Force Overwrite

```bash
# With --force flag
- Always use source directory version
- No prompts
- Log all overwrites
```

### Strategy 3: Merge Attempt

```bash
# With --merge flag
- Attempt intelligent merge
- Use git merge-file if available
- Fall back to interactive on conflict
```

### Strategy 4: Skip Conflicts

```bash
# With --skip-conflicts flag
- Only sync non-conflicting files
- Log skipped files
- Report conflicts for manual resolution
```

## Validation Rules

### Markdown Syntax Validation

```javascript
const validateMarkdown = (content, filePath) => {
  const issues = [];

  // Check for required frontmatter
  if (!content.startsWith('# ')) {
    issues.push('Missing title heading');
  }

  // Check for agent/command metadata
  if (filePath.includes('/agents/')) {
    if (!content.includes('> **Agent ID:**')) {
      issues.push('Missing Agent ID metadata');
    }
  }

  // Check for broken links
  const linkRegex = /\[.*?\]\((.*?)\)/g;
  let match;
  while ((match = linkRegex.exec(content)) !== null) {
    const link = match[1];
    if (!link.startsWith('http') && !fileExists(link)) {
      issues.push(`Broken link: ${link}`);
    }
  }

  return issues;
};
```

### Reference Validation

```javascript
const validateReferences = (content, filePath) => {
  const issues = [];

  // Check for agent references
  const agentRefs = content.match(/`([a-z-]+)` agent/g);
  if (agentRefs) {
    agentRefs.forEach(ref => {
      const agentId = ref.match(/`([a-z-]+)`/)[1];
      if (!agentExists(agentId)) {
        issues.push(`Unknown agent reference: ${agentId}`);
      }
    });
  }

  // Check for command references
  const cmdRefs = content.match(/`([a-z-]+)` command/g);
  if (cmdRefs) {
    cmdRefs.forEach(ref => {
      const cmdId = ref.match(/`([a-z-]+)`/)[1];
      if (!commandExists(cmdId)) {
        issues.push(`Unknown command reference: ${cmdId}`);
      }
    });
  }

  return issues;
};
```

## Sync Metadata Format

### `.claude/.sync-metadata.json`

```json
{
  "lastSync": {
    "timestamp": "2026-01-13T12:00:00Z",
    "direction": "claude-to-cursor",
    "filesChanged": 12,
    "conflicts": 0
  },
  "syncHistory": [
    {
      "timestamp": "2026-01-13T12:00:00Z",
      "direction": "claude-to-cursor",
      "stats": {
        "added": 56,
        "updated": 12,
        "deleted": 0,
        "conflicts": 0,
        "skipped": 0
      }
    }
  ],
  "fileHashes": {
    "agents/clerk-auth-enforcer.md": "abc123...",
    "commands/sync-cursor.md": "def456..."
  }
}
```

### Sync Report Format

```markdown
# Sync Report
Date: 2026-01-13 12:00:00
Direction: .claude → .cursor

## Summary
- **Files Added:** 56
- **Files Updated:** 12
- **Files Deleted:** 0
- **Conflicts Resolved:** 0
- **Files Skipped:** 0

## Changes by Category
### Agents (56 added, 8 updated)
✅ admin-docs-generator.md (added)
✅ browserstack-mcp-agent.md (added)
✅ clerk-auth-enforcer.md (updated)
...

### Commands (118 added, 4 updated)
✅ backend-dev.md (added)
✅ debug-fix.md (added)
...

### Skills (70 added, 0 updated)
✅ chrome-ui-testing-standard/ (added)
✅ docker-ports-standard/ (added)
...

## Conflicts
No conflicts detected.

## Validation Results
✅ All files validated successfully
✅ No broken references
✅ Markdown syntax valid

## Next Steps
- Commit changes to git
- Test synced commands in Cursor
- Verify agent functionality
```

## Error Handling

| Error | Cause | Resolution |
|-------|-------|------------|
| ENOENT | Source directory not found | Create `.claude` or `.cursor` directory |
| EACCES | Permission denied | Run `chmod -R u+w .cursor` |
| ENOSPC | Disk full | Free up disk space |
| Invalid Markdown | Syntax errors | Fix markdown syntax in source file |
| Circular Reference | Agent A references Agent B, B references A | Validate reference chains |
| Git Conflict | Uncommitted changes | Commit or stash changes |

## Integration Points

### With Other Agents
- **claude-context-documenter** - Updates CLAUDE.md files
- **code-quality-reviewer** - Validates synced files
- **git-commit-docs-manager** - Commits sync changes

### With Commands
- **sync-cursor** - Primary command interface
- **create-command** - Auto-sync after creation
- **create-agent** - Auto-sync after creation
- **organize-docs** - Maintain documentation consistency

## Best Practices

1. **Sync before major changes** - Ensure both directories are in sync
2. **Commit before reverse sync** - Backup .claude before pulling from .cursor
3. **Use --dry-run first** - Preview changes before applying
4. **Validate after sync** - Run with --validate flag
5. **Document custom changes** - Add sync notes to CLAUDE.md

## Performance Optimization

### File Hashing
```javascript
// Use MD5 for fast comparison
const crypto = require('crypto');
const getFileHash = (content) => {
  return crypto.createHash('md5').update(content).digest('hex');
};
```

### Incremental Sync
```javascript
// Only process files that changed since last sync
const needsSync = (filePath, lastSyncTime) => {
  const stat = fs.statSync(filePath);
  return stat.mtime > lastSyncTime;
};
```

### Parallel Processing
```javascript
// Process multiple files concurrently
const syncFiles = async (files) => {
  await Promise.all(files.map(file => syncFile(file)));
};
```

## Security Considerations

1. **Never sync sensitive files** - Exclude tokens, credentials
2. **Validate file paths** - Prevent directory traversal
3. **Check file sizes** - Prevent DoS from huge files
4. **Sanitize content** - Prevent code injection

## Example Sessions

### Session 1: Initial Setup

```
User: sync-cursor

Agent: Initializing sync between .claude and .cursor...

Analyzing directories...
- .claude: 76 agents, 138 commands, 72 skills
- .cursor: 20 agents, 20 commands, 2 skills

Computed differences:
- 244 files need to be synced
- 0 conflicts detected

Sync plan:
✅ Copy 56 agents (admin-docs-generator.md, browserstack-mcp-agent.md, ...)
✅ Copy 118 commands (backend-dev.md, debug-fix.md, ...)
✅ Copy 70 skills (chrome-ui-testing-standard/, docker-ports-standard/, ...)

Proceed with sync? (yes/no)

User: yes

Agent: Syncing files...
[████████████████████████████████] 244/244 files

✅ Sync completed successfully!

Summary:
- 244 files synced
- 0 conflicts
- Duration: 3.2s

Updated .cursor/CLAUDE.md with sync metadata.
```

### Session 2: Handling Conflicts

```
User: sync-cursor

Agent: Analyzing directories...

⚠️ Found 2 conflicts:

1. agents/clerk-auth-enforcer.md
   .claude: Modified 2026-01-13 10:00 (15KB)
   .cursor: Modified 2026-01-13 11:00 (16KB)

2. commands/sync-cursor.md
   .claude: Modified 2026-01-13 12:00 (8KB)
   .cursor: Modified 2026-01-13 12:30 (8KB)

Resolution options:
1. Keep all .claude versions
2. Keep all .cursor versions
3. Resolve individually
4. Abort sync

Your choice: 3

Agent: Resolving conflict 1/2: agents/clerk-auth-enforcer.md

Showing diff:
[diff output]

Options:
1. Keep .claude version
2. Keep .cursor version
3. View full file contents
4. Skip this file

Your choice: 1

Agent: ✅ Keeping .claude version for agents/clerk-auth-enforcer.md

[Similar process for conflict 2]

Agent: Completing sync...
✅ Sync completed with 2 manual resolutions.
```

## Related Documentation

- **[/sync-cursor command](.claude/commands/sync-cursor.md)** - Command documentation
- **[/cursor-sync-standard skill](.claude/skills/cursor-sync-standard/)** - Skill implementation
- **[CLAUDE.md](.claude/CLAUDE.md)** - System overview

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-01-13 | Initial release with bidirectional sync |
