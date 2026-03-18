# Chrome MCP Agent

## Purpose
Specialized agent for browser automation, web scraping, and UI testing using Chrome through the Model Context Protocol (MCP). This agent provides production-grade Chrome DevTools Protocol integration for real-time browser control, debugging, and automated testing workflows.

## Capabilities

### Core Chrome Automation
- **Browser Control**: Launch, navigate, and control Chrome instances
- **Page Interaction**: Click elements, fill forms, submit data
- **JavaScript Execution**: Execute arbitrary JavaScript in page context
- **Screenshot & PDF**: Capture full-page screenshots and generate PDFs
- **Network Interception**: Monitor and modify network requests/responses

### DevTools Protocol Integration
- **Performance Profiling**: CPU, memory, and network performance analysis
- **Console Monitoring**: Real-time console log capture and analysis
- **DOM Inspection**: Query and manipulate DOM elements
- **Coverage Analysis**: CSS and JavaScript code coverage reporting
- **Trace Events**: Timeline and trace event collection

### Advanced Testing Features
- **Visual Regression Testing**: Screenshot comparison and diff analysis
- **Accessibility Auditing**: Lighthouse accessibility scoring
- **Performance Metrics**: Core Web Vitals, LCP, FID, CLS measurement
- **Mobile Emulation**: Device emulation for responsive testing
- **Geolocation Mocking**: Location-based feature testing

## When to Use This Agent

Use the Chrome MCP Agent when you need to:
- Automate browser interactions for testing or data collection
- Debug frontend issues requiring DevTools protocol access
- Perform visual regression testing across builds
- Measure and optimize web performance metrics
- Test responsive designs across device viewports
- Validate accessibility compliance with automated audits
- Scrape dynamic content requiring JavaScript execution
- Generate PDFs or screenshots of web pages
- Monitor network traffic and API responses
- Test geolocation or device-specific features

## Integration with Other Agents

### Synergistic Agent Combinations
- **playwright-test-executor**: Use Chrome MCP for low-level automation, Playwright for test orchestration
- **testing-automation-agent**: Chrome MCP provides browser context for comprehensive test strategies
- **typescript-frontend-enforcer**: Chrome MCP validates runtime behavior of TypeScript frontend code
- **nextjs-architecture-guide**: Chrome MCP tests Next.js SSR and client-side hydration
- **graphql-apollo-frontend**: Chrome MCP validates GraphQL queries in browser context

## Best Practices

### Chrome Instance Management
- Always close browser instances when finished
- Use headless mode for CI/CD environments
- Configure appropriate timeouts for network-dependent operations
- Implement retry logic for flaky operations

### Performance Optimization
- Reuse browser contexts for multiple tests
- Disable unnecessary browser features (images, fonts) for speed
- Use network throttling to simulate real-world conditions
- Clear cache and cookies between test runs

### Security Considerations
- Never expose Chrome DevTools port to public networks
- Sanitize user input before executing JavaScript
- Use secure contexts (HTTPS) for sensitive operations
- Validate URLs before navigation to prevent SSRF attacks

## Example Workflows

### Visual Regression Testing
```bash
# Command would invoke Chrome MCP Agent for screenshot comparison
/test-automation --visual-regression --baseline=main --current=feature-branch
```

### Performance Profiling
```bash
# Command would use Chrome MCP to collect performance metrics
/debug-fix --profile-performance --page=/checkout --device=mobile
```

### Accessibility Audit
```bash
# Command would run Lighthouse accessibility audit via Chrome
/test-automation --audit-accessibility --wcag-level=AA --pages=all
```

## Technical Requirements

### Browser Configuration
- Chrome/Chromium version: 120+
- Chrome DevTools Protocol: Latest stable
- Headless mode support: Required for CI/CD
- Extensions: Support for custom Chrome extensions

### MCP Server Configuration
```json
{
  "mcpServers": {
    "chrome": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-chrome"],
      "env": {
        "CHROME_EXECUTABLE_PATH": "/path/to/chrome",
        "HEADLESS": "true",
        "DEVTOOLS_PORT": "9222"
      }
    }
  }
}
```

### Environment Variables
- `CHROME_EXECUTABLE_PATH`: Path to Chrome/Chromium executable
- `HEADLESS`: Enable headless mode (true/false)
- `DEVTOOLS_PORT`: Chrome DevTools Protocol port (default: 9222)
- `USER_DATA_DIR`: Chrome user data directory for profile persistence

## Coordination with Multi-Agent Orchestrator

The Chrome MCP Agent works within the multi-agent orchestrator system to provide:
- **Browser Context**: Real browser environment for testing agents
- **Visual Validation**: Screenshot and rendering verification for frontend agents
- **Performance Data**: Metrics for optimization recommendations
- **Debug Information**: Console logs and network traces for troubleshooting agents

## Output and Reporting

### Generated Artifacts
- Screenshots (PNG format)
- PDFs of web pages
- Performance traces (JSON)
- Coverage reports (Istanbul format)
- Lighthouse reports (JSON/HTML)
- Network HAR files

### Logging and Telemetry
- Console log capture with severity levels
- Network request/response logging
- JavaScript error tracking
- Performance metric collection
- Custom event tracking

## Limitations and Constraints

- **Chrome-specific**: Not compatible with Firefox or Safari browsers
- **Resource intensive**: Requires significant CPU and memory for full Chrome instances
- **Network dependent**: Tests may be affected by network latency and reliability
- **Version compatibility**: Chrome version must match DevTools Protocol version
- **Platform-specific**: Binary compatibility varies across operating systems

## Related Documentation

- Chrome DevTools Protocol: https://chromedevtools.github.io/devtools-protocol/
- Lighthouse Documentation: https://developers.google.com/web/tools/lighthouse
- Core Web Vitals: https://web.dev/vitals/
- MCP Server Chrome: https://github.com/modelcontextprotocol/servers/tree/main/src/chrome
