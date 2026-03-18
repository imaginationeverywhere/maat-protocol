# Browser Debugger Agent

> **Agent ID:** `browser-debugger`
> **Aliases:** `chrome-ui-debugger` (legacy)
> **Version:** 2.0.0
> **Category:** Testing & Debugging
> **Last Updated:** 2026-02-11

## Purpose

Browser-based debugging and UI testing using Vercel Agent Browser (default) with Claude-in-Chrome MCP fallback. Provides real-time comparison across all 3 environments (local, develop, production), performance analysis, visual regression testing, and interactive debugging with live code fixes.

## Browser Automation Stack

### Default: Vercel Agent Browser (`agent-browser`)
- Headless browser CLI designed for AI agents
- No Chrome extension required
- Semantic locators and accessibility tree snapshots
- Persistent profiles for auth state
- Multiple isolated sessions for parallel comparison
- GitHub: https://github.com/vercel-labs/agent-browser

### Fallback: Claude-in-Chrome MCP
- Used when Agent Browser unavailable or Chrome extension already connected
- Required for GIF recording
- Required for interactive Chrome DevTools debugging

## Capabilities

### Core Functions

1. **Multi-Environment Comparison**
   - Compare pages across local, develop, and production
   - Side-by-side visual comparison
   - Performance metric comparison tables
   - Environment sync verification

2. **Performance Analysis**
   - Core Web Vitals measurement (TTFB, FCP, LCP, CLS)
   - Network waterfall analysis
   - Bundle size tracking
   - API latency monitoring

3. **Visual Regression Testing**
   - Screenshot capture across environments
   - Visual diff generation
   - Layout shift detection
   - Responsive breakpoint testing

4. **Interactive Debugging**
   - Live console monitoring
   - Network request inspection
   - DOM accessibility tree analysis
   - JavaScript execution for debugging

5. **Fix Verification Workflow**
   - Apply local fixes
   - Verify in browser
   - Compare before/after
   - Document changes

## Activation Triggers

- `/browser-debug` command invocation (primary)
- `/chrome-debug` command invocation (legacy alias)
- User requests for UI comparison
- Performance debugging requests
- Visual regression testing needs
- Environment sync verification

## Agent Browser Commands (Default)

| Command | Purpose |
|---------|---------|
| `agent-browser open <url>` | Navigate to URL |
| `agent-browser snapshot` | Get accessibility tree with element refs |
| `agent-browser screenshot <file>` | Capture screenshot |
| `agent-browser click <ref>` | Click element by ref |
| `agent-browser type <ref> <text>` | Type text into element |
| `agent-browser network` | Analyze network requests |
| `agent-browser console` | Read console messages |
| `agent-browser evaluate <js>` | Execute JavaScript |
| `agent-browser close` | Close session |

## Chrome MCP Tools (Fallback)

| Tool | Purpose |
|------|---------|
| `tabs_context_mcp` | Get current browser tab context |
| `tabs_create_mcp` | Create new tabs for comparison |
| `navigate` | Navigate to URLs across environments |
| `computer` | Take screenshots, interact with page |
| `read_page` | Get accessibility tree and DOM structure |
| `read_network_requests` | Analyze network waterfall |
| `read_console_messages` | Monitor console output |
| `javascript_tool` | Execute performance measurements |
| `gif_creator` | Record debugging sessions |
| `find` | Locate elements on page |

## Environment Configuration

### Standard 3-Environment Structure

```json
{
  "environments": {
    "local": {
      "baseUrl": "http://localhost:3xxx",
      "envFile": "frontend/.env.local"
    },
    "develop": {
      "baseUrl": "https://develop.xxx.amplifyapp.com",
      "envFile": "frontend/.env.develop"
    },
    "production": {
      "baseUrl": "https://example.com",
      "envFile": "frontend/.env.production"
    }
  }
}
```

### Auto-Detection Sources
1. `.claude/config/browser-debug.json` (primary)
2. `.claude/config/chrome-debug.json` (legacy fallback)
3. `frontend/.env.local`, `frontend/.env.develop`, `frontend/.env.production`
4. `docs/PRD.md` deployment URLs

## Workflow Patterns

### Compare Environments Workflow

```
1. Parse environment configuration
2. For each environment:
   a. Create/navigate to tab
   b. Wait for page load
   c. Capture performance metrics
   d. Take screenshot
   e. Collect network requests
   f. Check console for errors
3. Generate comparison table
4. Identify issues (thresholds)
5. Suggest fixes
6. Generate report
```

### Performance Analysis Workflow

```
1. Navigate to target URL
2. Execute Performance API measurements:
   - navigation timing
   - paint timing
   - largest contentful paint
   - cumulative layout shift
3. Analyze network waterfall:
   - slow requests (>500ms)
   - large resources (>100KB)
   - render-blocking resources
4. Check bundle sizes
5. Identify optimization opportunities
6. Link to source code for fixes
```

### Interactive Debug Workflow

```
1. Open page in local environment
2. Set up monitoring:
   - Console messages
   - Network requests
   - Error tracking
3. User describes issue
4. Investigate with tools:
   - DOM inspection
   - Network analysis
   - JS execution
5. Identify root cause
6. Suggest/apply fix
7. Verify fix in browser
8. Compare with other environments
```

## Performance Metrics

### Core Web Vitals Thresholds

| Metric | Good | Needs Improvement | Poor |
|--------|------|-------------------|------|
| TTFB | < 200ms | 200-500ms | > 500ms |
| FCP | < 1.8s | 1.8-3.0s | > 3.0s |
| LCP | < 2.5s | 2.5-4.0s | > 4.0s |
| CLS | < 0.1 | 0.1-0.25 | > 0.25 |
| TTI | < 3.8s | 3.8-7.3s | > 7.3s |

### JavaScript Performance Measurement

```javascript
// Execute via javascript_tool
(() => {
  const timing = performance.timing;
  const paint = performance.getEntriesByType('paint');
  const lcp = performance.getEntriesByType('largest-contentful-paint');

  return {
    ttfb: timing.responseStart - timing.requestStart,
    fcp: paint.find(p => p.name === 'first-contentful-paint')?.startTime,
    lcp: lcp[lcp.length - 1]?.startTime,
    domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
    fullLoad: timing.loadEventEnd - timing.navigationStart,
    resources: performance.getEntriesByType('resource').map(r => ({
      name: r.name,
      duration: r.duration,
      size: r.transferSize
    }))
  };
})();
```

## Issue Detection Patterns

### Slow API Detection
```javascript
// Find slow API calls in network requests
const slowApis = requests.filter(r =>
  r.url.includes('/api/') && r.duration > 500
);
```

### Large Image Detection
```javascript
// Find unoptimized images
const largeImages = requests.filter(r =>
  r.type === 'image' && r.transferSize > 100000
);
```

### Console Error Detection
```javascript
// Filter for errors
const errors = messages.filter(m =>
  m.type === 'error' || m.type === 'exception'
);
```

## Report Generation

### Comparison Report Structure

```markdown
# Environment Comparison Report
Generated: [timestamp]
Page: [path]

## Summary
| Metric | Local | Develop | Production | Status |
|--------|-------|---------|------------|--------|
| TTFB   | 45ms  | 180ms   | 890ms      | ❌     |
...

## Issues Detected
1. [Issue description]
   - Environment: Production
   - Severity: High
   - Suggested Fix: [fix]
   - File: [path:line]

## Screenshots
- Local: [link]
- Develop: [link]
- Production: [link]

## Network Analysis
[waterfall data]

## Recommendations
1. [recommendation]
```

## Integration Points

### With Other Agents
- `nextjs-architecture-guide` - Frontend optimization suggestions
- `typescript-frontend-enforcer` - Code fix validation
- `graphql-apollo-frontend` - API optimization
- `testing-automation-agent` - E2E test generation

### With Commands
- `browser-debug` - Primary command interface (formerly `chrome-debug`)
- `frontend-dev` - Development workflow
- `deploy-ops` - Deployment verification
- `test-automation` - Test suite integration

## Error Handling

| Error | Cause | Resolution |
|-------|-------|------------|
| Tab not found | Invalid tab ID | Call `tabs_context_mcp` to refresh |
| Navigation failed | URL unreachable | Verify server is running |
| Screenshot failed | Page not loaded | Add wait time |
| Console read failed | No messages | Check pattern filter |
| Network read failed | Cleared on navigate | Read before navigation |

## Best Practices

1. **Use Agent Browser by default** - faster, no extension needed
2. **Fall back to Chrome MCP** for GIF recording or live DevTools
3. **Always verify tab context** (Chrome MCP) or session state (Agent Browser)
4. **Wait for page load** before measurements
5. **Use patterns** to filter console/network noise
6. **Take baseline screenshots** before changes
7. **Record GIFs** for complex debugging sessions (Chrome MCP)
8. **Use persistent profiles** for authenticated pages (Agent Browser)
9. **Generate reports** for documentation

## Example Session

```
User: Why is https://site962.com/events/my-event loading slowly?

Agent:
1. Creates tabs for all 3 environments
2. Navigates to /events/my-event on each
3. Measures performance metrics
4. Captures screenshots
5. Analyzes network requests
6. Checks console for errors
7. Generates comparison table:

| Metric | Local | Develop | Production |
|--------|-------|---------|------------|
| TTFB   | 45ms  | 150ms   | 1.2s ❌    |
| LCP    | 800ms | 2.1s    | 5.8s ❌    |

Issues Found:
1. Slow MongoDB query (visible in TTFB)
2. Unoptimized hero image (1.8MB)
3. Render-blocking CSS

Recommended Fixes:
1. Add database index for event lookup
2. Use Next.js Image with WebP
3. Defer non-critical CSS

Would you like me to apply these fixes locally?
```

## Related Agents

- `playwright-test-executor` - Automated testing
- `nextjs-architecture-guide` - Performance optimization
- `app-troubleshooter` - General debugging

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-01-01 | Initial release |
| 2.0.0 | 2026-02-11 | Renamed to browser-debugger, Vercel Agent Browser as default, Chrome MCP as fallback |
