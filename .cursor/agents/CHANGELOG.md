# .claude/agents Changelog

## [Unreleased]

### Added
- **Persona-based agent roster** - Replaced task-named agents with persona-named agents (mirrored in `.cursor/agents/`)
  - New agents named after historical figures (e.g. a-philip, harriet, frederick, ida-b-wells, katherine-johnson, maya-angelou, toni, zora)
  - Full set in `.claude/agents/*.md` and `.cursor/agents/*.md` for Claude Code and Cursor IDE

### Removed
- **Legacy task-named agents** - Removed from `.claude/agents/` and `.cursor/agents/`
  - admin-docs-generator, app-troubleshooter, auto-claude-manager, aws-cloud-services-orchestrator, boilerplate-update-manager, browserstack-mcp-agent, business-analyst-bridge, chrome-mcp-agent, chrome-ui-debugger, clerk-auth-enforcer, cloudflare-ai-gateway, code-quality-reviewer, cursor-orchestrator, cursor-sync-manager, dialogue-facilitator, docker-port-manager, document-generator, documentation-sync-manager, domain-brainstormer, express-backend-architect, git-commit-docs-manager, google-analytics-implementation-specialist, graphql-apollo-frontend, graphql-backend-enforcer, graphql-bug-fixer, graphql-validator, i18n-manager, image-processor, mcp-server-manager, multi-agent-orchestrator, mvp-playground-generator, nextjs-architecture-guide, nodejs-runtime-optimizer, plan-mode-orchestrator, platform-sync-manager, playwright-mcp-agent, playwright-test-executor, postgresql-database-architect, pr-merge-manager, product-design-specialist, profile-widget-manager, progress-tracker, project-management-bridge, project-tasks-sync, redux-persist-state-manager, remotion-video-generator, seo-implementation-specialist, sequelize-orm-optimizer, shadcn-ui-specialist, shippo-shipping-integration, slack-bot-notification-manager, stripe-connect-specialist, stripe-subscriptions-specialist, tailwind-design-system-architect, task-orchestrator, testing-automation, twilio-flex-communication-manager, typescript-backend-enforcer, typescript-bug-fixer, typescript-frontend-enforcer, ui-mockup-converter, vibe-coder

### Added (previous)
- **Orchestration & Platform Agents** - Cursor orchestration, dialogue, platform sync, progress, AI gateway, playground
  - **cursor-orchestrator.md** - Orchestrate Cursor Agent CLI across Heru projects
  - **dialogue-facilitator.md** - Research, brainstorm, talk, teach, explore conversations
  - **platform-sync-manager.md** - Sync Auset platform to all Heru projects (`/sync-herus`)
  - **progress-tracker.md** - Progress dashboard and gap analysis
  - **cloudflare-ai-gateway.md** - Cloudflare Workers AI gateway integration
  - **mvp-playground-generator.md** - MVP playground data and UI generation
  - Location: `.claude/agents/` (mirrored in `.cursor/agents/`)

- **remotion-video-generator.md** - Programmatic video creation agent
  - Creates professional videos from natural language descriptions
  - Supports marketing promos, social media content (TikTok, Reels, Shorts)
  - Product demos, data visualizations, and creative productions
  - Integrates with Remotion MCP server for documentation lookup
  - Location: `.claude/agents/remotion-video-generator.md`

- **auto-claude-manager.md** - Auto Claude task management agent
  - Manages task status visibility and transitions across complete task lifecycle
  - Coordinates between Auto Claude automation and manual development work
  - Tracks tasks: Planning → In Progress → AI Review → Human Review → Done
  - Monitors task progress, velocity, and stalled tasks
  - Location: `.claude/agents/auto-claude-manager.md`

- **chrome-ui-debugger.md** - Chrome UI debugging agent
  - Chrome DevTools Protocol integration for browser automation
  - Performance profiling and accessibility audits
  - Cross-environment comparison (local, develop, production)
  - Real-time UI debugging and issue resolution
  - Location: `.claude/agents/chrome-ui-debugger.md`

- **pr-merge-manager.md** - PR merge coordination agent
  - Manages PR creation, review, and merge workflows
  - Coordinates between develop and main branches
  - Automated merge validation and conflict resolution
  - Location: `.claude/agents/pr-merge-manager.md`

- **domain-brainstormer.md** - Domain brainstorming agent
  - AI-powered domain name generation and validation
  - Business model analysis and domain selection guidance
  - Integration with domain registration workflows
  - Location: `.claude/agents/domain-brainstormer.md`

- **stripe-subscriptions-specialist.md** - Stripe subscriptions specialist agent
  - Subscription billing patterns and implementation guidance
  - Recurring payment workflows and subscription lifecycle management
  - Proration, upgrades, downgrades, and cancellation handling
  - Location: `.claude/agents/stripe-subscriptions-specialist.md`

### Changed
- **Agent Documentation Updates** - Comprehensive updates across all 33 agent files
  - Enhanced agent descriptions and usage patterns
  - Improved coordination workflows and integration examples
  - Updated metadata and version information
  - Affected agents: app-troubleshooter, aws-cloud-services-orchestrator, boilerplate-update-manager, business-analyst-bridge, claude-context-documenter, clerk-auth-enforcer, code-quality-reviewer, docker-port-manager, domain-brainstormer, express-backend-architect, git-commit-docs-manager, google-analytics-implementation-specialist, graphql-apollo-frontend, graphql-backend-enforcer, graphql-bug-fixer, i18n-manager, mcp-server-manager, multi-agent-orchestrator, nodejs-runtime-optimizer, plan-mode-orchestrator, playwright-test-executor, postgresql-database-architect, project-management-bridge, redux-persist-state-manager, sequelize-orm-optimizer, shippo-shipping-integration, slack-bot-notification-manager, stripe-connect-specialist, stripe-subscriptions-specialist, testing-automation, twilio-flex-communication-manager, typescript-backend-enforcer, typescript-bug-fixer
  - Location: `.claude/agents/*.md`

- **boilerplate-update-manager.md** - Enhanced boilerplate update management
  - Improved update detection and conflict resolution
  - Enhanced manifest tracking and version management
  - Better integration with update workflows
  - Location: `.claude/agents/boilerplate-update-manager.md`

- **stripe-connect-specialist.md** - Enhanced Stripe Connect patterns
  - Additional marketplace payment patterns
  - Improved multi-tenant payment workflows
  - Better integration with subscription billing
  - Location: `.claude/agents/stripe-connect-specialist.md`

- **Agent Documentation** - Updated agent documentation across all agents
  - Enhanced descriptions and usage patterns
  - Improved coordination workflows
  - Better integration examples

## [1.14.0] - 2025-10-17

### Added
- **chrome-mcp-agent.md** - Chrome DevTools Protocol integration for browser automation, performance profiling, and accessibility audits
- **playwright-mcp-agent.md** - Cross-browser testing agent supporting Chromium, Firefox, and WebKit with visual regression testing
- **browserstack-mcp-agent.md** - Real device cloud testing agent with 3000+ browser/device combinations

### Changed
- **jira-integration-manager.md** → **project-management-bridge.md** - Renamed and expanded to support multiple project management systems (JIRA, Linear, Asana, GitHub Projects)
  - Updated agent name in frontmatter
  - Expanded description to include all supported PM systems
  - Added multi-platform integration examples
  - Maintained backward compatibility with JIRA workflows

### Agent Count
- Total agents: 42 (40 existing + 2 new)
- Browser testing agents: 3 new
- Multi-PM support: 1 enhanced

## [1.13.1] - 2025-10-15

### Changed
- Updated agent metadata and descriptions for improved clarity

## [1.13.0] - 2025-10-14

### Changed
- Documentation improvements and agent description updates
