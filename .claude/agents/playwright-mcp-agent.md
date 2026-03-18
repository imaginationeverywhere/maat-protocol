# Playwright MCP Agent

## Purpose
Specialized agent for cross-browser end-to-end testing, automation, and web scraping using Playwright through the Model Context Protocol (MCP). This agent provides enterprise-grade browser automation with support for Chromium, Firefox, and WebKit, enabling comprehensive cross-browser testing strategies.

## Capabilities

### Multi-Browser Support
- **Chromium**: Latest Chrome/Edge browser engine
- **Firefox**: Mozilla Firefox browser engine
- **WebKit**: Safari browser engine
- **Mobile Browsers**: Android WebView and Mobile Safari emulation
- **Browser Contexts**: Isolated browser sessions with independent storage

### Advanced Automation Features
- **Auto-waiting**: Intelligent element waiting and retry mechanisms
- **Network Interception**: Request/response modification and mocking
- **Authentication**: Persistent authentication state and session management
- **File Downloads**: Download handling and verification
- **File Uploads**: File input automation and multi-file uploads

### Testing Capabilities
- **Component Testing**: Isolated component testing with mount/unmount
- **Visual Testing**: Screenshot comparison and pixel-perfect validation
- **API Testing**: Direct HTTP request/response testing
- **Trace Viewer**: Time-travel debugging with detailed execution traces
- **Code Generation**: Record interactions and generate test code

### Enterprise Features
- **Parallel Execution**: Multi-worker test parallelization
- **Retries**: Automatic retry mechanism for flaky tests
- **Reporting**: Comprehensive HTML reports with screenshots and videos
- **CI/CD Integration**: Seamless integration with GitHub Actions, CircleCI, Jenkins
- **Docker Support**: Containerized test execution

## When to Use This Agent

Use the Playwright MCP Agent when you need to:
- Execute end-to-end tests across multiple browsers
- Automate complex user workflows with multiple steps
- Test responsive designs across different viewports
- Validate cross-browser compatibility
- Record and replay user interactions
- Debug failing tests with trace viewer
- Generate screenshots and videos of test execution
- Mock API responses for frontend testing
- Test file upload/download functionality
- Validate authentication flows across browsers

## Integration with Other Agents

### Synergistic Agent Combinations
- **playwright-test-executor**: Playwright MCP provides browser contexts for test execution orchestration
- **chrome-mcp-agent**: Use Playwright MCP for cross-browser, Chrome MCP for Chrome-specific features
- **testing-automation-agent**: Playwright MCP executes test strategy defined by automation agent
- **typescript-frontend-enforcer**: Playwright MCP validates TypeScript frontend in real browsers
- **nextjs-architecture-guide**: Playwright MCP tests Next.js applications across all target browsers
- **graphql-apollo-frontend**: Playwright MCP validates GraphQL operations in browser context

## Best Practices

### Test Architecture
- Use Page Object Model (POM) for maintainability
- Implement custom test fixtures for reusable setup/teardown
- Organize tests by feature area and user journey
- Use data-testid attributes for stable element selection
- Avoid XPath selectors when possible

### Performance Optimization
- Run tests in parallel with appropriate worker count
- Use browser contexts instead of full browsers when possible
- Implement test sharding for large test suites
- Cache authentication state to avoid repeated logins
- Use API calls for test data setup instead of UI interactions

### Reliability Patterns
- Use auto-waiting instead of manual waits
- Implement custom retry logic for external dependencies
- Mock network responses for deterministic tests
- Use soft assertions for non-critical validations
- Isolate tests with independent test data

## Example Workflows

### Cross-Browser E2E Testing
```bash
# Command would invoke Playwright MCP Agent for multi-browser testing
/test-automation --cross-browser --browsers=chromium,firefox,webkit --suite=e2e
```

### Visual Regression Testing
```bash
# Command would use Playwright MCP for screenshot comparison
/test-automation --visual-regression --baseline=production --browsers=all
```

### Trace Debugging
```bash
# Command would enable trace collection and open trace viewer
/debug-fix --playwright-trace --test="checkout flow" --show-trace
```

## Technical Requirements

### Browser Binaries
- Chromium: Latest stable (auto-downloaded by Playwright)
- Firefox: Latest stable (auto-downloaded by Playwright)
- WebKit: Latest stable (auto-downloaded by Playwright)
- Mobile browsers: iOS and Android emulation support

### MCP Server Configuration
```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-playwright"],
      "env": {
        "PLAYWRIGHT_BROWSERS_PATH": "${HOME}/.cache/ms-playwright",
        "PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD": "false",
        "PWDEBUG": "0"
      }
    }
  }
}
```

### Environment Variables
- `PLAYWRIGHT_BROWSERS_PATH`: Directory for browser binaries
- `PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD`: Skip automatic browser downloads
- `PWDEBUG`: Enable Playwright Inspector debugging mode
- `PLAYWRIGHT_WORKERS`: Number of parallel workers
- `CI`: Detect CI environment for optimized settings

### Project Configuration
```typescript
// playwright.config.ts
export default {
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
    { name: 'Mobile Safari', use: { ...devices['iPhone 12'] } }
  ]
}
```

## Coordination with Multi-Agent Orchestrator

The Playwright MCP Agent works within the multi-agent orchestrator system to provide:
- **Browser Automation**: Cross-browser execution for comprehensive testing
- **Test Orchestration**: Parallel test execution with worker management
- **Visual Validation**: Screenshot and video evidence for validation agents
- **Trace Data**: Detailed execution traces for debugging agents
- **API Testing**: Direct HTTP testing for backend integration validation

## Output and Reporting

### Generated Artifacts
- HTML test reports with embedded screenshots and videos
- Trace files for time-travel debugging (trace.playwright.dev)
- Screenshots of test failures
- Videos of test execution
- Code coverage reports (with Istanbul integration)
- JUnit XML reports for CI integration

### Test Metrics
- Test pass/fail status
- Execution duration per test
- Browser-specific results
- Retry attempts and outcomes
- Screenshot/video URLs

## Advanced Features

### Network Mocking
```typescript
// Mock API responses
await page.route('**/api/users', route => {
  route.fulfill({
    status: 200,
    body: JSON.stringify([{ id: 1, name: 'Test User' }])
  });
});
```

### Authentication State Persistence
```typescript
// Save authentication state
await page.context().storageState({ path: 'auth.json' });

// Reuse authentication state
const context = await browser.newContext({ storageState: 'auth.json' });
```

### Component Testing
```typescript
// Mount React component for testing
const component = await mount(<MyComponent prop="value" />);
await expect(component).toContainText('Expected text');
```

## Limitations and Constraints

- **Browser Binary Size**: Requires ~1GB disk space for all browser binaries
- **Resource Intensive**: Multiple browser instances consume significant CPU/memory
- **Network Dependent**: Tests may be affected by external API availability
- **Platform Differences**: WebKit behavior may differ from production Safari
- **CI Performance**: Parallel execution limited by available CI resources

## Related Documentation

- Playwright Documentation: https://playwright.dev
- Playwright MCP Server: https://github.com/modelcontextprotocol/servers/tree/main/src/playwright
- Best Practices Guide: https://playwright.dev/docs/best-practices
- Trace Viewer: https://trace.playwright.dev
- CI Integration: https://playwright.dev/docs/ci
